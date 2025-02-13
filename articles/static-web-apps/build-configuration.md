---
title: Build configuration for Azure Static Web Apps
description: Learn how to control the build process for Azure Static Web Apps.
services: static-web-apps
author: craigshoemaker
ms.service: azure-static-web-apps
ms.topic: conceptual
ms.date: 11/04/2024
ms.author: cshoe
zone_pivot_groups: static-web-apps-ci-cd
---

# Build configuration for Azure Static Web Apps

The Azure Static Web Apps build configuration either uses GitHub Actions or Azure Pipelines. Each site has a YAML configuration file that controls how a site is built and deployed. This article explains the file's structure and options.

The following table lists the available configuration settings.

| Property | Description | Required |
|---|---|---|
| `app_location` | This folder contains the source code for your front-end application. The value is relative to the repository root in GitHub and the current working folder in Azure DevOps. When used with `skip_app_build: true`, this value is the app's build output location. | Yes |
| `api_location` | This folder that contains the source code for your API application. The value is relative to the repository root in GitHub and the current working folder in Azure DevOps. When used with `skip_api_build: true`, this value is the API's build output location. | No |
| `output_location` | If your web app runs a build step, the output location is the folder where the public files are generated. For most projects, the `output_location` is relative to the `app_location`. However, for .NET projects, the location is relative to the output folder. | No |
| `app_build_command` | For Node.js applications, you can define a custom command to build the static content application.<br><br>For example, to configure a production build for an Angular application create an npm script named `build-prod` to run `ng build --prod` and enter `npm run build-prod` as the custom command. If left blank, the workflow tries to run the `npm run build` or `npm run build:azure` commands. | No |
| `api_build_command` | For Node.js applications, you can define a custom command to build the Azure Functions API application. | No |
| `skip_app_build` | Set the value to `true` to skip building the front-end app. | No |
| `skip_api_build` | Set the value to `true` to skip building the API functions. | No |
| `cwd`<br />(Azure Pipelines only) | Absolute path to the working folder. Defaults to `$(System.DefaultWorkingDirectory)`. | No |
| `build_timeout_in_minutes` | Set this value to customize the build timeout. Defaults to `15`. | No |

With these settings, you can set up GitHub Actions or [Azure Pipelines](get-started-portal.md?pivots=azure-devops) to run continuous integration/continuous delivery (CI/CD) for your static web app.

## File name and location

::: zone pivot="azure-pipelines"

The GitHub action generates the configuration file and is stored in the *.github/workflows* folder, named using the following format: `azure-static-web-apps-<RANDOM_NAME>.yml`.

::: zone-end

::: zone pivot="github-actions"

By default, the configuration file is stored at the root of your repository with the name `azure-pipelines.yml`.

::: zone-end

## Security

You can choose between two different deployment authorization policies to secure your build configuration. Static Web Apps supports either using an Azure deployment token (recommended), or a GitHub access token.

Use the following steps to set the deployment authorization policy in your app:

- **New apps**: When you create your static web app, on the *Deployment configuration* tab, make a selection for the *Deployment authorization policy*.

- **Existing apps**: To update an existing app, go to *Settings* > *Configuration* > *Deployment configuration*, and make a selection for the *Deployment authorization policy*.

## Build configuration

The following sample configuration monitors the repository for changes. As commits are pushed to the `main` branch, the application is built from the `app_location` folder and files in the `output_location` are served to the public web. Additionally, the application in the *api* folder is available under the site's `api` path.

::: zone pivot="azure-pipelines"

```yaml
trigger:
  - main

pool:
  vmImage: ubuntu-latest

steps:
  - checkout: self
    submodules: true
  - task: AzureStaticWebApp@0
    inputs:
      app_location: 'src' # App source code path relative to cwd
      api_location: 'api' # Api source code path relative to cwd
      output_location: 'public' # Built app content directory relative to app_location - optional
      cwd: '$(System.DefaultWorkingDirectory)/myapp' # Working directory - optional
      azure_static_web_apps_api_token: $(deployment_token)
```

In this configuration:

- The `main` branch is monitored for commits.
- The `app_location` points to the `src` folder that contains the source files for the web app. This value is relative to the working directory (`cwd`). To set it to the working directory, use `/`.
- The `api_location` points to the `api` folder that contains the Azure Functions application for the site's API endpoints. This value is relative to the working directory (`cwd`). To set it to the working directory, use `/`.
- The `output_location` points to the `public` folder that contains the final version of the app's source files. This value is relative to `app_location`. For .NET projects, the location is relative to the output folder.
- The `cwd` is an absolute path pointing to the working directory. It defaults to `$(System.DefaultWorkingDirectory)`.
- The `$(deployment_token)` variable points to the [generated Azure DevOps deployment token](./deployment-token-management.md).

> [!NOTE]
> `app_location` and `api_location` must be relative to the working directory (`cwd`) and they must be subdirectories under `cwd`.

