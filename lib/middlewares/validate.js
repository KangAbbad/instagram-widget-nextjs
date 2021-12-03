import withJoi from 'next-joi';

export default withJoi({
  onValidationError: (_, res, error) => {
    return res.status(400).json({
      status: 400,
      data: {},
      error_message: error.details.map((error) => error.message),
    });
  },
});
