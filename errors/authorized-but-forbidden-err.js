const { AUTHORIZED_BUT_FORBIDDEN_CODE } = require('../utils/messages');

class AuthorizedButForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = AUTHORIZED_BUT_FORBIDDEN_CODE;
  }
}

module.exports = AuthorizedButForbiddenError;
