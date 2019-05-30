---
title: Azure API Management overview and key concepts | Microsoft Docs
description: Learn about APIs, products, roles, groups, and other API Management key concepts.
services: api-management
documentationcenter: ''
author: vladvino
manager: erikre
editor: ''
 
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 11/15/2017
ms.author: apimpm
ms.custom: mvc
---

# About API Management

API Management (APIM) is a way to create consistent and modern API gateways for existing back-end services.

API Management helps organizations publish APIs to external, partner, and internal developers to unlock the potential of their data and services. Businesses everywhere are looking to extend their operations as a digital platform, creating new channels, finding new customers and driving deeper engagement with existing ones. API Management provides the core competencies to ensure a successful API program through developer engagement, business insights, analytics, security, and protection. You can use Azure API Management to take any backend and launch a full-fledged API program based on it.

This article provides an overview of common scenarios that involve APIM.  It also gives a brief overview of the APIM system's main components. The article, then, gives a more detailed overview of each component.

## Overview

To use API Management, administrators create APIs. Each API consists of one or more operations, and each API can be added to one or more products. To use an API, developers subscribe to a product that contains that API, and then they can call the API's operation, subject to any usage policies that may be in effect. Common scenarios include:

* **Securing mobile infrastructure** by gating access with API keys, preventing DOS attacks by using throttling, or using advanced security policies like JWT token validation.
* **Enabling ISV partner ecosystems** by offering fast partner onboarding through the developer portal and building an API facade to decouple from internal implementations that are not ripe for partner consumption.
* **Running an internal API program** by offering a centralized location for the organization to communicate about the availability and latest changes to APIs, gating access based on organizational accounts, all based on a secured channel between the API gateway and the backend.

The system is made up of the following components:

* The **API gateway** is the endpoint that:
  
  * Accepts API calls and routes them to your backends.
  * Verifies API keys, JWT tokens, certificates, and other credentials.
  * Enforces usage quotas and rate limits.
  * Transforms your API on the fly without code modifications.
  * Caches backend responses where set up.
  * Logs call metadata for analytics purposes.
* The **Azure portal** is the administrative interface where you set up your API program. Use it to:
  
  * Define or import API schema.
  * Package APIs into products.
  * Set up policies like quotas or transformations on the APIs.
  * Get insights from analytics.
  * Manage users.
* The **Developer portal** serves as the main web presence for developers, where they can:
  
  * Read API documentation.
  * Try out an API via the interactive console.
  * Create an account and subscribe to get API keys.
  * Access analytics on their own usage.

