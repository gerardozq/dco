# CateLink frontend

A React + TypeScript frontend for CateLink, a catechist mentoring app. It is
built with Vite, packaged with Docker, and deployed to AWS Elastic Beanstalk
using GitHub Actions.

## Local development

Use Node.js 22.12+ (Node 22 is used in CI and Docker).

```sh
cd frontend
npm ci
npm run dev
```

Open the URL printed by Vite. The welcome, profile, discovery, request, chat,
scheduling, pre-session prompt, mentor inbox, resource suggestions, video call,
session summary, and external-meeting check are interactive previews. Discovery
and resources use local example data. Sign-in, account persistence, live mentor
accounts, and real message, request, calendar, or call-provider connections are
not implemented. Call notes and summaries are entered by the user; there is no
recording or transcription. No AWS credentials are needed to run the app locally.

On the mentor-match preview, the gold and blue fish arcs start slightly apart
and join once, following the prototype's timing. Reduced-motion users see the
joined fish without animation.

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

## Deploy to Elastic Beanstalk

The [workflow](.github/workflows/deploy-beanstalk.yml) runs lint, tests, and a
production build on pull requests and pushes to `main`. After validation,
pushes to `main` deploy to an existing Beanstalk environment. You can also run
**Validate and deploy frontend to Elastic Beanstalk** manually on `main`.
Pull requests never receive AWS credentials or deploy.

GHCR publishing has been removed. The workflow archives the tracked frontend
source and configuration, placing the Dockerfile at the ZIP root, uploads the
bundle to S3, creates a unique application version, and updates the environment.
Beanstalk builds the image itself; no container registry is needed. Local
environment files, dependencies, and build output are not included in the bundle.
Deployments are serialized without cancelling an in-progress deployment.
The workflow waits for the environment update and checks that the requested
version is active and the environment health is Green before reporting success.

### 1. Prepare AWS infrastructure

Create the following in the same AWS region and account:

- An Elastic Beanstalk application, for example `dco`.
- A **web server environment** using the **Docker running on 64bit Amazon Linux
  2023** platform (single-container Docker, not the ECS-managed Docker platform),
  for example `dco-production`.
- A private S3 bucket for deployment bundles, for example `YOUR-UNIQUE-EB-BUCKET`.

Configure the environment's Beanstalk service role and EC2 instance profile
using AWS's recommended Beanstalk roles. The instance profile must be allowed
to read `dco-frontend/*` objects from the deployment bucket. If the bucket uses
a customer-managed KMS key, grant the required encrypt/decrypt permissions to
the deployment identity and decrypt permissions to the instance profile.
Allow outbound access to npm and Docker Hub so instances can build the image.
For load-balanced environments, configure the health-check path as `/health`.
The container exposes port 80; Beanstalk's reverse proxy forwards traffic to it.

Configure HTTPS with an ACM certificate and a load balancer for production.
Infrastructure provisioning, domain names, and certificates are not managed by
this workflow. Beanstalk resources incur AWS charges.

### 2. Configure the deployment identity

Use a dedicated IAM user, not root-account access keys. Grant:

- `s3:PutObject` on `arn:aws:s3:::YOUR-UNIQUE-EB-BUCKET/dco-frontend/*`.
- `elasticbeanstalk:CreateApplicationVersion` on your application's application
  and application-version resources.
- `elasticbeanstalk:UpdateEnvironment` on your application's environment and
  application-version resources.
- `elasticbeanstalk:DescribeEnvironments` (this read operation requires `Resource: "*"`).

Scope write permissions to the target region, account, application, and
environment. Beanstalk may require additional dependent permissions according
to your environment and service-role configuration; inspect AWS AccessDenied
errors rather than granting administrator access. The deployment user does not
need ECR permissions or permission to create the application or environment.

Create an IAM access key. Store it only in GitHub Actions secrets; never commit
it, include it in frontend code, or share it in chat. Rotate keys regularly.
OIDC is preferable for avoiding long-lived keys, but this workflow uses access
keys as requested.

### 3. Configure GitHub Actions

Under **Settings > Secrets and variables > Actions > Secrets**, create:

| Secret | Value |
| --- | --- |
| `AWS_ACCESS_KEY_ID` | The deployment IAM user's access key ID |
| `AWS_SECRET_ACCESS_KEY` | The corresponding secret access key |
| `AWS_SESSION_TOKEN` | Only required for temporary credentials |

Temporary credentials must come from the same session and be refreshed before
expiry. Leave `AWS_SESSION_TOKEN` unset for IAM user access keys.

The deployment target is configured directly in the workflow:

| Workflow setting | Value |
| --- | --- |
| `AWS_REGION` | `ap-southeast-1` |
| `EB_APPLICATION_NAME` | `dco-app` |
| `EB_ENVIRONMENT_NAME` | `Dco-app-env` |
| `EB_S3_BUCKET` | `dco-app` |

These names are case-sensitive. Edit the workflow to deploy to a different target.

No GitHub repository variables are required. Confirm the `dco-app` bucket is in
`ap-southeast-1` and grant the deployment user write access and the environment's
instance profile read access to `arn:aws:s3:::dco-app/dco-frontend/*`.

The old `ECR_REPOSITORY` and `AWS_ROLE_ARN` variables are not used.
Push to `main` or manually run the workflow after configuring AWS. The run
summary reports the application version, environment, and endpoint hostname.

### Operations and troubleshooting

Missing configuration fails explicitly before deployment. For authentication
failures, check that the keys are active and any temporary credentials have not
expired. For deployment failures, inspect Beanstalk events and instance logs;
the Docker build runs on the environment, not on the Actions runner.

The AWS CLI waiter has a finite timeout. If it times out, the workflow fails,
but the AWS deployment may still be running. Inspect the environment before
retrying. To roll back, deploy a previous application version from Beanstalk.
Set retention policies for old application versions and their S3 bundles;
this workflow does not delete them.
