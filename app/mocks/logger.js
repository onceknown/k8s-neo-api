'use strict';

const expect = require('expect');

module.exports = function() {
  let mock = {};

  mock.critical = expect.createSpy().andReturn(mock);
  mock.error = expect.createSpy().andReturn(mock);
  mock.warning = expect.createSpy().andReturn(mock);
  mock.info = expect.createSpy().andReturn(mock);
  mock.debug = expect.createSpy().andReturn(mock);

  return mock;
};
