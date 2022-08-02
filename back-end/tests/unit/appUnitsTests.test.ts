
import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';
import { recommendationService, CreateRecommendationData } from '../../src/services/recommendationsService.js';
import { recommendationRepository } from '../../src/repositories/recommendationRepository.js';


describe('units tests suite', () => {

	it('try insert user', async () => {

		jest.spyOn(recommendationRepository, 'findByName').mockImplementation( () => {
			return null;
		});
		jest.spyOn(recommendationRepository, 'create').mockImplementation(():any => null);

		const toInsert = {} as CreateRecommendationData;
		toInsert.name = faker.music.songName();
		toInsert.youtubeLink =  `https://www.youtube.com/watch?v=${faker.database.engine()}`;
		await recommendationService.insert(toInsert);
		expect(recommendationRepository.create).toBeCalled();

	});

	it('Do not insert a duplicated recommendation',  () => {

		const toInsert = {} as CreateRecommendationData;
		toInsert.name = faker.music.songName();
		toInsert.youtubeLink =  `https://www.youtube.com/watch?v=${faker.database.engine()}`;

		jest.spyOn(recommendationRepository, 'findByName').mockImplementationOnce((): any => true);
   
		const promise = recommendationService.insert(toInsert);
       
		expect(promise).rejects.toEqual({ message: 'Recommendations names must be unique', type: 'conflict' });
	});

	it('try up vote', async () => {
		const recommendation = {
			name: faker.music.songName(),
			youubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`,
			id: 1, score: 0};

		jest.spyOn(recommendationRepository, 'find').mockImplementationOnce((): any => recommendation);
		jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce((): any => {});

		const id = faker.datatype.number({min:1, max:10});

		await recommendationService.upvote(id);
		expect(recommendationRepository.updateScore).toBeCalled();
        
	});
	
	it('try down vote', async () => {

		const recommendation = {
			name: faker.music.songName(),
			youubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`,
			id: 1, score: -6};

		jest.spyOn(recommendationRepository, 'find').mockImplementationOnce((): any => {
			return recommendation;
		});
		jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce((): any => {
			return recommendation;
		});
		jest.spyOn(recommendationRepository, 'remove').mockImplementationOnce((): any => {});

		const id = faker.datatype.number({min:1, max:10});

		await recommendationService.downvote(id);
		
		if(recommendation.score < -5) expect(recommendationRepository.remove).toBeCalled();

		else expect(recommendationRepository.updateScore).toBeCalled();
        
	});

	it('test function getAll', async () => {
		jest.spyOn(recommendationRepository, 'findAll').mockImplementationOnce((): any => {});
		await recommendationService.get();
        
		expect(recommendationRepository.findAll).toBeCalled();

	});
    
	it('try getById test', async () => {

		const id = faker.datatype.number({min:1, max:10});

		jest.spyOn(recommendationRepository, 'find').mockImplementationOnce((): any => true);

		await recommendationService.getById(id);

		expect(recommendationRepository.find).toBeCalled();

	});

	it('try getById when the fail test', async () => {

		const id = faker.datatype.number({min:1, max:10});

		jest.spyOn(recommendationRepository, 'find').mockImplementationOnce((): any => false);

		const promise = recommendationService.getById(id);
        
		expect(promise).rejects.toEqual({ message: '', type: 'not_found' });

	});

	it('try getTop recomendations', async () => {
        
		const number = faker.datatype.number({min:1, max:10});
		jest.spyOn(recommendationRepository, 'getAmountByScore').mockImplementationOnce((): any => {});

		await recommendationService.getTop(number);
		expect(recommendationRepository.getAmountByScore).toBeCalled();

	});

});

