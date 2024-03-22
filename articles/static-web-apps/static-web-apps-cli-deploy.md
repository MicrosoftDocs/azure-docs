---
title: Deploy a static web app with Azure Static Web Apps CLI
description: Deploy a static web app with Azure Static Web Apps CLI
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 02/05/2024
ms.author: cshoe
---

# Deploy a static web app with Azure Static Web Apps CLI

The Azure Static Web Apps CLI (SWA CLI) features the `deploy` command to deploy the current project to Azure Static Web Apps.

Common deployment scenarios include:

- A front-end app without an API
- A front-end app with an API
- Blazor apps

## Deployment token

The SWA CLI supports deploying using a deployment token to enable setups in CI/CD environments.

You can get a deployment token from:

- **Azure portal**: **Home → Static Web App → Your Instance → Overview → Manage deployment token**

- **Azure CLI**: Using the `secrets list` command:

  ```azstatic-cli
  az staticwebapp secrets list --name <APPLICATION_NAME> --query "properties.apiKey"
  ```

- **Azure Static Web Apps CLI**: Using the `deploy` command:

  ```azstatic-cli
  swa deploy --print-token
  ```

You can then use the token value with the `--deployment-token <TOKEN>` or you can create an environment variable called `SWA_CLI_DEPLOYMENT_TOKEN` and set it to the deployment token.

> [!IMPORTANT]
> Don't store deployment tokens in a public repository.

## Deploy a front-end app without an API

You can deploy a front-end application without an API to Azure Static Web Apps. If your front-end application requires a build step, run `swa build` or refer to your application build instructions.

Select the option that best suits your needs to configure your deployment

- **Option 1:** From build folder you would like to deploy, run the deploy command:

    ```azstatic-cli
    cd build/
    swa deploy
    ```

    > [!NOTE]
    > The *build* folder must contain the static content of your app to be deployed.

- **Option 2:** You can also deploy a specific folder:

    1. If your front-end application requires a build step, run `swa build` or refer to your application build instructions.

    2. Deploy your app:

    ```azstatic-cli
    swa deploy ./my-dist
    ```

## Deploy a front-end app with an API

Use the following steps to deploy an application that has API endpoints.

1. If your front-end application requires a build step, run `swa build` or refer to your application build instructions.

1. Ensure the API language runtime version in the *staticwebapp.config.json* file is set correctly, for example:

    ```json
    {
      "platform": {
        "apiRuntime": "node:16"
      }
    }
    ```
    
    > [!NOTE]
    > If your project doesn't have the *staticwebapp.config.json* file, add one under your `outputLocation` folder.

1. Deploy your app:

    ```azstatic-cli
    swa deploy ./my-dist --api-location ./api
    ```

### Deploy a Blazor app

You can deploy a Blazor app using the following steps.

1. Build your Blazor app in **Release** mode:

    ```azstatic-cli
    dotnet publish -c Release -o bin/publish
    ```

1. From the root of your project, run the deploy command:

    ```azstatic-cli
    swa deploy ./bin/publish/wwwroot --api-location ./Api
    ```

## Deploy using a configuration file

> [!NOTE]
> The path for `outputLocation` must be relative to the `appLocation`.

If you're using a [`swa-cli.config.json`](./static-web-apps-cli-configuration.md) configuration file in your project with a single configuration entry, then you can deploy your application by running the following steps.

For reference, an example of a single configuration entry looks like the following code snippet.

  ```json
  {
    "configurations": {
      "my-app": {
        "appLocation": "./",
        "apiLocation": "api",
        "outputLocation": "frontend",
        "start": {
          "outputLocation": "frontend"
        },
        "deploy": {
          "outputLocation": "frontend"
        }
      }
    }
  }
  ```

1. If your front-end application requires a build step, run `swa build` or refer to your application build instructions.

2. Deploy your app.

  ```azstatic-cli
  swa deploy
  ```
  
  If you have multiple configuration entries, you can provide the entry ID to specify which one to use:
  
  ```azstatic-cli
  swa deploy my-otherapp
  ```

## Options

The following are options you can use with `swa deploy`:

- `-a, --app-location <path>`: the folder containing the source code of the front-end application (default: "`.`")
- `-i, --api-location <path>`: the folder containing the source code of the API application
- `-O, --output-location <path>`: the folder containing the built source of the front-end application. The path is relative to `--app-location` (default: "`.`")
- `-w, --swa-config-location <swaConfigLocation>`: the directory where the staticwebapp.config.json file is located
- `-d, --deployment-token <secret>`: the secret token used to authenticate with the Static Web Apps
- `-dr, --dry-run`: simulate a deploy process without actually running it (default: `false`)
- `-pt, --print-token`: print the deployment token (default: `false`)
- `--env [environment]`: the type of deployment environment where to deploy the project (default: "`preview`")
- `-S, --subscription-id <subscriptionId>`: Azure subscription ID used by this project (default: `process.env.AZURE_SUBSCRIPTION_ID`)
- `-R, --resource-group <resourceGroupName>`: Azure resource group used by this project
- `-T, --tenant-id <tenantId>`: Azure tenant ID (default: `process.env.AZURE_TENANT_ID`)
- `-C, --client-id <clientId>`: Azure client ID
- `-CS, --client-secret <clientSecret>`: Azure client secret
- `-n, --app-name <appName>`: Azure Static Web App application name
- `-cc, --clear-credentials`: clear persisted credentials before sign in (default: `false`)
- `-u, --use-keychain`: enable using the operating system native keychain for persistent credentials (default: `true`)
- `-nu, --no-use-keychain`: disable using the operating system native keychain
- `-h, --help`: display help for command

## Usage

Deploy using a deployment token.

```azstatic-cli
swa deploy ./dist/ --api-location ./api/ --deployment-token <TOKEN>
```

Deploy using a deployment token from the environment variables.

```azstatic-cli
SWA_CLI_DEPLOYMENT_TOKEN=123 swa deploy ./dist/ --api-location ./api/
```

Deploy using `swa-cli.config.json` file

```azstatic-cli
swa deploy
swa deploy myconfig
```

Print the deployment token.

```azstatic-cli
swa deploy --print-token
```

Deploy to a specific environment.

```azstatic-cli
swa deploy --env production
```

## Next steps

> [!div class="nextstepaction"]
> [Configure your deployment](static-web-apps-cli-configuration.md)
