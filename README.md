# forum-api-BE

## CI/CD deployment

The `Continuous Integration` workflow runs on pull requests and pushes to
`main` or `master`. `Continuous Deployment` deploys to the VPS over SSH only
after CI succeeds. Configure these repository secrets under
**Settings > Secrets and variables > Actions** before enabling deployments:

- `SERVER_HOST`: public IP address or DNS name of the server.
- `SERVER_USERNAME`: SSH account used to deploy.
- `SERVER_SSH_KEY`: private SSH key for that account (store the key, including
  its header and footer, as a secret).
- `SERVER_PORT`: SSH port; optional, defaults to `22`.

The VPS must have the repository checked out at `~/forum-api`, Node.js/npm,
PM2, and NGINX installed. Provide a reachable PostgreSQL database using the
environment variables described in `.env.example`. The SSH account must be able to run
`sudo cp`, `sudo nginx -t`, and `sudo systemctl reload nginx` without an
interactive password. Configure the PostgreSQL and token environment variables
for the PM2 process on the VPS. NGINX proxies HTTPS for
`34-101-133-113.sslip.io` to port 5000 and limits `/threads` and its descendants
to 90 requests per minute per client IP, with a burst of 20. The corresponding
Let's Encrypt certificate must exist on the VPS before the first deployment.
Keep port 5000 bound to localhost and blocked from public network access so
clients cannot bypass NGINX's rate limit.

The deployment workflow validates required SSH secrets, installs the NGINX
site configuration, validates it, reloads NGINX, applies database migrations,
and restarts the API.
