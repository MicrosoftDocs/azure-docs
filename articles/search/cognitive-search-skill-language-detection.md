---
title: Language detection cognitive search skill - Azure Search
description: Evaluates unstructured text, and for each record, returns a language identifier with a score indicating the strength of the analysis in an Azure Search enrichment pipeline.
services: search
manager: pablocas
author: luiscabrer

ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: luisca
ms.custom: seodec2018
---
#	Language detection cognitive skill

The **Language Detection** skill detects the language of input text and reports a single language code for every document submitted on the request. The language code is paired with a score indicating the strength of the analysis. This skill uses the machine learning models provided by [Text Analytics](https://docs.microsoft.com/azure/cognitive-services/text-analytics/overview) in Cognitive Services.

This capability is especially useful when you need to provide the language of the text as input to other skills (for example, the [Sentiment Analysis skill](cognitive-search-skill-sentiment.md) or [Text Split skill](cognitive-search-skill-textsplit.md)).

Language detection leverages Bing's natural language processing libraries, which exceeds the number of [supported languages and regions](https://docs.microsoft.com/azure/cognitive-services/text-analytics/language-support) listed for Text Analytics. The exact list of languages is not published, but includes all widely-spoken languages, plus variants, dialects, and some regional and cultural languages. If you have content expressed in a less frequently used language, you can [try the Language Detection API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c7) to see if it returns a code. The response for languages that cannot be detected is `unknown`.

> [!NOTE]
> Starting December 21, 2018, you can [attach a Cognitive Services resource](cognitive-search-attach-cognitive-services.md) with an Azure Search skillset. This allows us to start charging for skillset execution. On this date, we also began charging for image extraction as part of the document-cracking stage. Text extraction from documents continues to be offered at no additional cost.
>
> [Built-in cognitive skill](cognitive-search-predefined-skills.md) execution is charged at the [Cognitive Services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services), at the same rate as if you had performed the task directly. Image extraction is an Azure Search charge, currently offered at preview pricing. For details, see the [Azure Search pricing page](https://go.microsoft.com/fwlink/?linkid=2042400) or [How billing works](search-sku-tier.md#how-billing-works).

## @odata.type  
Microsoft.Skills.Text.LanguageDetectionSkill

## Data limits
The maximum size of a record should be 50,000 characters as measured by `String.Length`. If you need to break up your data before sending it to the sentiment analyzer, you may use the [Text Split skill](cognitive-search-skill-textsplit.md).

## Skill inputs

Parameters are case-sensitive.

| Inputs	 | Description |
|--------------------|-------------|
| text | The text to be analyzed.|

## Skill outputs

| Output Name	 | Description |
|--------------------|-------------|
| languageCode | The ISO 6391 language code for the language identified. For example, "en". |
| languageName | The name of language. For example "English". |
| score | A value between 0 and 1. The likelihood that language is correctly identified. The score may be lower than 1 if the sentence has mixed languages.  |

##	Sample definition

```json
 {
    "@odata.type": "#Microsoft.Skills.Text.LanguageDetectionSkill",
    "inputs": [
      {
        "name": "text",
        "source": "/document/text"
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
      }
    ]
}
```


## Error cases
If text is expressed in an unsupported language, an error is generated and no language identifier is returned.

## See also

+ [Predefined skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
