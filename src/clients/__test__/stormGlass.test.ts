import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
import * as stormGlassWeatherPointFixture from '@test/fixtures/stormGlass_weather_3_hours.json'; // importa o JSON com a resposta da requisição para testes
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormGlass_normalized_3_hours.json';

jest.mock('axios');

describe('StormGlass client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  it('should return the normalized forecast from the StormGlass service', async () => {
    const lat = -26.1174;
    const lng = -48.6168;

    mockedAxios.get.mockResolvedValue({ data: stormGlassWeatherPointFixture });

    const stormGlass = new StormGlass(axios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassNormalizedResponseFixture );
  });
});
