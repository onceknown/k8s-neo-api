'use strict';

const expect = require('expect');

var sessionMock = function() {
  let mock = {
    pending: []
  };

  mock.close = expect.createSpy();

  mock.run = function(cypher, params) {
    return new Promise((resolve, reject) => {
      this.pending.push({resolve: resolve, reject: reject});
    });
  };

  mock.callThen = function(results) {
    return new Promise((resolve) => {
      this.pending.shift().resolve(results);
      resolve();
    });
  };

  mock.callCatch = function(err) {
    return new Promise((resolve) => {
      this.pending.shift().reject(err);
      resolve();
    });
  };

  expect.spyOn(mock, 'run').andCallThrough();

  return mock;

};

module.exports = function() {
  let mock = {};

  mock.session = function() {
    mock.session = sessionMock();
    return mock.session;
  };

  return mock;
};
