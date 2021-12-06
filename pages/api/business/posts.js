import Joi from 'joi';
import axios from 'axios';

import validate from '~/lib/middlewares/validate';

const schema = Joi.object({
  igBusinessId: Joi.string().required(),
  fields: Joi.string(),
  limit: Joi.string(),
  accessToken: Joi.string().required(),
});

export default validate({ query: schema }, async (req, res) => {
  const { method, query } = req;
  const { igBusinessId, fields, limit, accessToken } = query;

  switch (method) {
    case 'GET':
      try {
        const baseUrl = `https://graph.facebook.com/v12.0/${igBusinessId}/media`;
        const { data: response } = await axios.get(baseUrl, {
          params: {
            access_token: accessToken,
            fields: fields || 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username,like_count,comments_count',
            limit: limit || 9,
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
