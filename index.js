const bodyParser = require('body-parser');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json')
const app = express();
const router = require("./routes/routes");
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Server Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes
app.use('/', router);

app.listen(3000,() => {
    console.log("Server is running...");
});
