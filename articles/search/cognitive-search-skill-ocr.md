---
title: OCR cognitive search skill (Azure Search) | Microsoft Docs
description: Extract text from image files in an Azure Search augmentation pipeline.
services: search
manager: pablocas
author: luiscabrer
documentationcenter: ''

ms.assetid: 
ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.date: 05/01/2018
ms.author: luisca
---
# OCR cognitive skill

The **OCR** skill extracts text from image files. Supported file formats include:

+ .JPEG
+ .JPG
+ .PNG
+ .BMP
+ .GIF


## Skill parameters

Parameters are case-sensitive.

| Parameter name	 | Description |
|--------------------|-------------|
| detectOrientation	| Enables autodetection of image orientation. <br/> Valid values: true / false.|
|defaultLanguageCode |	Language code of the input text. Supported languages include: ar, cs, da, de, en, es, fi, fr, he, hu, it, ko, pt-br, pt.  If the language code is unspecified or null, the language is autodetected.|
| textExtractionAlgorithm | "printed" or "handwritten". The "handwritten" text recognition OCR algorithm is currently in preview and only supported in English. |

## Skill inputs

| Input name	  | Description                                          |
|---------------|------------------------------------------------------|
| image         | Complex Type. Currently only works with "\document\normalized_images" field, produced by the Azure Blob indexer when ```imageAction``` is set to ```generateNormalizedImages```. See the [sample](#sample-output) for more information.|


## Skill outputs
| Output name	  | Description                   |
|---------------|-------------------------------|
| text         	| Plain text extracted from the image.   |
| layoutText    | Complex type that describing the extracted text as well as the location where the text was found.|


## Sample definition

```json
{
    "skills": [
      {
        "name": "OCR skill",
        "description": "Extracts text (plain and structured) from image."
        "@odata.type": "#Microsoft.Skills.Vision.OcrSkill",
        "context": "/document/normalized_images/*",
        "defaultLanguageCode": null,
        "detectOrientation": true,
        "inputs": [
          {
            "name": "image",
            "source": "/document/normalized_images/*"
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
 }
```
<a name="sample-output"></a>

## Sample text and layoutText output

```json
{
  "text": "Hello World. -John",
  "layoutText":
  {
    "language" : "en",
    "text" : "Hello World. -John",
    "lines" : [
      {
        "boundingBox":
        [ {"x":10, "y":10}, {"x":50, "y":10}, {"x":50, "y":30},{"x":10, "y":30}],
        "text":"Hello World."
      },
      {
        "boundingBox": [ {"x":110, "y":10}, {"x":150, "y":10}, {"x":150, "y":30},{"x":110, "y":30}],
        "text":"-John"
      }
    ],
    "words": [
      {
        "boundingBox": [ {"x":110, "y":10}, {"x":150, "y":10}, {"x":150, "y":30},{"x":110, "y":30}],
        "text":"Hello"
      },
      {
        "boundingBox": [ {"x":110, "y":10}, {"x":150, "y":10}, {"x":150, "y":30},{"x":110, "y":30}],
        "text":"World."
      },
      {
        "boundingBox": [ {"x":110, "y":10}, {"x":150, "y":10}, {"x":150, "y":30},{"x":110, "y":30}],
        "text":"-John"
      }
    ]
  }
}
```

## Sample: Merging text extracted from embedded images with the content of the document.

A common use case for Text Merger is the ability to merge the textual representation of images (text from an OCR skill, or the caption of an image)  into the content field of a document. 

The following example skillset creates a *merged_text* field to contain the textual content of your document, as well as the OCRed text from each of the images embedded in that document. 

#### Request Body Syntax
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
      "insertPostTag": " ",
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
          "name": "mergedText", "targetname" : "merged_text"
        }
      ]
    }
  ]
}
```
The above skillset example assumes that a normalized-images field exists. To generate this field, set the *imageAction* configuration in your indexer definition to *generateNormalizedImages* as shown below:

```json
{
  //...rest of your indexer definition goes here ...
  "parameters":
  {
  	"configuration": 
    {
    	"dataToExtract": "contentAndMetadata",
     	"imageAction": "generateNormalizedImages"
		}
  }
}
```

## See also
+ [Predefined skills](cognitive-search-predefined-skills.md)
+ [TextMerger skill](cognitive-search-skill-textmerger.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)