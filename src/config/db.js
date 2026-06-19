const { PrismaClient } = require("@prisma/client");

//initialize Prisma client
const prisma = new PrismaClient();

module.exports = prisma;
