import { StormGlass } from '@src/clients/stormGlass';
import * as stormGlassWeatherPointFixture from '@test/fixtures/stormGlass_weather_3_hours.json'; // importa o JSON com a resposta da requisição para testes
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormGlass_normalized_3_hours.json';
import * as HTTPUtil from '@src/util/request';

jest.mock('@src/util/request');

describe('StormGlass client', () => {

  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  it('should return the normalized forecast from the StormGlass service', async () => {
    const lat = -26.1174;
    const lng = -48.6168;

    mockedRequest.get.mockResolvedValue({ data: stormGlassWeatherPointFixture } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassNormalizedResponseFixture);
  });

  /** exclui os objetos imcompletos da resposta   */
  it('should exclude incomplete data points', async () => {
    const lat = -26.1174;
    const lng = -48.6168;
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-04-26T00:00:00+00:00',
        },
      ],
    };
    mockedRequest.get.mockResolvedValue({ data: incompleteResponse } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });

  /**  retorna um erro generico caso a request tenha algum erro antes de chegar no serviço externo (ex: queda de conexão, etc)*/
  it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    const lat = -26.1174;
    const lng = -48.6168;

    mockedRequest.get.mockRejectedValue({ message: 'Network Error' });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    );
  });

  /** a API tem um limite de 200 requisições diárias, caso seja atingido esse limite, esse erro será retornado. */
  it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    const lat = -26.1174;
    const lng = -48.6168;

    class FakeAxiosError extends Error {
      constructor(public response: object) {
        super();
      }
    }

    /** esse 'o formato do erro retornado pela <API> caso altere, TROCAR */
    mockedRequest.get.mockRejectedValue(
      new FakeAxiosError({
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      })
    );

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      /** esperado que a função de um REJECT e retorne a mensagem abaixo */
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
