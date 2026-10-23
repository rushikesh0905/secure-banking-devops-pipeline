export const notFound = (_req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Resource not found' } });

export const errorHandler = (err, _req, res, _next) => {
  const status = err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: { code: err.code || 'INTERNAL_ERROR', message: status >= 500 ? 'An unexpected error occurred' : err.message }
  });
};

