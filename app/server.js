'use strict';

const fs = require('fs');
const express = require('express');
const neo4j = require('neo4j-driver').v1;
const winston = require('winston');
const cors = require('cors');
const gkeLogger = require('winston-gke');

// Pass when sitting behind load-balancer on a route (e.g. '/neo-app')
const MOUNT_PATH = process.env.MOUNT_PATH || '';

// Initialize app, neo4j connection, and logger
const app = express();
const neo = neo4j.driver(process.env.NEO_ADDRESS || 'bolt://neo4j',
                        neo4j.auth.basic(process.env.NEO_USER || 'neo4j',
                                         process.env.NEO_PASS || 'neo4j'));
const logger = gkeLogger(new winston.Logger());

// Pull version from file if available
let version;

try {
  version = fs.readFileSync('./VERSION', 'utf-8').trim();
} catch (e) {
  version = 'local';
}

// trust the proxies
app.set('trust proxy', true);

// set CORS
app.use(cors());

// Respond 200 at '/' to satisfy backend healthchecks
app.get('/', (req, res) => res.status(200).end());

// set up system info routes
app.get(MOUNT_PATH + '/', require('./handlers/version')(version, logger));
app.get(MOUNT_PATH + '/ok', require('./handlers/health').isOk(neo, logger));

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found'
  });
});

// Shutdown gracefully
process.on('SIGTERM', () => {
  logger.info('Server shutting down.');
  server.close();
  neo.close();
  logger.info('Server is down, goodbye.');
});

// Start it up
const server = app.listen(process.env.PORT || 11235, () => {
  logger.info('Server started.');
});
