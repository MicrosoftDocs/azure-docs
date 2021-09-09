---
title: GitHub Actions workflows for Azure Static Web Apps
description: Learn how to use GitHub repositories to set up continuous deployment to Azure Static Web Apps.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 06/23/2021
ms.author: cshoe
ms.custom: contperf-fy21q4
---

# GitHub Actions workflows for Azure Static Web Apps

When you use GitHub deployment, a YAML file controls your site's build workflow. This article explains the file's structure and options.

A deployment starts from a [trigger](#triggers), that run [jobs](#jobs) composed of individual [steps](#steps).

> [!NOTE]
> Azure Static Web Apps also supports Azure DevOps workflows. See [Publish with Azure DevOps](publish-devops.md) for information on setting up a pipeline.

## File name and location

When you link your repository, Azure Static Web Apps generates a file that controls the workflow.

Follow these steps to view the workflow file.

1. Open the app's repository on GitHub.
1. Select the **Code** tab.
1. Select the **.github/workflows** folder.
1. Select the file named similar to **azure-static-web-apps-<RANDOM_NAME>.yml**.

## Triggers

A GitHub Actions [trigger](https://help.github.com/actions/reference/events-that-trigger-workflows) notifies a GitHub Actions workflow to run a job based off certain events. Triggers are listed using the `on` property in the workflow file.

```yml
on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main
```

In this example, a workflow begins when a pull request on the *main* branch is:

- opened
- synchronized
- reopened
- closed

You can customize this part of the workflow to target different branches or different events.

## Jobs

Each trigger defines a series of [jobs](https://help.github.com/actions/reference/workflow-syntax-for-github-actions#jobs) to run in response to the event.

| Name | Description |
| --- | --- |
| `build_and_deploy_job` | Executes when you push commits or open a pull request against the branch listed in the `on` property.          |
| `close_pull_request_job` | Executes ONLY when you close a pull request that removes the staging environment created from pull requests. |

## Steps

Steps are sequential tasks for a job. A step carries out actions like installing dependencies, running tests, and deploying your application to production.

| Job | Steps |
| --- | --- |
| `build_and_deploy_job` | <li>Checks out the repository in the GitHub Action's environment.<li>Builds and deploys the repository to Azure Static Web Apps. |
| `close_pull_request_job` | <li>Notifies Azure Static Web Apps that a pull request has closed. |

## Build and deploy

The step named `build_and_deploy_job` builds and deploys to your site to Azure Static Web Apps. Under the `with` section, you can customize the following values for your deployment.

The following example shows how these values appear in a workflow file.

```yml
...
with:
  azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_MANGO_RIVER_0AFDB141E }}
  repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for GitHub integrations (i.e. PR comments)
  action: 'upload'
  ###### Repository/Build Configurations - These values can be configured to match you app requirements. ######
  app_location: '/' # App source code path
  api_location: 'api' # Api source code path - optional
  output_location: 'dist' # Built app content directory - optional
  ###### End of Repository/Build Configurations ######
```

[!INCLUDE [static-web-apps-folder-structure](../../includes/static-web-apps-folder-structure.md)]

Don't change the values for `repo_token`, `action`, and `azure_static_web_apps_api_token` as they are set for you by Azure Static Web Apps.

## Custom build commands

You can take fine-grained control over what commands run during the app or API build process. The following commands appear under a job's `with` section.

| Command | Description |
| --- |--- |
| `app_build_command` | Defines a custom command to build the static content application.<br><br>For example, to configure a production build for an Angular application create an npm script named `build-prod` to run `ng build --prod` and enter `npm run build-prod` as the custom command. If left blank, the workflow tries to run the `npm run build` or `npm run build:azure` commands. |
| `api_build_command` | Defines a custom command to build the Azure Functions API application. |

The following example show how to define custom build commands inside a job's `with` section.

```yml
...
with:
  azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_MANGO_RIVER_0AFDB141E }}
  repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for GitHub integrations (i.e. PR comments)
  action: 'upload'
  ###### Repository/Build Configurations - These values can be configured to match you app requirements. ######
  app_location: '/' # App source code path
  api_location: 'api' # Api source code path - optional
  output_location: 'dist' # Built app content directory - optional
  app_build_command: 'npm run build-ui-prod'
  api_build_command: 'npm run build-api-prod'
  ###### End of Repository/Build Configurations ######
```

> [!NOTE]
> Currently, you can only define custom build commands for Node.js builds. The build process always calls `npm install` before any custom command.

## Skip building front-end app

If you need full control of the build for your front-end app, you can add custom steps to the workflow. For instance, you may choose to bypass the automatic build and deploy the app built in a previous step.

To skip building the front-end app, set `skip_app_build` to `true` and `app_location` to the location of the folder to deploy.

```yml
with:
  azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_MANGO_RIVER_0AFDB141E }}
  repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for GitHub integrations (i.e. PR comments)
  action: 'upload'
  ###### Repository/Build Configurations - These values can be configured to match you app requirements. ######
  app_location: 'dist' # Application build output generated by a previous step
  api_location: 'api' # Api source code path - optional
  output_location: '' # Leave this empty
  skip_app_build: true
  ###### End of Repository/Build Configurations ######
```

| Property         | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| `skip_app_build` | Set the value to `true` to skip building the front-end app. |

> [!NOTE]
> You can only skip the build for the front-end app. The API is always built if it exists.

## Environment variables

You can set environment variables for your build via the `env` section of a job's configuration.

```yaml
jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: 'upload'
          ###### Repository/Build Configurations
          app_location: '/'
          api_location: 'api'
          output_location: 'public'
          ###### End of Repository/Build Configurations ######
        env: # Add environment variables here
          HUGO_VERSION: 0.58.0
```

## Monorepo support

A monorepo is a repository that contains code for more than one application. By default, the workflow tracks all files in a repository, but you can adjust the configuration to target a single app.

When you set up a monorepo, each static app has its own configuration file scoped to only files in a single app. The different workflow files live side by side in the repository's _.github/workflows_ folder.

```files
├── .github
│   └── workflows
│       ├── azure-static-web-apps-purple-pond.yml
│       └── azure-static-web-apps-yellow-shoe.yml
│
├── app1  👉 controlled by: azure-static-web-apps-purple-pond.yml
├── app2  👉 controlled by: azure-static-web-apps-yellow-shoe.yml
│
├── api1  👉 controlled by: azure-static-web-apps-purple-pond.yml
├── api2  👉 controlled by: azure-static-web-apps-yellow-shoe.yml
│
└── README.md
```

To target a workflow file to a single app, you specify paths in the `push` and `pull_request` sections.

The following example demonstrates how to add a `paths` node to the `push` and `pull_request` sections of a file named _azure-static-web-apps-purple-pond.yml_.

```yml
on:
  push:
    branches:
      - main
    paths:
      - app1/**
      - api1/**
      - .github/workflows/azure-static-web-apps-purple-pond.yml
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main
    paths:
      - app1/**
      - api1/**
      - .github/workflows/azure-static-web-apps-purple-pond.yml
```

In this instance, only changes made to following files trigger a new build:

- Any files inside the _app1_ folder
- Any files inside the _api1_ folder
- Changes to the app's _azure-static-web-apps-purple-pond.yml_ workflow file

## Next steps

> [!div class="nextstepaction"]
> [Review pull requests in pre-production environments](review-publish-pull-requests.md)
