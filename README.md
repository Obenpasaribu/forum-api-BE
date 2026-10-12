# forum-api-BE

## CI/CD deployment

The `Continuous Deployment` workflow deploys pushes to `main` or `master` over
SSH. Configure these repository secrets under **Settings > Secrets and
variables > Actions** before enabling deployments:

- `SERVER_HOST`: public IP address or DNS name of the server.
- `SERVER_USERNAME`: SSH account used to deploy.
- `SERVER_SSH_KEY`: private SSH key for that account (store the key, including
  its header and footer, as a secret).
- `SERVER_PORT`: SSH port; optional, defaults to `22`.

The server must have the repository checked out at `~/forum-api`, Node.js/npm,
and PM2 installed. The deployment workflow validates the required secrets
before connecting, so missing configuration is reported before the SSH action
runs.
