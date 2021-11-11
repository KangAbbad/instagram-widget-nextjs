// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Joi from "joi";
import validate from "~/lib/middlewares/validate";

const schema = Joi.object({
  client_id: Joi.string().required(),
  redirect_uri: Joi.string().required(),
});

export default validate({ query: schema }, (req, res) => {
  const { method, query } = req;
  const { client_id, redirect_uri } = query;
  
  switch (method) {
    case 'GET':
      const url = `https://api.instagram.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=user_media,user_profile&response_type=code`;
      res.json({
        status: 200,
        data: { url },
        error_message: '',
      });
      break;
    default:
      res.status(405).json({ status: 405, data: {}, error_message: 'Method Not Allowed!' });
      break;
  }
});
