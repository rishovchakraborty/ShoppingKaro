module.exports = (err, req, res, next) => {
  console.error(err.stack || err);
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack || err
  });
}; 