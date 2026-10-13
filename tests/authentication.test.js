const bcrypt = require('bcrypt');
const AuthenticationError = require('../src/commons/exceptions/AuthenticationError');
const InvariantError = require('../src/commons/exceptions/InvariantError');
const AuthenticationService = require('../src/services/AuthenticationService');
const password = require('../src/utils/password');

describe('authentication error handling', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('throws AuthenticationError when the password does not match', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await expect(password.compare('wrong-password', 'hashed-password'))
      .rejects.toBeInstanceOf(AuthenticationError);
  });

  it('rejects an invalid refresh token before checking the token repository', async () => {
    const authenticationRepository = {
      checkTokenAvailability: jest.fn(),
    };
    const authenticationService = new AuthenticationService(null, authenticationRepository);

    await expect(authenticationService.refreshAccessToken('invalid-token'))
      .rejects.toThrow(new InvariantError('refresh token tidak valid'));
    expect(authenticationRepository.checkTokenAvailability).not.toHaveBeenCalled();
  });

  it('throws AuthenticationError when user is not found during getPasswordByUsername', async () => {
    const fakePool = {
      query: jest.fn().mockResolvedValue({ rowCount: 0, rows: [] }),
    };
    const UserRepository = require('../src/repositories/UserRepository');
    const userRepository = new UserRepository(fakePool);

    await expect(userRepository.getPasswordByUsername('nonexistent_user'))
      .rejects.toThrow(new AuthenticationError('kredensial yang Anda masukkan salah'));
  });

  it('throws InvariantError when refresh token is not found in database', async () => {
    const fakePool = {
      query: jest.fn().mockResolvedValue({ rowCount: 0, rows: [] }),
    };
    const AuthenticationRepository = require('../src/repositories/AuthenticationRepository');
    const authenticationRepository = new AuthenticationRepository(fakePool);

    await expect(authenticationRepository.checkTokenAvailability('valid-jwt-not-in-db'))
      .rejects.toThrow(new InvariantError('refresh token tidak valid'));
  });
});
