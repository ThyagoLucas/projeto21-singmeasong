/// <reference types='cypress'/>

import { faker } from '@faker-js/faker'; 

let VOTES = null;
let VOTESBEFORE = null;
const BASEURL = 'http://localhost:5000';

describe('AllTestsPage', () => {  

  it('brownsing in the pages', () => {

    cy.visit('http://localhost:3000/');

    cy.get('#top').click();
    cy.url().should('equal','http://localhost:3000/top');

    cy.get('#random').click();
    cy.url().should('equal','http://localhost:3000/random');

    cy.get('#home').click();
    cy.url().should('equal','http://localhost:3000/');
    
  })

  it('try up and down vote', ()=>{

    cy.get('#score' ).invoke('text').then(parseInt).then(($value) =>{
      VOTES = $value;
      cy.get('#downvote').click();

    }).reload();

    cy.get('#score' ).invoke('text').then(parseInt).then(($value_2) =>{
      VOTESBEFORE = $value_2 ;
      expect(VOTESBEFORE).to.eq(VOTES-1);
    });
    
    cy.get('#score' ).invoke('text').then(parseInt).then(($value) =>{
      VOTES = $value;
      cy.get('#upvote').click();

    }).reload();

    cy.get('#score' ).invoke('text').then(parseInt).then(($value_2) =>{

      VOTESBEFORE = $value_2;
      expect(VOTESBEFORE).to.eq(VOTES+1);

    });

  })

  it('create a recommendations', () => {

    const link = `https://www.youtube.com/watch?v=${faker.database.engine()}`;

    cy.get('#addRecommName').type(faker.music.songName());
    cy.get('#addRecommLink').type(link);
    cy.get('#sendRecommendation').click().reload();
    cy.intercept('POST', '/recommendations').as('added')
    
  })

  it('request test api fail', () => {
    const recommendation = {name:faker.music.songName(), youtubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`}
    cy.request('POST', `${BASEURL}/recommendations`, recommendation).then((response) => {
        expect(response.status).to.eq(201);
    });
  });
      
})