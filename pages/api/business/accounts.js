import Joi from 'joi';
import axios from 'axios';

import validate from '~/lib/middlewares/validate';

const schema = Joi.object({
  accessToken: Joi.string().required(),
  fields: Joi.string(),
});

export default validate({ query: schema }, async (req, res) => {
  const { method, query } = req;
  const { accessToken, fields } = query;

  switch (method) {
    case 'GET':
      try {
        const baseUrl = 'https://graph.facebook.com/v12.0/me';
        const { data: response } = await axios.get(baseUrl, {
          params: {
            access_token: accessToken,
            fields: fields || 'id,name,first_name,last_name,short_name,email,accounts',
          },
        });
        res.status(200).json({
          status: 200,
          data: response,
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
    
        res.status(error.response.status).json(resError);
      }
      break;
    default:
      res.status(405).json({
        status: 405,
        data: {},
        error_message: 'Method Not Allowed!',
      });
      break;
  }
});
