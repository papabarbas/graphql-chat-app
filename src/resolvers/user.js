import mongoose from 'mongoose';
import Joi from 'joi';
import { User } from '../models';
import { signIn, signUp } from '../schemas';
import { UserInputError } from 'apollo-server-express';
import * as Auth from '../auth';
export default {
  Query: {
    me: (root, args, { req }, info) => {
      // TODO: Proyection
      Auth.checkSignedIn(req);

      return User.findById(req.session.userId);
    },
    users: (root, args, { req }, info) => {
      // TODO: Auth, projection, pagination
      Auth.checkSignedIn(req);
      return User.find({});
    },
    user: async (root, { id }, { req }, info) => {
      Auth.checkSignedIn(req);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError(`${id} is not a valid id`);
      }
      return User.findById(id);
    }
  },

  Mutation: {
    signIn: async (root, args, { req }, info) => {
      const { userId } = req.session;
      if (userId) return User.findById(userId);
      await Joi.validate(args, signIn, { abortEarly: false });
      const user = await Auth.attempSignin(args.email, args.password);
      req.session.userId = user.id;
      return user;
    },
    signUp: async (root, args, { req }, info) => {
      Auth.checkSignedOut(req);
      await Joi.validate(args, signUp, { abortEarly: false });
      const user = await User.create(args);
      req.session.userId = user.id;
      return user;
    },
    signOut: (root, args, { req, res }, info) => {
      Auth.checkSignedIn(req);

      return Auth.signOut(req, res);
    }
  }
};
