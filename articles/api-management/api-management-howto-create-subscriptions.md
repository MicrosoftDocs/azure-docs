---
title: Create subscriptions in Azure API Management | Microsoft Docs
description: Learn how to create subscriptions in Azure API Management. A subscription is necessary to get subscription keys that allow access to APIs.
services: api-management
documentationcenter: ''
author: dlepow
 
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 08/03/2022
ms.author: danlep
---
# Create subscriptions in Azure API Management

When you publish APIs through Azure API Management, it's easy and common to secure access to those APIs by using subscription keys. Client applications that need to consume the published APIs must include a valid subscription key in HTTP requests when they make calls to those APIs. To get a subscription key for accessing APIs, a subscription is required. For more information about subscriptions, see [Subscriptions in Azure API Management](api-management-subscriptions.md).

This article walks through the steps for creating subscriptions in the Azure portal.

## Prerequisites

To take the steps in this article, the prerequisites are as follows:

+ [Create an API Management instance](get-started-create-service-instance.md).
+ Understand [subscriptions in API Management](api-management-subscriptions.md).



## Create a new subscription

1. Navigate to your API Management instance in the [Azure portal](https://portal.azure.com).
1. In the left menu, under **APIs**, select **Subscriptions** > **Add subscription**.
1. Provide a **Name** and optional **Display name** of the subscription.
1. Optionally, select **Allow tracing** to enable tracing for debugging and troubleshooting APIs. [Learn more](api-management-howto-api-inspector.md)

    [!INCLUDE [api-management-tracing-alert](../../includes/api-management-tracing-alert.md)]
1. Select a **Scope** of the subscription from the dropdown list. [Learn more](api-management-subscriptions.md#scope-of-subscriptions)
1. Optionally, choose if the subscription should be associated with a **User** and whether to send a notification for use with the developer portal.
1. Select **Create**.

:::image type="content" source="media/api-management-howto-create-subscriptions/create-subscription.png" alt-text="Screenshot showing how to create an API Management subscription in the portal.":::

After you create the subscription, it appears in the list on the **Subscriptions** page. Two API keys are provided to access the APIs. One key is primary, and one is secondary. 

## Next steps
Get more information on API Management:

+ Learn other [concepts](api-management-terminology.md) in API Management.
+ Follow our [tutorials](import-and-publish.md) to learn more about API Management.
+ Check our [FAQ page](api-management-faq.yml) for common questions.