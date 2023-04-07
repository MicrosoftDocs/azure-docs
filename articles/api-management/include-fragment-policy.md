---
title: Azure API Management policy reference - include-fragment | Microsoft Docs
description: Reference for the include-fragment policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/08/2022
ms.author: danlep
---

# Include fragment

The `include-fragment` policy inserts the contents of a previously created [policy fragment](policy-fragments.md) in the policy definition. A policy fragment is a centrally managed, reusable XML policy snippet that can be included in policy definitions in your API Management instance.

The policy inserts the policy fragment as-is at the location you select in the policy definition.  

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<include-fragment fragment-id="fragment" />
```

## Attributes

| Attribute | Description                                                                                        | Required | Default |
| --------- | -------------------------------------------------------------------------------------------------- | -------- | ------- |
| fragment-id       | A string. Specifies the identifier (name) of a policy fragment created in the API Management instance. Policy expressions aren't allowed. | Yes      | N/A     |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, backend, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

## Example

In the following example, the policy fragment named *myFragment* is added in the inbound section of a policy definition.

```xml
<inbound>
    <include-fragment fragment-id="myFragment" />
    <base />
</inbound>
[...]
```

## Related policies

* [API Management advanced policies](api-management-advanced-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
