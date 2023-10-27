---
title: OCR Azure AI Searchskill
titleSuffix: Azure AI Search
description: Extract text from image files using optical character recognition (OCR) in an enrichment pipeline in Azure AI Search.

author: careyjmac
ms.author: chalton

ms.service: cognitive-search
ms.custom: 
ms.topic: reference
ms.date: 06/24/2022
---
# OCR Azure AI Searchskill

The **Optical character recognition (OCR)** skill recognizes printed and handwritten text in image files. This article is the reference documentation for the OCR skill. See [Extract text from images](cognitive-search-concept-image-scenarios.md) for usage instructions.

An OCR skill uses the machine learning models provided by [Azure AI Vision](../ai-services/computer-vision/overview.md) API [v3.2](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/5d986960601faab4bf452005) in Azure AI services. The **OCR** skill maps to the following functionality:

+ For the languages listed under [Azure AI Vision language support](../ai-services/computer-vision/language-support.md#optical-character-recognition-ocr), the [Read API](../ai-services/computer-vision/overview-ocr.md) is used.
+ For Greek and Serbian Cyrillic, the [legacy OCR](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f20d) API is used.

The **OCR** skill extracts text from image files. Supported file formats include:

+ .JPEG
+ .JPG
+ .PNG
+ .BMP
+ .TIFF

> [!NOTE]
> This skill is bound to Azure AI services and requires [a billable resource](cognitive-search-attach-cognitive-services.md) for transactions that exceed 20 documents per indexer per day. Execution of built-in skills is charged at the existing [Azure AI services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/).
>
> In addition, image extraction is [billable by Azure AI Search](https://azure.microsoft.com/pricing/details/search/).
>

## Skill parameters

Parameters are case-sensitive.

| Parameter name     | Description |
|--------------------|-------------|
| `detectOrientation`    | Detects image orientation. Valid values are `true` or `false`. </p>This parameter only applies if the [legacy OCR](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f20d) API is used.  |
| `defaultLanguageCode` | Language code of the input text. Supported languages include all of the [generally available languages](../ai-services/computer-vision/language-support.md#image-analysis) of Azure AI Vision. You can also specify `unk` (Unknown). </p>If the language code is unspecified or null, the language is set to English. If the language is explicitly set to `unk`, all languages found are auto-detected and returned.|
| `lineEnding` | The value to use as a line separator. Possible values: "Space", "CarriageReturn", "LineFeed".  The default is "Space". |

In previous versions, there was a parameter called "textExtractionAlgorithm" to specify extraction of "printed" or "handwritten" text. This parameter is deprecated because the current Read API algorithm extracts both types of text at once. If your skill includes this parameter, you don't need to remove it, but it won't be used during skill execution.

## Skill inputs

| Input name      | Description                                          |
|---------------|------------------------------------------------------|
| `image`         | Complex Type. Currently only works with "/document/normalized_images" field, produced by the Azure Blob indexer when ```imageAction``` is set to a value other than ```none```. |

## Skill outputs

| Output name      | Description                   |
|---------------|-------------------------------|
| `text`             | Plain text extracted from the image.   |
| `layoutText`    | Complex type that describes the extracted text and the location where the text was found.|

If you call OCR on images embedded in PDFs or other application files, the OCR output will be located at the bottom of the page, after any text that was extracted and processed.

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

## Sample: Merging text extracted from embedded images with the content of the document

Document cracking, the first step in skillset execution, separates text and image content. A common use case for Text Merger is merging the textual representation of images (text from an OCR skill, or the caption of an image) into the content field of a document. This is for scenarios where the source document is a PDF or Word document that combines text with embedded images.

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
          "name":"text",
          "source": "/document/content"
        },
        {
          "name": "itemsToInsert", 
          "source": "/document/normalized_images/*/text"
        },
        {
          "name":"offsets", 
          "source": "/document/normalized_images/*/contentOffset"
        }
      ],
      "outputs": [
        {
          "name": "mergedText", 
          "targetName" : "merged_text"
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

+ [What is optical character recognition](../ai-services/computer-vision/overview-ocr.md)
+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [TextMerger skill](cognitive-search-skill-textmerger.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Extract text and information from images](cognitive-search-concept-image-scenarios.md)
+ [Create Indexer (REST)](/rest/api/searchservice/create-indexer)
