'use strict';

const expect = require('expect');

const loggerMock = require('../../mocks/logger');
const responseMock = require('../../mocks/response');
const version = require('../../handlers/version');

describe('handlers/version', () => {

  let v, logger, res, handler;

  beforeEach(() => {
    v = '123';
    logger = loggerMock();
    res = responseMock();
    handler = version(v, logger);
  });

  it('responds 200 with version json and logs notice ', () => {
    handler({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.calls[0].arguments[0].version).toBe(v);
  });

});
