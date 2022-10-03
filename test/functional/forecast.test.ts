import { Beach, BeachPosition } from "@src/models/beach";
import nock from "nock";  /** mostra os paramentros da requisição que está sendo feita pra poder usar como teste*/
import stormGlassWeather3HoursFixture from '../fixtures/stormGlass_weather_3_hours.json';
import apiForecastResponse1BeachFixture from '../fixtures/api_forecast_response_1_beach.json';

describe('Beach forecast functional tests', () => {
    beforeEach(async () => {
        await Beach.deleteMany({});
        const defaultBeach = {
            lat: -26.067029,
            lng: -48.608372,
            name: 'Itapoa-terceira-pedra',
            position: BeachPosition.E,
        };
        const beach = new Beach(defaultBeach);
        await beach.save();
    });

    it('should return a forecast with just a few times', async () => {
        // nock.recorder.rec(); /** mostra os paramentros da requisição que está sendo feita  pra poder usar como teste*/
        nock('https://api.stormglass.io:443', {
            encodedQueryParams: true,
            reqheaders: {
                Authorization: (): boolean => true,
            },
        })
            .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
            .get('/v2/weather/point')
            .query({
                lat: '-26.067029',
                lng: '-48.608372',
                params: /(.*)/,
                source: 'noaa',
            })
            .reply(200, stormGlassWeather3HoursFixture);

        const { body, status } = await global.testRequest.get('/forecast');
        expect(status).toBe(200);
        expect(body).toEqual(apiForecastResponse1BeachFixture);
    });

    it('should return 500 if something goes wrong during the processing', async () => {
        nock('https://api.stormglass.io:443', {
          encodedQueryParams: true,
          reqheaders: {
            Authorization: (): boolean => true,
          },
        })
          .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
          .get('/v1/weather/point')
          .query({  lat: '-26.067029', lng: '-48.608372', })
          .replyWithError('Something went wrong');
    
        const { status } = await global.testRequest.get(`/forecast`);
    
        expect(status).toBe(500);
      });
});
