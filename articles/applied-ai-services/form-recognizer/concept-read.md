---
title: OCR for documents - Form Recognizer
titleSuffix: Azure Applied AI Services
description: Extract print and handwritten text from scanned and digital documents with Form Recognizer’s Read OCR model.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 10/14/2022
ms.author: lajanuar
monikerRange: 'form-recog-3.0.0'
recommendations: false
---

# OCR for documents

**This article applies to:** ![Form Recognizer v3.0 checkmark](media/yes-icon.png) **Form Recognizer v3.0**.

> [!NOTE]
>
> For extracting text from in-the-wild images like labels, street signs, and posters, use the [Computer Vision v4.0 preview Read](../../cognitive-services/Computer-vision/concept-ocr.md) feature optimized for general, non-document images with a performance-enhanced synchronous API that makes it easier to embed OCR in your user experience scenarios.
> 

## What is OCR for documents?

Optical Character Recognition (OCR) for documents is optimized for large text-heavy documents in multiple file formats and global languages. It should include features like higher-resolution scanning of document images for better handling of smaller and dense text, paragraphs detection, handling fillable forms, and advanced forms and document scenarios like single character boxes and accurate extraction of key fields commonly found in invoices, receipts, and other prebuilt scenarios.

## Form Recognizer Read model

Form Recognizer v3.0’s Read Optical Character Recognition (OCR) model runs at a higher resolution than Computer Vision Read and extracts print and handwritten text from PDF documents and scanned images. It also includes preview support for extracting text from Microsoft Word, Excel, PowerPoint, and HTML documents. It detects paragraphs, text lines, words, locations, and languages, and is the underlying OCR engine for other Form Recognizer models like Layout, General Document, Invoice, Receipt, Identity (ID) document, and other prebuilt models, as well as custom models.

## Supported document types

> [!NOTE]
>
> * Only API Version 2022-06-30-preview supports Microsoft Word, Excel, PowerPoint, and HTML file formats in addition to all other document types supported by the GA versions.
> * For the preview of Office and HTML file formats, Read API ignores the pages parameter and extracts all pages by default. Each embedded image counts as 1 page unit and each worksheet, slide, and page (up to 3000 characters) count as 1 page.

| **Model**   | **Images**   | **PDF**  | **TIFF** | **Word**   | **Excel**  | **PowerPoint** | **HTML** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **prebuilt-read**  | GA</br> (2022-08-31)| GA</br> (2022-08-31)  | GA</br> (2022-08-31)  | Preview</br>(2022-06-30-preview)  | Preview</br>(2022-06-30-preview)  | Preview</br>(2022-06-30-preview) | Preview</br>(2022-06-30-preview) |

### Data extraction

| **Model**   | **Text**   | **[Language detection](language-support.md#detected-languages-read-api)** |
| --- | --- | --- |
**prebuilt-read**  | ✓  |✓  |

## Development options

The following resources are supported by Form Recognizer v3.0:

| Model | Resources | Model ID |
|----------|------------|------------|
|**Read model**| <ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](how-to-guides/use-sdk-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**C# SDK**](how-to-guides/use-sdk-rest-api.md?view=form-recog-3.0.0&preserve-view=true?pivots=programming-language-csharp)</li><li>[**Python SDK**](how-to-guides/use-sdk-rest-api.md?view=form-recog-3.0.0&preserve-view=true?pivots=programming-language-python)</li><li>[**Java SDK**](how-to-guides/use-sdk-rest-api.md?view=form-recog-3.0.0&preserve-view=true?pivots=programming-language-java)</li><li>[**JavaScript**](how-to-guides/use-sdk-rest-api.md?view=form-recog-3.0.0&preserve-view=true?pivots=programming-language-javascript)</li></ul>|**prebuilt-read**|

## Try OCR in Form Recognizer

Try extracting text from forms and documents using the Form Recognizer Studio. You'll need the following assets:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

### Form Recognizer Studio 

> [!NOTE]
> Currently, Form Recognizer Studio doesn't support Microsoft Word, Excel, PowerPoint, and HTML file formats in the Read version v3.0.

***Sample form processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/read)***

:::image type="content" source="media/studio/form-recognizer-studio-read-v3p2-updated.png" alt-text="Screenshot: Read processing in Form Recognizer Studio.":::

1. On the Form Recognizer Studio home page, select **Read**

1. You can analyze the sample document or select the **+ Add** button to upload your own sample.

1. Select the **Analyze** button:

    :::image type="content" source="media/studio/form-recognizer-studio-read-analyze-v3p2-updated.png" alt-text="Screenshot: analyze read menu.":::

   > [!div class="nextstepaction"]
   > [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/layout)

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Supported languages and locales

