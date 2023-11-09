---
title: Named Entity Recognition Azure AI Searchskill (v2)
titleSuffix: Azure AI Search
description: Extract named entities for person, location and organization from text in an AI enrichment pipeline in Azure AI Search.
author: LiamCavanagh
ms.author: liamca
ms.service: cognitive-search
ms.topic: reference
ms.date: 08/17/2022
---

#	Named Entity Recognition cognitive skill (v2)

The **Named Entity Recognition** skill (v2) extracts named entities from text. Available entities include the types `person`, `location` and `organization`.

> [!IMPORTANT]
> Named entity recognition skill (v2) (**Microsoft.Skills.Text.NamedEntityRecognitionSkill**) is now discontinued replaced by [Microsoft.Skills.Text.V3.EntityRecognitionSkill](cognitive-search-skill-entity-recognition-v3.md). Follow the recommendations in [Deprecated Azure AI Search skills](cognitive-search-skill-deprecated.md) to migrate to a supported skill.

 > [!NOTE]
> As you expand scope by increasing the frequency of processing, adding more documents, or adding more AI algorithms, you will need to [attach a billable Azure AI services resource](cognitive-search-attach-cognitive-services.md). Charges accrue when calling APIs in Azure AI services, and for image extraction as part of the document-cracking stage in Azure AI Search. There are no charges for text extraction from documents. Execution of built-in skills is charged at the existing [Azure AI services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/).
> 
> Image extraction is an extra charge metered by Azure AI Search, as described on the [pricing page](https://azure.microsoft.com/pricing/details/search/). Text extraction is free.
>


## @odata.type  
Microsoft.Skills.Text.NamedEntityRecognitionSkill

## Data limits
The maximum size of a record should be 50,000 characters as measured by [`String.Length`](/dotnet/api/system.string.length). If you need to break up your data before sending it to the key phrase extractor, consider using the [Text Split skill](cognitive-search-skill-textsplit.md). If you do use a text split skill, set the page length to 5000 for the best performance.

## Skill parameters

Parameters are case-sensitive.

| Parameter name	 | Description |
|--------------------|-------------|
| categories	| Array of categories that should be extracted.  Possible category types: `"Person"`, `"Location"`, `"Organization"`. If no category is provided, all types are returned.|
|defaultLanguageCode |	Language code of the input text. The following languages are supported: `de, en, es, fr, it`|
| minimumPrecision	| A number between 0 and 1. If the precision is lower than this value, the entity is not returned. The default is 0.|

## Skill inputs

| Input name	  | Description                   |
|---------------|-------------------------------|
| languageCode	| Optional. Default is `"en"`.  |
| text          | The text to analyze.          |

## Skill outputs

| Output name	  | Description                   |
|---------------|-------------------------------|
| persons	   | An array of strings where each string represents the name of a person. |
| locations  | An array of strings where each string represents a location. |
| organizations  | An array of strings where each string represents an organization. |
| entities | An array of complex types. Each complex type includes the following fields: <ul><li>category (`"person"`, `"organization"`, or `"location"`)</li> <li>value (the actual entity name)</li><li>offset (The location where it was found in the text)</li><li>confidence (A value between 0 and 1 that represents that confidence that the value is an actual entity)</li></ul> |

##	Sample definition

```json
  {
    "@odata.type": "#Microsoft.Skills.Text.NamedEntityRecognitionSkill",
    "categories": [ "Person", "Location", "Organization"],
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
##	Sample input

```json
{
    "values": [
      {
        "recordId": "1",
        "data":
           {
             "text": "This is the loan application for Joe Romero, a Microsoft employee who was born in Chile and who then moved to Australia… Ana Smith is provided as a reference.",
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
      "data" : 
      {
        "persons": [ "Joe Romero", "Ana Smith"],
        "locations": ["Chile", "Australia"],
        "organizations":["Microsoft"],
        "entities":  
        [
          {
            "category":"person",
            "value": "Joe Romero",
            "offset": 33,
            "confidence": 0.87
          },
          {
            "category":"person",
            "value": "Ana Smith",
            "offset": 124,
            "confidence": 0.87
          },
          {
            "category":"location",
            "value": "Chile",
            "offset": 88,
            "confidence": 0.99
          },
          {
            "category":"location",
            "value": "Australia",
            "offset": 112,
            "confidence": 0.99
          },
          {
            "category":"organization",
            "value": "Microsoft",
            "offset": 54,
            "confidence": 0.99
          }
        ]
      }
    }
  ]
}
```


## Warning cases
If the language code for the document is unsupported, a warning is returned and no entities are extracted.

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Entity Recognition Skill (V3)](cognitive-search-skill-entity-recognition-v3.md)
