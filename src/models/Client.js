const Person = require('./Person');

class Client extends Person {
  constructor(userData) {
    super(userData);
    this.role = 'CLIENT';
  }
}

module.exports = Client;
