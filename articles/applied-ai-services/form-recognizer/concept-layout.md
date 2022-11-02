---
title: Document layout analysis - Form Recognizer
titleSuffix: Azure Applied AI Services
description: Extract text, tables, selections, titles, section headings, page headers, page footers, and more with layout analysis model from Form Recognizer.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 10/14/2022
ms.author: lajanuar
monikerRange: '>=form-recog-2.1.0'
recommendations: false
---

# Document layout analysis

[!INCLUDE [applies to v3.0 and v2.1](includes/applies-to-v3-0-and-v2-1.md)]

## What is document layout analysis?

Document structure and layout analysis is the process of analyzing a document to extract regions of interest and their inter-relationships. The goal is to extract text and structural elements from the page for building better semantic understanding models. For all extracted text, there are two types of roles that text plays in a document layout.  Text, tables, and selection marks are examples of geometric roles. Titles, headings, and footers are examples of logical roles. For example. a reading system requires differentiating text regions from non-textual ones along with their reading order.

The following illustration shows the typical components in an image of a sample page.

:::image type="content" source="media/document-layout-example.png" alt-text="Illustration of document layout example.":::

## Form Recognizer Layout model

The Form Recognizer Layout is an advanced machine-learning based document layout analysis model available in the Form Recognizer cloud API. In the version v2.1, the document layout model extracted text lines, words, tables, and selection marks. 

**Starting with v3.0 GA**, it extracts paragraphs and additional structure information like titles, section headings, page header, page footer, page number, and footnote from the document page. These are examples of logical roles described in the previous section. This capability is supported for PDF documents and images (JPG, PNG, BMP, TIFF).

***Sample form processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/layout)***

:::image type="content" source="media/studio/form-recognizer-studio-layout-newspaper.png" alt-text="Screenshot of sample newspaper page processed using Form Recognizer studio":::

## Supported document types

| **Model**   | **Images**   | **PDF**  | **TIFF** |
| --- | --- | --- | --- |
| Layout  | ✓  | ✓  | ✓  |

### Data extraction

| **Model**   | **Text**   | **Selection Marks**   | **Tables**  | **Paragraphs** | **Logical roles** |
| --- | --- | --- | --- | --- | --- |
| Layout  | ✓  | ✓  | ✓  | ✓  | ✓  |

**Supported logical roles for paragraphs**:
The paragraph roles are best used with unstructured documents.  Paragraph roles help analyze the structure of the extracted content for better semantic search and analysis.

* title
* sectionHeading
* footnote
* pageHeader
* pageFooter
* pageNumber

## Development options

The following tools are supported by Form Recognizer v3.0:

| Feature | Resources | Model ID |
|----------|------------|------------|
|**Layout model**| <ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li></ul>|**prebuilt-layout**|

The following tools are supported by Form Recognizer v2.1:

| Feature | Resources |
|----------|-------------------------|
|**Layout API**| <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/layout-analyze)</li><li>[**REST API**](/azure/applied-ai-services/form-recognizer/how-to-guides/use-sdk-rest-api?view=form-recog-2.1.0&preserve-view=true&tabs=windows&pivots=programming-language-rest-api#analyze-layout)</li><li>[**Client-library SDK**](/azure/applied-ai-services/form-recognizer/how-to-guides/v2-1-sdk-rest-api)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?branch=main&tabs=layout#run-the-container-with-the-docker-compose-up-command)</li></ul>|

## Try document layout analysis

Try extracting data from forms and documents using the Form Recognizer Studio. You'll need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

### Form Recognizer Studio

> [!NOTE]
> Form Recognizer studio is available with the v3.0 API.

***Sample form processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/layout)***

:::image type="content" source="media/studio/form-recognizer-studio-layout-newspaper.png" alt-text="Screenshot: Layout processing a newspaper page in Form Recognizer Studio.":::

1. On the Form Recognizer Studio home page, select **Layout**

1. You can analyze the sample document or select the **+ Add** button to upload your own sample.

1. Select the **Analyze** button:

    :::image type="content" source="media/studio/layout-analyze.png" alt-text="Screenshot: analyze layout menu.":::

   > [!div class="nextstepaction"]
   > [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/layout)

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Supported languages and locales

*See* [Language Support](language-support.md) for a complete list of supported handwritten and printed languages.

## Model extraction

