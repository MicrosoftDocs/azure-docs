---
title: Integrated vectorization with models from Azure AI Studio
titleSuffix: Azure AI Search
description: Add a data chunking and embedding step that references an AI Studio model in an Azure AI Search skillset to vectorize content during indexing.
author: careyjmac
ms.author: chalton
ms.service: cognitive-search
ms.custom:
  - build-2024
ms.topic: conceptual
ms.date: 04/25/2024
---

# Integrated vectorization with models from Azure AI Studio

> [!IMPORTANT] 
> This feature is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [2024-05-01-Preview REST API](/rest/api/searchservice/skillsets/create-or-update?view=rest-searchservice-2024-05-01-preview&preserve-view=true) supports this feature.

There are lots of options on embeddings models to consider when choosing how to vectorize your data. Within [the Azure AI Studio model catalog](../ai-studio/how-to/model-catalog.md) exists many possible embedding models. These models are deployable to an Azure Machine Learning project, which then allows [integrated vectorization](vector-search-integrated-vectorization.md) to be performed with them via the built-in [AmlSkill](cognitive-search-aml-skill.md) as well as [the AI Studio vectorizer](vector-search-vectorizer-aml-ai-studio-catalog.md). This guide will walk you through how to seemlessly index embeddings using one of these models within Azure AI Search.

## How to deploy an embedding model from the Azure AI Studio model catalog

