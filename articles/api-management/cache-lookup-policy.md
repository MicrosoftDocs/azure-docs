---
title: Azure API Management policy reference - cache-lookup | Microsoft Docs
description: Reference for the cache-lookup policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: reference
ms.date: 11/24/2025
ms.author: danlep
ms.custom:
  - build-2025
---

# Get from cache

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

Use the `cache-lookup` policy to perform cache lookup and return a valid cached response when available. This policy can be applied in cases where response content remains static over a period of time. Response caching reduces bandwidth and processing requirements imposed on the backend web server and lowers latency perceived by API consumers.

> [!NOTE]
> This policy must have a corresponding [Store to cache](cache-store-policy.md) policy.

[!INCLUDE [api-management-cache-volatile](../../includes/api-management-cache-volatile.md)]

[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]

## Policy statement

```xml
<cache-lookup vary-by-developer="true | false" vary-by-developer-groups="true | false" caching-type="prefer-external | external | internal" downstream-caching-type="none | private | public" must-revalidate="true | false" allow-private-response-caching="@(expression to evaluate)">
  <vary-by-header>Accept</vary-by-header>
  <!-- should be present in most cases -->
  <vary-by-header>Accept-Charset</vary-by-header>
  <!-- should be present in most cases -->
  <vary-by-header>Authorization</vary-by-header>
  <!-- should be present when allow-private-response-caching is "true"-->
  <vary-by-header>header name</vary-by-header>
  <!-- optional, can be repeated -->
  <vary-by-query-parameter>parameter name</vary-by-query-parameter>
  <!-- optional, can be repeated -->
</cache-lookup>
```

## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
| allow-private-response-caching | When set to `true`, allows caching of requests that contain an Authorization header. Policy expressions are allowed.                                                                                                                                                                                                                                                                       | No       | `false`             |
| caching-type               | Choose between the following values of the attribute:<br />- `internal` to use the [built-in API Management cache](api-management-howto-cache.md),<br />- `external` to use the external cache as described in [Use an external Azure Cache for Redis in Azure API Management](api-management-howto-cache-external.md),<br />- `prefer-external` to use external cache if configured or internal cache otherwise.<br/><br/>Policy expressions aren't allowed. | No       | `prefer-external` |
| downstream-caching-type        | This attribute must be set to one of the following values.<br /><br /> -   none - downstream caching is not allowed.<br />-   private - downstream private caching is allowed.<br />-   public - private and shared downstream caching is allowed.<br/><br/>Policy expressions are allowed.                                                                                                          | No       | none              |
| must-revalidate                | When downstream caching is enabled this attribute turns on or off  the `must-revalidate` cache control directive in gateway responses. Policy expressions are allowed.                                                                                                                                                                                                                      | No       | `true`              |
| vary-by-developer              | Set to `true` to cache responses per developer account that owns [subscription key](./api-management-subscriptions.md) included in the request. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                 | Yes      |         `false`          |
| vary-by-developer-groups       | Set to `true` to cache responses per [user group](./api-management-howto-create-groups.md). Policy expressions are allowed.                                                                                                                                                                                                                                                                                                            | Yes      |       `false`            |

## Elements

|Name|Description|Required|
|----------|-----------------|--------------|
|vary-by-header|Add one or more of these elements to start caching responses per value of specified header, such as `Accept`, `Accept-Charset`, `Accept-Encoding`, `Accept-Language`, `Authorization`, `Expect`, `From`, `Host`, `If-Match`.|No|
|vary-by-query-parameter|Add one or more of these elements to start caching responses per value of specified query parameters. Enter a single or multiple parameters. Use semicolon as a separator. |No|

## Usage


- [**Policy sections:**](./api-management-howto-policies.md#understanding-policy-configuration) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted, workspace

### Usage notes

- API Management only performs cache lookup for HTTP GET requests.
* When using `vary-by-query-parameter`, you might want to declare the parameters in the rewrite-uri template or set the attribute `copy-unmatched-params` to `false`. By deactivating this flag, parameters that aren't declared are sent to the backend.
- This policy can only be used once in a policy section.
- This policy is not supported inside a policy fragment.
- [!INCLUDE [api-management-cache-rate-limit](../../includes/api-management-cache-rate-limit.md)]


## Examples

### Example with corresponding cache-store policy

This example shows how to use the `cache-store` policy along with a `cache-lookup` policy to cache responses in the built-in API Management cache. 

> [!NOTE]
> [!INCLUDE [api-management-cache-availability](../../includes/api-management-cache-availability.md)]

```xml
<policies>
    <inbound>
        <base />
        <cache-lookup vary-by-developer="false" vary-by-developer-groups="false" downstream-caching-type="none" must-revalidate="true" caching-type="internal" >
            <vary-by-query-parameter>version</vary-by-query-parameter>
        </cache-lookup>
        <rate-limit calls="10" renewal-period="60" />
    </inbound>
    <outbound>
        <cache-store duration="seconds" />
        <base />
    </outbound>
</policies>
```

[!INCLUDE [api-management-cache-example-policy-expressions](../../includes/api-management-cache-example-policy-expressions.md)]



## Related policies

* [Caching](api-management-policies.md#caching)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
