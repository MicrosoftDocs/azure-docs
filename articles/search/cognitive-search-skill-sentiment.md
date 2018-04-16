---
title: Microsoft.Skills.Text.Sentiment cognitive search skill (Azure Search) | Microsoft Docs
description: Extract sentiment from text in an Azure Search augmentation pipeline.
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

#	Microsoft.Skills.Text.Sentiment cognitive skill

The sentiment skill evaluates unstructured text, and for each record, returns a numeric score between 0 and 1. Scores close to 1 indicate positive sentiment, and scores close to 0 indicate negative sentiment.

## @odata.type  
Microsoft.Skills.Text.SentimentSkill

## Data Limits
The maximum size of a record should be 5000 characters as measured by String.Length. If you need to break up your data before sending it to the sentiment analyzer, you may use the Pagination Skill.


## Skill Parameters

Parameters are case-sensitive.

| Inputs	 | Description |
|--------------------|-------------|
| text | The text to be analyzed.|
| languageCode	|  A string indicating the language of the records. If this parameter is not specified, the default value is "en". <br/><br/>[Full list of supported languages](https://docs.microsoft.com/azure/cognitive-services/text-analytics/text-analytics-supported-languages)|

##	Sample definition

```json
 {
    "@odata.type": "#Microsoft.Skills.Text.SentimentSkill",
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
        "name": "score",
        "targetName": "mySentiment"
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
             "text": "I had a terrible time at the hotel. The staff was rude and the food was awful.",
             "languageCode": "en"
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
            "score": 0.01 
           }
      }
    ]
}
```

## Notes

If empty, sentiment score is not returned for those records.


## Error cases
If a language is not supported, an error is generated and no sentiment score is returned.

## See also

+ [Predefined skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)