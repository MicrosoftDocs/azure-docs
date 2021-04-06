---
title: GitHub Actions workflows for Azure Static Web Apps
description: Learn how to use GitHub repositories to set up continuous deployment to Azure Static Web Apps.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 02/05/2021
ms.author: cshoe
---

# GitHub Actions workflows for Azure Static Web Apps Preview

When you create a new Azure Static Web App resource, Azure generates a GitHub Actions workflow to control the app's continuous deployment. The workflow is driven by a YAML file. This article details the structure and options of the workflow file.

Deployments are initiated by [triggers](#triggers), which run [jobs](#jobs) that are defined by individual [steps](#steps).

## File location

When you link your GitHub repository to Azure Static Web Apps, a workflow file is added to the  repository.

Follow these steps to view the generated workflow file.

1. Open the app's repository on GitHub.
1. From the _Code_ tab, click on the `.github/workflows` folder.
1. Click on the file with a name that looks like `azure-static-web-apps-<RANDOM_NAME>.yml`.

The YAML file in your repository will be similar to the following example:

```yml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
    - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
    - main

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
      uses: Azure/static-web-apps-deploy@v0.0.1-preview
      with:
        azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_MANGO_RIVER_0AFDB141E }}
        repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for GitHub integrations (i.e. PR comments)
        action: 'upload'
        ###### Repository/Build Configurations - These values can be configured to match you app requirements. ######
        app_location: '/' # App source code path
        api_location: 'api' # Api source code path - optional
        output_location: 'dist' # Built app content directory - optional
        ###### End of Repository/Build Configurations ######

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
    - name: Close Pull Request
      id: closepullrequest
      uses: Azure/static-web-apps-deploy@v0.0.1-preview
      with:
        azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_MANGO_RIVER_0AFDB141E }}
        action: 'close'
```

## Triggers

A GitHub Actions [trigger](https://help.github.com/actions/reference/events-that-trigger-workflows) notifies a GitHub Actions workflow to run a job based off event triggers. Triggers are listed using the `on` property in the workflow file.

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

Through settings associated with the `on` property, you can define which branches trigger a job, and set triggers to fire for different pull request states.

In this example, a workflow is started as the _main_ branch changes. Changes that start the workflow include pushing commits and opening pull requests against the chosen branch.

## Jobs

Each event trigger requires an event handler. [Jobs](https://help.github.com/actions/reference/workflow-syntax-for-github-actions#jobs) define what happens when an event is triggered.

In the Static Web Apps workflow file, there are two available jobs.

| Name  | Description |
|---------|---------|
|`build_and_deploy_job` | Executes when you push commits or open a pull request against the branch listed in the `on` property. |
|`close_pull_request_job` | Executes ONLY when you close a pull request, which removes the staging environment created from pull requests. |

## Steps

Steps are sequential tasks for a job. A step carries out actions like installing dependencies, running tests, and deploying  your application to production.

A workflow file defines the following steps.

| Job  | Steps  |
|---------|---------|
| `build_and_deploy_job` |<ol><li>Checks out the repository in the Action's environment.<li>Builds and deploys the repository to Azure Static Web Apps.</ol>|
| `close_pull_request_job` | <ol><li>Notifies Azure Static Web Apps that a pull request has closed.</ol>|

## Build and deploy

The step named `Build and Deploy` builds and deploys to your Azure Static Web Apps instance. Under the `with` section, you can customize the following values for your deployment.

```yml
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

The `repo_token`, `action`, and `azure_static_web_apps_api_token` values are set for you by Azure Static Web Apps shouldn't be manually changed.

## Custom build commands

You can have fine-grained control over what commands run during a deployment. The following commands can be defined under a job's `with` section.

The deployment always calls `npm install` before any custom command.

| Command            | Description |
|---------------------|-------------|
| `app_build_command` | Defines a custom command to run during deployment of the static content application.<br><br>For example, to configure a production build for an Angular application create an npm script named `build-prod` to run `ng build --prod` and enter `npm run build-prod` as the custom command. If left blank, the workflow tries to run the `npm run build` or `npm run build:azure` commands.  |
| `api_build_command` | Defines a custom command to run during deployment of the Azure Functions API application. |

## Route file location

You can customize the workflow to look for the [routes.json](routes.md) in any folder in your repository. The following property can be defined under a job's `with` section.

| Property            | Description |
|---------------------|-------------|
| `routes_location` | Defines the directory location where the _routes.json_ file is found. This location is relative to the root of the repository. |

 Being explicit about the location of your _routes.json_ file is particularly important if your front-end framework build step does not move this file to the `output_location` by default.

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
        uses: Azure/static-web-apps-deploy@v0.0.1-preview
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          ###### Repository/Build Configurations
          app_location: "/"
          api_location: "api"
          output_location: "public"
          ###### End of Repository/Build Configurations ######
        env: # Add environment variables here
          HUGO_VERSION: 0.58.0
```

## Monorepo support

A monorepo is a repository that contains code for more than one application. By default, a Static Web Apps workflow file tracks all the files in a repository, but you can adjust it to target a single app. Therefore, for monorepos, each static app has it's own configuration file which lives side-by-side in the repository's *.github/workflows* folder.

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

- Any files inside the *app1* folder
- Any files inside the *api1* folder
- Changes to the app's *azure-static-web-apps-purple-pond.yml* workflow file

## Next steps

> [!div class="nextstepaction"]
> [Review pull requests in pre-production environments](review-publish-pull-requests.md)
