---
title: Create branch preview environments in Azure Static Web Apps
description: Expose stable URLs for specific branches to evaluate changes in Azure Static Web Apps
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 09/19/2022
ms.custom: template-how-to
---

# Create branch preview environments in Azure Static Web Apps

You can configure your site to deploy every change made to branches that aren't a production branch. This preview deployment is published at a stable URL that includes the branch name. For example, if the branch is named `dev`, then the environment is available at a location like `<DEFAULT_HOST_NAME>-dev.<LOCATION>.azurestaticapps.net`.

## Configuration

To enable stable URL environments, make the following changes to your [configuration.yml file](build-configuration.md?tabs=github-actions).

- Set the `production_branch` input to your production branch name on the `static-web-apps-deploy` job in GitHub action or on the AzureStaticWebApp task. This action ensures changes to your production branch are deployed to the production environment, while changes to other branches are deployed to a preview environment.
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
      - main
      - dev
      - staging
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
# [Azure Pipelines](#tab/azure-devops)

```yml
trigger:
  - main
  - dev
  - staging

pool:
  vmImage: ubuntu-latest

steps:
  - checkout: self
    submodules: true
  - task: AzureStaticWebApp@0
    inputs:
      ...
      production_branch: 'main'
```

--- 

> [!NOTE]
> The `...` denotes code skipped for clarity.

In this example, the preview environments are defined for the `dev` and `staging` branches. Each branch is deployed to a separate preview environment.

## Next steps

> [!div class="nextstepaction"]
> [Create named preview environments](./named-environments.md)
