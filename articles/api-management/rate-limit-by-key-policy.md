---
title: Azure API Management policy reference - rate-limit-by-key | Microsoft Docs
description: Reference for the rate-limit-by-key policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: article
ms.date: 07/23/2024
ms.author: danlep
---

# Limit call rate by key

[!INCLUDE [api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2.md)]

The `rate-limit-by-key` policy prevents API usage spikes on a per key basis by limiting the call rate to a specified number per a specified time period. The key can have an arbitrary string value and is typically provided using a policy expression. Optional increment condition can be added to specify which requests should be counted towards the limit. When this call rate is exceeded, the caller receives a `429 Too Many Requests` response status code.

To understand the difference between rate limits and quotas, [see Rate limits and quotas.](./api-management-sample-flexible-throttling.md#rate-limits-and-quotas)

[!INCLUDE [api-management-rate-limit-accuracy](../../includes/api-management-rate-limit-accuracy.md)]

[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]

## Policy statement

```xml
<rate-limit-by-key calls="number"
                   renewal-period="seconds"
                   increment-condition="condition"
                   increment-count="number"
                   counter-key="key value" 
                   retry-after-header-name="custom header name, replaces default 'Retry-After'" 
                   retry-after-variable-name="policy expression variable name"
                   remaining-calls-header-name="header name"  
                   remaining-calls-variable-name="policy expression variable name"
                   total-calls-header-name="header name"/> 

```

## Attributes

| Attribute                | Description                                                                                           | Required | Default |
| ------------------- | ----------------------------------------------------------------------------------------------------- | -------- | ------- |
| calls               | The maximum total number of calls allowed for the key value during the time interval specified in the `renewal-period`. Policy expressions are allowed. | Yes      | N/A     |
| counter-key         | The key to use for the rate limit policy. For each key value, a single counter is used for all scopes at which the policy is configured. Policy expressions are allowed.         | Yes      | N/A     |
| increment-condition | The Boolean expression specifying if the request should be counted towards the rate (`true`). Policy expressions are allowed but will postpone evaluation and counter increment actions to end of outbound pipeline.        | No       | N/A     |
| increment-count | The number by which the counter is increased per request. Policy expressions are allowed but will postpone evaluation and counter increment to end of outbound pipeline.       | No       | 1     |
| renewal-period      | The length in seconds of the sliding window during which the number of allowed requests should not exceed the value specified in `calls`. Maximum allowed value: 300 seconds. Policy expressions are allowed.       | Yes      | N/A     |
| retry-after-header-name    | The name of a custom response header whose value is the recommended retry interval in seconds after the specified call rate is exceeded for the key value. Policy expressions aren't allowed. |  No | `Retry-After`  |
| retry-after-variable-name    | The name of a policy expression variable that stores the recommended retry interval in seconds after the specified call rate is exceeded for the key value. Policy expressions aren't allowed. |  No | N/A  |
| remaining-calls-header-name    | The name of a response header whose value after each policy execution is the number of remaining calls allowed for the key value in the time interval specified in the `renewal-period`. Policy expressions aren't allowed. |  No | N/A  |
| remaining-calls-variable-name    | The name of a policy expression variable that after each policy execution stores the number of remaining calls allowed for the key value in the time interval specified in the `renewal-period`. Policy expressions aren't allowed. |  No | N/A  |
| total-calls-header-name    | The name of a response header whose value is the value specified in `calls`. Policy expressions aren't allowed. |  No | N/A  |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
- [**Gateways:**](api-management-gateways-overview.md) classic, v2, self-hosted, workspace

### Usage notes

* [!INCLUDE [api-management-rate-limit-key-scope](../../includes/api-management-rate-limit-key-scope.md)]
* [!INCLUDE [api-management-self-hosted-gateway-rate-limit](../../includes/api-management-self-hosted-gateway-rate-limit.md)] [Learn more](how-to-self-hosted-gateway-on-kubernetes-in-production.md#request-throttling)
* When `increment-condition` or `increment-count` are defined using expressions, evaluation and increment of rate limit counter are postponed to end of outbound pipeline to allow for policy expressions based on the reponse. Limit exceeded condition is not evaluated at the same time in this case and will be evaluated on next incoming call. This leads to cases where `429 Too Many Requests` status code is returned 1 call later than usual.


## Example

In the following example, the rate limit of 10 calls per 60 seconds is keyed by the caller IP address. After each policy execution, the remaining calls allowed for that caller IP address in the time period are stored in the variable `remainingCallsPerIP`.

```xml
<policies>
    <inbound>
        <base />
        <rate-limit-by-key calls="10"
              renewal-period="60"
              increment-condition="@(context.Response.StatusCode == 200)"
              counter-key="@(context.Request.IpAddress)"
              remaining-calls-variable-name="remainingCallsPerIP"/>
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