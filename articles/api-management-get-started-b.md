<properties 
	pageTitle="Get started with Azure API Management" 
	description="Learn how to create APIs, operations, and get started with API Management." 
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

# Get started with Azure API Management

This guide shows you how to quickly get started using API Management and make your first API call.

>[AZURE.NOTE] To complete this tutorial, you need an Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][].

The first step in working with API Management is to create a service instance. Log in to the [Management Portal][] and click **New**, **App Services**, **API Management**, **Create**.

![API Management new instance][api-management-create-instance-menu]

For **URL**, specify a unique sub-domain name to use for the service URL.

Choose the desired **Subscription** and **Region** for your service instance. After making your selections, click the next button.

![New API Management service][api-management-create-instance-step1]

Enter **Contoso Ltd.** for the **Organization Name**, and enter your email address in the administrator e-mail field.

>This email address is used for notifications from the API Management system. For more information, see [Configure Notifications][].

![New API Management service][api-management-create-instance-step2]

API Management service instances are available in three tiers: Developer, Standard, and Premium. By default, new API Management service instances are created using the Developer tier. To select the Standard or Premium tier, check the **Advanced settings** checkbox and select the desired tier on the following screen.

>Microsoft Azure offers three tiers in which you can run your API Management service: Developer, Standard, and Premium. The Developer Tier is for development, testing and pilot API programs where high availability is not a concern. In the Standard and Premium tiers, you can scale your reserved unit count to handle more traffic. The Standard and Premium tiers provide your API Management service with the most processing power and performance. This tutorial can be completed using any tier. For more information about API Management tiers, see [API Management pricing][].

Click the check box to create your service instance.

![New API Management service][api-management-instance-created]

Once the service instance is created, the next step is to create an API.

## <a name="create-api"> </a>Create an API

An API consists of a set of operations that can be invoked from a client application. API operations are proxied to existing web services.

Each API Management service instance comes pre-configured with a sample Echo API on which you can invoke any HTTP verb, and the return value will equal to the headers and body that you sent. This tutorial uses the backend web service for the Echo API to create a new API in API Management called **My Echo Service**.

APIs are created and configured from the API publisher portal, which is accessed through the Azure portal. To reach the API publisher portal, click **Manage** in the Azure portal for your API Management service.

![Publisher portal][api-management-management-console]

To create the **My Echo API**, click **APIs** from the **API Management** menu on the left, and then click **add API**.

![Create API][api-management-create-api]

![Add new API][api-management-add-new-api]

The following three fields are used to configure the new API.

-	Type **My Echo API** into the **Web API Title** textbox. **Web API Title** provides a unique and descriptive name for the API. It is displayed in the developer and management portals.
-	Type **http://echoapi.cloudapp.net/api** into the **Web service URL**. **Web service URL** references the HTTP service implementing the API. API management forwards requests to this address.
-	Type **myecho** into the **Web API URL suffix**. **Web API URL suffix** is appended to the base URL for the API management service. Your APIs will share a common base URL and be distinguished by a unique suffix appended after the base.
-	**Web API URL scheme** determines which protocols can be used to access the API. HTTPs is specified by default.

Click **Save** to create the API. Once the new API is created, the summary page for the API is displayed in the management portal.

![API summary][api-management-new-api-summary]


>The sample echo API doesn't use authentication, but for more information about configuring authentication, see [Configure API settings][].


## <a name="add-operation"> </a>Add an operation

Click **Operations** to display the operations pane for the API. The operation definitions are used to validate incoming requests and to automatically generate documentation. Since we have not yet added any operations, there are none displayed.

![Operations][api-management-myecho-operations]

Click **add operation** to add a new operation. The **New operation** window will be displayed and the **Signature** tab will be selected by default.

![Operation signature][api-management-operation-signature]

In this example, we will specify a GET operation on the echo service. Enter the following values into the fields on the **Signature** tab.

-	Type **GET** into the **HTTP verb** text box. As you start typing you can select **GET** from the displayed list of http verbs.
-	Type **/resource** into the **URL template** text box.
-	Type **GET resource** into the **Display** name text box.
-	Type **A demonstration of a GET call on a sample resource. It is handled by an "echo" backend which returns a response equal to the request (the supplied headers and body are being returned as received).** into the **Description** text box. This description is used to generate documentation for this operation when developers use this API.

Click **Parameters** to configure the query string parameters for this operation. To add a query parameter click **Add query parameter** and specify the following values.

-	Type **param1** into the **Name** text box.
-	Type **A sample parameter that is required.** into the **Description** text box.
-	Click the **Type** field and choose **string** from the list. Supported types are **string**, **number**, **boolean**, and **dateTime**.
-	Click the **Values** field, type **sample** into the text box, and click the plus sign to add the default value text to the parameter. After adding the default text, click anywhere outside the **Values** field to dismiss the add value window.
-	Check the **Required** check box.

Click **Save** to add the newly configured operation to the API.


## <a name="add-api-to-product"> </a>Add the new API to a product

Developers must first subscribe to a product before they can make API calls. A product provides access to one or more APIs and can contain access restrictions like usage quotas and rate limits. In this step of the tutorial you will add the My Echo API to an existing product.

