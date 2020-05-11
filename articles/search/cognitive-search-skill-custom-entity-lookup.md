---
title: Custom Entity Lookup cognitive search skill
titleSuffix: Azure Cognitive Search
description: Extract different custom entities from text in an Azure Cognitive Search cognitive search pipeline. This skill is currently in public preview.

manager: nitinme
author: luiscabrer
ms.author: luisca
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/30/2020
---

#     Custom Entity Lookup cognitive skill (Preview)

> [!IMPORTANT] 
> This skill is currently in public preview. Preview functionality is provided without a service level agreement, and is not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). There is currently no portal or .NET SDK support.

The **Custom Entity Lookup** skill looks for text from a custom, user-defined list of words and phrases. Using this list, it labels all documents with any matching entities. The skill also supports a degree of fuzzy matching that can be applied to find matches that are similar but not quite exact.  

This skill is not bound to a Cognitive Services API and can be used free of charge during the preview period. You should still [attach a Cognitive Services resource](https://docs.microsoft.com/azure/search/cognitive-search-attach-cognitive-services), however, to override the daily enrichment limit. The daily limit applies to free access to Cognitive Services when accessed through Azure Cognitive Search.

## @odata.type  
Microsoft.Skills.Text.CustomEntityLookupSkill 

## Data limits
+ The maximum input record size supported is 256 MB. If you need to break up your data before sending it to the custom entity lookup skill, consider using the [Text Split skill](cognitive-search-skill-textsplit.md).
+ The maximum entities definition table supported is 10 MB if it is provided using the *entitiesDefinitionUri* parameter. 
+ If the entities are defined inline, using the *inlineEntitiesDefinition* parameter, the maximum supported size is 10 KB.

## Skill parameters

Parameters are case-sensitive.

| Parameter name     | Description |
|--------------------|-------------|
| entitiesDefinitionUri    | Path to a JSON or CSV file containing all the target text to match against. This entity definition is read at the beginning of an indexer run; any updates to this file mid-run won't be realized until subsequent runs. This config must be accessible over HTTPS. See [Custom Entity Definition](#custom-entity-definition-format) Format" below for expected CSV or JSON schema.|
|inlineEntitiesDefinition | Inline JSON entity definitions. This parameter supersedes the entitiesDefinitionUri parameter if present. No more than 10 KB of configuration may be provided inline. See [Custom Entity Definition](#custom-entity-definition-format) below for expected JSON schema. |
|defaultLanguageCode |    (Optional) Language code of the input text used to tokenize and delineate input text. The following languages are supported: `da, de, en, es, fi, fr, it, ko, pt`. The default is English (`en`). If you pass a languagecode-countrycode format, only the languagecode part of the format is used.  |


## Skill inputs

| Input name      | Description                   |
|---------------|-------------------------------|
| text          | The text to analyze.          |
| languageCode    | Optional. Default is `"en"`.  |


## Skill outputs


| Output name      | Description                   |
|---------------|-------------------------------|
| entities | An array of objects that contain information about the matches that were found, and related metadata. Each of the entities identified may contain the following fields:  <ul> <li> *name*: The top-level entity identified. The entity represents the "normalized" form. </li> <li> *id*:  A unique identifier for the entity as defined by the user in the "Custom Entity Definition Format".</li> <li> *description*: Entity description as defined by the user in the "Custom Entity Definition Format". </li> <li> *type:* Entity type as defined by the user in the "Custom Entity Definition Format".</li> <li> *subtype:* Entity subtype as defined by the user in the "Custom Entity Definition Format".</li>  <li> *matches*: Collection that describes each of the matches for that entity on the source text. Each match will have the following members: </li> <ul> <li> *text*: The raw text match from the source document. </li> <li> *offset*: The location where the match was found in the text. </li> <li> *length*:  The length of the matched text. </li> <li> *matchDistance*: The number of characters different this match was from original entity name or alias.  </li> </ul> </ul>
  |

## Custom Entity Definition Format

There are 3 different ways to provide the list of custom entities to the Custom Entity Lookup skill. You can provide the list in a .CSV file, a .JSON file or as an inline definition as part of the skill definition.  

If the definition file is a .CSV or .JSON file, the path of the file needs to be provided as part of the *entitiesDefinitionUri* parameter. In this case, the file is downloaded once at the beginning of each indexer run. The file must be accessible as long as the indexer is intended to run. Also, the file must be encoded UTF-8.

If the definition is provided inline, it should be provided as inline as the content of the *inlineEntitiesDefinition* skill parameter. 

### CSV format

You can provide the definition of the custom entities to look for in a Comma-Separated Value (CSV) file by providing the path to the file and setting it in the *entitiesDefinitionUri*  skill parameter. The path should be at an https location. The definition file can be up to 10 MB in size.

The CSV format is simple. Each line represents a unique entity, as shown below:

```
Bill Gates, BillG, William H. Gates
Microsoft, MSFT
Satya Nadella 
```

In this case, there are three entities that can be returned as entities found (Bill Gates, Satya Nadella, Microsoft), but they will be identified if any of the terms on the line (aliases) are matched on the text. For instance, if the string "William H. Gates" is found in a document, a match for the "Bill Gates" entity will be returned.

### JSON format

You can provide the definition of the custom entities to look for in a JSON file as well. The JSON format gives you a bit more flexibility since it allows you to define matching rules per term. For instance, you can specify the fuzzy matching distance (Damerau-Levenshtein distance) for each term or whether the matching should be case-sensitive or not. 

 Just like with CSV files, you need to provide the path to the JSON file and set it in the *entitiesDefinitionUri* skill parameter. The path should be at an https location. The definition file can be up to 10 MB in size.

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

A more complex example of a JSON definition can optionally provide the id, description, type and subtype of each entity -- as well as other *aliases*. If an alias term is matched, the entity will be returned as well:

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
        "type": "Harware",
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

The tables below describe in more details the different configuration parameters you can set when defining the entities to match:

|  Field name  |        Description  |
|--------------|----------------------|
| name | The top-level entity descriptor. Matches in the skill output will be grouped by this name, and it should represent the "normalized" form of the text being found.  |
| description  | (Optional) This field can be used as a passthrough for custom metadata about the matched text(s). The value of this field will appear with every match of its entity in the skill output. |
| type | (Optional) This field can be used as a passthrough for custom metadata about the matched text(s). The value of this field will appear with every match of its entity in the skill output. |
| subtype | (Optional) This field can be used as a passthrough for custom metadata about the matched text(s). The value of this field will appear with every match of its entity in the skill output. |
| id | (Optional) This field can be used as a passthrough for custom metadata about the matched text(s). The value of this field will appear with every match of its entity in the skill output. |
| caseSensitive | (Optional) Defaults to false. Boolean value denoting whether comparisons with the entity name should be sensitive to character casing. Sample case insensitive matches of "Microsoft" could be: microsoft, microSoft, MICROSOFT |
| fuzzyEditDistance | (Optional) Defaults to 0. Maximum value of 5. Denotes the acceptable number of divergent characters that would still constitute a match with the entity name. The smallest possible fuzziness for any given match is returned.  For instance, if the edit distance is set to 3, "Windows 10" would still match "Windows", "Windows10" and "windows 7". <br/> When case sensitivity is set to false, case differences do NOT count towards fuzziness tolerance, but otherwise do. |
| defaultCaseSensitive | (Optional) Changes the default case sensitivity value for this entity. It be used to change the default value of all aliases caseSensitive values. |
| defaultFuzzyEditDistance | (Optional) Changes the default fuzzy edit distance value for this entity. It can be used to change the default value of all aliases fuzzyEditDistance values. |
| aliases | (Optional) An array of complex objects that can be used to specify alternative spellings or synonyms to the root entity name. |

| Alias properties | Description |
|------------------|-------------|
| text  | The alternative spelling or representation of some target entity name.  |
| caseSensitive | (Optional) Acts the same as root entity "caseSensitive" parameter above, but applies to only this one alias. |
| fuzzyEditDistance | (Optional) Acts the same as root entity "fuzzyEditDistance" parameter above, but applies to only this one alias. |


### Inline format

In some cases, it may be more convenient to provide the list of custom entities to match inline directly into the skill definition. In that case you can use a similar  JSON format to the one described above, but it is inlined in the skill definition.
Only configurations that are less than 10 KB in size (serialized size) can be defined inline. 

##    Sample definition

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
        "type": "Harware",
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
Alternatively, if you decide to provide a pointer to the entities definition file, a sample skill definition using the entitiesDefinitionUri format is shown below:

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

##    Sample input

```json
{
    "values": [
      {
        "recordId": "1",
        "data":
           {
             "text": "The company microsoft was founded by Bill Gates. Microsoft's gaming console is called Xbox",
             "languageCode": "en"
           }
      }
    ]
}
```

##    Sample output

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

## Errors and warnings

### Warning: Reached maximum capacity for matches, skipping all further duplicate matches.

This warning will be emitted if the number of matches detected is greater than the maximum allowed. In this case, we will stop including duplicate matches. If this is unacceptable to you, please file a [support ticket](https://ms.portal.azure.com/#create/Microsoft.Support) so we can assist you with your individual use case.

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Entity Recognition skill (to search for well known entities)](cognitive-search-skill-entity-recognition.md)
