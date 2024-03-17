/// <reference types="Cypress" />

describe('navigation bar', () => {
  context('macbook-16', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      /* cy.visit('/').then((window) => {
        cy.stub(window, 'fetch')
          .as('fetch')
          .callsFake(() => {});
      }); */
    });

    it('logo is visible and navigates to homepage on click', () => {
      cy.visit('/');
      cy.get('[data-cy="nav-logo"]').as('logo');
      cy.get('@logo').should('be.visible');
      cy.get('@logo').click();
      cy.location('pathname').should('eq', '/');
    });

    it('displays 7 navigation links without being logged in and navigates correctly', () => {
      cy.visit('/');
      cy.get('nav ul li').should('have.length', 7);
      cy.get('[data-cy="nav-dashboard"]').click();
      cy.location('hash').should('eq', '#dashboard');
      cy.get('[data-cy="nav-bot-management"]').click();
      cy.location('pathname').should('eq', '/');
      cy.get('[data-cy="nav-analytics"]').click();
      cy.location('hash').should('eq', '#analytics');
      cy.get('[data-cy="nav-user-management"]').click();
      cy.location('hash').should('eq', '#user-management');
      cy.get('[data-cy="nav-settings"]').click();
      cy.location('hash').should('eq', '#settings');
    });

    it('displays 6 navigation links when logged in', () => {
      cy.visit('/');
      cy.get('[data-cy="login"]').as('login');
      cy.get('@login').should('be.visible');
      cy.get('@login').click();
      cy.get('[data-cy="login-username"]').type('Pablo');
      cy.get('[data-cy="login-password"]').type('Secret12');
      cy.get('[data-cy="login-submit"]').click();
      cy.get('nav ul li').should('have.length', 6);
    });

    it('logs out successfully', () => {
      cy.visit('/');
      cy.get('[data-cy="login"]').as('login');
      cy.get('@login').should('be.visible');
      cy.get('@login').click();
      cy.get('[data-cy="login-username"]').type('Pablo');
      cy.get('[data-cy="login-password"]').type('Secret12');
      cy.get('[data-cy="login-submit"]').click();
      cy.get('@login').should('not.exist');
      cy.get('[data-cy="logout"]').click();
      cy.get('@login').should('be.visible');
    });
  });

  context('ipad-2', () => {
    beforeEach(() => {
      cy.viewport('ipad-2');
    });

    it('nav menu is visible and navigates correctly', () => {
      cy.visit('/');
      cy.get('[data-cy="nav-menu"]').as('menu');
      cy.get('@menu').should('be.visible');
      cy.get('@menu').click();
      cy.get('[data-cy="nav-menu-content"]').should('be.visible');
      cy.get('[data-cy="nav-menu-dashboard"]').click();
      cy.location('hash').should('eq', '#dashboard');
      cy.get('[data-cy="nav-menu-bot-management"]').click();
      cy.location('pathname').should('eq', '/');
      cy.get('[data-cy="nav-menu-analytics"]').click();
      cy.location('hash').should('eq', '#analytics');
      cy.get('[data-cy="nav-menu-user-management"]').click();
      cy.location('hash').should('eq', '#user-management');
      cy.get('[data-cy="nav-menu-settings"]').click();
      cy.location('hash').should('eq', '#settings');
      cy.get('body').click({ force: true });
      cy.get('[data-cy="nav-menu-content"]').should('not.exist');
    });
  });

  context('iphone-x', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
    });

    it('nav menu is visible and navigates correctly', () => {
      cy.visit('/');
      cy.get('[data-cy="nav-menu"]').as('menu');
      cy.get('@menu').should('be.visible');
      cy.get('@menu').click();
      cy.get('[data-cy="nav-menu-content"]').should('be.visible');
      cy.get('[data-cy="nav-menu-dashboard"]').click();
      cy.location('hash').should('eq', '#dashboard');
      cy.get('[data-cy="nav-menu-bot-management"]').click();
      cy.location('pathname').should('eq', '/');
      cy.get('[data-cy="nav-menu-analytics"]').click();
      cy.location('hash').should('eq', '#analytics');
      cy.get('[data-cy="nav-menu-user-management"]').click();
      cy.location('hash').should('eq', '#user-management');
      cy.get('[data-cy="nav-menu-settings"]').click();
      cy.location('hash').should('eq', '#settings');
      cy.get('body').click({ force: true });
      cy.get('[data-cy="nav-menu-content"]').should('not.exist');
    });
  });
});
