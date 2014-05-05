# How to add operations to an API in Azure API Management

Before an API in API Management can be used, operations must be added. This guide shows how to add and configure different types of operations to an API in API Management.

## In this topic

-   [Add an operation][]
-   [Operation caching][]
-   [Request parameters][]
-   [Request body][]
-   [Responses][]
-   [Next steps][]

## <a name="add-operation"> </a>Add an operation

Select the desired API in the API Management portal and then select operations. If the desired API is not already displayed in the portal, choose APIs from the API management menu to the left, and then select the desired API.

![api-management-contoso-api][]

Once the API is displayed in the portal, click operations to display the operations pane for the API. In this example there have not yet been any operations added to the API.

![api-management-contoso-operations][]

Click add operation to add a new operation. The New operation will be displayed and the Signature tab will be selected by default.

![api-management-add-operation][]

Specify the HTTP method by choosing one of the HTTP methods from the drop-down list.

![api-management-http-method][]

Define the URI template by typing in a URL fragment consisting of one or more URL path segments and zero or more query string parameters. The URI template, appended to the base URL of the API, identifies a single HTTP operation. It may contain one or more named variable parts that are identified by curly braces. These variable parts are called template parameters and are dynamically assigned values extracted from the request's URL when the request is being processed by the API Management platform.

![api-management-uri-template][]

Optionally, specify the Rewrite URI template. This allows you to use the standard URI template for processing incoming requests on the front-end, while calling the backend via a converted URL according to the rewrite template. Template parameters from the URI template should be used in the rewrite template. The following example shows how content type encoded as path segment in the web service can be provided as a query parameter in the API published via the API Management platform using the URI templates.


URI template:/orders?format={contentType}

Rewrite URI template:/{contentType}/orders

Request URL .../orders?format=xml is mapped to .../xml/orders


Enter a descriptive name for the operation in the Display name text box.


Operation description can be specified as plain text or HTML in the Description text box.



## <a name="operation-caching"> </a>Operation caching

Response caching reduces latency perceived by the API consumers, lowers bandwidth consumption and decreases the load on the HTTP web service implementing the API. Note that comprehensive caching settings are available via the Policy page.

To easily and quickly enable caching for the operation, select the Caching tab and check the Enable checkbox.

![api-management-caching][]


In the Duration text box, change the time period during which cached responses remain fresh and are served from cache. Default value is 3600 seconds or 1 hour.


Cache keys are used to differentiate between responses so that the response corresponding to each different cache key will get its own separate cached value. Optionally, enter specific query string parameters and/or HTTP headers to be used in computing cache key values in the Vary by string parameters and Vary by headers text boxes respectively. When none specified, full request URL and the following HTTP header values are used in cache key generation: Accept and Accept-Charset.


## <a name="request-parameters"> </a>Request parameters

Operation parameters are managed on the Parameters tab. Parameters specified in the URL Template on the Signature tab are added automatically and can be changed only by editing the URL template. Additional parameters can be entered manually.

To add a new query parameter, click add query parameter and enter the following information:

-	Name - parameter name.
-	Description - a brief description of the parameter (optional).
-	Type - parameter type, selected in the drop down.
-	Values - values that can be assigned to this parameter. One of the values can be marked as default (optional).
-	Required - make the parameter mandatory by checking the checkbox. 

![api-management-request-parameters][]

## <a name="request-body"> </a>Request body

If the operation allows (e.g. PUT, POST) and requires a body you may provide an example of it in all of the supported representation formats (e.g. json, XML). The request body is used for documentation purposes and is not validated.

Switch to the Body tab.


Click add representation, start typing desired content type name (e.g. application/json) and then select it in the drop down.


Paste request body example in the selected format into the text box. 

![api-management-request-body][]

Add description (optional).

## <a name="responses"> </a>Responses

It is a good practice to provide examples of responses for all status codes that the operation may produce. Each status code may have more than one response body example, one for each of the supported content types. For instance, to add an example of 200 OK response perform the following steps:

Click on add response, start typing the desired status code (e.g. 200 OK in the text box, then select it in the drop down; The Code 200 tab is created and selected.


Click add representation, start typing the desired content type name (e.g. application/json) and then select it in the drop down.

![api-management-response-body-content-type][]

Paste the request body example in the selected format into the text box. 

![api-management-response-body][]

Add a description (optional).


Do not forget to click the Save button to persist the changes.


## <a name="next-steps"> </a>Next steps

Once the operations are added to an API, the next step is to associate the API with a product and publish it so that developers can call the API's operations.

-	[How to create and publish a product][]

[api-management-add-operation]: ./Media/tn01_09_operation_signature.png
[api-management-http-method]: ./Media/tn01_10_http_method.png
[api-management-uri-template]: ./Media/tn01_11_uri_template.png
[api-management-caching]: ./Media/tn01_12_enable_cache.png
[api-management-request-parameters]: ./Media/tn01_13_request_parameters.png
[api-management-request-body]: ./Media/tn01_14_request_body.png
[api-management-response-body-content-type]: ./Media/tn01_15_response_body_content_type.png
[api-management-response-body]: ./Media/tn01_16_response_body.png
[api-management-contoso-api]: ./Media/api-management-contoso-api.png
[api-management-contoso-operations]: ./Media/api-management-contoso-operations.png
[api-management-add-new-api]: ./Media/api-management-add-new-api.png
[api-management-api-settings]: ./Media/api-management-api-settings.png
[api-management-api-settings-credentials]: ./Media/api-management-api-settings-credentials.png
[api-management-api-summary]: ./Media/api-management-api-summary.png
[api-management-echo-operations]: ./Media/api-management-echo-operations.png

[Add an operation]: #add-operation
[Operation caching]: #operation-caching
[Request parameters]: #request-parameters
[Request body]: #request-body
[Responses]: #responses
[Next steps]: #next-steps

[How to add operations to an API]: ./api-management-hotwo-add-operations
[How to create and publish a product]: ./api-management-howto-add-product