const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");
const { verify } = require("jsonwebtoken");

function enssureAuthenticated(request, response, next){
  const authHeader = request.headers.authorization;

  if(!authHeader){
    throw new AppError("JWT token não informado", 401);
  }

  const [, token] = authHeader.split(" ");

  try{
   const { sub: user_id } = verify(token, authConfig.jwt.secret);

   request.user = {
    id: Number(user_id)
   };

   return next()
  }catch{
    throw new AppError("JWT token Inválido", 401)
  };
};

module.exports = enssureAuthenticated;