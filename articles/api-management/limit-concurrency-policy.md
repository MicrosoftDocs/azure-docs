---
title: Azure API Management policy reference - limit-concurrency | Microsoft Docs
description: Reference for the limit-concurrency policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: reference
ms.date: 07/23/2024
ms.author: danlep
---

# Limit concurrency

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

The `limit-concurrency` policy prevents enclosed policies from executing by more than the specified number of requests at any time. When that number is exceeded, new requests will fail immediately with the `429` Too Many Requests status code.

[!INCLUDE [api-management-rate-limit-accuracy](../../includes/api-management-rate-limit-accuracy.md)]

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<limit-concurrency key="expression" max-count="number">
        <!— nested policy statements -->
</limit-concurrency>
```

## Attributes

| Attribute | Description                                                                                        | Required | Default |
| --------- | -------------------------------------------------------------------------------------------------- | -------- | ------- |
| key       | A string. Specifies the concurrency scope. Can be shared by multiple policies. Policy expressions are allowed. | Yes      | N/A     |
| max-count | An integer. Specifies a maximum number of requests that are allowed to enter the policy. Policy expressions aren't allowed.           | Yes      | N/A     |


## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, backend, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted, workspace

### Usage notes

* The maximum number of requests enforced by API Management is lower when multiple capacity units are deployed in a region.

## Example

The following example demonstrates how to limit number of requests forwarded to a backend based on the value of a context variable.

```xml
<policies>
  <inbound>…</inbound>
  <backend>
    <limit-concurrency key="@((string)context.Variables["connectionId"])" max-count="3">
      <forward-request timeout="120"/>
    </limit-concurrency>
  </backend>
  <outbound>…</outbound>
</policies>
```

## Related policies

* [Rate limiting and quotas](api-management-policies.md#rate-limiting-and-quotas)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]