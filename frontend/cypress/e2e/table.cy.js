/// <reference types="Cypress" />

describe('table page', () => {
  context('macbook-16', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      cy.visit('/').then((window) => {
        cy.stub(window, 'fetch')
          .as('fetch')
          .callsFake(() => {});
      });
    });

    it('logo is visible and navigates to homepage on click', () => {
      cy.visit('/');
      cy.get('@fetch').should('have.been.calledOnce');
    });
  });

  context('ipad-2', () => {
    beforeEach(() => {
      cy.viewport('ipad-2');
    });
  });

  context('iphone-x', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
    });
  });
});
