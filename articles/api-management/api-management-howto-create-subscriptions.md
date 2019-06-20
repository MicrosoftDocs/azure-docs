---
title: Create subscriptions in Azure API Management | Microsoft Docs
description: Learn how to create subscriptions in Azure API Management.
services: api-management
documentationcenter: ''
author: miaojiang
manager: cfowler
editor: ''
 
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/14/2018
ms.author: apimpm
---
# Create subscriptions in Azure API Management

When you publish APIs through Azure API Management, it's easy and common to secure access to those APIs by using subscription keys. Client applications that need to consume the published APIs must include a valid subscription key in HTTP requests when they make calls to those APIs. To get a subscription key for accessing APIs, a subscription is required. For more information about subscriptions, see [Subscriptions in Azure API Management](api-management-subscriptions.md).

This article walks through the steps for creating subscriptions in the Azure portal.

## Prerequisites

To take the steps in this article, the prerequisites are as follows:

+ [Create an API Management instance](get-started-create-service-instance.md).
+ Understand [subscriptions in API Management](api-management-subscriptions.md).

## Create a new subscription

1. Select **Subscriptions** in the menu on the left.
2. Select **Add subscription**.
3. Provide a name of the subscription and select the scope.
4. Optionally, choose if the subscription should be associated with a user.
5. Select **Save**.

![Flexible subscriptions](./media/api-management-subscriptions/flexible-subscription.png)

After you create the subscription, two API keys are provided to access the APIs. One key is primary, and one is secondary. 

## Next steps
Get more information on API Management:

+ Learn other [concepts](api-management-terminology.md) in API Management.
+ Follow our [tutorials](import-and-publish.md) to learn more about API Management.
+ Check our [FAQ page](api-management-faq.md) for common questions.