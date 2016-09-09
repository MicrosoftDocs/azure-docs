<properties 
	pageTitle="API Management key concepts" 
	description="Learn about APIs, products, roles, groups, and other API Management key concepts." 
	services="api-management" 
	documentationCenter="" 
	authors="steved0x" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="api-management" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="hero-article" 
	ms.date="08/09/2016" 
	ms.author="sdanie"/>

#What is API Management?

API Management helps organizations publish APIs to external, partner and internal developers to unlock the potential of their data and services. Businesses everywhere are looking to extend their operations as a digital platform, creating new channels, finding new customers and driving deeper engagement with existing ones. API Management provides the core competencies to ensure a successful API program through developer engagement, business insights, analytics, security and protection.

Watch the following video for an overview of Azure API Management and learn how to use API Management to add many features to your API, including access control, rate limiting, monitoring, event logging, and response caching, with minimal work on your part.

> [AZURE.VIDEO azure-api-management-overview]

To use API Management, administrators create APIs. Each API consists of one or more operations, and each API can be added to one or more products. To use an API, developers subscribe to a product that contains that API, and then they can call the API's operation, subject to any usage policies that may be in effect.

This topic provides an overview of API Management key concepts.

>[AZURE.NOTE] For more information, see the [Cloud-based API Management: Harnessing the Power of APIs](http://j.mp/ms-apim-whitepaper) PDF whitepaper. This introductory whitepaper on API Management by CITO Research covers: 
>
> - Common API requirements and challenges
>     - Decoupling APIs and presenting facades
>     - Getting developers up and running quickly
>     - Securing access
>     - Analytics and metrics
> - Gaining control and insight with an API Management platform
> - Using cloud vs on-premise solutions
> - Azure API Management

## <a name="apis"> </a>APIs and operations

APIs are the foundation of an API Management service instance. Each API represents  a set of operations available to developers. Each API contains a reference to the back-end service that implements the API, and its operations map to the operations implemented by the back-end service. Operations in API Management are highly configurable, with control over URL mapping, query and path parameters, request and response content, and operation response caching. Rate limit, quotas, and IP restriction policies can also be implemented at the API or individual operation level.

For more information, see [How to create APIs][] and [How to add operations to an API][].


## <a name="products"> </a> Products

Products are how APIs are surfaced to developers. Products in API Management have one or more APIs, and are configured with a title, description, and terms of use. Products can be **Open** or **Protected**. Protected products must be subscribed to before they can be used, while open products can be used without a subscription. When a product is ready for use by developers it can be published. Once it is published, it can be viewed (and in the case of protected products subscribed to) by developers. Subscription approval is configured at the product level and can either require administrator approval, or be auto-approved.

Groups are used to manage the visibility of products to developers. Products grant visibility to groups, and developers can view and subscribe to the products that are visible to the groups in which they belong. 

For more information, see [How to create and publish a product][] and the following video.

> [AZURE.VIDEO using-products]

## <a name="groups"> </a> Groups

Groups are used to manage the visibility of products to developers. API Management has the following immutable system groups.

-	**Administrators** - Azure subscription administrators are members of this group. Administrators manage API Management service instances, creating the APIs, operations, and products that are used by developers.
-	**Developers** - Authenticated developer portal users fall into this group. Developers are the customers that build applications using your APIs. Developers are granted access to the developer portal and build applications that call the operations of an API.
-	**Guests** - Unauthenticated developer portal users, such as prospective customers visiting the developer portal of an API Management instance fall into this group. They can be granted certain read-only access, such as the ability to view APIs but not call them.

In addition to these system groups, administrators can create custom groups or [leverage external groups in associated Azure Active Directory tenants](api-management-howto-aad.md#how-to-add-an-external-azure-active-directory-group). Custom and external groups can be used alongside system groups in giving developers visibility and access to API products. For example, you could create one custom group for developers affiliated with a specific partner organization and allow them access to the APIs from a product containing relevant APIs only. A user can be a member of more than one group.

For more information, see  [How to create and use groups][].

## <a name="developers"> </a> Developers

Developers represent the user accounts in an API Management service instance. Developers can be created or invited to join by administrators, or they can sign up from the [Developer portal][]. Each developer is a member of one or more groups, and can be subscribe to the products that grant visibility to those groups.

When developers subscribe to a product they are granted the primary and secondary key for the product. This key is used when making calls into the product's APIs.

For more information, see [How to create or invite developers][] and [How to associate groups with developers][].

## <a name="policies"> </a> Policies

Policies are a powerful capability of API Management that allow the publisher to change the behavior of the API through configuration. Policies are a collection of statements that are executed sequentially on the request or response of an API. Popular statements include format conversion from XML to JSON and call rate limiting to restrict the amount of incoming calls from a developer, and many other policies are available.

Policy expressions can be used as attribute values or text values in any of the API Management policies, unless the policy specifies otherwise. Some policies such as the [Control flow](https://msdn.microsoft.com/library/azure/dn894085.aspx#choose) and [Set variable](https://msdn.microsoft.com/library/azure/dn894085.aspx#set-variable) policies are based on policy expressions. For more information, see [Advanced policies](https://msdn.microsoft.com/library/azure/dn894085.aspx#AdvancedPolicies), [Policy expressions](https://msdn.microsoft.com/library/azure/dn910913.aspx), and watch the following video.

> [AZURE.VIDEO policy-expressions-in-azure-api-management]

For a complete list of API Management policies, see [Policy reference][]. For more information on using and configuring policies, see [API Management policies][]. For a tutorial on creating a product with rate limit and quota policies, see [How create and configure advanced product settings][]. For a demo, see the following video.

> [AZURE.VIDEO rate-limits-and-quotas]

## <a name="developer-portal"> </a> Developer portal

The developer portal is where developers can learn about your APIs, view and call operations, and subscribe to products. Prospective customers can visit the developer portal, view APIs and operations, and sign up. The URL for your developer portal is located on the dashboard in the Azure Classic Portal for your API Management service instance.

You can customize the look and feel of your developer portal by adding custom content, customizing styles, and adding your branding.

## API Management and the API economy

To learn more about API Management, watch the following presentation from the Microsoft Ignite 2015 conference.

> [AZURE.VIDEO microsoft-ignite-2015-azure-api-management-and-the-api-economy]

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



 
