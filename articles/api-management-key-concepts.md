<properties 
	pageTitle="API Management key concepts" 
	description="Learn about APIs, products, roles, groups, and other API Management key concepts." 
	services="api-management" 
	documentationCenter="" 
	authors="steved0x" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="api-management" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/24/2015" 
	ms.author="sdanie"/>

#What is API Management?

API Management helps organizations publish APIs to external, partner and internal developers to unlock the potential of their data and services. Businesses everywhere are looking to extend their operations as a digital platform, creating new channels, finding new customers and driving deeper engagement with existing ones. API Management provides the core competencies to ensure a successful API program through developer engagement, business insights, analytics, security and protection.

To use API Management, administrators create APIs. Each API consists of one or more operations, and each API can be added to one or more products. To use an API, developers subscribe to a product that contains that API, and then they can call the API's operation, subject to any usage policies that may be in effect.

This topic provides an overview of API Management key concepts.

## <a name="apis"> </a>APIs and operations

APIs are the foundation of an API Management service instance. Each API represents  a set of operations available to developers. Each API contains a reference to the back-end service that implements the API, and its operations map to the operations implemented by the back-end service. Operations in API Management are highly configurable, with control over URL mapping, query and path parameters, request and response content, and operation response caching. Rate limit, quotas, and IP restriction policies can also be implemented at the API or individual operation level.

For more information, see [How to create APIs][] and [How to add operations to an API][].


## <a name="products"> </a> Products

Products are how APIs are surfaced to developers. Products in API Management have one or more APIs, and are configured with a title, description, and terms of use. Products can be **Open** or **Protected**. Protected products must be subscribed to before they can be used, while open products can be used without a subscription. When a product is ready for use by developers it can be published. Once it is published, it can be viewed (and in the case of protected products subscribed to) by developers. Subscription approval is configured at the product level and can either require administrator approval, or be auto-approved.

Groups are used to manage the visibility of products to developers. Products grant visibility to groups, and developers can view and subscribe to the products that are visible to the groups in which they belong. 

For information, see [How to create and publish a product][].

## <a name="groups"> </a> Groups

Groups are used to manage the visibility of products to developers. API Management has the following built-in groups.

-	**Administrators** - Administrators manage API Management service instances, creating the APIs, operations, and products that are used by developers.
-	**Developers** - Developers are the customers that build applications using your APIs. Developers are granted access to the [developer portal][] and build applications that call the operations of an API.
-	**Guests** - Unauthenticated users, such as prospective customers, visiting the developer portal of an API Management instance fall into this group. They can be granted certain read-only access, such as the ability to view APIs but not call them.

In addition to these built-in groups, administrators can create custom groups. Custom groups have the same privileges as the built-in developers group, and can be used to manage multiple groups of developers. For example, you could create one custom group for developers that will use the APIs from one product, and another group for developers that will use the APIs from a different product.

For more information, see  [How to create and use groups][].

## <a name="developers"> </a> Developers

Developers represent the user accounts in an API Management service instance. Developers can be created or invited to join by administrators, or they can sign up from the [Developer portal][]. Each developer is a member of one or more groups, and can be subscribe to the products that grant visibility to those groups.

When developers subscribe to a product they are granted the primary and secondary key for the product. This key is used when making calls into the product's APIs.

For more information, see [How to create or invite developers][] and [How to associate groups with developers][].

## <a name="policies"> </a> Policies

Policies are a powerful capability of API Management that allow the publisher to change the behavior of the API through configuration. Policies are a collection of statements that are executed sequentially on the request or response of an API. Popular statements include format conversion from XML to JSON and call rate limiting to restrict the amount of incoming calls from a developer, and many other policies are available.

For a complete list of API Management policies, see [Policy reference][]. For more information on using and configuring policies, see [API Management policies][]. For a tutorial on creating a product with rate limit and quota policies, see [How create and configure advanced product settings][].


## <a name="developer-portal"> </a> Developer portal

The developer portal is where developers can learn about your APIs, view and call operations, and subscribe to products. Prospective customers can visit the developer portal, view APIs and operations, and sign up. The URL for your developer portal is located on the dashboard in the Azure portal for your API Management service instance.

You can customize the look and feel of your developer portal by adding custom content, customizing styles, and adding your branding.

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
[How create and configure advanced product settings]: api-management-howto-product-with-rules.md
[How to create or invite developers]: api-management-howto-create-or-invite-developers.md
[Policy reference]: api-management-policy-reference.md
[API Management policies]: api-management-howto-policies.md
[Create an API Management service instance]: api-management-get-started.md#create-service-instance



