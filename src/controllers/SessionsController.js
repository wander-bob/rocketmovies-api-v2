const {sign} = require("jsonwebtoken");
const {compare} = require("bcryptjs");
const knex = require("../database/knex");
const AppError = require("../middlewares/AppError");
const {secret, expiresIn} = require("../configs/auth").jwt;

class SessionsController {
  async create(request, response){
    try {
      const {email, password} = request.body;
      const user = await knex("users").where({email}).first();
      if(!user){
        throw new AppError("User and/or password invalid", 401);
      }
      const isPasswordValid = await compare(password, user.password);
      if(!isPasswordValid){
        throw new AppError("User and/or password invalid", 401);
      }
      const token = sign({}, secret, {subject: String(user.id), expiresIn});
      return response.json({
        user: {name: user.name, email: user.email, avatar: user.avatar?user.avatar:""},
        token
      })
    } catch (error) {
      console.log(error);
      throw new AppError(error, 401)
    }
  }
}
module.exports = SessionsController;