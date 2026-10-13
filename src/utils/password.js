const bcrypt = require('bcrypt');
const AuthenticationError = require('../commons/exceptions/AuthenticationError');

const SALT_ROUNDS = 10;

const hash = async (password) => bcrypt.hash(password, SALT_ROUNDS);

const compare = async (password, hashedPassword) => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  if (!isValid) {
    throw new AuthenticationError('kredensial yang Anda masukkan salah');
  }
};

module.exports = { hash, compare };
