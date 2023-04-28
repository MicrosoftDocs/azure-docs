---
title: Create named preview environments in Azure Static Web Apps
description: Expose stable URLs for named environments to evaluate changes in Azure Static Web Apps
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 04/27/2022
ms.custom: template-how-to
---

# Create named preview environments in Azure Static Web Apps

You can configure your site to deploy every change to a named environment. This preview deployment is published at a stable URL that includes the environment name. For example, if the environment is named `release`, then the preview is available at a location like `<DEFAULT_HOST_NAME>-release.<LOCATION>.azurestaticapps.net`.

## Configuration

To enable stable URL environments with named deployment environment, make the following changes to your [configuration file](configuration.md).

- Set the `deployment_environment` input to a specific name on the `static-web-apps-deploy` job in GitHub action or on the AzureStaticWebApp task. This ensures all changes to your tracked branches are deployed to the named preview environment.
- List the branches you want to deploy to preview environments in the trigger array in your workflow configuration so that changes to those branches also trigger the GitHub Actions or Azure Pipelines deployment.
  - Set this array to `**` for GitHub Actions or `*` for Azure Pipelines if you want to track all branches.

## Example

The following example demonstrates how to enable branch preview environments.

# [GitHub Actions](#tab/github-actions)

```yml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - "**"
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
          deployment_environment: "release"
```
# [Azure Pipelines](#tab/azure-devops)

```yml
trigger:
  - "*"

pool:
  vmImage: ubuntu-latest

steps:
  - checkout: self
    submodules: true
  - task: AzureStaticWebApp@0
    inputs:
      ...
      deployment_environment: "release"
```

---

> [!NOTE]
> The `...` denotes code skipped for clarity.

In this example, changes to all branches get deployed to the `release` named preview environment.

## Next Steps

> [!div class="nextstepaction"]
> [Review pull requests in pre-production environments](./review-publish-pull-requests.md)
