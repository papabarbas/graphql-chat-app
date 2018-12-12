import { AuthenticationError } from 'apollo-server-express';
import { User } from './models';
import { SESS_NAME } from './config';

export const attempSignin = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AuthenticationError('No user found');
  }
  if (!(await user.matchesPassword(password))) {
    throw new AuthenticationError('Password incorrect');
  }

  return user;
};

export const signOut = (req, res) =>
  new Promise((resolve, reject) => {
    req.session.destroy(err => {
      if (err) reject(err);

      res.clearCookie(SESS_NAME);
      resolve(true);
    });
  });

export const checkSignedIn = req => {
  if (!req.session.userId) {
    throw new AuthenticationError('You must be signed in');
  }
};

export const checkSignedOut = req => {
  if (req.session.userId) {
    throw new AuthenticationError('You are already signed in');
  }
};
