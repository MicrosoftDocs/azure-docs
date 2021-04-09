---
title: How to call the Read API
titleSuffix: Azure Cognitive Services
description: Learn how to call the Read API and configure its behavior in detail.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 03/31/2021
ms.author: pafarley
---

# Call the Read API

In this guide, you'll learn how to call the Read API to extract text from images. You'll learn the different ways you can configure the behavior of this API to meet your needs.

This guide assumes you have already <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="created a Computer Vision resource"  target="_blank">create a Computer Vision resource </a> and obtained a subscription key and endpoint URL. If you haven't, follow a [quickstart](../quickstarts-sdk/client-library.md) to get started.

## Submit data to the service

The Read API's [Read call](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2-preview-3/operations/5d986960601faab4bf452005) takes an image or PDF document as the input and extracts text asynchronously.

`https://{endpoint}/vision/v3.2-preview.3/read/analyze[?language][&pages][&readingOrder]`

The call returns with a response header field called `Operation-Location`. The `Operation-Location` value is a URL that contains the Operation ID to be used in the next step.

|Response header| Example value |
|:-----|:----|
|Operation-Location | `https://cognitiveservice/vision/v3.1/read/analyzeResults/49a36324-fc4b-4387-aa06-090cfbf0064f` |

> [!NOTE]
> **Billing** 
>
> The [Computer Vision pricing](https://azure.microsoft.com/pricing/details/cognitive-services/computer-vision/) page includes the pricing tier for Read. Each analyzed image or page is one transaction. If you call the operation with a PDF or TIFF document containing 100 pages, the Read operation will count it as 100 transactions and you will be billed for 100 transactions. If you made 50 calls to the operation and each call submitted a document with 100 pages, you will be billed for 50 X 100 = 5000 transactions.

## Determine how to process the data

### Language specification

The [Read](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-1-ga/operations/5d986960601faab4bf452005) call has an optional request parameter for language. Read supports auto language identification and multilingual documents, so only provide a language code if you would like to force the document to be processed as that specific language.

### Natural reading order output (Latin languages only)
With the [Read 3.2 preview API](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2-preview-3/operations/5d986960601faab4bf452005), you can specify the order in which the text lines are output with the `readingOrder` query parameter. Use `natural` for a more human-friendly reading order output as shown in the following example. This feature is only supported for Latin languages.

:::image border type="content" source="../Images/ocr-reading-order-example.png" alt-text="OCR Reading order example":::



### Select page(s) or page ranges for text extraction
With the [Read 3.2 preview API](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2-preview-3/operations/5d986960601faab4bf452005), for large multi-page documents, use the `pages` query parameter to specify page numbers or page ranges to extract text from only those pages. The following example shows a document with 10 pages, with text extracted for both cases - all pages (1-10) and selected pages (3-6).

:::image border type="content" source="../Images/ocr-select-pages.png" alt-text="Selected pages output":::

## Get results from the service

The second step is to call [Get Read Results](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-1-ga/operations/5d9869604be85dee480c8750) operation. This operation takes as input the operation ID that was created by the Read operation. 

`https://{endpoint}/vision/v3.2-preview.3/read/analyzeResults/{operationId}`

It returns a JSON response that contains a **status** field with the following possible values. 

|Value | Meaning |
|:-----|:----|
| `notStarted`| The operation has not started. |
| `running`| The operation is being processed. |
| `failed`| The operation has failed. |
| `succeeded`| The operation has succeeded. |

You call this operation iteratively until it returns with the **succeeded** value. Use an interval of 1 to 2 seconds to avoid exceeding the requests per second (RPS) rate.

> [!NOTE]
> The free tier limits the request rate to 20 calls per minute. The paid tier allows 10 requests per second (RPS) that can be increased upon request. Use the Azure support channel or your account team to request a higher request per second (RPS) rate.

When the **status** field has the `succeeded` value, the JSON response contains the extracted text content from your image or document. The JSON response maintains the original line groupings of recognized words. It includes the extracted text lines and their bounding box coordinates. Each text line includes all extracted words with their coordinates and confidence scores.

> [!NOTE]
> The data submitted to the `Read` operation are temporarily encrypted and stored at rest for a short duration, and then deleted. This lets your applications retrieve the extracted text as part of the service response.

### Sample JSON output

See the following example of a successful JSON response:

```json
{
  "status": "succeeded",
  "createdDateTime": "2020-05-28T05:13:21Z",
  "lastUpdatedDateTime": "2020-05-28T05:13:22Z",
  "analyzeResult": {
    "version": "3.1.0",
    "readResults": [
      {
        "page": 1,
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

### Handwritten classification for text lines (Latin languages only)
The [Read 3.2 preview API](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2-preview-3/operations/5d986960601faab4bf452005) response includes classifying whether each text line is of handwriting style or not, along with a confidence score. This feature is only supported for Latin languages. The following example shows the handwritten classification for the text in the image.

:::image border type="content" source="../Images/ocr-handwriting-classification.png" alt-text="OCR handwriting classification example":::

## Next steps

To try out the REST API, go to the [Read API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2-preview-3/operations/5d986960601faab4bf452005).