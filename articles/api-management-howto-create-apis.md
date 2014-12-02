<properties pageTitle="How to create APIs in Azure API Management" metaKeywords="" description="Learn how to create and configure APIs in Azure API Management." metaCanonical="" services="api-management" documentationCenter="API Management" title="How to create APIs in Azure API Management" authors="sdanie" solutions="" manager="dwrede" editor="" />

<tags ms.service="api-management" ms.workload="mobile" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/18/2014" ms.author="sdanie" />

# How to create APIs in Azure API Management

An API in API Management represents a set of operations that can be invoked by client applications. New APIs are created in the management console, and then the desired operations are added. Once the operations are added, the API is added to a product and can be published. Once an API is published, it can be used by subscribed to and used by developers.

This guide shows the first step in the process: how to create and configure a new API in API Management. For more information on adding operations and publishing a product, see [How to add operations to an API][] and [How to create and publish a product][].

## In this topic

-   [Create a new API][]
-   [Configure API settings][]
-   [Next Steps][]

## <a name="create-new-api"> </a>Create a new API

To create and configure APIs, click **Management console** in the Azure Portal for your API Management service instance. This takes you to the API Management administrative portal.

>If you have not yet created an API Management service instance, see [Create an API Management service instance][] in the [Get started with Azure API Management][] tutorial.

![Management console][api-management-management-console]

Click **APIs** from the **API Management** menu on the left, and then click **add API**.

![Create API][api-management-create-api]

Use the **Add new API** window to configure the new API.

![Add new API][api-management-add-new-api]

The following three fields are used to configure the new API.

-	**Web API title** provides a unique and descriptive name for the API. It is displayed in the developer and management portals.
-	**Web service URL** references the HTTP service implementing the API. API management forwards requests to this address.
-	**Web API URL suffix** is appended to the base URL for the API management service. The base URL is common for all APIs hosted by an API Management service instance. API Management distinguishes APIs by their suffix and therefore the suffix must be unique for every API for a given publisher.

Once the three values are configured, click **Save**. Once the new API is created, the summary page for the API is displayed in the management portal.

![API summary][api-management-api-summary]

## <a name="configure-api-settings"> </a>Configure API settings

You can use the **Settings** tab to verify and edit the configuration for an API. **Web API title**, **Web service URL**, and **Web API URL suffix** are initially set when the API is created and can be modified here. **Description** provides an optional description, and **With credentials** allows you to configure Basic HTTP authentication.

![API settings][api-management-api-settings]

To configure HTTP Basic Authentication for the web service implementing the API, select **Basic** from the **With credentials** drop-down and enter the desired credentials.

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

[How to add operations to an API]: ../api-management-howto-add-operations
[How to create and publish a product]: ../api-management-howto-add-products

[Get started with Azure API Management]: ../api-management-get-started
[Create an API Management service instance]: ../api-management-get-started/#create-service-instance