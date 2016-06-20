'use strict';

const expect = require('expect');

const neoMock = require('../../mocks/neo');
const loggerMock = require('../../mocks/logger');
const responseMock = require('../../mocks/response');
const isOk = require('../../handlers/health').isOk;

describe('handlers/health', () => {

  describe('isOk', () => {

    let neo, logger, res, handler;

    beforeEach(() => {
      neo = neoMock();
      logger = loggerMock();
      res = responseMock();
      handler = isOk(neo, logger);
    });

    it('responds 200 and logs info if neo does not error', () => {
      handler({}, res);

      neo.session.callThen()
        .then(() => {
          expect(logger.info).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.send).toHaveBeenCalledWith('HEALTHY');
          expect(neo.session.close).toHaveBeenCalled();
        });
    });

    it('responds 500 and logs critical if neo errors', () => {
      handler({}, res);

      neo.session.callCatch()
        .then(() => {
          expect(logger.critical).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.send).toHaveBeenCalledWith('UNHEALTHY');
          expect(neo.session.close).toHaveBeenCalled();
        });
    });

  });

});
