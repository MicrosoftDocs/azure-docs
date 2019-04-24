---
title: Shaper cognitive search skill - Azure Search
description: Extract metadata and structured information from unstructured data and shape it as a complex type in an Azure Search enrichment pipeline.
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

#	Shaper cognitive skill

The **Shaper** skill consolidates several inputs into a complex type that can be referenced later in the enrichment pipeline. The **Shaper** skill allows you to essentially create a structure, define the name of the members of that structure, and assign values to each member. Examples of consolidated fields useful in search scenarios include combining a first and last name into a single structure, city and state into a single structure, or name and birthdate into a single structure to establish unique identity.

> [!NOTE]
> This feature in the only available starting with the **2019-05-06-Preview** version of the API. If you are using an earlier version of the API, the shaperskill only supports objects that are one level deep. For more complex objects, you can chain several **Shaper** steps.

In the past when you have had to create a complex object you have had to chain several shaper steps as any one shaper skill sourced all inputs from a single context. The **updated shaper** skill addresses this challenge by adding a new optional property *sourceContext* to the input. The *source* and *sourceContext* properties are mutually exclusive. If the input is at the context of the skill, simply use *source*. If the input is at a *different* context than the skill context, use the *sourceContext*. The *sourceContext* requires you to define a nested input with the specific element being addressed as the source. 

In the response, the output name is always "output". Internally, the pipeline can map a different name, such as "analyzedText" in the examples below to "output", but the **Shaper** skill itself returns "output" in the response. This might be important if you are debugging enriched documents and notice the naming discrepancy, or if you build a custom skill and are structuring the response yourself.

> [!NOTE]
> This skill is not bound to a Cognitive Services API and you are not charged for using it. You should still [attach a Cognitive Services resource](cognitive-search-attach-cognitive-services.md), however, to override the **Free** resource option that limits you to a small number of daily enrichments per day.

## @odata.type  
Microsoft.Skills.Util.ShaperSkill

## Sample 1: complex types

Consider a scenario where you want to create a structure called *analyzedText* that has two members: *text* and *sentiment*, respectively. In Azure Search, a multi-part searchable field is called a *complex type*, and it's not yet supported out of the box. In this preview, a **Shaper** skill can be used to generate fields of a complex type in your index. 

The following example provides the member names as the input. The output structure (your complex field in Azure Search) is specified through *targetName*. 


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

###	Sample input
A JSON document providing usable input for this **Shaper** skill could be:

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


###	Sample output
The **Shaper** skill generates a new element called *analyzedText* with the combined elements of *text* and *sentiment*. 

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

## Sample 2: input consolidation

In another example, imagine that at different stages of pipeline processing, you have extracted the title of a book, and chapter titles on different pages of the book. You could now create a single structure composed of these various inputs.

The Shaper skill definition for this scenario might look like the following example:

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

###	Sample output
In this case, the Shaper flattens all chapter titles to create a single array. 

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
## Sample 3: input consolidation from nested contexts
*Only supported starting with the 2019-05-06-Preview* api version. Imagine you have the title, chapters and contents of a book and have run entity recognition and key phrases on the contents and now need to aggregate results from the different skills into a single shape with the chapter name, entities and key phrases.

The Shaper skill definition for this scenario might look like the following example:
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

###	Sample output
In this case, the Shaper creates a complex type. 

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
                      { "title": "Eat, sleep and exercise", "body": 3}
                    ]
                }
            }
        }
    ]
}
```

## See also

+ [Predefined skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)