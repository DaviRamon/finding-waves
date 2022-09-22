describe('Beaches functional tests', () => {
   describe(' When creating a beach', () => {
      it('should create a beach with success',async() => {
         const newBeach = {
            lat: -26.067029,
            lng: 48.608372,
            name: 'Itapoa',
            position: 'E',
          };
    
          const response = await global.testRequest.post('/beaches').send(newBeach); /** cria uma nova praia */
          expect(response.status).toBe(201);
          expect(response.body).toEqual(expect.objectContaining(newBeach)); /** verifica se contem os items newBeach no objeto, nao precisa ser exatamente igual. */
          //expect(response.body).toEqual(newBeach); 

      });
   });
});