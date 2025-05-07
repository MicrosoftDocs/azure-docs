---
title: Azure API Management policy reference - set-status | Microsoft Docs
description: Reference for the set-status policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: reference
ms.date: 07/23/2024
ms.author: danlep
---

# Set status code

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]


The `set-status` policy sets the HTTP status code to the specified value.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


## Policy statement

```xml
<set-status code="HTTP status code" reason="description"/>
```


## Attributes

| Attribute       | Description                                                | Required | Default |
| --------------- | ---------------------------------------------------------- | -------- | ------- |
| code  | Integer. The HTTP status code to return. Policy expressions are allowed.                            | Yes      | N/A     |
| reason | String. A description of the reason for returning the status code. Policy expressions are allowed. | Yes      | N/A     |


## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, backend, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted, workspace

## Example

This example shows how to return a 401 response if the authorization token is invalid. For more information, see [Using external services from the Azure API Management service](./api-management-sample-send-request.md).

```xml
<choose>
  <when condition="@((bool)((IResponse)context.Variables["tokenstate"]).Body.As<JObject>()["active"] == false)">
    <return-response response-variable-name="existing response variable">
      <set-status code="401" reason="Unauthorized" />
      <set-header name="WWW-Authenticate" exists-action="override">
        <value>Bearer error="invalid_token"</value>
      </set-header>
    </return-response>
  </when>
</choose>
```


## Related policies

* [Transformation](api-management-policies.md#transformation)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]