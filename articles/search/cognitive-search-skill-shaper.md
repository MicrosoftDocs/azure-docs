---
title: Shaper cognitive search skill (Azure Search) | Microsoft Docs
description: Extract metadata and structured information from unstructured data and shape it as a complex type in an Azure Search enrichment pipeline.
services: search
manager: pablocas
author: luiscabrer


ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: conceptual
ms.date: 05/01/2018
ms.author: luisca
---

#	Shaper cognitive skill

The **Shaper** skill creates a complex type to support composite fields (also known as multipart fields). A complex type field has multiple parts but is treated as a single item in an Azure Search index. Examples of consolidated fields useful in search scenarios include combining a first and last name into a single field, city and state into a single field, or name and birthdate into a single field to establish unique identity.

The Shaper skill allows you to essentially create a structure, define the name of the members of that structure, and assign values to each member.

By default, this technique supports objects that are one level deep. For more complex objects, you can chain several Shaper steps.

In the response, the output name is always "output". Internally, the pipeline can map a different name, such as "analyzedText" in the examples below to "output", but the Shaper skill itself returns "output" in the response. This might be important if you are debugging enriched documents and notice the naming discrepancy, or if you build a custom skill and are structuring the response yourself.

> [!NOTE]
> Cognitive Search is in public preview. Skillset execution, and image extraction and normalization are currently offered for free. At a later time, the pricing for these capabilities will be announced. 

## @odata.type  
Microsoft.Skills.Util.ShaperSkill

## Sample 1: complex types

Consider a scenario where you want to create a structure called *analyzedText* that has two members: *text* and *sentiment*, respectively. In Azure Search, a multi-part searchable field is called a *complex type*, and it's not yet supported out of the box. In this preview, a Shaper skill can be used to generate fields of a complex type in your index. 

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
      "targetName": analyzedText"
    }
  ]
}
```

###	Sample input
A JSON document providing usable input for this Shaper skill could be:

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
The Shaper skill generates a new element called *analyzedText* with the combined elements of *text* and *sentiment*. 

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
            "source": "/document/content/pages/*/chapterTitles/*"
        }
    ],
    "outputs": [
        {
            "output": "titlesAndChapters",
            "targetName": "analyzedText"
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

## See also

+ [Predefined skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)

