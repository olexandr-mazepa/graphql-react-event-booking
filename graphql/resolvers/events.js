const Event = require('../../models/events');
const User = require('../../models/user');
const {transformEvent} = require('./merge')


module.exports = {
  events: async () => {
    const events = await Event.find({})
    return events.map(event => {
      return transformEvent(event);
    });
  },

  createEvent: async (args,req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId
    });
    try {
      const res = await event.save();
      const dbUser = await User.findById(req.userId);
      if (!dbUser) {
        throw new Error('User doesn\'t exists');
      }
      dbUser.createdEvents.push(event);
      await dbUser.save();
      return transformEvent(res);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

};