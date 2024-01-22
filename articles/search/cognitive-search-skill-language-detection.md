---
title: Language detection cognitive skill
titleSuffix: Azure AI Search
description: Evaluates unstructured text, and for each record, returns a language identifier with a score indicating the strength of the analysis in an AI enrichment pipeline in Azure AI Search.
author: gmndrg
ms.author: gimondra
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: reference
ms.date: 12/09/2021
---

#	Language detection cognitive skill

The **Language Detection** skill detects the language of input text and reports a single language code for every document submitted on the request. The language code is paired with a score indicating the strength of the analysis. This skill uses the machine learning models provided in [Azure AI Language](../ai-services/language-service/overview.md).

This capability is especially useful when you need to provide the language of the text as input to other skills (for example, the [Sentiment Analysis skill](cognitive-search-skill-sentiment-v3.md) or [Text Split skill](cognitive-search-skill-textsplit.md)).

See [supported languages](../ai-services/language-service/language-detection/language-support.md) for Language Detection. If you have content expressed in an unsupported language, the response is `(Unknown)`.

> [!NOTE]
> This skill is bound to Azure AI services and requires [a billable resource](cognitive-search-attach-cognitive-services.md) for transactions that exceed 20 documents per indexer per day. Execution of built-in skills is charged at the existing [Azure AI services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/).
>

## @odata.type  
Microsoft.Skills.Text.LanguageDetectionSkill

## Data limits
The maximum size of a record should be 50,000 characters as measured by [`String.Length`](/dotnet/api/system.string.length). If you need to break up your data before sending it to the language detection skill, you can use the [Text Split skill](cognitive-search-skill-textsplit.md).

## Skill parameters

Parameters are case-sensitive.

| Inputs | Description |
|---------------------|-------------|
| `defaultCountryHint` | (Optional) An ISO 3166-1 alpha-2 two letter country code can be provided to use as a hint to the language detection model if it can't [disambiguate the language](../ai-services/language-service/language-detection/how-to/call-api.md#ambiguous-content). Specifically, the `defaultCountryHint` parameter is used with documents that don't specify the `countryHint` input explicitly.  |
| `modelVersion`   | (Optional) Specifies the [version of the model](../ai-services/language-service/concepts/model-lifecycle.md) to use when calling language detection. It defaults to the latest available when not specified. We recommend you don't specify this value unless it's necessary. |

## Skill inputs

Parameters are case-sensitive.

| Inputs	 | Description |
|--------------------|-------------|
| `text` | The text to be analyzed.|
| `countryHint` | An ISO 3166-1 alpha-2 two letter country code to use as a hint to the language detection model if it can't [disambiguate the language](../ai-services/language-service/language-detection/how-to/call-api.md#ambiguous-content). |

## Skill outputs

| Output Name	 | Description |
|--------------------|-------------|
| `languageCode` | The ISO 6391 language code for the language identified. For example, "en". |
| `languageName` | The name of language. For example, "English". |
| `score` | A value between 0 and 1. The likelihood that language is correctly identified. The score can be lower than 1 if the sentence has mixed languages.  |

## Sample definition

```json
 {
    "@odata.type": "#Microsoft.Skills.Text.LanguageDetectionSkill",
    "inputs": [
      {
        "name": "text",
        "source": "/document/text"
      },
      {
        "name": "countryHint",
        "source": "/document/countryHint"
      }
    ],
    "outputs": [
      {
        "name": "languageCode",
        "targetName": "myLanguageCode"
      },
      {
        "name": "languageName",
        "targetName": "myLanguageName"
      },
      {
        "name": "score",
        "targetName": "myLanguageScore"
      }

    ]
  }
```

## Sample input

```json
{
    "values": [
      {
        "recordId": "1",
        "data":
           {
             "text": "Glaciers are huge rivers of ice that ooze their way over land, powered by gravity and their own sheer weight. "
           }
      },
      {
        "recordId": "2",
        "data":
           {
             "text": "Estamos muy felices de estar con ustedes."
           }
      },
      {
        "recordId": "3",
        "data":
           {
             "text": "impossible",
             "countryHint": "fr"
           }
      }
    ]
```

## Sample output

```json
{
    "values": [
      {
        "recordId": "1",
        "data":
            {
              "languageCode": "en",
              "languageName": "English",
              "score": 1,
            }
      },
      {
        "recordId": "2",
        "data":
            {
              "languageCode": "es",
              "languageName": "Spanish",
              "score": 1,
            }
      },
      {
        "recordId": "3",
        "data":
            {
              "languageCode": "fr",
              "languageName": "French",
              "score": 1,
            }
      }
    ]
}
```

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
