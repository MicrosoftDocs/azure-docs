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
| Chat completion     |  gpt-3.5<br/><br/>gpt-4<br/><br/>gpt-4o<sup>1</sup> |
| Embeddings | text-embedding-3-large<br/><br/> text-embedding-3-small<br/><br/>text-embedding-ada-002 |

<sup>1</sup> The `gpt-4o` model is multimodal (accepts text or image inputs and generates text).

> [!NOTE]
> Traditional completion APIs are only available with legacy model versions and support is limited.

For more information, see [Azure OpenAI Service models](/azure/ai-services/openai/concepts/models).

