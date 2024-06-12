---
title: Azure AI Vision vectorizer
titleSuffix: Azure AI Search
description: Connects to an Azure AI Vision resource to generate embeddings at query time.
author: careyjmac
ms.author: chalton
ms.service: cognitive-search
ms.custom:
  - build-2024
ms.topic: reference
ms.date: 05/28/2024
---

# Azure AI Vision vectorizer

> [!IMPORTANT] 
> This feature is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [2024-05-01-Preview REST API](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2024-05-01-Preview&preserve-view=true) supports this feature.

The **Azure AI Vision** vectorizer connects to an Azure AI Vision resource to generate embeddings at query time using [the Multimodal embeddings API](../ai-services/computer-vision/concept-image-retrieval.md). Your data is processed in the [Geo](https://azure.microsoft.com/explore/global-infrastructure/data-residency/) where your model is deployed. 

> [!NOTE]
> This vectorizer is bound to Azure AI services. Execution of the vectorizer is charged at the existing [Azure AI services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/).

## Vectorizer parameters

Parameters are case-sensitive.

| Parameter name | Description |
|---------------------|-------------|
| `resourceUri` | The URI of the AI Services resource.  |
| `apiKey`   |  The API key of the AI Services resource. |
| `modelVersion` | (Required) The model version to be passed to the Azure AI Vision API for generating embeddings. It's important that all embeddings stored in a given index field are generated using the same `modelVersion`. |
| `authIdentity`   | A user-managed identity used by the search service for connecting to AI Services. You can use either a [system or user managed identity](search-howto-managed-identities-data-sources.md). To use a system manged identity, leave `apiKey` and `authIdentity` blank. The system-managed identity is used automatically. A managed identity must have Cognitive Services User permissions to use this vectorizer. |

## Supported vector query types

The Azure AI Vision vectorizer supports `text`, `imageUrl`, and `imageBinary` vector queries.

## Expected field dimensions

A field configured with the Azure AI Vision vectorizer should have a dimensions value of 1024.

## Sample definition

```json
"vectorizers": [
    {
        "name": "my-ai-services-vision-vectorizer",
        "kind": "aiServicesVision",
        "aiServicesVisionParameters": {
            "resourceUri": "https://westus.api.cognitive.microsoft.com/",
            "apiKey": "0000000000000000000000000000000000000",
            "authIdentity": null,
            "modelVersion": "2023-04-15"
        },
    }
]
```

## See also

+ [Integrated vectorization](vector-search-integrated-vectorization.md)
+ [How to configure a vectorizer in a search index](vector-search-how-to-configure-vectorizer.md)
+ [Azure AI Vision Vectorize skill](cognitive-search-skill-vision-vectorize.md)