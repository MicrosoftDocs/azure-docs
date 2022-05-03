---
title: Layouts - Form Recognizer
titleSuffix: Azure Applied AI Services
description: Learn concepts related to Layout API analysis with Form Recognizer API—usage and limits.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 03/11/2022
ms.author: lajanuar
recommendations: false
ms.custom: ignite-fall-2021
---

# Form Recognizer layout model

The Form Recognizer Layout API extracts text, tables, selection marks, and structure information from documents (PDF, TIFF) and images (JPG, PNG, BMP).

***Sample form processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/layout)***

:::image type="content" source="media/studio/analyze-layout.png" alt-text="Screenshot: Screenshot of sample document processed using Form Recognizer studio":::

**Data extraction features**

| **Layout model**   | **Text Extraction**   | **Selection Marks**   | **Tables**  |
| --- | --- | --- | --- |
| Layout  | ✓  | ✓  | ✓  |

## Development options

The following tools are supported by Form Recognizer v2.1:

| Feature | Resources |
|----------|-------------------------| 
|**Layout API**| <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/layout-analyze)</li><li>[**REST API**](quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#analyze-layout)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?branch=main&tabs=layout#run-the-container-with-the-docker-compose-up-command)</li></ul>|

The following tools are supported by Form Recognizer v3.0:

| Feature | Resources | Model ID |
|----------|------------|------------|
|**Layout model**| <ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md)</li><li>[**JavaScript SDK**](quickstarts/try-v3-javascript-sdk.md)</li></ul>|**prebuilt-layout**|

### Try Form Recognizer

See how data is extracted from forms and documents using the Form Recognizer Studio or Sample Labeling tool. You'll need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

#### Form Recognizer Studio (preview)

> [!NOTE]
> Form Recognizer studio is available with the preview (v3.0) API.

***Sample form processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/layout)***

:::image type="content" source="media/studio/form-recognizer-studio-layout-v3p2.png" alt-text="Screenshot: Layout processing in Form Recognizer Studio.":::

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
* Supported file formats: JPEG/JPG, PNG, BMP, TIFF, and PDF (text-embedded or scanned). Text-embedded PDFs are best to eliminate the possibility of error in character extraction and location.
* For PDF and TIFF, up to 2000 pages can be processed (with a free tier subscription, only the first two pages are processed).
* The file size must be less than 500 MB for paid (S0) tier and 4 MB for free (F0) tier (4 MB for the free tier).
* Image dimensions must be between 50 x 50 pixels and 10,000 x 10,000 pixels.

> [!NOTE]
> The [Sample Labeling tool](https://fott-2-1.azurewebsites.net/) does not support the BMP file format. This is a limitation of the tool not the Form Recognizer Service.

## Supported languages and locales

*See* [Language Support](language-support.md) for a complete list of supported handwritten and printed languages.

## Data extraction

The layout model extracts table structures, selection marks, printed and handwritten text, and bounding box coordinates from your documents.

### Tables and table headers

Layout API extracts tables in the `pageResults` section of the JSON output. Documents can be scanned, photographed, or digitized. Tables can be complex with merged cells or columns, with or without borders, and with odd angles. Extracted table information includes the number of columns and rows, row span, and column span. Each cell with its bounding box is output along with information whether it's recognized as part of a header or not. The model predicted header cells can span multiple rows and aren't necessarily the first rows in a table. They also work with rotated tables. Each table cell also includes the full text with references to the individual words in the `readResults` section.

:::image type="content" source="./media/layout-table-headers-example.png" alt-text="Layout table headers output":::

### Selection marks

Layout API also extracts selection marks from documents. Extracted selection marks include the bounding box, confidence, and state (selected/unselected). Selection mark information is extracted in the `readResults` section of the JSON output.

:::image type="content" source="./media/layout-selection-marks.png" alt-text="Layout selection marks output":::

### Text lines and words

The layout model extracts text from documents and images with multiple text angles and colors. It accepts photos of documents, faxes, printed and/or handwritten (English only) text, and mixed modes. Printed and handwritten text is extracted from lines and words. The service then returns bounding box coordinates, confidence scores, and style (handwritten or other). All the text information is included in the `readResults` section of the JSON output.

:::image type="content" source="./media/layout-text-extraction.png" alt-text="Layout text extraction output":::

### Natural reading order for text lines (Latin only)

In Form Recognizer v2.1, you can specify the order in which the text lines are output with the `readingOrder` query parameter. Use `natural` for a more human-friendly reading order output as shown in the following example. This feature is only supported for Latin languages.

In Form Recognizer v3.0, the natural reading order output is used by the service in all cases. Therefore, there's no `readingOrder` parameter provided in this version.

### Handwritten classification for text lines (Latin only)

The response includes classifying whether each text line is of handwriting style or not, along with a confidence score. This feature is only supported for Latin languages. 

### Select page numbers or ranges for text extraction

For large multi-page documents, use the `pages` query parameter to indicate specific page numbers or page ranges for text extraction. 

## Form Recognizer preview v3.0

 The Form Recognizer preview introduces several new features and capabilities.

* Follow our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md) to learn how to use the preview version in your applications and workflows.

* Explore our [**REST API (preview)**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/AnalyzeDocument) to learn more about the preview version and new capabilities.

## Next steps

* Complete a Form Recognizer quickstart:

  > [!div class="nextstepaction"]
  > [Form Recognizer quickstart](quickstarts/try-sdk-rest-api.md)

* Explore our REST API:

    > [!div class="nextstepaction"]
    > [Form Recognizer API v2.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeLayoutAsync)
