---
title: Read model OCR data extraction - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Extract print and handwritten text from scanned and digital documents with Document Intelligence's Read OCR model.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/21/2023
ms.author: lajanuar
---


# Document Intelligence read model

::: moniker range="doc-intel-4.0.0"
[!INCLUDE [preview-version-notice](includes/preview-notice.md)]

**This content applies to:**![checkmark](media/yes-icon.png) **v4.0 (preview)** | **Previous versions:** ![blue-checkmark](media/blue-yes-icon.png) [**v3.1 (GA)**](?view=doc-intel-3.1.0&preserve-view=tru) ![blue-checkmark](media/blue-yes-icon.png) [**v3.0 (GA)**](?view=doc-intel-3.0.0&preserve-view=tru)
::: moniker-end

::: moniker range="doc-intel-3.1.0"
**This content applies to:** ![checkmark](media/yes-icon.png) **v3.1 (GA)** | **Latest version:** ![purple-checkmark](media/purple-yes-icon.png) [**v4.0 (preview)**](?view=doc-intel-4.0.0&preserve-view=true) | **Previous versions:** ![blue-checkmark](media/blue-yes-icon.png) [**v3.0**](?view=doc-intel-3.0.0&preserve-view=true)
::: moniker-end

::: moniker range="doc-intel-3.0.0"
**This content applies to:** ![checkmark](media/yes-icon.png) **v3.0 (GA)** | **Latest versions:** ![purple-checkmark](media/purple-yes-icon.png) [**v4.0 (preview)**](?view=doc-intel-4.0.0&preserve-view=true) ![purple-checkmark](media/purple-yes-icon.png) [**v3.1 (preview)**](?view=doc-intel-3.1.0&preserve-view=true)
::: moniker-end

> [!NOTE]
>
> For extracting text from external images like labels, street signs, and posters, use the [Azure AI Vision v4.0 preview Read](../../ai-services/Computer-vision/concept-ocr.md) feature optimized for general, non-document images with a performance-enhanced synchronous API that makes it easier to embed OCR in your user experience scenarios.
>

Document Intelligence Read Optical Character Recognition (OCR) model runs at a higher resolution than Azure AI Vision Read and extracts print and handwritten text from PDF documents and scanned images. It also includes support for extracting text from Microsoft Word, Excel, PowerPoint, and HTML documents. It detects paragraphs, text lines, words, locations, and languages. The Read model is the underlying OCR engine for other Document Intelligence prebuilt models like Layout, General Document, Invoice, Receipt, Identity (ID) document, Health insurance card, W2 in addition to custom models.

## What is OCR for documents?

Optical Character Recognition (OCR) for documents is optimized for large text-heavy documents in multiple file formats and global languages. It includes features like higher-resolution scanning of document images for better handling of smaller and dense text; paragraph detection; and fillable form management. OCR capabilities also include advanced scenarios like single character boxes and accurate extraction of key fields commonly found in invoices, receipts, and other prebuilt scenarios.

## Development options

::: moniker range="doc-intel-4.0.0"

Document Intelligence v4.0 (2023-10-31-preview) supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**Read OCR model**|&bullet; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</br>&bullet;  [**REST API**](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-10-31-preview&preserve-view=true&tabs=HTTP)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)|**prebuilt-read**|
::: moniker-end

::: moniker range="doc-intel-3.1.0"

Document Intelligence v3.1 supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**Read OCR model**|&bullet; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</br>&bullet;  [**REST API**](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)|**prebuilt-read**|
::: moniker-end

::: moniker range="doc-intel-3.0.0"

Document Intelligence v3.0 supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**Read OCR model**|&bullet; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</br>&bullet;  [**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)|**prebuilt-read**|
::: moniker-end

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Read model data extraction

Try extracting text from forms and documents using the Document Intelligence Studio. You need the following assets:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Document Intelligence instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

> [!NOTE]
> Currently, Document Intelligence Studio doesn't support Microsoft Word, Excel, PowerPoint, and HTML file formats.

***Sample document processed with [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/read)***

:::image type="content" source="media/studio/form-recognizer-studio-read-v3p2-updated.png" alt-text="Screenshot of Read processing in Document Intelligence Studio.":::

1. On the Document Intelligence Studio home page, select **Read**

1. You can analyze the sample document or upload your own files.

1. Select the **Run analysis** button and, if necessary, configure the **Analyze options** :

    :::image type="content" source="media/studio/run-analysis-analyze-options.png" alt-text="Screenshot of Run analysis and Analyze options buttons in the Document Intelligence Studio.":::

   > [!div class="nextstepaction"]
   > [Try Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/layout)

## Supported extracted languages and locales

*See* our [Language Support—document analysis models](language-support-ocr.md) page for a complete list of supported languages.

