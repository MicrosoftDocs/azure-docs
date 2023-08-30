---
title: Shaper cognitive skill
titleSuffix: Azure Cognitive Search
description: Extract metadata and structured information from unstructured data and shape it as a complex type in an AI enrichment pipeline in Azure Cognitive Search.
author: LiamCavanagh
ms.author: liamca
ms.service: cognitive-search
ms.topic: reference
ms.date: 08/12/2021
---

# Shaper cognitive skill

The **Shaper** skill consolidates several inputs into a [complex type](search-howto-complex-data-types.md) that can be referenced later in the enrichment pipeline. The **Shaper** skill allows you to essentially create a structure, define the name of the members of that structure, and assign values to each member. Examples of consolidated fields useful in search scenarios include combining a first and last name into a single structure, city and state into a single structure, or name and birthdate into a single structure to establish unique identity.

Additionally, the **Shaper** skill illustrated in [scenario 3](#nested-complex-types) adds an optional *sourceContext* property to the input. The *source* and *sourceContext* properties are mutually exclusive. If the input is at the context of the skill, simply use *source*. If the input is at a *different* context than the skill context, use the *sourceContext*. The *sourceContext* requires you to define a nested input with the specific element being addressed as the source. 

The output name is always "output". Internally, the pipeline can map a different name, such as "analyzedText" as shown in the examples below, but the **Shaper** skill itself returns "output" in the response. This might be important if you are debugging enriched documents and notice the naming discrepancy, or if you build a custom skill and are structuring the response yourself.

> [!NOTE]
> This skill isn't bound to Azure AI services. It is non-billable and has no Azure AI services key requirement.

## @odata.type  
Microsoft.Skills.Util.ShaperSkill

## Scenario 1: complex types

Consider a scenario where you want to create a structure called *analyzedText* that has two members: *text* and *sentiment*, respectively. In an index, a multi-part searchable field is called a *complex type* and it's often created when source data has a corresponding complex structure that maps to it.

However, another approach for creating complex types is through the **Shaper** skill. By including this skill in a skillset, the in-memory operations during skillset processing can output data shapes with nested structures, which can then be mapped to a complex type in your index. 

The following example skill definition provides the member names as the input. 

```json
{
  "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
  "context": "/document/content/phrases/*",
  "inputs": [
    {
      "name": "text",
      "source": "/document/content/phrases/*"
    },
    {
      "name": "sentiment",
      "source": "/document/content/phrases/*/sentiment"
    }
  ],
  "outputs": [
    {
      "name": "output",
      "targetName": "analyzedText"
    }
  ]
}
```

###	Sample index

A skillset is invoked by an indexer, and an indexer requires an index. A complex field representation in your index might look like the following example. 

```json
"name":"my-index",
"fields":[
   { "name":"myId", "type":"Edm.String", "key":true, "filterable":true  },
   { "name":"analyzedText", "type":"Edm.ComplexType",
      "fields":[
         {
            "name":"text",
            "type":"Edm.String",
            "facetable":false,
            "filterable":false,
            "searchable":true,
            "sortable":false  },
         {
            "name":"sentiment",
            "type":"Edm.Double",
            "facetable":true,
            "filterable":true,
            "searchable":true,
            "sortable":true }
      }
```

###	Skill input

An incoming JSON document providing usable input for this **Shaper** skill could be:

```json
{
    "values": [
        {
            "recordId": "1",
            "data": {
                "text": "this movie is awesome",
                "sentiment": 0.9
            }
        }
    ]
}
```


###	Skill output

The **Shaper** skill generates a new element called *analyzedText* with the combined elements of *text* and *sentiment*. This output conforms to the index schema. It will be imported and indexed in an Azure Cognitive Search index.

```json
{
    "values": [
      {
        "recordId": "1",
        "data":
           {
            "analyzedText": 
              {
                "text": "this movie is awesome" ,
                "sentiment": 0.9
              }
           }
      }
    ]
}
```

## Scenario 2: input consolidation

In another example, imagine that at different stages of pipeline processing, you have extracted the title of a book, and chapter titles on different pages of the book. You could now create a single structure composed of these various inputs.

The **Shaper** skill definition for this scenario might look like the following example:

```json
{
    "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
    "context": "/document",
    "inputs": [
        {
            "name": "title",
            "source": "/document/content/title"
        },
        {
            "name": "chapterTitles",
            "source": "/document/content/pages/*/chapterTitles/*/title"
        }
    ],
    "outputs": [
        {
            "name": "output",
            "targetName": "titlesAndChapters"
        }
    ]
}
```

###	Skill output
In this case, the **Shaper** flattens all chapter titles to create a single array. 

```json
{
    "values": [
        {
            "recordId": "1",
            "data": {
                "titlesAndChapters": {
                    "title": "How to be happy",
                    "chapterTitles": [
                        "Start young",
                        "Laugh often",
                        "Eat, sleep and exercise"
                    ]
                }
            }
        }
    ]
}
```

<a name="nested-complex-types"></a>

## Scenario 3: input consolidation from nested contexts

Imagine you have the title, chapters, and contents of a book and have run entity recognition and key phrases on the contents and now need to aggregate results from the different skills into a single shape with the chapter name, entities, and key phrases.

The **Shaper** skill definition for this scenario might look like the following example:

```json
{
    "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
    "context": "/document",
    "inputs": [
        {
            "name": "title",
            "source": "/document/content/title"
        },
        {
            "name": "chapterTitles",
            "sourceContext": "/document/content/pages/*/chapterTitles/*",
            "inputs": [
              {
                  "name": "title",
                  "source": "/document/content/pages/*/chapterTitles/*/title"
              },
              {
                  "name": "number",
                  "source": "/document/content/pages/*/chapterTitles/*/number"
              }
            ]
        }

    ],
    "outputs": [
        {
            "name": "output",
            "targetName": "titlesAndChapters"
        }
    ]
}
```

###	Skill output
In this case, the **Shaper** creates a complex type. This structure exists in-memory. If you want to save it to a [knowledge store](knowledge-store-concept-intro.md), you should create a projection in your skillset that defines storage characteristics.

```json
{
    "values": [
        {
            "recordId": "1",
            "data": {
                "titlesAndChapters": {
                    "title": "How to be happy",
                    "chapterTitles": [
                      { "title": "Start young", "number": 1},
                      { "title": "Laugh often", "number": 2},
                      { "title": "Eat, sleep and exercise", "number: 3}
                    ]
                }
            }
        }
    ]
}
```

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [How to use complex types](search-howto-complex-data-types.md)
+ [Knowledge store](knowledge-store-concept-intro.md)
+ [Create a knowledge store in REST](knowledge-store-create-rest.md)
