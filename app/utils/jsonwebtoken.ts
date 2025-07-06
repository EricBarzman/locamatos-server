import jwt from 'jsonwebtoken';

export function createJSONWebToken(id: string, email: string) {
  return jwt.sign({ id, email }, process.env.JWT_SECRET!, { expiresIn: "5h"})
}

export function verifyJSONWebToken() { }