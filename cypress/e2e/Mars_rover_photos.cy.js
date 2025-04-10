// cypress/e2e/mars_rover.cy.js
describe('NASA Mars Rover Photos', () => {
    const API_KEY = Cypress.env('nasa_api_key')
    const BASE_URL = Cypress.env('mars_rover_url');
  
    it('Deve exibir fotos do Rover Curiosity em uma data específica', () => {
      const earthDate = '2024-1-20'; 
      const camera = 'MAST'; 
  
      cy.request({
        method: 'GET',
        url: BASE_URL,
        qs: {
          earth_date: earthDate,
          camera: camera,
          api_key: API_KEY
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.photos).to.have.length.greaterThan(0);
  
        cy.document().then((doc) => {
          const container = doc.createElement('div');
          container.style.display = 'grid';
          container.style.gridTemplateColumns = 'repeat(3, 1fr)';
          container.style.gap = '10px';
          container.style.padding = '20px';
          doc.body.appendChild(container);
  
          response.body.photos.slice(0, 9).forEach((photo) => {
            const img = doc.createElement('img');
            img.src = photo.img_src;
            img.style.width = '100%';
            img.style.border = '2px solid #ddd';
            img.alt = `Rover Curiosity - ${photo.earth_date} (ID: ${photo.id})`;
            container.appendChild(img);
  
            cy.wrap(img).should('be.visible').and('have.attr', 'src');
          });
  
          const title = doc.createElement('h3');
          title.textContent = `Fotos Rover Curiosity (${earthDate}) - Câmera: ${camera}`;
          title.style.textAlign = 'left';
          title.style.fontFamily = 'Arial, sans-serif';
          doc.body.prepend(title);
        });
      });
    });
  });