For more information, see the [Cloud-based API Management: Harnessing the Power of APIs](https://j.mp/ms-apim-whitepaper) PDF whitepaper. This introductory whitepaper on API Management by CITO Research covers: 
 
 * Common API requirements and challenges
 * Decoupling APIs and presenting facades
 * Getting developers up and running quickly
 * Securing access
 * Analytics and metrics
 * Gaining control and insight with an API Management platform
 * Using cloud vs on-premises solutions
 * Azure API Management
 
## <a name="apis"> </a>APIs and operations
APIs are the foundation of an API Management service instance. Each API represents  a set of operations available to developers. Each API contains a reference to the back-end service that implements the API, and its operations map to the operations implemented by the back-end service. Operations in API Management are highly configurable, with control over URL mapping, query and path parameters, request and response content, and operation response caching. Rate limit, quotas, and IP restriction policies can also be implemented at the API or individual operation level.

For more information, see [How to create APIs][How to create APIs] and [How to add operations to an API][How to add operations to an API].

## <a name="products"> </a> Products
Products are how APIs are surfaced to developers. Products in API Management have one or more APIs, and are configured with a title, description, and terms of use. Products can be **Open** or **Protected**. Protected products must be subscribed to before they can be used, while open products can be used without a subscription. When a product is ready for use by developers, it can be published. Once it is published, it can be viewed (and in the case of protected products subscribed to) by developers. Subscription approval is configured at the product level and can either require administrator approval, or be auto-approved.

Groups are used to manage the visibility of products to developers. Products grant visibility to groups, and developers can view and subscribe to the products that are visible to the groups in which they belong. 

## <a name="groups"> </a> Groups
Groups are used to manage the visibility of products to developers. API Management has the following immutable system groups:

* **Administrators** - Azure subscription administrators are members of this group. Administrators manage API Management service instances, creating the APIs, operations, and products that are used by developers.
* **Developers** - Authenticated developer portal users fall into this group. Developers are the customers that build applications using your APIs. Developers are granted access to the developer portal and build applications that call the operations of an API.
* **Guests** - Unauthenticated developer portal users, such as prospective customers visiting the developer portal of an API Management instance fall into this group. They can be granted certain read-only access, such as the ability to view APIs but not call them.

In addition to these system groups, administrators can create custom groups or [leverage external groups in associated Azure Active Directory tenants](api-management-howto-aad.md). Custom and external groups can be used alongside system groups in giving developers visibility and access to API products. For example, you could create one custom group for developers affiliated with a specific partner organization and allow them access to the APIs from a product containing relevant APIs only. A user can be a member of more than one group.

For more information, see  [How to create and use groups][How to create and use groups].

## <a name="developers"> </a> Developers
Developers represent the user accounts in an API Management service instance. Developers can be created or invited to join by administrators, or they can sign up from the [Developer portal][Developer portal]. Each developer is a member of one or more groups, and can subscribe to the products that grant visibility to those groups.

When developers subscribe to a product, they are granted the primary and secondary key for the product. This key is used when making calls into the product's APIs.

For more information, see [How to create or invite developers][How to create or invite developers] and [How to associate groups with developers][How to associate groups with developers].

## <a name="policies"> </a> Policies
Policies are a powerful capability of API Management that allow the Azure portal to change the behavior of the API through configuration. Policies are a collection of statements that are executed sequentially on the request or response of an API. Popular statements include format conversion from XML to JSON and call rate limiting to restrict the number of incoming calls from a developer, and many other policies are available.

Policy expressions can be used as attribute values or text values in any of the API Management policies, unless the policy specifies otherwise. Some policies such as the [Control flow](/azure/api-management/api-management-advanced-policies#choose) and [Set variable](/azure/api-management/api-management-advanced-policies#set-variable) policies are based on policy expressions. For more information, see [Advanced policies](/azure/api-management/api-management-advanced-policies#AdvancedPolicies) and [Policy expressions](/azure/api-management/api-management-policy-expressions).


For a complete list of API Management policies, see [Policy reference][Policy reference]. For more information on using and configuring policies, see [API Management policies][API Management policies]. For a tutorial on creating a product with rate limit and quota policies, see [How create and configure advanced product settings][How create and configure advanced product settings].


## <a name="developer-portal"> </a> Developer portal
The developer portal is where developers can learn about your APIs, view and call operations, and subscribe to products. Prospective customers can visit the developer portal, view APIs and operations, and sign up. The URL for your developer portal is located on the dashboard in the Azure portal for your API Management service instance.

You can customize the look and feel of your developer portal by adding custom content, customizing styles, and adding your branding.

## API Management and the API economy

To learn more about API Management, watch the following presentation from the Microsoft Ignite 2017 conference.

> [!VIDEO https://channel9.msdn.com/Events/Ignite/Microsoft-Ignite-Orlando-2017/BRK2186/player]
> 
> 

## Next steps

Complete the following quickstart and start using Azure API Management:

> [!div class="nextstepaction"]
> [Create an Azure API Management instance](get-started-create-service-instance.md)

[APIs and operations]: #apis
[Products]: #products
[Groups]: #groups
[Developers]: #developers
[Policies]: #policies
[Developer portal]: #developer-portal

[How to create APIs]: api-management-howto-create-apis.md
[How to add operations to an API]: api-management-howto-add-operations.md
[How to create and publish a product]: api-management-howto-add-products.md
[How to create and use groups]: api-management-howto-create-groups.md
[How to associate groups with developers]: api-management-howto-create-groups.md#associate-group-developer
[How create and configure advanced product settings]: transform-api.md
[How to create or invite developers]: api-management-howto-create-or-invite-developers.md
[Policy reference]: api-management-policy-reference.md
[API Management policies]: api-management-howto-policies.md
[Create an API Management service instance]: get-started-create-service-instance.md




