---
title: Custom Entity Lookup skill
titleSuffix: Azure AI Search
description: Extract different custom entities from text in an Azure AI Search enrichment pipeline.
author: gmndrg
ms.author: gimondra
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: reference
ms.date: 09/07/2022
---

# Custom Entity Lookup cognitive skill

The **Custom Entity Lookup** skill is used to detect or recognize entities that you define. During skillset execution, the skill looks for text from a custom, user-defined list of words and phrases. The skill uses this list to label any matching entities found within source documents. The skill also supports a degree of fuzzy matching that can be applied to find matches that are similar but not exact.  

> [!NOTE]
> This skill isn't bound to an Azure AI services API but requires an Azure AI services key to allow more than 20 transactions. This skill is [metered by Azure AI Search](https://azure.microsoft.com/pricing/details/search/#pricing).

## @odata.type  

Microsoft.Skills.Text.CustomEntityLookupSkill 

## Data limits

+ The maximum input record size supported is 256 MB. If you need to break up your data before sending it to the custom entity lookup skill, consider using the [Text Split skill](cognitive-search-skill-textsplit.md). If you do use a text split skill, set the page length to 5000 for the best performance.
+ The maximum size of the custom entity definition is 10 MB if it's provided as an external file, specified through the "entitiesDefinitionUri" parameter. 
+ If the entities are defined inline using the "inlineEntitiesDefinition" parameter, the maximum size is 10 KB.

## Skill parameters

Parameters are case-sensitive.

