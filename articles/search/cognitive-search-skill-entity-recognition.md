---
title: Entity Recognition cognitive search skill - Azure Search
description: Extract different types of entities from text in an Azure Search cognitive search pipeline.
services: search
manager: pablocas
author: luiscabrer

ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: luisca
ms.custom: seodec2018
---

#	 Entity Recognition cognitive skill

The **Entity Recognition** skill extracts entities of different types from text. This skill uses the machine learning models provided by [Text Analytics](https://docs.microsoft.com/azure/cognitive-services/text-analytics/overview) in Cognitive Services.

> [!NOTE]
> As you expand scope by increasing the frequency of processing, adding more documents, or adding more AI algorithms, you will need to [attach a billable Cognitive Services resource](cognitive-search-attach-cognitive-services.md). Charges accrue when calling APIs in Cognitive Services, and for image extraction as part of the document-cracking stage in Azure Search. There are no charges for text extraction from documents.
>
> Execution of built-in skills is charged at the existing [Cognitive Services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/). Image extraction pricing is described on the [Azure Search pricing page](https://go.microsoft.com/fwlink/?linkid=2042400).


## @odata.type  
Microsoft.Skills.Text.EntityRecognitionSkill

## Data limits
The maximum size of a record should be 50,000 characters as measured by `String.Length`. If you need to break up your data before sending it to the key phrase extractor, consider using the [Text Split skill](cognitive-search-skill-textsplit.md).

## Skill parameters

Parameters are case-sensitive and are all optional.

| Parameter name	 | Description |
|--------------------|-------------|
| categories	| Array of categories that should be extracted.  Possible category types: `"Person"`, `"Location"`, `"Organization"`, `"Quantity"`, `"Datetime"`, `"URL"`, `"Email"`. If no category is provided, all types are returned.|
|defaultLanguageCode |	Language code of the input text. The following languages are supported: `de, en, es, fr, it`|
|minimumPrecision | Unused. Reserved for future use. |
|includeTypelessEntities | When set to true if the text contains a well known entity, but cannot be categorized into one of the supported categories, it will be returned as part of the `"entities"` complex output field. 
These are entities that are well known but not classified as part of the current supported "categories". For instance "Windows 10" is a well known entity (a product), but "Products" are not in the categories supported today. Default is `false` |


## Skill inputs

| Input name	  | Description                   |
|---------------|-------------------------------|
| languageCode	| Optional. Default is `"en"`.  |
| text          | The text to analyze.          |

## Skill outputs

> [!NOTE]
> Not all entity categories are supported for all languages. Only _en_, _es_ support extraction of `"Quantity"`, `"Datetime"`, `"URL"`, `"Email"` types.

| Output name	  | Description                   |
|---------------|-------------------------------|
| persons	   | An array of strings where each string represents the name of a person. |
| locations  | An array of strings where each string represents a location. |
| organizations  | An array of strings where each string represents an organization. |
| quantities  | An array of strings where each string represents a quantity. |
| dateTimes  | An array of strings where each string represents a DateTime (as it appears in the text) value. |
| urls | An array of strings where each string represents a URL |
| emails | An array of strings where each string represents an email |
| namedEntities | An array of complex types that contains the following fields: <ul><li>category</li> <li>value (The actual entity name)</li><li>offset (The location where it was found in the text)</li><li>confidence (Unused for now. Will be set to a value of -1)</li></ul> |
| entities | An array of complex types that contains rich information about the entities extracted from text, with the following fields <ul><li> name (the actual entity name. This represents a "normalized" form)</li><li> wikipediaId</li><li>wikipediaLanguage</li><li>wikipediaUrl (a link to Wikipedia page for the entity)</li><li>bingId</li><li>type (the category of the entity recognized)</li><li>subType (available only for certain categories, this gives a more granular view of the entity type)</li><li> matches (a complex collection that contains)<ul><li>text (the raw text for the entity)</li><li>offset (the location where it was found)</li><li>length (the length of the raw entity text)</li></ul></li></ul> |

##	Sample definition

```json
  {
    "@odata.type": "#Microsoft.Skills.Text.EntityRecognitionSkill",
    "categories": [ "Person", "Email"],
    "defaultLanguageCode": "en",
    "includeTypelessEntities": true,
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
      },
      {
        "name": "emails",
        "targetName": "contact"
      },
      {
        "name": "entities"
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
             "text": "Contoso corporation was founded by John Smith. They can be reached at contact@contoso.com",
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
        "persons": [ "John Smith"],
        "emails":["contact@contoso.com"],
        "namedEntities": 
        [
          {
            "category":"Person",
            "value": "John Smith",
            "offset": 35,
            "confidence": -1
          }
        ],
        "entities":  
        [
          {
            "name":"John Smith",
            "wikipediaId": null,
            "wikipediaLanguage": null,
            "wikipediaUrl": null,
            "bingId": null,
            "type": "Person",
            "subType": null,
            "matches": [{
                "text": "John Smith",
                "offset": 35,
                "length": 10
            }]
          },
          {
            "name": "contact@contoso.com",
            "wikipediaId": null,
            "wikipediaLanguage": null,
            "wikipediaUrl": null,
            "bingId": null,
            "type": "Email",
            "subType": null,
            "matches": [
            {
                "text": "contact@contoso.com",
                "offset": 70,
                "length": 19
            }]
          },
          {
            "name": "Contoso",
            "wikipediaId": "Contoso",
            "wikipediaLanguage": "en",
            "wikipediaUrl": "https://en.wikipedia.org/wiki/Contoso",
            "bingId": "349f014e-7a37-e619-0374-787ebb288113",
            "type": null,
            "subType": null,
            "matches": [
            {
                "text": "Contoso",
                "offset": 0,
                "length": 7
            }]
          }
        ]
      }
    }
  ]
}
```


## Error cases
If the language code for the document is unsupported, an error is returned and no entities are extracted.

## See also

+ [Predefined skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
