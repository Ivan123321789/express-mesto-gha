const { BAD_REQUEST } = require('../utils/responseStatus');

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.type = BAD_REQUEST;
  }
}

module.exports = BadRequest;
