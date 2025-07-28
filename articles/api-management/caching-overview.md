---
title: Caching overview | Azure API Management
description: Learn how caching in Azure API Management helps organizations improve API performance, reduce backend load, and enhance user experience.
services: api-management
author: dlepow
ms.service: azure-api-management
ms.topic: concept-article
ai-usage: ai-assisted
ms.date: 07/28/2025
ms.author: danlep
---

# Caching overview

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

Configure caching in Azure API Management to store and retrieve responses to API requests. By storing responses from backend services, API Management can serve subsequent identical requests directly from the cache, reducing the need to call the backend service repeatedly. Response caching can improve API performance, reduce backend load, and enhance the overall experience of customers calling APIs through API Management.

This article explains the available caching options in API Management, and highlights key scenarios and configuration considerations.

> [!IMPORTANT]
> Caching requires both a caching service (either deployed as part of the API Management service, or deployed externally by the customer) and configuration of [caching policies](api-management-policies.md#caching) that specify how caching should be applied to APIs.
> 


## Caching options

Azure API Management provides flexible caching options to meet different performance and architectural requirements.

### Internal (built-in) cache

The internal (built-in) cache is automatically provisioned in all API Management service tiers (except the **Consumption** tier) and is based on a managed Redis service in Azure:

* **Developer**, **Basic**, **Standard**, and **Premium** tiers - a built-in Azure Cache for Redis cache is provisioned.
* **Basic v2**, **Standard v2**, and **Premium v2** tiers - a built-in Azure Managed Redis cache is provisioned.


Considerations for the internal (built-in) cache:

- **Automatic provisioning**: No other steps are required to deploy or manage the cache. Internal cache settings aren't configurable.
- **Configure response caching for APIs using caching policies** - By default in caching policies, API Management uses an external cache if configured and a built-in cache otherwise.
- **Not available for Consumption tier or self-hosted gateway**
- **Regional storage** - Cache data is stored in the same region as your API Management instance and shared among scale units. In a [multi-region](multi-region-api-management.md) deployment, each region has its own cache.
- **Volatile storage** - Cache contents *do not* persist when service updates take place.
- **Per-tier limits** - Cache size varies by service tier. See [service limits](/azure-resource-manager/management/azure-subscription-service-limits#azure-api-management-limits)
- **Does not support semantic caching** - [Semantic caching](azure-openai-enable-semantic-caching.md) of responses from LLM model deployments requires an external cache.
- **No pre-loading** - Preloading of data into the built-in cache isn't supported.

[Learn more](api-management-howto-cache.md) about caching with the built-in cache.

### External cache

For enhanced performance and persistence, you can optionally configure an external Redis-compatible cache, such as Azure Managed Redis, to use with any API Management service tier or gateway. 

Considerations for external cache:

- **Separate deployment required** - You're responsible for deploying, connecting, and maintaining the external cache. The cache can incur added costs.
- **Configure response caching using policies** - By default in caching policies, API Management uses an external cache if configured and a built-in cache otherwise.
- **Only caching option for Consumption tier or self-hosted gateway**
- **Persistent storage** - Cached data persists independently of API Management service updates
- **Custom configuration**: Control cache size, location, performance, and scaling; access Redis-specific features like data persistence, clustering, and geo-replication
- **Shared access**: Multiple API Management instances can share the same external cache
- **Semantic caching** - Only an external cache can be used for [semantic caching](azure-openai-enable-semantic-caching.md) of responses from LLM model deployments.
- **Optional preloading or purging** - Because you manage the cache, you can preload responses into the cache or purge entries as needed.


[Learn more](api-management-howto-cache-external.md) about setting up an external cache with Azure Managed Redis or Azure Cache for Redis.

## Caching scenarios

Use caching in Azure API Management mainly for the scenarios in the following table.



| Scenario                        | Description                                                                                                                      | Cache type         | Behavior with loss of cache availability or connectivity                |
|----------------------------------|----------------------------------------------------------------------------------------------------------------------------------|---------------------|-----------------------------------------------|
| Optimize client experience       | Speed up repetitive request processing for clients.  | Internal or external   | Backend serves requests and must handle full load if cache is unavailable. |
| Control costs and backend scaling| Reduce backend load and costs when backend isn't scaled for full traffic. |   External only | Depends on cache and service configuration. Recommendation: Select a service tier with highest reliability and monitor performance.   |
| Metadata store                  | Use [cache-store-value](cache-store-value-policy.md) to store arbitrary data in the cache.                                         | Internal or external   | Depends on cache and service configuration.         |


**Considerations:**

* In any caching scenario, the customer should consider the possibility of loss of cache availability or connectivity. Such losses result in cache misses and by default requests continue to the backend service.

* The internal cache is volatile and doesn't persist across service updates During a service update, the internal cache is cleared in a gradual process that involves up to 50% of the cache at a time.

    > [!NOTE]
    > You can configure [service update settings](configure-service-update-settings.md) in select API Management service tiers, including a maintenance window for updates. Choose a window that minimizes potential customer impacts such as loss of the internal cache.

* If configured, an external cache can be persistent, but the customer is responsible for ensuring availability and connectivity. 

* As a best practice to protect the backend service from traffic spikes that might overload it when a cache isn't available, we recommend configuring a rate limiting policy ([rate-limit](rate-limit-policy.md) or [rate-limit-by-key](rate-limit-by-key-policy.md)) immediately after any cache lookup policy.



## Caching scenarios

### Response caching

Cache complete API responses to serve identical requests without backend calls:

```xml
<policies>
    <inbound>
        <cache-lookup-value key="@("product-" + context.Request.MatchedParameters["id"])" variable-name="product" />
        <choose>
            <when condition="@(!context.Variables.ContainsKey("product"))">
                <!-- Cache miss - call backend -->
            </when>
            <otherwise>
                <!-- Cache hit - return cached response -->
                <return-response>
                    <set-body>@((string)context.Variables["product"])</set-body>
                </return-response>
            </otherwise>
        </choose>
    </inbound>
    <outbound>
        <cache-store-value key="@("product-" + context.Request.MatchedParameters["id"])" value="@(context.Response.Body.As<string>())" duration="3600" />
    </outbound>
</policies>
```

### Value caching

Cache specific data values for reuse across multiple requests:

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

### Conditional caching

Implement smart caching based on request parameters or response content:

- **Parameter-based**: Cache responses based on query parameters, headers, or path segments
- **Content-based**: Cache only successful responses or specific content types
- **Time-based**: Use different cache durations for different types of data

### Rate limiting protection

Combine caching with rate limiting to protect backend services:

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

## Configuration

### Cache policies

API Management provides several caching policies:

| Policy | Purpose | Usage |
|--------|---------|-------|
| [cache-lookup](cache-lookup-policy.md) | Look up cached response | Place in `inbound` section to check for cached responses |
| [cache-store](cache-store-policy.md) | Store response in cache | Place in `outbound` section to cache successful responses |
| [cache-lookup-value](cache-lookup-value-policy.md) | Retrieve cached value | Use for custom caching scenarios with specific cache keys |
| [cache-store-value](cache-store-value-policy.md) | Store custom value | Cache specific data values for reuse |
| [cache-remove-value](cache-remove-value-policy.md) | Remove cached value | Invalidate specific cache entries |

### Cache configuration

Configure caching behavior through policy attributes:

- **Duration**: Specify cache expiration time in seconds
- **Cache key**: Define unique identifiers for cache entries using policy expressions
- **Caching type**: Choose between internal, external, or prefer-external cache
- **Vary by**: Cache different versions based on request parameters

### External cache setup

To configure Azure Cache for Redis:

1. **Create Redis instance**: Deploy Azure Cache for Redis in your preferred region and tier
2. **Configure connection**: Add Redis connection string to API Management
3. **Update policies**: Set `caching-type="external"` or `caching-type="prefer-external"` in cache policies
4. **Test connectivity**: Verify API Management can connect to your Redis instance

## 

## Security considerations

- **Sensitive data**: Avoid caching responses containing sensitive or personal information
- **Cache keys**: Ensure cache keys don't expose sensitive information in logs or diagnostics
- **Access control**: External cache requires proper network security and access controls
- **Encryption**: Use TLS/SSL for connections to external cache instances

## Monitoring and troubleshooting

### Cache metrics

Monitor cache performance through:

- **Cache hit ratio**: Percentage of requests served from cache vs. backend
- **Cache size**: Current cache utilization and available space
- **Response times**: Compare cached vs. noncached response latencies
- **Backend calls**: Monitor reduction in backend service calls

### Diagnostics

Use API Management diagnostics to:

- **Trace cache operations**: View cache lookup and store operations in request traces
- **Monitor cache keys**: Examine cache key generation and conflicts
- **Performance analysis**: Compare response times with and without caching
- **Error handling**: Identify cache-related errors and misconfigurations

## Related content

- Learn more about [cache policies](api-management-policies.md#caching) in API Management
- [Set up external caching](api-management-howto-cache-external.md) with Azure Cache for Redis
- [Custom caching examples](api-management-sample-cache-by-key.md) with advanced scenarios
- [Monitor API Management](monitor-api-management.md) performance and caching metrics
