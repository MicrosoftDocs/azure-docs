---
title: Microsoft.Skills.Vision.Ocr cognitive search skill (Azure Search) | Microsoft Docs
description: Extract text from image files in an Azure Search augmentation pipeline.
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
# Microsoft.Skills.Vision.Ocr cognitive skill

The **Ocr** skill extracts text from image files. Supported file formats include:

+ .JPEG
+ .JPG
+ .PNG
+ .BMP
+ .GIF


## Skill Parameters

Parameters are case-sensitive.

| Parameter name	 | Description |
|--------------------|-------------|
| detectOrientation	| Enables autodetection of image orientation. <br/> Valid values: true / false.|
|defaultLanguageCode |	Language code of the input text. Supported languages include: ar, cs, da, de, en, es, fi, fr, he, hu, it, ko, pt-br, pt.  If the language code is unspecified or null, the language is autodetected.|

## Inputs

When specifying inputs, use either `url` or `imageData` in the skill definition. 

| Input name	  | Description                   |
|---------------|-------------------------------|
| url          	| The path to the image.  |
| queryString   | (optional) If a query is provided, it is appended to the URL. Only applicable if a URL is set.  |
| imageData     | (alternative to `url`) EDM Image Type, produced by document cracking step. |


## Outputs

| Output name	  | Description                   |
|---------------|-------------------------------|
| text         	| Plain text extracted from the image.   |
| layoutText    | Complex type describing the extraced text and its origin.|


## Sample definition

```json
{
    "skills": [
      {
        "name": "OCR skill",
        "description": "Extract text (plain and structured) from image."
        "@odata.type": "#Microsoft.Skills.Vision.OcrSkill",
        "context": "/document",
        "defaultLanguageCode": null,
        "detectOrientation": true,
        "inputs": [
          {
            "name": "url",
            "source": "/document/metadata_storage_path"
          },
          {
            "name": "queryString",
            "source": "/document/metadata_storage_sas_token"
          }
        ],
        "outputs": [
          {
            "name": "text",
            "targetName": "myText"
          },
          {
            "name": "layoutText",
            "targetName": "myLayoutText"
          }
        ]
      }
    ]
  }";
```

## Sample output

```json
     
    {
      "layoutText":
      {

        "language" : "en",

        "textAngle": "10",  // between -45 and 45 degrees, once the text was oriented correctly.

        "orientation" : "left",  // original orientation: one of left, top, bottom, right (like a clock)

        "text" : "Hello World. -John",

        "lines" : [
            {
              "lineId":1,
              "boundingBox":{   /// Modify in code
                  "top": 10, 
                  "left": 10,
                  "width": 100,
                  "height": 30
              },
              "text":"Hello World."
            },

            {
              "boundingBox":{
                  "top": 50, 
                  "left": 10,
                  "width": 100,
                  "height": 30
              },
              "text":"-John"
            }
        ],
        "words": [
            {
              "boundingBox":{
                  "top": 10, 
                  "left": 10,
                  "width": 50,
                  "height": 30
              },
              "text":"Hello"
            },
            {
              "boundingBox":{
                  "top": 10, 
                  "left": 70,
                  "width": 30,
                  "height": 30
              },
              "text":"World."
            },
            {
              "boundingBox":{
                  "top": 50, 
                  "left": 10,
                  "width": 100,
                  "height": 30
              },
              "text":"-John"
            }
        ]
      }
    }
```

## See also

+ [Predefined skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)