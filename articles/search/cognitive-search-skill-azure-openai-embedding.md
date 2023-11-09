---
title: Azure OpenAI Embedding skill
titleSuffix: Azure AI Search
description: Connects to a deployed model on your Azure OpenAI resource.
author: dharun1995
ms.author: dhanasekars
ms.service: cognitive-search
ms.topic: reference
ms.date: 10/26/2023
---

#	Azure OpenAI Embedding skill

> [!IMPORTANT] 
> This feature is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [2023-10-01-Preview REST API](/rest/api/searchservice/skillsets/create-or-update?view=rest-searchservice-2023-10-01-preview&preserve-view=true) supports this feature.

The **Azure OpenAI Embedding** skill connects to a deployed embedding model on your [Azure OpenAI](/azure/ai-services/openai/overview) resource to generate embeddings.

> [!NOTE]
> This skill is bound to Azure OpenAI and is charged at the existing [Azure OpenAI pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/#pricing).
>

## @odata.type  

Microsoft.Skills.Text.AzureOpenAIEmbeddingSkill

## Data limits

The maximum size of a text input should be 8,000 tokens. If input exceeds the maximum allowed, the model throws an invalid request error. For more information, see the [tokens](/azure/ai-services/openai/overview#tokens) key concept in the Azure OpenAI documentation.

## Skill parameters

Parameters are case-sensitive.

| Inputs | Description |
|---------------------|-------------|
| `resourceUri` | The URI where a valid Azure OpenAI model is deployed. The model should be an embedding model, such as text-embedding-ada-002. See the [List of Azure OpenAI models](/azure/ai-services/openai/concepts/models) for supported models. |
| `apiKey`   |  The secret key pertaining to a valid Azure OpenAI `resourceUri.` If you provide a key, leave `authIdentity` empty. If you set both the `apiKey` and `authIdentity`, the `apiKey` is used on the connection. |
| `deploymentId`   | The name of the deployed Azure OpenAI embedding model.|
| `authIdentity`   | A user-managed identity used by the search service for connecting to Azure OpenAI. You can use either a [system or user managed identity](search-howto-managed-identities-data-sources.md). To use a system manged identity, leave `apiKey` and `authIdentity` blank. The system-managed identity is used automatically. A managed identity must have [Cognitive Services OpenAI User](/azure/ai-services/openai/how-to/role-based-access-control#azure-openai-roles) permissions to send text to Azure OpenAI. |

## Skill inputs

| Input	 | Description |
|--------------------|-------------|
| `text` | The input text to be vectorized.|

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

For the given input text, a vectorized embedding output is produced. The output resides in memory. To send this output to a field in the search index, [define an outputFieldMapping](cognitive-search-output-field-mapping.md).

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
