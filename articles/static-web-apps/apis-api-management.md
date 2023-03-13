---
title: API support in Azure Static Web Apps with Azure API Management
description: Learn how to use Azure API Management with Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 06/14/2022
ms.author: cshoe
---

# API support in Azure Static Web Apps with Azure API Management

[Azure API Management](../api-management/api-management-key-concepts.md) is a service that allows you to create a modern API gateway for existing back end services.

When you link your Azure API Management service to your static web app, any requests to your static web app with a route that starts with `/api` are proxied to the same route in the Azure API Management service.

An Azure API Management service can be linked to multiple static web apps at the same time. An API Management product is created for each linked static web app. Any APIs added to the product is available to the associated static web app.

All Azure API Management pricing tiers are available for use with Azure Static Web Apps.

[!INCLUDE [APIs overview](../../includes/static-web-apps-apis-overview.md)]

> [!NOTE]
> The integration with Azure API Management is currently in preview and requires the Static Web Apps Standard plan.
> 
> Currently, you cannot link an API Management service to a Static Web Apps [pull request environment](review-publish-pull-requests.md).

## Link an Azure API Management service

To link an Azure API Management service as the API backend for a static web app, follow these steps:

1. In the Azure portal, go to the static web app.

1. Select **APIs** from the navigation menu.

1. Locate the environment you want to link the API Management service to. Select **Link**.

1. In *Backend resource type*, select **API Management**.

1. In *Subscription*, select the subscription containing the Azure API Management service you want to link.

1. In *Resource name*, select the Azure API Management service.

1. Select **Link**.

When the linking process is complete, requests to routes beginning with `/api` are proxied to your Azure API Management service. However, no APIs are exposed by default. See [Manage access to APIs](#manage-access-to-apis) to configure an API Management product to allow the APIs you want to use.

### Manage access to APIs

Azure API Management has a *products* feature that defines how APIs are surfaced. As part of the linking process, your API Management service is configured with a product named `Azure Static Web Apps - <STATIC_WEB_APP_AUTO_GENERATED_HOSTNAME> (Linked)`.

Because no APIs are associated with the new API Management product, accessing a `/api` route in your static web app returns the following error from API management.

```json
{
  "statusCode": 401,
  "message": "Access denied due to invalid subscription key. Make sure to provide a valid key for an active subscription."
}
```

To make APIs available to your linked static web app, [add them to the product](../api-management/api-management-howto-add-products.md#add-apis-to-a-product).

The linking process also automatically applies the following configuration to your API Management service:

* The product associated with the linked static web app is configured to require a subscription.
* An API Management subscription named `Generated for Static Web Apps resource with default hostname: <STATIC_WEB_APP_AUTO_GENERATED_HOSTNAME>` is created and scoped to the product with the same name.
* An inbound *validate-jwt* policy is added to the product to allow only requests that contain a valid access token from the linked static web app.
* The linked static web app is configured to include the subscription's primary key and a valid access token when proxying requests to the API Management service.

> [!IMPORTANT]
> Changing the *validate-jwt* policy or regenerating the subscription's primary key prevents your static web app from proxying requests to the API Management service. Do not modify or delete the subscription or product associated with your static web app while they are linked.

## Unlink an Azure API Management service

To unlink an Azure API Management service from a static web app, follow these steps:

1. In the Azure portal, go to the static web app.

1. Locate the environment that you want to unlink and select the API Management service name.

1. Select **Unlink**.

When the unlinking process is complete, requests to routes beginning with `/api/` are no longer proxied to your API Management service.

> [!NOTE]
> The API Management product and subscription associated with the linked static web app are not automatically deleted. You can delete them from the API Management service.

## Next steps

> [!div class="nextstepaction"]
> [API overview](apis-overview.md)
