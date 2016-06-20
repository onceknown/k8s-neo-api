'use strict';

const expect = require('expect');

module.exports = function() {
  const mock = {};

  mock.status = expect.createSpy().andReturn(mock);
  mock.send = expect.createSpy().andReturn(mock);
  mock.json = expect.createSpy().andReturn(mock);
  mock.end = expect.createSpy().andReturn(mock);

  return mock;
};
