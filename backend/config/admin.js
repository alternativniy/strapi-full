module.exports = ({ env }) => ({
  url: `${env('PUBLIC_URL')}/admin/`,
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
