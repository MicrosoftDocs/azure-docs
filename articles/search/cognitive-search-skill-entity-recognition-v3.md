---
title: Entity Recognition (V3) cognitive skill
titleSuffix: Azure Cognitive Search
description: Extract different types of entities from text  using Text Analytics V3 in an enrichment pipeline in Azure Cognitive Search.

manager: jennmar
author: ayokande
ms.author: aakande
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 05/19/2021
---

# Entity Recognition cognitive skill (V3)

The **Entity Recognition** skill extracts entities of different types from text. These entities fall under 14 distinct categories, ranging from people and organizations to URLs and phone numbers. This skill uses the machine learning models provided by [Text Analytics](../cognitive-services/text-analytics/overview.md) in Cognitive Services.

> [!NOTE]
> As you expand scope by increasing the frequency of processing, adding more documents, or adding more AI algorithms, you will need to [attach a billable Cognitive Services resource](cognitive-search-attach-cognitive-services.md). Charges accrue when calling APIs in Cognitive Services, and for image extraction as part of the document-cracking stage in Azure Cognitive Search. There are no charges for text extraction from documents.
>
> Execution of built-in skills is charged at the existing [Cognitive Services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/). Image extraction pricing is described on the [Azure Cognitive Search pricing page](https://azure.microsoft.com/pricing/details/search/).

## @odata.type  
Microsoft.Skills.Text.V3.EntityRecognitionSkill

## Data limits
The maximum size of a record should be 50,000 characters as measured by [`String.Length`](/dotnet/api/system.string.length). If you need to break up your data before sending it to the EntityRecognition skill, consider using the [Text Split skill](cognitive-search-skill-textsplit.md).

## Skill parameters

Parameters are case-sensitive and are all optional.

| Parameter name     | Description |
|--------------------|-------------|
| `categories`    | Array of categories that should be extracted.  Possible category types: `"Person"`, `"Location"`, `"Organization"`, `"Quantity"`, `"DateTime"`, `"URL"`, `"Email"`, `"PersonType"`, `"Event"`, `"Product"`, `"Skill"`, `"Address"`, `"Phone Number"`, `"IP Address"`. If no category is provided, all types are returned.|
| `defaultLanguageCode` |    Language code of the input text. If the default language code is not specified,  English (en) will be used as the default language code. <br/> See [Full list of supported languages](../cognitive-services/text-analytics/language-support.md). Not all entity categories are supported for all languages; see note below.|
| `minimumPrecision` | A value between 0 and 1. If the confidence score (in the `namedEntities` output) is lower than this value, the entity is not returned. The default is 0. |
| `modelVersion` | (Optional) The version of the model to use when calling the Text Analytics service. It will default to the latest available when not specified. We recommend you do not specify this value unless absolutely necessary. See [Model versioning in the Text Analytics API](../cognitive-services/text-analytics/concepts/model-versioning.md) for more details.|


## Skill inputs

| Input name      | Description                   |
|---------------|-------------------------------|
| `languageCode`    | A string indicating the language of the records. If this parameter is not specified, the default language code will be used to analyze the records. <br/>See [Full list of supported languages](../cognitive-services/text-analytics/language-support.md). |
| `text`          | The text to analyze.          |

## Skill outputs

> [!NOTE]
>Not all entity categories are supported for all languages. Please refer to [Supported entity categories in the Text Analytics API v3](../cognitive-services/text-analytics/named-entity-types.md) to know which entity categories are supported for the language you will be using.

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


##    Sample definition

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
##    Sample input

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

##    Sample output

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

Note that the offsets returned for entities in the output of this skill are directly returned from the [Text Analytics API](../cognitive-services/text-analytics/overview.md), which means if you are using them to index into the original string, you should use the [StringInfo](/dotnet/api/system.globalization.stringinfo) class in .NET in order to extract the correct content.  [More details can be found here.](../cognitive-services/text-analytics/concepts/text-offsets.md)

## Warning cases
If the language code for the document is unsupported, a warning is returned and no entities are extracted.

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)