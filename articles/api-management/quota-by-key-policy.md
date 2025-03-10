---
title: Azure API Management policy reference - quota-by-key | Microsoft Docs
description: Reference for the quota-by-key policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: reference
ms.date: 09/16/2024
ms.author: danlep
---
# Set usage quota by key

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../includes/api-management-availability-premium-dev-standard-basic.md)]

The `quota-by-key` policy enforces a renewable or lifetime call volume and/or bandwidth quota, on a per key basis. The key can have an arbitrary string value and is typically provided using a policy expression. Optional increment condition can be added to specify which requests should be counted towards the quota. If multiple policies would increment the same key value, it is incremented only once per request. When the quota is exceeded, the caller receives a `403 Forbidden` response status code, and the response includes a `Retry-After` header whose value is the recommended retry interval in seconds.

To understand the difference between rate limits and quotas, [see Rate limits and quotas.](./api-management-sample-flexible-throttling.md#rate-limits-and-quotas)

[!INCLUDE [api-management-quota-accuracy](../../includes/api-management-quota-accuracy.md)]

[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]


## Policy statement

```xml
<quota-by-key calls="number"
              bandwidth="kilobytes"
              renewal-period="seconds"
              increment-condition="condition"
              increment-count="number"
              counter-key="key value"
              first-period-start="date-time" />
```

## Attributes

| Attribute                | Description                                                                                               | Required                                                         | Default |
| ------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------- |
| bandwidth           | The maximum total number of kilobytes allowed during the time interval specified in the `renewal-period`. Policy expressions aren't allowed.| Either `calls`, `bandwidth`, or both together must be specified. | N/A     |
| calls               | The maximum total number of calls allowed during the time interval specified in the `renewal-period`. Policy expressions aren't allowed.    | Either `calls`, `bandwidth`, or both together must be specified. | N/A     |
| counter-key         | The key to use for the `quota policy`. For each key value, a single counter is used for all scopes at which the policy is configured. Policy expressions are allowed.             | Yes                                                              | N/A     |
| increment-condition | The Boolean expression specifying if the request should be counted towards the quota (`true`). Policy expressions are allowed.             | No                                                               | N/A     |
| increment-count | The number by which the counter is increased per request. Policy expressions are allowed. | No | 1 |
| renewal-period      | The length in seconds of the fixed window after which the quota resets. The start of each period is calculated relative to `first-period-start`. Minimum period: 300 seconds. When `renewal-period` is set to 0, the period is set to infinite. Policy expressions aren't allowed.                                                  | Yes                                                              | N/A     |
| first-period-start      | The starting date and time for quota renewal periods, in the following format: `yyyy-MM-ddTHH:mm:ssZ` as specified by the ISO 8601 standard. Policy expressions aren't allowed.   | No                                                              | `0001-01-01T00:00:00Z`     |


## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
- [**Gateways:**](api-management-gateways-overview.md) classic, self-hosted, workspace

### Usage notes

The `counter-key` attribute value must be unique across all the APIs in the API Management instance if you don't want to share the total between the other APIs.

## Example

```xml
<policies>
    <inbound>
        <base />
        <quota-by-key calls="10000" bandwidth="40000" renewal-period="3600"
                      increment-condition="@(context.Response.StatusCode >= 200 && context.Response.StatusCode < 400)"
                      counter-key="@(context.Request.IpAddress)" />
    </inbound>
    <outbound>
        <base />
    </outbound>
</policies>
```

For more information and examples of this policy, see [Advanced request throttling with Azure API Management](./api-management-sample-flexible-throttling.md).

## Related policies

* [Rate limiting and quotas](api-management-policies.md#rate-limiting-and-quotas)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