1. Start by navigating to [the Azure AI Studio model catalog](https://ai.azure.com/explore/models). On this page, under "Inference tasks" on the right hand side, select "Embeddings":

   :::image type="content" source="media\vector-search-integrated-vectorization-ai-studio\ai-studio-catalog-embeddings-filter.png" lightbox="media\vector-search-integrated-vectorization-ai-studio\ai-studio-catalog-embeddings-filter.png" alt-text="Screenshot of the Azure AI Studio model catalog page highlighting how to filter by embeddings models":::

1. Select the model you would like to vectorize your content with from the list. Then select “Deploy” and pick one of the available deployment options.

   :::image type="content" source="media\vector-search-integrated-vectorization-ai-studio\ai-studio-deploy-endpoint.png" lightbox="media\vector-search-integrated-vectorization-ai-studio\ai-studio-deploy-endpoint.png" alt-text="Screenshot of deploying an endpoint via the Azure AI Studio model catalog.":::

1. In the pane that pops up, fill in the requested details for the model you have chosen. You may need to select "Create a new AI project" and do that first if you don't already have one. Then select "Deploy".

1. Wait for the model to finish deploying by monitoring the “Provisioning State”. It should change from “Provisioning” to “Updating” to “Succeeded”. You may need to select “Refresh” every few minutes to see the status update.

1. Copy the "URL", "Primary key" and "Model ID" fields and set them aside for later.
    1. (Optional) You can change your endpoint to use Token authentication instead of Key authentication. If you do this, you will only need to copy the "URL" and "Model ID" and also make a note of which region the model was deployed to.

    :::image type="content" source="media\vector-search-integrated-vectorization-ai-studio\ai-studio-fields-to-copy.png" lightbox="media\vector-search-integrated-vectorization-ai-studio\ai-studio-fields-to-copy.png" alt-text="Screenshot of the a deployed endpoint in AI Studio highlighting the fields to copy and save for later":::

1. Navigate back to your Azure AI Search resource. At this point, you should follow [the steps to enable integrated vectorization](vector-search-integrated-vectorization.md#how-to-use-integrated-vectorization) via creating a datasource, skillset, index and indexer definition. 

## Sample AMLSkill payloads

The [AmlSkill](cognitive-search-aml-skill.md) is designed to work with any Azure Machine Learning endpoint, not just those that generate embeddings. Because of that, you must configure your skill definition and index mappings to be aware of the expected request and response payloads of the endpoint you are calling. Below are some sample payloads depending on model type that you may have chosen from AI Studio that are already configured to work with their corresponding deployed endpoints. For more details on how these payloads work, read about the [Skill context and input annotation language](cognitive-search-skill-annotation-language.md).

### [**Text Input for "Inference" API**](#tab/inference-text)

This AMLSkill payload works with the following models from AI Studio:

+ OpenAI-CLIP-Image-Text-Embeddings-vit-base-patch32
+ OpenAI-CLIP-Image-Text-Embeddings-ViT-Large-Patch14-336

It assumes that you are chunking your content using the SplitSkill and therefore your text to be vectorized is in the `/document/pages/*` path. If your text comes from a different path, update all references to the `/document/pages/*` path according.

```json
{
  "@odata.type": "#Microsoft.Skills.Custom.AmlSkill",
  "context": "/document/pages/*",
  "uri": "{YOUR_URL_HERE}",
  "key": "{YOUR_PRIMARY_KEY_HERE}",
  "inputs": [
    {
      "name": "input_data",
      "sourceContext": "/document/pages/*",
      "inputs": [
        {
          "name": "columns",
          "source": "=['image', 'text']"
        },
        {
          "name": "index",
          "source": "=[0]"
        },
        {
          "name": "data",
          "source": "=[['', $(/document/pages/*)]]"
        }
      ]
    }
  ],
  "outputs": [
    {
      "name": "text_features"
    }
  ]
}
```

### [**Image Input for "Inference" API**](#tab/inference-image)

This AMLSkill payload works with the following models from AI Studio:

+ OpenAI-CLIP-Image-Text-Embeddings-vit-base-patch32
+ OpenAI-CLIP-Image-Text-Embeddings-ViT-Large-Patch14-336
+ Facebook-DinoV2-Image-Embeddings-ViT-Base
+ Facebook-DinoV2-Image-Embeddings-ViT-Giant

It assumes that your images come from the `/document/normalized_images/*` path that is created by enabling [built in image extraction](cognitive-search-concept-image-scenarios.md). If your images come from a different path or are stored as URLs, update all references to the `/document/normalized_images/*` path according.

```json
{
  "@odata.type": "#Microsoft.Skills.Custom.AmlSkill",
  "context": "/document/normalized_images/*",
  "uri": "{YOUR_URL_HERE}",
  "key": "{YOUR_PRIMARY_KEY_HERE}",
  "inputs": [
    {
      "name": "input_data",
      "sourceContext": "/document/normalized_images/*",
      "inputs": [
        {
          "name": "columns",
          "source": "=['image', 'text']"
        },
        {
          "name": "index",
          "source": "=[0]"
        },
        {
          "name": "data",
          "source": "=[[$(/document/normalized_images/*/data), '']]"
        }
      ]
    }
  ],
  "outputs": [
    {
      "name": "image_features"
    }
  ]
}
```

### [**Cohere**](#tab/cohere)

This AMLSkill payload works with the following models from AI Studio:

+ Cohere-embed-v3-english
+ Cohere-embed-v3-multilingual

It assumes that you are chunking your content using the SplitSkill and therefore your text to be vectorized is in the `/document/pages/*` path. If your text comes from a different path, update all references to the `/document/pages/*` path according.

Note that you must add the `/v1/embed` path onto the end of the URL that you copied from your AI Studio deployment. You may also change the values for the `input_type`, `truncate` and `embedding_types` inputs to better fit your use case. For more information on the available options, review the [Cohere Embed API reference](../ai-studio/how-to/deploy-models-cohere-embed#v1embed).

```json
{
  "@odata.type": "#Microsoft.Skills.Custom.AmlSkill",
  "context": "/document/pages/*",
  "uri": "{YOUR_URL_HERE}/v1/embed",
  "key": "{YOUR_PRIMARY_KEY_HERE}",
  "inputs": [
    {
      "name": "texts",
      "source": "=[$(/document/pages/*)]"
    },
    {
      "name": "input_type",
      "source": "='search_document'"
    },
    {
      "name": "truncate",
      "source": "='NONE'"
    },
    {
      "name": "embedding_types",
      "source": "=['float']"
    }
  ],
  "outputs": [
    {
      "name": "embeddings",
      "targetName": "aml_vector_data"
    }
  ]
}
```

In addition, the output of the Cohere model is not the embeddings array directly, but rather a JSON object that contains it. You will need to select it appropriately when mapping it to the index definition via `indexProjections` or `outputFieldMappings`. Here is a sample `indexProjections` payload that would allow you to do this. 

Note that if you selected a different `embedding_types` in your skill definition that you will have to change `float` in the `source` path to the appropriate type that you did select instead.

```json
"indexProjections": {
  "selectors": [
    {
      "targetIndexName": "{YOUR_TARGET_INDEX_NAME_HERE}",
      "parentKeyFieldName": "ParentKey", // Change this to the name of the field in your index definition where the parent key will be stored
      "sourceContext": "/document/pages/*",
      "mappings": [
        {
          "name": "aml_vector", // Change this to the name of the field in your index definition where the Cohere embedding will be stored
          "source": "/document/pages/*/aml_vector_data/float/0"
        }
      ]
    }
  ],
  "parameters": {}
}
```

## Sample AI Studio vectorizer payload

The [AI Studio vectorizer](vector-search-vectorizer-aml-ai-studio-catalog.md), unlike the AMLSkill, is tailored to work only with those embedding models that are deployable via the AI Studio model catalog. The main difference is that you do not have to worry about the request and response payload, but you do have to provide the `modelName`, which corresponds to the "Model ID" that you copied after deploying the model in AI Studio. Here is a sample payload of how you would configure the vectorizer on your index definition given the properties copied from AI Studio.

Note that for Cohere models, you should NOT add the `/v1/embed` path to the end of your URL like you did with the skill.

```json
"vectorizers": [
    {
        "name": "{YOUR_VECTORIZER_NAME_HERE}",
        "kind": "aml",
        "amlParameters": {
            "uri": "{YOUR_URL_HERE}",
            "key": "{YOUR_PRIMARY_KEY_HERE}",
            "modelName": "{YOUR_MODEL_ID_HERE}"
        },
    }
]
```

## Changes to for token authentication

If your security needs require that you not use key based authentication, you can use token authentication for both the AMLSkill as well as the AI Studio vectorizer. To do so, the search service's [managed identity](search-howto-managed-identities-data-sources.md) must be enabled, and its identity must be assigned owner or contributor role for your AML project workspace. You would then remove the `key` field from your skill and vectorizer definition and replace it with the `resourceId` field. If your AML project lives in a different region from your search service, you will also need to provide the `region` field.

```json
"uri": "{YOUR_URL_HERE}",
"resourceId": "subscriptions/{YOUR_SUBSCRIPTION_ID_HERE/resourceGroups/{YOUR_RESOURCE_GROUP_NAME_HERE}/providers/Microsoft.MachineLearningServices/workspaces/{YOUR_AML_WORKSPACE_NAME_HERE}/onlineendpoints/{YOUR_AML_ENDPOINT_NAME_HERE}",
"region": "westus", // Only need if AML project lives in different region from search service
```

## Next steps

+ [Configure a vectorizer in a search index](vector-search-how-to-configure-vectorizer.md)
+ [Configure index projections in a skillset](index-projections-concept-intro.md)
+ [AML skill](cognitive-search-aml-skill.md)
+ [AI Studio vectorizer](vector-search-vectorizer-aml-ai-studio-catalog.md)
+ [Skill context and input annotation language](cognitive-search-skill-annotation-language.md)
