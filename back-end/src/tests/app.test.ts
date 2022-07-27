import supertest from "supertest";
import app from "../app.js";
import { faker } from '@faker-js/faker';
import { createEnvironment } from "./factore/createEnvironment.js";


beforeAll( async ()=>{
    await createEnvironment();
})

const RECOMMENDATION = {
    name: faker.music.songName(),
    youtubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`
}

describe('suit insert recommendations',()=>{

    it('give a test register', async ()=>{
        const response = await supertest(app).post('/recommendations/').send(RECOMMENDATION);
        expect(response.statusCode).toBe(201);
        
    })

    it('try same name register',async ()=>{
        await supertest(app).post('/recommendations/').send(RECOMMENDATION);
        const trySameName = await supertest(app).post('/recommendations/').send(RECOMMENDATION);
        expect(trySameName.statusCode).toBe(409);
    })
})
