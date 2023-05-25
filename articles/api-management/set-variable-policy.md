---
title: Azure API Management policy reference - set-variable | Microsoft Docs
description: Reference for the set-variable policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/08/2022
ms.author: danlep
---

# Set variable

The `set-variable` policy declares a [context](api-management-policy-expressions.md#ContextVariables) variable and assigns it a value specified via an [expression](api-management-policy-expressions.md) or a string literal. if the expression contains a literal it will be converted to a string and the type of the value will be `System.String`.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<set-variable name="variable name" value="Expression | String literal" />
```

## Attributes

| Attribute | Description                                                              | Required |
| --------- | ------------------------------------------------------------------------ | -------- |
| name      | The name of the variable.  Policy expressions aren't allowed.                                               | Yes      |
| value     | The value of the variable. This can be an expression or a literal value. Policy expressions are allowed.  | Yes      |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, backend, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

## Allowed types

Expressions used in the `set-variable` policy must return one of the following basic types.

-   System.Boolean
-   System.SByte
-   System.Byte
-   System.UInt16
-   System.UInt32
-   System.UInt64
-   System.Int16
-   System.Int32
-   System.Int64
-   System.Decimal
-   System.Single
-   System.Double
-   System.Guid
-   System.String
-   System.Char
-   System.DateTime
-   System.TimeSpan
-   System.Byte?
-   System.UInt16?
-   System.UInt32?
-   System.UInt64?
-   System.Int16?
-   System.Int32?
-   System.Int64?
-   System.Decimal?
-   System.Single?
-   System.Double?
-   System.Guid?
-   System.String?
-   System.Char?
-   System.DateTime?

## Example

The following example demonstrates a `set-variable` policy in the inbound section. This set variable policy creates an `isMobile` Boolean [context](api-management-policy-expressions.md#ContextVariables) variable that is set to true if the `User-Agent` request header contains the text `iPad` or `iPhone`.

```xml
<set-variable name="IsMobile" value="@(context.Request.Headers.GetValueOrDefault("User-Agent","").Contains("iPad") || context.Request.Headers.GetValueOrDefault("User-Agent","").Contains("iPhone"))" />
```

## Related policies

* [API Management advanced policies](api-management-advanced-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]