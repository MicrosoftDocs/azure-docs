<properties 
	pageTitle="Protect your API with rate limits using Azure API Management" 
	description="Learn how to protect your API with quotas and throttling (rate-limiting) policies." 
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

# Protect your API with rate limits using Azure API Management

This guide shows you how easy it is to add protection for your backend API by configuring rate limit and quota policies with Azure API Management.

In this tutorial you will create a 'Free Trial' API product that allows developers to make up to 10 calls per minute and up to a maximum of 200 calls per week to your API. You will then publish the API, and test the rate limit policy.

>[AZURE.NOTE] If you already have a product configured and want to use it for this tutorial, you can jump ahead to [Configure call rate limit and quota policies][] and follow the tutorial from there using your product in place of the **Free Trial** product.

## <a name="create-product"> </a>Create a product

In this step, you will create a Free Trial product that does not require subscription approval.

To get started, click **Manage** in the Azure Portal for your API Management service. This takes you to the API Management publisher portal.

![Publisher portal][api-management-management-console]

>If you have not yet created an API Management service instance, see [Create an API Management service instance][] in the [Get started with Azure API Management][] tutorial.

Click **Products** in the **API Management** menu on the left to display the **Products** page.

![Add product][api-management-add-product]

Click **add product** to display the **Add new product** pop up window. 

![Add new product][api-management-new-product-window]

Type **Free Trial** into the **Title** text box.

Type **Subscribers will be able to run 10 calls/minute up to a maximum of 200 calls/week after which access is denied.** into the **Description** text box.

Products in API Management can be **Open** or **Protected**. Protected products must be subscribed to before they can be used, while open products can be used without a subscription. Ensure that **Require subscription** is checked to create a protected product that requires a subscription. This is the default setting.

If you want an administrator to review and accept or reject subscription attempts to this product, check **Require subscription approval**. If the box is unchecked, subscription attempts will be auto-approved. In this example subscriptions are automatically approved, so do not check the box.

To allow developer accounts to subscribe multiple times to the new product, check the **Allow multiple simultaneous subscriptions** check box. This topic does not utilize multiple simultaneous subscriptions, so leave it unchecked.

After all values are entered, click **Save** to create the product.

![Product added][api-management-product-added]

By default new products are visible to users in the **Administrators** group. We are going to add the **Developers** group. Click **Free Trial**, and select the **Visibility** tab.

>In API Management, groups are used to manage the visibility of products to developers. Products grant visibility to groups, and developers can view and subscribe to the products that are visible to the groups in which they belong. For more information, see [How to create and use groups in Azure API Management][].

![Add developers group][api-management-add-developers-group]

Check the **Developers** group and click **Save**.

## <a name="add-api"> </a>Add an API to the product

In this step of the tutorial, we will add the Echo API to the new Free Trial product.

>Each API Management service instance comes pre-configured with an Echo API that can be used to experiment with and learn about API Management. For more information, see [Get started with Azure API Management][].

Click **Products** from the **API Management** menu on the left, and click **Free Trial** to configure the product.

![Configure product][api-management-configure-product]

Click **Add API to product**.

![Add API to product][api-management-add-api]

Check the box beside **Echo API** and click **Save**.

![Add Echo API][api-management-add-echo-api]

## <a name="policies"> </a>Configure call rate limit and quota policies

Rate limits and quotas are configured in the policy editor. Click **Policies** under the **API Management** menu on the left, and select **Free Trial** from the **Policy Scope Product** drop-down.

![Product policy][api-management-product-policy]

Click **Add Policy** to import the policy template and begin creating the rate limit and quota policy.

![Add policy][api-management-add-policy]

To insert policies, position the cursor into either the **inbound** or **outbound** section of the policy template. Rate limit and quota policies are inbound policies, so position the cursor in the inbound element.

![Policy editor][api-management-policy-editor-inbound]

The two policies we are adding in this tutorial are the [Limit call rate][] and [Set usage quota][] policies.

![Policy statements][api-management-limit-policies]

Once the cursor is positioned in the **inbound** policy element, click the arrow beside **Limit call rate** to insert its policy template.

	<rate-limit calls="number" renewal-period="seconds">
	<api name="name" calls="number">
	<operation name="name" calls="number" />
	</api>
	</rate-limit>

**Limit call rate** can be used at the product level, and can also be used at the API and individual operation name levels. In this tutorial only product level policies are used, so delete the **api** and **operation** elements from the **rate-limit** element, so only the outer **rate-limit** element remains, as shown in the following example.

	<rate-limit calls="number" renewal-period="seconds">
	</rate-limit>

