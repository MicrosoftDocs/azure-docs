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
> The integration with Azure API Management requires the Static Web Apps Standard plan.
>
> Backend integration is not supported on Static Web Apps [pull request environments](review-publish-pull-requests.md).

## Prerequisites

To link an API management instance to your static web app, you need to have an existing Azure API Management resource and a static web app.

| Resource | Description |
|---|---|
| [Azure API Management](/azure/api-management/get-started-create-service-instance) | If you don't already have one, follow the steps in the [Create a new Azure API Management service instance](/azure/api-management/get-started-create-service-instance) guide. |
| [Existing static web app](getting-started.md) | If you don't already have one, follow the steps in the [getting started](getting-started.md) guide to create a *No Framework* static web app. |

## Example

Consider an existing Azure API Management instance that exposes an endpoint via the following location.

```url
https://my-api-management-instance.azure-api.net/api/getProducts
```

Once linked, you can access that same endpoint through the `api` path from your static web app, as shown in this example URL.

```url
https://red-sea-123.azurestaticapps.net/api/getProducts
```

Both URLs point to the same API endpoint. The endpoint on the API Management instance must have the `/api` prefix, since Static Web Apps matches requests made to `/api` and proxies the entire path to the linked resource.

## Link an Azure API Management service

### Link the API Management instance to Static Web Apps

To link an Azure API Management service as the API backend for a static web app, follow these steps:

1. In the Azure portal, go to the static web app.

1. Select **APIs** from the navigation menu.

1. Locate the environment you want to link the API Management service to. Select **Link**.

1. In *Backend resource type*, select **API Management**.

1. In *Subscription*, select the subscription containing the Azure API Management service you want to link.

1. In *Resource name*, select the Azure API Management service.

1. Select **Link**.

> [!IMPORTANT]
> When the linking process is complete, requests to routes beginning with `/api` are proxied to your Azure API Management service. However, no APIs are exposed by default. See [Configure APIs to receive requests](#configure-apis-to-receive-requests) to configure an API Management product to allow the APIs you want to use.

### Configure APIs to receive requests

Azure API Management has a *products* feature that defines how APIs are surfaced. As part of the linking process, your API Management service is configured with a product named `Azure Static Web Apps - <STATIC_WEB_APP_AUTO_GENERATED_HOSTNAME> (Linked)`.

To make APIs available to your linked static web app, [add them to the product](../api-management/api-management-howto-add-products.md#add-apis-to-a-product).

1. Within the API Management instance in the portal, select the **Products** tab. 

1. Select the `Azure Static Web Apps - <STATIC_WEB_APP_AUTO_GENERATED_HOSTNAME> (Linked)` product. 

1. Select **+ Add API**.

1. Select the APIs you want to expose from your Static Web Apps, then select the **Select** link.

:::image type="content" source="media/add-api/apim-add-api.png" alt-text="Screenshot of the API Management Products API blade in the Azure portal, showing how to add an API to the product created for the Static Web Apps resource.":::

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

## Troubleshooting

If the APIs aren't associated to the API Management *product* created for the Static Web Apps resource, accessing a `/api` route in your static web app returns the following error from API management.

```json
{
  "statusCode": 401,
  "message": "Access denied due to invalid subscription key. Make sure to provide a valid key for an active subscription."
}
```

To resolve this error, configure the APIs you want to expose within your Static Web Apps to the product created for it, as detailed in the [Configure APIs to receive requests](#configure-apis-to-receive-requests) section.

## Next steps

> [!div class="nextstepaction"]
> [API overview](apis-overview.md)