Click **Products** from the **API Management** menu on the left to view and configure the products available in this API Instance.

![Products][api-management-list-products]

By default, each API Management instance comes with two sample products:

-	**Starter**
-	**Unlimited**

In this tutorial we will use the **Starter** product. Click **Starter** to view the settings, including the APIs that are associated with that product.

![Add API][api-management-add-api-to-product]

Click **Add API to product**.

![Add API][api-management-add-myechoapi-to-product]

Check the box for **My Echo API**, and click **Save**.

![API added][api-management-api-added-to-product]

Now that **My Echo API** is associated with a product, developers can subscribe to it and begin using the API.

>This tutorial step used the **Starter** product, which comes pre-configured and ready for use. For a step-by-step guide on creating and publishing a new product, see [How create and publish a product][].

The Administrator user is automatically subscribed to all products and can access the APIs that they provide access to. It is therefore not necessary to manually subscribe to the just created product before a call can be made.

## <a name="call-operation"> </a>Call an operation from the Developer Portal

Operations can be called directly from the Developer portal, which provides a convenient way to view and test the operations of an API. In this tutorial step you will call the Get method that was added to **My Echo API**. Click **Developer portal** from the menu at the top right of the Management portal.

![Developer portal][api-management-developer-portal-menu]

Click **APIs** from the top menu, and then click **My Echo API** to see the operations available.

![Developer portal][api-management-developer-portal-myecho-api]

Note that the description and parameters that were added when you created the operation are displayed, providing documentation for the developers that will use this operation.

Click **GET Resource** and then click **Open Console**. 

![Operation console][api-management-developer-portal-myecho-api-console]

Enter some values for the parameters, and specify your developer key, and click **HTTP Get**.

![HTTP Get][api-management-invoke-get]

After an operation is invoked, the developer portal displays the **Requested URL** from the back-end service, the **Response status**, the **Response headers**, and any **Response content**. 

![Response][api-management-invoke-get-response]



## <a name="next-steps"> </a>Next steps

-   Configure policies
-   Customize the developer portal
-   Trace calls using API inspector

[Azure Free Trial]: http://www.windowsazure.com/pricing/free-trial/

[Create an API Management instance]: #create-service-instance
[Create an API]: #create-api
[Add an operation]: #add-operation
[Add the new API to a product]: #add-api-to-product
[Subscribe to the product that contains the API]: #subscribe
[Call an operation from the Developer Portal]: #call-operation
[View analytics]: #view-analytics
[Next steps]: #next-steps

[Configure API settings]: api-management-howto-create-apis.md#configure-api-settings
[Configure Notifications]: api-management-howto-configure-notifications.md
[Responses]: api-management-howto-add-operations.md#responses
[How create and publish a product]: api-management-howto-add-products.md
[Get started with advanced API configuration]: api-management-get-started-advanced.md
[API Management pricing]: http://azure.microsoft.com/pricing/details/api-management/
[Management Portal]: https://manage.windowsazure.com/

[Configure policies]: api-management-howto-policies.md
[Customize the developer portal]: api-management-customize-portal.md
[Trace calls using API inspector]: api-management-howto-api-inspector.md

[api-management-management-console]: ./media/api-management-get-started-b/api-management-management-console.png
[api-management-create-instance-menu]: ./media/api-management-get-started-b/api-management-create-instance-menu.png
[api-management-create-instance-step1]: ./media/api-management-get-started-b/api-management-create-instance-step1.png
[api-management-create-instance-step2]: ./media/api-management-get-started-b/api-management-create-instance-step2.png
[api-management-instance-created]: ./media/api-management-get-started-b/api-management-instance-created.png
[api-management-create-api]: ./media/api-management-get-started-b/api-management-create-api.png
[api-management-add-new-api]: ./media/api-management-get-started-b/api-management-add-new-api.png
[api-management-new-api-summary]: ./media/api-management-get-started-b/api-management-new-api-summary.png
[api-management-myecho-operations]: ./media/api-management-get-started-b/api-management-myecho-operations.png
[api-management-operation-signature]: ./media/api-management-get-started-b/api-management-operation-signature.png
[api-management-list-products]: ./media/api-management-get-started-b/api-management-list-products.png
[api-management-add-api-to-product]: ./media/api-management-get-started-b/api-management-add-api-to-product.png
[api-management-add-myechoapi-to-product]: ./media/api-management-get-started-b/api-management-add-myechoapi-to-product.png
[api-management-api-added-to-product]: ./media/api-management-get-started-b/api-management-api-added-to-product.png



[api-management-developer-portal-menu]: ./media/api-management-get-started-b/api-management-developer-portal-menu.png
[api-management-developer-portal-myecho-api]: ./media/api-management-get-started-b/api-management-developer-portal-myecho-api.png
[api-management-developer-portal-myecho-api-console]: ./media/api-management-get-started-b/api-management-developer-portal-myecho-api-console.png
[api-management-invoke-get]: ./media/api-management-get-started-b/api-management-invoke-get.png
[api-management-invoke-get-response]: ./media/api-management-get-started-b/api-management-invoke-get-response.png
