---
title: Create Subscriptions in Azure API Management
description: Learn how to create subscriptions in Azure API Management to secure access to APIs by using subscription keys.
services: api-management
author: dlepow
 
ms.service: azure-api-management
ms.topic: how-to
ms.date: 09/30/2025
ms.author: danlep
---
# Create subscriptions in Azure API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

When you publish APIs through Azure API Management, it's easy and common to secure access to those APIs by using subscription keys. Client applications that need to consume the published APIs must include a valid subscription key in HTTP requests when they make calls to those APIs. To get a subscription key for accessing APIs, a subscription is required. For more information about subscriptions, see [Subscriptions in Azure API Management](api-management-subscriptions.md).

This article walks through the steps for creating subscriptions in the Azure portal.

> [!IMPORTANT]
> The **Allow tracing** setting in subscriptions to enable debug traces is deprecated. To improve security, tracing can now be enabled for specific API requests to API Management. To learn more, see [Enable tracing for an API](api-management-howto-api-inspector.md#enable-tracing-for-an-api).

## Prerequisites

To take the steps in this article, the prerequisites are as follows:

* [Create an API Management instance](get-started-create-service-instance.md).
* Understand [subscriptions in API Management](api-management-subscriptions.md).

## Create a new subscription

1. Navigate to your API Management instance in the [Azure portal](https://portal.azure.com).
1. Under **APIs** in the sidebar menu, select **Subscriptions**, then choose **Add subscription**.
1. Provide a **Name** and optional **Display name** for the subscription.
1. Select a **Scope** of the subscription from the dropdown list. To learn more, see [Scope of subscriptions](api-management-subscriptions.md#scope-of-subscriptions).
1. Optionally, choose if the subscription should be associated with a **User** and whether to send a notification for use with the developer portal.
1. Select **Create**.

:::image type="content" source="media/api-management-howto-create-subscriptions/create-subscription.png" alt-text="Screenshot showing how to create an API Management subscription in the portal." lightbox="media/api-management-howto-create-subscriptions/create-subscription.png":::

After you create the subscription, it appears in the list on the **Subscriptions** page. Two API keys are provided to access the APIs. One key is primary, and one is secondary. 

## Related content

* [Azure API Management terminology](api-management-terminology.md)
* [Tutorial: Import and publish your first API](import-and-publish.md)
* [Azure API Management FAQs](api-management-faq.yml)
