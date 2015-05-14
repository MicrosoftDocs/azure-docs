<properties 
	pageTitle="Manage your first API in Azure API Management" 
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

# Manage your first API in Azure API Management

## <a name="overview"> </a>Overview

This guide shows you how to quickly get started using API Management and make your first API call.

## <a name="concepts"> </a>What is Azure API Management?

Azure API Management allows you to take any backend and launch a full-fledged API program based on it. 

Common scenarios include:

* **Securing mobile infrastructure** by gating access with API keys, preventing DOS attacks using throttling or using advanced security policies like JWT token validation
* **Enabling ISV partner ecosystems** by offering fast partner onboarding through the developer portal and building an API facade to decouple from an  internal implementations not ripe for partner consumption
* **Running an internal API program** by offering a centralized location for the organization to communicate about the availability and latest changes to APIs, gating access based on organizational accounts, all based on a secured channel between the API gateway and the backend


The system is made-up of the following components:

* The **API gateway** is the endpoint that:
  * accepts API calls and routes them to your backends
  * verifies API keys, JWT tokens, certificates and other credentials
  * enforces usage quotas and rate limits
  * transforms your API on the fly without code modifications
  * caches backend responses where setup
  * logs call metadata for analytics purposes

* The **publisher portal** is the administrative interface where you set-up your API program:
	* define or import API schema
	* package APIs into products
	* set-up policies like quotas or transformations on the APIs
	* get insights from analytics
	* manage users

* The **developer portal** serves as the main web presence for developers where they can:
	* read API documentation
	* try out an API via the interactive console
	* create an account and subscribe to get API keys
	* access analytics on their own usage


## <a name="create-service-instance"> </a>Create an API Management instance

> To complete this tutorial, you need an Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][].

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

Each API Management service instance comes pre-configured with a sample Echo API which returns back the input that was sent to it. To use it, you can invoke any HTTP verb, and the return value will equal to the headers and body that you sent.

This tutorial uses the http://echoapi.cloudapp.net/api web service to create a new API in API Management called **My Echo Service**.

APIs are created and configured from the API publisher portal, which is accessed through the Azure management portal. To reach the publisher portal, click **Manage** in the Azure Portal for your API Management service.

![Publisher portal][api-management-management-console]

To create the **My Echo API**, click **APIs** from the **API Management** menu on the left, and then click **Add API**.

![Create API][api-management-create-api]

![Add new API][api-management-add-new-api]

The following fields are used to configure the new API.

-	Type **My Echo API** into the **Web API Title** textbox. **Web API Title** provides a unique and descriptive name for the API. It is displayed in the developer and management portals.
-	Type **http://echoapi.cloudapp.net/api** into the **Web service URL**. **Web service URL** references the HTTP service implementing the API. API management forwards requests to this address.
-	Type **myecho** into the **Web API URL suffix**. **Web API URL suffix** is appended to the base URL for the API management service. Your APIs will share a common base URL and be distinguished by a unique suffix appended after the base.
-	**Web API URL scheme** determines which protocols can be used to access the API. HTTPs is specified by default.

Click **Save** to create the API. Once the new API is created, the summary page for the API is displayed in the management portal.

![API summary][api-management-new-api-summary]

The API section has four tabs. The **Summary** tab display basic metrics and information about the API. The **Settings** tab is used to view and edit the configuration for an API, including authentication credentials for the back-end service. The **Operations** tab is used to manage the API's operations and is used in the following step in the tutorial, and the **Issues** tab can be used to view issues reported by the developers using your APIs.

>The sample echo API doesn't use authentication, but for more information about configuring authentication, see [Configure API settings][].

Once an API is created and the settings configured, the next step is to add the operations to the API. The operation definitions are used to validate incoming requests and to automatically generate documentation.


## <a name="add-operation"> </a>Add an operation

Click **Operations** to display the operations pane for the API. Since we have not yet added any operations, there are none displayed.

![Operations][api-management-myecho-operations]

Click **add operation** to add a new operation. The **New operation** window will be displayed and the **Signature** tab will be selected by default.

![Operation signature][api-management-operation-signature]

In this example, we will specify a GET operation on the echo service. Enter the following values into the fields on the **Signature** tab.