The layout model extracts text, selection marks, tables, paragraphs, and paragraph types (`roles`) from your documents.

### Paragraph extraction <sup>🆕</sup>

The Layout model extracts all identified blocks of text in the `paragraphs` collection as a top level object under `analyzeResults`. Each entry in this collection represents a text block and includes the extracted text as`content`and the bounding `polygon` coordinates. The `span` information points to the text fragment within the top level `content` property that contains the full text from the document.

```json
"paragraphs": [
    {
        "spans": [],
        "boundingRegions": [],
        "content": "While healthcare is still in the early stages of its Al journey, we are seeing pharmaceutical and other life sciences organizations making major investments in Al and related technologies.\" TOM LAWRY | National Director for Al, Health and Life Sciences | Microsoft"
    }
]
```

### Paragraph roles<sup> 🆕</sup>

The new machine-learning based page object detection extracts logical roles like titles, section headings, page headers, page footers, and more. The Form Recognizer Layout model assigns certain text blocks in the `paragraphs` collection with their specialized role or type predicted by the model. They're best used with unstructured documents to help understand the layout of the extracted content for a richer semantic analysis. The following paragraph roles are supported:

| **Predicted role**   | **Description**   |
| --- | --- |
| `title`  | The main heading(s) in the page |
| `sectionHeading`  | One or more subheading(s) on the page  |
| `footnote`  | Text near the bottom of the page  |
| `pageHeader`  | Text near the top edge of the page  |
| `pageFooter`  | Text near the bottom edge of the page  |
| `pageNumber`  | Page number  |

```json
{
    "paragraphs": [
                {
                    "spans": [],
                    "boundingRegions": [],
                    "role": "title",
                    "content": "NEWS TODAY"
                },
                {
                    "spans": [],
                    "boundingRegions": [],
                    "role": "sectionHeading",
                    "content": "Mirjam Nilsson"
                }
    ]
}

```

### Pages extraction

The pages collection is the very first object you see in the service response.

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

The document layout model in Form Recognizer extracts print and handwritten style text as `lines` and `words`. The model outputs bounding `polygon` coordinates and `confidence` for the extracted words. The `styles` collection includes any handwritten style for lines if detected along with the spans pointing to the associated text. This feature applies to [supported handwritten languages](language-support.md).

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
### Selection marks extraction

The Layout model also extracts selection marks from documents. Extracted selection marks appear within the `pages` collection for each page. They include the bounding `polygon`, `confidence`, and selection `state` (`selected/unselected`). Any associated text if extracted is also included as the starting index (`offset`) and `length` that references the top level `content` property that contains the full text from the document.

```json
{
    "selectionMarks": [
        {
            "state": "unselected",
            "polygon": [],
            "confidence": 0.995,
            "span": {
                "offset": 1421,
                "length": 12
            }
        }
    ]
}
```

### Extract tables from documents and images

Extracting tables is a key requirement for processing documents containing large volumes of data typically formatted as tables. The Layout model extracts tables in the `pageResults` section of the JSON output. Extracted table information includes the number of columns and rows, row span, and column span. Each cell with its bounding polygon is output along with information whether it's recognized as a `columnHeader` or not. The model supports extracting tables that are rotated. Each table cell contains the row and column index and bounding polygon coordinates. For the cell text, the model outputs the `span` information containing the starting index (`offset`). The model also outputs the `length` within the top-level content that contains the full text from the document.

```json
{
    "tables": [
        {
            "rowCount": 9,
            "columnCount": 4,
            "cells": [
                {
                    "kind": "columnHeader",
                    "rowIndex": 0,
                    "columnIndex": 0,
                    "columnSpan": 4,
                    "content": "(In millions, except earnings per share)",
                    "boundingRegions": [],
                    "spans": []
                    },
            ]
        }
    ]
}

```
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

### Extracts selected pages from documents

For large multi-page documents, use the `pages` query parameter to indicate specific page numbers or page ranges for text extraction.

## Next steps

* Complete a Form Recognizer quickstart:

  > [!div class="nextstepaction"]
  > [Form Recognizer quickstart](/azure/applied-ai-services/form-recognizer/how-to-guides/v2-1-sdk-rest-api)

* Explore our REST API:

  > [!div class="nextstepaction"]
  > [Form Recognizer API v3.0](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)
