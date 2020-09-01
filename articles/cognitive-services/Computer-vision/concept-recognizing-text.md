---
title: Optical Character Recognition (OCR) - Computer Vision
titleSuffix: Azure Cognitive Services
description: Concepts related to optical character recognition (OCR) of images and documents with printed and handwritten text using the Computer Vision API.
services: cognitive-services
author: PatrickFarley
manager: netahw

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 08/11/2020
ms.author: pafarley
ms.custom: "seodec18, devx-track-csharp"
---

# Optical Character Recognition (OCR)

Azure's Computer Vision API includes Optical Character Recognition (OCR) capabilities that extract printed or handwritten text from images. You can extract text from images, such as photos of license plates or containers with serial numbers, as well as from documents - invoices, bills, financial reports, articles, and more. 

## Read API 

The Computer Vision [Read API](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-ga/operations/5d986960601faab4bf452005) is Azure's latest OCR technology that extracts printed text (in several languages), handwritten text (English only), digits, and currency symbols from images and multi-page PDF documents. It's optimized to extract text from text-heavy images and multi-page PDF documents with mixed languages. It supports detecting both printed and handwritten text in the same image or document.

![How OCR converts images and documents into structured output with extracted text](./Images/how-ocr-works.svg)

## Input requirements
The Read API's **Read** operation takes images and documents as its input. They have the following requirements:

* Supported file formats: JPEG, PNG, BMP, PDF, and TIFF
* For PDF AND TIFF, up to 2000 pages are processed. For free tier subscribers, only the first two pages are processed.
* The file size must be less than 50 MB and dimensions at least 50 x 50 pixels and at most 10000 x 10000 pixels.
* The PDF dimensions must be at most 17 x 17 inches, corresponding to legal or A3 paper sizes and smaller.

> [!NOTE]
> **Language input** 
>
> The [Read operation](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-ga/operations/5d986960601faab4bf452005) has an optional request parameter for language. This is the BCP-47 language code of the text in the document. Read supports auto language identification and multilingual documents, so only provide a language code if you would like to force the document to be processed as that specific language.

## The Read operation

The [Read operation](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-ga/operations/5d986960601faab4bf452005) takes an image or PDF document as the input and extracts text asynchronously. The call returns with a response header field called `Operation-Location`. The `Operation-Location` value is a URL that contains the Operation ID to be used in the next step.

|Response header| Result URL |
|:-----|:----|
|Operation-Location | `https://cognitiveservice/vision/v3.0/read/analyzeResults/49a36324-fc4b-4387-aa06-090cfbf0064f` |

## The Get Read Results operation

The second step is to call the [Get Read Results](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-ga/operations/5d9869604be85dee480c8750) operation. This operation takes as input the operation ID that was created by the Read operation. It returns a JSON response that contains a **status** field with the following possible values. You call this operation iteratively until it returns with the **succeeded** value. Use an interval of 1 to 2 seconds to avoid exceeding the requests per second (RPS) rate.

|Field| Type | Possible values |
|:-----|:----:|:----|
|status | string | notStarted: The operation has not started. |
| |  | running: The operation is being processed. |
| |  | failed: The operation has failed. |
| |  | succeeded: The operation has succeeded. |

> [!NOTE]
> The free tier limits the request rate to 20 calls per minute. The paid tier allows 10 requests per second (RPS) that can be increased upon request. Use the Azure support channel or your account team to request a higher request per second (RPS) rate.

When the **status** field has the **succeeded** value, the JSON response contains the extracted text content from your image or document. The JSON response maintains the original line groupings of recognized words. It includes the extracted text lines and their bounding box coordinates. Each text line includes all extracted words with their coordinates and confidence scores.

### Sample JSON output

See the following example of a successful JSON response:

```json
{
  "status": "succeeded",
  "createdDateTime": "2020-05-28T05:13:21Z",
  "lastUpdatedDateTime": "2020-05-28T05:13:22Z",
  "analyzeResult": {
    "version": "3.0.0",
    "readResults": [
      {
        "page": 1,
        "language": "en",
        "angle": 0.8551,
        "width": 2661,
        "height": 1901,
        "unit": "pixel",
        "lines": [
          {
            "boundingBox": [
              67,
              646,
              2582,
              713,
              2580,
              876,
              67,
              821
            ],
            "text": "The quick brown fox jumps",
            "words": [
              {
                "boundingBox": [
                  143,
                  650,
                  435,
                  661,
                  436,
                  823,
                  144,
                  824
                ],
                "text": "The",
                "confidence": 0.958
              }
            ]
          }
        ]
      }
    ]
  }
}
```

Follow the [Extract printed and handwritten text](./QuickStarts/CSharp-hand-text.md) quickstart to implement OCR using C# and the REST API.

## Language support

### Printed text
The [Read 3.0 API](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-ga/operations/5d986960601faab4bf452005) supports extracting printed text in English, Spanish, German, French, Italian, Portuguese, and Dutch languages. 

The [Read 3.1 API public preview](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-1-preview-1/operations/5d986960601faab4bf452005) adds support for Simplified Chinese. If your scenario requires supporting more languages, see the [OCR API](#ocr-api) section. 

See the [Supported languages](https://docs.microsoft.com/azure/cognitive-services/computer-vision/language-support#optical-character-recognition-ocr) for the full list of OCR-supported languages.

### Handwritten text
The Read operation currently supports extracting handwritten text exclusively in English.

## Integration options

### Use the REST API or client SDK
The [Read 3.x REST API](./QuickStarts/CSharp-hand-text.md) is the preferred option for most customers because of ease of integration and fast productivity out of the box. Azure and the Computer Vision service handle scale, performance, data security, and compliance needs while you focus on meeting your customers' needs.

### Use containers for on-premise deployment
The [Read 2.0 Docker container (preview)](https://docs.microsoft.com/azure/cognitive-services/computer-vision/computer-vision-how-to-install-containers) enables you to deploy the new OCR capabilities in your own local environment. Containers are great for specific security and data governance requirements.

## Read OCR examples

### Text from images

The following Read API output shows the extracted text from an image with different text angles, colors, and fonts.

![An image of several words at different colors and angles, with extracted text listed](./Images/text-from-images-example.png)

### Text from documents

Read API can also take PDF documents as input.

![An invoice document, with extracted text listed](./Images/text-from-pdf-example.png)

### Handwritten text

The Read operation extracts handwritten text from images (currently only in English).

![An image of a handwritten note, with extracted text listed](./Images/handwritten-example.png)

### Printed text

The Read operation can extract printed text in several different languages.

![An image of a Spanish textbook, with extracted text listed](./Images/supported-languages-example.png)

### Mixed language documents

The Read API supports images and documents that contain multiple different languages, commonly known as mixed language documents. It works by classifying each text line in the document into the detected language before extracting its text contents.

![An image of phrases in several languages, with extracted text listed](./Images/mixed-language-example.png)

## OCR API

The [OCR API](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fc) uses an older recognition model, supports only images, and executes synchronously, returning immediately with the detected text. See the [OCR supported languages](https://docs.microsoft.com/azure/cognitive-services/computer-vision/language-support#optical-character-recognition-ocr) then Read API.

## Data privacy and security

As with all the cognitive services, developers using the Read/OCR services should be aware of Microsoft policies on customer data. See the Cognitive Services page on the [Microsoft Trust Center](https://www.microsoft.com/trust-center/product-overview) to learn more.

> [!NOTE]
> The Computer Vison 2.0 RecognizeText operations are in the process of getting deprecated in favor of the new Read API covered in this article. Existing customers should [transition to using Read operations](upgrade-api-versions.md).

## Next steps

- Learn about the [Read 3.0 REST API](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-ga/operations/5d986960601faab4bf452005).
- Learn about the [Read 3.1 public preview REST API](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-1-preview-1/operations/5d986960601faab4bf452005) with added support for Simplified Chinese.
- Follow the [Extract text](./QuickStarts/CSharp-hand-text.md) quickstart to implement OCR using C#, Java, JavaScript, or Python along with REST API.
