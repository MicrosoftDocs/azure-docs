---
title: Entity Linking cognitive skill
titleSuffix: Azure Cognitive Search
description: Extract different linked entities from text in an enrichment pipeline in Azure Cognitive Search.

manager: jenmar
author: ayokande
ms.author: aakande
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 05/19/2021
---

#    Entity Linking cognitive skill

The **Entity Linking** skill extracts linked entities of different types from text. This skill uses the machine learning models provided by [Text Analytics](../cognitive-services/text-analytics/overview.md) in Cognitive Services.

## @odata.type  
Microsoft.Skills.Text.V3.EntityLinkingSkill

## Data limits
The maximum size of a record should be 50,000 characters as measured by [`String.Length`](/dotnet/api/system.string.length). If you need to break up your data before sending it to the key phrase extractor, consider using the [Text Split skill](cognitive-search-skill-textsplit.md).

## Skill parameters

Parameters are case-sensitive and are all optional.

| Parameter name     | Description |
|--------------------|-------------|
| `defaultLanguageCode` |    Language code of the input text. The following languages are supported: `ar, cs, da, de, en, es, fi, fr, hu, it, ja, ko, nl, no, pl, pt-BR, pt-PT, ru, sv, tr, zh-hans`. Not all entity categories are supported for all languages; see note below.|
| `minimumPrecision` | A value between 0 and 1. If the confidence score (in the `entities` output) is lower than this value, the entity is not returned. The default is 0. |
| `modelVersion` | A string representation of the API Version of choice. Set to "latest" in order to utilize the most recent API version. Otherwise, a specific available API version could be chosen. |


## Skill inputs

| Input name      | Description                   |
|---------------|-------------------------------|
| `languageCode`    | Optional. Default is `"en"`.  |
| `text`          | The text to analyze.          |

## Skill outputs


| Output name      | Description                   |
|---------------|-------------------------------|
| `entities` | An array of complex types that contains the following fields: <ul><li>name (The actual entity name as it appears in the text)</li> <li>id </li> <li>language (The language of the text as determined by the skill)</li> <li>url (The linked url to this entity)</li> <li>bingId (The bingId for this linked entity)</li> <li>dataSource (The data source associated with the url) </li> <li>matches (An array of complex types that contains: `text`, `offset`, `length` and `confidenceScore`)</li></ul>|


##    Sample definition

```json
  {
    "@odata.type": "#Microsoft.Skills.Text.V3.EntityLinkingSkill",
    "name": "customer defined name",
    "description": "customer defined description",
    "context": "/document",
    "defaultLanguageCode": "en", 
    "minimumPrecision": 0.5, 
    "modelVersion": "latest", 
    "inputs": [
        {
            "name": "text", 
            "source": "/document/content"
        },
        {
            "name": "languageCode", 
            "source": "/document/language"
        }
    ],
    "outputs": [
        {
            "name": "entities", 
            "targetName": "entities" 
        }
    ]
}
```
##    Sample input

```json
{
    "values": [
      {
        "recordId": "1",
        "data":
           {
             "text": "Microsoft is liked by many.",
             "languageCode": "en"
           }
      }
    ]
}
```

##    Sample output

```json
{
  "values": [
    {
      "recordId": "1",
      "data" : 
      {
        "entities": [
          {
            "name": "Microsoft", 
            "id": "Microsoft",
            "language": "en", 
            "url": "https://en.wikipedia.org/wiki/Microsoft", 
            "bingId": "a093e9b9-90f5-a3d5-c4b8-5855e1b01f85", 
            "dataSource": "Wikipedia", 
            "matches": [
                {
                    "text": "Microsoft", 
                    "offset": 0, 
                    "length": 9, 
                    "confidenceScore": 0.13 
                }
            ]
          }
        ],
      }
    }
  ]
}
```

Note that the offsets returned for entities in the output of this skill are directly returned from the [Text Analytics API](../cognitive-services/text-analytics/overview.md), which means if you are using them to index into the original string, you should use the [StringInfo](/dotnet/api/system.globalization.stringinfo) class in .NET in order to extract the correct content.  [More details can be found here.](../cognitive-services/text-analytics/concepts/text-offsets.md)

## Warning cases
If the language code for the document is unsupported, a warning is returned and no entities are extracted.

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)