// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
  cy.get('[data-cy="login"]').as('login');
  cy.get('@login').should('be.visible');
  cy.get('@login').click();
  cy.get('[data-cy="login-username"]').type('Pablo');
  cy.get('[data-cy="login-password"]').type('Secret12');
  cy.get('[data-cy="login-submit"]').click();
});

Cypress.Commands.add('clear_db', () => {
  cy.task('clearDB');
});

Cypress.Commands.add('seed_db', () => {
  cy.task('seedDB');
});
