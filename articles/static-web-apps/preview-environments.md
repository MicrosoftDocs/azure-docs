---
title: Create stable URLs for preview environments in Azure Static Web Apps
description: Expose stable URLs for specific branches or environment to evaluate changes in Azure Static Web Apps
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: how-to
ms.date: 03/29/2022
ms.custom: template-how-to
---

# Create stable URLs for preview environments in Azure Static Web Apps

By default, when you deploy a site to Azure Static Web Apps [each pull request deploys a preview version of your site available through a temporary URL](review-publish-pull-requests.md). This version of the site allows you to review changes before merging pull requests. Once the pull request is closed, the temporary environment disappears.

Beyond PR-driven temporary environments, you can enable preview environments that feature stable locations. The URLs for preview environments take on the following form:

  ```text
  <DEFAULT_HOST_NAME>-<BRANCH_OR_ENVIRONMENT_NAME>.<LOCATION>.azurestaticapps.net
  ```

This article demonstrates how to enable preview environments in GitHub.

## Deployment types

The following deployment types are available in Azure Static Web Apps.

- **Production**: Changes to production branches are deployed into the production environment. Your custom domain points to this environment, and content served from this location is indexed by search engines.

- **PR**: Pull requests against your production branch deploy to a temporary environment that disappears after the pull request is closed. The URL for this environment includes the PR number as a suffix. For example, if you make your first PR, the preview location looks something like `<DEFAULT_HOST_NAME>-1.<LOCATION>.azurestaticapps.net`.

- **Branch**: You can optionally configure your site to deploy every change made to branches that aren't a production branch. This preview deployment lives for the entire lifetime of the branch and is published at a stable URL that includes the branch name. For example, if the branch is named `dev`, then the environment is available at a location like `<DEFAULT_HOST_NAME>-dev.<LOCATION>.azurestaticapps.net`.

  Preview environments are published to a URL that includes the environment or branch name as a suffix. For example, if the environment or branch is named `dev`, then the environment is available at a location like `<DEFAULT_HOST_NAME>-dev.<LOCATION>.azurestaticapps.net`.

## Configuration

To enable stable URL environments, make the following changes to your [configuration file](configuration.md).

- Set the `production_branch` input on the `static-web-apps-deploy` GitHub action to your production branch name
- List the branches you want to include in preview environments in the `on > push > branches` array in your site configuration.
  - Set this array to `**` if you want to track all non-production branches.
- If you want a single target environment, define the `deployment_environment` input on the `static-web-apps-deploy` GitHub action.

## Examples

The following examples demonstrate how to enable stable preview environments.

### Deployment environment

```yml
ame: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - "**"
    ...

jobs:
  build_and_deploy_job:
    ...
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          ...
          production_branch: "main"
          deployment_environment: "dev"
```

> [!NOTE]
> The `...` denotes code skipped for clarity.

In this case, the named environment is labeled as `dev` and tracks all non-production branches. If you wanted to only track changes specific branches, then define them individually in the `branches` array.

Since the `deployment_environment` value is set, then changes to all branches roll up into a single environment.

### Branch deployments

```yml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
      - dev
      - feature1
      - feature2
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    ...
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          ...
          production_branch: "main"
```

> [!NOTE]
> The `...` denotes code skipped for clarity.

Here, the preview environments are defined for the `dev`, `feature1`, and `feature2` branches. Since the `deployment_environment` value isn't set, then each branch is deployed to its own environment.

## Next Steps

> [!div class="nextstepaction"]
> [Review pull requests in pre-production environments](./review-publish-pull-requests.md)
