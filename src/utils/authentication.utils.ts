import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error('Missing SECRET_KEY env value. Please update your .env with it');
}

const generateTokens = (payload: string | object) => {
  const accessToken = jwt.sign(payload, SECRET_KEY, {expiresIn: '1h'});
  const refreshToken = jwt.sign(payload, SECRET_KEY, {expiresIn: '2h'});

  return {
    accessToken,
    refreshToken,
  }
}

const verifyToken = (token: string) => jwt.verify(token, SECRET_KEY, {complete: true});

const AuthenticationUtils = {
  generateTokens,
  verifyToken,
}

export default AuthenticationUtils;
