const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { jwtSecret, googleClientId, googleClientSecret, googleCallbackUrl } = require('./env');

// Debug: log environment variables
console.log('🔍 Environment check:');
console.log('- GOOGLE_CLIENT_ID:', googleClientId ? '✅ Loaded' : '❌ Missing');
console.log('- GOOGLE_CLIENT_SECRET:', googleClientSecret ? '✅ Loaded' : '❌ Missing');
console.log('- GOOGLE_CALLBACK_URL:', googleCallbackUrl ? '✅ Loaded' : '❌ Missing');

if (!googleClientId || !googleClientSecret || !googleCallbackUrl) {
  console.error('❌ Missing Google OAuth credentials - skipping Passport configuration');
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: googleCallbackUrl
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              role: 'user'
            });
          }
          const token = signToken({ id: user._id });
          return done(null, { user, token });
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((obj, done) => done(null, obj));
  passport.deserializeUser((obj, done) => done(null, obj));
}

module.exports = passport;
