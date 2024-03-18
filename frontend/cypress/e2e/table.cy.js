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

    it('actions unlock or appear when logged in', () => {
      cy.visit('/');
      cy.get('[data-cy="create-bot"]').should('be.disabled');
      cy.login();
      cy.get('[data-cy="create-bot"]').should('be.enabled');
      cy.get('[data-cy="table-actions[0]"]').as('actions');
      cy.get('@actions').should('be.visible');
      cy.get('@actions').click();
      cy.get('[data-cy="table-actions-edit[0]"]').as('edit');
      cy.get('@edit').should('be.visible');
      cy.get('[data-cy="table-actions-delete[0]"]').as('delete');
      cy.get('@delete').should('be.visible');
    });

    it('create modal appears', () => {
      cy.visit('/');
      cy.get('[data-cy="create-bot"]').as('create');
      cy.login();
      cy.get('@create').click();
      cy.get('[data-cy="create-bot-name"]').type('TestBot');
      cy.get('[data-cy="create-bot-description"]').type('Try me out! I can do cool stuff!');
      cy.get('[data-cy="create-bot-base-personality"]').type('enthusiastic');
      cy.get('[data-cy="create-bot-personality-traits"]').type('active,cheerful,happy,energetic');
      cy.get('[data-cy="create-bot-use-case-template"]').type('Customer Support');
      cy.get('[data-cy="create-bot-submit"]').click();
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
