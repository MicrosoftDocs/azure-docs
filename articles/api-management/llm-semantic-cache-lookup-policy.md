---
title: Azure API Management policy reference - llm-semantic-cache-lookup | Microsoft Docs
description: Reference for the llm-semantic-cache-lookup policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.collection: ce-skilling-ai-copilot
ms.custom:
  - build-2024
ms.topic: article
ms.date: 12/13/2024
ms.author: danlep
---

# Get cached responses of large language model API requests

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

Use the `llm-semantic-cache-lookup` policy to perform cache lookup of responses to large language model (LLM) API requests from a configured external cache, based on vector proximity of the prompt to previous requests and a specified similarity score threshold. Response caching reduces bandwidth and processing requirements imposed on the backend LLM API and lowers latency perceived by API consumers.

> [!NOTE]
> * This policy must have a corresponding [Cache responses to large language model API requests](llm-semantic-cache-store-policy.md) policy. 
> * For prerequisites and steps to enable semantic caching, see [Enable semantic caching for Azure OpenAI APIs in Azure API Management](azure-openai-enable-semantic-caching.md).
> * Currently, this policy is in preview.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

[!INCLUDE [api-management-llm-models](../../includes/api-management-llm-models.md)]

## Policy statement

```xml
<llm-semantic-cache-lookup
    score-threshold="similarity score threshold"
    embeddings-backend-id ="backend entity ID for embeddings API"
    embeddings-backend-auth ="system-assigned"             
    ignore-system-messages="true | false"      
    max-message-count="count" >
    <vary-by>"expression to partition caching"</vary-by>
</llm-semantic-cache-lookup>
```

## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
| score-threshold	| Similarity score threshold used to determine whether to return a cached response to a prompt. Value is a decimal between 0.0 and 1.0. [Learn more](../azure-cache-for-redis/cache-tutorial-semantic-cache.md#change-the-similarity-threshold). | Yes |	N/A |
| embeddings-backend-id | [Backend](backends.md) ID for OpenAI embeddings API call. |	Yes |	N/A |
| embeddings-backend-auth | Authentication used for Azure OpenAI embeddings API backend. | Yes. Must be set to `system-assigned`. | N/A |
| ignore-system-messages | Boolean. If set to `true`, removes system messages from a GPT chat completion prompt before assessing cache similarity. | No | false |
| max-message-count | If specified, number of remaining dialog messages after which caching is skipped. | No | N/A |
                                             
## Elements

|Name|Description|Required|
|----------|-----------------|--------------|
|vary-by| A custom expression determined at runtime whose value partitions caching. If multiple `vary-by` elements are added, values are concatenated to create a unique combination. | No |

## Usage


- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption

### Usage notes

- This policy can only be used once in a policy section.


## Examples

### Example with corresponding llm-semantic-cache-store policy

[!INCLUDE [api-management-llm-semantic-cache-example](../../includes/api-management-llm-semantic-cache-example.md)]

## Related policies

* [Caching](api-management-policies.md#caching)
* [llm-semantic-cache-store](llm-semantic-cache-store-policy.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
