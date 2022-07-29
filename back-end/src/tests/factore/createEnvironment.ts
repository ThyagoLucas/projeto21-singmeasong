import { faker } from '@faker-js/faker';
import { Recommendation } from '@prisma/client';
import { prisma } from '../../database.js';

export async function createEnvironment() {
	const datas = [
		{
			name: faker.music.songName(),
			youtubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`,
		},

		{
			name: faker.music.songName(),
			youtubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`,

		}, {
			name: faker.music.songName(),
			youtubeLink: `https://www.youtube.com/watch?v=${faker.database.engine()}`,

		} as Recommendation];

	await prisma.recommendation.deleteMany({});
	await prisma.recommendation.createMany({
		data: datas,
	});
}
