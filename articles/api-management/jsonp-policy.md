---
title: Azure API Management policy reference - jsonp | Microsoft Docs
description: Reference for the jsonp policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: reference
ms.date: 07/23/2024
ms.author: danlep
---

# JSONP

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

The `jsonp` policy adds JSON with padding (JSONP) support to an operation or an API to allow cross-domain calls from JavaScript browser-based clients. JSONP is a method used in JavaScript programs to request data from a server in a different domain. JSONP bypasses the limitation enforced by most web browsers where access to web pages must be in the same domain.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<jsonp callback-parameter-name="callback function name" />
```

## Attributes

|Name|Description|Required|Default|
|----------|-----------------|--------------|-------------|
|callback-parameter-name|The cross-domain JavaScript function call prefixed with the fully qualified domain name where the function resides. Policy expressions are allowed.|Yes|N/A|

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) outbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted, workspace

### Usage notes

- This policy can only be used once in a policy section.

## Example

```xml
<jsonp callback-parameter-name="cb" />
```

If you call the method without the callback parameter `?cb=XXX`, it will return plain JSON (without a function call wrapper).

If you add the callback parameter `?cb=XXX`, it will return a JSONP result, wrapping the original JSON results around the callback function like `XYZ('<json result goes here>');`

## Related policies

* [Cross-domain](api-management-policies.md#cross-domain)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]