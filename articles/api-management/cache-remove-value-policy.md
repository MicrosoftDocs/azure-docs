---
title: Azure API Management policy reference - cache-remove-value | Microsoft Docs
description: Reference for the cache-remove-value policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: reference
ms.date: 07/23/2024
ms.author: danlep
---

# Remove value from cache

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

The `cache-remove-value` deletes a cached item identified by its key. The key can have an arbitrary string value and is typically provided using a policy expression.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<cache-remove-value key="cache key value" caching-type="prefer-external | external | internal"  />
```


## Attributes

| Attribute         | Description                                            | Required | Default |
|---|--|--|--|
| caching-type | Choose between the following values of the attribute:<br />- `internal` to use the [built-in API Management cache](api-management-howto-cache.md),<br />- `external` to use the external cache as described in [Use an external Azure Cache for Redis in Azure API Management](api-management-howto-cache-external.md),<br />- `prefer-external` to use external cache if configured or internal cache otherwise. <br/><br/>Policy expressions aren't allowed.    | No       | `prefer-external` |
| key              | The key of the previously cached value to be removed from the cache. Policy expressions are allowed.                                                                                                                                                                                                                                                                                      | Yes      | N/A               |
## Usage


- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, backend, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted, workspace

## Example

```xml
<cache-store-value
    key="@("userprofile-" + context.Variables["enduserid"])"
    value="@((string)context.Variables["userprofile"])" duration="100000" />
```

For more information and examples of this policy, see [Custom caching in Azure API Management](./api-management-sample-cache-by-key.md).

## Related policies

* [Caching](api-management-policies.md#caching)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]