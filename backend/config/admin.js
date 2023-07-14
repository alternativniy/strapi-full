module.exports = ({ env }) => ({
  url: 'http://0.0.0.0:1337/admin/',
  serveAdminPanel: env('NODE_ENV') !== 'production',
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
});
