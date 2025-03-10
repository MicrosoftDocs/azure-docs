---
title: Azure API Management policy reference - llm-token-limit
description: Reference for the llm-token-limit policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.collection: ce-skilling-ai-copilot
ms.custom:
ms.topic: reference
ms.date: 02/18/2025
ms.author: danlep
---

# Limit large language model API token usage

[!INCLUDE [api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2.md)]

The `llm-token-limit` policy prevents large language model (LLM) API usage spikes on a per key basis by limiting consumption of language model tokens to either a specified rate (number per minute), a quota over a specified period, or both. When a specified token rate limit is exceeded, the caller receives a `429 Too Many Requests` response status code. When a specified quota is exceeded, the caller receives a `403 Forbidden` response status code.

By relying on token usage metrics returned from the LLM endpoint, the policy can accurately monitor and enforce limits in real time. The policy also enables precalculation of prompt tokens by API Management, minimizing unnecessary requests to the LLM backend if the limit is already exceeded.

> [!NOTE]
> Currently, this policy is in preview.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

[!INCLUDE [api-management-llm-models](../../includes/api-management-llm-models.md)]

## Policy statement

```xml
<llm-token-limit counter-key="key value"
        tokens-per-minute="number"
        token-quota="number"
        token-quota-period="Hourly | Daily | Weekly | Monthly | Yearly"
        estimate-prompt-tokens="true | false"    
        retry-after-header-name="custom header name, replaces default 'Retry-After'" 
        retry-after-variable-name="policy expression variable name"
        remaining-quota-tokens-header-name="header name"  
        remaining-quota-tokens-variable-name="policy expression variable name"
        remaining-tokens-header-name="header name"  
        remaining-tokens-variable-name="policy expression variable name"
        tokens-consumed-header-name="header name"
        tokens-consumed-variable-name="policy expression variable name" />
```
## Attributes

| Attribute           | Description                                                                                           | Required | Default |
| -------------- | ----------------------------------------------------------------------------------------------------- | -------- | ------- |
| counter-key          | The key to use for the token limit policy. For each key value, a single counter is used for all scopes at which the policy is configured. Policy expressions are allowed.| Yes      | N/A     |
| tokens-per-minute | The maximum number of tokens consumed by prompt and completion per minute.         | Either a rate limit (`tokens-per-minute`), a quota (`token-quota` over a `token-quota-period`), or both must be specified.      | N/A     |
| token-quota | The maximum number of tokens allowed during the time interval specified in the `token-quota-period`. Policy expressions aren't allowed. | Either a rate limit (`tokens-per-minute`), a quota (`token-quota` over a `token-quota-period`), or both must be specified. | N/A |
| token-quota-period | The length of the fixed window after which the `token-quota` resets. The value must be one of the following: `Hourly`,`Daily`, `Weekly`, `Monthly`, `Yearly`. The start time of a quota period is calculated as the UTC timestamp truncated to the unit (hour, day, etc.) used for the period.  | Either a rate limit (`tokens-per-minute`), a quota (`token-quota` over a `token-quota-period`), or both must be specified.   | N/A |
| estimate-prompt-tokens | Boolean value that determines whether to estimate the number of tokens required for a prompt: <br> - `true`: estimate the number of tokens based on prompt schema in API; may reduce performance. <br> - `false`: don't estimate prompt tokens. <br><br>When set to `false`, the remaining tokens per `counter-key` are calculated using the actual token usage from the response of the model. This could result in prompts being sent to the model that exceed the token limit. In such case, this will be detected in the response, and all succeeding requests will be blocked by the policy until the token limit frees up again.  | Yes       | N/A     |
| retry-after-header-name    | The name of a custom response header whose value is the recommended retry interval in seconds after the specified `tokens-per-minute` or `token-quota` is exceeded. Policy expressions aren't allowed. |  No | `Retry-After`  |
| retry-after-variable-name    | The name of a variable that stores the recommended retry interval in seconds after the specified `tokens-per-minute` or `token-quota` is exceeded. Policy expressions aren't allowed. |  No | N/A  |
| remaining-quota-tokens-header-name | The name of a response header whose value after each policy execution is the number of remaining tokens corresponding to `token-quota` allowed for the `token-quota-period`. Policy expressions aren't allowed. | No | N/A |
| remaining-quota-tokens-variable-name | The name of a variable that after each policy execution stores the number of remaining tokens corresponding to `token-quota` allowed for the `token-quota-period`. Policy expressions aren't allowed.	 | No | N/A |
| remaining-tokens-header-name    | The name of a response header whose value after each policy execution is the number of remaining tokens corresponding to `tokens-per-minute` allowed for the time interval. Policy expressions aren't allowed.|  No | N/A  |
| remaining-tokens-variable-name    | The name of a variable that after each policy execution stores the number of remaining tokens corresponding to `tokens-per-minute` allowed for the time interval. Policy expressions aren't allowed.|  No | N/A  |
| tokens-consumed-header-name    | The name of a response header whose value is the number of tokens consumed by both prompt and completion. The header is added to response only after the response is received from backend. Policy expressions aren't allowed.|  No | N/A  |
| tokens-consumed-variable-name    | The name of a variable initialized to the estimated number of tokens in the prompt in `backend` section of pipeline if `estimate-prompt-tokens` is `true` and zero otherwise. The variable is updated with the reported count upon receiving the response in `outbound` section.|  No | N/A  |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
- [**Gateways:**](api-management-gateways-overview.md) classic, v2, self-hosted, workspace

### Usage notes

* This policy can be used multiple times per policy definition.
* Where available when `estimate-prompt-tokens` is set to `false`, values in the usage section of the response from the LLM API are used to determine token usage.
* Certain LLM endpoints support streaming of responses. When `stream` is set to `true` in the API request to enable streaming, prompt tokens are always estimated, regardless of the value of the `estimate-prompt-tokens` attribute.
* For models that accept image input, image tokens are generally counted by the backend language model and included in limit and quota calculations. However, when streaming is used or `estimate-prompt-tokens` is set to `true`, the policy currently over-counts each image as a maximum count of 1200 tokens.
* [!INCLUDE [api-management-rate-limit-key-scope](../../includes/api-management-rate-limit-key-scope.md)]

## Examples

### Token rate limit

In the following example, the token rate limit of 5000 per minute is keyed by the caller IP address. The policy doesn't estimate the number of tokens required for a prompt. After each policy execution, the remaining tokens allowed for that caller IP address in the time period are stored in the variable `remainingTokens`.

```xml
<policies>
    <inbound>
        <base />
        <llm-token-limit
            counter-key="@(context.Request.IpAddress)"
            tokens-per-minute="5000" estimate-prompt-tokens="false" remaining-tokens-variable-name="remainingTokens" />
    </inbound>
    <outbound>
        <base />
    </outbound>
</policies>
```

### Token quota

In the following example, the token quota of 10000 is keyed by the subscription ID and resets monthly. After each policy execution, the number of remaining tokens allowed for that subscription ID in the time period is stored in the variable `remainingQuotaTokens`.

```xml
<policies>
    <inbound>
        <base />
        <llm-token-limit
            counter-key="@(context.Subscription.Id)"
            token-quota="100000" token-quota-period="Monthly" remaining-quota-tokens-variable-name="remainingQuotaTokens" />
    </inbound>
    <outbound>
        <base />
    </outbound>
</policies>

```

## Related policies

* [Rate limiting and quotas](api-management-policies.md#rate-limiting-and-quotas)
* [azure-openai-token-limit](azure-openai-token-limit-policy.md) policy
* [llm-emit-token-metric](llm-emit-token-metric-policy.md) policy

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
