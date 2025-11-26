---
title: Azure API Management policy reference - cache-store | Microsoft Docs
description: Reference for the cache-store policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: reference
ms.date: 11/24/2025
ms.author: danlep
---

# Store to cache

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

The `cache-store` policy caches responses according to the specified cache settings. This policy can be applied in cases where response content remains static over a period of time. Response caching reduces bandwidth and processing requirements imposed on the backend web server and lowers latency perceived by API consumers.

> [!NOTE]
> This policy must have a corresponding [Get from cache](cache-lookup-policy.md) policy.

[!INCLUDE [api-management-cache-volatile](../../includes/api-management-cache-volatile.md)]


[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]

## Policy statement

```xml
<cache-store duration="seconds" cache-response="true | false" />
```


## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
| duration         | Time-to-live of the cached entries, specified in seconds. Policy expressions are allowed.    | Yes      | N/A               |
| cache-response         | Set to `true` to cache the current HTTP response. If the attribute is omitted, only HTTP responses with the status code `200 OK` are cached. Policy expressions are allowed.                          | No      | `false`               |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#understanding-policy-configuration) outbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted, workspace

### Usage notes

- API Management only caches responses to HTTP GET requests.
- This policy can only be used once in a policy section.
- [!INCLUDE [api-management-cache-rate-limit](../../includes/api-management-cache-rate-limit.md)]


## Examples

### Example with corresponding cache-lookup policy

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
