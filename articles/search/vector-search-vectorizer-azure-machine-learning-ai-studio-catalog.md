---
title: Azure AI Studio model catalog vectorizer
titleSuffix: Azure AI Search
description: Connects to a deployed model from the Azure AI Studio model catalog at query time.
author: careyjmac
ms.author: chalton
ms.service: cognitive-search
ms.custom:
  - build-2024
ms.topic: reference
ms.date: 05/28/2024
---

#	Azure AI Studio model catalog vectorizer

> [!IMPORTANT] 
> This feature is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [2024-05-01-Preview REST API](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2024-05-01-Preview&preserve-view=true) supports this feature.

The **Azure AI Studio model catalog** vectorizer connects to an embedding model that was deployed via [the Azure AI Studio model catalog](../ai-studio/how-to/model-catalog.md) to an Azure Machine Learning endpoint. Your data is processed in the [Geo](https://azure.microsoft.com/explore/global-infrastructure/data-residency/) where your model is deployed. 

## Vectorizer parameters

Parameters are case-sensitive. Which parameters you choose to use depends on what [authentication your AML online endpoint requires, if any](#WhatParametersToUse).

| Parameter name | Description |
|--------------------|-------------|
| `uri` | (Required) The [URI of the AML online endpoint](../machine-learning/how-to-authenticate-online-endpoint.md) to which the _JSON_ payload is sent. Only the **https** URI scheme is allowed. |
| `modelName` | (Required) The model ID from the AI Studio model catalog that is deployed at the provided endpoint. Currently supported values are <ul><li>OpenAI-CLIP-Image-Text-Embeddings-vit-base-patch32 </li><li>OpenAI-CLIP-Image-Text-Embeddings-ViT-Large-Patch14-336 </li><li>Facebook-DinoV2-Image-Embeddings-ViT-Base </li><li>Facebook-DinoV2-Image-Embeddings-ViT-Giant </li><li>Cohere-embed-v3-english </li><li>Cohere-embed-v3-multilingual</ul> |
| `key` | (Required for [key authentication](#WhatParametersToUse)) The [key for the AML online endpoint](../machine-learning/how-to-authenticate-online-endpoint.md). |
| `resourceId` | (Required for [token authentication](#WhatParametersToUse)). The Azure Resource Manager resource ID of the AML online endpoint. It should be in the format subscriptions/{guid}/resourceGroups/{resource-group-name}/Microsoft.MachineLearningServices/workspaces/{workspace-name}/onlineendpoints/{endpoint_name}. |
| `region` | (Optional for [token authentication](#WhatParametersToUse)). The [region](https://azure.microsoft.com/global-infrastructure/regions/) the AML online endpoint is deployed in. Needed if the region is different from the region of the search service. |
| `timeout` | (Optional) When specified, indicates the timeout for the http client making the API call. It must be formatted as an XSD "dayTimeDuration" value (a restricted subset of an [ISO 8601 duration](https://www.w3.org/TR/xmlschema11-2/#dayTimeDuration) value). For example, `PT60S` for 60 seconds. If not set, a default value of 30 seconds is chosen. The timeout can be set to a maximum of 230 seconds and a minimum of 1 second. |

<a name="WhatParametersToUse"></a>

## What authentication parameters to use

Which authentication parameters are required depends on what authentication your AML online endpoint uses, if any. AML online endpoints provide two authentication options:

* [Key-Based Authentication](../machine-learning/how-to-authenticate-online-endpoint.md). A static key is provided to authenticate scoring requests from the vectorizer.
  * Use the _uri_ and _key_ parameters
* [Token-Based Authentication](../machine-learning/how-to-authenticate-online-endpoint.md). The AML online endpoint is [deployed using token based authentication](../machine-learning/how-to-authenticate-online-endpoint.md). The Azure AI Search service's [managed identity](../active-directory/managed-identities-azure-resources/overview.md) must be enabled. The vectorizer then uses the service's managed identity to authenticate against the AML online endpoint, with no static keys required. The identity must be assigned owner or contributor role.
  * Use the _resourceId_ parameter.
  * If the search service is in a different region from the AML workspace, use the _region_ parameter to set the region the AML online endpoint was deployed in

## Supported vector query types

Which vector query types are supported by the AI Studio model catalog vectorizer depends on the `modelName` that is configured.

| `modelName` | Supports `text` query | Supports `imageUrl` query | Supports `imageBinary` query |
|--------------------|-------------|-------------|-------------|
| OpenAI-CLIP-Image-Text-Embeddings-vit-base-patch32 | X | X | X |
| OpenAI-CLIP-Image-Text-Embeddings-ViT-Large-Patch14-336 | X | X | X |
| Facebook-DinoV2-Image-Embeddings-ViT-Base |  | X | X |
| Facebook-DinoV2-Image-Embeddings-ViT-Giant |  | X | X |
| Cohere-embed-v3-english | X |  |  |
| Cohere-embed-v3-multilingual | X |  |  |

## Expected field dimensions

The expected field dimensions for a field configured with an AI Studio model catalog vectorizer depend on the `modelName` that is configured.

| `modelName` | Expected dimensions |
|--------------------|-------------|
| OpenAI-CLIP-Image-Text-Embeddings-vit-base-patch32 | 512 |
| OpenAI-CLIP-Image-Text-Embeddings-ViT-Large-Patch14-336 | 768 |
| Facebook-DinoV2-Image-Embeddings-ViT-Base | 768 |
| Facebook-DinoV2-Image-Embeddings-ViT-Giant | 1536 |
| Cohere-embed-v3-english | 1024 |
| Cohere-embed-v3-multilingual | 1024 |

## Sample definition

```json
"vectorizers": [
    {
        "name": "my-ai-studio-catalog-vectorizer",
        "kind": "aml",
        "amlParameters": {
            "uri": "https://my-aml-endpoint.eastus.inference.ml.azure.com/score",
            "key": "0000000000000000000000000000000000000",
            "timeout": "PT60S",
            "modelName": "OpenAI-CLIP-Image-Text-Embeddings-vit-base-patch3",
            "resourceId": null,
            "region": null,
        },
    }
]
```

## See also

+ [Integrated vectorization](vector-search-integrated-vectorization.md)
+ [Integrated vectorization with models from Azure AI Studio](vector-search-integrated-vectorization-ai-studio.md)
+ [How to configure a vectorizer in a search index](vector-search-how-to-configure-vectorizer.md)
+ [Azure Machine Learning skill](cognitive-search-aml-skill.md)
+ [Azure AI Studio model catalog](../ai-studio/how-to/model-catalog.md)