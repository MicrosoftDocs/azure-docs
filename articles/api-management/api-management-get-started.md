<properties
	pageTitle="Manage your first API in Azure API Management | Microsoft Azure"
	description="Learn how to create APIs, add operations, and get started with API Management."
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
	ms.topic="hero-article"
	ms.date="05/25/2016"
	ms.author="sdanie"/>

# Manage your first API in Azure API Management

## <a name="overview"> </a>Overview

This guide shows you how to quickly get started in using Azure API Management and make your first API call.

## <a name="concepts"> </a>What is Azure API Management?

You can use Azure API Management to take any backend and launch a full-fledged API program based on it.

Common scenarios include:

* **Securing mobile infrastructure** by gating access with API keys, preventing DOS attacks by using throttling, or using advanced security policies like JWT token validation.
* **Enabling ISV partner ecosystems** by offering fast partner onboarding through the developer portal and building an API facade to decouple from internal implementations that are not ripe for partner consumption.
* **Running an internal API program** by offering a centralized location for the organization to communicate about the availability and latest changes to APIs, gating access based on organizational accounts, all based on a secured channel between the API gateway and the backend.


The system is made up of the following components:

* The **API gateway** is the endpoint that:
  * Accepts API calls and routes them to your backends.
  * Verifies API keys, JWT tokens, certificates, and other credentials.
  * Enforces usage quotas and rate limits.
  * Transforms your API on the fly without code modifications.
  * Caches backend responses where set up.
  * Logs call metadata for analytics purposes.

* The **publisher portal** is the administrative interface where you set up your API program. Use it to:
	* Define or import API schema.
	* Package APIs into products.
	* Set up policies like quotas or transformations on the APIs.
	* Get insights from analytics.
	* Manage users.

* The **developer portal** serves as the main web presence for developers, where they can:
	* Read API documentation.
	* Try out an API via the interactive console.
	* Create an account and subscribe to get API keys.
	* Access analytics on their own usage.


## <a name="create-service-instance"> </a>Create an API Management instance

>[AZURE.NOTE] To complete this tutorial, you need an Azure account. If you don't have an account, you can create a free account in just a couple of minutes. For details, see [Azure Free Trial][].

The first step in working with API Management is to create a service instance. Sign in to the [Azure Classic Portal][] and click **New**, **App Services**, **API Management**, **Create**.

![API Management new instance][api-management-create-instance-menu]

For **URL**, specify a unique sub-domain name to use for the service URL.

Choose the desired **Subscription** and **Region** for your service instance. After making your selections, click the **Next** button.

![New API Management service][api-management-create-instance-step1]

Enter **Contoso Ltd.** for the **Organization Name**, and enter your email address in the **Administrator E-Mail** field.

>[AZURE.NOTE] This email address is used for notifications from the API Management system. For more information, see [How to configure notifications and email templates in Azure API Management][].

![New API Management service][api-management-create-instance-step2]

API Management service instances are available in three tiers: Developer, Standard, and Premium. By default, new API Management service instances are created in the Developer tier. To select the Standard or Premium tier, check the **Advanced settings** check box and select the desired tier on the following screen.

>[AZURE.NOTE] The Developer Tier is for development, testing, and pilot API programs where high availability is not a concern. In the Standard and Premium tiers, you can scale your reserved unit count to handle more traffic. The Standard and Premium tiers provide your API Management service with the most processing power and performance. You can complete this tutorial by using any tier. For more information about API Management tiers, see [API Management pricing][].

Click the check box to create your service instance.

![New API Management service][api-management-instance-created]

Once the service instance is created, the next step is to create or import an API.

## <a name="create-api"> </a>Import an API

An API consists of a set of operations that can be invoked from a client application. API operations are proxied to existing web services.

APIs can be created (and operations can be added) manually, or they can be imported. In this tutorial, we will import the API for a sample calculator web service provided by Microsoft and hosted on Azure.

>[AZURE.NOTE] For guidance on creating an API and manually adding operations, see [How to create APIs](api-management-howto-create-apis.md) and [How to add operations to an API](api-management-howto-add-operations.md).

APIs are configured from the publisher portal, which is accessed through the Azure Classic Portal. To reach the publisher portal, click **Manage** in the Azure Classic Portal for your API Management service.

![Publisher portal][api-management-management-console]

To import the calculator API, click **APIs** from the **API Management** menu on the left, and then click **Import API**.

![Import API button][api-management-import-api]

Perform the following steps to configure the calculator API:

1. Click **From URL**, enter **http://calcapi.cloudapp.net/calcapi.json** into the **Specification document URL** text box, and click the **Swagger** radio button.
2. Type **calc** into the **Web API URL suffix** text box.
3. Click in the **Products (optional)** box and choose **Starter**.
4. Click **Save** to import the API.

![Add new API][api-management-import-new-api]

