const bcrypt = require("bcryptjs");

const createPassword = async (password) => {
  const hashPassword = await bcrypt.hash(password, 10);
  return hashPassword;
};
const comparePassword = async (password, comparePass) => {
  const comparedPassword = await bcrypt.compare(password, comparePass);
  return comparedPassword;
};

module.exports = { createPassword, comparePassword };