In the **Free Trial** product, the maximum allowable call rate is 10 calls per minute, so type **10** as the value for the calls attribute, and **60** for the **renewal-period** attribute.

	<rate-limit calls="10" renewal-period="60">
	</rate-limit>

To configure the **Set usage quota** policy, position your cursor immediately below the newly added **rate-limit** element within the **inbound** element, and click the arrow to the left of **Set usage quota**.

	<quota calls="number" bandwidth="kilobytes" renewal-period="seconds">
	<api name="name" calls="number" bandwidth="kilobytes">
	<operation name="name" calls="number" bandwidth="kilobytes" />
	</api>
	</quota>

Because this policy is also intended to be at the product level, delete the **api** and **operation** name elements, as shown in the following example.

	<quota calls="number" bandwidth="kilobytes" renewal-period="seconds">
	</quota>

Quotas can be based on number of calls per interval, bandwidth, or both. In this tutorial we are not throttling based on bandwidth, so delete the **bandwidth** attribute.

	<quota calls="number" renewal-period="seconds">
	</quota>

In the **Free Trial** product, the quota is 200 calls per week. Specify **200** as the value for the calls attribute, and specify **604800** as the value for the renewal-period.

	<quota calls="200" renewal-period="604800">
	</quota>

>Policy intervals are specified in seconds. To calculate the interval for a week, you can multiply the number of days (7) by the number of hours in a day (24) by the number of minutes in an hour (60) by the number of seconds in a minute (60). 7 * 24 * 60 * 60 = 604800.

When you have finished configuring the policy, it should match the following example.

	<policies>
		<inbound>
			<rate-limit calls="10" renewal-period="60">
			</rate-limit>
			<quota calls="200" renewal-period="604800">
			</quota>
			<base />
        
	</inbound>
	<outbound>
        
		<base />
        
		</outbound>
	</policies>

Once the desired policies are configured, click **Save**.

![Save policy][api-management-policy-save]

## <a name="publish-product"> </a> Publish the product

Now that the the APIs are added and the policies configured, the product is ready to be used by developers. Before the product can be used by developers, it must be published. Click **Products** from the **API Management** menu on the left, and click **Free Trial** to configure the product.

![Configure product][api-management-configure-product]

Click **Publish**, and then click **Yes, publish it** to confirm.

![Publish product][api-management-publish-product]

## <a name="subscribe-account"> </a>Subscribe a developer account to the product

Now that the product is published, it is available to be subscribed to and used by developers.

>Administrators of an API Management instance are automatically subscribed to every product. In this tutorial step we will subscribe one of the non-administrator developer accounts to the Free Trial product. If your developer account is part of the Administrators role then you can follow along with this step, even though you are already subscribed.

Click **Users** on the **API Management** menu on the left, and click the name of your developer account. In this example we are using the **Clayton Gragg**  developer account.

![Configure developer][api-management-configure-developer]

Click **Add Subscription**.

![Add subscription][api-management-add-subscription-menu]

Check the box beside **Free Trial** and click **Subscribe**.

![Add subscription][api-management-add-subscription]

>[AZURE.NOTE] In this tutorial, multiple simultaneous subscriptions are not enabled for the **Free Trial** product. If they were, you would be prompted to name the subscription, as shown in the following example.

![Add subscription][api-management-add-subscription-multiple]

After clicking **Subscribe**, the product appears in the **Subscription** list for the user.

![Subscription added][api-management-subscription-added]

## <a name="test-rate-limit"> </a>Call an operation and test the rate limit

Now that the Free Trial product is configured and published, we can call some operations and test the rate limit policy. Switch to the developer portal by clicking **Developer portal** in the top right menu.

![Developer portal][api-management-developer-portal-menu]

Click **APIs** in the top menu and select **Echo API**.

![Developer portal][api-management-developer-portal-api-menu]

Select the **GET Resource** operation, and click **Open Console**.

![Open console][api-management-open-console]

Keep the default parameter values, and select your subscription key for the **Free Trial** product.

![Subscription key][api-management-select-key]

>[AZURE.NOTE] If you have multiple subscriptions be sure to select the key for **Free Trial**, or else the policies that were configured in the previous steps won't be in effect.

Click **HTTP Get** and view the response. Note the **Response status** of **200 OK**.

![Operation results][api-management-http-get-results]

Click **HTTP Get** at a rate greater than the rate limit policy of 10 calls per minute. Once the rate limit policy is exceeded, a response status of **429 Too many Requests** is returned.

