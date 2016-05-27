<properties 
	pageTitle="How to create APIs, operations, and products in Azure API Management" 
	description="Learn how to create APIs, operations, and products in API Management." 
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
	ms.topic="article" 
	ms.date="05/25/2016" 
	ms.author="sdanie"/>

# How to create APIs, operations, and products in Azure API Management

In Azure API Management, APIs and their operations are added to products, where they can be used by the developers building applications that use the APIs. The guides in this section show how to create an API, add operations to it, and then associate the API with a product and publish it for developers to use.

## <a name="create-apis"> </a>How to create APIs

An API in API Management represents a set of operations that can be invoked by client applications. New APIs are created in the publisher portal.

This guide shows how to create and configure a new API in API Management.

-   [How to create APIs][]

## <a name="add-operations"> </a>How to add operations to an API

Before an API in API Management can be used, operations must be added. This guide shows how to add and configure different types of operations to an API in API Management.

-   [How to add operations to an API][]

An API and its operations can also be imported in one steps, in either WADL or Swagger format.

-	[How to import the definition of an API with operations][]

## <a name="add-product"> </a>How create and publish a product

In API Management, a product contains one or more APIs as well as a usage quota and the terms of use. Once a product is published, developers can subscribe to the product and begin to use the product's APIs. these topics provide a guide to creating a product, adding an API, and publishing it for developers.

-   [How to add and publish a product][]
-	[How create and configure advanced product settings][]

[Create a product]: #create-product
[Add APIs to a product]: #add-apis
[Add descriptive information to a product]: #add-description
[Publish a product]: #publish-product
[Make a product visible to developers]: #make-visible
[View subscribers to a product]: #view-subscribers
[Next steps]: #next-steps

[api-management-]: ./media/

[How to create APIs]: api-management-howto-create-apis.md
[How to add operations to an API]: api-management-howto-add-operations.md
[How to add and publish a product]: api-management-howto-add-products.md
[Monitoring and analytics]: ../api-management-monitoring.md
[How to import the definition of an API with operations]: api-management-howto-import-api.md
[How create and configure advanced product settings]: api-management-howto-product-with-rules.md 
