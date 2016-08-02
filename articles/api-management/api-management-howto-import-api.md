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
	ms.topic="article" 
	ms.date="05/25/2016" 
	ms.author="sdanie"/>

# How to import the definition of an API with operations in Azure API Management

In API Management, new APIs can be created and the operations added manually, or the API can be imported along with the operations in one step.

APIs and their operations can be imported using the following formats.

-	WADL
-	Swagger

This guide shows how create a new API and import its operations in one step. For information on manually creating an API and adding operations, see [How to create APIs][] and [How to add operations to an API][].

## <a name="import-api"> </a>Import an API

APIs are created and configured in the publisher portal. To access the publisher portal, click **Manage** in the Azure Classic Portal for your API Management service. If you have not yet created an API Management service instance, see [Create an API Management service instance][] in the [Get started with Azure API Management][] tutorial.

![Publisher portal][api-management-management-console]

Click **APIs** from the **API Management** menu on the left, and then click **import API**.

![Import API][api-management-import-apis]

The **Import API** window has three tabs that correspond to the three ways to provide the API specification.

-	**From clipboard** allows you to paste the API specification into the designated text box.
-	**From file** allows you to browse to and select the file that contains the API specification.
-	**From URL** allows you to supply the URL to the specification for the API.

![Import API format][api-management-import-api-clipboard]

After providing the API specification, use the radio buttons on the right to indicate the specification format. The following formats are supported.

-	WADL
-	Swagger

Next, enter a **Web API URL suffix**. This is appended to the base URL for your API management service. The base URL is common for all APIs hosted on each instance of an API Management service. API Management distinguishes APIs by their suffix and therefore the suffix must be unique for every API in a specific API management service instance.

Once all values are entered, click **Save** to create the API and the associated operations. 

>[AZURE.NOTE] For a tutorial of importing a basic calculator API in Swagger format, see [Manage your first API in Azure API Management](api-management-get-started.md).

## <a name="export-api"> </a> Export an API

In addition to importing new APIs, you can export the definitions of your APIs from the publisher portal. To do so, click **Export API** from the **Summary tab** of your **API**.

![Export API][api-management-export-api]

APIs can be exported using WADL or Swagger. Select the desired format, click **Save**, and choose the location in which to save the file.

![Export API format][api-management-export-api-format]

## <a name="next-steps"> </a>Next steps

Once an API is created and the operations imported, you can review and configure any additional settings, add the API to a Product, and publish it so that it is available for developers. For more information, see the following guides.

-	[How to configure API settings][]
-	[How to create and publish a product][]




[api-management-management-console]: ./media/api-management-howto-import-api/api-management-management-console.png
[api-management-import-apis]: ./media/api-management-howto-import-api/api-management-api-import-apis.png
[api-management-import-api-clipboard]: ./media/api-management-howto-import-api/api-management-import-api-wizard.png
[api-management-export-api]: ./media/api-management-howto-import-api/api-management-export-api.png
[api-management-export-api-format]: ./media/api-management-howto-import-api/api-management-export-api-format.png

[Import an API]: #import-api
[Export an API]: #export-api
[Configure API settings]: #configure-api-settings
[Next steps]: #next-steps

[Get started with Azure API Management]: api-management-get-started.md
[Create an API Management service instance]: api-management-get-started.md#create-service-instance

[How to add operations to an API]: api-management-howto-add-operations.md
[How to create and publish a product]: api-management-howto-add-products.md
[How to create APIs]: api-management-howto-create-apis.md
[How to configure API settings]: api-management-howto-create-apis.md#configure-api-settings
