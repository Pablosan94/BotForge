/// <reference types="Cypress" />

describe('table page', () => {
  context('macbook-16', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      cy.clear_db();
      cy.seed_db();
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

    it('create modal displays and is able to create bot', () => {
      cy.visit('/');
      cy.get('[data-cy="create-bot"]').as('create');
      cy.login();
      cy.get('@create').click();
      cy.get('[data-cy="create-bot-name"]').type('TestBot');
      cy.get('[data-cy="create-bot-description"]').type(
        'Try me out! I can do cool stuff!'
      );
      cy.get('[data-cy="create-bot-base-personality"]').type('enthusiastic');
      cy.get('[data-cy="create-bot-personality-traits"]').type(
        'active,cheerful,happy,energetic'
      );
      cy.get('[data-cy="create-bot-use-case-template"]').type(
        'Customer Support'
      );
      cy.get('[data-cy="create-bot-submit"]').click();
    });

    it('can edit bot data when logged in', () => {
      cy.visit('/');
      cy.login();
      cy.get('[data-cy="table-actions[0]"]').as('actions');
      cy.get('@actions').should('be.visible');
      cy.get('@actions').click();
      cy.get('[data-cy="table-actions-edit[0]"]').as('edit');
      cy.get('@edit').should('be.visible');
      cy.get('@edit').click();
      cy.wait(100);
      cy.get('[data-cy="edit-bot-name"]').clear().type('EditTestBot');
      cy.get('[data-cy="edit-bot-description"]')
        .clear()
        .type('I have edited this description!');
      cy.get('[data-cy="edit-bot-base-personality"]').clear().type('testing');
      cy.get('[data-cy="edit-bot-personality-traits"]')
        .clear()
        .type('test,a,b,c');
      cy.get('[data-cy="edit-bot-use-case-template"]')
        .clear()
        .type('QA Tester');
      cy.get('[data-cy="edit-bot-submit"]').click();
    });

    it('can delete bot when logged in and modal confirmation works as intended', () => {
      cy.visit('/');
      cy.login();
      cy.get('[data-cy="table-actions[0]"]').as('actions');
      cy.get('@actions').should('be.visible');
      cy.get('@actions').click();
      cy.get('[data-cy="table-actions-delete[0]"]').as('delete');
      cy.get('@delete').should('be.visible');
      cy.get('@delete').click();
      cy.get('[data-cy="delete-bot-cancel"]').click();
      cy.get('[data-cy="delete-bot-submit"]').as('delete-bot-submit');
      cy.get('@delete-bot-submit').should('be.visible');
      cy.get('@delete-bot-submit').click();
      cy.contains('Bot deleted successfully!').should('be.visible');
    });
  });
});
