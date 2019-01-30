---
title: Key phrase extraction cognitive search skill - Azure Search
description: Evaluates unstructured text, and for each record, returns a list of key phrases in an Azure Search enrichment pipeline.
services: search
manager: pablocas
author: luiscabrer

ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: conceptual
ms.date: 01/17/2019
ms.author: luisca
ms.custom: seodec2018
---
#	Key Phrase Extraction cognitive skill

The **Key Phrase Extraction** skill evaluates unstructured text, and for each record, returns a list of key phrases. This skill uses the machine learning models provided by [Text Analytics](https://docs.microsoft.com/azure/cognitive-services/text-analytics/overview) in Cognitive Services.

This capability is useful if you need to quickly identify the main talking points in the record. For example, given input text "The food was delicious and there were wonderful staff", the service returns "food" and "wonderful staff".

> [!NOTE]
> Starting December 21, 2018, you can [attach a Cognitive Services resource](cognitive-search-attach-cognitive-services.md) with an Azure Search skillset. This allows us to start charging for skillset execution. On this date, we also began charging for image extraction as part of the document-cracking stage. Text extraction from documents continues to be offered at no additional cost.
>
> [Built-in cognitive skill](cognitive-search-predefined-skills.md) execution is charged at the [Cognitive Services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services), at the same rate as if you had performed the task directly. Image extraction is an Azure Search charge, currently offered at preview pricing. For details, see the [Azure Search pricing page](https://go.microsoft.com/fwlink/?linkid=2042400) or [How billing works](search-sku-tier.md#how-billing-works).

## @odata.type  
Microsoft.Skills.Text.KeyPhraseExtractionSkill 

## Data limits
The maximum size of a record should be 50,000 characters as measured by `String.Length`. If you need to break up your data before sending it to the key phrase extractor, consider using the [Text Split skill](cognitive-search-skill-textsplit.md).

## Skill parameters

Parameters are case-sensitive.
| Inputs	            | Description |
|---------------------|-------------|
| defaultLanguageCode | (Optional) The language code to apply to documents that don't specify language explicitly.  If the default language code is not specified,  English (en) will be used as the default language code. <br/> See [Full list of supported languages](https://docs.microsoft.com/azure/cognitive-services/text-analytics/text-analytics-supported-languages). |
| maxKeyPhraseCount   | (Optional) The maximum number of key phrases to produce. |

## Skill inputs
| Inputs	 | Description |
|--------------------|-------------|
| text | The text to be analyzed.|
| languageCode	|  A string indicating the language of the records. If this parameter is not specified, the default language code will be used to analyze the records. <br/>See [Full list of supported languages](https://docs.microsoft.com/azure/cognitive-services/text-analytics/text-analytics-supported-languages)|

##	Sample definition

```json
 {
    "@odata.type": "#Microsoft.Skills.Text.KeyPhraseExtractionSkill",
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

##	Sample input

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


##	Sample output

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


## Errors and warnings
If you provide an unsupported language code, an error is generated and key phrases are not extracted.
If your text is empty, a warning will be produced.
If your text is larger than 50,000 characters, only the first 50,000 characters will be analyzed and a warning will be issued.

## See also

+ [Predefined skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)