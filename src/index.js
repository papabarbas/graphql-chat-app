import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import session from 'express-session';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import {
  NODE_ENV,
  MONGODB_URI,
  PORT,
  SESS_NAME,
  SESS_SECRET,
  IN_PROD
} from './config';

(async () => {
  try {
    await mongoose.connect(
      MONGODB_URI,
      { dbName: 'chatapp', useNewUrlParser: true }
    );

    const app = express();

    app.disable('x-powered-by');

    app.use(
      session({
        name: SESS_NAME,
        secret: SESS_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 1000 * 60 * 60 * 2,
          sameSite: true,
          secure: IN_PROD
        }
      })
    );
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      cors: false,
      playground: IN_PROD
        ? false
        : {
            settings: {
              'request.credentials': 'include'
            }
          },
      context: ({ req, res }) => ({ req, res })
    });

    server.applyMiddleware({ app });

    app.listen(PORT, () =>
      console.log(
        `Server is listening for connections on http://localhost:${PORT}${
          server.graphqlPath
        }  enviroment: ${NODE_ENV}`
      )
    );
  } catch (err) {
    console.log(err);
  }
})();
