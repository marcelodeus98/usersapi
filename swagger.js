const swaggerUi = require('swagger-ui-express');
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });


// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'User API',
        version: '1.0.0',
        description: 'Creation of a rest api, for user control.',
    },
    servers: [{
        url: 'http://localhost:3000', // Replace with your server URL
        description: 'Development server',
    }],
 };

 const outputFile = './swagger-output.json';
 const endpointsFiles = ['./routes/routes.js'];

// Initialize swagger-jsdoc
swaggerAutogen(outputFile, endpointsFiles, swaggerDefinition).then(() => {
    require('./index');           // Your project's root file
});