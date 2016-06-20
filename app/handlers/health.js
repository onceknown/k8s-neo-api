'use strict';

exports.isOk = function(neo, logger) {
  return (req, res) => {
    const session = neo.session();

    session
      .run(`
        MATCH (a) RETURN a LIMIT 1
      `)
      .then(() => {
        logger.info('Health Checked Successfully');
        res.status(200).send('HEALTHY');
      })
      .catch((err) => {
        logger.critical('Neo4j connection failed', err);
        res.status(500).send('UNHEALTHY');
      })
      .then(() => {
        session.close();
      });
  };
};
