---
title: API support in Azure Static Web Apps with Azure Container Apps
description: Learn how to use Azure Container Apps with Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 06/14/2022
ms.author: cshoe
---

# API support in Azure Static Web Apps with Azure Container Apps

[Azure Container Apps](../container-apps/overview.md) is a managed platform for hosting serverless containers and microservices.

When you link your container app to your static web app, any requests to your static web app with a route that starts with `/api` are proxied to the same route on the container app.

By default, when a container app is linked to a static web app, the container app only accepts requests that are proxied through the linked static web app. A container app can be linked to a single static web app at a time.

[!INCLUDE [APIs overview](../../includes/static-web-apps-apis-overview.md)]

> [!NOTE]
> The integration with Azure Container Apps is currently in preview and requires the Static Web Apps Standard plan.
>
> You cannot link a container app to a Static Web Apps [pull request environment](review-publish-pull-requests.md).

## Link a container app

To link a container app as the API backend for a static web app, follow these steps:

1. In the Azure portal, go to the static web app.

1. Select **APIs** from the navigation menu.

1. Locate the environment you want to link the API Management instance to. Select **Link**.

1. In *Backend resource type*, select **Container App**.

1. In *Subscription*, select the subscription containing the container app you want to link.

1. In *Resource name*, select the container app.

1. Select **Link**.

When the linking process is complete, requests to routes beginning with `/api` are proxied to the linked container app.

### Manage access to the container app

Your container app is configured with an identity provider named `Azure Static Web Apps (Linked)` that permits only traffic that is proxied through the static web app. To make your container app accessible to other applications, update its authentication configuration to add another identity provider or change the security settings to allow unauthenticated access.

## Unlink a container app

To unlink a container app from a static web app, follow these steps:

1. In the Azure portal, go to the static web app.

1. Select **APIs** from the navigation menu.

1. Locate the environment that you want to unlink and select the container app name.

1. Select **Unlink**.

When the unlinking process is complete, requests to routes beginning with `/api` are no longer proxied to your container app.

> [!NOTE]
> To prevent accidentally exposing your container app to anonymous traffic, the identity provider created by the linking process is not automatically deleted. You can delete the identity provider named *Azure Static Web Apps (Linked)* from the container app's authentication settings.

## Next steps

> [!div class="nextstepaction"]
> [API overview](apis-overview.md)
