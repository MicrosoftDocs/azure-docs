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

Azure Static Web Apps provides API integration to allow you to build front end web applications that depend on backend APIs for data and services. The two API integration options are: managed functions and bring your own backends. For more information on the differences between these options, see the [overview](apis-functions.md).

This article demonstrates how to link an existing Azure Functions app to an Azure Static Web Apps resource.

> [!NOTE]
> The integration with Azure Functions requires the Static Web Apps Standard plan.
>
> Backend integration is not supported on Static Web Apps [pull request environments](review-publish-pull-requests.md).

## Prerequisites

To link a function app to your static web app, you need to have an existing Azure Functions resource and a static web app.

| Resource | Description |
|---|---|
| [Azure Functions](/azure/azure-functions/functions-get-started) | If you don't already have one, follow the steps in the [Getting started with Azure Functions](/azure/azure-functions/functions-get-started) guide. |
| [Existing static web app](getting-started.md) | If you don't already have one, follow the steps in the [getting started](getting-started.md) guide to create a *No Framework* static web app. |

## Example

Consider an existing Azure Functions app that exposes an endpoint via the following location.

```url
https://my-functions-app.azurewebsites.net/api/getProducts
```

Once linked, you can access that same endpoint through the `api` path from your static web app, as shown in this example URL.

```url
https://red-sea-123.azurestaticapps.net/api/getProducts
```

Both endpoint URLs point to the same function. The endpoint on the function app must have the `/api` prefix, since Static Web Apps matches requests made to `/api` and proxies the entire path to the linked resource.

## Link an existing Azure Functions app

### Remove managed functions from your Static Web Apps resource (if present)

Before you associate an existing Functions app, you first need to adjust the configuration of your static web app to remove managed functions if you have any.

1. Set `api_location` value to an empty string (`""`) in the [workflow configuration](./build-configuration.md) file.

### Link the Azure Functions app to the Static Web Apps resource

1. Open your Static Web Apps instance in the [Azure portal](https://portal.azure.com).

1. From the _Settings_ menu, select **APIs**.

1. From the _Production_ row, select **Link** to open the *Link new Backend* window.

    Enter the following settings.

    | Setting | Value |
    |--|--|
    | Backend resource type | Select **Function App**. |
    | Subscription | Select your Azure subscription name. |
    | Resource name | Select the Azure Functions app name. |
    | Backend slot | Select the slot name for the Azure Function. |

1. Select **Link**.

The Azure Functions app is now mapped to the `/api` route of your static web app.

> [!IMPORTANT]
> Make sure to set the `api_location` value to an empty string (`""`) in the [workflow configuration](./build-configuration.md) file before you link an existing Functions application. Also, calls assume that the external function app retains the default `api` route prefix. Many apps remove this prefix in the *host.json*. Make sure the prefix is in place in the configuration, otherwise the call fails.

## Deployment

You're responsible for setting up a [deployment workflow](../azure-functions/functions-deployment-technologies.md) for your Azure Functions app.

## Unlink an Azure Functions app

### Unlink Functions app from Static Web Apps

To unlink a function app from a static web app, follow these steps:

1. In the Azure portal, go to the static web app.

1. Select **APIs** from the navigation menu.

1. Locate the environment that you want to unlink and select the function app name.

1. Select **Unlink**.

When the unlinking process is complete, requests to routes beginning with `/api` are no longer proxied to your Azure Functions app.

> [!NOTE]
> To prevent accidentally exposing your function app to anonymous traffic, the identity provider created by the linking process is not automatically deleted. You can delete the identity provider named *Azure Static Web Apps (Linked)* from the function app's authentication settings.

### Remove authentication from the Azure Functions resource

To enable your Azure Functions app to receive anonymous traffic, follow these steps to remove the identity provider:

1. In the Azure portal, navigate to the Azure Functions resource.

1. Select **Authentication** from the navigation menu.

1. From the list of **Identity providers**, delete the identity provider related to the Static Web Apps resource.

1. Select **Remove authentication** to remove authentication and allow anonymous traffic to your Azure Functions resource.

Your function app is now able to receive anonymous traffic.

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
- Not supported in Static Web Apps pull request environments.
- While your Azure Functions app may respond to various triggers, the static web app can only access functions via Http endpoints.

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
