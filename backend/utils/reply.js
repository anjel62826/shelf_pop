// Every response uses the same shape: { success, message, data }
function reply(res, status, message, data = null) {
  return res.status(status).json({ success: status < 400, message, data });
}

function notFound(req, res) {
  return reply(res, 404, 'Route not found');
}

// Express 5 sends errors from async functions here automatically
function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') return reply(res, 400, 'Request body is not valid JSON');
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    return reply(res, 400, message);
  }
  if (err.code === 11000) return reply(res, 409, 'This record already exists');
  console.error(err);
  return reply(res, 500, 'Something went wrong on the server');
}

module.exports = { reply, notFound, errorHandler };
