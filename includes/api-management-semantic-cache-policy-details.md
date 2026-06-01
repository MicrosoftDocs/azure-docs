---
author: dlepow
ms.service: azure-api-management
ms.custom:
  - build-2024
ms.topic: include
ms.date: 10/29/2025
ms.author: danlep
---

## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
| score-threshold	| Score threshold defines how closely an incoming prompt must match a cached prompt to return its stored response. The value ranges from 0.0 to 1.0. Lower values require higher semantic similarity for a match. [Learn more](../articles/redis/tutorial-semantic-cache.md#change-the-similarity-threshold). | Yes |	N/A |
| embeddings-backend-id | [Backend](../articles/api-management/backends.md) ID for embeddings API call. |	Yes |	N/A |
| embeddings-backend-auth | Authentication used for embeddings API backend. | Yes. Must be set to `system-assigned`. | N/A |
| ignore-system-messages | Boolean. When set to `true` (recommended), removes system messages from a chat completion prompt before assessing cache similarity. | No | false |
| max-message-count | If specified, number of remaining dialog messages after which caching is skipped. | No | N/A |
                                             
## Elements

|Name|Description|Required|
|----------|-----------------|--------------|
|vary-by| A custom expression determined at runtime whose value partitions caching. If multiple `vary-by` elements are added, values are concatenated to create a unique combination. | No |

## Usage


- [**Policy sections:**](../articles/api-management//api-management-howto-policies.md#understanding-policy-configuration) inbound
- [**Policy scopes:**](../articles/api-management//api-management-howto-policies.md#scopes) global, product, API, operation
-  [**Gateways:**](../articles/api-management/api-management-gateways-overview.md) classic, v2, consumption, self-hosted

### Usage notes

- This policy can only be used once in a policy section.
- Fine-tune the value of `score-threshold` based on your application to ensure that the right sensitivity is used to determine when to return cached responses for queries. Start with a low value such as 0.05 and adjust to optimize the ratio of cache hits to misses.
- Score threshold above 0.2 may lead to cache mismatch. Consider using lower value for sensitive use cases.
- Control cross-user access to cache entries by specifying `vary-by` with specific user or user-group identifiers.
- The embeddings model should have enough capacity and sufficient context size to accommodate the prompt volume and prompts.
- Consider adding [llm-content-safety](../articles/api-management//llm-content-safety-policy.md) policy with prompt shield to protect from prompt attacks.
- [!INCLUDE [api-management-cache-rate-limit](api-management-cache-rate-limit.md)]