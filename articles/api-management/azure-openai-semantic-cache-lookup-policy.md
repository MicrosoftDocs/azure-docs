---
title: Azure API Management policy reference - azure-openai-semantic-cache-lookup | Microsoft Docs
description: Reference for the azure-openai-semantic-cache-lookup policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 05/08/2024
ms.author: danlep
---

# Get cached responses of Azure OpenAI requests

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

Use the `azure-openai-semantic-cache-lookup` policy to perform cache lookup of responses to Azure OpenAI API requests, based on vector proximity of the prompt to previous requests, and a given score threshold. Response caching reduces bandwidth and processing requirements imposed on the backend Azure OpenAI API and lowers latency perceived by API consumers.

> [!NOTE]
> * This policy must have a corresponding [Store responses to Azure OpenAI API requests to cache](azure-openai-semantic-cache-store-policy.md) policy. 
> * For prerequisites and configuration steps, see [Enable semantic caching for Azure OpenAI APIs in Azure API Management](azure-openai-enable-semantic-caching.md).

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-form-alert.md)]

## Policy statement

```xml
<azure-openai-semantic-cache-lookup
    score-threshold="vector distance threshold"
    embeddings-backend-id ="backend entity ID for embeddings"
    embeddings-backend-auth ="system-assigned"             
    ignore-system-messages="true | false"      
    max-message-count="count" 
    <vary-by>"expression to partition caching"</vary-by>
</azure-openai-semantic-cache-lookup>
```

## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
| score-threshold	| Vector distance threshold by which we will cache responses. Value is between 0.0 to 1.0. | Yes |	N/A |
| embeddings-backend-id | Backend ID for Open AI embeddings call |	Yes |	N/A |
| embeddings-backend-auth | Authentication used for Open AI embeddings backend. | Required and always has to be `system-assigned` |	Yes | N/A |
| ignore-system-messages | If set to `true`, removes system messages from a ChatGPT Chat Completion prompt before assessing cache similarity. | No | false |
| max-message-count | If number of remaining dialog messages exceeds this number, caching is skipped. | No | N/A |
                                             
## Elements

|Name|Description|Required|
|----------|-----------------|--------------|
|vary-by| A custom expression determined at runtime whose value partitions caching. If multiple `vary-by` elements are added, values are concatenated to create a unique combination. | No |

## Usage


- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted

### Usage notes

- This policy can only be used once in a policy section.


## Examples

### Example with corresponding azure-openai-semantic-cache-store policy

[!INCLUDE [api-management-semantic-cache-example](../../includes/api-management-semantic-cache-example.md)]

## Related policies

* [Caching](api-management-policies.md#caching)
* [azure-openai-semantic-cache-store](azure-openai-semantic-cache-store-policy.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
