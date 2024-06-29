const LocalStrategy = require('passport-local').Strategy;
const User = require('C:\Users\misch\OneDrive\Desktop\To_Do - Copy\models\User.js');

module.exports = function(passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'No user with that email' });
    }
    if (!user.comparePassword(password)) {
      return done(null, false, { message: 'Password incorrect' });
    }
    return done(null, user);
  }));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));
};
