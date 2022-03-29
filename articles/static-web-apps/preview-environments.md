---
title: Create stable review environments in Azure Static Web Apps
description: Expose stable URLs for specific branches or environment to evaluate changes in Azure Static Web Apps
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: how-to
ms.date: 03/29/2022
ms.custom: template-how-to
---

# Create stable review locations in Azure Static Web Apps

By default, when you deploy a site to Azure Static Web Apps [each pull request deploys a preview version of your site available through a temporary URL](review-publish-pull-requests.md). This version of the site allows you to review changes before merging pull requests. Once the pull request is closed, the temporary environment disappears.

Beyond PR-driven temporary environments, you can enable preview environments that feature stable locations. The URLs for preview environments take on the following form:

  ```text
  <DEFAULT_HOST_NAME>-<BRANCH_OR_ENVIRONMENT_NAME>.<LOCATION>.azurestaticapps.net
  ```

This article demonstrates how to enable preview environments in GitHub.

## Environment types

The following environment types are available in Azure Static Web Apps.

- **Production environment**: Changes to production branches are deployed into the production environment. Your custom domain points to this environment, and content served from this location is indexed by search engines.

- **PR environments**: Pull requests against your production branch deploy to a temporary environment that disappears after the pull request is closed. The URL for this environment includes the PR number as a suffix. For example, if you make your first PR, the preview location looks something like `<DEFAULT_HOST_NAME>-1.<LOCATION>.azurestaticapps.net`.

- **Preview environments**: You can optionally configure your site to deploy every change made to branches that aren't a production branch. Preview environments are either mapped to specific branches, or changes from all branches are rolled up into a single named environment. If mapped to a specific branch, the environment lives for the entire lifetime of the branch.

  Preview environments are published to a URL that includes the environment or branch name as a suffix. For example, if the environment or branch is named `dev`, then the environment is available at a location like `<DEFAULT_HOST_NAME>-dev.<LOCATION>.azurestaticapps.net`.

## Configuration

There are two configuration types available for enabling preview environments. Both configuration types apply only to non-production branches.

| Type | Description |
|--|--|
| **Named environment** | Changes made to any non-production branches are available via a single URL that includes the designated environment name. |
| **Branch environments** | Changes made to any non-production branches are available via URLs using individual branch names. |

To enable preview environments, make the following changes to your [configuration file](configuration.md).

- Set the `production_branch` environment variable to your production branch name.
- List the branches you want to include in preview environments in the `on > push > branches` array in your site configuration.
  - Set this array to `**` if you want to track all non-production branches.
- If you want a single named environment, define the `deployment_environment_name` environment variable.

## Examples

The following examples demonstrate how to enable named and branch preview environments.

### Named environment

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

### Branch environments

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
