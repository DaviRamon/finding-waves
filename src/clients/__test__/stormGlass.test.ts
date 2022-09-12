import { StormGlass } from "@src/clients/stormGlass";
import axios from 'axios';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json'; // importa o JSON com a resposta da requisição para testes

jest.mock('axios');

describe('StormGlass client', () => {
     it('should return the normalized forecast from the StormGlass service', async () => {
          const lat = -26.1174;
          const lng = -48.6168;

          axios.get = jest.fn().mockResolvedValue(stormGlassWeather3HoursFixture);

          const stormGlass = new StormGlass(axios);
          const response = await stormGlass.fetchPoints(lat, lng);
          expect(response).toEqual({});
     });
});