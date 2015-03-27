<properties 
	pageTitle="How to create APIs in Azure API Management" 
	description="Learn how to create and configure APIs in Azure API Management." 
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
	ms.date="03/10/2015" 
	ms.author="sdanie"/>

# How to create APIs in Azure API Management

An API in API Management represents a set of operations that can be invoked by client applications. New APIs are created in the publisher portal, and then the desired operations are added. Once the operations are added, the API is added to a product and can be published. Once an API is published, it can be used by subscribed to and used by developers.

This guide shows the first step in the process: how to create and configure a new API in API Management. For more information on adding operations and publishing a product, see [How to add operations to an API][] and [How to create and publish a product][].

## <a name="create-new-api"> </a>Create a new API

APIs are created and configured in the publisher portal. To access the publisher portal, click **Manage** in the Azure Portal for your API Management service.

![Publisher portal][api-management-management-console]

>If you have not yet created an API Management service instance, see [Create an API Management service instance][] in the [Get started with Azure API Management][] tutorial.

Click **APIs** from the **API Management** menu on the left, and then click **add API**.

![Create API][api-management-create-api]

Use the **Add new API** window to configure the new API.

![Add new API][api-management-add-new-api]

The following three fields are used to configure the new API.

-	**Web API title** provides a unique and descriptive name for the API. It is displayed in the developer and management portals.
-	**Web service URL** references the HTTP service implementing the API. API management forwards requests to this address.
-	**Web API URL suffix** is appended to the base URL for the API management service. The base URL is common for all APIs hosted by an API Management service instance. API Management distinguishes APIs by their suffix and therefore the suffix must be unique for every API for a given publisher.
-	**Web API URL scheme** determines which protocols can be used to access the API. HTTPs is specified by default.

Once the three values are configured, click **Save**. Once the new API is created, the summary page for the API is displayed in the management portal.

![API summary][api-management-api-summary]

## <a name="configure-api-settings"> </a>Configure API settings

You can use the **Settings** tab to verify and edit the configuration for an API. **Web API title**, **Web service URL**, and **Web API URL suffix** are initially set when the API is created and can be modified here. **Description** provides an optional description, and **Web API URL scheme** determines which protocols can be used to access the API.

![API settings][api-management-api-settings]

To configure **Proxy authentication** for the web service implementing the API, select the **Security** tab. The **With credentials** drop-down can be used to configure **Basic authentication** or **Mutual certificates** authentication. To use basic authentication, simply enter the desired credentials. For information on using mutual certificate authentication, see [How to secure back-end services using mutual certificate authentication in Azure API Management][].

The **Security** tab can also be used to configure **User authorization** using OAuth 2.0. For more information, see [How to authorize developer accounts using OAuth 2.0 in Azure API Management][].

![Basic authentication settings][api-management-api-settings-credentials]

Click **Save** to save any changes you make to the API settings.

## <a name="next-steps"> </a>Next steps

Once an API is created and the settings configured, the next steps are to add the operations to the API, add the API to a product, and publish it so that it is available for developers. For more information, see the following two guides.

-	[How to add operations to an API][]
-	[How to create and publish a product][]





[api-management-create-api]: ./media/api-management-howto-create-apis/api-management-create-api.png
[api-management-management-console]: ./media/api-management-howto-create-apis/api-management-management-console.png
[api-management-add-new-api]: ./media/api-management-howto-create-apis/api-management-add-new-api.png
[api-management-api-settings]: ./media/api-management-howto-create-apis/api-management-api-settings.png
[api-management-api-settings-credentials]: ./media/api-management-howto-create-apis/api-management-api-settings-credentials.png
[api-management-api-summary]: ./media/api-management-howto-create-apis/api-management-api-summary.png
[api-management-echo-operations]: ./media/api-management-howto-create-apis/api-management-echo-operations.png

[What is an API?]: #what-is-api
[Create a new API]: #create-new-api
[Configure API settings]: #configure-api-settings
[Configure API operations]: #configure-api-operations
[Next steps]: #next-steps

[How to add operations to an API]: api-management-howto-add-operations.md
[How to create and publish a product]: api-management-howto-add-products.md

[Get started with Azure API Management]: api-management-get-started.md
[Create an API Management service instance]: api-management-get-started.md#create-service-instance
[How to secure back-end services using mutual certificate authentication in Azure API Management]: api-management-howto-mutual-certificates.md
[How to authorize developer accounts using OAuth 2.0 in Azure API Management]: api-management-howto-oauth2.md