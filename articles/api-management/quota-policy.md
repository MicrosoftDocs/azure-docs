---
title: Azure API Management policy reference - quota | Microsoft Docs
description: Reference for the quota policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 09/27/2022
ms.author: danlep
---

# Set usage quota by subscription

The `quota` policy enforces a renewable or lifetime call volume and/or bandwidth quota, on a per subscription basis.  When the quota is exceeded, the caller receives a `403 Forbidden` response status code, and the response includes a `Retry-After` header whose value is the recommended retry interval in seconds.

To understand the difference between rate limits and quotas, [see Rate limits and quotas.](./api-management-sample-flexible-throttling.md#rate-limits-and-quotas)

[!INCLUDE [api-management-quota-accuracy](../../includes/api-management-quota-accuracy.md)]

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<quota calls="number" bandwidth="kilobytes" renewal-period="seconds">
    <api name="API name" id="API id" calls="number">
        <operation name="operation name" id="operation id" calls="number" />
    </api>
</quota>
```

## Attributes

| Attribute           | Description                                                                                               | Required                                                         | Default |
| -------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------- |                                            
| bandwidth      | The maximum total number of kilobytes allowed during the time interval specified in the `renewal-period`. Policy expressions aren't allowed. | Either `calls`, `bandwidth`, or both together must be specified. | N/A     |
| calls          | The maximum total number of calls allowed during the time interval specified in the `renewal-period`. Policy expressions aren't allowed.    | Either `calls`, `bandwidth`, or both together must be specified. | N/A     |
| renewal-period | The length in seconds of the fixed window after which the quota resets. The start of each period is calculated relative to the start time of the subscription. When `renewal-period` is set to `0`, the period is set to infinite. Policy expressions aren't allowed.| Yes | N/A     |

## Elements

| Element     | Description                                                                                                                                                                                                                                                                                  | Required |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| api       | Add one or more of these elements to impose call quota on APIs within the product. Product and API call quotas are applied independently. API can be referenced either via `name` or `id`. If both attributes are provided, `id` will be used and `name` will be ignored.                    | No       |
| operation | Add one or more of these elements to impose call quota on operations within an API. Product, API, and operation call quotas are applied independently. Operation can be referenced either via `name` or `id`. If both attributes are provided, `id` will be used and `name` will be ignored. | No      |


## api attributes

| Attribute           | Description                                                                                               | Required                                                         | Default |
| -------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------- |                       
| name           | The name of the API for which to apply the call quota limit.                                                | Either `name` or `id` must be specified.      | N/A     |
| id           | The ID of the API for which to apply the call quota limit.                                                | Either `name` or `id` must be specified.      | N/A     |
| bandwidth      | The maximum total number of kilobytes allowed during the time interval specified in the `renewal-period`. Policy expressions aren't allowed. | Either `calls`, `bandwidth`, or both together must be specified. | N/A     |
| calls          | The maximum total number of calls allowed during the time interval specified in the `renewal-period`. Policy expressions aren't allowed.    | Either `calls`, `bandwidth`, or both together must be specified. | N/A     |
| renewal-period | The length in seconds of the fixed window after which the quota resets. The start of each period is calculated relative to the start time of the subscription. When `renewal-period` is set to `0`, the period is set to infinite. Policy expressions aren't allowed.| Yes |  N/A     |

## operation attributes

| Attribute           | Description                                                                                               | Required                                                         | Default |
| -------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------- |                       
| name           | The name of the operation for which to apply the call quota limit.                                                | Either `name` or `id` must be specified.      | N/A     |
| id           | The ID of the operation for which to apply the call quota limit.                                                | Either `name` or `id` must be specified.      | N/A     |
| bandwidth      | The maximum total number of kilobytes allowed during the time interval specified in the `renewal-period`. Policy expressions aren't allowed. | Either `calls`, `bandwidth`, or both together must be specified. | N/A     |
| calls          | The maximum total number of calls allowed during the time interval specified in the `renewal-period`. Policy expressions aren't allowed.    | Either `calls`, `bandwidth`, or both together must be specified. | N/A     |
| renewal-period | The length in seconds of the fixed window after which the quota resets. The start of each period is calculated relative to the start time of the subscription. When `renewal-period` is set to `0`, the period is set to infinite. Policy expressions aren't allowed.| Yes |  N/A     |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) product
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

### Usage notes

* This policy can be used only once per policy definition.
* This policy is only applied when an API is accessed using a subscription key.



## Example

```xml
<policies>
    <inbound>
        <base />
        <quota calls="10000" bandwidth="40000" renewal-period="3600" />
    </inbound>
    <outbound>
        <base />
    </outbound>
</policies>
```

## Related policies

* [API Management access restriction policies](api-management-access-restriction-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]