::: zone-end

::: zone pivot="github-actions"

# [Identity token](#tab/identity)

```yml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
      - dev
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    permissions:
       id-token: write
       contents: read
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
          lfs: false
      - name: Install OIDC Client from Core Package
        run: npm install @actions/core@1.6.0 @actions/http-client
      - name: Get Id Token
        uses: actions/github-script@v6
        id: idtoken
        with:
           script: |
               const coredemo = require('@actions/core')
               return await coredemo.getIDToken()
           result-encoding: string
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_GENTLE_WATER }}
          action: "upload"
          ###### Repository/Build Configurations - These values can be configured to match your app requirements. ######
          # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
          app_location: "/" # App source code path
          api_location: "" # Api source code path - optional
          output_location: "dist/angular-basic" # Built app content directory - optional
          production_branch: "dev"
          github_id_token: ${{ steps.idtoken.outputs.result }}
          ###### End of Repository/Build Configurations ######

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_GENTLE_WATER_030D91C1E }}
          action: "close"
```

# [Azure access token](#tab/aat)

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
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for GitHub integrations (i.e. PR comments)
          action: "upload"
          ###### Repository/Build Configurations ######
          app_location: "src" # App source code path relative to repository root
          api_location: "api" # Api source code path relative to repository root - optional
          output_location: "public" # Built app content directory, relative to app_location - optional
          ###### End of Repository/Build Configurations ######

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

---

In this configuration:

