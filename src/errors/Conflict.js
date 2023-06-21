const { CONFLICT } = require('../utils/responseStatus');

class Conflict extends Error {
  constructor(message) {
    super(message);
    this.type = CONFLICT;
  }
}

module.exports = Conflict;
