---
title: How to create Subscriptions in Azure API Management | Microsoft Docs
description: Learn how to create Subscriptions in Azure API Management.
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
# How to create Subscriptions in Azure API Management

When publishing APIs through Azure API Management (APIM), the easiest and most common way to secure access to those APIs is by using Subscription Keys. In other words, client applications that need to consume the published APIs must include a valid Subscription Key in HTTP requests when making calls to those APIs. To obtain a Subscription Key for accessing APIs, a Subscription is required. For more information about Subscriptions, see [Subscriptions in Azure API Management](api-management-subscriptions.md)

This article walks through the steps for creating Subscriptions in the Azure portal.

## Prerequisites

To complete the steps in this article, you need to:

+ [Create an APIM instance](get-started-create-service-instance.md)
+ Understand [Subscriptions in APIM](api-management-subscriptions.md)

## Create a new Subscription

1. Click on **Subscriptions** in the menu on the left
2. Click **Add subscription**
3. Provide a name of the Subscription and select the scope
4. Click **Save**

![Flexible subscriptions](./media/api-management-subscriptions/flexible-subscription.png)

Once the Subscription is created, a pair of API keys (primary and secondary) are provisioned for accessing the APIs.

## Next steps
For more information on API Management:

+ Learn other [concepts](api-management-terminology.md) in API Management
+ Follow our [tutorials](import-and-publish.md) to learn more about API Management
+ Check our [FAQ page](api-management-faq.md) for common questions