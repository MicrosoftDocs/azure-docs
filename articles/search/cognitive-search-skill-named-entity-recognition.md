---
title: Microsoft.Skills.Text.NamedEntityRecognition cognitive search skill (Azure Search) | Microsoft Docs
description: Extract named entities for person, location and organization from text in an Azure Search augmentation pipeline.
services: search
manager: pablocas
author: luiscabrer

ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: article
ms.date: 05/01/2018
ms.author: luisca
---

#	Microsoft.Skills.Text.NamedEntityRecognition cognitive skill

The **NamedEntityRecognition** skill extracts named entities from text. Available entities include the following types: person, location, and organization.

## @odata.type  
Microsoft.Skills.Text.NamedEntityRecognitionSkill

## Skill Parameters

Parameters are case-sensitive.

| Parameter name	 | Description |
|--------------------|-------------|
| categories	| Array of categories that should be extracted.  Possible category types: "Person", "Location", "Organization". If no category is provided, all types are returned.|
|defaultLanguageCode |	Language code of the input text. The following languages are supported: ar, cs, da, de, en, es, fi, fr, he, hu, it, ko, pt-br, pt|
| minimumPrecision	| A number between 0 and 1. If the precision is lower than this value, the entity is not returned. The default is 0.|

## Inputs

| Input name	  | Description                   |
|---------------|-------------------------------|
| languageCode	| Optional. Default is "en".    |
| text          | The text to analyze.          |

##	Sample definition

```json
  {
    "@odata.type": "#Microsoft.Skills.Text.NamedEntityRecognitionSkill",
    "categories": [ "Person"],
    "defaultLanguageCode": "en",
    "inputs": [
      {
        "name": "text",
        "source": "/document/content"
      }
    ],
    "outputs": [
      {
        "name": "persons",
        "targetName": "people"
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
             "text": "This is a the loan application for Joe Romero, he is a Microsoft employee who was born in Chile and then moved to Australia… Ana Smith is provided as a reference.",
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
      "data" : 
      {
        "persons": [ "Joe Romero", "Ana Smith"],
        "locations": ["Seattle"],
        "organizations":["Microsoft Corporation"],
        "entities":  
        [
          {
            "category":"person",
            "value": "Joe Romero",
            "offset": 45,
            "confidence": 0.87
          },
          {
            "category":"person",
            "value": "Ana Smith",
            "offset": 59,
            "confidence": 0.87
          },
          {
            "category":"location",
            "value": "Seattle",
            "offset": 5,
            "confidence": 0.99
          },
          {
            "category":"organization",
            "value": "Microsoft Corporation",
            "offset": 120,
            "confidence": 0.99
          }
        ]
      }
    }
  ]
}
```


## Error cases
If the provided language code is not supported or if the content does not match the language specified, an error is generated and no entities are extracted.

## See also

+ [Predefined skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)