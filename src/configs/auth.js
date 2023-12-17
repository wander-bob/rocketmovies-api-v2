module.exports = {
  jwt: {
    secret: process.env.AUTH_TOKEN,
    expiresIn: "1d",
  }
}