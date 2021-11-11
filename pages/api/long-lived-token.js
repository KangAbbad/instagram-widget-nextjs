// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import Joi from "joi";
import validate from "~/lib/middlewares/validate";

const schema = Joi.object({
  client_secret: Joi.string().required(),
  access_token: Joi.string().required(),
});

export default validate({ body: schema }, async (req, res) => {
  const { method, body } = req;
  const { client_secret, access_token } = body;
  
  switch (method) {
    case 'POST':
      try {
        const url = 'https://graph.instagram.com/access_token';
        const response = await axios.get(url, {
          params: {
            grant_type: 'ig_exchange_token',
            client_secret,
            access_token,
          },
          headers: {
            host: 'graph.instagram.com',
          },
        });
        res.json({
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
    
        res.json(resError);
      }
      break;
    default:
      res.status(405).json({ status: 405, data: {}, error_message: 'Method Not Allowed!' });
      break;
  }
});
