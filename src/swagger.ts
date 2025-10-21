import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'My API',
    description: 'Auto-generated Swagger documentation for Express + TypeScript',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/app.ts'];

const generateSwagger = swaggerAutogen();

generateSwagger(outputFile, endpointsFiles, doc);
