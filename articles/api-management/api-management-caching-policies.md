---
title: Azure API Management caching policies | Microsoft Docs
description: Learn about the caching policies available for use in Azure API Management.
services: api-management
documentationcenter: ''
author: vladvino
manager: erikre
editor: ''

ms.assetid: 8147199c-24d8-439f-b2a9-da28a70a890c
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/27/2018
ms.author: apimpm
---
# API Management caching policies
This topic provides a reference for the following API Management policies. For information on adding and configuring policies, see [Policies in API Management](https://go.microsoft.com/fwlink/?LinkID=398186).

## <a name="CachingPolicies"></a> Caching policies

- Response caching policies
    - [Get from cache](api-management-caching-policies.md#GetFromCache) - Perform cache look up and return a valid cached responses when available.
    - [Store to cache](api-management-caching-policies.md#StoreToCache) - Caches responses according to the specified cache control configuration.
- Value caching policies
    - [Get value from cache](#GetFromCacheByKey) - Retrieve a cached item by key.
    - [Store value in cache](#StoreToCacheByKey) - Store an item in the cache by key.
    - [Remove value from cache](#RemoveCacheByKey) - Remove an item in the cache by key.

## <a name="GetFromCache"></a> Get from cache
Use the `cache-lookup` policy to perform cache look up and return a valid cached response when available. This policy can be applied in cases where response content remains static over a period of time. Response caching reduces bandwidth and processing requirements imposed on the backend web server and lowers latency perceived by API consumers.

> [!NOTE]
> This policy must have a corresponding [Store to cache](api-management-caching-policies.md#StoreToCache) policy.

### Policy statement

```xml
<cache-lookup vary-by-developer="true | false" vary-by-developer-groups="true | false" caching-type="prefer-external | external | internal" downstream-caching-type="none | private | public" must-revalidate="true | false" allow-private-response-caching="@(expression to evaluate)">
  <vary-by-header>Accept</vary-by-header>
  <!-- should be present in most cases -->
  <vary-by-header>Accept-Charset</vary-by-header>
  <!-- should be present in most cases -->
  <vary-by-header>Authorization</vary-by-header>
  <!-- should be present when allow-private-response-caching is "true"-->
  <vary-by-header>header name</vary-by-header>
  <!-- optional, can repeated several times -->
  <vary-by-query-parameter>parameter name</vary-by-query-parameter>
  <!-- optional, can repeated several times -->
</cache-lookup>
```

### Examples

#### Example

```xml
<policies>
    <inbound>
        <base />
        <cache-lookup vary-by-developer="false" vary-by-developer-groups="false" downstream-caching-type="none" must-revalidate="true" caching-type="internal" >
            <vary-by-query-parameter>version</vary-by-query-parameter>
        </cache-lookup>
    </inbound>
    <outbound>
        <cache-store duration="seconds" />
        <base />
    </outbound>
</policies>
```

#### Example using policy expressions
This example shows how to configure API Management response caching duration that matches the response caching of the backend service as specified by the backed service's `Cache-Control` directive. For a demonstration of configuring and using this policy, see [Cloud Cover Episode 177: More API Management Features with Vlad Vinogradsky](https://azure.microsoft.com/documentation/videos/episode-177-more-api-management-features-with-vlad-vinogradsky/) and fast-forward to 25:25.

```xml
<!-- The following cache policy snippets demonstrate how to control API Management response cache duration with Cache-Control headers sent by the backend service. -->

<!-- Copy this snippet into the inbound section -->
<cache-lookup vary-by-developer="false" vary-by-developer-groups="false" downstream-caching-type="public" must-revalidate="true" >
  <vary-by-header>Accept</vary-by-header>
  <vary-by-header>Accept-Charset</vary-by-header>
</cache-lookup>

<!-- Copy this snippet into the outbound section. Note that cache duration is set to the max-age value provided in the Cache-Control header received from the backend service or to the default value of 5 min if none is found  -->
<cache-store duration="@{
    var header = context.Response.Headers.GetValueOrDefault("Cache-Control","");
    var maxAge = Regex.Match(header, @"max-age=(?<maxAge>\d+)").Groups["maxAge"]?.Value;
    return (!string.IsNullOrEmpty(maxAge))?int.Parse(maxAge):300;
  }"
 />
```

For more information, see [Policy expressions](api-management-policy-expressions.md) and [Context variable](api-management-policy-expressions.md#ContextVariables).

### Elements

|Name|Description|Required|
|----------|-----------------|--------------|
|cache-lookup|Root element.|Yes|
|vary-by-header|Start caching responses per value of specified header, such as Accept, Accept-Charset, Accept-Encoding, Accept-Language, Authorization, Expect, From, Host, If-Match.|No|
|vary-by-query-parameter|Start caching responses per value of specified query parameters. Enter a single or multiple parameters. Use semicolon as a separator. If none are specified, all query parameters are used.|No|

### Attributes

| Name                           | Description                                                                                                                                                                                                                                                                                                                                                 | Required | Default           |
|--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|-------------------|
| allow-private-response-caching | When set to `true`, allows caching of requests that contain an Authorization header.                                                                                                                                                                                                                                                                        | No       | false             |
| caching-type               | Choose between the following values of the attribute:<br />- `internal` to use the built-in API Management cache,<br />- `external` to use the external cache as described in [Use an external Azure Cache for Redis in Azure API Management](api-management-howto-cache-external.md),<br />- `prefer-external` to use external cache if configured or internal cache otherwise. | No       | `prefer-external` |
| downstream-caching-type        | This attribute must be set to one of the following values.<br /><br /> -   none - downstream caching is not allowed.<br />-   private - downstream private caching is allowed.<br />-   public - private and shared downstream caching is allowed.                                                                                                          | No       | none              |
| must-revalidate                | When downstream caching is enabled this attribute turns on or off  the `must-revalidate` cache control directive in gateway responses.                                                                                                                                                                                                                      | No       | true              |
| vary-by-developer              | Set to `true` to cache responses per [subscription key](https://docs.microsoft.com/azure/api-management/api-management-subscriptions).                                                                                                                                                                                                                                                                                                         | Yes      |         False          |
| vary-by-developer-groups       | Set to `true` to cache responses per [user group](https://docs.microsoft.com/azure/api-management/api-management-howto-create-groups).                                                                                                                                                                                                                                                                                                             | Yes      |       False            |

### Usage
This policy can be used in the following policy [sections](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#sections) and [scopes](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#scopes).

- **Policy sections:** inbound
- **Policy scopes:** API, operation, product

## <a name="StoreToCache"></a> Store to cache
The `cache-store` policy caches responses according to the specified cache settings. This policy can be applied in cases where response content remains static over a period of time. Response caching reduces bandwidth and processing requirements imposed on the backend web server and lowers latency perceived by API consumers.

> [!NOTE]
> This policy must have a corresponding [Get from cache](api-management-caching-policies.md#GetFromCache) policy.

### Policy statement

```xml
<cache-store duration="seconds" />
```

### Examples

#### Example

```xml
<policies>
    <inbound>
        <base />
        <cache-lookup vary-by-developer="true | false" vary-by-developer-groups="true | false" downstream-caching-type="none | private | public" must-revalidate="true | false">
            <vary-by-query-parameter>parameter name</vary-by-query-parameter> <!-- optional, can repeated several times -->
        </cache-lookup>
    </inbound>
    <outbound>
        <base />
        <cache-store duration="3600" />
    </outbound>
</policies>
```

#### Example using policy expressions
This example shows how to configure API Management response caching duration that matches the response caching of the backend service as specified by the backed service's `Cache-Control` directive. For a demonstration of configuring and using this policy, see [Cloud Cover Episode 177: More API Management Features with Vlad Vinogradsky](https://azure.microsoft.com/documentation/videos/episode-177-more-api-management-features-with-vlad-vinogradsky/) and fast-forward to 25:25.

```xml
<!-- The following cache policy snippets demonstrate how to control API Management response cache duration with Cache-Control headers sent by the backend service. -->

<!-- Copy this snippet into the inbound section -->
<cache-lookup vary-by-developer="false" vary-by-developer-groups="false" downstream-caching-type="public" must-revalidate="true" >
  <vary-by-header>Accept</vary-by-header>
  <vary-by-header>Accept-Charset</vary-by-header>
</cache-lookup>

<!-- Copy this snippet into the outbound section. Note that cache duration is set to the max-age value provided in the Cache-Control header received from the backend service or to the default value of 5 min if none is found  -->
<cache-store duration="@{
    var header = context.Response.Headers.GetValueOrDefault("Cache-Control","");
    var maxAge = Regex.Match(header, @"max-age=(?<maxAge>\d+)").Groups["maxAge"]?.Value;
    return (!string.IsNullOrEmpty(maxAge))?int.Parse(maxAge):300;
  }"
 />
```

For more information, see [Policy expressions](api-management-policy-expressions.md) and [Context variable](api-management-policy-expressions.md#ContextVariables).

### Elements

|Name|Description|Required|
|----------|-----------------|--------------|
|cache-store|Root element.|Yes|

### Attributes

| Name             | Description                                                                                                                                                                                                                                                                                                                                                 | Required | Default           |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|-------------------|
| duration         | Time-to-live of the cached entries, specified in seconds.                                                                                                                                                                                                                                                                                                   | Yes      | N/A               |

### Usage
This policy can be used in the following policy [sections](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#sections) and [scopes](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#scopes).

- **Policy sections:** outbound
- **Policy scopes:** API, operation, product

## <a name="GetFromCacheByKey"></a> Get value from cache
Use the `cache-lookup-value` policy to perform cache lookup by key and return a cached value. The key can have an arbitrary string value and is typically provided using a policy expression.

> [!NOTE]
> This policy must have a corresponding [Store value in cache](#StoreToCacheByKey) policy.

### Policy statement

```xml
<cache-lookup-value key="cache key value"
    default-value="value to use if cache lookup resulted in a miss"
    variable-name="name of a variable looked up value is assigned to"
    caching-type="prefer-external | external | internal" />
```

### Example
For more information and examples of this policy, see [Custom caching in Azure API Management](https://azure.microsoft.com/documentation/articles/api-management-sample-cache-by-key/).

```xml
<cache-lookup-value
    key="@("userprofile-" + context.Variables["enduserid"])"
    variable-name="userprofile" />

```

### Elements

|Name|Description|Required|
|----------|-----------------|--------------|
|cache-lookup-value|Root element.|Yes|

### Attributes

| Name             | Description                                                                                                                                                                                                                                                                                                                                                 | Required | Default           |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|-------------------|
| caching-type | Choose between the following values of the attribute:<br />- `internal` to use the built-in API Management cache,<br />- `external` to use the external cache as described in [Use an external Azure Cache for Redis in Azure API Management](api-management-howto-cache-external.md),<br />- `prefer-external` to use external cache if configured or internal cache otherwise. | No       | `prefer-external` |
| default-value    | A value that will be assigned to the variable if the cache key lookup resulted in a miss. If this attribute is not specified, `null` is assigned.                                                                                                                                                                                                           | No       | `null`            |
| key              | Cache key value to use in the lookup.                                                                                                                                                                                                                                                                                                                       | Yes      | N/A               |
| variable-name    | Name of the [context variable](api-management-policy-expressions.md#ContextVariables) the looked up value will be assigned to, if lookup is successful. If lookup results in a miss, the variable will be assigned the value of the `default-value` attribute or `null`, if the `default-value` attribute is omitted.                                       | Yes      | N/A               |

### Usage
This policy can be used in the following policy [sections](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#sections) and [scopes](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#scopes).

- **Policy sections:** inbound, outbound, backend, on-error
- **Policy scopes:** global, API, operation, product

## <a name="StoreToCacheByKey"></a> Store value in cache
The `cache-store-value` performs cache storage by key. The key can have an arbitrary string value and is typically provided using a policy expression.

> [!NOTE]
> This policy must have a corresponding [Get value from cache](#GetFromCacheByKey) policy.

### Policy statement

```xml
<cache-store-value key="cache key value" value="value to cache" duration="seconds" caching-type="prefer-external | external | internal" />
```

### Example
For more information and examples of this policy, see [Custom caching in Azure API Management](https://azure.microsoft.com/documentation/articles/api-management-sample-cache-by-key/).

```xml
<cache-store-value
    key="@("userprofile-" + context.Variables["enduserid"])"
    value="@((string)context.Variables["userprofile"])" duration="100000" />

```

### Elements

|Name|Description|Required|
|----------|-----------------|--------------|
|cache-store-value|Root element.|Yes|

### Attributes

| Name             | Description                                                                                                                                                                                                                                                                                                                                                 | Required | Default           |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|-------------------|
| caching-type | Choose between the following values of the attribute:<br />- `internal` to use the built-in API Management cache,<br />- `external` to use the external cache as described in [Use an external Azure Cache for Redis in Azure API Management](api-management-howto-cache-external.md),<br />- `prefer-external` to use external cache if configured or internal cache otherwise. | No       | `prefer-external` |
| duration         | Value will be cached for the provided duration value, specified in seconds.                                                                                                                                                                                                                                                                                 | Yes      | N/A               |
| key              | Cache key the value will be stored under.                                                                                                                                                                                                                                                                                                                   | Yes      | N/A               |
| value            | The value to be cached.                                                                                                                                                                                                                                                                                                                                     | Yes      | N/A               |
### Usage
This policy can be used in the following policy [sections](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#sections) and [scopes](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#scopes).

- **Policy sections:** inbound, outbound, backend, on-error
- **Policy scopes:** global, API, operation, product

### <a name="RemoveCacheByKey"></a> Remove value from cache
The `cache-remove-value` deletes a cached item identified by its key. The key can have an arbitrary string value and is typically provided using a policy expression.

#### Policy statement

```xml

<cache-remove-value key="cache key value" caching-type="prefer-external | external | internal"  />

```

#### Example

```xml

<cache-remove-value key="@("userprofile-" + context.Variables["enduserid"])"/>

```

#### Elements

|Name|Description|Required|
|----------|-----------------|--------------|
|cache-remove-value|Root element.|Yes|

#### Attributes

| Name             | Description                                                                                                                                                                                                                                                                                                                                                 | Required | Default           |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|-------------------|
| caching-type | Choose between the following values of the attribute:<br />- `internal` to use the built-in API Management cache,<br />- `external` to use the external cache as described in [Use an external Azure Cache for Redis in Azure API Management](api-management-howto-cache-external.md),<br />- `prefer-external` to use external cache if configured or internal cache otherwise. | No       | `prefer-external` |
| key              | The key of the previously cached value to be removed from the cache.                                                                                                                                                                                                                                                                                        | Yes      | N/A               |

#### Usage
This policy can be used in the following policy [sections](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#sections) and [scopes](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#scopes) .

- **Policy sections:** inbound, outbound, backend, on-error
- **Policy scopes:** global, API, operation, product

## Next steps

For more information working with policies, see:

+ [Policies in API Management](api-management-howto-policies.md)
+ [Transform APIs](transform-api.md)
+ [Policy Reference](api-management-policy-reference.md) for a full list of policy statements and their settings
+ [Policy samples](policy-samples.md)