-	Type **GET** into the **HTTP verb** text box. As you start typing you can select **GET** from the displayed list of http verbs.
-	Type **/resource** into the **URL template** text box.
-	Type **GET resource** into the **Display** name text box.
-	Type **A demonstration of a GET call on a sample resource. It is handled by an "echo" backend which returns a response equal to the request (the supplied headers and body are being returned as received).** into the **Description** text box. This description is used to generate documentation for this operation when developers use this API.

Click **Parameters** to configure the query string parameters for this operation. In this example there are two query string parameters. To add a query parameter click **Add query parameter** and specify the following values.

For the first query parameter, configure the following values.

-	Type **param1** into the **Name** text box.
-	Type **A sample parameter that is required.** into the **Description** text box.
-	Click the **Type** field and choose **string** from the list. Supported types are **string**, **number**, **boolean**, and **dateTime**.
-	Click the **Values** field, type **sample** into the text box, and click the plus sign to add the default value text to the parameter. After adding the default text, click anywhere outside the **Values** field to dismiss the add value window.
-	Check the **Required** check box.

For the second query parameter, enter the following values.

-	**Name**: **param2**
-	**Description**: **Another sample parameter, set to not required.**
-	**Type**: **number**

It is a good practice to provide examples of responses for all status codes that the operation may produce. Each status code may have more than one response body example, one for each of the supported content types. In this tutorial we are adding a **200 OK** response code.

Click **Add** in the Responses section, start typing **200** into the text box, and then select **200 OK** from the drop-down list. 

![Add response][api-management-add-response]

Once **200 OK** is selected, a new response code is added to the operation and the response window is displayed. Type **Returned in all cases.** into the **Description** text box.

![Add response][api-management-add-response-window]

>**Add Representation** is used to configure responses in multiple representations. For more information, see [Responses][].

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

>This tutorial step uses the Starter product, which comes pre-configured and ready for use. For a step-by-step guide on creating and publishing a new product, see [How create and publish a product][].

## <a name="subscribe"> </a>Subscribe to the product that contains the API

In order to make calls to an API, developers must first be subscribed to a product that gives them access to it. Developers can subscribe to products in the Developer portal, or administrators can subscribe developers to products in the publisher portal. You are an administrator by default since you created the API Management instance in the previous steps in the tutorial, so you will subscribe an account to the **Starter** product.

Click **Users** from the **API Management** menu on the left to view and configure the developers in this service instance.

![Developers][api-management-developers]

Click the name of the developer to configure the settings for the user, including subscriptions.

>In this example, we are subscribing a developer named Clayton Gragg. If you do not have any developer accounts created, you can subscribe the administrator account. For information on creating developer accounts, see [How to manage developer accounts in Azure API Management][].

![Add subscription][api-management-add-subscription]

Click **Add Subscription**.

![Add subscription][api-management-add-subscription-window]

Check the box for **Starter**, accept the default **Subscription name**,  and click **Subscribe**.

![Subscription added][api-management-subscription-added]

Once your developer account is subscribed, you can call that product's APIs.

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


## <a name="view-analytics"> </a>View analytics

To view analytics for **My Echo API**, switch back to the Administrative portal by selecting **Manage** from the user menu at the top right of the Developer portal.

![Manage][api-management-manage-menu]

The default view for the Administrative portal is the Dashboard, which provides an overview of your API Management instance.

![Dashboard][api-management-dashboard]

Hover the mouse over the chart for My Echo API to see the specific metrics for the usage of the API for a given time period.

>If you don't see any lines on your chart, switch back to the Developer portal and make some calls into the API, wait a few moments, and then come back to the Dashboard.

![Analytics][api-management-mouse-over]

Click **View Details** to view the summary page for the API, including a larger version of the displayed metrics.

![Summary][api-management-api-summary-metrics]

For detailed metrics and reports, click **Analytics** from the **API Management** menu on the left.

![Overview][api-management-analytics-overview]

The **Analytics** section has the following four tabs.

-	**At a glance** provides overall usage and health metrics as well as the top developers, top products, top APIs, and top operations.
-	**Usage** provides in-depth look at API calls and bandwidth including a geographical representation.
-	**Health** focuses on status codes, cache success rates, response times, and API and service response times.
-	**Activity** provides reports that drill down on the specific activity by developer, product, API, and operation.

