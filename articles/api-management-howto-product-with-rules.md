# How create and configure advanced product settings in Azure API Management

In Azure API Management, products are highly configurable to meet the requirements of API publishers. This topic demonstrates how to configure some of the advanced product settings, including subscription approval, subscription expiration, and quotas.

In this tutorial you will create a 30 Day Free Trial product that allows up to 10 calls per minute up to a maximum of 200 calls per week, publish it, and test the rate limit policy.

## In this topic

-   [Create a product with a subscription expiration][]
-   [Configure call rate limit and quota policies][]
-   [Add an API to the product][]
-   [Publish the product][]
-   [Subscribe a developer account to the product][]
-   [Call an operation and test the rate limit][]

## <a name="create-product"> </a>Create a product with a subscription expiration

In this step, you will create a 30 Day Free Trial product that does not require subscription approval, but expires after 30 days.

To get started, click **Management Console** in the Azure Portal for your API Management service. This takes you to the API Management administrative portal.

![api-management-management-console][]

Click **Products** in the **API Management** menu on the left to display the **Products** page.

![api-management-add-product][]

Click **add product** to display the **Add new product** pop up window. 

![api-management-new-product-window][]

Type **30 Day Free Trial** into the **Title** text box.

Type **Subscribers will be able to run 10 calls/minute up to a maximum of 200 calls/week for up to 30 days after which access is denied.** into the **Description** text box.

If you want an administrator to review and accept or reject subscription attempts to this product, check **Require subscription approval**. If the box is unchecked, subscription attempts will be auto-approved. In this example subscriptions are automatically approved, so do not check the box.

>For more information on subscriptions, see [View subscribers to a product][].

Check the box for **Enable subscription expiration**. Select **30 Day(s)** for **Subscription period**, and **25 Day(s)** for **Expiration notification** period.

>Allowable values for the expiration interval are **Day(s)**, **Month(s)**, or **Year(s)**.

After all values are entered, click **Save** to create the product.

![api-management-product-added][]

Note that by default the product will be visible to the **administrator** and **developer** roles.

>Subscription approval and expiration can also be configured after the product is created by going to the **settings** tab.

## <a name="policies"> </a>Configure call rate limit and quota policies

Rate limits and quotas are configured in the policy editor. Click **Policies** under the **API Management** menu on the left, and select **30 Day Free Trial** from the **Policy Scope Product** drop-down.

![api-management-add-policy][]

Click **add policy** to import the policy template and begin creating the rate limit and quota policy.

To insert policies, position the cursor into either the **inbound** or **outbound** section of the policy template. Rate limit and quota policies are inbound policies, so position the cursor in the inbound element.

![api-management-policy-editor-inbound][]

The two policies we are adding in this tutorial are the **Limit call rate** and **Set usage quota** policies.

![api-management-limit-policies][]

Once the cursor is positioned in the **inbound** policy element, click the arrow beside **Limit call rate** to insert its policy template.

	<rate-limit calls="number" renewal-period="seconds">
	<api name="name" calls="number" renewal-period="seconds">
	<operation name="name" calls="number" renewal-period="seconds" />
	</api>
	</rate-limit>

**Limit call rate** can be used at the product level, and can also be used at the API and individual operation name levels. In this tutorial only product level policies are used, so delete the **api** and **operation** elements from the **rate-limit** element, as shown in the following example.

	<rate-limit calls="number" renewal-period="seconds">
	</rate-limit>

In the **30 Day Free Trial** product, the maximum allowable call rate is 10 calls per minute, so type **10** as the value for the calls attribute, and **60** for the **renewal-period** attribute.

	<rate-limit calls="10" renewal-period="60">
	</rate-limit>

To configure the **Set usage quota** policy, position your cursor immediately below the newly added **rate-limit** element within the **inbound** element, and click the arrow to the left of **Set usage quota**.

	<quota calls="number" bandwidth="kilobytes" renewal-period="seconds">
	<api name="name" calls="number" bandwidth="kilobytes" renewal-period="seconds">
	<operation name="name" calls="number" bandwidth="kilobytes" renewal-period="seconds" />
	</api>
	</quota>

Because this policy is also intended to be at the product level, delete the **api** and **operation** name elements, as shown in the following example.

	<quota calls="number" bandwidth="kilobytes" renewal-period="seconds">
	</quota>

Quotas can be based on number of calls per interval, bandwidth, or both. In this tutorial we are not throttling based on bandwidth, so delete the **bandwidth** attribute.

	<quota calls="number" renewal-period="seconds">
	</quota>

In the **30 Day Free Trial** product, the quota is 200 calls per week. Specify **200** as the value for the calls attribute, and specify **1209600** as the value for the renewal-period.

	<quota calls="200" bandwidth="kilobytes" renewal-period="1209600">
	</quota>

>Policy intervals are specified in seconds. To calculate the interval for a week, you can multiply the number of days (7) by the number of hours in a day (48) by the number of minutes in an hour (60) by the number of seconds in a minute (60). 7 * 48 * 60 * 60 - 1209600.

When you have finished configuring the policy, it should match the following example.

	<policies>
    	<inbound>
        	<rate-limit calls="10" renewal-period="60">
        	</rate-limit>
        
       		<quota calls="200" bandwidth="kilobytes" renewal-period="1209600">
        	</quota>
        
        	<base />
        
    	</inbound>
    	<outbound>
        
        	<base />
        
    	</outbound>
	</policies>

Once the desired policies are configured, click **Save**.

![api-management-policy-save][]

>When you save the policy, API Management may slightly reformat the policy, as shown in the following example.

![api-management-policy-saved][]

## <a name="add-api"> </a>Add an API to the product

To test the newly added policies, we can add an API to the 30 Day Free Trial product and call its operations.

