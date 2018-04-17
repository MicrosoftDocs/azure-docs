---
title: Microsoft.Skills.Text.LanguageDetection cognitive search skill (Azure Search) | Microsoft Docs
description: Evaluates unstructured text, and for each record, returns a language identifier with a score indicating the strength of the analysis in an Azure Search augmentation pipeline.
manager: pablocas
author: luiscabrer
ms.service: search
ms.devlang: NA
ms.topic: reference
ms.date: 05/01/2018
ms.author: luisca
---
#	Microsoft.Skills.Text.LanguageDetection cognitive skill

For up to 120 languages, detect which language the input text is written in and report a single language code for every document submitted on the request. The language code is paired with a score indicating the strength of the analysis.

This capability is especially useful when you need to provide the language of the text as input to other skills (for example, the [sentiment analysis skill](cognitive-search-skill-sentiment.md) or [pagination skill](cognitive-search-skill-pagination.md)).

## @odata.type  
Microsoft.Skills.Text.LanguageDetectionSkill 

## Data Limits
The maximum size of a record should be 5000 characters as measured by String.Length. If you need to break up your data before sending it to the sentiment analyzer, you may use the [pagination skill](cognitive-search-skill-pagination.md).

## Skill Parameters

Parameters are case-sensitive.

| Inputs	 | Description |
|--------------------|-------------|
| text | The text to be analyzed.|


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

##	Sample Input

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


##	Sample Output

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