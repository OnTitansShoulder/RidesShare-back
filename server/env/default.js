module.exports = {
  db: {
    uri: process.env.MONGO_URI || 'mongodb://localhost/ridesshare'
  },
  secret: 'default secret for all local users',
  port: process.env.PORT || 3334,
  host: process.env.HOST || '0.0.0.0'
};
