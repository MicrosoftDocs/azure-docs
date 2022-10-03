---
title: Subscriptions in Azure API Management | Microsoft Docs
description: Learn about the concept of subscriptions in Azure API Management. Consumers commonly get access to APIs by using subscriptions in Azure API Management.
services: api-management
documentationcenter: ''
author: dlepow
 
ms.service: api-management
ms.topic: conceptual
ms.date: 09/27/2022
ms.author: danlep
---
# Subscriptions in Azure API Management

In Azure API Management, *subscriptions* are the most common way for API consumers to access APIs published through an API Management instance. This article provides an overview of the concept.

## What are subscriptions?

By publishing APIs through API Management, you can easily secure API access using subscription keys. Developers who need to consume the published APIs must include a valid subscription key in HTTP requests when calling those APIs. Without a valid subscription key, the calls are:
* Rejected immediately by the API Management gateway. 
* Not forwarded to the back-end services.

To access APIs, developers need a subscription and a subscription key. A *subscription* is a named container for a pair of subscription keys. 

In addition,

* Developers can get subscriptions without needing approval from API publishers. 
* API publishers can create subscriptions directly for API consumers.

> [!TIP]
> API Management also supports other mechanisms for securing access to APIs, including the following examples:
> - [OAuth2.0](api-management-howto-protect-backend-with-aad.md)
> - [Client certificates](api-management-howto-mutual-certificates-for-clients.md)
> - [Restrict caller IPs](./api-management-access-restriction-policies.md#RestrictCallerIPs)

## Manage subscription keys

Regularly regenerating keys is a common security precaution. Like most Azure services requiring a subscription key, API Management generates keys in pairs. Each application using the service can switch from *key A* to *key B* and regenerate key A with minimal disruption, and vice versa.
> [!NOTE]
> * API Management doesn't provide built-in features to manage the lifecycle of subscription keys, such as setting expiration dates or automatically rotating keys. You can develop workflows to automate these processes using tools such as Azure PowerShell or the Azure SDKs. 
> * To enforce time-limited access to APIs, API publishers may be able to use policies with subscription keys, or use a mechanism that provides built-in expiration such as token-based authentication.

## Scope of subscriptions

Subscriptions can be associated with various scopes: [product](api-management-howto-add-products.md), all APIs, or an individual API.

### Subscriptions for a product

Traditionally, subscriptions in API Management were associated with a single [product](api-management-terminology.md) scope. Developers:
* Found the list of products on the developer portal. 
* Submitted subscription requests for the products they wanted to use. 
* Use the keys in those subscriptions (approved either automatically or by API publishers) to access all APIs in the product. 

Currently, the developer portal only shows the product scope subscriptions under the **User Profile** section. 

![Product subscriptions](./media/api-management-subscriptions/product-subscription.png)

### Subscriptions for all APIs or an individual API

You can also create keys that grant access to either:
* A single API, or 
* All APIs within an API Management instance. 

In these cases, you don't need to create a product and add APIs to it first. 

### All-access subscription

Each API Management instance comes with an immutable, all-APIs subscription (also called an *all-access* subscription). This built-in subscription makes it straightforward to test and debug APIs within the test console.

> [!WARNING]
> The all-access subscription enables access to every API in the API Management instance and should only be used by authorized users. Never use this subscription for routine API access or embed the all-access subscription key in client apps.

> [!NOTE]
> If you're using an API-scoped subscription or the all-access subscription, any [policies](api-management-howto-policies.md) configured at the product scope aren't applied to requests from that subscription.

### Standalone subscriptions

API Management also allows *standalone* subscriptions, which are not associated with a developer account. This feature proves useful in scenarios similar to several developers or teams sharing a subscription.

Creating a subscription without assigning an owner makes it a standalone subscription. To grant developers and the rest of your team access to the standalone subscription key, either:
* Manually share the subscription key.
* Use a custom system to make the subscription key available to your team.

## Create subscriptions in Azure portal

API publishers can [create subscriptions](api-management-howto-create-subscriptions.md) directly in the Azure portal. 

## How API Management handles requests with or without subscription keys

By default, a developer can only access a product or API by using a subscription key. Under certain scenarios, API publishers might want to publish a product or a particular API to the public without the requirement of subscriptions. While a publisher could choose to enable unsecured access to certain APIs, configuring another mechanism to secure client access is recommended.

> [!CAUTION]
> Use care when configuring a product or an API that doesn't require a subscription. This configuration may be overly permissive and may make an API more vulnerable to certain [API security threats](mitigate-owasp-api-threats.md#security-misconfiguration).

To disable the subscription requirement using the portal:

* **Disable requirement for product** - Disable **Requires subscription** on the **Settings** page of the product.  
* **Disable requirement for API** - Disable **Subscription required** on the **Settings** page of the API. 

After the subscription requirement is disabled, the selected API or APIs can be accessed without a subscription key.

When API Management receives an API request from a client without a subscription key, it handles the request according to these rules: 

1. Check first for the existence of a product that includes the API but doesn't require a subscription (an *open* product). If the open product exists, handle the request in the context of the APIs, policies, and access rules configured for the product. 
1. If an open product including the API isn't found, check whether the API requires a subscription. If a subscription isn't required, handle the request in the context of that API and operation.
1. If no configured product or API is found, then access is denied.

## Next steps
Get more information on API Management:

+ Learn how API Management [policies](set-edit-policies.md#configure-policies-at-different-scopes) get applied at different scopes.
+ Learn other [concepts](api-management-terminology.md) in API Management.
+ Follow our [tutorials](import-and-publish.md) to learn more about API Management.
+ Check our [FAQ page](api-management-faq.yml) for common questions.
