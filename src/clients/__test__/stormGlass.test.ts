import { StormGlass } from "@src/clients/stormGlass";
import axios from 'axios';

jest.mock('axios');

describe('StormGlass client', () => {
     it('should return the normalized forecast from the StormGlass service', async () => {
          const lat = -26.1174;
          const lng = -48.6168;

          axios.get = jest.fn().mockResolvedValue({});

          const stormGlass = new StormGlass(axios);
          const response = await stormGlass.fetchPoints(lat, lng);
          expect(response).toEqual({});
     });
});