![Operation results][api-management-http-get-429]

The **Response Headers** and the **Response content** indicate the remaining interval before retries will be successful.

When the rate limit policy of 10 calls per minute in effect, subsequent calls will fail until 60 seconds have elapsed from the first of the 10 successful calls to the product before the rate limit was exceeded. In this example the remaining interval is 43 seconds.

## <a name="next-steps"> </a>Next steps

-	Check out the other topics in the [Get started with advanced API configuration][] tutorial.


[api-management-management-console]: ./media/api-management-howto-product-with-rules/api-management-management-console.png
[api-management-add-product]: ./media/api-management-howto-product-with-rules/api-management-add-product.png
[api-management-new-product-window]: ./media/api-management-howto-product-with-rules/api-management-new-product-window.png
[api-management-product-added]: ./media/api-management-howto-product-with-rules/api-management-product-added.png
[api-management-add-policy]: ./media/api-management-howto-product-with-rules/api-management-add-policy.png
[api-management-policy-editor-inbound]: ./media/api-management-howto-product-with-rules/api-management-policy-editor-inbound.png
[api-management-limit-policies]: ./media/api-management-howto-product-with-rules/api-management-limit-policies.png
[api-management-policy-save]: ./media/api-management-howto-product-with-rules/api-management-policy-save.png
[api-management-configure-product]: ./media/api-management-howto-product-with-rules/api-management-configure-product.png
[api-management-add-api]: ./media/api-management-howto-product-with-rules/api-management-add-api.png
[api-management-add-echo-api]: ./media/api-management-howto-product-with-rules/api-management-add-echo-api.png
[api-management-developer-portal-menu]: ./media/api-management-howto-product-with-rules/api-management-developer-portal-menu.png
[api-management-publish-product]: ./media/api-management-howto-product-with-rules/api-management-publish-product.png
[api-management-configure-developer]: ./media/api-management-howto-product-with-rules/api-management-configure-developer.png
[api-management-add-subscription-menu]: ./media/api-management-howto-product-with-rules/api-management-add-subscription-menu.png
[api-management-add-subscription]: ./media/api-management-howto-product-with-rules/api-management-add-subscription.png
[api-management-developer-portal-api-menu]: ./media/api-management-howto-product-with-rules/api-management-developer-portal-api-menu.png
[api-management-open-console]: ./media/api-management-howto-product-with-rules/api-management-open-console.png
[api-management-http-get]: ./media/api-management-howto-product-with-rules/api-management-http-get.png
[api-management-http-get-results]: ./media/api-management-howto-product-with-rules/api-management-http-get-results.png
[api-management-http-get-429]: ./media/api-management-howto-product-with-rules/api-management-http-get-429.png
[api-management-product-policy]: ./media/api-management-howto-product-with-rules/api-management-product-policy.png
[api-management-add-developers-group]: ./media/api-management-howto-product-with-rules/api-management-add-developers-group.png
[api-management-select-key]: ./media/api-management-howto-product-with-rules/api-management-select-key.png
[api-management-subscription-added]: ./media/api-management-howto-product-with-rules/api-management-subscription-added.png
[api-management-add-subscription-multiple]: ./media/api-management-howto-product-with-rules/api-management-add-subscription-multiple.png

[How to add operations to an API]: api-management-howto-add-operations.md
[How to add and publish a product]: api-management-howto-add-products.md
[Monitoring and analytics]: api-management-monitoring.md
[Add APIs to a product]: api-management-howto-add-products.md#add-apis
[Publish a product]: api-management-howto-add-products.md#publish-product
[Get started with Azure API Management]: api-management-get-started.md
[How to create and use groups in Azure API Management]: api-management-howto-create-groups.md
[View subscribers to a product]: api-management-howto-add-products.md#view-subscribers
[Get started with Azure API Management]: api-management-get-started.md
[Create an API Management service instance]: api-management-get-started.md#create-service-instance
[Next steps]: #next-steps

[Create a product]: #create-product
[Configure call rate limit and quota policies]: #policies
[Add an API to the product]: #add-api
[Publish the product]: #publish-product
[Subscribe a developer account to the product]: #subscribe-account
[Call an operation and test the rate limit]: #test-rate-limit
[Get started with advanced API configuration]: api-management-get-started-advanced.md

[Limit call rate]: https://msdn.microsoft.com/library/azure/dn894078.aspx#LimitCallRate
[Set usage quota]: https://msdn.microsoft.com/library/azure/dn894078.aspx#SetUsageQuota



