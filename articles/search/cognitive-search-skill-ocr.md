---
title: OCR cognitive search skill - Azure Search
description: Extract text from image files using optical character recognition (OCR) in an Azure Search enrichment pipeline.
services: search
manager: pablocas
author: luiscabrer
ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.date: 01/17/2019
ms.author: luisca
ms.custom: seodec2018
---
# OCR cognitive skill

Optical character recognition (OCR) skill recognizes printed and handwritten text in image files. This skill uses the machine learning models provided by [Computer Vision](https://docs.microsoft.com/azure/cognitive-services/computer-vision/home) in Cognitive Services. The **OCR** skill maps to the following functionality:

+ When textExtractionAlgorithm is set to "handwritten", the ["RecognizeText"](../cognitive-services/computer-vision/quickstarts-sdk/csharp-hand-text-sdk.md) functionality is used.
+ When textExtractionAlgorithm is set to "printed", the ["OCR"](../cognitive-services/computer-vision/concept-extracting-text-ocr.md) functionality is used for languages other than English. For English, the new ["Recognize Text"](../cognitive-services/computer-vision/concept-recognizing-text.md) functionality for printed text is used.

The **OCR** skill extracts text from image files. Supported file formats include:

+ .JPEG
+ .JPG
+ .PNG
+ .BMP
+ .GIF

> [!NOTE]
> Starting December 21, 2018, you can [attach a Cognitive Services resource](cognitive-search-attach-cognitive-services.md) with an Azure Search skillset. This allows us to start charging for skillset execution. On this date, we also began charging for image extraction as part of the document-cracking stage. Text extraction from documents continues to be offered at no additional cost.
>
> [Built-in cognitive skill](cognitive-search-predefined-skills.md) execution is charged at the [Cognitive Services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services), at the same rate as if you had performed the task directly. Image extraction is an Azure Search charge, currently offered at preview pricing. For details, see the [Azure Search pricing page](https://go.microsoft.com/fwlink/?linkid=2042400) or [How billing works](search-sku-tier.md#how-billing-works).

## Skill parameters

Parameters are case-sensitive.

| Parameter name	 | Description |
|--------------------|-------------|
| detectOrientation	| Enables autodetection of image orientation. <br/> Valid values: true / false.|
|defaultLanguageCode | <p>	Language code of the input text. Supported languages include: <br/> zh-Hans (ChineseSimplified) <br/> zh-Hant (ChineseTraditional) <br/>cs (Czech) <br/>da (Danish) <br/>nl (Dutch) <br/>en (English) <br/>fi (Finnish)  <br/>fr (French) <br/>  de (German) <br/>el (Greek) <br/> hu (Hungarian) <br/> it (Italian) <br/>  ja (Japanese) <br/> ko (Korean) <br/> nb (Norwegian) <br/>   pl (Polish) <br/> pt (Portuguese) <br/>  ru (Russian) <br/>  es (Spanish) <br/>  sv (Swedish) <br/>  tr (Turkish) <br/> ar (Arabic) <br/> ro (Romanian) <br/> sr-Cyrl (SerbianCyrillic) <br/> sr-Latn (SerbianLatin) <br/>  sk (Slovak). <br/>  unk (Unknown) <br/><br/> If the language code is unspecified or null, the language will be set to English. If the language is explicitly set to "unk", the language will be auto-detected. </p> |
| textExtractionAlgorithm | "printed" or "handwritten". The "handwritten" text recognition OCR algorithm is currently in preview and only supported in English. |

## Skill inputs

| Input name	  | Description                                          |
|---------------|------------------------------------------------------|
| image         | Complex Type. Currently only works with "/document/normalized_images" field, produced by the Azure Blob indexer when ```imageAction``` is set to a value other than ```none```. See the [sample](#sample-output) for more information.|


## Skill outputs
| Output name	  | Description                   |
|---------------|-------------------------------|
| text         	| Plain text extracted from the image.   |
| layoutText    | Complex type that describes the extracted text and the location where the text was found.|


## Sample definition

```json
{
    "skills": [
      {
        "description": "Extracts text (plain and structured) from image.",
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

The following example skillset creates a *merged_text* field. This field contains the textual content of your document and the OCRed text from each of the images embedded in that document.

#### Request Body Syntax
```json
{
  "description": "Extract text from images and merge with content text to produce merged_text",
  "skills":
  [
    {
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
          "name": "mergedText", "targetName" : "merged_text"
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
+ [TextMerger skill](cognitive-search-skill-textmerger.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Create Indexer (REST)](https://docs.microsoft.com/rest/api/searchservice/create-indexer)
