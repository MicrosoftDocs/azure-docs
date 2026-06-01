---
title: Create Subscriptions in Azure API Management
description: Learn how to create subscriptions in Azure API Management to secure access to APIs by using subscription keys.
services: api-management
author: dlepow
 
ms.service: azure-api-management
ms.topic: how-to
ms.date: 12/09/2025
ms.author: danlep
---

# Create subscriptions in Azure API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

When you publish APIs through Azure API Management, you can secure access to those APIs by using subscription keys. Client applications that need to consume the published APIs must then include a valid subscription key in HTTP requests when they make calls to those APIs. To get a subscription key for accessing APIs, you need a subscription. For more information about subscriptions, see [Subscriptions in Azure API Management](api-management-subscriptions.md).

This article walks you through the steps for creating subscriptions in the Azure portal.

> [!IMPORTANT]
> The **Allow tracing** setting in subscriptions to enable debug traces is deprecated. To improve security, you can now enable tracing for specific API requests to API Management. To learn more, see [Enable tracing for an API](api-management-howto-api-inspector.md#enable-tracing-for-an-api).

## Prerequisites

To complete the steps in this article, you need the following prerequisites:

* [Create an API Management instance](get-started-create-service-instance.md).
* Understand [subscriptions in API Management](api-management-subscriptions.md).

## Create a new subscription

> [!NOTE]
> API publishers (administrators or users with appropriate permissions to the API Management instance) create and manage subscriptions. API consumers typically request subscriptions through the developer portal or receive them directly from API publishers.

1. Go to your API Management instance in the [Azure portal](https://portal.azure.com).
1. Under **APIs** in the sidebar menu, select **Subscriptions**, then choose **Add subscription**.
1. Enter a **Name** and optional **Display name** for the subscription.
1. Select a **Scope** of the subscription from the dropdown list. For more information, see [Scope of subscriptions](api-management-subscriptions.md#scope-of-subscriptions).
1. Optionally, choose if the subscription should be associated with a **User**. 
    * If you don't associate the subscription with a specific user, it becomes a standalone subscription that can be shared among multiple developers or teams.
    * You can't directly assign subscriptions to Microsoft Entra ID security groups. To provide access to group members, create a standalone subscription and distribute the keys, or use Microsoft Entra ID authentication with policies for group-based access control.
1. Optionally, choose whether to send a notification for use with the developer portal.
1. Select **Create**.

:::image type="content" source="media/api-management-howto-create-subscriptions/create-subscription.png" alt-text="Screenshot showing how to create an API Management subscription in the portal." lightbox="media/api-management-howto-create-subscriptions/create-subscription.png":::

After you create the subscription, it appears in the list on the **Subscriptions** page. Two API keys are provided to access the APIs. One key is primary, and one is secondary. 

## Related content

* [Azure API Management terminology](api-management-terminology.md)
* [Tutorial: Import and publish your first API](import-and-publish.md)
* [Azure API Management FAQs](api-management-faq.yml)
* [Securely access products and APIs with Microsoft Entra applications](applications.md)
