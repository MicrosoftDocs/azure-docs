# How to create APIs using Azure API Management

An API in API Management represents a set of operations that can be invoked by client applications. New APIs are created in the API Management portal, and then the desired operations are added. Once the operations are added, the API is added to a Product and can be published. Once an API is published, it can be used by client applications.

This guide shows the first step in the process: how to create and configure a new API in API Management. For more information on adding operations and publishing a product, see [How to add operations to an API][] and [How to create and publish a product][].

## In this topic

-   [Create a new API][]
-   [Configure API settings][]
-   [Next Steps][]

## <a name="create-new-api"> </a>Create a new API

To create and configure APIs, click **Management Console** in the Azure Portal for your API Management service. This takes you to the API Management administrative portal.

![api-management-management-console][]

Click **APIs** from the **API Management** menu on the left, and then click **add API**.

![api-management-create-api][]

Use the **Add new API** window to configure the new API.

![api-management-add-new-api][]

The following three fields are used to configure the new API.

-	**Web API Title** provides a unique and descriptive name for the API. It is displayed in the developer and management portals.
-	**Web service URL** references the HTTP service implementing the API. API management forwards requests to this address.
-	**Web API URL suffix** is appended to the base URL for the API management service. The base URL is common for all APIs hosted on API Management. API Management distinguishes APIs by their suffix and therefore the suffix must be unique for every API for a given publisher.

Once the three values are configured, click **Save**. Once the new API is created, the summary page for the API is displayed in the management portal.

![api-management-api-summary][]

## <a name="configure-api-settings"> </a>Configure API settings

The **settings** section allows you to verify and edit the configuration for an API. **Web API title**, **Web service URL**, and **Web API URL suffix** are initially set when the API is created and can be modified here. **Description** provides an optional description, and **With credentials** allows you to configure Basic HTTP authentication.

![api-management-api-settings][]

To configure HTTP Basic Authentication for the web service implementing the API, select **Basic** from the **With credentials** drop-down and enter the desired credentials.

![api-management-api-settings-credentials][]

Click **Save** to save any changes you made to the API settings.

## <a name="next-steps"> </a>Next steps

Once an API is created and the settings configured, the next steps are to add the operations to the API, add the API to a Product, and publish it so that it is available for developers. For more information, see the following two guides.

-	[How to add operations to an API][]
-	[How to add and publish a product][]





[api-management-create-api]: ./Media/api-management-create-api.png
[api-management-management-console]: ./Media/api-management-management-console.png
[api-management-add-new-api]: ./Media/api-management-add-new-api.png
[api-management-api-settings]: ./Media/api-management-api-settings.png
[api-management-api-settings-credentials]: ./Media/api-management-api-settings-credentials.png
[api-management-api-summary]: ./Media/api-management-api-summary.png
[api-management-echo-operations]: ./Media/api-management-echo-operations.png

[What is an API?]: #what-is-api
[Create a new API]: #create-new-api
[Configure API settings]: #configure-api-settings
[Configure API operations]: #configure-api-operations
[Next steps]: #next-steps

[How to add operations to an API]: ./api-management-hotwo-add-operations
[How to create and publish a product]: ./api-management-howto-add-products