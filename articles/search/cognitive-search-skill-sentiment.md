---
title: Sentiment cognitive search skill - Azure Search
description: Extract a positive-negative sentiment score from text in an Azure Search enrichment pipeline.
services: search
manager: pablocas
author: luiscabrer
ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.date: 05/02/2019
ms.author: luisca
ms.custom: seodec2018
---

#	Sentiment cognitive skill

The **Sentiment** skill evaluates unstructured text along a positive-negative continuum, and for each record, returns a numeric score between 0 and 1. Scores close to 1 indicate positive sentiment, and scores close to 0 indicate negative sentiment. This skill uses the machine learning models provided by [Text Analytics](https://docs.microsoft.com/azure/cognitive-services/text-analytics/overview) in Cognitive Services.

> [!NOTE]
> As you expand scope by increasing the frequency of processing, adding more documents, or adding more AI algorithms, you will need to [attach a billable Cognitive Services resource](cognitive-search-attach-cognitive-services.md). Charges accrue when calling APIs in Cognitive Services, and for image extraction as part of the document-cracking stage in Azure Search. There are no charges for text extraction from documents.
>
> Execution of built-in skills is charged at the existing [Cognitive Services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/). Image extraction pricing is described on the [Azure Search pricing page](https://go.microsoft.com/fwlink/?linkid=2042400).


## @odata.type  
Microsoft.Skills.Text.SentimentSkill

## Data limits
The maximum size of a record should be 5000 characters as measured by `String.Length`. If you need to break up your data before sending it to the sentiment analyzer, use the [Text Split skill](cognitive-search-skill-textsplit.md).


## Skill parameters

Parameters are case-sensitive.

| Parameter Name |                      |
|----------------|----------------------|
| defaultLanguageCode | (optional) The language code to apply to documents that don't specify language explicitly. <br/> See [Full list of supported languages](../cognitive-services/text-analytics/text-analytics-supported-languages.md) |

## Skill inputs 

| Input	Name | Description |
|--------------------|-------------|
| text | The text to be analyzed.|
| languageCode	|  (Optional) A string indicating the language of the records. If this parameter is not specified, the default value is "en". <br/>See [Full list of supported languages](../cognitive-services/text-analytics/text-analytics-supported-languages.md).|

## Skill outputs

| Output	Name | Description |
|--------------------|-------------|
| score | A value between 0 and 1 that represents the sentiment of the analyzed text. Values close to 0 have negative sentiment, close to 0.5 have neutral sentiment, and values close to 1 have positive sentiment.|


##	Sample definition

```json
{
    "@odata.type": "#Microsoft.Skills.Text.SentimentSkill",
    "inputs": [
        {
            "name": "text",
            "source": "/document/content"
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

##	Sample input

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


##	Sample output

```json
{
    "values": [
        {
            "recordId": "1",
            "data": {
                "score": 0.01
            }
        }
    ]
}
```

## Notes
If empty, a sentiment score is not returned for those records.

## Error cases
If a language is not supported, an error is generated and no sentiment score is returned.

## See also

+ [Predefined skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
