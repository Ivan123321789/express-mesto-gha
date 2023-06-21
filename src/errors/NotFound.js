const { NOT_FOUND } = require('../utils/responseStatus');

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.type = NOT_FOUND;
  }
}

module.exports = NotFound;
