---
title: Read - Form Recognizer
titleSuffix: Azure Applied AI Services
description: Learn concepts related to Read API analysis with Form Recognizer API—usage and limits.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 03/09/2022
ms.author: lajanuar
recommendations: false
ms.custom: ignite-fall-2021
---

# Form Recognizer read model

The Form Recognizer v3.0 preview includes the new Read API. Read extracts text lines, words, their locations, detected languages, and handwritten style if detected from documents (PDF and TIFF) and images (JPG, PNG, and BMP).

## Development options

The following resources are supported by Form Recognizer v3.0:

| Feature | Resources | Model ID |
|----------|------------|------------|
|**Read model**| <ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md)</li><li>[**JavaScript SDK**](quickstarts/try-v3-javascript-sdk.md)</li></ul>|**prebuilt-read**|

## Data extraction

| **Read model**   | **Text Extraction**   | **[Language detection](language-support.md#detected-languages-by-read)** |
| --- | --- | --- | 
prebuilt-read  | ✓  |✓  |

### Try Form Recognizer

See how text is extracted from forms and documents using the Form Recognizer Studio. You'll need the following assets:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your API key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

#### Form Recognizer Studio (preview)

> [!NOTE]
> Form Recognizer studio is available with the preview (v3.0) API.

***Sample form processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/read)***

:::image type="content" source="media/studio/form-recognizer-studio-read-v3p2-updated.png" alt-text="Screenshot: Read processing in Form Recognizer Studio.":::

1. On the Form Recognizer Studio home page, select **Read**

1. You can analyze the sample document or select the **+ Add** button to upload your own sample.

1. Select the **Analyze** button:

    :::image type="content" source="media/studio/form-recognizer-studio-read-analyze-v3p2-updated.png" alt-text="Screenshot: analyze read menu.":::

   > [!div class="nextstepaction"]
   > [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/layout)

## Input requirements

* For best results, provide one clear photo or high-quality scan per document.
* Supported file formats: JPEG, PNG, BMP, TIFF, and PDF (text-embedded or scanned). Text-embedded PDFs are best to eliminate the possibility of error in character extraction and location.
* For PDF and TIFF, up to 2000 pages can be processed (with a free tier subscription, only the first two pages are processed).
* The file size must be less than 50 MB.
* Image dimensions must be between 50 x 50 pixels and 10,000 x 10,000 pixels.

## Supported languages and locales

Form Recognizer preview version supports several languages for the read model. *See* our [Language Support](language-support.md) for a complete list of supported handwritten and printed languages.

## Features

### Text lines and words

Read API extracts text from documents and images with multiple text angles and colors. It accepts photos of documents, faxes, printed and/or handwritten (English only) text, and mixed modes. Text is extracted with information provided on lines, words, bounding boxes, confidence scores, and style (handwritten or other).

### Language detection (v3.0 preview)

Read API in v3.0 preview 2 adds [language detection](language-support.md#detected-languages-by-read) as a new feature for text lines. Read will predict the language at the text line level along with the confidence score.

### Handwritten classification for text lines (Latin only)

The response includes classifying whether each text line is of handwriting style or not, along with a confidence score. This feature is only supported for Latin languages. 

### Select page (s) for text extraction

For large multi-page documents, use the `pages` query parameter to indicate specific page numbers or page ranges for text extraction. 

## Next steps

* Complete a Form Recognizer quickstart:

  > [!div class="nextstepaction"]
  > [Form Recognizer quickstart](quickstarts/try-sdk-rest-api.md)

* Explore our REST API:

    > [!div class="nextstepaction"]
    > [Form Recognizer API v3.0](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/AnalyzeDocument)
