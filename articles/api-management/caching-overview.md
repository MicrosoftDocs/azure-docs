---
title: Caching overview | Azure API Management
description: Learn how caching in Azure API Management helps organizations improve API performance, reduce backend load, and enhance user experience.
services: api-management
author: dlepow
ms.service: azure-api-management
ms.topic: concept-article
ai-usage: ai-assisted
ms.date: 09/11/2025
ms.author: danlep
---

# Caching overview

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

Configure caching in Azure API Management to store and retrieve responses to API requests and related information. By storing responses from backend services, API Management can serve subsequent identical requests directly from the cache, reducing the need to call the backend service repeatedly. Caching can improve API performance, reduce backend load, and enhance the overall experience of customers calling APIs through API Management.

This article explains the caching options in API Management, and highlights key scenarios and configuration considerations.

> [!IMPORTANT]
> Caching requires both a caching service - either an internal cache deployed automatically as part of the API Management service, or an external cache deployed by you - and configuration of [caching policies](api-management-policies.md#caching) to specify how caching should be applied to API requests.
> 


## Caching service options

Azure API Management provides the following caching service options to meet different performance and architectural requirements.

* **Internal (built-in)**: The internal (built-in) cache is automatically provisioned in all API Management service tiers (except the **Consumption** tier). 
    The internal cache implementation differs between the classic tiers (**Developer**, **Basic**, **Standard**, and **Premium**) and the v2 tiers (**Basic v2**, **Standard v2**, and **Premium v2**). The built-in cache in the v2 tiers provides enhanced reliability. [Learn more](api-management-howto-cache.md) about caching with the built-in cache.


* **External** cache: For enhanced performance and persistence, optionally configure an external Redis-compatible cache, such as [Azure Managed Redis](../redis/overview.md), to use with any API Management service tier or gateway. [Learn more](api-management-howto-cache-external.md) about setting up an external cache with Azure Managed Redis.

The following table compares capabilities of the internal and external cache.

| Capability                              | Internal                                                                                                                                                                                                                                    | External |
|------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| **Automatic provisioning and management**               | ✔️                      | ❌          |
| **Added cost**               |    ❌                                                                             |     ✔️ |
| **Custom configuration**               |    ❌                                                                             |     ✔️ |
| **Availability in all tiers and gateways** | Not available in **Consumption** tier or self-hosted gateway                                                                             |     ✔️ |
| **Regional storage**                     | Cache provided in same region as API Management instance and shared among scale units.<br/><br/> In a [multi-region](api-management-howto-deploy-multi-region.md) deployment, each region has its own cache.                           | Depends on customer's preference         |
| **Persistent storage**                     | Persistent in v2 tiers.<br/><br/>In classic tiers (**Developer**, **Basic**, **Standard**, and **Premium**), cache contents *don't* persist when service updates take place.                             |   ✔️       |
| **Per-tier limits**                      | Cache size [varies by service tier](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-api-management-limits)                                                                            |         Not limited |
| **Shared access by multiple API Management instances** | ❌                                                                             |     ✔️ |
|  **[Semantic caching](azure-openai-enable-semantic-caching.md) support**    |                                                            ❌                                                                             |     ✔️ |
| **Data preloading and purging support**                       | ❌                                                                             |     ✔️ |


## Caching scenarios

Use caching in Azure API Management for scenarios like those in the following table.



| Scenario                        | Description                                                                                                                      | Cache type         | Behavior with loss of cache availability or connectivity                |
|----------------------------------|----------------------------------------------------------------------------------------------------------------------------------|---------------------|-----------------------------------------------|
| Optimize client experience       | Speed up repetitive request processing for clients.  | Internal or external   | Backend serves requests and must handle full load if cache is unavailable. |
| Control costs and backend scaling| Reduce backend load and costs when backend isn't scaled for full traffic. |   External | Depends on cache and service configuration. Recommendation: Select a cache service tier with highest reliability and monitor performance.   |
| Metadata store                  | Use [cache-store-value](cache-store-value-policy.md) to store arbitrary data in the cache.                                         | Internal or external   | Depends on cache and service configuration.         |


**Considerations:**

* In any caching scenario, consider the possibility of loss of cache availability or connectivity. API Management uses a "best effort" approach to cache availability. If a configured cache isn't available, cache misses occur and by default requests continue to the backend service.

* In the API Management classic tiers, the internal cache is volatile and doesn't persist across service updates. During a service update, the internal cache is cleared in a gradual process that involves up to 50% of the cache at a time.

    > [!NOTE]
    > You can configure [service update settings](configure-service-update-settings.md), including a maintenance window for updates, to minimize potential customer impacts such as loss of the internal cache.

* If you configure an external cache, it can be persistent, but you're responsible for ensuring availability and connectivity. 

* To protect the backend service from traffic spikes that might overload it when a cache isn't available, configure a rate limiting policy ([rate-limit](rate-limit-policy.md) or [rate-limit-by-key](rate-limit-by-key-policy.md)) immediately after any cache lookup policy.

## Caching policies

Configure caching policies to control how API responses are cached and retrieved in Azure API Management. 

* By default in caching policies, API Management uses an external cache if configured and falls back to the built-in cache otherwise.

* API Management provides caching policies in pairs, as shown in the following table. In a policy definition, configure a cache lookup policy in the `inbound` section to check for cached responses, and a cache store policy in the `outbound` section to store successful responses in the cache.


| Policies | Description | Usage |
|----------|-------------|-------|
| [cache-lookup](cache-lookup-policy.md) / [cache-store](cache-store-policy.md) | - Retrieve a response from the cache<br>- Store a response in the cache request | - Use for retrieving a complete API response from the cache for an identical `GET` request |
| [cache-lookup-value](cache-lookup-value-policy.md) / [cache-store-value](cache-store-value-policy.md) | - Retrieve a specific value from the cache<br>- Store a specific value in the cache  | - Use for custom caching scenarios with specific cache keys |
| [azure-openai-semantic-cache-lookup](azure-openai-semantic-cache-lookup-policy.md) / [azure-openai-semantic-cache-store](azure-openai-semantic-cache-store-policy.md) | - Check if a semantically similar response exists in the cache for an Azure OpenAI API request <br>- Store a response for an Azure OpenAI API request | - Use for retrieving similar responses to Azure OpenAI Chat Completion API requests |
| [llm-semantic-cache-lookup](llm-semantic-cache-lookup-policy.md) / [llm-semantic-cache-store](llm-semantic-cache-store-policy.md) | - Check if a semantically similar response exists in the cache for an LLM API request<br>- Store a response for an LLM API request | - Use for retrieving similar responses to LLM Chat Completion API requests |


> [!TIP]
> * Policies to store entries in the cache include a `duration` attribute to specify how long a cached entry persists.
> * Use [cache-remove-value](cache-remove-value-policy.md) to remove a specific value identified by key from the cache.

## Caching policy examples

The following are basic examples of caching policies in API Management. For more examples, see the [caching policy](api-management-policies.md#caching) reference articles.

### Response caching

Cache complete API response in internal cache to serve identical requests without backend calls. In this example, the cache stores responses for seven days.

```xml
<policies>
    <inbound>
        <base />
        <cache-lookup vary-by-developer="false" vary-by-developer-groups="false" downstream-caching-type="none" must-revalidate="true" caching-type="internal" >
            <vary-by-query-parameter>version</vary-by-query-parameter>
        </cache-lookup>
    </inbound>
    <outbound>
        <cache-store duration="604800" />
        <base />
    </outbound>
</policies>
```

### Value caching

Cache specific data values for reuse across multiple requests.

```xml
<policies>
    <inbound>
        <cache-lookup-value key="user-preferences" default-value="none" variable-name="preferences" />
        <choose>
            <when condition="@(context.Variables["preferences"].ToString() == "none")">
                <!-- Load preferences from backend -->
                <send-request mode="new" response-variable-name="prefsResponse">
                    <set-url>https://backend.api/user/preferences</set-url>
                </send-request>
                <cache-store-value key="user-preferences" value="@(((IResponse)context.Variables["prefsResponse"]).Body.As<string>())" duration="1800" />
            </when>
        </choose>
    </inbound>
</policies>
```


### Rate limiting protection

As a best practice, combine cache lookup with rate limiting to protect backend services.

```xml
<policies>
    <inbound>
        <cache-lookup-value key="@("data-" + context.Request.IpAddress)" variable-name="cachedData" />
        <choose>
            <when condition="@(!context.Variables.ContainsKey("cachedData"))">
                <rate-limit calls="10" renewal-period="60" />
                <!-- Proceed to backend -->
            </when>
            <otherwise>
                <!-- Return cached data without rate limiting -->
                <return-response>
                    <set-body>@((string)context.Variables["cachedData"])</set-body>
                </return-response>
            </otherwise>
        </choose>
    </inbound>
</policies>
```


## Security considerations

- **Sensitive data**: Avoid caching responses containing sensitive or personal information
- **Cache keys**: Ensure cache keys don't expose sensitive information in logs or diagnostics
- **Access control**: External cache requires proper network security and access controls
- **Encryption**: Use TLS/SSL for connections to external cache instances


## Related content

- Learn more about [cache policies](api-management-policies.md#caching) in API Management
- [Set up external caching](api-management-howto-cache-external.md) with Azure Managed Redis
- [Custom caching examples](api-management-sample-cache-by-key.md) with advanced scenarios
- [Monitor API Management](monitor-api-management.md) performance and caching metrics
