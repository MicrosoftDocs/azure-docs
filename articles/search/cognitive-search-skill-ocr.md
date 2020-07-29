---
title: OCR cognitive skill
titleSuffix: Azure Cognitive Search
description: Extract text from image files using optical character recognition (OCR) in an enrichment pipeline in Azure Cognitive Search.

manager: nitinme
author: luiscabrer
ms.author: luisca
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---
# OCR cognitive skill

The **Optical character recognition (OCR)** skill recognizes printed and handwritten text in image files. This skill uses the machine learning models provided by [Computer Vision](https://docs.microsoft.com/azure/cognitive-services/computer-vision/home) API [v3.0](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-ga/operations/5d986960601faab4bf452005) in Cognitive Services. The **OCR** skill maps to the following functionality:

+ For English, Spanish, German, French, Italian, Portuguese, and Dutch, the new ["Read"](../cognitive-services/computer-vision/concept-recognizing-text.md#read-api) API is used.
+ For all other languages, the ["OCR"](../cognitive-services/computer-vision/concept-recognizing-text.md#ocr-optical-character-recognition-api) API is used.

The **OCR** skill extracts text from image files. Supported file formats include:

+ .JPEG
+ .JPG
+ .PNG
+ .BMP
+ .GIF
+ .TIFF

> [!NOTE]
> As you expand scope by increasing the frequency of processing, adding more documents, or adding more AI algorithms, you will need to [attach a billable Cognitive Services resource](cognitive-search-attach-cognitive-services.md). Charges accrue when calling APIs in Cognitive Services, and for image extraction as part of the document-cracking stage in Azure Cognitive Search. There are no charges for text extraction from documents.
>
> Execution of built-in skills is charged at the existing [Cognitive Services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/). Image extraction pricing is described on the [Azure Cognitive Search pricing page](https://go.microsoft.com/fwlink/?linkid=2042400).


## Skill parameters

Parameters are case-sensitive.

| Parameter name	 | Description |
|--------------------|-------------|
| detectOrientation	| Enables autodetection of image orientation. <br/> Valid values: true / false.|
|defaultLanguageCode | <p>	Language code of the input text. Supported languages include: <br/> zh-Hans (ChineseSimplified) <br/> zh-Hant (ChineseTraditional) <br/>cs (Czech) <br/>da (Danish) <br/>nl (Dutch) <br/>en (English) <br/>fi (Finnish)  <br/>fr (French) <br/>  de (German) <br/>el (Greek) <br/> hu (Hungarian) <br/> it (Italian) <br/>  ja (Japanese) <br/> ko (Korean) <br/> nb (Norwegian) <br/>   pl (Polish) <br/> pt (Portuguese) <br/>  ru (Russian) <br/>  es (Spanish) <br/>  sv (Swedish) <br/>  tr (Turkish) <br/> ar (Arabic) <br/> ro (Romanian) <br/> sr-Cyrl (SerbianCyrillic) <br/> sr-Latn (SerbianLatin) <br/>  sk (Slovak) <br/>  unk (Unknown) <br/><br/> If the language code is unspecified or null, the language will be set to English. If the language is explicitly set to "unk", the language will be auto-detected. </p> |
|lineEnding | The value to use between each detected line. Possible values: "Space", "CarriageReturn", "LineFeed".  The default is "Space". |

Previously, there was a parameter called "textExtractionAlgorithm" for specifying whether the skill should extract "printed" or "handwritten" text.  This parameter is deprecated and no longer necessary as the latest Read API algorithm is capable of extracting both types of text at once.  If your skill definition already includes this parameter, you do not need to remove it, but it will no longer be used and both types of text will be extracted going forward regardless of what it is set to.

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
  "parameters": {
    "configuration": {
      "dataToExtract":"contentAndMetadata",
      "imageAction":"generateNormalizedImages"
    }
  }
}
```

## See also
+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [TextMerger skill](cognitive-search-skill-textmerger.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Create Indexer (REST)](https://docs.microsoft.com/rest/api/searchservice/create-indexer)
