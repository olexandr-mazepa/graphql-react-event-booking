const Booking = require('../../models/booking');
const Event = require('../../models/events');
const {transformEvent, transformBookings} = require('./merge');

module.exports = {

  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return transformBookings(booking);
      })
    } catch (error) {
      throw error;
    }
  },

  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    const event = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: req.userId,
      event: event
    })
    const result = await booking.save();
    return transformBookings(result);
  },

  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      console.log('booking',booking.event);
      const event = transformEvent(booking.event);
      await Booking.deleteOne({_id: args.bookingId});
      return event;
    } catch (error) {
      throw error;
    }
  }
};