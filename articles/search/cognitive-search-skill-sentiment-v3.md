---
title: Sentiment cognitive skill (v3)
titleSuffix: Azure AI Search
description: Provides sentiment labels for text in an AI enrichment pipeline in Azure AI Search.

author: careyjmac
ms.author: chalton
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: reference
ms.date: 08/17/2022
---

# Sentiment cognitive skill (v3)

The **Sentiment** skill (v3) evaluates unstructured text and for each record, provides sentiment labels (such as "negative", "neutral" and "positive") based on the highest confidence score found by the service at a sentence and document-level. This skill uses the machine learning models provided by version 3 of [Language Service](../ai-services/language-service/overview.md) in Azure AI services. It also exposes [opinion mining capabilities](../ai-services/language-service/sentiment-opinion-mining/overview.md), which provides more granular information about the opinions related to attributes of products or services in text.

> [!NOTE]
> This skill is bound to Azure AI services and requires [a billable resource](cognitive-search-attach-cognitive-services.md) for transactions that exceed 20 documents per indexer per day. Execution of built-in skills is charged at the existing [Azure AI services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/).
>

## @odata.type  
Microsoft.Skills.Text.V3.SentimentSkill

## Data limits
The maximum size of a record should be 5000 characters as measured by [`String.Length`](/dotnet/api/system.string.length). If you need to break up your data before sending it to the sentiment skill, use the [Text Split skill](cognitive-search-skill-textsplit.md).

## Skill parameters

Parameters are case-sensitive.

| Parameter Name | Description |
|----------------|----------------------|
| `defaultLanguageCode` | (optional) The language code to apply to documents that don't specify language explicitly. <br/> See the [full list of supported languages](../ai-services/language-service/sentiment-opinion-mining/language-support.md). |
| `modelVersion`   | (optional) Specifies the [version of the model](../ai-services/language-service/concepts/model-lifecycle.md) to use when calling sentiment analysis. It will default to the most recent version when not specified. We recommend you do not specify this value unless it's necessary. |
| `includeOpinionMining` | If set to `true`, enables [the opinion mining feature](../ai-services/language-service/sentiment-opinion-mining/overview.md#opinion-mining), which allows aspect-based sentiment analysis to be included in your output results. Defaults to `false`. |

## Skill inputs 

| Input	Name | Description |
|--------------------|-------------|
| `text` | The text to be analyzed.|
| `languageCode`	|  (optional) A string indicating the language of the records. If this parameter is not specified, the default value is "en". <br/>See the [full list of supported languages](../ai-services/language-service/sentiment-opinion-mining/language-support.md).|

## Skill outputs

| Output	Name | Description |
|--------------------|-------------|
| `sentiment` | A string value that represents the sentiment label of the entire analyzed text (either positive, neutral or negative). |
| `confidenceScores` | A complex type with three double values, one for the positive rating, one for the neutral rating, and one for the negative rating. Values range from 0 to 1.00, where 1.00 represents the highest possible confidence in a given label assignment. |
| `sentences` | A collection of complex types that breaks down the sentiment of the text sentence by sentence. This is also where opinion mining results are returned in the form of targets and assessments if `includeOpinionMining` is set to `true`.|

## Sample definition

```json
{
    "@odata.type": "#Microsoft.Skills.Text.V3.SentimentSkill",
    "context": "/document",
    "includeOpinionMining": true,
    "inputs": [
        {
            "name": "text",
            "source": "/document/content"
        },
        {
            "name": "languageCode",
            "source": "/document/languageCode"
        }
    ],
    "outputs": [
        {
            "name": "sentiment",
            "targetName": "sentiment"
        },
        {
            "name": "confidenceScores",
            "targetName": "confidenceScores"
        },
        {
            "name": "sentences",
            "targetName": "sentences"
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
            "data": {
                "text": "I had a terrible time at the hotel. The staff was rude and the food was awful.",
                "languageCode": "en"
            }
        }
    ]
}
```

## Sample output

```json
{
    "values": [
        {
            "recordId": "1",
            "data": {
                "sentiment": "negative",
                "confidenceScores": {
                    "positive": 0.0,
                    "neutral": 0.0,
                    "negative": 1.0
                },
                "sentences": [
                    {
                        "text": "I had a terrible time at the hotel.",
                        "sentiment": "negative",
                        "confidenceScores": {
                            "positive": 0.0,
                            "neutral": 0.0,
                            "negative": 1.0
                        },
                        "offset": 0,
                        "length": 35,
                        "targets": [],
                        "assessments": [],
                    },
                    {
                        "text": "The staff was rude and the food was awful.",
                        "sentiment": "negative",
                        "confidenceScores": {
                            "positive": 0.0,
                            "neutral": 0.0,
                            "negative": 1.0
                        },
                        "offset":36,
                        "length": 42,
                        "targets": [
                            {
                                "text": "staff",
                                "sentiment": "negative",
                                "confidenceScores": {
                                    "positive": 0.0,
                                    "neutral": 0.0,
                                    "negative": 1.0
                                },
                                "offset": 40,
                                "length": 5,
                                "relations": [
                                    {
                                        "relationType": "assessment",
                                        "ref": "#/documents/0/sentences/1/assessments/0",
                                    }
                                ]
                            },
                            {
                                "text": "food",
                                "sentiment": "negative",
                                "confidenceScores": {
                                    "positive": 0.0,
                                    "neutral": 0.0,
                                    "negative": 1.0
                                },
                                "offset": 63,
                                "length": 4,
                                "relations": [
                                    {
                                        "relationType": "assessment",
                                        "ref": "#/documents/0/sentences/1/assessments/1",
                                    }
                                ]
                            }
                        ],
                        "assessments": [
                            {
                                "text": "rude",
                                "sentiment": "negative",
                                "confidenceScores": {
                                    "positive": 0.0,
                                    "neutral": 0.0,
                                    "negative": 1.0
                                },
                                "offset": 50,
                                "length": 4,
                                "isNegated": false
                            },
                            {
                                "text": "awful",
                                "sentiment": "negative",
                                "confidenceScores": {
                                    "positive": 0.0,
                                    "neutral": 0.0,
                                    "negative": 1.0
                                },
                                "offset": 72,
                                "length": 5,
                                "isNegated": false
                            }
                        ],
                    }
                ]
            }
        }
    ]
}
```

## Warning cases

If your text is empty, a warning is generated and no sentiment results are returned.
If a language is not supported, a warning is generated and no sentiment results are returned.

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
