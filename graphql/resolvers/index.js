const auth = require('./auth');
const events = require('./events');
const booking = require('./booking');

const rootResolver = {
  ...auth,
  ...events,
  ...booking
};


module.exports = rootResolver;