import { faker } from '@faker-js/faker';
import { Recommendation } from '@prisma/client';
import { prisma } from '../../database.js';

export async function createEnvironment() {
	const datas = [
		{
			name: faker.name.findName(),
			youtubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`,
		},{
			name: faker.name.findName(),
			youtubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`,

		},{
			name: faker.name.findName(),
			youtubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`,

		},{
			name: faker.name.findName(),
			youtubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`,
		},{
			name: faker.name.findName(),
			youtubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`,

		},{
			name: faker.name.findName(),
			youtubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`,

		},{
			name: faker.name.findName(),
			youtubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`,
			score:faker.datatype.number({min:1,max:100})

		},{
			name: faker.name.findName(),
			youtubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`,
			score:faker.datatype.number({min:1,max:100})

		},{
			name: faker.animal.horse(),
			youtubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`,
			score:faker.datatype.number({min:1,max:100})

		},{
			name: faker.name.findName(),
			youtubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`,
			score:faker.datatype.number({min:1,max:100})
		},{
			name: faker.name.findName(),
			youtubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`,
			score:faker.datatype.number({min:1,max:100})
			
		},{
			name: faker.name.findName(),
			youtubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`,
			score: faker.datatype.number({min:1,max:100})

		} as Recommendation];

	await prisma.$executeRaw`TRUNCATE TABLE recommendation`;

	await prisma.recommendation.createMany({
		data: datas
	});

	
}
