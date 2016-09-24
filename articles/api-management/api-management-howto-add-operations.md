<properties 
	pageTitle="How to add operations to an API in Azure API Management | Microsoft Azure" 
	description="Learn how to add operations to an API in Azure API Management." 
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
	ms.date="08/09/2016" 
	ms.author="sdanie"/>

# How to add operations to an API in Azure API Management

Before an API in API Management can be used, operations must be added. This guide shows how to add and configure different types of operations to an API in API Management.

## <a name="add-operation"> </a>Add an operation

Operations are added and configured to an API in the publisher portal. To access the publisher portal, click **Manage** in the Azure Classic Portal for your API Management service.

![Publisher portal][api-management-management-console]

>If you have not yet created an API Management service instance, see [Create an API Management service instance][] in the [Get started with Azure API Management][] tutorial.

Select the desired API in the publisher portal and then select the **Operations** tab. 

![Operations][api-management-operations]

Click **Add Operation** to add a new operation. The **New operation** will be displayed and the **Signature** tab will be selected by default.

![Add operation][api-management-add-operation]

Specify the **HTTP verb** by choosing from the drop-down list.

![HTTP method][api-management-http-method]

<a name="url-template"></a>

Define the URL template by typing in a URL fragment consisting of one or more URL path segments and zero or more query string parameters. The URL template, appended to the base URL of the API, identifies a single HTTP operation. It may contain one or more named variable parts that are identified by curly braces. These variable parts are called template parameters and are dynamically assigned values extracted from the request's URL when the request is being processed by the API Management platform.

![URL template][api-management-url-template]

<a name="rewrite-url-template"></a>

If desired, specify the **Rewrite URL template**. This allows you to use the standard URL template for processing incoming requests on the front-end, while calling the back-end via a converted URL according to the rewrite template. Template parameters from the URL template should be used in the rewrite template. The following example shows how content type encoded as path segment in the web service from the previous example can be provided as a query parameter in the API published via the API Management platform using the URL templates.

![URL template rewrite][api-management-url-template-rewrite]

Callers to the operation will use the format `/customers?customerid=ALFKI` and this will be mapped to `/Customers('ALFKI')` when the back-end service is invoked.


**Display** name and **Description** provide a description of the operation and are used to provide documentation to the developers using this API in the developer portal.

![Description][api-management-description]

The operation description can be specified as plain text or HTML in the **Description** text box.

## <a name="operation-caching"> </a>Operation caching

Response caching reduces latency perceived by the API consumers, lowers bandwidth consumption and decreases the load on the HTTP web service implementing the API. 

To easily and quickly enable caching for the operation, select the **Caching** tab and check the **Enable** checkbox.

![Caching][api-management-caching-tab]

**Duration** specifies the time period during which the operation response remains in the cache. The default value is 3600 seconds or 1 hour.

Cache keys are used to differentiate between responses so that the response corresponding to each different cache key will get its own separate cached value. Optionally, enter specific query string parameters and/or HTTP headers to be used in computing cache key values in the **Vary by query string parameters** and **Vary by headers** text boxes respectively. When none are specified, full request URL and the following HTTP header values are used in cache key generation: **Accept** and **Accept-Charset**.

>For more information on caching and caching policies, see [How to cache operation results in Azure API Management][].


## <a name="request-parameters"> </a>Request parameters

Operation parameters are managed on the Parameters tab. Parameters specified in the **URL Template** on the **Signature** tab are added automatically and can be changed only by editing the URL template. Additional parameters can be entered manually.

To add a new query parameter, click **Add Query Parameter** and enter the following information:

-	**Name** - parameter name.
-	**Description** - a brief description of the parameter (optional).
-	**Type** - parameter type, selected in the drop down.
-	**Values** - values that can be assigned to this parameter. One of the values can be marked as default (optional).
-	**Required** - make the parameter mandatory by checking the checkbox. 

![Request parameters][api-management-request-parameters]

## <a name="request-body"> </a>Request body

If the operation allows (e.g. PUT, POST) and requires a body you may provide an example of it in all of the supported representation formats (e.g. json, XML). 

>The request body is used for documentation purposes only and is not validated.

To enter a request body, switch to the **Body** tab.

Click **Add Representation**, start typing desired content type name (e.g. application/json), select it in the drop-down, and paste the desired request body example in the selected format into the text box. 

![Request body][api-management-request-body]

In additional to representations, you can also specify an optional text description in the **Description** text box.

## <a name="responses"> </a>Responses

It is a good practice to provide examples of responses for all status codes that the operation may produce. Each status code may have more than one response body example, one for each of the supported content types. 

To add a response, click **Add** and start typing the desired status code. In this example the status code is **200 OK**. Once the code is displayed in the drop-down, select it, and the response code is created and added to your operation.

![Response code][api-management-response-code]

Click **Add Representation**, start typing the desired content type name (e.g. application/json) and then select it in the drop down.

![Body content type][api-management-response-body-content-type]

Paste the response body example in the selected format into the text box. 

![Response body][api-management-response-body]

If desired, add an optional description into the **Description** text box.

Once the operation is configured, click **Save**.


## <a name="next-steps"> </a>Next steps

Once the operations are added to an API, the next step is to associate the API with a product and publish it so that developers can call its operations.

-	[How to create and publish a product][]

[api-management-management-console]: ./media/api-management-howto-add-operations/api-management-management-console.png
[api-management-operations]: ./media/api-management-howto-add-operations/api-management-operations.png
[api-management-add-operation]: ./media/api-management-howto-add-operations/api-management-add-operation.png
[api-management-http-method]: ./media/api-management-howto-add-operations/api-management-http-method.png
[api-management-url-template]: ./media/api-management-howto-add-operations/api-management-url-template.png
[api-management-url-template-rewrite]: ./media/api-management-howto-add-operations/api-management-url-template-rewrite.png
[api-management-description]: ./media/api-management-howto-add-operations/api-management-description.png
[api-management-caching-tab]: ./media/api-management-howto-add-operations/api-management-caching-tab.png
[api-management-request-parameters]: ./media/api-management-howto-add-operations/api-management-request-parameters.png
[api-management-request-body]: ./media/api-management-howto-add-operations/api-management-request-body.png
[api-management-response-code]: ./media/api-management-howto-add-operations/api-management-response-code.png
[api-management-response-body-content-type]: ./media/api-management-howto-add-operations/api-management-response-body-content-type.png
[api-management-response-body]: ./media/api-management-howto-add-operations/api-management-response-body.png


[api-management-contoso-api]: ./media/api-management-howto-add-operations/api-management-contoso-api.png

[api-management-add-new-api]: ./media/api-management-howto-add-operations/api-management-add-new-api.png
[api-management-api-settings]: ./media/api-management-howto-add-operations/api-management-api-settings.png
[api-management-api-settings-credentials]: ./media/api-management-howto-add-operations/api-management-api-settings-credentials.png
[api-management-api-summary]: ./media/api-management-howto-add-operations/api-management-api-summary.png
[api-management-echo-operations]: ./media/api-management-howto-add-operations/api-management-echo-operations.png

[Add an operation]: #add-operation
[Operation caching]: #operation-caching
[Request parameters]: #request-parameters
[Request body]: #request-body
[Responses]: #responses
[Next steps]: #next-steps

[Get started with Azure API Management]: api-management-get-started.md
[Create an API Management service instance]: api-management-get-started.md#create-service-instance

[How to add operations to an API]: api-management-howto-add-operations.md
[How to create and publish a product]: api-management-howto-add-products.md
[How to cache operation results in Azure API Management]: api-management-howto-cache.md