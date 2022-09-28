import { Beach } from "@src/models/beach";

describe('Beaches functional tests', () => {
    beforeAll(async () => await Beach.deleteMany({})); /** garante que o estado do teste estará limpo, deleta todas as praias do DB */
    describe(' When creating a beach', () => {
        it('should create a beach with success', async () => {
            const newBeach = {
                lat: -26.067029,
                lng: 48.608372,
                name: 'Itapoa-terceira-pedra',
                position: 'E',
            };

            const response = await global.testRequest
                .post('/beaches')
                .send(newBeach); /** cria uma nova praia */
            expect(response.status).toBe(201);
            expect(response.body).toEqual(expect.objectContaining(newBeach)); /** verifica se contem os items newBeach no objeto, nao precisa ser exatamente igual. */
            //expect(response.body).toEqual(newBeach);
        });

        it('should return 422 when there is a validation error', async () => {
          const newBeach = {
            lat: 'invalid_string',
            lng: 151.289824,
            name: 'Itapoa-terceira-pedra',
            position: 'E',
          };
          const response = await global.testRequest.post('/beaches').send(newBeach);
    
          expect(response.status).toBe(422);
          expect(response.body).toEqual({
            error:
              'Beach validation failed: lat: Cast to Number failed for value "invalid_string" at path "lat"',
          });
        });
    
        //it.skip('should return 500 when there is any error other than validation error', async () => {});
    });
});
