---
title: Entity Recognition cognitive skill (v2)
titleSuffix: Azure AI Search
description: Extract different types of entities from text in an enrichment pipeline in Azure AI Search.
author: LiamCavanagh
ms.author: liamca
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: reference
ms.date: 08/17/2022
---

# Entity Recognition cognitive skill (v2)

The **Entity Recognition** skill (v2) extracts entities of different types from text. This skill uses the machine learning models provided by [Text Analytics](../ai-services/language-service/overview.md) in Azure AI services.

> [!IMPORTANT]
> The Entity Recognition skill (v2) (**Microsoft.Skills.Text.EntityRecognitionSkill**) is now discontinued replaced by [Microsoft.Skills.Text.V3.EntityRecognitionSkill](cognitive-search-skill-entity-recognition-v3.md). Follow the recommendations in [Deprecated skills](cognitive-search-skill-deprecated.md) to migrate to a supported skill.

> [!NOTE]
> As you expand scope by increasing the frequency of processing, adding more documents, or adding more AI algorithms, you will need to [attach a billable Azure AI services resource](cognitive-search-attach-cognitive-services.md). Charges accrue when calling APIs in Azure AI services, and for image extraction as part of the document-cracking stage in Azure AI Search. There are no charges for text extraction from documents.
>
> Execution of built-in skills is charged at the existing [Azure AI services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/). Image extraction pricing is described on the [Azure AI Search pricing page](https://azure.microsoft.com/pricing/details/search/).


## @odata.type  
Microsoft.Skills.Text.EntityRecognitionSkill

## Data limits
The maximum size of a record should be 50,000 characters as measured by [`String.Length`](/dotnet/api/system.string.length). If you need to break up your data before sending it to the key phrase extractor, consider using the [Text Split skill](cognitive-search-skill-textsplit.md). If you do use a text split skill, set the page length to 5000 for the best performance.

## Skill parameters

Parameters are case-sensitive and are all optional.

| Parameter name     | Description |
|--------------------|-------------|
| `categories`    | Array of categories that should be extracted.  Possible category types: `"Person"`, `"Location"`, `"Organization"`, `"Quantity"`, `"Datetime"`, `"URL"`, `"Email"`. If no category is provided, all types are returned.|
| `defaultLanguageCode` |    Language code of the input text. The following languages are supported: `ar, cs, da, de, en, es, fi, fr, hu, it, ja, ko, nl, no, pl, pt-BR, pt-PT, ru, sv, tr, zh-hans`. Not all entity categories are supported for all languages; see note below.|
| `minimumPrecision` | A value between 0 and 1. If the confidence score (in the `namedEntities` output) is lower than this value, the entity is not returned. The default is 0. |
| `includeTypelessEntities` | Set to `true` if you want to recognize well-known entities that don't fit the current categories. Recognized entities are returned in the `entities` complex output field. For example, "Windows 10" is a well-known entity (a product), but since "Products" is not a supported category, this entity would be included in the entities output field. Default is `false` |


## Skill inputs

| Input name      | Description                   |
|---------------|-------------------------------|
| `languageCode`    | Optional. Default is `"en"`.  |
| `text`          | The text to analyze.          |

## Skill outputs

> [!NOTE]
> Not all entity categories are supported for all languages. The `"Person"`, `"Location"`, and `"Organization"` entity category types are supported for the full list of languages above. Only _de_, _en_, _es_, _fr_, and _zh-hans_ support extraction of `"Quantity"`, `"Datetime"`, `"URL"`, and `"Email"` types. For more information, see [Language and region support for the Text Analytics API](../ai-services/language-service/language-detection/overview.md).  

| Output name      | Description                   |
|---------------|-------------------------------|
| `persons`       | An array of strings where each string represents the name of a person. |
| `locations`  | An array of strings where each string represents a location. |
| `organizations`  | An array of strings where each string represents an organization. |
| `quantities`  | An array of strings where each string represents a quantity. |
| `dateTimes`  | An array of strings where each string represents a DateTime (as it appears in the text) value. |
| `urls` | An array of strings where each string represents a URL |
| `emails` | An array of strings where each string represents an email |
| `namedEntities` | An array of complex types that contains the following fields: <ul><li>category</li> <li>value (The actual entity name)</li><li>offset (The location where it was found in the text)</li><li>confidence (Higher value means it's more to be a real entity)</li></ul> |
| `entities` | An array of complex types that contains rich information about the entities extracted from text, with the following fields <ul><li> name (the actual entity name. This represents a "normalized" form)</li><li> wikipediaId</li><li>wikipediaLanguage</li><li>wikipediaUrl (a link to Wikipedia page for the entity)</li><li>bingId</li><li>type (the category of the entity recognized)</li><li>subType (available only for certain categories, this gives a more granular view of the entity type)</li><li> matches (a complex collection that contains)<ul><li>text (the raw text for the entity)</li><li>offset (the location where it was found)</li><li>length (the length of the raw entity text)</li></ul></li></ul> |

##    Sample definition

```json
  {
    "@odata.type": "#Microsoft.Skills.Text.EntityRecognitionSkill",
    "categories": [ "Person", "Email"],
    "defaultLanguageCode": "en",
    "includeTypelessEntities": true,
    "minimumPrecision": 0.5,
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
##    Sample input

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

##    Sample output

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
            "confidence": 0.98
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

Note that the offsets returned for entities in the output of this skill are directly returned from the [Text Analytics API](../ai-services/language-service/overview.md), which means if you are using them to index into the original string, you should use the [StringInfo](/dotnet/api/system.globalization.stringinfo) class in .NET in order to extract the correct content.  [More details can be found here.](../ai-services/language-service/concepts/multilingual-emoji-support.md)

## Warning cases
If the language code for the document is unsupported, a warning is returned and no entities are extracted.

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Entity Recognition Skill (V3)](cognitive-search-skill-entity-recognition-v3.md)
