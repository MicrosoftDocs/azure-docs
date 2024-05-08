---
title: Azure API Management policy reference - mock-response | Microsoft Docs
description: Reference for the mock-response policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 03/18/2024
ms.author: danlep
---

# Mock response

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

The `mock-response` policy, as the name implies, is used to mock APIs and operations. It cancels normal pipeline execution and returns a mocked response to the caller. The policy always tries to return responses of highest fidelity. It prefers response content examples, when available. It generates sample responses from schemas, when schemas are provided and examples aren't. If neither examples or schemas are found, responses with no content are returned.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


## Policy statement

```xml
<mock-response status-code="code" content-type="media type"/>
```

## Attributes

| Attribute    | Description                                                                                           | Required | Default |
| ------------ | ----------------------------------------------------------------------------------------------------- | -------- | ------- |
| status-code  | Specifies response status code and is used to select corresponding example or schema. Policy expressions aren't allowed.                | No       | 200     |
| content-type | Specifies `Content-Type` response header value and is used to select corresponding example or schema. Policy expressions aren't allowed. | No       | None    |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted

### Usage notes

-  [Policy expressions](api-management-policy-expressions.md) can't be used in attribute values for this policy.

## Examples

```xml
<!-- Returns 200 OK status code. Content is based on an example or schema, if provided for this status code. First found content type is used. If no example or schema is found, the content is empty. -->
<mock-response/>

<!-- Returns 200 OK status code. Content is based on an example or schema, if provided for this status code and media type. If no example or schema found, the content is empty. -->
<mock-response status-code='200' content-type='application/json'/>
```

## Related policies

* [Transformation](api-management-policies.md#transformation)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