Form Recognizer v3.0 version supports several languages for the read model. *See* our [Language Support](language-support.md) for a complete list of supported handwritten and printed languages.

## Data detection and extraction

### Microsoft Office and HTML text extraction (preview) <sup>🆕</sup>
Use the parameter `api-version=2022-06-30-preview` when using the REST API or the corresponding SDKs of that API version to preview text extraction from Microsoft Word, Excel, PowerPoint, and HTML files. The following illustration shows extraction of the digital text as well as text from the images embedded in the Word document by running OCR on the images.

:::image type="content" source="media/office-to-ocr.png" alt-text="Screenshot of a Microsoft Word document extracted by Form Recognizer Read OCR.":::

The page units in the model output are computed as shown:

 **File format**   | **Computed page unit**   | **Total pages**  |
| --- | --- | --- |
|Word (preview) | Up to 3,000 characters = 1 page unit, Each embedded image = 1 page unit | Total pages of up to 3,000 characters each + Total embedded images |
|Excel (preview) | Each worksheet = 1 page unit, Each embedded image = 1 page unit | Total worksheets + Total images
|PowerPoint (preview)|  Each slide = 1 page unit, Each embedded image = 1 page unit | Total slides + Total images
|HTML (preview)| Up to 3,000 characters = 1 page unit, embedded or linked images not supported | Total pages of up to 3,000 characters each |

### Paragraphs extraction <sup>🆕</sup>

The Read OCR model in Form Recognizer extracts all identified blocks of text in the `paragraphs` collection as a top level object under `analyzeResults`. Each entry in this collection represents a text block and includes the extracted text as`content`and the bounding `polygon` coordinates. The `span` information points to the text fragment within the top-level `content` property that contains the full text from the document.

```json
"paragraphs": [
    {
        "spans": [],
        "boundingRegions": [],
        "content": "While healthcare is still in the early stages of its Al journey, we are seeing pharmaceutical and other life sciences organizations making major investments in Al and related technologies.\" TOM LAWRY | National Director for Al, Health and Life Sciences | Microsoft"
    }
]
```
### Language detection <sup>🆕</sup>

The Read OCR model in Form Recognizer adds [language detection](language-support.md#detected-languages-read-api) as a new feature for text lines. Read will predict the detected primary language for each text line along with the `confidence` in the `languages` collection under `analyzeResult`.

```json
"languages": [
    {
        "spans": [
            {
                "offset": 0,
                "length": 131
            }
        ],
        "locale": "en",
        "confidence": 0.7
    },
]
```

### Extracting pages from documents

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

### Extract text lines and words

The Read OCR model extracts print and handwritten style text as `lines` and `words`. The model outputs bounding `polygon` coordinates and `confidence` for the extracted words. The `styles` collection includes any handwritten style for lines if detected along with the spans pointing to the associated text. This feature applies to [supported handwritten languages](language-support.md).

For the preview of Microsoft Word, Excel, PowerPoint, and HTML file support, Read will extract all embedded text as is. For any embedded images, it will run OCR on the images to extract text and append the text from each image as an added entry to the `pages` collection. These added entries will include the extracted text lines and words, their bounding polygons, confidences, and the spans pointing to the associated text.

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
### Select page (s) for text extraction

For large multi-page PDF documents, use the `pages` query parameter to indicate specific page numbers or page ranges for text extraction.

> [!NOTE]
> For the preview of Microsoft Word, Excel, PowerPoint, and HTML file support, the Read API ignores the pages parameter and extracts all pages by default.

### Handwritten style for text lines (Latin languages only)

The response includes classifying whether each text line is of handwriting style or not, along with a confidence score. This feature is only supported for Latin languages. The following example shows an example JSON snippet.

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

Complete a Form Recognizer quickstart:

> [!div class="checklist"]
>
> * [**REST API**](how-to-guides/use-sdk-rest-api.md?view=form-recog-3.0.0&preserve-view=true)
> * [**C# SDK**](how-to-guides/use-sdk-rest-api.md?view=form-recog-3.0.0&preserve-view=true?pivots=programming-language-csharp)
> * [**Python SDK**](how-to-guides/use-sdk-rest-api.md?view=form-recog-3.0.0&preserve-view=true?pivots=programming-language-python)
> * [**Java SDK**](how-to-guides/use-sdk-rest-api.md?view=form-recog-3.0.0&preserve-view=true?pivots=programming-language-java)
> * [**JavaScript**](how-to-guides/use-sdk-rest-api.md?view=form-recog-3.0.0&preserve-view=true?pivots=programming-language-javascript)</li></ul>

Explore our REST API:

> [!div class="nextstepaction"]
> [Form Recognizer API v3.0](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)