## <a name="next-steps"> </a>Next steps

-	Check out the other topics in the [Get started with advanced API configuration][] tutorial.

[Azure Free Trial]: http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=api_management_hero_a

[Create an API Management instance]: #create-service-instance
[Create an API]: #create-api
[Add an operation]: #add-operation
[Add the new API to a product]: #add-api-to-product
[Subscribe to the product that contains the API]: #subscribe
[Call an operation from the Developer Portal]: #call-operation
[View analytics]: #view-analytics
[Next steps]: #next-steps


[How to manage developer accounts in Azure API Management]: api-management-howto-create-or-invite-developers.md
[Configure API settings]: api-management-howto-create-apis.md#configure-api-settings
[Configure Notifications]: api-management-howto-configure-notifications.md
[Responses]: api-management-howto-add-operations.md#responses
[How create and publish a product]: api-management-howto-add-products.md
[Get started with advanced API configuration]: api-management-get-started-advanced.md
[API Management pricing]: http://azure.microsoft.com/pricing/details/api-management/

[Management Portal]: https://manage.windowsazure.com/

[api-management-management-console]: ./media/api-management-get-started/api-management-management-console.png
[api-management-create-instance-menu]: ./media/api-management-get-started/api-management-create-instance-menu.png
[api-management-create-instance-step1]: ./media/api-management-get-started/api-management-create-instance-step1.png
[api-management-create-instance-step2]: ./media/api-management-get-started/api-management-create-instance-step2.png
[api-management-instance-created]: ./media/api-management-get-started/api-management-instance-created.png
[api-management-create-api]: ./media/api-management-get-started/api-management-create-api.png
[api-management-add-new-api]: ./media/api-management-get-started/api-management-add-new-api.png
[api-management-new-api-summary]: ./media/api-management-get-started/api-management-new-api-summary.png
[api-management-myecho-operations]: ./media/api-management-get-started/api-management-myecho-operations.png
[api-management-operation-signature]: ./media/api-management-get-started/api-management-operation-signature.png
[api-management-list-products]: ./media/api-management-get-started/api-management-list-products.png
[api-management-add-api-to-product]: ./media/api-management-get-started/api-management-add-api-to-product.png
[api-management-add-myechoapi-to-product]: ./media/api-management-get-started/api-management-add-myechoapi-to-product.png
[api-management-api-added-to-product]: ./media/api-management-get-started/api-management-api-added-to-product.png
[api-management-developers]: ./media/api-management-get-started/api-management-developers.png
[api-management-add-subscription]: ./media/api-management-get-started/api-management-add-subscription.png
[api-management-add-subscription-window]: ./media/api-management-get-started/api-management-add-subscription-window.png
[api-management-subscription-added]: ./media/api-management-get-started/api-management-subscription-added.png
[api-management-developer-portal-menu]: ./media/api-management-get-started/api-management-developer-portal-menu.png
[api-management-developer-portal-myecho-api]: ./media/api-management-get-started/api-management-developer-portal-myecho-api.png
[api-management-developer-portal-myecho-api-console]: ./media/api-management-get-started/api-management-developer-portal-myecho-api-console.png
[api-management-invoke-get]: ./media/api-management-get-started/api-management-invoke-get.png
[api-management-invoke-get-response]: ./media/api-management-get-started/api-management-invoke-get-response.png
[api-management-manage-menu]: ./media/api-management-get-started/api-management-manage-menu.png
[api-management-dashboard]: ./media/api-management-get-started/api-management-dashboard.png

[api-management-add-response]: ./media/api-management-get-started/api-management-add-response.png
[api-management-add-response-window]: ./media/api-management-get-started/api-management-add-response-window.png
[api-management-developer-key]: ./media/api-management-get-started/api-management-developer-key.png
[api-management-mouse-over]: ./media/api-management-get-started/api-management-mouse-over.png
[api-management-api-summary-metrics]: ./media/api-management-get-started/api-management-api-summary-metrics.png
[api-management-analytics-overview]: ./media/api-management-get-started/api-management-analytics-overview.png
[api-management-analytics-usage]: ./media/api-management-get-started/api-management-analytics-usage.png
[api-management-]: ./media/api-management-get-started/api-management-.png
[api-management-]: ./media/api-management-get-started/api-management-.png
