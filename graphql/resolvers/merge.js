const Event = require('../../models/events');
const User = require('../../models/user');
const {dateToString} = require('../../helpers/date');

const events = async eventsIds => {
  const events = await Event.find({ _id: { $in: eventsIds } });
  return events.map(event => {
    return transformEvent(event);
  });
};

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  }
  catch (error) {
    throw error;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await Event.findById({ _id: eventId });
    return transformEvent(event);
  } catch (error) {
    throw error
  }
};

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    creator: user.bind(this, event.creator),
    date: dateToString(event._doc.date)
  }
};

const transformBookings = booking =>{
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  }
}

exports.transformEvent = transformEvent;
exports.transformBookings = transformBookings;
// exports.user = user;
// exports.singleEvent = singleEvent;
// exports.transformEvent = transformEvent;