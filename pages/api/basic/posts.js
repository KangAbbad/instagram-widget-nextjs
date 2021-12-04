import axios from 'axios';

export default async (req, res) => {
  const { method, query } = req;
  const {
    access_token,
    fields,
    limit,
  } = query;
  
  switch (method) {
    case 'GET':
      try {
        const response = await axios.get('https://graph.instagram.com/me/media', {
          params: {
            fields: fields || 'id, caption, media_url, media_type, likes_count, comments_count, permalink, thumbnail_url, timestamp, username',
            access_token: access_token,
            limit: limit || 9,
          },
          headers: {
            host: 'graph.instagram.com',
          },
        });

        res.status(200).json({
          status: 200,
          data: response.data.data,
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
      res.status(405).json({ status: 405, data: {}, error_message: 'Method Not Allowed!' });
      break;
  }
}