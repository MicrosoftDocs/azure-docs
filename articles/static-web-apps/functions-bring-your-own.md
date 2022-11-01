---
title: Bring your own functions to Azure Static Web Apps
description: Use an existing Azure Functions app with your Azure Static Web Apps site.
ms.custom: engagement-fy23
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 10/13/2022
ms.author: cshoe
---

# Bring your own functions to Azure Static Web Apps

Azure Static Web Apps APIs are supported by two possible configurations: managed functions and bring your own functions. For more information on the differences in configurations, see the [overview](apis-functions.md).

This article demonstrates how to link an existing Azure Functions app to an Azure Static Web Apps resource.

> [!NOTE]
> Bring your own functions is only available in the Azure Static Web Apps Standard plan.

## Example

Consider an existing Azure Functions app that exposes an endpoint via the following location.

```url
https://my-functions-app.azurewebsites.net/api/getProducts
```

Once linked, you can access that same endpoint through the `api` path from your static web app, as shown in this example URL.

```url
https://red-sea-123.azurestaticapps.net/api/getProducts
```

Both endpoint URLs point to the same function.

## Link an existing Azure Functions app

Before you associate an existing Functions app, you first need to adjust to configuration of your static web app.

1. Set `api_location` value to an empty string (`""`) in the [workflow configuration](./build-configuration.md) file.

1. Open your Static Web Apps instance in the [Azure portal](https://portal.azure.com).

1. From the _Settings_ menu, select **APIs**.

1. From the _Production_ row, select **Link** to open the *Link new Backend* window.

    Enter the following settings.

    | Setting | Value |
    |--|--|
    | Backed resource type | Select **Function App**. |
    | Subscription | Select your Azure subscription name. |
    | Resource name | Select the Azure Functions app name. |

2. Select **Link**.

The Azure Functions app is now mapped to the `/api` route of your static web app.

> [!IMPORTANT]
> Make sure to set the `api_location` value to an empty string (`""`) in the [workflow configuration](./build-configuration.md) file before you link an existing Functions application. Also, calls assume that the external function app retains the default `api` route prefix. Many apps remove this prefix in the *host.json*. Make sure the prefix is in place in the configuration, otherwise the call fails.

## Deployment

You're responsible for setting up a [deployment workflow](../azure-functions/functions-deployment-technologies.md) for your Azure Functions app.

## Security constraints

- **Authentication and authorization:** If authentication and authorization policies aren't already set up on your existing Functions app, then the static web app has exclusive access to the API. To make your Functions app accessible to other applications, add another identity provider or change the security settings to allow unauthenticated access.

  > [!NOTE]
  > If you enable authentication and authorization in your linked Functions app, it must use Azure App Service Authentication and authorization provider version 2.

- **Required public accessibility:** An existing Functions app needs to not apply the following security configurations.
  - Restricting the IP address of the Functions app.
  - Restricting traffic through private link or service endpoints.

- **Function access keys:** If your function requires an [access key](../azure-functions/security-concepts.md#function-access-keys), then you must provide the key with calls from the static app to the API.

## Restrictions

- Only one Azure Functions app is available to a single static web app.
- The `api_location` value in the [workflow configuration](./build-configuration.md) must be set to an empty string.
- Only supported in the Static Web Apps production environment.
- While your Azure Functions app may respond to various triggers, the static web app can only access functions via Http endpoints.

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
