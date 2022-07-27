import { prisma } from "../../database.js"

export async function createEnvironment(){

    await prisma.recommendation.deleteMany({});

}
