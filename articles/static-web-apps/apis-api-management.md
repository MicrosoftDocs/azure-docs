---
title: API support in Azure Static Web Apps with Azure API Management
description: Learn how to use Azure API Management with Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 12/17/2021
ms.author: cshoe
---

# API support in Azure Static Web Apps with Azure API Management

[!INCLUDE [APIs overview](../../includes/static-web-apps-apis-overview.md)]

## Overview

[Azure API Management](../api-management/api-management-key-concepts.md) is a service that allows you to create a modern API gateway for existing back-end services.

When you link your Azure API Management instance to your static web app, any requests to your static web app with a route that starts with `/api/` are proxied to the same route on the Azure API Management instance.

An Azure API Management instance can be linked to multiple static web apps at the same time. An API Management product is created for each linked static web app. Any APIs added to the product is available to the associated static web app.

All Azure API Management pricing tiers are available for use with Azure Static Web Apps.

> [!NOTE]
> Currently, you cannot link an API Management instance to a Static Web Apps [pre-production environment](review-publish-pull-requests.md).

## Link an Azure API Management instance

To link an Azure API Management instance as the API backend for a static web app, follow these steps:

1. In the Azure portal, navigate to the static web app.

1. Select **APIs** from the navigation menu.

1. Locate the environment you want to link the API Management instance to. Select **Link**.

1. In *Backend resource type*, select **API Management**.

1. In *Subscription*, select the subscription containing the Azure API Management instance you want to link.

1. In *Resource name*, select the Azure API Management instance.

1. Select **Link**.

When the linking process is complete, requests to routes beginning with `/api/` are proxied to your Azure API Management instance.

### Manage access to APIs

Azure API Management has a feature named *products* that defines how APIs are surfaced. As part of the linking process, your API Management instance is configured with a product named `Azure Static Web Apps - <STATIC_WEB_APP_AUTO_GENERATED_HOSTNAME> (Linked)`. To make APIs available to your linked static web app, add them to this product.

The linking process also automatically configures your API Management instance with the following:

* The product associated with the linked static web app is configured to require a subscription.
* A subscription named `Azure Static Web Apps - <STATIC_WEB_APP_AUTO_GENERATED_HOSTNAME> (Linked)` is created. It's scoped to the product with the same name.
* An inbound *validate-jwt* policy is added to the product to allow only requests that contain a valid access token from the linked static web app.
* The linked static web app is configured to include the subscription's primary key and a valid access token when proxying requests to the API Management instance.

> [!IMPORTANT]
> Changing the *validate-jwt* policy or regenerating the subscription's primary key will prevent your static web app from proxying requests to the API Management instance. Do not modify or delete the subscription or product associated with your static web app while they are linked.

## Re-link an Azure API Management instance

The re-link action regenerates the subscription keys and ensures the link between the static web app and the Azure API Management instance is correctly configured.

There are two reasons to re-link an Azure API Management instance:

* You want to regenerate the primary and secondary keys of the subscription associated with the linked static web app without downtime.

* You've made changes to your API Management instance and it is no longer accessible from the linked static web app.

To re-link an Azure API Management instance as the API backend for a static web app, follow these steps:

1. In the Azure portal, navigate to the static web app.

1. Select **APIs** from the navigation menu.

    Confirm that the static web app is linked to the correct Azure API Management instance.

1. Select **Re-link**.

## Unlink an Azure API Management instance

To unlink an Azure API Management instance from a static web app, follow these steps:

1. In the Azure portal, navigate to the static web app.

1. Locate the environment that you want to unlink and select **Unlink**.

When the unlinking process is complete, requests to routes beginning with `/api/` are no longer proxied to your API Management instance.

> [!NOTE]
> The product and subscription associated with the linked static web app are not automatically deleted. You can delete them from the API Management instance.

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
