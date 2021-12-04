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
            client_id: body.clientId,
            client_secret: body.clientSecret,
            redirect_uri: body.redirectUri,
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
        res.status(200).send({
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
