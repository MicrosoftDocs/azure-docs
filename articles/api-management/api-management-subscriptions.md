---
title: Subscriptions in Azure API Management | Microsoft Docs
description: Learn about the concept of subscriptions in Azure API Management.
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
# Subscriptions in Azure API Management

Subscriptions are an important concept in Azure API Management. They're the most common way for API consumers to get access to APIs published through an API Management instance. This article provides an overview of the concept.

## What are subscriptions?

When you publish APIs through API Management, it's easy and common to secure access to those APIs by using subscription keys. Developers who need to consume the published APIs must include a valid subscription key in HTTP requests when they make calls to those APIs. Otherwise, the calls are rejected immediately by the API Management gateway. They aren't forwarded to the back-end services.

To get a subscription key for accessing APIs, a subscription is required. A subscription is essentially a named container for a pair of subscription keys. Developers who need to consume the published APIs can get subscriptions. And they don't need approval from API publishers. API publishers can also create subscriptions directly for API consumers.

> [!TIP]
> API Management also supports other mechanisms for securing access to APIs, including the following examples:
> - [OAuth2.0](api-management-howto-protect-backend-with-aad.md)
> - [Client certificates](api-management-howto-mutual-certificates-for-clients.md)
> - [IP whitelisting](https://docs.microsoft.com/azure/api-management/api-management-access-restriction-policies#RestrictCallerIPs)

## Scope of subscriptions

Subscriptions can be associated with various scopes: product, all APIs, or an individual API.

### Subscriptions for a product

Traditionally, subscriptions in API Management were always associated with a single [API product](api-management-terminology.md) scope. Developers found the list of products on the Developer Portal. Then they'd submit subscription requests for the products they wanted to use. After a subscription request is approved, either automatically or by API publishers, the developer can use the keys in it to access all APIs in the product.At present, developer portal only shows the product-scope subscriptions under user profile section. 

![Product subscriptions](./media/api-management-subscriptions/product-subscription.png)

> [!TIP]
> Under certain scenarios, API publishers might want to publish an API product to the public without the requirement of subscriptions. They can deselect the **Require subscription** option on the **Settings** page of the product in the Azure portal. As a result, all APIs under the product can be accessed without an API key.

### Subscriptions for all APIs or an individual API

When we introduced the [Consumption](https://aka.ms/apimconsumptionblog) tier of API Management, we made a few changes to streamline key management:
- First, we added two more subscription scopes: all APIs and a single API. The scope of subscriptions is no longer limited to an API product. It's now possible to create keys that grant access to an API, or all APIs within an API Management instance, without needing to create a product and add the APIs to it first. Also, each API Management instance now comes with an immutable, all-APIs subscription. This subscription makes it easier and more straightforward to test and debug APIs within the test console.

- Second, API Management now allows **standalone** subscriptions. Subscriptions are no longer required to be associated with a developer account. This feature is useful in scenarios such as when several developers or teams share a subscription.

- Finally, API publishers can now [create subscriptions](api-management-howto-create-subscriptions.md) directly in the Azure portal:

    ![Flexible subscriptions](./media/api-management-subscriptions/flexible-subscription.png)

## Next steps
Get more information on API Management:

+ Learn other [concepts](api-management-terminology.md) in API Management.
+ Follow our [tutorials](import-and-publish.md) to learn more about API Management.
+ Check our [FAQ page](api-management-faq.md) for common questions.
