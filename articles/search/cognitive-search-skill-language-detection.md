---
title: Language detection cognitive skill
titleSuffix: Azure Cognitive Search
description: Evaluates unstructured text, and for each record, returns a language identifier with a score indicating the strength of the analysis in an AI enrichment pipeline in Azure Cognitive Search.

author: LiamCavanagh
ms.author: liamca
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 08/12/2021
---

#	Language detection cognitive skill

The **Language Detection** skill detects the language of input text and reports a single language code for every document submitted on the request. The language code is paired with a score indicating the strength of the analysis. This skill uses the machine learning models provided by [Text Analytics](../cognitive-services/text-analytics/overview.md) in Cognitive Services.

This capability is especially useful when you need to provide the language of the text as input to other skills (for example, the [Sentiment Analysis skill](cognitive-search-skill-sentiment-v3.md) or [Text Split skill](cognitive-search-skill-textsplit.md)).

Language detection leverages Bing's natural language processing libraries, which exceeds the number of [supported languages and regions](../cognitive-services/text-analytics/language-support.md) listed for Text Analytics. The exact list of languages is not published, but includes all widely-spoken languages, plus variants, dialects, and some regional and cultural languages. If you have content expressed in a less frequently used language, you can [try the Language Detection API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0/operations/Languages) to see if it returns a code. The response for languages that cannot be detected is `(Unknown)`.

> [!NOTE]
> This skill is bound to Cognitive Services and requires [a billable resource](cognitive-search-attach-cognitive-services.md) for transactions that exceed 20 documents per indexer per day. Execution of built-in skills is charged at the existing [Cognitive Services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/).
>

## @odata.type  
Microsoft.Skills.Text.LanguageDetectionSkill

## Data limits
The maximum size of a record should be 50,000 characters as measured by [`String.Length`](/dotnet/api/system.string.length). If you need to break up your data before sending it to the language detection skill, you may use the [Text Split skill](cognitive-search-skill-textsplit.md).

## Skill parameters

Parameters are case-sensitive.

| Inputs | Description |
|---------------------|-------------|
| `defaultCountryHint` | (Optional) An ISO 3166-1 alpha-2 two letter country code can be provided to use as a hint to the language detection model if it cannot disambiguate the language. See [the Text Analytics documentation](../cognitive-services/text-analytics/how-tos/text-analytics-how-to-language-detection.md#ambiguous-content) on this topic for more details. Specifically, the `defaultCountryHint` parameter is used with documents that don't specify the `countryHint` input explicitly.  |
| `modelVersion`   | (Optional) The version of the model to use when calling the Text Analytics service. It will default to the latest available when not specified. We recommend you do not specify this value unless absolutely necessary. See [Model versioning in the Text Analytics API](../cognitive-services/text-analytics/concepts/model-versioning.md) for more details. |

## Skill inputs

Parameters are case-sensitive.

| Inputs	 | Description |
|--------------------|-------------|
| `text` | The text to be analyzed.|
| `countryHint` | An ISO 3166-1 alpha-2 two letter country code to use as a hint to the language detection model if it cannot disambiguate the language. See [the Text Analytics documentation](../cognitive-services/text-analytics/how-tos/text-analytics-how-to-language-detection.md#ambiguous-content) on this topic for more details. |

## Skill outputs

| Output Name	 | Description |
|--------------------|-------------|
| `languageCode` | The ISO 6391 language code for the language identified. For example, "en". |
| `languageName` | The name of language. For example "English". |
| `score` | A value between 0 and 1. The likelihood that language is correctly identified. The score may be lower than 1 if the sentence has mixed languages.  |

##	Sample definition

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

##	Sample input

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


##	Sample output

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