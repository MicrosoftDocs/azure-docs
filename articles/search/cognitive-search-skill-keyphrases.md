---
title: Microsoft.Skills.Text.KeyPhrases cognitive search skill (Azure Search) | Microsoft Docs
description: Evaluates unstructured text, and for each record, returns a list of key phrases in an Azure Search augmentation pipeline.
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
#	KeyPhraseExtractionSkill cognitive search skill

The key phrase extraction skill evaluates unstructured text, and for each record, returns a list of key phrases.

This capability is useful if you need to quickly identify the main talking points in the record. For example, given input text "The food was delicious and there were wonderful staff", the service returns the main talking points: "food" and "wonderful staff".

## @odata.type  
Microsoft.Skills.Text.KeyPhraseExtractionSkill 

## Data Limits
The maximum size of a record should be 5000 characters as measured by String.Length. If you need to break up your data before sending it to the sentiment analyzer, you may use the Pagination Skill.

## Parameters
| Inputs	 | Description |
|--------------------|-------------|
| text | The text to be analyzed.|
| languageCode	|  A string indicating the language of the records. If this parameter is not specified, the default value is "en". <br/><br/>[Full list of supported languages](https://docs.microsoft.com/azure/cognitive-services/text-analytics/text-analytics-supported-languages)|

##	Sample definition

```json
 {
    "@odata.type": "#Microsoft.Skills.Text.KeyPhrases",
    "inputs": [
      {
        "name": "text",
        "source": "/document/text"
      },
      {
        "name": "languageCode",
        "source": "/document/languagecode" 
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

##	Sample Input

```json
{
    "values": [
      {
        "recordId": "1",
        "data":
           {
             "text": "Glaciers are huge rivers of ice that ooze their way over land, powered by gravity and their own sheer weight. They accumulate ice from snowfall and lose it through melting. As global temperatures have risen, many of the world’s glaciers have already started to shrink and retreat. Continued warming could see many iconic landscapes – from the Canadian Rockies to the Mount Everest region of the Himalayas – lose almost all their glaciers by the end of the century.",
             "language": "en"
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
            "keyPhrases": 
            [
              "world’s glaciers", 
              "huge rivers of ice", 
              "Canadian Rockies", 
              "iconic landscapes",
              "Mount Everest region",
              "Continued warming"
            ]
           }
      }
    ]
}
```


## Error cases
If a language code provided is not supported, then an error will be generated, and keyPhrases will not be extracted.