### Microsoft Office and HTML text extraction

Use the parameter `api-version=2023-07-31` when using the REST API or the corresponding SDKs of that API version to extract text from Microsoft Word, Excel, PowerPoint, and HTML files. The following illustration shows extraction of the digital text and text in the Word document by running OCR on the images. Text from embedded images isn't included in the extraction.

> [!NOTE]
>
> * [Add-on capabilities](concept-add-on-capabilities.md) are not supported for Microsoft Word, Excel, PowerPoint, and HTML file formats.

:::image type="content" source="media/office-to-ocr.png" alt-text="Screenshot of a Microsoft Word document extracted by Document Intelligence Read OCR.":::

The page units in the model output are computed as shown:

 **File format**   | **Computed page unit**   | **Total pages**  |
| --- | --- | --- |
|Word  | Up to 3,000 characters = 1 page unit, embedded or linked images not supported | Total pages of up to 3,000 characters each |
|Excel  | Each worksheet = 1 page unit, embedded or linked images not supported | Total worksheets
|PowerPoint |  Each slide = 1 page unit, embedded or linked images not supported | Total slides
|HTML | Up to 3,000 characters = 1 page unit, embedded or linked images not supported | Total pages of up to 3,000 characters each |

### Paragraphs extraction

The Read OCR model in Document Intelligence extracts all identified blocks of text in the `paragraphs` collection as a top level object under `analyzeResults`. Each entry in this collection represents a text block and includes the extracted text as`content`and the bounding `polygon` coordinates. The `span` information points to the text fragment within the top-level `content` property that contains the full text from the document.

```json
"paragraphs": [
    {
        "spans": [],
        "boundingRegions": [],
        "content": "While healthcare is still in the early stages of its Al journey, we are seeing pharmaceutical and other life sciences organizations making major investments in Al and related technologies.\" TOM LAWRY | National Director for Al, Health and Life Sciences | Microsoft"
    }
]
```

The page units in the model output are computed as shown:

 **File format**   | **Computed page unit**   | **Total pages**  |
| --- | --- | --- |
|Images | Each image = 1 page unit | Total images  |
|PDF | Each page in the PDF = 1 page unit | Total pages in the PDF |
|TIFF | Each image in the TIFF = 1 page unit | Total images in the PDF |

```json
"pages": [
    {
        "pageNumber": 1,
        "angle": 0,
        "width": 915,
        "height": 1190,
        "unit": "pixel",
        "words": [],
        "lines": [],
        "spans": [],
        "kind": "document"
    }
]
```

### Text lines and words extraction

The Read OCR model extracts print and handwritten style text as `lines` and `words`. The model outputs bounding `polygon` coordinates and `confidence` for the extracted words. The `styles` collection includes any handwritten style for lines if detected along with the spans pointing to the associated text. This feature applies to [supported handwritten languages](language-support.md).

For the preview of Microsoft Word, Excel, PowerPoint, and HTML file support, Read extracts all embedded text as is. For any embedded images, it runs OCR on the images to extract text and append the text from each image as an added entry to the `pages` collection. These added entries include the extracted text lines and words, their bounding polygons, confidences, and the spans pointing to the associated text.

```json
"words": [
    {
        "content": "While",
        "polygon": [],
        "confidence": 0.997,
        "span": {}
    },
],
"lines": [
    {
        "content": "While healthcare is still in the early stages of its Al journey, we",
        "polygon": [],
        "spans": [],
    }
]
```

### Select page(s) for text extraction

For large multi-page PDF documents, use the `pages` query parameter to indicate specific page numbers or page ranges for text extraction.

> [!NOTE]
> For the Microsoft Word, Excel, PowerPoint, and HTML file support, the Read API ignores the pages parameter and extracts all pages by default.

### Handwritten style for text lines

The response includes classifying whether each text line is of handwriting style or not, along with a confidence score. For more information, *see* [handwritten language support](language-support-ocr.md). The following example shows an example JSON snippet.

```json
"styles": [
{
    "confidence": 0.95,
    "spans": [
    {
        "offset": 509,
        "length": 24
    }
    "isHandwritten": true
    ]
}
```

## Next steps

Complete a Document Intelligence quickstart:

> [!div class="checklist"]
>
> * [**REST API**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)
> * [**C# SDK**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.1.0&preserve-view=true?pivots=programming-language-csharp)
> * [**Python SDK**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.1.0&preserve-view=true?pivots=programming-language-python)
> * [**Java SDK**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.1.0&preserve-view=true?pivots=programming-language-java)
> * [**JavaScript**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.1.0&preserve-view=true?pivots=programming-language-javascript)</li></ul>

Explore our REST API:

> [!div class="nextstepaction"]
> [Document Intelligence API v3.1](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)
