import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
const secret = 'your_jwt_secret';
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};
const opts = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: secret,
};
passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    if (jwtPayload) {
        return done(null, jwtPayload);
    }
    else {
        return done(null, false);
    }
}));
export const protect = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.user = user;
        next();
    })(req, res, next);
};
