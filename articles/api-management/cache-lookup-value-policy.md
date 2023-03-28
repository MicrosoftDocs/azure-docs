---
title: Azure API Management policy reference - cache-lookup-value | Microsoft Docs
description: Reference for the cache-lookup-value policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/07/2022
ms.author: danlep
---

# Get value from cache
Use the `cache-lookup-value` policy to perform cache lookup by key and return a cached value. The key can have an arbitrary string value and is typically provided using a policy expression.

> [!NOTE]
> This policy must have a corresponding [Store value in cache](cache-store-value-policy.md) policy.

[!INCLUDE [api-management-cache-volatile](../../includes/api-management-cache-volatile.md)]

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<cache-lookup-value key="cache key value"
    default-value="value to use if cache lookup resulted in a miss"
    variable-name="name of a variable looked up value is assigned to"
    caching-type="prefer-external | external | internal" />
```


## Attributes

| Attribute         | Description                                            | Required | Default |
|---|--|--|--|
| caching-type | Choose between the following values of the attribute:<br />- `internal` to use the [built-in API Management cache](api-management-howto-cache.md),<br />- `external` to use the external cache as described in [Use an external Azure Cache for Redis in Azure API Management](api-management-howto-cache-external.md),<br />- `prefer-external` to use external cache if configured or internal cache otherwise.<br/><br/>Policy expressions aren't allowed. | No       | `prefer-external` |
| default-value    | A value that will be assigned to the variable if the cache key lookup resulted in a miss. If this attribute is not specified, `null` is assigned. Policy expressions are allowed.                                                                                                                                                                                                          | No       | `null`            |
| key              | Cache key value to use in the lookup. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                      | Yes      | N/A               |
| variable-name    | Name of the [context variable](api-management-policy-expressions.md#ContextVariables) the looked up value will be assigned to, if lookup is successful. If lookup results in a miss, the variable will not be set. Policy expressions aren't allowed.                                      | Yes      | N/A               |


## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, backend, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

## Example

```xml
<cache-lookup-value
    key="@("userprofile-" + context.Variables["enduserid"])"
    variable-name="userprofile" />
```

For more information and examples of this policy, see [Custom caching in Azure API Management](./api-management-sample-cache-by-key.md).



## Related policies

* [API Management caching policies](api-management-caching-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]