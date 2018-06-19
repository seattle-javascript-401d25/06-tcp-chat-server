'use strict';

const uuid = require('uuid/v4');

module.exports = class Client {
  constructor(socket) {
    this._id = uuid();
    this.nickname = `Client no. ${this._id}`;
    this.socket = socket;
  }
};
