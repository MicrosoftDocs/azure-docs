# How to import the definition of an API with operations in Azure API Management

In API Management, new APIs can be created and the operations added manually, or the API can be imported along with the operations in one step.

APIs and their operations can be imported using the following formats.

-	WADL
-	Swagger

This guide shows how to import an API along with its operations.

>For information on manually creating an API and adding operations, see [How to create APIs][] and [How to add operations to an API][].

## In this topic

-   [Import an API][]
-   [Next Steps][]

## <a name="import-api"> </a>Import an API

To create and configure APIs, click **Management Console** in the Azure Portal for your API Management service. This takes you to the API Management administrative portal.

![api-management-management-console][]

Click **APIs** from the **API Management** menu on the left, and then click **import API**.

![api-management-import-apis][]

The **Import API** window has three tabs that correspond to the three ways to provide the API specification.

-	**From clipboard** allows you to paste the API specification into the designated text box.
-	**From file** allows you to browse to and select the file that contains the API specification.
-	**From URL** allows you to supply the URL to the specification for the API.

![api-management-import-api-clipboard][]

After providing the API specification, use the radio buttons on the right to indicate the specification format. The following formats are supported.

-	WADL
-	Swagger

Next, enter a **Web API URL suffix**. This is appended to the base URL for your API management service. The base URL is common for all APIs hosted on each instance of an API Management service. API Management distinguishes APIs by their suffix and therefore the suffix must be unique for every API in a specific API management service instance.

Once all values are entered, click **Save** to create the API and the associated operations. Once the new API is created, the summary page for the API is displayed in the management portal.

![api-management-api-summary][]

## <a name="next-steps"> </a>Next steps

Once an API is created and the operations imported, you can review and configure any additional settings, add the API to a Product, and publish it so that it is available for developers. For more information, see the following guides.

-	[How to configure API settings][]
-	[How to create and publish a product][]




[api-management-management-console]: ./Media/api-management-management-console.png
[api-management-import-apis]: ./Media/api-management-import-apis.png
[api-management-import-api-clipboard]: ./Media/api-management-import-api-clipboard.png
[api-management-add-new-api]: ./Media/api-management-add-new-api.png
[api-management-api-settings]: ./Media/api-management-api-settings.png
[api-management-api-settings-credentials]: ./Media/api-management-api-settings-credentials.png
[api-management-api-summary]: ./Media/api-management-api-summary.png
[api-management-echo-operations]: ./Media/api-management-echo-operations.png

[Import an API]: #import-api
[Configure API settings]: #configure-api-settings
[Next steps]: #next-steps

[How to add operations to an API]: ./api-management-hotwo-add-operations
[How to create and publish a product]: ./api-management-howto-add-products
[How to create APIs]: ./api-management-hotwo-create-apis
[How to configure API settings]: ./api-management-hotwo-create-apis/#configure-api-settings