Click **Products** from the **API Management** menu on the left, and click **30 Day Free Trial** to configure the product.

![api-management-configure-product][]

Click **add API to product**.

![api-management-add-api][]

Check the box beside the API to add and click **Save**. In this example we are using the **Echo API** from that comes pre-configured with each API Management instance.

![api-management-add-echo-api][]

>Note that the same API can't be added to multiple products if the same developer accounts are subscribed to the products. If your account is already subscribed to another product that has the Echo API added, you can unsubscribe from that product or choose a different API for this tutorial step.

## <a name="publish-product"> </a> Publish the product

Before the product can be used by developers, it must be published. Click **Products** from the **API Management** menu on the left, and click **30 Day Free Trial** to configure the product.

![api-management-configure-product][]

Click **publish** to make the product available for subscribing by the developers in the associated roles.

![api-management-publish-product][]

## <a name="subscribe-account"> </a>Subscribe a developer account to the product

Click **Developers** on the **API Management** menu on the left, and click the name of your developer account to configure it.

![api-management-configure-developer][]

Click **add subscription**.

![api-management-add-subscription-menu][]

Check the box beside **30 Day Free Trial** and click **Subscribe**.

![api-management-add-subscription][]

In addition to listing the subscribed products, the details tab also displays the developer key which is used to call the APIs in the subscribed products.

![api-management-subscription-added][]

## <a name="test-rate-limit"> </a>Call an operation and test the rate limit

Now that the 30 Day Free Trial product is configured and published, switch to the developer portal by clicking **Developer portal** in the top right menu.

![api-management-developer-portal-menu][]

Click **APIs** in the top menu and select **Echo API**.

>If you used a different API in the previous step, use that API, and operations from that API for the following steps.

![api-management-developer-portal-api-menu][]

Click **Open Console** for the **GET Resource** operation, which is the first operation in the Echo API and is displayed at the top of the tab.

![api-management-open-console][]

Enter some sample parameters and click **HTTP Get**.

>If your developer key is not pre-filled in the key field, you can paste in the key from the developer configuration page as shown in the previous [Subscribe a developer account to the product][] step.

![api-management-http-get][]

Note the **Response status** of **200 OK**.

![api-management-http-get-results][]

Click **HTTP Get** at a rate greater than the rate limit policy of 10 calls per minute. Once the rate limit policy is exceeded, a response status of **429 Too many Requests** is returned.

![api-management-http-get-429][]

The Response Headers indicate the remaining interval before retries will be successful. In this example the remaining interval is 7 seconds.

>Unsuccessful calls do not count toward the rate limit.

[api-management-management-console]: ./Media/api-management-howto-product-with-rules/api-management-management-console.png
[api-management-add-product]: ./Media/api-management-howto-product-with-rules/api-management-add-product.png
[api-management-new-product-window]: ./Media/api-management-howto-product-with-rules/api-management-new-product-window.png
[api-management-product-added]: ./Media/api-management-howto-product-with-rules/api-management-product-added.png
[api-management-add-policy]: ./Media/api-management-howto-product-with-rules/api-management-add-policy.png
[api-management-policy-editor-inbound]: ./Media/api-management-howto-product-with-rules/api-management-policy-editor-inbound.png
[api-management-limit-policies]: ./Media/api-management-howto-product-with-rules/api-management-limit-policies.png
[api-management-policy-save]: ./Media/api-management-howto-product-with-rules/api-management-policy-save.png
[api-management-policy-saved]: ./Media/api-management-howto-product-with-rules/api-management-policy-saved.png
[api-management-configure-product]: ./Media/api-management-howto-product-with-rules/api-management-configure-product.png
[api-management-add-api]: ./Media/api-management-howto-product-with-rules/api-management-add-api.png
[api-management-add-echo-api]: ./Media/api-management-howto-product-with-rules/api-management-add-echo-api.png
[api-management-developer-portal-menu]: ./Media/api-management-howto-product-with-rules/api-management-developer-portal-menu.png
[api-management-publish-product]: ./Media/api-management-howto-product-with-rules/api-management-publish-product.png
[api-management-configure-developer]: ./Media/api-management-howto-product-with-rules/api-management-configure-developer.png
[api-management-add-subscription-menu]: ./Media/api-management-howto-product-with-rules/api-management-add-subscription-menu.png
[api-management-add-subscription]: ./Media/api-management-howto-product-with-rules/api-management-add-subscription.png
[api-management-subscription-added]: ./Media/api-management-howto-product-with-rules/api-management-subscription-added.png
[api-management-developer-portal-api-menu]: ./Media/api-management-howto-product-with-rules/api-management-developer-portal-api-menu.png
[api-management-open-console]: ./Media/api-management-howto-product-with-rules/api-management-open-console.png
[api-management-http-get]: ./Media/api-management-howto-product-with-rules/api-management-http-get.png
[api-management-http-get-results]: ./Media/api-management-howto-product-with-rules/api-management-http-get-results.png
[api-management-http-get-429]: ./Media/api-management-howto-product-with-rules/api-management-http-get-429.png


[How to add operations to an API]: ./api-management-hotwo-add-operations
[How to add and publish a product]: ./api-management-howto-add-product
[Monitoring and analytics]: ./api-management-monitoring
[Add APIs to a product]: ./api-management-howto-add-product/#add-apis
[Publish a product]: ./api-management-howto-add-product/#publish-product
[Get started with Azure API Management]: ./api-management-get-started

[Create a product with a subscription expiration]: #create-product
[Configure call rate limit and quota policies]: #policies
[Add an API to the product]: #add-api
[Publish the product]: #publish-product
[Subscribe a developer account to the product]: #subscribe-account
[Call an operation and test the rate limit]: #test-rate-limit

