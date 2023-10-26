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
> This feature is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [2023-10-01-Preview REST API](/rest/api/searchservice/2023-10-01-preview/skillsets/create-or-update) supports this feature.

The **Azure OpenAI Embedding** skill connects to a deployed embedding model on your Azure OpenAI resource to generate embeddings.

> [!NOTE]
> This skill is bound to Azure OpenAI and is charged at the existing [Azure OpenAI pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/#pricing).
>

## @odata.type  

Microsoft.Skills.Text.AzureOpenAIEmbeddingSkill

## Data limits

The maximum size of a record should be 50,000 characters as measured by [`String.Length`](/dotnet/api/system.string.length). If you need to break up your data before sending it to the key phrase extractor, consider using the [Text Split skill](cognitive-search-skill-textsplit.md). If you do use a text split skill, set the page length to 5000 for the best performance.

## Skill parameters

Parameters are case-sensitive.

| Inputs | Description |
|---------------------|-------------|
| `defaultLanguageCode` | (Optional) The language code to apply to documents that don't specify language explicitly.  If the default language code is not specified,  English (en) will be used as the default language code. <br/> See the [full list of supported languages](../ai-services/language-service/key-phrase-extraction/language-support.md). |
| `maxKeyPhraseCount`   | (Optional) The maximum number of key phrases to produce. |
| `modelVersion`   | (Optional) Specifies the [version of the model](../ai-services/language-service/concepts/model-lifecycle.md) to use when calling the key phrase API. It will default to the latest available when not specified. We recommend you do not specify this value unless it's necessary.  |

## Skill inputs

| Input	 | Description |
|--------------------|-------------|
| `text` | The text to be analyzed.|
| `languageCode`	|  A string indicating the language of the records. If this parameter is not specified, the default language code will be used to analyze the records. <br/>See the [full list of supported languages](../ai-services/language-service/key-phrase-extraction/language-support.md). |

## Skill outputs

| Output	 | Description |
|--------------------|-------------|
| `keyPhrases` | A list of key phrases extracted from the input text. The key phrases are returned in order of importance. |

## Sample definition

Consider a SQL record that has the following fields:

```json
{
    "content": "Glaciers are huge rivers of ice that ooze their way over land, powered by gravity and their own sheer weight. They accumulate ice from snowfall and lose it through melting. As global temperatures have risen, many of the world’s glaciers have already started to shrink and retreat. Continued warming could see many iconic landscapes – from the Canadian Rockies to the Mount Everest region of the Himalayas – lose almost all their glaciers by the end of the century.",
    "language": "en"
}
```

Then your skill definition may look like this:

```json
 {
    "@odata.type": "#Microsoft.Skills.Text.KeyPhraseExtractionSkill",
    "inputs": [
      {
        "name": "text",
        "source": "/document/content"
      },
      {
        "name": "languageCode",
        "source": "/document/language" 
      }
    ],
    "outputs": [
      {
        "name": "keyPhrases",
        "targetName": "myKeyPhrases"
      }
    ]
  }
```

## Sample output

For the example above, the output of your skill will be written to a new node in the enriched tree called "document/myKeyPhrases" since that is the `targetName` that we specified. If you don’t specify a `targetName`, then it would be "document/keyPhrases".

#### document/myKeyPhrases 

```json
[
  "world’s glaciers", 
  "huge rivers of ice", 
  "Canadian Rockies", 
  "iconic landscapes",
  "Mount Everest region",
  "Continued warming"
]
```

You may use "document/myKeyPhrases" as input into other skills, or as a source of an [output field mapping](cognitive-search-output-field-mapping.md).

## Warnings

If you provide an unsupported language code, a warning is generated and key phrases are not extracted.

If your text is empty, a warning will be produced.

If your text is larger than 50,000 characters, only the first 50,000 characters will be analyzed and a warning will be issued.

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [How to define output fields mappings](cognitive-search-output-field-mapping.md)
