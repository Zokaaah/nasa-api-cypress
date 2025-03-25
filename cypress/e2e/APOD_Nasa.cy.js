describe('NASA APOD_API Tests', () => {
  const API_KEY = Cypress.env('nasa_api_key') 
  const BASE_URL = Cypress.env('nasa_api_base_url')

  it('Deve retornar a foto do dia com sucesso', () => {
    cy.request({
      method: 'GET',
      url: BASE_URL,
      qs: {
        api_key: API_KEY
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('title');
      if (response.body.media_type === 'image') {
        expect(response.body.url).to.match(/\.(jpg|jpeg|png|gif)$/i);
      } else if (response.body.media_type === 'video') {
        expect(response.body.url).to.match(/youtube\.com|vimeo\.com/i);
      }
    });
  });

  it('Deve falhar sem API key', () => {
    cy.request({
      method: 'GET',
      url: BASE_URL,
      failOnStatusCode: false,
      qs: {} 
    }).then((response) => {
      expect(response.status).to.eq(403);
      expect(response.body).to.have.property('error');
    });
  });

  it('Deve retornar foto específica por data', () => {
    const testDate = '2025-01-01';
    cy.request({
      method: 'GET',
      url: BASE_URL,
      qs: {
        api_key: API_KEY,
        date: testDate
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.date).to.eq(testDate);
      expect(response.body).to.have.property('explanation');
      
      expect(new Date(response.body.date).toISOString()).to.include(testDate);
    });
  });

  
});