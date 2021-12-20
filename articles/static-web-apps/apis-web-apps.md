---
title: API support in Azure Static Web Apps with Azure Web Apps
description: Learn how to use Azure Web Apps with Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 12/17/2021
ms.author: cshoe
---

# API support in Azure Static Web Apps with Azure Web Apps

[!INCLUDE [APIs overview](../../includes/static-web-apps-apis-overview.md)]

## Overview

[Azure Web Apps](../app-service/overview.md) is a managed platform for hosting web applications that execute code on servers. It supports many runtimes and frameworks including Node.js, ASP.NET Core, PHP, Java, and Python.

When you link your Azure Web Apps instance to your static web app, any requests to your static web app with a route that starts with `/api/` are proxied to the same route on the Azure Web Apps instance.

By default, when a Web Apps instance is linked to a static web app, the Web Apps instance only accepts requests that are proxied through the linked static web app. An Azure Web Apps instance can be linked to a single static web app at a time.

All Azure Web Apps hosting plans are available for use with Azure Static Web Apps.

> [!NOTE]
> Currently, you cannot link a Web Apps instance to a Static Web Apps [pre-production environment](review-publish-pull-requests.md).

## Link an Azure Web Apps instance

To link an Azure Web Apps instance as the API backend for a static web app, follow these steps:

1. In the Azure portal, navigate to the static web app.

1. Select **APIs** from the navigation menu.

1. In *API Source*, select **Azure Web Apps**.

1. In *Subscription*, select the subscription containing the Azure Web Apps instance you want to link.

1. In *Resource*, select the Azure Web Apps instance.

1. Select **Link**.

When the linking process is complete, requests to routes beginning with `/api/` are proxied to the linked Web Apps instance.

### Manage access to Azure Web Apps

Your Web Apps instance is configured with an identity provider named `Azure Static Web Apps (Linked)` that permits only traffic that is proxied through the static web app. To make your Web Apps instance accessible to other applications, update its authentication configuration to add another identity provider or change the security settings to allow unauthenticated access.

## Unlink an Azure Web Apps instance

To unlink an Azure Web Apps instance from a static web app, follow these steps:

1. In the Azure portal, navigate to the static web app.

1. Select **APIs** from the navigation menu.

1. Select **Unlink**.

When the unlinking process is complete, requests to routes beginning with `/api/` are no longer proxied to your Web Apps instance.

> [!NOTE]
> To prevent accidentally exposing your Web Apps instance to anonymous traffic, the identity provider created by the linking process is not automatically deleted. You can delete the identity provider named *Azure Static Web Apps (Linked)* from the Web Apps instance's authentication settings.

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
