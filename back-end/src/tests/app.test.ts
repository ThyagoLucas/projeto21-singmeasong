import supertest from "supertest";
import app from "../app.js";
import { faker } from '@faker-js/faker';


beforeAll( async ()=>{

})

const RECOMMENDATION = {
    name: faker.music.songName(),
    youtubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`
}

describe('suit insert recommendations',()=>{

    it('give a test register', async ()=>{
        const response = await supertest(app).post('/recommendations').send(RECOMMENDATION);

        expect(response.statusCode).toBe(201);
        
    })

})
