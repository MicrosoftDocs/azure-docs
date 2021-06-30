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

You submit either a local image or a remote image to the Read API. For local, you put the binary image data in the HTTP request body. For remote, you specify the image's URL by formatting the request body like the following: `{"url":"http://example.com/images/test.jpg"}`.

The Read API's [Read call](https://centraluseuap.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/5d986960601faab4bf452005) takes an image or PDF document as the input and extracts text asynchronously.

`https://{endpoint}/vision/v3.2/read/analyze[?language][&pages][&readingOrder]`

The call returns with a response header field called `Operation-Location`. The `Operation-Location` value is a URL that contains the Operation ID to be used in the next step.

|Response header| Example value |
|:-----|:----|
|Operation-Location | `https://cognitiveservice/vision/v3.2/read/analyzeResults/49a36324-fc4b-4387-aa06-090cfbf0064f` |

> [!NOTE]
> **Billing** 
>
> The [Computer Vision pricing](https://azure.microsoft.com/pricing/details/cognitive-services/computer-vision/) page includes the pricing tier for Read. Each analyzed image or page is one transaction. If you call the operation with a PDF or TIFF document containing 100 pages, the Read operation will count it as 100 transactions and you will be billed for 100 transactions. If you made 50 calls to the operation and each call submitted a document with 100 pages, you will be billed for 50 X 100 = 5000 transactions.

## Determine how to process the data

### Language specification

The [Read](https://centraluseuap.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/5d986960601faab4bf452005) call has an optional request parameter for language. Read supports auto language identification and multilingual documents, so only provide a language code if you would like to force the document to be processed as that specific language.

### Natural reading order output (Latin languages only)

Specify the order in which the text lines are output with the `readingOrder` query parameter. Use `natural` for a more human-friendly reading order output as shown in the following example. This feature is only supported for Latin languages.

:::image type="content" source="../Images/ocr-reading-order-example.png" alt-text="OCR Reading order example" border="true" :::

### Select page(s) or page ranges for text extraction

For large multi-page documents, use the `pages` query parameter to specify page numbers or page ranges to extract text from only those pages. The following example shows a document with 10 pages, with text extracted for both cases - all pages (1-10) and selected pages (3-6).

:::image type="content" source="../Images/ocr-select-pages.png" alt-text="Selected pages output" border="true" :::

## Get results from the service

The second step is to call [Get Read Results](https://centraluseuap.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/5d9869604be85dee480c8750) operation. This operation takes as input the operation ID that was created by the Read operation.

`https://{endpoint}/vision/v3.2/read/analyzeResults/{operationId}`

It returns a JSON response that contains a **status** field with the following possible values.

|Value | Meaning |
|:-----|:----|
| `notStarted`| The operation has not started. |
| `running`| The operation is being processed. |
| `failed`| The operation has failed. |
| `succeeded`| The operation has succeeded. |

You call this operation iteratively until it returns with the **succeeded** value. Use an interval of 1 to 2 seconds to avoid exceeding the requests per second (RPS) rate.

> [!NOTE]
> The free tier limits the request rate to 20 calls per minute. The paid tier allows 10 requests per second (RPS) that can be increased upon request. Note your Azure resource identfier and region, and open an Azure support ticket or contact your account team to request a higher request per second (RPS) rate.

When the **status** field has the `succeeded` value, the JSON response contains the extracted text content from your image or document. The JSON response maintains the original line groupings of recognized words. It includes the extracted text lines and their bounding box coordinates. Each text line includes all extracted words with their coordinates and confidence scores.

> [!NOTE]
> The data submitted to the `Read` operation are temporarily encrypted and stored at rest for a short duration, and then deleted. This lets your applications retrieve the extracted text as part of the service response.

### Sample JSON output

See the following example of a successful JSON response:

```json
{
  "status": "succeeded",
  "createdDateTime": "2021-02-04T06:32:08.2752706+00:00",
  "lastUpdatedDateTime": "2021-02-04T06:32:08.7706172+00:00",
  "analyzeResult": {
    "version": "3.2",
    "readResults": [
      {
        "page": 1,
        "angle": 2.1243,
        "width": 502,
        "height": 252,
        "unit": "pixel",
        "lines": [
          {
            "boundingBox": [
              58,
              42,
              314,
              59,
              311,
              123,
              56,
              121
            ],
            "text": "Tabs vs",
            "appearance": {
              "style": {
                "name": "handwriting",
                "confidence": 0.96
              }
            },
            "words": [
              {
                "boundingBox": [
                  68,
                  44,
                  225,
                  59,
                  224,
                  122,
                  66,
                  123
                ],
                "text": "Tabs",
                "confidence": 0.933
              },
              {
                "boundingBox": [
                  241,
                  61,
                  314,
                  72,
                  314,
                  123,
                  239,
                  122
                ],
                "text": "vs",
                "confidence": 0.977
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

The response includes classifying whether each text line is of handwriting style or not, along with a confidence score. This feature is only supported for Latin languages. The following example shows the handwritten classification for the text in the image.

:::image type="content" source="../Images/ocr-handwriting-classification.png" alt-text="OCR handwriting classification example" border="true" :::

## Next steps

To try out the REST API, go to the [Read API Reference](https://centraluseuap.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/5d986960601faab4bf452005).
