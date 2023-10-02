---
title: Azure API Management policy reference - return-response | Microsoft Docs
description: Reference for the return-response policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/08/2022
ms.author: danlep
---

# Return response

The `return-response` policy cancels pipeline execution and returns either a default or custom response to the caller. Default response is `200 OK` with no body. Custom response can be specified via a context variable or policy statements. When both are provided, the response contained within the context variable is modified by the policy statements before being returned to the caller.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<return-response response-variable-name="existing context variable">
  <set-status>...</set-status>
  <set-header>...</set-header>
  <set-body>...</set-body>
</return-response>
```

## Attributes

|  Attribute              | Description                                                                                                                                                                          | Required  | Default |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---- |
| response-variable-name | The name of the context variable referenced from, for example, an upstream [send-request](send-request-policy.md) policy and containing a `Response` object. Policy expressions aren't allowed. | No | N/A |

## Elements

| Element         | Description                                                                               | Required |
| --------------- | ----------------------------------------------------------------------------------------- | -------- |
| [set-status](set-status-policy.md)      | Sets the status code of the response.           | No       |
| [set-header](set-header-policy.md)      | Sets a header in the response. | No       |
| [set-body](set-body-policy.md)        | Sets the body in the response.         | No       |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, backend, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

### Usage notes

- A liquid template doesn't work when specified inside the body (set using `set-body`) of the `return-response` policy. The `return-response` policy cancels the current execution pipeline and removes the request body and response body in the current context. As a result, a liquid template specified inside the policy receives an empty string as its input and won't produce the expected output.  

## Example

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
