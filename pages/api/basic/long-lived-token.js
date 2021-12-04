// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import Joi from "joi";
import validate from "~/lib/middlewares/validate";

const schema = Joi.object({
  clientSecret: Joi.string().required(),
  accessToken: Joi.string().required(),
});

export default validate({ body: schema }, async (req, res) => {
  const { method, body } = req;
  const { clientSecret, accessToken } = body;

  switch (method) {
    case 'POST':
      try {
        const url = 'https://graph.instagram.com/access_token';
        const response = await axios.get(url, {
          params: {
            grant_type: 'ig_exchange_token',
            client_secret: clientSecret,
            access_token: accessToken,
          },
          headers: {
            host: 'graph.instagram.com',
          },
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
    
        res.json(resError);
      }
      break;
    default:
      res.status(405).json({ status: 405, data: {}, error_message: 'Method Not Allowed!' });
      break;
  }
});
