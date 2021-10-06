---
title: Layouts - Form Recognizer
titleSuffix: Azure Applied AI Services
description: Learn concepts related to layout analysis with the Form Recognizer API - usage and limits.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 08/09/2021
ms.author: lajanuar
---

# Form Recognizer layout model

Azure Form Recognizer's Layout API extracts text, tables, selection marks, and structure information from documents (PDF, TIFF) and images (JPG, PNG, BMP). It enables customers to take documents in a variety of formats and return structured data representations of the documents. It combines an enhanced version of our powerful [Optical Character Recognition (OCR)](../../cognitive-services/computer-vision/overview-ocr.md) capabilities with deep learning models to extract text, tables, selection marks, and document structure.

##### Sample form processed with [Form Recognizer sample labeling tool](https://fott-2-1.azurewebsites.net/)  layout feature:

:::image type="content" source="media/overview-layout.png" alt-text="{alt-text}":::

**Data extraction features**

| **Layout model**   | **Text Extraction**   | **Selection Marks**   | **Tables**  |
| --- | --- | --- | --- |
| Layout  | ✓  | ✓  | ✓  |  

## Try it: Sample labeling tool

You can see how invoice data is extracted by trying our Sample Labeling tool. You'll need the following:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance]((https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) ) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, click **Go to resource** to get your API key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

* An form document. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf).

> [!div class="nextstepaction"]
  > [Try it](https://fott-2-1.azurewebsites.net/prebuilts-analyze)

  In the Form Recognizer UI:

  1. Select **Use Layout to bet text, tables, and selection marks**.
  1. Select **Local file** from the dropdown menu.
  1. Upload your file and select **Run Layout**

  :::image type="content" source="media/try-layout.png" alt-text="Screenshot: Screenshot: sample labeling tool dropdown layout file source selection menu.":::

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
  * data must contain keys and values.
  * keys must appear above or to the left of the values; they can't appear below or to the right.



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

## Next steps

* Try your own layout extraction using the [Form Recognizer Sample UI tool](https://aka.ms/fott-2.1-ga)
* Complete a [Form Recognizer quickstart](quickstarts/client-library.md#analyze-layout) to get started extracting layouts in the development language of your choice.

## See also

* [What is Form Recognizer?](./overview.md)
* [REST API reference docs](https://westcentralus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeLayoutAsync)
