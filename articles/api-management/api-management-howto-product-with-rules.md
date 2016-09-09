<properties
	pageTitle="Protect your API with Azure API Management | Microsoft Azure"
	description="Learn how to protect your API with quotas and throttling (rate-limiting) policies."
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
	ms.topic="get-started-article"
	ms.date="08/09/2016"
	ms.author="sdanie"/>

# Protect your API with rate limits using Azure API Management

This guide shows you how easy it is to add protection for your backend API by configuring rate limit and quota policies with Azure API Management.

In this tutorial, you will create a "Free Trial" API product that allows developers to make up to 10 calls per minute and up to a maximum of 200 calls per week to your API using the [Limit call rate per subscription](https://msdn.microsoft.com/library/azure/dn894078.aspx#LimitCallRate) and [Set usage quota per subscription](https://msdn.microsoft.com/library/azure/dn894078.aspx#SetUsageQuota) policies. You will then publish the API and test the rate limit policy.

For more advanced throttling scenarios using the [rate-limit-by-key](https://msdn.microsoft.com/library/azure/dn894078.aspx#LimitCallRateByKey) and [quota-by-key](https://msdn.microsoft.com/library/azure/dn894078.aspx#SetUsageQuotaByKey) policies, see [Advanced request throttling with Azure API Management](api-management-sample-flexible-throttling.md).

## <a name="create-product"> </a>To create a product

In this step, you will create a Free Trial product that does not require subscription approval.

>[AZURE.NOTE] If you already have a product configured and want to use it for this tutorial, you can jump ahead to [Configure call rate limit and quota policies][] and follow the tutorial from there using your product in place of the Free Trial product.

To get started, click **Manage** in the Azure Classic for your API Management service. This takes you to the API Management publisher portal.

![Publisher portal][api-management-management-console]

>If you have not yet created an API Management service instance, see [Create an API Management service instance][] in the [Manage your first API in Azure API Management][] tutorial.

Click **Products** in the **API Management** menu on the left to display the **Products** page.

![Add product][api-management-add-product]

Click **Add product** to display the **Add new product** dialog box.

![Add new product][api-management-new-product-window]

In the **Title** box, type **Free Trial**.

In the **Description** box, type the following text:
 **Subscribers will be able to run 10 calls/minute up to a maximum of 200 calls/week after which access is denied.**

Products in API Management can be protected or open. Protected products must be subscribed to before they can be used. Open products can be used without a subscription. Ensure that **Require subscription** is selected to create a protected product that requires a subscription. This is the default setting.

If you want an administrator to review and accept or reject subscription attempts to this product, select **Require subscription approval**. If the check box is not selected, subscription attempts will be auto-approved. In this example, subscriptions are automatically approved, so do not select the box.

To allow developer accounts to subscribe multiple times to the new product, select the **Allow multiple simultaneous subscriptions** check box. This tutorial does not utilize multiple simultaneous subscriptions, so leave it unchecked.

After all values are entered, click **Save** to create the product.

![Product added][api-management-product-added]

By default, new products are visible to users in the **Administrators** group. We are going to add the **Developers** group. Click **Free Trial**, and then click the **Visibility** tab.

>In API Management, groups are used to manage the visibility of products to developers. Products grant visibility to groups, and developers can view and subscribe to the products that are visible to the groups in which they belong. For more information, see [How to create and use groups in Azure API Management][].

![Add developers group][api-management-add-developers-group]

Select the **Developers** check box, and then click **Save**.

## <a name="add-api"> </a>To add an API to the product

In this step of the tutorial, we will add the Echo API to the new Free Trial product.

>Each API Management service instance comes pre-configured with an Echo API that can be used to experiment with and learn about API Management. For more information, see [Manage your first API in Azure API Management][].

Click **Products** from the **API Management** menu on the left, and then click **Free Trial** to configure the product.

![Configure product][api-management-configure-product]

Click **Add API to product**.

![Add API to product][api-management-add-api]

Select **Echo API**, and then click **Save**.

![Add Echo API][api-management-add-echo-api]

## <a name="policies"> </a>To configure call rate limit and quota policies

Rate limits and quotas are configured in the policy editor. Click **Policies** under the **API Management** menu on the left. In the **Product** list, click **Free Trial**.

![Product policy][api-management-product-policy]

Click **Add Policy** to import the policy template and begin creating the rate limit and quota policies.

![Add policy][api-management-add-policy]

To insert policies, position the cursor into either the **inbound** or **outbound** section of the policy template. Rate limit and quota policies are inbound policies, so position the cursor in the inbound element.

![Policy editor][api-management-policy-editor-inbound]

The two policies we are adding in this tutorial are the [Limit call rate per subscription](https://msdn.microsoft.com/library/azure/dn894078.aspx#LimitCallRate) and [Set usage quota per subscription](https://msdn.microsoft.com/library/azure/dn894078.aspx#SetUsageQuota) policies.

![Policy statements][api-management-limit-policies]

After the cursor is positioned in the **inbound** policy element, click the arrow beside **Limit call rate per subscription** to insert its policy template.

	<rate-limit calls="number" renewal-period="seconds">
	<api name="name" calls="number">
	<operation name="name" calls="number" />
	</api>
	</rate-limit>

**Limit call rate per subscription** can be used at the product level and can also be used at the API and individual operation name levels. In this tutorial, only product-level policies are used, so delete the **api** and **operation** elements from the **rate-limit** element, so only the outer **rate-limit** element remains, as shown in the following example.

	<rate-limit calls="number" renewal-period="seconds">
	</rate-limit>

In the Free Trial product, the maximum allowable call rate is 10 calls per minute, so type **10** as the value for the **calls** attribute, and **60** for the **renewal-period** attribute.

	<rate-limit calls="10" renewal-period="60">
	</rate-limit>

To configure the **Set usage quota per subscription** policy, position your cursor immediately below the newly added **rate-limit** element within the **inbound** element, and then click the arrow to the left of **Set usage quota per subscription**.

	<quota calls="number" bandwidth="kilobytes" renewal-period="seconds">
	<api name="name" calls="number" bandwidth="kilobytes">
	<operation name="name" calls="number" bandwidth="kilobytes" />
	</api>
	</quota>

Because this policy is also intended to be at the product level, delete the **api** and **operation** name elements, as shown in the following example.

	<quota calls="number" bandwidth="kilobytes" renewal-period="seconds">
	</quota>

Quotas can be based on the number of calls per interval, bandwidth, or both. In this tutorial, we are not throttling based on bandwidth, so delete the **bandwidth** attribute.

	<quota calls="number" renewal-period="seconds">
	</quota>

In the Free Trial product, the quota is 200 calls per week. Specify **200** as the value for the **calls** attribute, and then specify **604800** as the value for the **renewal-period** attribute.

	<quota calls="200" renewal-period="604800">
	</quota>

>Policy intervals are specified in seconds. To calculate the interval for a week, you can multiply the number of days (7) by the number of hours in a day (24) by the number of minutes in an hour (60) by the number of seconds in a minute (60): 7 * 24 * 60 * 60 = 604800.

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

After the desired policies are configured, click **Save**.

![Save policy][api-management-policy-save]

## <a name="publish-product"> </a> To publish the product

Now that the the APIs are added and the policies are configured, the product must be published so that it can be used by developers. Click **Products** from the **API Management** menu on the left, and then click **Free Trial** to configure the product.

![Configure product][api-management-configure-product]

Click **Publish**, and then click **Yes, publish it** to confirm.

![Publish product][api-management-publish-product]

## <a name="subscribe-account"> </a>To subscribe a developer account to the product

Now that the product is published, it is available to be subscribed to and used by developers.

>Administrators of an API Management instance are automatically subscribed to every product. In this tutorial step, we will subscribe one of the non-administrator developer accounts to the Free Trial product. If your developer account is part of the Administrators role, then you can follow along with this step, even though you are already subscribed.

Click **Users** on the **API Management** menu on the left, and then click the name of your developer account. In this example, we are using the **Clayton Gragg** developer account.

![Configure developer][api-management-configure-developer]

Click **Add Subscription**.

![Add subscription][api-management-add-subscription-menu]

Select **Free Trial**, and then click **Subscribe**.

![Add subscription][api-management-add-subscription]

>[AZURE.NOTE] In this tutorial, multiple simultaneous subscriptions are not enabled for the Free Trial product. If they were, you would be prompted to name the subscription, as shown in the following example.

![Add subscription][api-management-add-subscription-multiple]

After clicking **Subscribe**, the product appears in the **Subscription** list for the user.

![Subscription added][api-management-subscription-added]

## <a name="test-rate-limit"> </a>To call an operation and test the rate limit

Now that the Free Trial product is configured and published, we can call some operations and test the rate limit policy.
Switch to the developer portal by clicking **Developer portal** in the upper-right menu.

![Developer portal][api-management-developer-portal-menu]

Click **APIs** in the top menu, and then click **Echo API**.

![Developer portal][api-management-developer-portal-api-menu]

Click **GET Resource**, and then click **Try it**.

![Open console][api-management-open-console]

Keep the default parameter values, and then select your subscription key for the Free Trial product.

![Subscription key][api-management-select-key]

>[AZURE.NOTE] If you have multiple subscriptions, be sure to select the key for **Free Trial**, or else the policies that were configured in the previous steps won't be in effect.

Click **Send**, and then view the response. Note the **Response status** of **200 OK**.

![Operation results][api-management-http-get-results]

Click **Send** at a rate greater than the rate limit policy of 10 calls per minute. After the rate limit policy is exceeded, a response status of **429 Too Many Requests** is returned.

![Operation results][api-management-http-get-429]

The **Response content** indicates the remaining interval before retries will be successful.

When the rate limit policy of 10 calls per minute is in effect, subsequent calls will fail until 60 seconds have elapsed from the first of the 10 successful calls to the product before the rate limit was exceeded. In this example, the remaining interval is 54 seconds.

## <a name="next-steps"> </a>Next steps

-	Check out the other topics in the [Get started with advanced API configuration][] tutorial.
-	Watch a demo of setting rate limits and quotas in the following video.

> [AZURE.VIDEO rate-limits-and-quotas]


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
[Monitoring and analytics]: ../api-management-monitoring.md
[Add APIs to a product]: api-management-howto-add-products.md#add-apis
[Publish a product]: api-management-howto-add-products.md#publish-product
[Manage your first API in Azure API Management]: api-management-get-started.md
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
