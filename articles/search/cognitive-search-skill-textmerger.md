---
title: Text Merge cognitive search skill (Azure Search) | Microsoft Docs
description: Merge text from a collection of fields into one consolidated field. Use this cognitive skill in an Azure Search enrichment pipeline.
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

#	 Text Merge cognitive skill

The **Text Merge** skill consolidates text from a collection of fields into a single field. 

> [!NOTE]
> Cognitive Search is in public preview. Skillset execution, and image extraction and normalization are currently offered for free. At a later time, the pricing for these capabilities will be announced. 

## @odata.type  
Microsoft.Skills.Text.MergeSkill

## Skill parameters

Parameters are case-sensitive.

| Parameter name	 | Description |
|--------------------|-------------|
| insertPreTag	| String to be included before every insertion. The default value is `" "`. To omit the space, set the value to `""`.  |
| insertPostTag	| String to be included after every insertion. The default value is `" "`. To omit the space, set the value to `""`.  |


##	Sample input
A JSON document providing usable input for this skill could be:

```json
{
    "values": [
      {
        "recordId": "1",
        "data":
           {
             "text": "The brown fox jumps over the dog" ,
             "itemsToInsert": ["quick", "lazy"],
             "offsets": [3, 28],
           }
      }
    ]
}
```

##	Sample output
This example shows the output of the previous input, assuming that the *insertPreTag* is set to `" "`, and *insertPostTag* is set to `""`. 

```json
{
    "values": [
      {
        "recordId": "1",
        "data":
           {
             "mergedText": "The quick brown fox jumps over the lazy dog" 
           }
      }
    ]
}
```

## Extended sample skillset definition

A common scenario for using Text Merge is to merge the textual representation of images (text from an OCR skill, or the caption of an image)  into the content field of a document. 

The following example skillset uses the OCR skill to extract text from images embedded in the document. Next, it creates a *merged_text* field to contain both original and OCRed text from each image. 

```json
{
  "description": "Extract text from images and merge with content text to produce merged_text",
  "skills":
  [
    {
        "name": "OCR skill",
        "description": "Extract text (plain and structured) from image.",
        "@odata.type": "#Microsoft.Skills.Vision.OcrSkill",
        "context": "/document/normalized_images/*",
        "defaultLanguageCode": "en",
        "detectOrientation": true,
        "inputs": [
          {
            "name": "image",
            "source": "/document/normalized_images/*"
          }
        ],
        "outputs": [
          {
            "name": "text"
          }
        ]
    },
    {
      "@odata.type": "#Microsoft.Skills.Text.MergeSkill",
      "description": "Create merged_text, which includes all the textual representation of each image inserted at the right location in the content field.",
      "context": "/document",
      "insertPreTag": " ",
      "insertPostTag": " "
      "inputs": [
        {
          "name":"text", "source": "/document/content"
        },
        {
          "name": "itemsToInsert", "source": "/document/normalized_images/*/text"
        },
        {
          "name":"offsets", "source": "/document/normalized_images/*/contentOffset" 
        }
      ],
      "outputs": [
        {
          "name": "mergedText", "targetName" : "merged_text"
        }
      ]
    }
  ]
}
```
The example above assumes that a normalized-images field exists. To get normalized-images field, set the *imageAction* configuration in your indexer definition to *generateNormalizedImages* as shown below:

```json
{  
   //...rest of your indexer definition goes here ... 
  "parameters":{  
      "configuration":{  
         "dataToExtract":"contentAndMetadata",
         "imageAction":"generateNormalizedImages"
      }
   }
}
```

## See also

+ [Predefined skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Create Indexer (REST)](https://docs.microsoft.com/rest/api/searchservice/create-indexer)
