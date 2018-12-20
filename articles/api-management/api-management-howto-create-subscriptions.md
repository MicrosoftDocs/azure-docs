---
title: How to create subscriptions in Azure API Management | Microsoft Docs
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
# How to create subscriptions in Azure API Management

When publishing APIs through Azure API Management, the easiest and most common way to secure access to those APIs is by using subscription keys. In other words, client applications that need to consume the published APIs must include a valid subscription key in HTTP requests when making calls to those APIs. To obtain a subscription key for accessing APIs, a subscription is required. For more information about subscriptions, see [Subscriptions in Azure API Management](api-management-subscriptions.md).

This article walks through the steps for creating subscriptions in the Azure portal.

## Prerequisites

To take the steps in this article, the prerequisites are as follows:

+ [Create an API Management instance](get-started-create-service-instance.md).
+ Understand [subscriptions in API Management](api-management-subscriptions.md).

## Create a new subscription

1. Select **Subscriptions** in the menu on the left.
2. Select **Add subscription**.
3. Provide a name of the subscription and select the scope.
4. Select **Save**.

![Flexible subscriptions](./media/api-management-subscriptions/flexible-subscription.png)

After the subscription is created, a pair of API keys, primary and secondary, are provisioned for accessing the APIs.

## Next steps
Get more information on API Management:

+ Learn other [concepts](api-management-terminology.md) in API Management.
+ Follow our [tutorials](import-and-publish.md) to learn more about API Management.
+ Check our [FAQ page](api-management-faq.md) for common questions.