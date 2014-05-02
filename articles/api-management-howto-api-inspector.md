# How to use the API Inspector to trace calls in Azure API Management

API Management provides an API Inspector tool that is built-in to the Developer portal to help you with debugging and troubleshooting your APIs. This guide provides a walk-through of using API Inspector.

## In this topic

-	[Use API Inspector to trace a call][]
-	[Next steps][]


## <a name="api-inspector"> </a> Use API Inspector to trace a call

Azure-ApiManagement-Trace: On

Each API Management service instance comes pre-configured with an Echo API that can be used to experiment with and learn about API Management. The Echo API returns back whatever input is sent to it. To use it, you can invoke any HTTP verb, and the return value will simply be what you sent. This tutorial shows how to use API Inspector with the pre-configured Echo API.

Login to the Azure Portal for your API Management instance, and from the Quickstart tab click **Developer Portal**.

![api-management-developer-portal-menu][]

Operations can be called directly from the Developer portal, which provides a convenient way to view and test the operations of an API. In this tutorial step you will call the Get method of **Echo API**. 

>If you completed the first tutorial, [Get started with API Management][], you may follow the steps of this tutorial using the API and operations you created in that tutorial.

Click **APIs** from the top menu, and then click **Echo API**.

![api-management-echo-api][]

Click **Open Console** for the **GET Resource** operation, which is the first operation listed.

![api-management-echo-api-get][]

Enter some values for the parameters, and enter your developer key. Keys are found in the **Your account** page of the Management portal. To view your key directly from the  current page in the Developer portal, right-click **Your account** and select **Open in new tab**. Switch to the new tab and copy either the primary or secondary key.

>To view **Your account** from within the Administrative portal, select **View Account** from the menu at the top right of the portal.

![api-management-developer-key][]

Switch back to the Developer portal and enter your key.

In **Request headers**, type **Azure-ApiManagement-Trace: On** and click **HTTP Get**.

![api-management-invoke-get][]

After an operation is invoked, the developer portal displays the **Requested URL** from the back-end service, the **Response status**, the **Response headers**, and any **Response content**. 

![api-management-invoke-get-response][]




## <a name="next-steps"> </a>Next steps

TODO: link to the advance tutorial landing page with sublinks to each individual item.

[Create an API Management instance]: #create-service-instance
[Create an API]: #create-api
[Add an operation]: #add-operation
[Add the new API to a product]: #add-api-to-product
[Subscribe to the product that contains the API]: #subscribe
[Call an operation from the Developer Portal]: #call-operation
[View analytics]: #view-analytics
[Next steps]: #next-steps

[Configure API settings]: ./api-management-hotwo-create-apis/#configure-api-settings
[Responses]: ./api-management-howto-add-operations/#responses
[How create and publish a product]: ./api-management-howto-add-products

[Management Portal]: https://manage.windowsazure.com/

[api-management-developer-portal-menu]: ./Media/api-management-howto-api-inspector/api-management-developer-portal-menu.png
[api-management-echo-api]: ./Media/api-management-howto-api-inspector/api-management-echo-api.png
[api-management-echo-api-get]: ./Media/api-management-howto-api-inspector/api-management-echo-api-get.png
[api-management-developer-key]: ./Media/api-management-howto-api-inspector/api-management-developer-key.png
[api-management-]: ./Media/api-management-howto-api-inspector/api-management-.png
[api-management-]: ./Media/api-management-howto-api-inspector/api-management-.png
[api-management-]: ./Media/api-management-howto-api-inspector/api-management-.png
[api-management-]: ./Media/api-management-howto-api-inspector/api-management-.png
[api-management-]: ./Media/api-management-howto-api-inspector/api-management-.png
[api-management-]: ./Media/api-management-howto-api-inspector/api-management-.png

[api-management-management-console]: ./Media/api-management-get-started/api-management-management-console.png
[api-management-create-instance-menu]: ./Media/api-management-get-started/api-management-create-instance-menu.png
[api-management-create-instance-step1]: ./Media/api-management-get-started/api-management-create-instance-step1.png
[api-management-create-instance-step2]: ./Media/api-management-get-started/api-management-create-instance-step2.png
[api-management-instance-created]: ./Media/api-management-get-started/api-management-instance-created.png
[api-management-create-api]: ./Media/api-management-get-started/api-management-create-api.png
[api-management-add-new-api]: ./Media/api-management-get-started/api-management-add-new-api.png
[api-management-new-api-summary]: ./Media/api-management-get-started/api-management-new-api-summary.png
[api-management-myecho-operations]: ./Media/api-management-get-started/api-management-myecho-operations.png
[api-management-operation-signature]: ./Media/api-management-get-started/api-management-operation-signature.png
[api-management-list-products]: ./Media/api-management-get-started/api-management-list-products.png
[api-management-add-api-to-product]: ./Media/api-management-get-started/api-management-add-api-to-product.png
[api-management-add-myechoapi-to-product]: ./Media/api-management-get-started/api-management-add-myechoapi-to-product.png
[api-management-api-added-to-product]: ./Media/api-management-get-started/api-management-api-added-to-product.png
[api-management-developers]: ./Media/api-management-get-started/api-management-developers.png
[api-management-add-subscription]: ./Media/api-management-get-started/api-management-add-subscription.png
[api-management-add-subscription-window]: ./Media/api-management-get-started/api-management-add-subscription-window.png
[api-management-subscription-added]: ./Media/api-management-get-started/api-management-subscription-added.png

[api-management-developer-portal-myecho-api]: ./Media/api-management-get-started/api-management-developer-portal-myecho-api.png
[api-management-developer-portal-myecho-api-console]: ./Media/api-management-get-started/api-management-developer-portal-myecho-api-console.png
[api-management-invoke-get]: ./Media/api-management-get-started/api-management-invoke-get.png
[api-management-invoke-get-response]: ./Media/api-management-get-started/api-management-invoke-get-response.png
[api-management-manage-menu]: ./Media/api-management-get-started/api-management-manage-menu.png
[api-management-dashboard]: ./Media/api-management-get-started/api-management-dashboard.png

[api-management-add-response]: ./Media/api-management-get-started/api-management-add-response.png
[api-management-add-response-window]: ./Media/api-management-get-started/api-management-add-response-window.png
[api-management-developer-key]: ./Media/api-management-get-started/api-management-developer-key.png
[api-management-mouse-over]: ./Media/api-management-get-started/api-management-mouse-over.png
[api-management-api-summary-metrics]: ./Media/api-management-get-started/api-management-api-summary-metrics.png
[api-management-analytics-overview]: ./Media/api-management-get-started/api-management-analytics-overview.png
[api-management-analytics-usage]: ./Media/api-management-get-started/api-management-analytics-usage.png
[api-management-]: ./Media/api-management-get-started/api-management-.png
[api-management-]: ./Media/api-management-get-started/api-management-.png