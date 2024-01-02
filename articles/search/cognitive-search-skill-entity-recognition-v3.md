---
title: Entity Recognition cognitive skill (v3)
titleSuffix: Azure AI Search
description: Extract different types of entities using the machine learning models of Azure AI Language in an AI enrichment pipeline in Azure AI Search.
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: reference
ms.date: 08/17/2022
---

# Entity Recognition cognitive skill (v3)

The **Entity Recognition** skill (v3) extracts entities of different types from text. These entities fall under 14 distinct categories, ranging from people and organizations to URLs and phone numbers. This skill uses the [Named Entity Recognition](../ai-services/language-service/named-entity-recognition/overview.md) machine learning models provided by [Azure AI Language](../ai-services/language-service/overview.md).

> [!NOTE]
> This skill is bound to Azure AI services and requires [a billable resource](cognitive-search-attach-cognitive-services.md) for transactions that exceed 20 documents per indexer per day. Execution of built-in skills is charged at the existing [Azure AI services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/).
>

## @odata.type  
Microsoft.Skills.Text.V3.EntityRecognitionSkill

## Data limits
The maximum size of a record should be 50,000 characters as measured by [`String.Length`](/dotnet/api/system.string.length). If you need to break up your data before sending it to the EntityRecognition skill, consider using the [Text Split skill](cognitive-search-skill-textsplit.md). When using a split skill, set the page length to 5000 for the best performance.

## Skill parameters

Parameters are case-sensitive and are all optional.

| Parameter name     | Description |
|--------------------|-------------|
| `categories`    | Array of categories that should be extracted.  Possible category types: `"Person"`, `"Location"`, `"Organization"`, `"Quantity"`, `"DateTime"`, `"URL"`, `"Email"`, `"personType"`, `"Event"`, `"Product"`, `"Skill"`, `"Address"`, `"phoneNumber"`, `"ipAddress"`. If no category is provided, all types are returned.|
| `defaultLanguageCode` |    Language code of the input text. If the default language code is not specified,  English (en) will be used as the default language code. <br/> See the [full list of supported languages](../ai-services/language-service/named-entity-recognition/language-support.md). Not all entity categories are supported for all languages; see note below.|
| `minimumPrecision` | A value between 0 and 1. If the confidence score (in the `namedEntities` output) is lower than this value, the entity is not returned. The default is 0. |
| `modelVersion` | (Optional) Specifies the [version of the model](../ai-services/language-service/concepts/model-lifecycle.md) to use when calling the entity recognition API. It will default to the latest available when not specified. We recommend you do not specify this value unless it's necessary. |

## Skill inputs

| Input name      | Description                   |
|---------------|-------------------------------|
| `languageCode`    | A string indicating the language of the records. If this parameter is not specified, the default language code will be used to analyze the records. <br/>See the [full list of supported languages](../ai-services/language-service/named-entity-recognition/language-support.md). |
| `text`          | The text to analyze. |

## Skill outputs

> [!NOTE]
> Not all entity categories are supported for all languages. See [Supported Named Entity Recognition (NER) entity categories](../ai-services/language-service/named-entity-recognition/concepts/named-entity-categories.md) to know which entity categories are supported for the language you will be using.

| Output name      | Description                   |
|---------------|-------------------------------|
| `persons`       | An array of strings where each string represents the name of a person. |
| `locations`  | An array of strings where each string represents a location. |
| `organizations`  | An array of strings where each string represents an organization. |
| `quantities`  | An array of strings where each string represents a quantity. |
| `dateTimes`  | An array of strings where each string represents a DateTime (as it appears in the text) value. |
| `urls` | An array of strings where each string represents a URL |
| `emails` | An array of strings where each string represents an email |
| `personTypes` | An array of strings where each string represents a PersonType |
| `events` | An array of strings where each string represents an event |
| `products` | An array of strings where each string represents a product |
| `skills` | An array of strings where each string represents a skill |
| `addresses` | An array of strings where each string represents an address |
| `phoneNumbers` | An array of strings where each string represents a telephone number |
| `ipAddresses` | An array of strings where each string represents an IP Address |
| `namedEntities` | An array of complex types that contains the following fields: <ul><li>category</li> <li>subcategory</li> <li>confidenceScore (Higher value means it's more to be a real entity)</li> <li>length (The length(number of characters) of this entity)</li> <li>offset (The location where it was found in the text)</li> <li>text (The actual entity name as it appears in the text)</li></ul> |

## Sample definition

```json
  {
    "@odata.type": "#Microsoft.Skills.Text.V3.EntityRecognitionSkill",
    "context": "/document",
    "categories": [ "Person", "Email"],
    "defaultLanguageCode": "en", 
    "minimumPrecision": 0.5, 
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
            "name": "persons", 
            "targetName": "people"
        },
        {
            "name": "emails", 
            "targetName": "emails"
        },
        {
            "name": "namedEntities", 
            "targetName": "namedEntities"
        }
    ]
  }
```

## Sample input

```json
{
    "values": [
      {
        "recordId": "1",
        "data":
           {
             "text": "Contoso Corporation was founded by Jean Martin. They can be reached at contact@contoso.com",
             "languageCode": "en"
           }
      }
    ]
}
```

## Sample output

```json
{
  "values": [
    {
      "recordId": "1",
      "data" : 
      {
        "people": [ "Jean Martin"],
        "emails":["contact@contoso.com"],
        "namedEntities": 
        [
          {
            "category": "Person",
            "subcategory": null,
            "length": 11,
            "offset": 35,
            "confidenceScore": 0.98,
            "text": "Jean Martin"
          },
          {
            "category": "Email",
            "subcategory": null,
            "length": 19,
            "offset": 71,
            "confidenceScore": 0.8,
            "text": "contact@contoso.com"
          }
        ],
      }
    }
  ]
}
```

The offsets returned for entities in the output of this skill are directly returned from the [Language Service APIs](../ai-services/language-service/overview.md), which means if you are using them to index into the original string, you should use the [StringInfo](/dotnet/api/system.globalization.stringinfo) class in .NET in order to extract the correct content. For more information, see [Multilingual and emoji support in Language service features](../ai-services/language-service/concepts/multilingual-emoji-support.md).

## Warning cases

If the language code for the document is unsupported, a warning is returned and no entities are extracted.

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
