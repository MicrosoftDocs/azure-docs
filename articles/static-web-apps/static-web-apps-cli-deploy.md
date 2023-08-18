---
title: Deploy a static web app with Azure Static Web Apps CLI
description: Deploy a static web app with Azure Static Web Apps CLI
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 09/30/2022
ms.author: cshoe
---

# Deploy a static web app with Azure Static Web Apps CLI

The `deploy` command deploys the current project to Azure Static Web Apps. 

Some common use cases include:

- Deploy a front-end app without an API
- Deploy a front-end app with an API
- Deploy a Blazor app

## Deployment token

The SWA CLI supports deploying using a deployment token. This is usually useful when deploying from a CI/CD environment. You can get a deployment token either from:

- The [Azure portal](https://portal.azure.com/): **Home → Static Web App → Your Instance → Overview → Manage deployment token**

- If you are using the [Azure CLI](https://aka.ms/azcli), you can get the deployment token of your project using the following command:

```azstatic-cli
az staticwebapp secrets list --name <APPLICATION_NAME> --query "properties.apiKey"
```

- If you are using the Azure Static Web Apps CLI, you can use the following command:

```azstatic-cli
swa deploy --print-token
```

You can then use that value with the `--deployment-token <token>` or you can create an environment variable called `SWA_CLI_DEPLOYMENT_TOKEN` and set it to the deployment token.

> [!IMPORTANT]
> Don't store deployment tokens in a public repository.

## Deploy a front-end app without an API

You can deploy a front-end application without an API to Azure Static Web Apps by running the following steps:

If your front-end application requires a build step, run `swa build` or refer to your application build instructions.

* **Option 1:** From build folder you would like to deploy, run the deploy command:

    ```azstatic-cli
    cd build/
    swa deploy
    ```

    > [!NOTE]
    > The *build* folder must contain the static content of your app to be deployed.

* **Option 2:** You can also deploy a specific folder:

    1. If your front-end application requires a build step, run `swa build` or refer to your application build instructions.

    2. Deploy your app:

    ```azstatic-cli
    swa deploy ./my-dist
    ```

## Deploy a front-end app with an API

To deploy both the front-end app and an API to Azure Static Web Apps, use the following steps.

1. If your front-end application requires a build step, run `swa build` or refer to your application build instructions.

2. Make sure the API language runtime version in the *staticwebapp.config.json* file is set correctly, for example:

```json
{
  "platform": {
    "apiRuntime": "node:16"
  }
}
```

> [!NOTE]
> If your project doesn't have the *staticwebapp.config.json* file, add one under your `outputLocation` folder.

3. Deploy your app:

```azstatic-cli
swa deploy ./my-dist --api-location ./api
```

### Deploy a Blazor app

To deploy a Blazor app with an API to Azure Static Web Apps, use the following steps:

1. Build your Blazor app in **Release** mode:

```azstatic-cli
dotnet publish -c Release -o bin/publish
```

2. From the root of your project, run the deploy command:

```azstatic-cli
swa deploy ./bin/publish/wwwroot --api-location ./Api
```

## Deploy using the `swa-cli.config.json`

> [!NOTE]
> The path for `outputLocation` must be relative to the `appLocation`.

If you are using a [`swa-cli.config.json`](./static-web-apps-cli-configuration.md) configuration file in your project and have a single configuration entry, for example:

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

Then you can deploy your application by running the following steps:

1. If your front-end application requires a build step, run `swa build` or refer to your application build instructions.

2. Deploy your app:

```azstatic-cli
swa deploy
```

If you have multiple configuration entries, you can provide the entry ID to specify which one to use:

```azstatic-cli
swa deploy my-otherapp
```

## Options

Here are the options you can use with `swa deploy`:

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
- `-cc, --clear-credentials`: clear persisted credentials before login (default: `false`)
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
