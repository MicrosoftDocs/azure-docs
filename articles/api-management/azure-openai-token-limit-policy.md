---
title: Azure API Management policy reference - azure-openai-token-limit | Microsoft Docs
description: Reference for the azure-openai-token-limit policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 04/17/2024
ms.author: danlep
---

# Limit Azure OpenAI token usage

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

The `azure-openai-token-limit` policy prevents Azure OpenAI AI usage spikes by limiting  language model tokens per calculated key..... When the token usage... is exceeded, ....

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Supported models


| Model | Description |
|-------|-------------|


## Policy statement

```xml
<azure-openai-token-limit counter-key="key value"
        tokens-per-minute="number"
        estimate-prompt-tokens="true | false"    
        prompt-type="auto | chat-completion | completion | embeddings"
        retry-after-header-name="custom header name, replaces default 'Retry-After'" 
        retry-after-variable-name="policy expression variable name"
        remaining-tokens-header-name="header name"  
        remaining-tokens-variable-name="policy expression variable name"
        consumed-tokens-header-name="header name"
        consumed-tokens-variable-name="policy expression variable name">
</azure-openai-token-limit>
```
## Attributes

| Attribute           | Description                                                                                           | Required | Default |
| -------------- | ----------------------------------------------------------------------------------------------------- | -------- | ------- |
| counter-key          | The key to use for the token limit policy. For each key value, a single counter is used for all scopes at which the policy is configured. Policy expressions are allowed.| Yes      | N/A     |
| tokens-per-minute | The number of tokens...                                         | Yes      | N/A     |
| estimate-prompt-tokens | A Boolean value that determines whether to estimate the number of tokens required for a prompt.  | Yes       | N/A     |
| prompt-type | The type of prompt for which to estimate the number of tokens. | No       | auto     |
| retry-after-header-name    | The name of a custom response header whose value is the recommended retry interval in seconds after the specified `tokens-per-minute` is exceeded. Policy expressions aren't allowed. |  No | `Retry-After`  |
| retry-after-variable-name    | The name of a variable that stores the recommended retry interval in seconds after the specified `tokens-per-minute` is exceeded. Policy expressions aren't allowed. |  No | N/A  |
| remaining-tokens-header-name    | The name of a response header whose value after each policy execution is the number of remaining tokens allowed for the time interval specified in the `renewal-period`. Policy expressions aren't allowed.|  No | N/A  |
| remaining-tokens-variable-name    | The name of a variable that after each policy execution stores the number of remaining calls allowed for the time interval specified in the `renewal-period`. Policy expressions aren't allowed.|  No | N/A  |
| consumed-tokens-header-name    | The name of a response header whose value after each policy execution is the number of remaining tokens allowed for the time interval specified in the `renewal-period`. Policy expressions aren't allowed.|  No | N/A  |
| consumed-tokens-variable-name    | The name of a variable that after each policy execution stores the number of remaining calls allowed for the time interval specified in the `renewal-period`. Policy expressions aren't allowed.|  No | N/A  |





## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
- [**Gateways:**](api-management-gateways-overview.md) classic, v2

### Usage notes

* This policy can be used multiple times per policy definition.
* This policy is only applied when an API is accessed using a subscription key.



## Example

In the following example...

```xml
<policies>
    <inbound>
        <base />
        <.../>
    </inbound>
    <outbound>
        <base />
    </outbound>
</policies>
```


## Related policies

* [Rate limiting and quotas](api-management-policies.md#rate-limiting-and-quotas)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
