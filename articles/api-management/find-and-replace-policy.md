---
title: Azure API Management policy reference - find-and-replace | Microsoft Docs
description: Reference for the find-and-replace policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/02/2022
ms.author: danlep
---

# Find and replace string in body
The `find-and-replace` policy finds a request or response substring and replaces it with a different substring.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


## Policy statement

```xml
<find-and-replace from="what to replace" to="replacement" />
```


## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
|from|The string to search for. Policy expressions are allowed. |Yes|N/A|
|to|The replacement string. Specify a zero length replacement string to remove the search string. Policy expressions are allowed. |Yes|N/A|

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, backend, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

## Example

```xml
<find-and-replace from="notebook" to="laptop" />
```

## Related policies

* [API Management transformation policies](api-management-transformation-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]