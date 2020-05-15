---
title: Language detection cognitive skill
titleSuffix: Azure Cognitive Search
description: Evaluates unstructured text, and for each record, returns a language identifier with a score indicating the strength of the analysis in an AI enrichment pipeline in Azure Cognitive Search.

manager: nitinme
author: luiscabrer
ms.author: luisca
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---
#	Language detection cognitive skill

The **Language Detection** skill detects the language of input text and reports a single language code for every document submitted on the request. The language code is paired with a score indicating the strength of the analysis. This skill uses the machine learning models provided by [Text Analytics](https://docs.microsoft.com/azure/cognitive-services/text-analytics/overview) in Cognitive Services.

This capability is especially useful when you need to provide the language of the text as input to other skills (for example, the [Sentiment Analysis skill](cognitive-search-skill-sentiment.md) or [Text Split skill](cognitive-search-skill-textsplit.md)).

Language detection leverages Bing's natural language processing libraries, which exceeds the number of [supported languages and regions](https://docs.microsoft.com/azure/cognitive-services/text-analytics/language-support) listed for Text Analytics. The exact list of languages is not published, but includes all widely-spoken languages, plus variants, dialects, and some regional and cultural languages. If you have content expressed in a less frequently used language, you can [try the Language Detection API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c7) to see if it returns a code. The response for languages that cannot be detected is `unknown`.

> [!NOTE]
> As you expand scope by increasing the frequency of processing, adding more documents, or adding more AI algorithms, you will need to [attach a billable Cognitive Services resource](cognitive-search-attach-cognitive-services.md). Charges accrue when calling APIs in Cognitive Services, and for image extraction as part of the document-cracking stage in Azure Cognitive Search. There are no charges for text extraction from documents.
>
> Execution of built-in skills is charged at the existing [Cognitive Services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/). Image extraction pricing is described on the [Azure Cognitive Search pricing page](https://go.microsoft.com/fwlink/?linkid=2042400).


## @odata.type  
Microsoft.Skills.Text.LanguageDetectionSkill

## Data limits
The maximum size of a record should be 50,000 characters as measured by [`String.Length`](https://docs.microsoft.com/dotnet/api/system.string.length). If you need to break up your data before sending it to the language detection skill, you may use the [Text Split skill](cognitive-search-skill-textsplit.md).

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

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
