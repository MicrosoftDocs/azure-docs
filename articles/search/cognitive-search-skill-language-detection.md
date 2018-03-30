---
title: Microsoft.Skills.Text.LanguageDetection cognitive search skill (Azure Search) | Microsoft Docs
description: Evaluates unstructured text, and for each record, returns a language identifier with a score indicating the strength of the analysis in an Azure Search augmentation pipeline.
services: search
manager: pablocas
author: luiscabrer
documentationcenter: ''

ms.assetid: 
ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 05/01/2018
ms.author: luisca
---
#	Cognitive Skills: LanguageDetectionSkill

For up to 120 languages, detect which language the input text is written in and report a single language code for every document submitted on the request. The language code is paired with a score indicating the strength of the score.

This capability is specially useful when you need to provide the language of the text to other skills (like the sentiment analysis skill or the pagination skill).

## @odata.type  
Microsoft.Skills.Text.LanguageDetectionSkill 

## Data Limits
The maximum size of a record should be 5000 characters as measured by String.Length. If you need to break up your data before sending it to the sentiment analyzer, you may use the Pagination Skill.

## Parameters
| Inputs	 | Description |
|--------------------|-------------|
| text | The text to be analyzed.|


##	Sample definition

```json
 {
    "@odata.type": "#Microsoft.Skills.Text.KeyPhrases",
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
             "text": "本文件为英文"
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
              "languageCode": "zh_chs",
              "languageName": "Chinese_Simplified",
              "score": 1,
            }
      }
    ]
}
```


## Error cases
If a language provided is not supported, then an error will be generated, and keyPhrases will not be extracted.