| Parameter name     | Description |
|--------------------|-------------|
| `entitiesDefinitionUri` | Path to an external JSON or CSV file containing all the target text to match against. This entity definition is read at the beginning of an indexer run; any updates to this file mid-run won't be realized until subsequent runs. This file must be accessible over HTTPS. See [Custom Entity Definition Format](#custom-entity-definition-format) below for expected CSV or JSON schema.|
|`inlineEntitiesDefinition` | Inline JSON entity definitions. This parameter supersedes the entitiesDefinitionUri parameter if present. No more than 10 KB of configuration may be provided inline. See [Custom Entity Definition](#custom-entity-definition-format) below for expected JSON schema. |
|`defaultLanguageCode` | (Optional) Language code of the input text used to tokenize and delineate input text. The following languages are supported: `da, de, en, es, fi, fr, it, pt`. The default is English (`en`). If you pass a `languagecode-countrycode` format, only the `languagecode` part of the format is used.  |
|`globalDefaultCaseSensitive` | (Optional) Default case sensitive value for the skill. If `defaultCaseSensitive` value of an entity isn't specified, this value will become the `defaultCaseSensitive` value for that entity. |
|`globalDefaultAccentSensitive` | (Optional) Default accent sensitive value for the skill. If `defaultAccentSensitive` value of an entity isn't specified, this value will become the `defaultAccentSensitive` value for that entity. |
|`globalDefaultFuzzyEditDistance` | (Optional) Default fuzzy edit distance value for the skill. If `defaultFuzzyEditDistance` value of an entity isn't specified, this value will become the `defaultFuzzyEditDistance` value for that entity. |

## Skill inputs

| Input name      | Description                   |
|---------------|-------------------------------|
| `text`          | The text to analyze.          |
| `languageCode`    | Optional. Default is `"en"`.  |

## Skill outputs

| Output name   | Description                   |
|---------------|-------------------------------|
| `entities` | An array of complex types that contains the following fields: <ul><li>`"name"`: The top-level entity; it represents the "normalized" form. </li><li>`"id"`:  A unique identifier for the entity as defined in the "Custom Entity Definition". </li> <li>`"description"`: Entity description as defined by the user in the "Custom Entity Definition Format". </li> <li>`"type"`: Entity type as defined by the user in the "Custom Entity Definition Format".</li> <li> `"subtype"`: Entity subtype as defined by the user in the "Custom Entity Definition Format".</li> <li>`"matches"`: An array of complex types that contain: <ul><li>`"text"` from the source document </li><li>`"offset"` location where the match was found, </li><li>`"length"` of the text measured in characters <li>`"matchDistance"` or the number of characters that differ between the match and the entity `"name"`. </li></li></ul></ul> |

## Custom entity definition format

There are three approaches for providing the list of custom entities to the Custom Entity Lookup skill:

+ .CSV file (UTF-8 encoded)
+ .JSON file (UTF-8 encoded)
+ Inline within the skill definition

If the definition file is in a .CSV or .JSON file, provide the full path in the "entitiesDefinitionUri" parameter. The file is downloaded at the start of each indexer run. It must remain accessible until the indexer stops.

If you're using an inline definition, specify it under the "inlineEntitiesDefinition" skill parameter.

> [!NOTE]
> Indexers support specialized parsing modes for JSON and CSV files. When using the custom entity lookup skill, keep "parsingMode" set to "default". The skill expects JSON and CSV in an unparsed state.

### CSV format

You can provide the definition of the custom entities to look for in a Comma-Separated Value (CSV) file by providing the path to the file and setting it in the "entitiesDefinitionUri"  skill parameter. The path should be at an https location. The definition file can be up to 10 MB in size.

The CSV format is simple. Each line represents a unique entity, as shown below:

```
Bill Gates, BillG, William H. Gates
Microsoft, MSFT
Satya Nadella 
```

In this case, there are three entities that can be returned (Bill Gates, Satya Nadella, Microsoft). Aliases follow after the main entity. A match on an alias is bundled under the primary entity. For example, if the string "William H. Gates" is found in a document, a match for the "Bill Gates" entity will be returned.

### JSON format

You can provide the definition of the custom entities to look for in a JSON file as well. The JSON format gives you a bit more flexibility since it allows you to define matching rules per term. For instance, you can specify the fuzzy matching distance (Damerau-Levenshtein distance) for each term or whether the matching should be case-sensitive or not. 

 Just like with CSV files, you need to provide the path to the JSON file and set it in the "entitiesDefinitionUri" skill parameter. The path should be at an https location. The definition file can be up to 10 MB in size.

The most basic JSON custom entity list definition can be a list of entities to match:

```json
[ 
    { 
        "name" : "Bill Gates"
    }, 
    { 
        "name" : "Microsoft"
    }, 
    { 
        "name" : "Satya Nadella"
    }
]
```

More complex definitions can provide a user-defined ID, description, type, subtype, and aliases. If an alias term is matched, the entity will be returned as well:

```json
[ 
    { 
        "name" : "Bill Gates",
        "description" : "Microsoft founder." ,
        "aliases" : [ 
            { "text" : "William H. Gates", "caseSensitive" : false },
            { "text" : "BillG", "caseSensitive" : true }
        ]
    }, 
    { 
        "name" : "Xbox One", 
        "type": "Hardware",
        "subtype" : "Gaming Device",
        "id" : "4e36bf9d-5550-4396-8647-8e43d7564a76",
        "description" : "The Xbox One product"
    }, 
    { 
        "name" : "LinkedIn" , 
        "description" : "The LinkedIn company", 
        "id" : "differentIdentifyingScheme123", 
        "fuzzyEditDistance" : 0 
    }, 
    { 
        "name" : "Microsoft" , 
        "description" : "Microsoft Corporation", 
        "id" : "differentIdentifyingScheme987", 
        "defaultCaseSensitive" : false, 
        "defaultFuzzyEditDistance" : 1, 
        "aliases" : [ 
            { "text" : "MSFT", "caseSensitive" : true }
        ]
    } 
] 
```

The tables below describe the configuration parameters you can set when defining custom entities:

|  Field name  |        Description  |
|--------------|----------------------|
| `name` | The top-level entity descriptor. Matches in the skill output will be grouped by this name, and it should represent the "normalized" form of the text being found.  |
| `description`  | (Optional) This field can be used as a passthrough for custom metadata about the matched text(s). The value of this field will appear with every match of its entity in the skill output. |
| `type` | (Optional) This field can be used as a passthrough for custom metadata about the matched text(s). The value of this field will appear with every match of its entity in the skill output. |
| `subtype` | (Optional) This field can be used as a passthrough for custom metadata about the matched text(s). The value of this field will appear with every match of its entity in the skill output. |
| `id` | (Optional) This field can be used as a passthrough for custom metadata about the matched text(s). The value of this field will appear with every match of its entity in the skill output. |
| `caseSensitive` | (Optional) Defaults to false. Boolean value denoting whether comparisons with the entity name should be sensitive to character casing. Sample case insensitive matches of "Microsoft" could be: microsoft, microSoft, MICROSOFT |
| `accentSensitive` | (Optional) Defaults to false. Boolean value denoting whether accented and unaccented letters such as 'é' and 'e' should be identical. |
| `fuzzyEditDistance` | (Optional) Defaults to 0. Maximum value of 5. Denotes the acceptable number of divergent characters that would still constitute a match with the entity name. The smallest possible fuzziness for any given match is returned.  For instance, if the edit distance is set to 3, "Windows 10" would still match "Windows", "Windows10" and "windows 7". <br/> When case sensitivity is set to false, case differences do NOT count towards fuzziness tolerance, but otherwise do. |
| `defaultCaseSensitive` | (Optional) Changes the default case sensitivity value for this entity. It can be used to change the default value of all aliases caseSensitive values. |
| `defaultAccentSensitive` | (Optional) Changes the default accent sensitivity value for this entity. It can be used to change the default value of all aliases accentSensitive values.|
| `defaultFuzzyEditDistance` | (Optional) Changes the default fuzzy edit distance value for this entity. It can be used to change the default value of all aliases fuzzyEditDistance values. |
| `aliases` | (Optional) An array of complex objects that can be used to specify alternative spellings or synonyms to the root entity name. |

| Alias properties | Description |
|------------------|-------------|
| `text`  | The alternative spelling or representation of some target entity name.  |
| `caseSensitive` | (Optional) Acts the same as root entity "caseSensitive" parameter above, but applies to only this one alias. |
| `accentSensitive` | (Optional) Acts the same as root entity "accentSensitive" parameter above, but applies to only this one alias. |
| `fuzzyEditDistance` | (Optional) Acts the same as root entity "fuzzyEditDistance" parameter above, but applies to only this one alias. |

### Inline format

In some cases, it may be more convenient to embed the custom entity definition so that its inline with the skill definition. You can use the same JSON format as the one described above, except that it's included within the skill definition. Only configurations that are less than 10 KB in size (serialized size) can be defined inline. 

## Sample skill definition

A sample skill definition using an inline format is shown below:

```json
  {
    "@odata.type": "#Microsoft.Skills.Text.CustomEntityLookupSkill",
    "context": "/document",
    "inlineEntitiesDefinition": 
    [
      { 
        "name" : "Bill Gates",
        "description" : "Microsoft founder." ,
        "aliases" : [ 
            { "text" : "William H. Gates", "caseSensitive" : false },
            { "text" : "BillG", "caseSensitive" : true }
        ]
      }, 
      { 
        "name" : "Xbox One", 
        "type": "Hardware",
        "subtype" : "Gaming Device",
        "id" : "4e36bf9d-5550-4396-8647-8e43d7564a76",
        "description" : "The Xbox One product"
      }
    ],    
    "inputs": [
      {
        "name": "text",
        "source": "/document/content"
      }
    ],
    "outputs": [
      {
        "name": "entities",
        "targetName": "matchedEntities"
      }
    ]
  }
```

Alternatively, you can point to an external entities definition file. A sample skill definition using the `entitiesDefinitionUri` format is shown below:

```json
  {
    "@odata.type": "#Microsoft.Skills.Text.CustomEntityLookupSkill",
    "context": "/document",
    "entitiesDefinitionUri": "https://myblobhost.net/keyWordsConfig.csv",    
    "inputs": [
      {
        "name": "text",
        "source": "/document/content"
      }
    ],
    "outputs": [
      {
        "name": "entities",
        "targetName": "matchedEntities"
      }
    ]
  }
```

## Sample index definition

This section provides a sample index definition. Both "entities" and "matches" are arrays of complex types. You can have multiple entities per document, and multiple matches for each entity.

```json
{
  "name": "entities",
  "type": "Collection(Edm.ComplexType)",
  "fields": [
    {
      "name": "name",
      "type": "Edm.String",
      "facetable": false,
      "filterable": false,
      "retrievable": true,
      "searchable": true,
      "sortable": false,
    },
    {
      "name": "id",
      "type": "Edm.String",
      "facetable": false,
      "filterable": false,
      "retrievable": true,
      "searchable": false,
      "sortable": false,
    },
    {
      "name": "description",
      "type": "Edm.String",
      "facetable": false,
      "filterable": false,
      "retrievable": true,
      "searchable": true,
      "sortable": false,
    },
    {
      "name": "type",
      "type": "Edm.String",
      "facetable": true,
      "filterable": true,
      "retrievable": true,
      "searchable": false,
      "sortable": false,
    },
    {
      "name": "subtype",
      "type": "Edm.String",
      "facetable": true,
      "filterable": true,
      "retrievable": true,
      "searchable": false,
      "sortable": false,
    },
    {
      "name": "matches",
      "type": "Collection(Edm.ComplexType)",
      "fields": [
        {
          "name": "text",
          "type": "Edm.String",
          "facetable": false,
          "filterable": false,
          "retrievable": true,
          "searchable": true,
          "sortable": false,
        },
        {
          "name": "offset",
          "type": "Edm.Int32",
          "facetable": true,
          "filterable": true,
          "retrievable": true,
          "sortable": false,
        },
        {
          "name": "length",
          "type": "Edm.Int32",
          "facetable": true,
          "filterable": true,
          "retrievable": true,
          "sortable": false,
        },
        {
          "name": "matchDistance",
          "type": "Edm.Double",
          "facetable": true,
          "filterable": true,
          "retrievable": true,
          "sortable": false,
        }
      ]
    }
  ]
}
```

## Sample input data

```json
{
    "values": [
      {
        "recordId": "1",
        "data":
           {
             "text": "The company, Microsoft, was founded by Bill Gates. Microsoft's gaming console is called Xbox",
             "languageCode": "en"
           }
      }
    ]
}
```

## Sample output

```json
  { 
    "values" : 
    [ 
      { 
        "recordId": "1", 
        "data" : { 
          "entities": [
            { 
              "name" : "Microsoft", 
              "description" : "This document refers to Microsoft the company", 
              "id" : "differentIdentifyingScheme987", 
              "matches" : [ 
                { 
                  "text" : "microsoft", 
                  "offset" : 13, 
                  "length" : 9, 
                  "matchDistance" : 0 
                }, 
                { 
                  "text" : "Microsoft",
                  "offset" : 49, 
                  "length" : 9, 
                  "matchDistance" : 0
                }
              ] 
            },
            { 
              "name" : "Bill Gates",
              "description" : "William Henry Gates III, founder of Microsoft.", 
              "matches" : [
                { 
                  "text" : "Bill Gates",
                  "offset" : 37, 
                  "length" : 10,
                  "matchDistance" : 0 
                }
              ]
            }
          ] 
        } 
      } 
    ] 
  } 
```

## Warnings

`"Reached maximum capacity for matches, skipping all further duplicate matches."`

This warning will be emitted if the number of matches detected is greater than the maximum allowed. No more duplicate matches will be returned. If you need a higher threshold, you can file a [support ticket](https://portal.azure.com/#create/Microsoft.Support) for assistance with your individual use case.

## See also

+ [Custom Entity Lookup sample and readme](https://github.com/Azure-Samples/azure-search-postman-samples/tree/main/skill-examples/custom-entity-lookup-skill)
+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Entity Recognition skill (to search for well known entities)](cognitive-search-skill-entity-recognition-v3.md)
