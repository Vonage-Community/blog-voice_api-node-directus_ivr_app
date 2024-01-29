import dotenv from 'dotenv';
dotenv.config();

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import RouteLoader from './src/RouteLoader.js';

const expressPort = process.env.PORT || process.env.NERU_APP_PORT || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

const routes = await RouteLoader('./src/routes/**/*.js');
app.use('/', routes);

app.listen(expressPort, () => {
    console.log(`Listening on ${expressPort}`);
});