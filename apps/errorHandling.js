const errorHandling = (err, req, res, next) => {
  const statusCode = res.statusCode || 500;
  res.status(statusCode);
  res.json({
    message: err.message,
  });
};

module.exports = errorHandling;
