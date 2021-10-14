---
title: Subscriptions in Azure API Management | Microsoft Docs
description: Learn about the concept of subscriptions in Azure API Management. Consumers get access to APIs by using subscriptions in Azure API Management.
services: api-management
documentationcenter: ''
author: dlepow
manager: cfowler
editor: ''
 
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 08/27/2021
ms.author: danlep
---
# Subscriptions in Azure API Management

In Azure API Management, subscriptions are the most common way for API consumers to access APIs published through an API Management instance. This article provides an overview of the concept.

## What are subscriptions?

By publishing APIs through API Management, you can easily secure API access using subscription keys. Consume the published APIs by including a valid subscription key in the HTTP requests when calling to those APIs. Without a valid subscription key, the calls will:
* Be rejected immediately by the API Management gateway. 
* Not be forwarded to the back-end services.

To access APIs, you'll need a subscription and a subscription key. A *subscription* is a named container for a pair of subscription keys. 

Regularly regenerating keys is a common security precaution, so most Azure products requiring a subscription key will generate keys in pairs. Each application using the service can switch from *key A* to *key B* and regenerate key A with minimal disruption, and vice versa. 

In addition,

* Developers can get subscriptions without approval from API publishers. 
* API publishers can create subscriptions directly for API consumers.

> [!TIP]
> API Management also supports other mechanisms for securing access to APIs, including the following examples:
> - [OAuth2.0](api-management-howto-protect-backend-with-aad.md)
> - [Client certificates](api-management-howto-mutual-certificates-for-clients.md)
> - [Restrict caller IPs](./api-management-access-restriction-policies.md#RestrictCallerIPs)

## Scope of subscriptions

Subscriptions can be associated with various scopes: product, all APIs, or an individual API.

### Subscriptions for a product

Traditionally, subscriptions in API Management were associated with a single [API product](api-management-terminology.md) scope. Developers:
* Found the list of products on the developer portal. 
* Submitted subscription requests for the products they wanted to use. 
* Use the keys in those subscriptions (approved either automatically or by API publishers) to access all APIs in the product. 
    * You can access APIs with or without the subscription key regardless of subscription scope (product, global, or API).

Currently, the developer portal only shows the product scope subscriptions under the **User Profile** section. 

> [!NOTE]
> If you are using an API-scoped subscription key, any *policies* configured at the product scope are not applied to that subscription.

![Product subscriptions](./media/api-management-subscriptions/product-subscription.png)

> [!TIP]
> Under certain scenarios, API publishers might want to publish an API product to the public without the requirement of subscriptions. They can deselect the **Require subscription** option on the **Settings** page of the product in the Azure portal. As a result, all APIs under the product can be accessed without an API key.

### Subscriptions for all APIs or an individual API

With the addition of the [Consumption](https://aka.ms/apimconsumptionblog) tier of API Management, subscription key management become more streamlined. 

#### Two more subscription scopes

Now that subscription scopes are no longer limited to an API product, you can create keys that grant access to either:
* a single API, or 
* All APIs within an API Management instance. 

You won't need to create a product before adding APIs to it. 

Each API Management instance now comes with an immutable, all-APIs subscription. This subscription makes it easier and more straightforward to test and debug APIs within the test console.

#### Standalone subscriptions

API Management now allows *standalone* subscriptions. You no longer need to associate subscriptions with a developer account. This feature proves useful in scenarios similar to several developers or teams sharing a subscription.

Creating a subscription without assigning an owner makes it a standalone subscription. To grant developers and the rest of your team access to the standalone subscription key, either:
* Manually share the subscription key.
* Use a custom system to make the subscription key available to your team.

#### Creating subscriptions in Azure portal

API publishers can now [create subscriptions](api-management-howto-create-subscriptions.md) directly in the Azure portal:

![Flexible subscriptions](./media/api-management-subscriptions/flexible-subscription.png)

## Next steps
Get more information on API Management:

+ Learn other [concepts](api-management-terminology.md) in API Management.
+ Follow our [tutorials](import-and-publish.md) to learn more about API Management.
+ Check our [FAQ page](api-management-faq.yml) for common questions.
