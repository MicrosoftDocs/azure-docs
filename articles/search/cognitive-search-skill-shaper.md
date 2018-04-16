---
title: Microsoft.Skills.Util.Shaper cognitive search skill (Azure Search) | Microsoft Docs
description: Extract metadata and structured information from unstructured data and shape it as a complex type in an Azure Search augmentation pipeline.
services: search
manager: pablocas
author: luiscabrer
documentationcenter: ''

ms.assetid: 
ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 05/01/2018
ms.author: luisca
---

#	Microsoft.Skills.Util.Shaper cognitive skill
As you extract metadata and structured information from unstructured data, you might want to shape that information into a multi-part complex type that can be treated as a single item in an Azure Search index.

The shaper skill allows you to essentially create a structure, define the name of the members of that structure, and assign values to each member.

By default, this technique supports objects that are one level deep. For more complex objects, you can chain several *Shaper* steps.

In the response, the output name is always "output". Internally, the pipeline can map a different name, such as "analyzedText" in the examples below, to "output", but the shaper skill itself returns "output" in the response. This point might be important if you are debugging enriched documents and notice the naming discrepancy, or if you build a custom skill and are structuring the reponse yourself.


## @odata.type  
Microsoft.Skills.Util.ShaperSkill

## Sample 1: complex types

Consider a scenario where you want to create a structure called *analyzedText* that has two members: *text* and *sentiment*, respectively. 
In Azure Search, a multi-part searchable field is called a *complex type*, and it's not yet supported out of the box. In this preview, a shaper skill can be used to generate fields of a complex type in your index. 

In this sample, you would provide the member names as the input. The output structure (your complex field in Azure Search) is specified through *targetName*. 


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

###	Sample Input
A JSON document providing usable input for this shaper skill could be:

```json
{
    "values": [
      {
        "recordId": "1",
        "data":
           {
             "text": "this movie is awesome" ,
             "sentiment": 0.9
           }
      }
    ]
```


###	Sample Output
The shaper skill generates a new element called *analyzedText* with the combined elements of *text* and *sentiment*. 

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

The shaper skill definition for this scenario might look like the following example:

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
###	Sample Output
In this case, the shaper flattens all chapter titles to create a single array. 


```json
{
    "values": [
      {
        "recordId": "1",
        "data":
        {
        "titlesAndChapters": 
          {
            "title": "How to be happy" ,
            "chapterTitles": ["Start young", "Laugh often", "Eat, sleep and exercise"]
          }
        }
      }
    ]
}
```


