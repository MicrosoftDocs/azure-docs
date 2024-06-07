---
title: Azure API Management policy reference - azure-openai-token-limit
description: Reference for the azure-openai-token-limit policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.custom:
  - build-2024
ms.topic: article
ms.date: 05/10/2024
ms.author: danlep
---

# Limit Azure OpenAI API token usage

[!INCLUDE [api-management-availability-premium-dev-standard-basic-standardv2-basicv2](../../includes/api-management-availability-premium-dev-standard-basic-standardv2-basicv2.md)]

The `azure-openai-token-limit` policy prevents Azure OpenAI Service API usage spikes on a per key basis by limiting consumption of language model tokens to a specified number per minute. When the token usage is exceeded, the caller receives a `429 Too Many Requests` response status code.

By relying on token usage metrics returned from the OpenAI endpoint, the policy can accurately monitor and enforce limits in real time. The policy also enables precalculation of prompt tokens by API Management, minimizing unnecessary requests to the OpenAI backend if the limit is already exceeded.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Supported Azure OpenAI Service models

The policy is used with APIs [added to API Management from the Azure OpenAI Service](azure-openai-api-from-specification.md) of the following types:

| API type | Supported models |
|-------|-------------|
| Chat completion     |  gpt-3.5<br/><br/>gpt-4 |
| Completion | gpt-3.5-turbo-instruct |
| Embeddings | text-embedding-3-large<br/><br/> text-embedding-3-small<br/><br/>text-embedding-ada-002 |


For more information, see [Azure OpenAI Service models](../ai-services/openai/concepts/models.md).

## Policy statement

```xml
<azure-openai-token-limit counter-key="key value"
        tokens-per-minute="number"
        estimate-prompt-tokens="true | false"    
        retry-after-header-name="custom header name, replaces default 'Retry-After'" 
        retry-after-variable-name="policy expression variable name"
        remaining-tokens-header-name="header name"  
        remaining-tokens-variable-name="policy expression variable name"
        consumed-tokens-header-name="header name"
        consumed-tokens-variable-name="policy expression variable name" />
```
## Attributes

| Attribute           | Description                                                                                           | Required | Default |
| -------------- | ----------------------------------------------------------------------------------------------------- | -------- | ------- |
| counter-key          | The key to use for the token limit policy. For each key value, a single counter is used for all scopes at which the policy is configured. Policy expressions are allowed.| Yes      | N/A     |
| tokens-per-minute | The maximum number of tokens consumed by prompt and completion per minute.         | Yes      | N/A     |
| estimate-prompt-tokens | Boolean value that determines whether to estimate the number of tokens required for a prompt: <br> - `true`: estimate the number of tokens based on prompt schema in API; may reduce performance. <br> - `false`: don't estimate prompt tokens.  | Yes       | N/A     |
| retry-after-header-name    | The name of a custom response header whose value is the recommended retry interval in seconds after the specified `tokens-per-minute` is exceeded. Policy expressions aren't allowed. |  No | `Retry-After`  |
| retry-after-variable-name    | The name of a variable that stores the recommended retry interval in seconds after the specified `tokens-per-minute` is exceeded. Policy expressions aren't allowed. |  No | N/A  |
| remaining-tokens-header-name    | The name of a response header whose value after each policy execution is the number of remaining tokens allowed for the time interval. Policy expressions aren't allowed.|  No | N/A  |
| remaining-tokens-variable-name    | The name of a variable that after each policy execution stores the number of remaining tokens allowed for the time interval. Policy expressions aren't allowed.|  No | N/A  |
| consumed-tokens-header-name    | The name of a response header whose value is the number of tokens consumed by both prompt and completion. The header is added to response only after the response is received from backend. Policy expressions aren't allowed.|  No | N/A  |
| consumed-tokens-variable-name    | The name of a variable initialized to the estimated number of tokens in the prompt in `backend` section of pipeline if `estimate-prompt-tokens` is `true` and zero otherwise. The variable is updated with the reported count upon receiving the response in `outbound` section.|  No | N/A  |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
- [**Gateways:**](api-management-gateways-overview.md) classic, v2

### Usage notes

* This policy can be used multiple times per policy definition.
* This policy can optionally be configured when adding an API from the Azure OpenAI Service using the portal.
* [!INCLUDE [api-management-rate-limit-key-scope](../../includes/api-management-rate-limit-key-scope.md)]

## Example

In the following example, the token limit of 5000 per minute is keyed by the caller IP address. The policy doesn't estimate the number of tokens required for a prompt. After each policy execution, the remaining tokens allowed for that caller IP address in the time period are stored in the variable `remainingTokens`.

```xml
<policies>
    <inbound>
        <base />
        <azure-openai-token-limit
            counter-key="@(context.Request.IpAddress)"
            tokens-per-minute="5000" estimate-prompt-tokens="false" remaining-tokens-variable-name="remainingTokens" />
    </inbound>
    <outbound>
        <base />
    </outbound>
</policies>
```

## Related policies

* [Rate limiting and quotas](api-management-policies.md#rate-limiting-and-quotas)
* [azure-openai-emit-token-metric](azure-openai-emit-token-metric-policy.md) policy

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
