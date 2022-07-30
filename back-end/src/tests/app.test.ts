import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import app from '../app.js';
import { createEnvironment } from './factore/createEnvironment.js';
import { prisma } from '../database.js';

beforeEach(async () => {
	await createEnvironment();
});

const RECOMMENDATION = {
	name: faker.music.songName(),
	youtubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`,
};

describe('tests integration suit', () => {

	it('give a test register', async () => {
		const response = await supertest(app).post('/recommendations/').send(RECOMMENDATION);
		expect(response.statusCode).toBe(201);
	});

	it('try same name register', async () => {
		await prisma.recommendation.create({
			data:{name:RECOMMENDATION.name, youtubeLink:RECOMMENDATION.youtubeLink}
		});
		
		const trySameName = await supertest(app).post('/recommendations/').send(RECOMMENDATION);
		expect(trySameName.statusCode).toBe(409);
	});

	it('try with empyt name', async () => {
		const response = await supertest(app).post('/recommendations/').send({name:'', youtubeLink:RECOMMENDATION.youtubeLink});
		expect(response.statusCode).toBe(422);
	});

	it('try register with a link that not be a YT link',async () => {
		const response = await supertest(app).post('/recommendations/').send({name:RECOMMENDATION.name, youtubeLink:'https://www.google.com.br'});
		expect(response.statusCode).toBe(422);
	});

	it('try to vote', async () => {
		const recomendations = await prisma.recommendation.findMany({});

		const response = await supertest(app).post(`/recommendations/${recomendations[0].id}/upvote`);
		const withUpVote = await prisma.recommendation.findFirst({where:{id:recomendations[0].id}});
		
		expect(response.statusCode).toBe(200);
		expect(withUpVote.score).toBe(recomendations[0].score+1);
	});

	it('try to take the vote', async () => {
		const recomendations = await prisma.recommendation.findMany({});

		await prisma.recommendation.update({
			where:{id:recomendations[0].id},
			data:{ score:recomendations[0].score + 1}
		});

		const withAddVote = await prisma.recommendation.findFirst({where:{
			id: recomendations[0].id
		}});
	
		expect(withAddVote.score).toBe(1);
		
		const response = await supertest(app).post(`/recommendations/${recomendations[0].id}/downvote`);
		
		const withRemoveVote = await prisma.recommendation.findFirst({where:{
			id: recomendations[0].id
		}});
		
		expect(withRemoveVote.score).toBe(0);
		expect(response.statusCode).toBe(200);

	});

	it('get last ten recommendations', async () => {

		const recommendations = await supertest(app).get('/recommendations/');

		expect(recommendations.body.length).toBe(10);

	});

	it('get one recommendation', async () => {

		const allRecomendations = await prisma.recommendation.findMany({});
		const recommendation = await supertest(app).get(`/recommendations/${allRecomendations[0].id}`);

		expect(recommendation.statusCode).toBe(200);
		expect(recommendation.body.name).not.toBe(null);
		expect(recommendation.body.score).not.toBe(null);
	});

	it('get top recommendations by amount', async () => {

		const randon = faker.datatype.number({min:2,max:13});
		
		const recommendation = await supertest(app).get(`/recommendations/top/${randon}`);

		// solução de software não documentada = gamby
		recommendation.body[0].score > recommendation.body[1].score ? expect(1).toBe(1):expect(recommendation.body).toBe(null);
		console.log(recommendation.body);

		expect(recommendation.statusCode).toBe(200);
		expect(recommendation.body.length).not.toBe(null);
		expect(recommendation.body.length).toBe(randon);

		
		

	});

	


});

