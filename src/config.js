export const {
  NODE_ENV,
  MONGODB_URI,
  PORT,
  SESS_NAME,
  SESS_SECRET
} = process.env;

export const IN_PROD = NODE_ENV === 'production';
