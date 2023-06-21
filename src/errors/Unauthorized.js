const { UNAUTHORIZED } = require('../utils/responseStatus');
class Unauthorized extends Error {
    constructor(message) {
      super(message);
      this.type = UNAUTHORIZED;
    }
  }
  
  module.exports = Unauthorized;