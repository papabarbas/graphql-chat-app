import Joi from 'joi';

const email = Joi.string()
  .email()
  .required()
  .label('Email');
const name = Joi.string()
  .max(254)
  .required()
  .label('Name');
const username = Joi.string()
  .alphanum()
  .min(4)
  .max(30)
  .required()
  .label('Username');
const password = Joi.string()
  .min(5)
  .max(30)
  .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d).*$/)
  .required()
  .label('Password')
  .options({
    language: {
      string: {
        regex: {
          base:
            'must have at least one lowercase letter, one uppercase letter, one digit'
        }
      }
    }
  });

export const signUp = Joi.object().keys({
  email,
  username,
  name,
  password
});

export const signIn = Joi.object().keys({
  email,
  password
});
