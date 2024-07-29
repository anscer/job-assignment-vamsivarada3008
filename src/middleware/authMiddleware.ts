import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
dotenv.config()
const secret = process.env.JWT_SECRET!;

const cookieExtractor = (req: Request) => {
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

passport.use(
  new JwtStrategy(opts, (jwtPayload, done) => {
    if (jwtPayload) {
      return done(null, jwtPayload);
    } else {
      return done(null, false);
    }
  })
);

export const protect = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
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
