---
author: dlepow
ms.service: azure-api-management
ms.custom:
  - build-2024
ms.topic: include
ms.date: 07/09/2024
ms.author: danlep
---

## Supported Azure OpenAI in Foundry Models models

The policy is used with APIs [added to API Management from the Azure OpenAI in Foundry Models](../articles/api-management/azure-openai-api-from-specification.md) of the following types:

| API type | Supported models |
|-------|-------------|
| Chat completion     |  `gpt-3.5`<br/><br/>`gpt-4`<br/><br/>`gpt-4o`<br/><br/>`gpt-4o-mini`<br/><br/>`o1`<br/><br/>`o3` |
| Embeddings | `text-embedding-3-large`<br/><br/> `text-embedding-3-small`<br/><br/>`text-embedding-ada-002` |
| Responses (preview) | `gpt-4o` (Versions: `2024-11-20`, `2024-08-06`, `2024-05-13`)<br/><br/>`gpt-4o-mini` (Version: `2024-07-18`)<br/><br/>`gpt-4.1` (Version: `2025-04-14`)<br/><br/>`gpt-4.1-nano` (Version: `2025-04-14`)<br/><br/>`gpt-4.1-mini` (Version: `2025-04-14`)<br/><br/>`gpt-image-1` (Version: `2025-04-15`)<br/><br/>`o3` (Version: `2025-04-16`)<br/><br/>`o4-mini` (Version: `2025-04-16)


> [!NOTE]
> Traditional completion APIs are only available with legacy model versions and support is limited.

For current information about the models and their capabilities, see [Azure OpenAI in Foundry Models](/azure/ai-services/openai/concepts/models).


