describe('Beaches functional tests', () => {
   describe(' When creating a beach', () => {
      it('should create a beach with success',async() => {
         const newBeach = {
            lat: -26.067029,
            lng: 48.608372,
            name: 'Manly',
            position: 'E',
          };
    
          const response = await global.testRequest.post('/beaches').send(newBeach);
          expect(response.status).toBe(201);
          //Object containing matches the keys and values, even if includes other keys such as id.
          expect(response.body).toEqual(expect.objectContaining(newBeach));

      });
   });
});