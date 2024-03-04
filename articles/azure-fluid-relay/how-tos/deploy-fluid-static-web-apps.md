---
title: 'How to: Deploy Fluid applications using Azure Static Web Apps'
description: Detailed explanation about how Fluid applications can be hosted on Azure Static Web Apps
author: sonalivdeshpande
ms.author: sdeshpande
ms.date: 07/18/2022
ms.topic: article
ms.service: azure-fluid
---

# How to: Deploy Fluid applications using Azure Static Web Apps

This article demonstrates how to deploy Fluid apps using Azure Static Web Apps. The [FluidHelloWorld](https://github.com/microsoft/FluidHelloWorld/tree/main-azure) repository contains a Fluid application called **DiceRoller** that enables all connected clients to roll a die and view the result.  In this how-to, you deploy the DiceRoller application to Azure Static Web Apps using the Visual Studio Code extension.

If you don't have an Azure subscription, [create a free trial account](https://azure.microsoft.com/free).

## Prerequisites

- [GitHub](https://github.com) account
- [Azure](https://portal.azure.com) account
- [Visual Studio Code](https://code.visualstudio.com)
- [Azure Static Web Apps extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps)
- [Install Git](https://www.git-scm.com/downloads)

[!INCLUDE [fork-fluidhelloworld](../includes/fork-fluidhelloworld.md)]

## Connect to Azure Fluid Relay

You can connect to Azure Fluid Relay by providing the tenant ID and key that is uniquely generated for you when creating the Azure resource. You can build your own token provider implementation or you can use the two token provider implementations that the Fluid Framework provides an [AzureFunctionTokenProvider](https://fluidframework.com/docs/apis/azure-client/azurefunctiontokenprovider-class).

To learn more about using InsecureTokenProvider for local development, see [Connecting to the service](connect-fluid-azure-service.md#connecting-to-the-service) and [Authentication and authorization in your app](../concepts/authentication-authorization.md#the-token-provider).

### Using AzureFunctionTokenProvider

**AzureFunctionTokenProvider** is a token provider that does not expose the secret key in client-side code and can be used in production scenarios. This token provider implementation can be used to fetch a token from an HTTPS endpoint that is responsible for signing access tokens with the tenant key. This provides a secure way to generate the token and pass it back to the client app.

```js
import { AzureClient, AzureFunctionTokenProvider } from "@fluidframework/azure-client";

const config = {
    tenantId: "myTenantId",
    tokenProvider: new AzureFunctionTokenProvider("https://myAzureAppUrl"+"/api/GetAzureToken", { userId: "test-user",userName: "Test User" }),
    endpoint: "https://myServiceEndpointUrl",
    type: "remote",
};

const clientProps = {
    connection: config,
};

const client = new AzureClient(clientProps);
```

In order to use this token provider, you need to deploy an HTTPS endpoint that will sign tokens, and pass the URL to your endpoint to the AzureFunctionTokenProvider.

### Deploying an Azure Function using Azure Static Web apps

Azure Static Web Apps allows you to develop a full-stack web site without needing to deal with the server-side configuration of an entire web hosting environment. You can deploy Azure Functions alongside your static website. Using this capability, you can deploy an HTTP-triggered Azure Function that will sign tokens.

For more information about deploying Azure Function-powered APIs to your static web app see [Add an API to Azure Static Web Apps with Azure Functions](../../static-web-apps/add-api.md).

> [!NOTE]
> You can use the example Azure Function code in [Implementing an Azure Function to sign tokens](azure-function-token-provider.md#implement-an-azure-function-to-sign-tokens) to implement your function.

Once your Azure Function is deployed, you must update the URL passed to the AzureFunctionTokenProvider.

```js
import { AzureClient } from "@fluidframework/azure-client";

const config = {
    tenantId: "myTenantId",
    tokenProvider: new AzureFunctionTokenProvider("https://myStaticWebAppUrl/api/GetAzureToken", { userId: "test-user",userName: "Test User" }),
    endpoint: "https://myServiceEndpointUrl",
    type: "remote",
};

const clientProps = {
    connection: config,
};

const client = new AzureClient(config);
```

Run the `npm run build` command from the root directory to rebuild the app. This will generate a `dist` folder with the application code that should be deployed to the Static Web app.

[!INCLUDE [sign-in-extensions](../includes/sign-in-extensions.md)]

## Create a static web app

1. Inside Visual Studio Code, select the Azure logo in the Activity Bar to open the Azure extensions window.

    :::image type="content" source="../images/extension-azure-logo.png" alt-text="An image of the Azure Logo on a white background.":::

    > [!NOTE]
    > You must sign in to Azure and GitHub in Visual Studio Code to continue. If you are not already authenticated, the extension will prompt you to sign in to both services during the creation process.

1. Select <kbd>F1</kbd> to open the Visual Studio Code command palette.

1. Enter **Create static web app** in the command box.

1. Select *Azure Static Web Apps: Create static web app...* and select **Enter**.

    # [No Framework](#tab/vanilla-javascript)

    | Setting | Value |
    | --- | --- |
    | Name | Enter **my-first-static-web-app** |
    | Region | Select the region closest to you. |
    | Build preset | Select **Custom**. |

    # [Angular](#tab/angular)

    | Setting | Value |
    | --- | --- |
    | Name | Enter **my-first-static-web-app** |
    | Region | Select the region closest to you. |
    | Build preset | Select **Custom**. |

    # [React](#tab/react)

    | Setting | Value |
    | --- | --- |
    | Name | Enter **my-first-static-web-app** |
    | Region | Select the region closest to you. |
    | Build preset | Select **Custom**. |

    # [Vue](#tab/vue)

    | Setting | Value |
    | --- | --- |
    | Name | Enter **my-first-static-web-app** |
    | Region | Select the region closest to you. |
    | Build preset | Select **Custom**. |

    ---

1. Enter the settings values for that match your framework preset choice.

    # [No Framework](#tab/vanilla-javascript)

    | Setting | Value |
    | --- | --- |
    | Location of application code | Enter **/src** |
    | Location of Azure Function code | **api** |

    # [Angular](#tab/angular)

    | Setting | Value |
    | --- | --- |
    | Location of application code | Enter **/** |
    | Location of Azure Function code | **api** |

    # [React](#tab/react)

    | Setting | Value |
    | --- | --- |
    | Location of application code | Enter **/** |
    | Location of Azure Function code | **api** |

    # [Vue](#tab/vue)

    | Setting | Value |
    | --- | --- |
    | Location of application code | Enter **/** |
    | Location of Azure Function code | **api** |

    ---

1. Once the app is created, a confirmation notification is shown in Visual Studio Code.

    :::image type="content" source="../images/extension-confirmation.png" alt-text="An image of the notification shown in Visual Studio Code when the app is created. The notification reads: Successfully created new static web app my-first-static-web-app. GitHub Actions is building and deploying your app, it will be available once the deployment completes.":::

    As the deployment is in progress, the Visual Studio Code extension reports the build status to you.

    :::image type="content" source="../images/extension-waiting-for-deployment.png" alt-text="An image of the Static Web Apps extension UI, which shows a list of static web apps under each subscription. The highlighted static web app has a status of Waiting for Deployment displayed next to it.":::

    Once the deployment is complete, you can navigate directly to your website.

1. To view the website in the browser, right-click on the project in the Static Web Apps extension, and select **Browse Site**.

    :::image type="content" source="../images/extension-browse-site.png" alt-text="An image of the menu that is shown when right-clicking on a static web app. The Browse Site option is highlighted.":::

2. The location of your application code, Azure Function, and build output is part of the `azure-static-web-apps-xxx-xxx-xxx.yml` workflow file located in the `/.github/workflows` directory. This file is automatically created when you create the Static Web app. It defines a GitHub Actions to build and deploy your Static Web app.


## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Static Web Apps instance through the extension.

In the Visual Studio Code Explorer window, return to the _Static Web Apps_ section and right-click on **my-first-static-web-app** and select **Delete**.

:::image type="content" source="../images/extension-delete.png" alt-text="An image of the menu that is shown when right-clicking on a static web app. The Delete option is highlighted.":::
