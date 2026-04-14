const log = {
  info: (msg) => console.log(`[${new Date().toISOString()}] [INFO]  ${msg}`),
  success: (msg) => console.log(`[${new Date().toISOString()}] [SUCCESS] ${msg}`),
  error: (msg) => console.error(`[${new Date().toISOString()}] [ERROR] ${msg}`),
};

module.exports = log;