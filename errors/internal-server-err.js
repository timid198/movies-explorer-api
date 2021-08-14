const { SERVER_CODE } = require('../utils/messages');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = SERVER_CODE;
  }
}

module.exports = InternalServerError;
