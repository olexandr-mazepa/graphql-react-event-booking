
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  createUser: async args => {
    try {
      const dbUser = await User.findOne({ email: args.userInput.email });
      if (!dbUser) {
        const hashedPass = await bcrypt.hash(args.userInput.password, 12);
        const user = new User({
          email: args.userInput.email,
          password: hashedPass
        });

        const res = await user.save();
        return { ...res._doc, _id: res.id, password: null };
      } else {
        throw new Error('user already exists');
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  login: async ({email, password}) =>{
    try {
      const dbUser = await User.findOne({ email: email });
      if (!dbUser) {
        throw new Error('User doesn\'t exist');
      }
      const isEqual = await bcrypt.compare(password, dbUser.password);
      if (!isEqual) {
        throw new Error('Password is incorrect');
      }
      const token = jwt.sign({
        userId: dbUser.id,
        email: dbUser.email
      }, 'verysecretwordtohashtoken',
      {
        expiresIn: '1h'
      });

      return {
        user: dbUser.id,
        token,
        tokenExpiration: 1
      }
    } catch (error) {
      throw error;
    }
  }
};