- The `main` branch is monitored for commits.
- A GitHub Actions workflow is [triggered](https://help.github.com/actions/reference/events-that-trigger-workflows) when a pull request on the `main` branch is: opened, synchronized, reopened, or closed.
- The `build_and_deploy_job` executes when you push commits or open a pull request against the branch listed in the `on` property.
- The `app_location` points to the `src` folder that contains the source files for the web app. To set this value to the repository root, use `/`.
- The `api_location` points to the `api` folder that contains the Azure Functions application for the site's API endpoints. To set this value to the repository root, use `/`.
- The `output_location` points to the `public` folder that contains the final version of the app's source files. It's relative to `app_location`. For .NET projects, the location is relative to the publish output folder.

Don't change the values for `repo_token`, `action`, and `azure_static_web_apps_api_token` as they're set for you by Azure Static Web Apps.

The *Close Pull Request* job automatically closes the pull request that triggered the build and deployment. This optional job isn't required for the process to work.

When a pull request is opened, the Azure Static Web Apps GitHub Action builds and deploys the app to a staging environment. Afterward, the *Close Pull Request* job checks if the pull request is still open and closes it with a completion message.

This job helps keep your pull request workflow organized and prevents stale pull requests. By the runtime automatically closing the pull request, your repository stays up-to-date and your team is notified of the status.

The *Close Pull Request* job is part of the Azure Static Web Apps GitHub Actions workflow, closing the pull request after it's merged. The `Azure/static-web-apps-deploy` action deploys the app to Azure Static Web Apps, requiring the `azure_static_web_apps_api_token` for authentication.

::: zone-end

## Custom build commands

For Node.js applications, you can take fine-grained control over what commands run during the app or API build process. The following example shows how to define build with values for `app_build_command` and `api_build_command`.

> [!NOTE]
> Currently, you can only define `app_build_command` and `api_build_command` for Node.js builds.
> To specify the Node.js version, use the [`engines`](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#engines) field in the `package.json` file.

::: zone pivot="github-actions"

```yml
...

with:
  azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
  repo_token: ${{ secrets.GITHUB_TOKEN }}
  action: 'upload'
  app_location: '/'
  api_location: 'api'
  output_location: 'dist'
  app_build_command: 'npm run build-ui-prod'
  api_build_command: 'npm run build-api-prod'
```

::: zone-end

::: zone pivot="azure-pipelines"

```yaml
...

inputs:
  app_location: 'src'
  api_location: 'api'
  app_build_command: 'npm run build-ui-prod'
  api_build_command: 'npm run build-api-prod'
  output_location: 'public'
  azure_static_web_apps_api_token: $(deployment_token)
```

::: zone-end

## Skip building front-end app

If you need full control of the build for your front-end app, you can bypass the automatic build and deploy the app built in a previous step.

To skip building the front-end app:

- Set `app_location` to the location the files you want to deploy.
- Set `skip_app_build` to `true`.
- Set `output_location` to an empty string (`''`).

> [!NOTE]
> Make sure you have your `staticwebapp.config.json` file copied as well into the *output* directory.

::: zone pivot="github-actions"

```yml
...

with:
  azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
  repo_token: ${{ secrets.GITHUB_TOKEN }}
  action: 'upload'
  app_location: 'src/dist'
  api_location: 'api'
  output_location: ''
  skip_app_build: true
```

::: zone-end

::: zone pivot="azure-pipelines"

```yml
...

inputs:
  app_location: 'src/dist'
  api_location: 'api'
  output_location: '' # Leave this empty
  skip_app_build: true
  azure_static_web_apps_api_token: $(deployment_token)
```

::: zone-end

## Skip building the API

If you want to skip building the API, you can bypass the automatic build and deploy the API built in a previous step.

Steps to skip building the API:

- In the *staticwebapp.config.json* file, set `apiRuntime` to the correct runtime and version. Refer to [Configure Azure Static Web Apps](configuration.md#select-the-api-language-runtime-version) for the list of supported runtimes and versions.

    ```json
    {
      "platform": {
        "apiRuntime": "node:16"
      }
    }
    ```

- Set `skip_api_build` to `true`.
- Set `api_location` to the folder containing the built API app to deploy. This path is relative to the repository root in GitHub Actions and `cwd` in Azure Pipelines.

::: zone pivot="github-actions"

```yml
...

with:
  azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
  repo_token: ${{ secrets.GITHUB_TOKEN }}
  action: 'upload'
  app_location: "src" # App source code path relative to repository root
  api_location: "api" # Api source code path relative to repository root - optional
  output_location: "public" # Built app content directory, relative to app_location - optional
  skip_api_build: true
```

::: zone-end

::: zone pivot="azure-pipelines"

```yml
...

inputs:
  app_location: 'src'
  api_location: 'api'
  output_location: 'public'
  skip_api_build: true
  azure_static_web_apps_api_token: $(deployment_token)
```

::: zone-end

## Extend build timeout

By default, the app and API builds are limited to 15 minutes. You can extend the build timeout by setting the `build_timeout_in_minutes` property.

::: zone pivot="github-actions"

```yaml
...

with:
  azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
  repo_token: ${{ secrets.GITHUB_TOKEN }}
  action: 'upload'
  app_location: 'src'
  api_location: 'api'
  output_location: 'public'
  build_timeout_in_minutes: 30
```

::: zone-end

::: zone pivot="azure-pipelines"

```yml
...

inputs:
  app_location: 'src'
  api_location: 'api'
  output_location: 'public'
  build_timeout_in_minutes: 30
  azure_static_web_apps_api_token: $(deployment_token)
```

::: zone-end

## Run workflow without deployment secrets

Sometimes you need your workflow to continue to process even when some secrets are missing. To configure your workflow to proceed without defined secrets, set the `SKIP_DEPLOY_ON_MISSING_SECRETS` environment variable to `true`.

When enabled, this feature allows the workflow to continue without deploying the site's content.

::: zone pivot="github-actions"

```yaml
...

with:
  azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
  repo_token: ${{ secrets.GITHUB_TOKEN }}
  action: 'upload'
  app_location: 'src'
  api_location: 'api'
  output_location: 'public'
env:
  SKIP_DEPLOY_ON_MISSING_SECRETS: true
```

::: zone-end

::: zone pivot="azure-pipelines"

```yaml
...

inputs:
  app_location: 'src'
  api_location: 'api'
  output_location: 'public'
  azure_static_web_apps_api_token: $(deployment_token)
env:
  SKIP_DEPLOY_ON_MISSING_SECRETS: true
```

::: zone-end

## Environment variables

You can set environment variables for your build via the `env` section of a job's configuration.

For more information about the environment variables used by Oryx, see [Oryx configuration](https://github.com/microsoft/Oryx/blob/main/doc/configuration.md).

::: zone pivot="github-actions"

```yaml
...

with:
  azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
  repo_token: ${{ secrets.GITHUB_TOKEN }}
  action: 'upload'
  app_location: 'src'
  api_location: 'api'
  output_location: 'public'
env: # Add environment variables here
  HUGO_VERSION: 0.58.0
```

::: zone-end

::: zone pivot="azure-pipelines"

```yml
...

inputs:
  app_location: 'src'
  api_location: 'api'
  output_location: 'public'
  azure_static_web_apps_api_token: $(deployment_token)
env: # Add environment variables here
  HUGO_VERSION: 0.58.0
```

::: zone-end

## Monorepo support

A monorepo is a repository that contains code for more than one application. By default, the workflow tracks all files in a repository, but you can adjust the configuration to target a single app.

To target a workflow file to a single app, you specify paths in the `push` and `pull_request` sections.

::: zone pivot="github-actions"

When you set up a monorepo, each static app configuration is scoped to only files for a single app. The different workflow files live side by side in the repository's _.github/workflows_ folder.

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

In this example, only changes made to following files trigger a new build:

- Any files inside the _app1_ folder
- Any files inside the _api1_ folder
- Changes to the app's _azure-static-web-apps-purple-pond.yml_ workflow file

::: zone-end

::: zone pivot="azure-pipelines"

To support more than one application in a single repository, create a separate workflow file and associate it with different Azure Pipelines.

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Review pull requests in pre-production environments](review-publish-pull-requests.md)
