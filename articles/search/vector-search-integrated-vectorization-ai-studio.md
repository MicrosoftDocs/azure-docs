---
title: Integrated vectorization with models from Azure AI Studio
titleSuffix: Azure AI Search
description: Learn  how to vectorize content during indexing on Azure AI Search with an AI Studio model.
author: careyjmac
ms.author: chalton
ms.service: cognitive-search
ms.custom:
  - build-2024
ms.topic: how-to
ms.date: 05/08/2024
---

# How to implement integrated vectorization using models from Azure AI Studio

> [!IMPORTANT] 
> This feature is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [2024-05-01-Preview REST API](/rest/api/searchservice/skillsets/create-or-update?view=rest-searchservice-2024-05-01-preview&preserve-view=true) supports this feature.

In this article, learn how to access the embedding models in the [Azure AI Studio model catalog](../ai-studio/how-to/model-catalog.md) for vector conversions during indexing and in queries in Azure AI Search.

The workflow includes model deployment steps. The model catalog includes embedding models from Azure OpenAI, Cohere, Facebook, and OpenAI. Deploying a model is billable per the billing structure of each provider. 

After the model is deployed, you can use it for [integrated vectorization](vector-search-integrated-vectorization.md) during indexing, or with the [AI Studio vectorizer](vector-search-vectorizer-azure-machine-learning-ai-studio-catalog.md) for queries.

## Deploy an embedding model from the Azure AI Studio model catalog

