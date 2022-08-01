import { faker } from '@faker-js/faker';
import { recommendationService, CreateRecommendationData } from './../services/recommendationsService';
import { recommendationRepository } from './../repositories/recommendationRepository.js';

describe('units tests suite', () => {

	it('try insert user', async () => {

		jest.spyOn(recommendationRepository, 'findByName').mockImplementation( () => {
			return null;
		});
		jest.spyOn(recommendationRepository, 'create').mockImplementation();

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

    
});