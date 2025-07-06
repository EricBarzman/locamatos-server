import bcrypt from "bcryptjs";

const saltRounds = 10;

const makeBCryptPassword = async (password: string) => await bcrypt.hash(password, saltRounds);

const compareBCryptPassword = async (password: string, hashedPassword: string) => await bcrypt.compare(password, hashedPassword);

export { makeBCryptPassword, compareBCryptPassword };