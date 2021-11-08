---
title: Layouts - Form Recognizer
titleSuffix: Azure Applied AI Services
description: Learn concepts related to Layout API analysis with Form Recognizer API—usage and limits.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: lajanuar
recommendations: false
ms.custom: ignite-fall-2021
---

# Form Recognizer layout model

Azure the Form Recognizer Layout API extracts text, tables, selection marks, and structure information from documents (PDF, TIFF) and images (JPG, PNG, BMP).  The layout model combines an enhanced version of our powerful [Optical Character Recognition (OCR)](../../cognitive-services/computer-vision/overview-ocr.md) capabilities with deep learning models to extract text, tables, selection marks, and document structure.

***Sample form processed with [Form Recognizer Sample Labeling tool](https://fott-2-1.azurewebsites.net/)  layout feature***

:::image type="content" source="media/layout-demo.gif" alt-text="Screenshot: Sample Labeling tool processing gif.":::

**Data extraction features**

| **Layout model**   | **Text Extraction**   | **Selection Marks**   | **Tables**  |
| --- | --- | --- | --- |
| Layout  | ✓  | ✓  | ✓  |

## Development options

The following resources are supported by Form Recognizer v2.1:

| Feature | Resources |
|----------|-------------------------| 
|**Layout API**| <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/layout-analyze)</li><li>[**REST API**](quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#analyze-layout)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?branch=main&tabs=layout#run-the-container-with-the-docker-compose-up-command)</li></ul>|

The following resources are supported by Form Recognizer v3.0:

| Feature | Resources | Model ID |
|----------|------------|------------|
|**Layout model**| <ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md)</li><li>[**JavaScript SDK**](quickstarts/try-v3-javascript-sdk.md)</li></ul>|**prebuilt-layout**|

### Try Form Recognizer

See how data, including tables, check boxes, and text, is extracted from forms and documents using the Form Recognizer Studio or our Sample Labeling tool. You'll need the following:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your API key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

#### Form Recognizer Studio (preview)

> [!NOTE]
> Form Recognizer studio is available with the preview (v3.0) API.

***Sample form processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/layout)***

:::image type="content" source="media/studio/sample-layout.png" alt-text="Screenshot: document processing in Form Recognizer Studio.":::

1. On the Form Recognizer Studio home page, select **Layout**

1. You can analyze the sample document or select the **+ Add** button to upload your own sample.

1. Select the **Analyze** button:

    :::image type="content" source="media/studio/layout-analyze.png" alt-text="Screenshot: analyze layout menu.":::

   > [!div class="nextstepaction"]
   > [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/layout)

#### Sample Labeling tool

You'll need a form document. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf).

1. On the Sample Labeling tool home page, select **Use Layout to get text, tables, and selection marks**.

1. Select **Local file** from the dropdown menu.

1. Upload your file and select **Run Layout**

   :::image type="content" source="media/try-layout.png" alt-text="Screenshot: Screenshot: Sample Labeling tool dropdown layout file source selection menu.":::

   > [!div class="nextstepaction"]
   > [Try Sample Labeling tool](https://fott-2-1.azurewebsites.net/prebuilts-analyze)

## Input requirements

* For best results, provide one clear photo or high-quality scan per document.
* Supported file formats: JPEG, PNG, BMP, TIFF, and PDF (text-embedded or scanned). Text-embedded PDFs are best to eliminate the possibility of error in character extraction and location.
* For PDF and TIFF, up to 2000 pages can be processed (with a free tier subscription, only the first two pages are processed).
* The file size must be less than 50 MB.
* Image dimensions must be between 50 x 50 pixels and 10000 x 10000 pixels.
* PDF dimensions are up to 17 x 17 inches, corresponding to Legal or A3 paper size, or smaller.
* The total size of the training data is 500 pages or less.
* If your PDFs are password-locked, you must remove the lock before submission.
* For unsupervised learning (without labeled data):
  * Data must contain keys and values.
  * Keys must appear above or to the left of the values; they can't appear below or to the right.

> [!NOTE]
> The [Sample Labeling tool](https://fott-2-1.azurewebsites.net/) does not support the BMP file format. This is a limitation of the tool not the Form Recognizer Service.

## Supported languages and locales

 Form Recognizer preview version introduces additional language support for the layout model. *See* our [Language Support](language-support.md#layout-and-custom-model) for a complete list of supported handwritten and printed text.

## Features

### Tables and table headers

Layout API extracts tables in the `pageResults` section of the JSON output. Documents can be scanned, photographed, or digitized. Tables can be complex with merged cells or columns, with or without borders, and with odd angles. Extracted table information includes the number of columns and rows, row span, and column span. Each cell with its bounding box is output along with information whether it's recognized as part of a header or not. The model predicted header cells can span multiple rows and are not necessarily the first rows in a table. They also work with rotated tables. Each table cell also includes the full text with references to the individual words in the `readResults` section.

:::image type="content" source="./media/layout-table-headers-example.png" alt-text="Layout table headers output":::

### Selection marks

Layout API also extracts selection marks from documents. Extracted selection marks include the bounding box, confidence, and state (selected/unselected). Selection mark information is extracted in the `readResults` section of the JSON output.

:::image type="content" source="./media/layout-selection-marks.png" alt-text="Layout selection marks output":::

### Text lines and words

Layout API extracts text from documents and images with multiple text angles and colors. It accepts photos of documents, faxes, printed and/or handwritten (English only) text, and mixed modes. Text is extracted with information provided on lines, words, bounding boxes, confidence scores, and style (handwritten or other). All the text information is included in the `readResults` section of the JSON output.

:::image type="content" source="./media/layout-text-extraction.png" alt-text="Layout text extraction output":::

### Natural reading order for text lines (Latin only)

You can specify the order in which the text lines are output with the `readingOrder` query parameter. Use `natural` for a more human-friendly reading order output as shown in the following example. This feature is only supported for Latin languages.

:::image type="content" source="./media/layout-reading-order-example.png" alt-text="Layout Reading order example" lightbox="../../cognitive-services/Computer-vision/Images/ocr-reading-order-example.png":::

### Handwritten classification for text lines (Latin only)

The response includes classifying whether each text line is of handwriting style or not, along with a confidence score. This feature is only supported for Latin languages. The following example shows the handwritten classification for the text in the image.

:::image type="content" source="./media/layout-handwriting-classification.png" alt-text="handwriting classification example":::

### Select page numbers or ranges for text extraction

For large multi-page documents, use the `pages` query parameter to indicate specific page numbers or page ranges for text extraction. The following example shows a document with 10 pages, with text extracted for both cases - all pages (1-10) and selected pages (3-6).

:::image type="content" source="./media/layout-select-pages-for-text.png" alt-text="Layout selected pages output":::

## Form Recognizer preview v3.0

 The Form Recognizer preview introduces several new features and capabilities.

* Follow our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md) to learn how to use the preview version in your applications and workflows.

* Explore our [**REST API (preview)**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument) to learn more about the preview version and new capabilities.

## Next steps

* Complete a Form Recognizer quickstart:

  > [!div class="nextstepaction"]
  > [Form Recognizer quickstart](quickstarts/try-sdk-rest-api.md)

* Explore our REST API:

    > [!div class="nextstepaction"]
    > [Form Recognizer API v2.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeLayoutAsync)
