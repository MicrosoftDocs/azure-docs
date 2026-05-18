---
title: Azure API Management policy reference - llm-token-limit
description: Reference for the llm-token-limit policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.collection: ce-skilling-ai-copilot
ms.custom:
ms.topic: reference
ms.date: 04/01/2026
ms.update-cycle: 180-days
ms.author: danlep
---

# Limit large language model API token usage

[!INCLUDE [api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2.md)]

The `llm-token-limit` policy prevents large language model (LLM) API usage spikes on a per key basis by limiting consumption of language model tokens to either a specified rate (number per minute), a quota over a specified period, or both. When a specified token rate limit is exceeded, the caller receives a `429 Too Many Requests` response status code. When a specified quota is exceeded, the caller receives a `403 Forbidden` response status code.

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
| token-quota | The maximum number of tokens allowed during the time interval specified in the `token-quota-period`. Policy expressions are allowed. | Either a rate limit (`tokens-per-minute`), a quota (`token-quota` over a `token-quota-period`), or both must be specified. | N/A |
| token-quota-period | The length of the fixed window after which the `token-quota` resets. The value must be one of the following: `Hourly`,`Daily`, `Weekly`, `Monthly`, `Yearly`. The start time of a quota period is calculated as the UTC timestamp truncated to the unit (hour, day, etc.) used for the period. Policy expressions are allowed. | Either a rate limit (`tokens-per-minute`), a quota (`token-quota` over a `token-quota-period`), or both must be specified.   | N/A |
| estimate-prompt-tokens | Boolean value that determines whether to estimate the number of tokens required for a prompt: <br> - `true`: estimate prompt tokens in advance based on prompt schema in API. <br> - `false`: don't estimate prompt tokens; use actual token usage from the model response. <br><br>For token counting and estimation behavior, see [Considerations for token counts and estimation](#considerations-for-token-counts-and-estimation). | Yes       | N/A     |
| retry-after-header-name    | The name of a custom response header whose value is the recommended retry interval in seconds after the specified `tokens-per-minute` or `token-quota` is exceeded. Policy expressions aren't allowed. |  No | `Retry-After`  |
| retry-after-variable-name    | The name of a variable that stores the recommended retry interval in seconds after the specified `tokens-per-minute` or `token-quota` is exceeded. Policy expressions aren't allowed. |  No | N/A  |
| remaining-quota-tokens-header-name | The name of a response header whose value after each policy execution is the estimated number of remaining tokens corresponding to `token-quota` allowed for the `token-quota-period`. Policy expressions aren't allowed. | No | N/A |
| remaining-quota-tokens-variable-name | The name of a variable that after each policy execution stores the estimated number of remaining tokens corresponding to `token-quota` allowed for the `token-quota-period`. Policy expressions aren't allowed.	 | No | N/A |
| remaining-tokens-header-name    | The name of a response header whose value after each policy execution is the number of remaining tokens corresponding to `tokens-per-minute` allowed for the time interval. Policy expressions aren't allowed.|  No | N/A  |
| remaining-tokens-variable-name    | The name of a variable that after each policy execution stores the number of remaining tokens corresponding to `tokens-per-minute` allowed for the time interval. Policy expressions aren't allowed.|  No | N/A  |
| tokens-consumed-header-name    | The name of a response header whose value is the number of tokens consumed by both prompt and completion. The header is added to response only after the response is received from backend. Policy expressions aren't allowed.|  No | N/A  |
| tokens-consumed-variable-name    | The name of a variable initialized to the estimated prompt token count in the `backend` section (or zero if `estimate-prompt-tokens` is `false`), updated with the actual reported count in the `outbound` section.|  No | N/A  |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#understanding-policy-configuration) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
- [**Gateways:**](api-management-gateways-overview.md) classic, v2, self-hosted, workspace

### Usage notes

* This policy can be used multiple times per policy definition.
* This policy can optionally be configured when adding an LLM API using the portal.
* The value of `remaining-quota-tokens-variable-name` or `remaining-quota-tokens-header-name` is an estimate and may be larger than expected based on actual token consumption. For more information, see [Considerations for token counts and estimation](#considerations-for-token-counts-and-estimation).
* [!INCLUDE [api-management-rate-limit-key-scope](../../includes/api-management-rate-limit-key-scope.md)]
* [!INCLUDE [api-management-rate-limit-implementation-v2](../../includes/api-management-rate-limit-implementation-v2.md)]
* [!INCLUDE [api-management-token-limit-gateway-counts](../../includes/api-management-token-limit-gateway-counts.md)]

## Considerations for token counts and estimation

The policy monitors and enforces token limits using actual token usage data returned from the LLM endpoint. You can optionally enable prompt token estimation to reduce unnecessary backend requests. The following considerations apply.

- **Token types**: The policy currently counts prompt and completion tokens only.
- **Without prompt token estimation** (`estimate-prompt-tokens="false"`): The policy uses actual token usage values from the `usage` section of the LLM API response. Prompts may be sent to the backend even when the limit is exceeded; this is detected from the response, after which subsequent requests are blocked until the limit resets.
- **With prompt token estimation** (`estimate-prompt-tokens="true"`): The policy estimates prompt tokens from the prompt schema in the API definition before sending the request. This can reduce unnecessary backend requests when the limit is already exceeded, but may reduce performance.
- **Streaming**: When streaming is enabled in the API request (`stream: true`), prompt tokens are always estimated regardless of the `estimate-prompt-tokens` setting. Completion tokens are also estimated when responses are streamed.
- **Image input**: For models that accept image input, image tokens are generally counted by the backend LLM and included in limit and quota calculations. However, when streaming is enabled or `estimate-prompt-tokens` is set to `true`, the policy overcounts each image as a maximum of 1200 tokens.
- **Concurrency**: Because the exact number of tokens consumed can't be determined until responses are received from the backend, concurrent or near-concurrent requests can temporarily exceed the configured token limit. Once responses are processed and the limit is exceeded, subsequent requests are blocked until the limit resets.
- **Remaining quota accuracy**: The estimated remaining token quota returned in `remaining-quota-tokens-variable-name` or `remaining-quota-tokens-header-name` may be larger than expected based on actual token consumption, and becomes more accurate as the quota is approached.
- 
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
* [llm-emit-token-metric](llm-emit-token-metric-policy.md) policy

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
