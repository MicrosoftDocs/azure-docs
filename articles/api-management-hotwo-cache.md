# How to cache operation results using Azure API Management

Azure API Management provides operation response caching. Response caching can significantly reduce API latency, bandwidth consumption, and web service load for data that does not change frequently.

In this tutorial you will review the caching settings and policies for one of the sample Echo Api operations, and call the operation in the developer portal to see the caching in operation.

## In this topic

-   [Configure an operation for caching][]
-   [Review the caching policies][]
-   [Call an operation and test the caching][]
-   [Next steps][]

## <a name="configure-caching"> </a>Configure an operation for caching

In this step, you will review the caching settings of the **GET Resource (cached)** operation of the sample Echo Api.

>Each API Management service instance comes pre-configured with an Echo API that can be used to experiment with and learn about API Management. For more information, see [Get started with Azure API Management][].

To get started, click **Management Console** in the Azure Portal for your API Management service. This takes you to the API Management administrative portal.

![api-management-management-console][]

Click **APIs** from the **API Management** menu on the left, and click **Echo API**.


Select the **operations** tab, and click the **GET Resource (cached)** operation from the **Operations** list.

Select the **Caching** tab to view the caching settings for this operation.


To enable caching for an operation, check the **Enable** checkbox. In this example caching is enabled.

Each operation response is keyed based on the values in the **Vary by query string parameters** and **Vary by headers** fields. If you want to cache multiple responses based on query string parameters or headers, you can configure them in these two fields.

**Duration** specifies the expiration interval of the cached responses. In this example the interval is **3600** seconds, which is equivalent to one hour.

Using the caching configuration in this example, the first request to the **GET Resource (cached)** operation will return a response from the back-end service. This response will be cached, keyed by the specified headers and query string parameters. Subsequent calls to the operation, with matching parameters, will have the cached response returned, until the cache duration interval has expired.

## <a name="caching-policies"> </a>Review the caching policies

When caching settings are configured for an operation on the **Caching** tab, caching policies are added for the operation. These policies can be viewed and edited in the policy editor.

Click **Policies** from the **API Management** menu on the left, and select **Echo API / GET Resource (cached)** from the **Operation** drop-down.

The policy definition for this operation includes the policies that define the caching configuration that was configured using the **Caching** tab in the previous step.

	<policies>
		<inbound>
			<base />
			<cache-lookup vary-by-developer="false" vary-by-developer-groups="false">
				<vary-by-header>Accept</vary-by-header>
				<vary-by-header>Accept-Charset</vary-by-header>
			</cache-lookup>
			<rewrite-uri template="/resource" />
		</inbound>
		<outbound>
			<base />
			<cache-store caching-mode="cache-on" duration="3600" />
		</outbound>
	</policies>

>Changes made here will reflect in the **Caching** tab of an operation, and vice-versa.

## <a name="test-operation"> </a>Call an operation and test the caching

To see the caching in action, we can call the operation from the developer portal. Click **Developer portal** in the top right menu.



Click **APIs** in the top menu and select **Echo API**.


Click **Open Console** for the **GET Resource (cached)** operation

Keep the default values for **param1** and **param2**, and enter **sampleheader:value1** in the **Request headers** text box and click **HTTP Get**.

>If your developer key is not pre-filled in the key field, you can paste in the key from the developer configuration page as shown in the previous [Subscribe a developer account to the product][] step.

Note the response headers.

Enter **sampleheader:value2** in the **Request headers** text box and click **HTTP Get**.

Note that the value of **sampleheader** is still **value1** in the response. Try some different values and note that the cached response from the first call is returned.

Enter **25** into the **param2** field, and click **HTTP Get**.

Note that the value of **sampleheader** in the response is now **value2**. Because the operation results are keyed by query string, the previous cached response was not returned.

## <a name="next-steps"> </a>Next steps

Check out the other steps in the [Get started with advanced API configuration][] tutorial.

[api-management-management-console]: ./Media/api-management-hotwo-cache/api-management-management-console.png
[api-management-]: ./Media/api-management-hotwo-cache/api-management-.png
[api-management-]: ./Media/api-management-hotwo-cache/api-management-.png
[api-management-]: ./Media/api-management-hotwo-cache/api-management-.png
[api-management-]: ./Media/api-management-hotwo-cache/api-management-.png
[api-management-]: ./Media/api-management-hotwo-cache/api-management-.png
[api-management-]: ./Media/api-management-hotwo-cache/api-management-.png
[api-management-]: ./Media/api-management-hotwo-cache/api-management-.png
[api-management-]: ./Media/api-management-hotwo-cache/api-management-.png
[api-management-]: ./Media/api-management-hotwo-cache/api-management-.png
[api-management-]: ./Media/api-management-hotwo-cache/api-management-.png
[api-management-]: ./Media/api-management-hotwo-cache/api-management-.png
[api-management-]: ./Media/api-management-hotwo-cache/api-management-.png
[api-management-]: ./Media/api-management-hotwo-cache/api-management-.png
[api-management-]: ./Media/api-management-hotwo-cache/api-management-.png
[api-management-]: ./Media/api-management-hotwo-cache/api-management-.png
[api-management-]: ./Media/api-management-hotwo-cache/api-management-.png

[How to add operations to an API]: ./api-management-hotwo-add-operations
[How to add and publish a product]: ./api-management-howto-add-product
[Monitoring and analytics]: ./api-management-monitoring
[Add APIs to a product]: ./api-management-howto-add-product/#add-apis
[Publish a product]: ./api-management-howto-add-product/#publish-product
[Get started with Azure API Management]: ./api-management-get-started
[Get started with advanced API configuration]: ./api-management-get-started-advanced

[Configure an operation for caching]: #configure-caching
[Review the caching policies]: #caching-policies
[Call an operation and test the caching]: #test-operation
[Next steps]: #next-steps

