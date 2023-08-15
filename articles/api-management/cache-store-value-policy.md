---
title: Azure API Management policy reference - cache-store-value | Microsoft Docs
description: Reference for the cache-store-value policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/07/2022
ms.author: danlep
---

# Store value in cache
The `cache-store-value` performs cache storage by key. The key can have an arbitrary string value and is typically provided using a policy expression.

> [!NOTE]
> The operation of storing the value in cache performed by this policy is asynchronous. The stored value can be retrieved using [Get value from cache](cache-lookup-value-policy.md) policy. However, the stored value may not be immediately available for retrieval since the asynchronous operation that stores the value in cache may still be in progress.

[!INCLUDE [api-management-cache-volatile](../../includes/api-management-cache-volatile.md)]

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)] 

## Policy statement

```xml
<cache-store-value key="cache key value" value="value to cache" duration="seconds" caching-type="prefer-external | external | internal" />
```


## Attributes

| Attribute         | Description                                            | Required | Default |
|---|--|--|--|
| caching-type | Choose between the following values of the attribute:<br />- `internal` to use the [built-in API Management cache](api-management-howto-cache.md),<br />- `external` to use the external cache as described in [Use an external Azure Cache for Redis in Azure API Management](api-management-howto-cache-external.md),<br />- `prefer-external` to use external cache if configured or internal cache otherwise.<br/><br/>Policy expressions aren't allowed.| No       | `prefer-external` |
| duration         | Value will be cached for the provided duration value, specified in seconds. Policy expressions are allowed.                                                                                                                                                                                                                                                                                 | Yes      | N/A               |
| key              | Cache key the value will be stored under. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                  | Yes      | N/A               |
| value            | The value to be cached. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                                    | Yes      | N/A               |

## Usage


- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, backend, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

## Example

```xml
<cache-store-value
    key="@("userprofile-" + context.Variables["enduserid"])"
    value="@((string)context.Variables["userprofile"])" duration="100000" />
```

For more information and examples of this policy, see [Custom caching in Azure API Management](./api-management-sample-cache-by-key.md).

## Related policies

* [API Management caching policies](api-management-caching-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]