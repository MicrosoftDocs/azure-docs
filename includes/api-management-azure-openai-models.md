---
author: dlepow
ms.service: azure-api-management
ms.custom:
  - build-2024
ms.topic: include
ms.date: 07/09/2024
ms.author: danlep
---

## Supported Azure OpenAI Service models

The policy is used with APIs [added to API Management from the Azure OpenAI Service](../articles/api-management/azure-openai-api-from-specification.md) of the following types:

| API type | Supported models |
|-------|-------------|
| Chat completion     |  `gpt-3.5`<br/><br/>`gpt-4`<br/><br/>`gpt-4o`<sup>1</sup><br/><br/>`gpt-4o-mini`<sup>1</sup><br/><br/>`o1`<br/><br/>`03` |
| Embeddings | `text-embedding-3-large`<br/><br/> `text-embedding-3-small`<sup>1</sup><br/><br/>`text-embedding-ada-002` |
| Responses (preview) | `gpt-4o` (Versions: `2024-11-20`, `2024-08-06`, `2024-05-13`)<br/><br/>`gpt-4o-mini`<sup>1</sup> (Version: `2024-07-18`)<br/><br/>`gpt-4.1` (Version: `2025-04-14`)<br/><br/>`gpt-4.1-nano` (Version: `2025-04-14`)<br/><br/>`gpt-4.1-mini` (Version: `2025-04-14`)<br/><br/>`gpt-image-1` (Version: `2025-04-15`)<br/><br/>`o3` (Version: `2025-04-16`)<br/><br/>`o4-mini` (Version: `2025-04-16)


<sup>1</sup> Model is multimodal (accepts text or image inputs and generates text).

> [!NOTE]
> Traditional completion APIs are only available with legacy model versions and support is limited.

For more information, see [Azure OpenAI Service models](/azure/ai-services/openai/concepts/models).

