import axios from 'axios';

export default async (req, res) => {
  const { method, body } = req;
  const url = `https://api.instagram.com/oauth/access_token`;

  switch (method) {
    case 'POST':
      try {
        const response = await axios.post(
          url,
          {
            client_id: body.client_id,
            client_secret: body.client_secret,
            redirect_uri: body.redirect_uri,
            grant_type: 'authorization_code',
            code: body.code,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        console.log(response);
        res.send({
          body,
          response
        });
      } catch (e) {}
      break;
    default:
      res.status(405).json({ status: 405, data: {}, error_message: 'Method Not Allowed!' });
      break;
  }
}
