---
title: Language detection cognitive search skill (Azure Search) | Microsoft Docs
description: Evaluates unstructured text, and for each record, returns a language identifier with a score indicating the strength of the analysis in an Azure Search enrichment pipeline.
services: search
manager: pablocas
author: luiscabrer


ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: conceptual
ms.date: 05/01/2018
ms.author: luisca
---
#	Language detection cognitive skill

For up to 120 languages, the **Language Detection** skill detects the language of input text and reports a single language code for every document submitted on the request. The language code is paired with a score indicating the strength of the analysis.

This capability is especially useful when you need to provide the language of the text as input to other skills (for example, the [Sentiment Analysis skill](cognitive-search-skill-sentiment.md) or [Text Split skill](cognitive-search-skill-textsplit.md)).

> [!NOTE]
> Cognitive Search is in public preview. Skillset execution, and image extraction and normalization are currently offered for free. At a later time, the pricing for these capabilities will be announced. 

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
    "@odata.type": "#Microsoft.Skills.Text.LanguageDetectionSkill ",
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