1. Open the [Azure AI Studio model catalog](https://ai.azure.com/explore/models). 

1. Apply a filter to show just the embedding models. Under **Inference tasks**, select **Embeddings**:

   :::image type="content" source="media\vector-search-integrated-vectorization-ai-studio\ai-studio-catalog-embeddings-filter.png" lightbox="media\vector-search-integrated-vectorization-ai-studio\ai-studio-catalog-embeddings-filter.png" alt-text="Screenshot of the Azure AI Studio model catalog page highlighting how to filter by embeddings models.":::

1. Select the model you would like to vectorize your content with. Then select **Deploy** and pick a deployment option.

   :::image type="content" source="media\vector-search-integrated-vectorization-ai-studio\ai-studio-deploy-endpoint.png" lightbox="media\vector-search-integrated-vectorization-ai-studio\ai-studio-deploy-endpoint.png" alt-text="Screenshot of deploying an endpoint via the Azure AI Studio model catalog.":::

1. Fill in the requested details. Select or [create a new AI project](/azure/ai-studio/how-to/create-projects), and then select **Deploy**. The deployment details vary depending on which model you select. 

1. Wait for the model to finish deploying by monitoring the **Provisioning State**. It should change from "Provisioning" to "Updating" to "Succeeded". You might need to select **Refresh** every few minutes to see the status update.

1. Copy the URL, Primary key, and Model ID fields and set them aside for later. You need these values for the vectorizer definition in a search index, and for the skillset that calls the model endpoints during indexing.

    Optionally, you can change your endpoint to use **Token authentication** instead of **Key authentication**. If you enable token authentication, you only need to copy the URL and Model ID, and also make a note of which region the model is deployed to.

    :::image type="content" source="media\vector-search-integrated-vectorization-ai-studio\ai-studio-fields-to-copy.png" lightbox="media\vector-search-integrated-vectorization-ai-studio\ai-studio-fields-to-copy.png" alt-text="Screenshot of a deployed endpoint in AI Studio highlighting the fields to copy and save for later.":::

1. You can now configure a search index and indexer to use the deployed model. 

   + To use the model during indexing, see [steps to enable integrated vectorization](vector-search-integrated-vectorization.md#how-to-use-integrated-vectorization). Be sure to use the [Azure Machine Learning (AML) skill](cognitive-search-aml-skill.md), and not the [AzureOpenAIEmbedding skill](cognitive-search-skill-azure-openai-embedding.md). The next section describes the skill configuration.

   + To use the model as a vectorizer at query time, see [Configure a vectorizer](vector-search-how-to-configure-vectorizer.md). Be sure to use the [Azure AI Studio model catalog vectorizer](vector-search-vectorizer-azure-machine-learning-ai-studio-catalog.md) for this step.

## Sample AML skill payloads

When you deploy embedding models from the [Azure AI Studio model catalog](https://ai.azure.com/explore/models) you connect to them using the [AML skill](cognitive-search-aml-skill.md) in Azure AI Search for indexing workloads.

This section describes the AML skill definition and index mappings. It includes sample payloads that are already configured to work with their corresponding deployed endpoints. For more technical details on how these payloads work, read about the [Skill context and input annotation language](cognitive-search-skill-annotation-language.md).

### [**Text Input for "Inference" API**](#tab/inference-text)

This AML skill payload works with the following models from AI Studio:

+ OpenAI-CLIP-Image-Text-Embeddings-vit-base-patch32
+ OpenAI-CLIP-Image-Text-Embeddings-ViT-Large-Patch14-336

It assumes that you're chunking your content using the [Text Split skill](cognitive-search-skill-textsplit.md) and that the text to be vectorized is in the `/document/pages/*` path. If your text comes from a different path, update all references to the `/document/pages/*` path accordingly.

The URI and key are generated when you deploy the model from the catalog. For more information about these values, see [How to deploy large language models with Azure AI Studio](/azure/ai-studio/how-to/deploy-models-open).

```json
{
  "@odata.type": "#Microsoft.Skills.Custom.AmlSkill",
  "context": "/document/pages/*",
  "uri": "{YOUR_MODEL_URL_HERE}",
  "key": "{YOUR_MODEL_KEY_HERE}",
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

This AML skill payload works with the following models from AI Studio:

+ OpenAI-CLIP-Image-Text-Embeddings-vit-base-patch32
+ OpenAI-CLIP-Image-Text-Embeddings-ViT-Large-Patch14-336
+ Facebook-DinoV2-Image-Embeddings-ViT-Base
+ Facebook-DinoV2-Image-Embeddings-ViT-Giant

It assumes that your images come from the `/document/normalized_images/*` path that is created by enabling [built in image extraction](cognitive-search-concept-image-scenarios.md). If your images come from a different path or are stored as URLs, update all references to the `/document/normalized_images/*` path according.

The URI and key are generated when you deploy the model from the catalog. For more information about these values, see [How to deploy large language models with Azure AI Studio](/azure/ai-studio/how-to/deploy-models-open).

```json
{
  "@odata.type": "#Microsoft.Skills.Custom.AmlSkill",
  "context": "/document/normalized_images/*",
  "uri": "{YOUR_MODEL_URL_HERE}",
  "key": "{YOUR_MODEL_HERE}",
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

This AML skill payload works with the following models from AI Studio:

+ Cohere-embed-v3-english
+ Cohere-embed-v3-multilingual

It assumes that you're chunking your content using the SplitSkill and therefore your text to be vectorized is in the `/document/pages/*` path. If your text comes from a different path, update all references to the `/document/pages/*` path according.

You must add the `/v1/embed` path onto the end of the URL that you copied from your AI Studio deployment. You might also change the values for the `input_type`, `truncate` and `embedding_types` inputs to better fit your use case. For more information on the available options, review the [Cohere Embed API reference](../ai-studio/how-to/deploy-models-cohere-embed.md).

The URI and key are generated when you deploy the model from the catalog. For more information about these values, see [How to deploy Cohere Embed models with Azure AI Studio](/azure/ai-studio/how-to/deploy-models-cohere-embed).

```json
{
  "@odata.type": "#Microsoft.Skills.Custom.AmlSkill",
  "context": "/document/pages/*",
  "uri": "{YOUR_MODEL_URL_HERE}/v1/embed",
  "key": "{YOUR_MODEL_KEY_HERE}",
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

In addition, the output of the Cohere model isn't the embeddings array directly, but rather a JSON object that contains it. You need to select it appropriately when mapping it to the index definition via `indexProjections` or `outputFieldMappings`. Here's a sample `indexProjections` payload that would allow you to do implement this mapping. 

If you selected a different `embedding_types` in your skill definition that you have to change `float` in the `source` path to the appropriate type that you did select instead.

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

---

## Sample AI Studio vectorizer payload

The [AI Studio vectorizer](vector-search-vectorizer-azure-machine-learning-ai-studio-catalog.md), unlike the AML skill, is tailored to work only with those embedding models that are deployable via the AI Studio model catalog. The main difference is that you don't have to worry about the request and response payload, but you do have to provide the `modelName`, which corresponds to the "Model ID" that you copied after deploying the model in AI Studio. 

Here's a sample payload of how you would configure the vectorizer on your index definition given the properties copied from AI Studio.

For Cohere models, you should NOT add the `/v1/embed` path to the end of your URL like you did with the skill.

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

## Connect using token authentication

If you can't use key-based authentication, you can instead configure the AML skill and AI Studio vectorizer connection for [token authentication](../machine-learning/how-to-authenticate-online-endpoint.md) via role-based access control on Azure. The search service must have a [system or user-assigned managed identity](search-howto-managed-identities-data-sources.md), and the identity must have Owner or Contributor permissions for your AML project workspace. You can then remove the key field from your skill and vectorizer definition, replacing it with the resourceId field. If your AML project and search service are in different regions, also provide the region field.

```json
"uri": "{YOUR_URL_HERE}",
"resourceId": "subscriptions/{YOUR_SUBSCRIPTION_ID_HERE/resourceGroups/{YOUR_RESOURCE_GROUP_NAME_HERE}/providers/Microsoft.MachineLearningServices/workspaces/{YOUR_AML_WORKSPACE_NAME_HERE}/onlineendpoints/{YOUR_AML_ENDPOINT_NAME_HERE}",
"region": "westus", // Only need if AML project lives in different region from search service
```

## Next steps

+ [Configure a vectorizer in a search index](vector-search-how-to-configure-vectorizer.md)
+ [Configure index projections in a skillset](index-projections-concept-intro.md)
+ [AML skill](cognitive-search-aml-skill.md)
+ [Azure AI Studio vectorizer](vector-search-vectorizer-azure-machine-learning-ai-studio-catalog.md)
+ [Skill context and input annotation language](cognitive-search-skill-annotation-language.md)
