---
title: Azure API Management policy reference - llm-semantic-cache-lookup | Microsoft Docs
description: Reference for the llm-semantic-cache-lookup policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.collection: ce-skilling-ai-copilot
ms.custom:
  - build-2024
ms.topic: reference
ms.date: 10/27/2025
ms.update-cycle: 180-days
ms.author: danlep
---

# Get cached responses of large language model API requests

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

Use the `llm-semantic-cache-lookup` policy to perform cache lookup of responses to large language model (LLM) API requests from a configured external cache, based on vector proximity of the prompt to previous requests and a specified score threshold. Response caching reduces bandwidth and processing requirements imposed on the backend LLM API and lowers latency perceived by API consumers.

> [!NOTE]
> * This policy must have a corresponding [Cache responses to large language model API requests](llm-semantic-cache-store-policy.md) policy. 
> * For prerequisites and steps to enable semantic caching, see [Enable semantic caching for LLM APIs in Azure API Management](azure-openai-enable-semantic-caching.md).

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

[!INCLUDE [api-management-llm-models](../../includes/api-management-llm-models.md)]

## Policy statement

```xml
<llm-semantic-cache-lookup
    score-threshold="score threshold to return cached response"
    embeddings-backend-id ="backend entity ID for embeddings API"
    embeddings-backend-auth ="system-assigned"             
    ignore-system-messages="true | false"      
    max-message-count="count" >
    <vary-by>"expression to partition caching"</vary-by>
</llm-semantic-cache-lookup>
```

[!INCLUDE [api-management-semantic-cache-policy-details](../../includes/api-management-semantic-cache-policy-details.md)]

## Examples

### Example with corresponding llm-semantic-cache-store policy

[!INCLUDE [api-management-llm-semantic-cache-example](../../includes/api-management-llm-semantic-cache-example.md)]

## Related policies

* [Caching](api-management-policies.md#caching)
* [llm-semantic-cache-store](llm-semantic-cache-store-policy.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
