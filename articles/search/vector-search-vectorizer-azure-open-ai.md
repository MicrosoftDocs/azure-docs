---
title: Azure OpenAI vectorizer
titleSuffix: Azure AI Search
description: Connects to a deployed model on your Azure OpenAI resource at query time.
author: careyjmac
ms.author: chalton
ms.service: cognitive-search
ms.custom:
  - build-2024
ms.topic: reference
ms.date: 05/28/2024
---

# Azure OpenAI vectorizer

> [!IMPORTANT] 
> This feature is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [2023-10-01-Preview REST API](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2023-10-01-preview&preserve-view=true) and later preview REST APIs support this feature.

The **Azure OpenAI** vectorizer connects to a deployed embedding model on your [Azure OpenAI](/azure/ai-services/openai/overview) resource to generate embeddings at query time. Your data is processed in the [Geo](https://azure.microsoft.com/explore/global-infrastructure/data-residency/) where your model is deployed. 

> [!NOTE]
> This vectorizer is bound to Azure OpenAI and is charged at the existing [Azure OpenAI pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/#pricing).
>

## Vectorizer parameters

Parameters are case-sensitive.

| Parameter name	 | Description |
|--------------------|-------------|
| `resourceUri` | The URI of a model provider, such as an Azure OpenAI resource or an OpenAI URL.  |
| `apiKey`   |  The secret key used to access the model. If you provide a key, leave `authIdentity` empty. If you set both the `apiKey` and `authIdentity`, the `apiKey` is used on the connection. |
| `deploymentId`   | The name of the deployed Azure OpenAI embedding model. The model should be an embedding model, such as text-embedding-ada-002. See the [List of Azure OpenAI models](/azure/ai-services/openai/concepts/models) for supported models.|
| `authIdentity`   | A user-managed identity used by the search service for connecting to Azure OpenAI. You can use either a [system or user managed identity](search-howto-managed-identities-data-sources.md). To use a system manged identity, leave `apiKey` and `authIdentity` blank. The system-managed identity is used automatically. A managed identity must have [Cognitive Services OpenAI User](/azure/ai-services/openai/how-to/role-based-access-control#azure-openai-roles) permissions to send text to Azure OpenAI. |
| `modelName` | (Required in API version 2024-05-01-Preview and later). The name of the Azure OpenAI embedding model that is deployed at the provided `resourceUri` and `deploymentId`. Currently supported values are `text-embedding-ada-002`, `text-embedding-3-large`, and `text-embedding-3-small` |

## Supported vector query types

The Azure OpenAI vectorizer only supports `text` vector queries.

## Expected field dimensions

The expected field dimensions for a field configured with an Azure OpenAI vectorizer depend on the `modelName` that is configured.

| `modelName` | Minimum dimensions | Maximum dimensions |
|--------------------|-------------|-------------|
| text-embedding-ada-002 | 1536 | 1536 |
| text-embedding-3-large | 1 | 3072 |
| text-embedding-3-small | 1 | 1536 |

## Sample definition

```json
"vectorizers": [
    {
        "name": "my-openai-vectorizer",
        "kind": "azureOpenAI",
        "azureOpenAIParameters": {
            "resourceUri": "https://my-fake-azure-openai-resource.openai.azure.com",
            "apiKey": "0000000000000000000000000000000000000",
            "deploymentId": "my-ada-002-deployment",
            "authIdentity": null,
            "modelName": "text-embedding-ada-002",
        },
    }
]
```

## See also

+ [Integrated vectorization](vector-search-integrated-vectorization.md)
+ [How to configure a vectorizer in a search index](vector-search-how-to-configure-vectorizer.md)
+ [Azure OpenAI Embedding skill](cognitive-search-skill-azure-openai-embedding.md)