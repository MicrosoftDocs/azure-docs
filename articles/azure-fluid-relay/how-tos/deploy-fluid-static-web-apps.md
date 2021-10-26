---
title: 'How to: Deploy Fluid applications using Azure Static Web Apps'
description: Detailed explanation about how Fluid applications can be hosted on Azure Static Web Apps
author: sdeshpande3
ms.author: sdeshpande
ms.date: 08/19/2021
ms.topic: article
ms.service: azure-fluid
---

# How to: Deploy Fluid applications using Azure Static Web Apps

This article demonstrates how to deploy Fluid apps using Azure Static Web Apps. The
[FluidHelloWorld](https://github.com/microsoft/FluidHelloWorld/tree/main-azure) repository contains a Fluid application
called **DiceRoller** that enables all connected clients to roll a dice and view the result.  In this how-to, you deploy
the DiceRoller application to Azure Static Web Apps using the Visual Studio Code extension.

If you don't have an Azure subscription, [create a free trial account](https://azure.microsoft.com/free).

## Prerequisites

- [GitHub](https://github.com) account
- [Azure](https://portal.azure.com) account
- [Visual Studio Code](https://code.visualstudio.com)
- [Azure Static Web Apps extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps)
- [Install Git](https://www.git-scm.com/downloads)


[!INCLUDE [fork-fluidhelloworld](../includes/fork-fluidhelloworld.md)]

## Connect to Azure Fluid Relay Service

You can connect to Azure Fluid Relay service by providing the tenant ID and key that is uniquely generated for you when
creating the Azure resource. You can build your own token provider implementation or you can use the two token provider implementations that the Fluid Framework provides:
**InsecureTokenProvider** and **AzureFunctionTokenProvider**.

To learn more about using InsecureTokenProvider for local development, see [Connecting to the service](connect-fluid-azure-service.md#connecting-to-the-service) and [Using InsecureTokenProvider for development](azure-function-token-provider.md#using-insecuretokenprovider-for-development).

### Using AzureFunctionTokenProvider

**AzureFunctionTokenProvider** is a token provider that does not expose the secret key in client-side code and can be
used in production scenarios. This token provider implementation can be used to fetch a token from an HTTPS endpoint
that is responsible for signing access tokens with the tenant key. This provides a secure way to generate the token and
pass it back to the client app.

```js
import { AzureClient, AzureFunctionTokenProvider } from "@fluidframework/azure-client";

const config = {
    tenantId: "myTenantId",
    tokenProvider: new AzureFunctionTokenProvider("https://myAzureAppUrl"+"/api/GetAzureToken", { userId: "test-user",userName: "Test User" }),
    orderer: "https://myOrdererUrl",
    storage: "https://myStorageUrl",
};

const clientProps = {
    connection: config,
};

const client = new AzureClient(clientProps);
```

In order to use this token provider, you need to deploy an HTTPS endpoint that will sign tokens, and pass the URL
to your endpoint to the AzureFunctionTokenProvider.

### Deploying an Azure Function using Azure Static Web apps

Azure Static Web Apps allow you to develop a full-stack web site without needing to deal with the server-side
configuration of an entire web hosting environment. You can deploy Azure Functions alongside your static website. Using
this capability, you can deploy an HTTP-triggered Azure Function that will sign tokens.

For more information about deploying Azure Function-powered APIs to your static web app see [Add an API to Azure Static Web Apps with Azure Functions](../../static-web-apps/add-api.md).

> [!NOTE]
> You can use the example Azure Function code in [Implementing an Azure Function to sign tokens](azure-function-token-provider.md#implementing-an-azure-function-to-sign-tokens) to implement your function.

Once your Azure Function is deployed, you must update the URL passed to the AzureFunctionTokenProvider.

```js
import { AzureClient } from "@fluidframework/azure-client";

const config = {
    tenantId: "myTenantId",
    tokenProvider: new AzureFunctionTokenProvider("https://myStaticWebAppUrl/api/GetAzureToken", { userId: "test-user",userName: "Test User" }),
    orderer: "https://myOrdererUrl",
    storage: "https://myStorageUrl",
};

const clientProps = {
    connection: config,
};

const client = new AzureClient(config);
```

Run the `npm run build` command from the root directory to rebuild the app. This will generate a `dist` folder with the
application code that should be deployed to the Static Web app.

[!INCLUDE [sign-in-extensions](../includes/sign-in-extensions.md)]

## Create a static web app

1. Inside Visual Studio Code, select the Azure logo in the Activity Bar to open the Azure extensions window.

    :::image type="content" source="../../static-web-apps/media/getting-started/extension-azure-logo.png" alt-text="Azure Logo":::

    > [!NOTE]
    > You must sign in to Azure and GitHub in Visual Studio Code to continue. If you are not already authenticated, the extension will prompt you to sign in to both services during the creation process.

1. Under the _Static Web Apps_ label, select the **plus sign**.

    :::image type="content" source="../../static-web-apps/media/getting-started/extension-create-button.png" alt-text="Application name":::
    
    > [!NOTE]
    > The Azure Static Web Apps Visual Studio Code extension streamlines the creating process by using a series of default values. If you want to have fine-grained control of the creation process, open the command palate and select **Azure Static Web Apps: Create Static Web App... (Advanced)**.

1. The command palette opens at the top of the editor and prompts you to select a subscription name.

    Select your subscription and press <kbd>Enter</kbd>.

    :::image type="content" source="../../static-web-apps/media/getting-started/extension-subscription.png" alt-text="Select an Azure Subscription":::

1. Next, name your application.

    Type **my-first-static-web-app** and press <kbd>Enter</kbd>.

    :::image type="content" source="../../static-web-apps/media/getting-started/extension-create-app.png" alt-text="Create Static Web App":::

1. Select a region close to you.

    > [!NOTE]
    > Azure Static Web Apps globally distributes your static assets. The region you select determines where your
    > optional staging environments and API function app will be located.

1. Set other deployment options.
    
    - When asked to select a build preset to configure default project structure, select **Custom**.
    - Location of application code: `/`
    - Location of Azure Function code: `api`

1. Once the app is created, a confirmation notification is shown in Visual Studio Code.

    :::image type="content" source="../../static-web-apps/media/getting-started/extension-confirmation.png" alt-text="Created confirmation":::

    As the deployment is in progress, the Visual Studio Code extension reports the build status to you.

    :::image type="content" source="../../static-web-apps/media/getting-started/extension-waiting-for-deployment.png" alt-text="Waiting for deployment":::

    Once the deployment is complete, you can navigate directly to your website.

1. To view the website in the browser, right-click on the project in the Static Web Apps extension, and select **Browse Site**.

    :::image type="content" source="../../static-web-apps/media/getting-started/extension-browse-site.png" alt-text="Browse site":::

1. The location of your application code, Azure Function, and build output is part of the 
   `azure-static-web-apps-xxx-xxx-xxx.yml` workflow file located in the `/.github/workflows` directory. This
   file is automatically created when create the Static Web app. It defines a GitHub Action to build and deploy your Static Web app.


## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Static Web Apps instance through the extension.

In the Visual Studio Code Explorer window, return to the _Static Web Apps_ section and right-click on **my-first-static-web-app** and select **Delete**.

:::image type="content" source="../../static-web-apps/media/getting-started/extension-delete.png" alt-text="Delete app":::
