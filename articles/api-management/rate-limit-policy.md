---
title: Azure API Management policy reference - rate-limit | Microsoft Docs
description: Reference for the rate-limit policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: reference
ms.date: 09/27/2022
ms.author: danlep
---

# Limit call rate by subscription

The `rate-limit` policy prevents API usage spikes on a per subscription basis by limiting the call rate to a specified number per a specified time period. When the call rate is exceeded, the caller receives a `429 Too Many Requests` response status code.

To understand the difference between rate limits and quotas, [see Rate limits and quotas.](./api-management-sample-flexible-throttling.md#rate-limits-and-quotas)


[!INCLUDE [api-management-rate-limit-accuracy](../../includes/api-management-rate-limit-accuracy.md)]

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

[TODO: Confirm placement and order of policy attributes and elements]

```xml
<rate-limit calls="number" renewal-period="seconds"  retry-after-header-name="custom header name, replaces default 'Retry-After'" 
        retry-after-variable-name="policy expression variable name"
        remaining-calls-header-name="header name"  
        remaining-calls-variable-name="policy expression variable name"
        total-calls-header-name="header name">
    <api name="API name" id="API id" calls="number" renewal-period="seconds" />
        <operation name="operation name" id="operation id" calls="number" renewal-period="seconds" />
    </api>
</rate-limit>
```
## Attributes

| Name           | Description                                                                                           | Required | Default |
| -------------- | ----------------------------------------------------------------------------------------------------- | -------- | ------- |
| calls          | The maximum total number of calls allowed during the time interval specified in `renewal-period`. | Yes      | N/A     |
| renewal-period | The length in seconds of the sliding window during which the number of allowed requests should not exceed the value specified in `calls`. Maximum allowed value: 300 seconds.                                            | Yes      | N/A     |
| total-calls-header-name    | The name of a response header whose value is the value specified in `calls`. |  No | N/A  |
| retry-after-header-name    | The name of a custom response header whose value is the recommended retry interval in seconds after the specified call rate is exceeded. |  No | `Retry-After`  |
| retry-after-variable-name    | The name of a policy expression variable that stores the recommended retry interval in seconds after the specified call rate is exceeded. |  No | N/A  |
| remaining-calls-header-name    | The name of a response header whose value after each policy execution is the number of remaining calls allowed for the time interval specified in the `renewal-period`. |  No | N/A  |
| remaining-calls-variable-name    | The name of a policy expression variable that after each policy execution stores the number of remaining calls allowed for the time interval specified in the `renewal-period`. |  No | N/A  |
| total-calls-header-name    | The name of a response header whose value is the value specified in `calls`. |  No | N/A  |


### Elements

| Name       | Description                                                                                                                                                                                                                                                                                              | Required |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| api        | Add one or more of these elements to impose a call rate limit on APIs within the product. Product and API call rate limits are applied independently. API can be referenced either via `name` or `id`. If both attributes are provided, `id` will be used and `name` will be ignored.                    | No       |
| operation  | Add one or more of these elements to impose a call rate limit on operations within an API. Product, API, and operation call rate limits are applied independently. Operation can be referenced either via `name` or `id`. If both attributes are provided, `id` will be used and `name` will be ignored. | No       |


### api attributes

| Name           | Description                                                                                           | Required | Default |
| -------------- | ----------------------------------------------------------------------------------------------------- | -------- | ------- |
| name           | The name of the API for which to apply the rate limit.                                                | Either `name` or `id` must be specified.      | N/A     |
| id           | The id of the API for which to apply the rate limit.                                                | Either `name` or `id` must be specified.      | N/A     |
| calls          | The maximum total number of calls allowed during the time interval specified in `renewal-period`. | Yes      | N/A     |
| renewal-period | The length in seconds of the sliding window during which the number of allowed requests should not exceed the value specified in `calls`. Maximum allowed value: 300 seconds.                                            | Yes      | N/A     |


### operation attributes

| Name           | Description                                                                                           | Required | Default |
| -------------- | ----------------------------------------------------------------------------------------------------- | -------- | ------- |
| name           | The name of the operation for which to apply the rate limit.                                                | Either `name` or `id` must be specified.      | N/A     |
| id           | The id of the operation for which to apply the rate limit.                                                | Either `name` or `id` must be specified.      | N/A     | 
| calls          | The maximum total number of calls allowed during the time interval specified in `renewal-period`. | Yes      | N/A     |
| renewal-period | The length in seconds of the sliding window during which the number of allowed requests should not exceed the value specified in `calls`. Maximum allowed value: 300 seconds.                                            | Yes      | N/A     |

## Usage

[TODO: Validate policy expressions support]

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) product, API, operation
- [**Policy expressions:**](api-management-policy-expressions.md) only supported in `retry-after-variable-name` and `remaining-calls-variable-name` attributes
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted
- **Multiple statements per policy document:** not supported

## Examples

### Subscription rate limit of 20 calls per 90 seconds

In the following example, the per subscription rate limit is 20 calls per 90 seconds. After each policy execution, the remaining calls allowed in the time period are stored in the variable `remainingCallsPerSubscription`.

```xml
<policies>
    <inbound>
        <base />
        <rate-limit calls="20" renewal-period="90" remaining-calls-variable-name="remainingCallsPerSubscription"/>
    </inbound>
    <outbound>
        <base />
    </outbound>
</policies>
```


## Related policies

* [API Management access restriction policies](api-management-access-restriction-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]