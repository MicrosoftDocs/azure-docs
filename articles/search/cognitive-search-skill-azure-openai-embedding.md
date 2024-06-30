---
title: Azure OpenAI Embedding skill
titleSuffix: Azure AI Search
description: Connects to a deployed model on your Azure OpenAI resource.
author: dharun1995
ms.author: dhanasekars
ms.service: cognitive-search
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: reference
ms.date: 05/28/2024
---

#	Azure OpenAI Embedding skill

> [!IMPORTANT] 
> This feature is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [2023-10-01-preview REST API](/rest/api/searchservice/skillsets/create-or-update?view=rest-searchservice-2023-10-01-preview&preserve-view=true) supports the first iteration of this feature. The [2024-05-01-preview REST API](/rest/api/searchservice/skillsets/create-or-update?view=rest-searchservice-2024-05-01-preview&preserve-view=true) adds more properties and supports more text embedding models on Azure OpenAI.

The **Azure OpenAI Embedding** skill connects to a deployed embedding model on your [Azure OpenAI](/azure/ai-services/openai/overview) resource to generate embeddings during indexing. Your data is processed in the [Geo](https://azure.microsoft.com/explore/global-infrastructure/data-residency/) where your model is deployed. 

The [Import and vectorize data wizard](search-get-started-portal-import-vectors.md) in the Azure portal uses the **Azure OpenAI Embedding** skill to vectorize content. You can run the wizard and review the generated skillset to see how the wizard builds the skill for the text-embedding-ada-002 model. 

> [!NOTE]
> This skill is bound to Azure OpenAI and is charged at the existing [Azure OpenAI pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/#pricing).
>

## @odata.type  

Microsoft.Skills.Text.AzureOpenAIEmbeddingSkill

## Data limits

The maximum size of a text input should be 8,000 tokens. If input exceeds the maximum allowed, the model throws an invalid request error. For more information, see the [tokens](/azure/ai-services/openai/overview#tokens) key concept in the Azure OpenAI documentation. Consider using the [Text Split skill](cognitive-search-skill-textsplit.md) if you need data chunking.

## Skill parameters

Parameters are case-sensitive.

| Inputs | Description |
|---------------------|-------------|
| `resourceUri` | The URI of a model provider, such as an Azure OpenAI resource or an OpenAI URL.  |
| `apiKey`   |  The secret key used to access the model. If you provide a key, leave `authIdentity` empty. If you set both the `apiKey` and `authIdentity`, the `apiKey` is used on the connection. |
| `deploymentId`   | The name of the deployed Azure OpenAI embedding model. The model should be an embedding model, such as text-embedding-ada-002. See the [List of Azure OpenAI models](/azure/ai-services/openai/concepts/models) for supported models.|
| `authIdentity`   | A user-managed identity used by the search service for connecting to Azure OpenAI. You can use either a [system or user managed identity](search-howto-managed-identities-data-sources.md). To use a system manged identity, leave `apiKey` and `authIdentity` blank. The system-managed identity is used automatically. A managed identity must have [Cognitive Services OpenAI User](/azure/ai-services/openai/how-to/role-based-access-control#azure-openai-roles) permissions to send text to Azure OpenAI. |
| `modelName` | This property is required if your skillset is created using the 2024-05-01-preview REST API. Set this property to the deployment name of an Azure OpenAI embedding model deployed on the provider specified through `resourceUri` and identified through `deploymentId`. Currently, the supported values are `text-embedding-ada-002`, `text-embedding-3-large`, and `text-embedding-3-small`.  |
| `dimensions` | (Optional, introduced in the 2024-05-01-preview REST API). The dimensions of embeddings that you would like to generate if the model supports reducing the embedding dimensions. Supported ranges are listed below. Defaults to the maximum dimensions for each model if not specified. For skillsets created using the 2023-10-01-preview, dimensions are fixed at 1536. |

## Supported dimensions by `modelName`

The supported dimensions for an Azure OpenAI Embedding skill depend on the `modelName` that is configured.

| `modelName` | Minimum dimensions | Maximum dimensions |
|--------------------|-------------|-------------|
| text-embedding-ada-002 | 1536 | 1536 |
| text-embedding-3-large | 1 | 3072 |
| text-embedding-3-small | 1 | 1536 |

## Skill inputs

| Input	 | Description |
|--------------------|-------------|
| `text` | The input text to be vectorized. If you're using data chunking, the source might be `/document/pages/*`. |

## Skill outputs

| Output	 | Description |
|--------------------|-------------|
| `embedding` | Vectorized embedding for the input text. |

## Sample definition

Consider a record that has the following fields:

```json
{
    "content": "Microsoft released Windows 10."
}
```

Then your skill definition might look like this:

```json
{
  "@odata.type": "#Microsoft.Skills.Text.AzureOpenAIEmbeddingSkill",
  "description": "Connects a deployed embedding model.",
  "resourceUri": "https://my-demo-openai-eastus.openai.azure.com/",
  "deploymentId": "my-text-embedding-ada-002-model",
  "modelName": "text-embedding-ada-002",
  "dimensions": 1536,
  "inputs": [
    {
      "name": "text",
      "source": "/document/content"
    }
  ],
  "outputs": [
    {
      "name": "embedding"
    }
  ]
}
```

## Sample output

For the given input text, a vectorized embedding output is produced.

```json
{
  "embedding": [
        0.018990106880664825,
        -0.0073809814639389515,
        .... 
        0.021276434883475304,
      ]
}
```

The output resides in memory. To send this output to a field in the search index, you must define an [outputFieldMapping](cognitive-search-output-field-mapping.md) that maps the vectorized embedding output (which is an array) to a [vector field](vector-search-how-to-create-index.md). Assuming the skill output resides in the document's **embedding** node, and **content_vector** is the field in the search index, the outputFieldMapping in indexer should look like:

```json
  "outputFieldMappings": [
    {
      "sourceFieldName": "/document/embedding/*",
      "targetFieldName": "content_vector"
    }
  ]
```

## Best practices

The following are some best practices you need to consider when utilizing this skill:

- If you are hitting your Azure OpenAI TPM (Tokens per minute) limit, consider the [quota limits advisory](../ai-services/openai/quotas-limits.md) so you can address accordingly. Refer to the [Azure OpenAI monitoring](../ai-services/openai/how-to/monitoring.md) documentation for more information about your Azure OpenAI instance performance.

-	The Azure OpenAI embeddings model deployment you use for this skill should be ideally separate from the deployment used for other use cases, including the [query vectorizer](vector-search-how-to-configure-vectorizer.md). This helps each deployment to be tailored to its specific use case, leading to optimized performance and identifying traffic from the indexer and the index embedding calls easily.

- Your Azure OpenAI instance should be in the same region or at least geographically close to the region where your AI Search service is hosted. This reduces latency and improves the speed of data transfer between the services.

-	If you have a larger than default Azure OpenAI TPM (Tokens per minute) limit as published in [quotas and limits](../ai-services/openai/quotas-limits.md) documentation, open a [support case](../azure-portal/supportability/how-to-create-azure-support-request.md) with the Azure AI Search team, so this can be adjusted accordingly. This helps your indexing process not being unnecessarily slowed down by the documented default TPM limit, if you have higher limits.

- For examples and working code samples using this skill, see the following links:

  - [Integrated vectorization (Python)](https://github.com/Azure/azure-search-vector-samples/blob/main/demo-python/code/integrated-vectorization/readme.md)
  - [Integrated vectorization (C#)](https://github.com/Azure/azure-search-vector-samples/blob/main/demo-dotnet/DotNetIntegratedVectorizationDemo/readme.md)
  - [Integrated vectorization (Java)](https://github.com/Azure/azure-search-vector-samples/blob/main/demo-java/demo-integrated-vectorization/readme.md)

## Errors and warnings

| Condition | Result |
|-----------|--------|
| Null or invalid URI | Error |
| Null or invalid deploymentID | Error |
| Text is empty | Warning |
| Text is larger than 8,000 tokens | Error |

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [How to define output fields mappings](cognitive-search-output-field-mapping.md)
