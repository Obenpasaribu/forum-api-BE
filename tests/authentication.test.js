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
});
