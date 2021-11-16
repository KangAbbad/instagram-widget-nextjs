import axios from 'axios';
import Joi from 'joi';
import validate from '~/lib/middlewares/validate';

const schema = Joi.object({
  client_id: Joi.string().required(),
  client_secret: Joi.string().required(),
  redirect_uri: Joi.string().required(),
  grant_type: Joi.string().required(),
  code: Joi.string().required(),
});

export default validate({ body: schema }, async (req, res) => {
  const { method, body } = req;
  
  switch (method) {
    case 'POST':
      try {
        const url = `https://api.instagram.com/oauth/access_token`;
        const response = await axios({
          method: 'post',
          url,
          data: body,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        res.status(200).json({
          status: 200,
          data: response.data,
          error_message: '',
        });
      } catch (error) {
        const resError = {
          status: 0,
          data: {},
          message: '',
          request: {},
          headers: {},
          config: {},
        };

        if (error.response) {
          resError.status = error.response.status;
          resError.data = error.response.data;
          resError.headers = error.response.headers;
        } else if (error.request) {
          resError.headers = error.request;
        } else {
          resError.message = error.message;
        }

        resError.config = error.config;
    
        res.status(400).json(resError);
      }
      break;
    default:
      res.status(400).json({ status: 405, data: {}, error_message: 'Method Not Allowed!' });
      break;
  }
});
