const {verify} = require("jsonwebtoken");
const AppError = require("./AppError");
const authConfig = require("../configs/auth");
async function ensureAuth(request, response, next){
  const authHeader = request.headers.authorization;
  if(!authHeader){
    throw new AppError("Token não fornecido", 401);
  }
  const [, tokenString] = authHeader.split(" ");
  const token = String(tokenString).replaceAll(`"`, '');
  try {
    const {sub: user_id} = verify(token, authConfig.jwt.secret);
    request.user = {id: user_id};
    return next();
  } catch (error) {
    throw new AppError("Sessão inválida.", 401);
  }
}
module.exports = ensureAuth;