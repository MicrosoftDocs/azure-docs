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

#	Cognitive Skills: ShaperSkill 
As you extract metadata and structured information from unstructured data, sometimes, you need to shape that information into a complex type that better meets your needs.

The shaper skill allows you to essentially create a structure, define the name of the members of that structure and assign values to each member.

Note that with this technique you can only create "one-level-deep" objects. If you need more complex objects, you could do that by chaining several *Shaper* steps.

## @odata.type  
Microsoft.Skills.Util.ShaperSkill

## Sample 1

###	Sample definition
Consider the scenario where you may want to create a structure called *myobj* that has two members respectively called *text* and *sentiment*.

In that case you would provide the names of the members as the input names, and the name of the structure as the *targetName*.

Then you would simply connect the sources as usual.


```json
{
  "@odata.type": "#Microsoft.Skills.Util.Shaper",
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
      "targetName": "myobj"
    }
  ]
}
```

###	Sample Input
The input will be different for each shaper definition. For the definition above the input could look like:

```json
{
    "values": [
      {
        "recordId": "1",
        "data":
           {
             "text": "I am happy" ,
             "sentiment": 0.9
           }
      }
    ]
```


###	Sample Output
For the sample input above, the output will generate a new element called *myobj* with the members *text* and *sentiment*.

```json
{
    "values": [
      {
        "recordId": "1",
        "data":
           {
            "myobj": 
              {
                "text": "I am happy" ,
                "sentiment": 0.9
              }
           }
      }
    ]
}
```

## Sample 2

In this case we'll use the power of providing context to flatten an array as part of the shaping process...



