---
title: Azure API Management policy reference - return-response | Microsoft Docs
description: Reference for the return-response policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: reference
ms.date: 11/18/2022
ms.author: danlep
---

# Return response

The `return-response` policy cancels pipeline execution and returns either a default or custom response to the caller. Default response is `200 OK` with no body. Custom response can be specified via a context variable or policy statements. When both are provided, the response contained within the context variable is modified by the policy statements before being returned to the caller.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<return-response response-variable-name="existing context variable">
  <set-header/>
  <set-body/>
  <set-status/>
</return-response>
```

## Attributes

|  Attribute              | Description                                                                                                                                                                          | Required  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| response-variable-name | The name of the context variable referenced from, for example, an upstream [send-request](send-request-policy.md) policy and containing a `Response` object | No |

## Elements

| Element         | Description                                                                               | Required |
| --------------- | ----------------------------------------------------------------------------------------- | -------- |
| set-header      | A [set-header](api-management-transformation-policies.md#SetHTTPheader) policy statement. | No       |
| set-body        | A [set-body](api-management-transformation-policies.md#SetBody) policy statement.         | No       |
| set-status      | A [set-status](set-status-policy.md) policy statement.           | No       |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, backend, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
- [**Policy expressions:**](api-management-policy-expressions.md) supported
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted
- **Multiple statements per policy document:** supported

## Examples

### Return unauthorized response

```xml
<return-response>
   <set-status code="401" reason="Unauthorized"/>
   <set-header name="WWW-Authenticate" exists-action="override">
      <value>Bearer error="invalid_token"</value>
   </set-header>
</return-response>
```


## Related policies

* [API Management advanced policies](api-management-advanced-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]