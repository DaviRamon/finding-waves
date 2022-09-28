import { StormGlass } from '@src/clients/stormGlass';
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormGlass_normalized_3_hours.json';
import { Beach, BeachPosition, Forecast } from '../forecast';

jest.mock('@src/clients/stormGlass');

describe('Forecast Service', () => {
    const mockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>;
    it('should return the forecast for a list of beaches', async () => {
        /** mock com JEST e corretamente tipado  */
        mockedStormGlassService.fetchPoints.mockResolvedValue(
            stormGlassNormalizedResponseFixture
        );

        const beaches: Beach[] = [
            {
                lat: -26.067029,
                lng: -48.608372,
                name: 'Itapoa-terceira-pedra',
                position: BeachPosition.E,
                user: 'some-id',
            },
        ];
        const expectedResponse = [
            {
                time: '2020-04-26T00:00:00+00:00',
                forecast: [
                    {
                        lat: -26.067029,
                        lng: -48.608372,
                        name: 'Itapoa-terceira-pedra',
                        position: 'E',
                        rating: 1,
                        swellDirection: 64.26,
                        swellHeight: 0.15,
                        swellPeriod: 3.89,
                        time: '2020-04-26T00:00:00+00:00',
                        waveDirection: 231.38,
                        waveHeight: 0.47,
                        windDirection: 299.45,
                        windSpeed: 100,
                    },
                ],
            },

            {
                time: '2020-04-26T01:00:00+00:00',
                forecast: [
                    {
                        lat: -26.067029,
                        lng: -48.608372,
                        name: 'Itapoa-terceira-pedra',
                        position: 'E',
                        rating: 1,
                        swellDirection: 123.41,
                        swellHeight: 0.21,
                        swellPeriod: 3.67,
                        time: '2020-04-26T01:00:00+00:00',
                        waveDirection: 232.12,
                        waveHeight: 0.46,
                        windDirection: 310.48,
                        windSpeed: 100,
                    },
                ],
            },

            {
                time: '2020-04-26T02:00:00+00:00',
                forecast: [
                    {
                        lat: -26.067029,
                        lng: -48.608372,
                        name: 'Itapoa-terceira-pedra',
                        position: 'E',
                        rating: 1,
                        swellDirection: 182.56,
                        swellHeight: 0.28,
                        swellPeriod: 3.44,
                        time: '2020-04-26T02:00:00+00:00',
                        waveDirection: 232.86,
                        waveHeight: 0.46,
                        windDirection: 321.5,
                        windSpeed: 100,
                    },
                ],
            },
        ];
        const forecast = new Forecast(mockedStormGlassService);
        const beachesWithRating = await forecast.processForecastForBeaches(
            beaches
        );
        expect(beachesWithRating).toEqual(expectedResponse);
    });

    it('should return an empty list when the beaches array are empty', async () => {
        const forecast = new Forecast();
        const response = await forecast.processForecastForBeaches([]);
        expect(response).toEqual([]);
    });

    it('should throw internal error when something goes wrong during the rating process', async () => {
        const beaches: Beach[] = [
            {
                lat: -26.067029,
                lng: -48.608372,
                name: 'Itapoa-terceira-pedra',
                position: BeachPosition.E,
                user: 'some-id',
            },
        ];

        mockedStormGlassService.fetchPoints.mockRejectedValue(
            'Error fetching data'
        ); /** espera-se que a req seja rejeitada com um erro */
        const forecast = new Forecast(mockedStormGlassService);
        await expect(
            forecast.processForecastForBeaches(beaches)
        ).rejects.toThrow(Error);
    });
});
