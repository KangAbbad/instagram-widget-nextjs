import Joi from "joi";
import validate from "~/lib/middlewares/validate";

const schema = Joi.object({
  clientId: Joi.string().required(),
  redirectUri: Joi.string().required(),
  state: Joi.string(),
});

export default validate({ query: schema }, (req, res) => {
  const { method, query } = req;
  const { clientId, redirectUri, state = 1738 } = query;

  switch (method) {
    case 'GET':
      const url = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
      res.status(200).json({
        status: 200,
        data: { url },
        error_message: '',
      });
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