>[AZURE.NOTE] **API Management** currently supports both 1.2 and 2.0 version of Swagger document for import. Make sure that, even though [Swagger 2.0 specification](http://swagger.io/specification) declares that `host`, `basePath`, and `schemes` properties are optional, your Swagger 2.0 document **MUST** contain those properties; otherwise it won't get imported. 

Once the API is imported, the summary page for the API is displayed in the publisher portal.

![API summary][api-management-imported-api-summary]

The API section has several tabs. The **Summary** tab displays basic metrics and information about the API. The [Settings](api-management-howto-create-apis.md#configure-api-settings) tab is used to view and edit the configuration for an API. The [Operations](api-management-howto-add-operations.md) tab is used to manage the API's operations. The **Security** tab can be used to configure gateway authentication for the backend server by using Basic authentication or [mutual certificate authentication](api-management-howto-mutual-certificates.md), and to configure [user authorization by using OAuth 2.0](api-management-howto-oauth2.md).  The **Issues** tab is used to view issues reported by the developers who are using your APIs. The **Products** tab is used to configure the products that contain this API.

By default, each API Management instance comes with two sample products:

-	**Starter**
-	**Unlimited**

In this tutorial, the Basic Calculator API was added to the Starter product when the API was imported.

In order to make calls to an API, developers must first subscribe to a product that gives them access to it. Developers can subscribe to products in the developer portal, or administrators can subscribe developers to products in the publisher portal. You are an administrator since you created the API Management instance in the previous steps in the tutorial, so you are already subscribed to every product by default.

## <a name="call-operation"> </a>Call an operation from the developer portal

Operations can be called directly from the developer portal, which provides a convenient way to view and test the operations of an API. In this tutorial step, you will call the Basic Calculator API's **Add two integers** operation. Click **Developer portal** from the menu at the top right of the publisher portal.

![Developer portal][api-management-developer-portal-menu]

Click **APIs** from the top menu, and then click **Basic Calculator** to see the available operations.

![Developer portal][api-management-developer-portal-calc-api]

Note the sample descriptions and parameters that were imported along with the API and operations, providing documentation for the developers that will use this operation. These descriptions can also be added when operations are added manually.

To call the **Add two integers** operation, click **Try it**.

![Try it][api-management-developer-portal-calc-api-console]

You can enter some values for the parameters or keep the defaults, and then click **Send**.

![HTTP Get][api-management-invoke-get]

After an operation is invoked, the developer portal displays the **Response status**, the **Response headers**, and any **Response content**.

![Response][api-management-invoke-get-response]

## <a name="view-analytics"> </a>View analytics

To view analytics for Basic Calculator, switch back to the publisher portal by selecting **Manage** from the menu at the top right of the developer portal.

![Manage][api-management-manage-menu]

The default view for the publisher portal is the **Dashboard**, which provides an overview of your API Management instance.

![Dashboard][api-management-dashboard]

Hover the mouse over the chart for **Basic Calculator** to see the specific metrics for the usage of the API for a given time period.

>[AZURE.NOTE] If you don't see any lines on your chart, switch back to the developer portal and make some calls into the API, wait a few moments, and then come back to the dashboard.

Click **View Details** to view the summary page for the API, including a larger version of the displayed metrics.

![Analytics][api-management-mouse-over]

![Summary][api-management-api-summary-metrics]

For detailed metrics and reports, click **Analytics** from the **API Management** menu on the left.

![Overview][api-management-analytics-overview]

The **Analytics** section has the following four tabs:

-	**At a glance** provides overall usage and health metrics, as well as the top developers, top products, top APIs, and top operations.
-	**Usage** provides an in-depth look at API calls and bandwidth, including a geographical representation.
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
[How to configure notifications and email templates in Azure API Management]: api-management-howto-configure-notifications.md
[Responses]: api-management-howto-add-operations.md#responses
[How create and publish a product]: api-management-howto-add-products.md
[Get started with advanced API configuration]: api-management-get-started-advanced.md
[API Management pricing]: http://azure.microsoft.com/pricing/details/api-management/

[Azure Classic Portal]: https://manage.windowsazure.com/

[api-management-management-console]: ./media/api-management-get-started/api-management-management-console.png
[api-management-create-instance-menu]: ./media/api-management-get-started/api-management-create-instance-menu.png
[api-management-create-instance-step1]: ./media/api-management-get-started/api-management-create-instance-step1.png
[api-management-create-instance-step2]: ./media/api-management-get-started/api-management-create-instance-step2.png
[api-management-instance-created]: ./media/api-management-get-started/api-management-instance-created.png
[api-management-import-api]: ./media/api-management-get-started/api-management-import-api.png
[api-management-import-new-api]: ./media/api-management-get-started/api-management-import-new-api.png
[api-management-imported-api-summary]: ./media/api-management-get-started/api-management-imported-api-summary.png
[api-management-calc-operations]: ./media/api-management-get-started/api-management-calc-operations.png
[api-management-list-products]: ./media/api-management-get-started/api-management-list-products.png
[api-management-add-api-to-product]: ./media/api-management-get-started/api-management-add-api-to-product.png
[api-management-add-myechoapi-to-product]: ./media/api-management-get-started/api-management-add-myechoapi-to-product.png
[api-management-api-added-to-product]: ./media/api-management-get-started/api-management-api-added-to-product.png
[api-management-developers]: ./media/api-management-get-started/api-management-developers.png
[api-management-add-subscription]: ./media/api-management-get-started/api-management-add-subscription.png
[api-management-add-subscription-window]: ./media/api-management-get-started/api-management-add-subscription-window.png
[api-management-subscription-added]: ./media/api-management-get-started/api-management-subscription-added.png
[api-management-developer-portal-menu]: ./media/api-management-get-started/api-management-developer-portal-menu.png
[api-management-developer-portal-calc-api]: ./media/api-management-get-started/api-management-developer-portal-calc-api.png
[api-management-developer-portal-calc-api-console]: ./media/api-management-get-started/api-management-developer-portal-calc-api-console.png
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
