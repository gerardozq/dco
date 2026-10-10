# DCO React starter

A sample React + TypeScript frontend built with Vite. Includes an interactive
launch checklist, a production Docker image served by Nginx, and GitHub Actions
publishing to GitHub Container Registry (GHCR).

## Local development

Use Node.js 22.12+ (Node 22 is used in CI and Docker).

```sh
cd frontend
npm ci
npm run dev
```

Open the URL printed by Vite. The checklist is demo-only, resets on reload, and
does not query the registry. No backend or registry credentials are required to
run the app.

```sh
npm run lint
npm test
npm run build
npm run preview
```

## Run the production container

From the repository root:

```sh
docker build -t dco-frontend ./frontend
docker run --rm -p 8080:80 dco-frontend
```

Open http://localhost:8080. `/health` returns HTTP 200; frontend routes fall back
to the app entry point. Hashed assets are cached; the entry point is not.

## Publish to GHCR

The [workflow](.github/workflows/publish-ghcr.yml) runs lint, tests, and a build on
pull requests and pushes to `main`. After validation, pushes to `main` publish a
Linux AMD64 image tagged with the full Git commit SHA. You can also run
**Validate and publish frontend to GHCR** manually on `main` from the Actions tab.
Pull requests do not log in to GHCR or publish images.

Publishing uses the automatic `GITHUB_TOKEN`, with `packages: write` permission
only in the publish job. No personal access token, AWS credentials, or repository
variables are required. AWS secrets and variables from the previous ECR setup
are no longer used and can be removed if no other workflows need them. Revoke
unused AWS access keys in IAM as well.

The image name is `ghcr.io/<owner>/<repository>-frontend`, normalized to lowercase.
For this repository, the workflow run summary will show:

```text
ghcr.io/gerardozq/dco-frontend:COMMIT_SHA
```

The image includes a source label linking it to this GitHub repository. If a
package with that name already exists, ensure this repository has write access
under the package's **Settings > Manage Actions access**. Organization policies
must also allow package creation and publishing.

### Pull and run a published image

New GHCR packages are private by default, even for public source repositories.
To allow anonymous pulls, change the package visibility to public in its GitHub
package settings. Otherwise, authenticate locally with a GitHub personal access
token (classic) with `read:packages` and an account authorized to read the package:

```sh
printf '%s' "$GHCR_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

Set `GHCR_TOKEN` securely in your local environment; do not commit or share it.
If required by your organization, authorize the token for SSO. This token is
only for local pulls; the workflow does not need it.

Replace `COMMIT_SHA` with the full SHA shown in the workflow summary:

```sh
docker pull ghcr.io/gerardozq/dco-frontend:COMMIT_SHA
docker run --rm -p 8080:80 ghcr.io/gerardozq/dco-frontend:COMMIT_SHA
```

Publishing to GHCR stores the image; it does **not** deploy or host the web app.
If publishing returns a permission error, inspect the package's Actions access
and repository/organization policies.
