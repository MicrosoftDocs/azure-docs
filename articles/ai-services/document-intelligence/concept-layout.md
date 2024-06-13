---
title: Document layout analysis - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Extract text, tables, selections, titles, section headings, page headers, page footers, and more with layout analysis model from Document Intelligence.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 05/23/2024
ms.author: lajanuar
---

<!-- markdownlint-disable DOCSMD006 -->

# Document Intelligence layout model

::: moniker range="doc-intel-4.0.0"
[!INCLUDE [preview-version-notice](includes/preview-notice.md)]

[!INCLUDE [applies to v4.0](includes/applies-to-v40.md)]
::: moniker-end

::: moniker range="doc-intel-3.1.0"
[!INCLUDE [applies to v3.1](includes/applies-to-v31.md)]
::: moniker-end

::: moniker range="doc-intel-3.0.0"
[!INCLUDE [applies to v3.0](includes/applies-to-v30.md)]
::: moniker-end

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [applies to v2.1](includes/applies-to-v21.md)]
::: moniker-end

Document Intelligence layout model is an advanced machine-learning based document analysis API available in the Document Intelligence cloud. It enables you to take documents in various formats and return structured data representations of the documents. It combines an enhanced version of our powerful [Optical Character Recognition (OCR)](../../ai-services/computer-vision/overview-ocr.md) capabilities with deep learning models to extract text, tables, selection marks, and document structure.

## Document layout analysis

Document structure layout analysis is the process of analyzing a document to extract regions of interest and their inter-relationships. The goal is to extract text and structural elements from the page to build better semantic understanding models. There are two types of roles in a document layout:

* **Geometric roles**: Text, tables, figures, and selection marks are examples of geometric roles.
* **Logical roles**: Titles, headings, and footers are examples of logical roles of texts.

The following illustration shows the typical components in an image of a sample page.

  :::image type="content" source="media/document-layout-example-new.png" alt-text="Illustration of document layout example.":::

## Development options

::: moniker range="doc-intel-4.0.0"

Document Intelligence v4.0 (2024-02-29-preview, 2023-10-31-preview) supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**Layout model**|&bullet; [**Document Intelligence Studio**](https://documentintelligence.ai.azure.com)</br>&bullet;  [**REST API**](/rest/api/aiservices/operation-groups?view=rest-aiservices-2024-02-29-preview&preserve-view=true)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)|**prebuilt-layout**|
::: moniker-end

::: moniker range="doc-intel-3.1.0"

Document Intelligence v3.1 supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**Layout model**|&bullet; [**Document Intelligence Studio**](https://documentintelligence.ai.azure.com)</br>&bullet;  [**REST API**](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)|**prebuilt-layout**|
::: moniker-end

::: moniker range="doc-intel-3.0.0"

Document Intelligence v3.0 supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**Layout model**|&bullet; [**Document Intelligence Studio**](https://documentintelligence.ai.azure.com)</br>&bullet;  [**REST API**](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-v3.0%20(2022-08-31)&preserve-view=true&tabs=HTTP)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)|**prebuilt-layout**|
::: moniker-end

::: moniker range="doc-intel-2.1.0"

Document Intelligence v2.1 supports the following tools, applications, and libraries:

| Feature | Resources |
|----------|-------------------------|
|**Layout model**|&bullet; [**Document Intelligence labeling tool**](https://fott-2-1.azurewebsites.net/prebuilts-analyze)</br>&bullet;  [**REST API**](how-to-guides/use-sdk-rest-api.md?pivots=programming-language-rest-api&view=doc-intel-2.1.0&preserve-view=true&tabs=windows)</br>&bullet;  [**Client-library SDK**](~/articles/ai-services/document-intelligence/how-to-guides/use-sdk-rest-api.md?view=doc-intel-2.1.0&preserve-view=true)</br>&bullet;  [**Document Intelligence Docker container**](containers/install-run.md?tabs=id-document#run-the-container-with-the-docker-compose-up-command)|
::: moniker-end

## Input requirements

::: moniker range=">=doc-intel-3.0.0"

[!INCLUDE [input requirements](./includes/input-requirements.md)]

::: moniker-end

::: moniker range="doc-intel-2.1.0"

* Supported file formats: JPEG, PNG, PDF, and TIFF.
* Supported number of pages: For PDF and TIFF, up to 2,000 pages are processed. For free tier subscribers, only the first two pages are processed.
* Supported file size: the file size must be less than 50 MB and dimensions at least 50 x 50 pixels and at most 10,000 x 10,000 pixels.

::: moniker-end

### Get started with Layout model

See how data, including text, tables, table headers, selection marks, and structure information is extracted from documents using  Document Intelligence. You need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/).

* A [Document Intelligence instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

::: moniker range=">=doc-intel-3.0.0"

> [!NOTE]
> Document Intelligence Studio is available with v3.0 APIs and later versions.

***Sample document processed with [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/layout)***

:::image type="content" source="media/studio/form-recognizer-studio-layout-newspaper.png" alt-text="Screenshot of `Layout` processing a newspaper page in Document Intelligence Studio.":::

1. On the Document Intelligence Studio home page, select **Layout**.

1. You can analyze the sample document or upload your own files.

1. Select the **Run analysis** button and, if necessary, configure the **Analyze options**:

    :::image type="content" source="media/studio/run-analysis-analyze-options.png" alt-text="Screenshot of Run analysis and Analyze options buttons in the Document Intelligence Studio.":::

   > [!div class="nextstepaction"]
   > [Try Document Intelligence Studio](https://documentintelligence.ai.azure.com/studio/layout).

::: moniker-end

::: moniker range="doc-intel-2.1.0"

## Document Intelligence Sample Labeling tool

1. Navigate to the [Document Intelligence sample tool](https://fott-2-1.azurewebsites.net/).

1. On the sample tool home page, select **Use Layout to get text, tables and selection marks**.

     :::image type="content" source="media/label-tool/layout-1.jpg" alt-text="Screenshot of connection settings for the Document Intelligence layout process.":::

1. In the **Document Intelligence service endpoint** field, paste the endpoint that you obtained with your Document Intelligence subscription.

1. In the **key** field, paste  the key you obtained from your Document Intelligence resource.

1. In the **Source** field, select **URL** from the dropdown menu You can use our sample document:

    * [**Sample document**](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/layout-page-001.jpg).

    * Select the **Fetch** button.

1. Select **Run Layout**. The Document Intelligence Sample Labeling tool calls the `Analyze Layout` API to analyze the document.

    :::image type="content" source="media/fott-layout.png" alt-text="Screenshot of `Layout` dropdown window.":::

1. View the results - see the highlighted extracted text, detected selection marks, and detected tables.

    :::image type="content" source="media/label-tool/layout-3.jpg" alt-text="Screenshot of connection settings for the Document Intelligence Sample Labeling tool.":::

::: moniker-end

## Supported languages and locales

*See* our [Language Support—document analysis models](language-support-ocr.md) page for a complete list of supported languages.

::: moniker range="doc-intel-2.1.0"

Document Intelligence v2.1 supports the following tools, applications, and libraries:

| Feature | Resources |
|----------|-------------------------|
|**Layout API**| <ul><li>[**Document Intelligence labeling tool**](https://fott-2-1.azurewebsites.net/layout-analyze)</li><li>[**REST API**](how-to-guides/use-sdk-rest-api.md?pivots=programming-language-rest-api&tabs=windows&view=doc-intel-2.1.0&preserve-view=true)</li><li>[**Client-library SDK**](~/articles/ai-services/document-intelligence/how-to-guides/use-sdk-rest-api.md?view=doc-intel-2.1.0&preserve-view=true)</li><li>[**Document Intelligence Docker container**](containers/install-run.md?branch=main&tabs=layout#run-the-container-with-the-docker-compose-up-command)</li></ul>|

::: moniker-end

::: moniker range=">=doc-intel-3.0.0"

## Data extraction

The layout model extracts text, selection marks, tables, paragraphs, and paragraph types (`roles`) from your documents.

> [!NOTE]
> Versions `2024-02-29-preview`, `2023-10-31-preview`, and later support Microsoft office (DOCX, XLSX, PPTX) and HTML files. The following features are not supported:
>
> * There are no angle, width/height and unit with each page object.
> * For each object detected, there is no bounding polygon or bounding region.
> * Page range (`pages`) is not supported as a parameter.
> * No `lines` object.

### Pages

The pages collection is a list of pages within the document. Each page is represented sequentially within the document and includes the orientation angle indicating if the page is rotated and the width and height (dimensions in pixels). The page units in the model output are computed as shown:

 **File format**   | **Computed page unit**   | **Total pages**  |
| --- | --- | --- |
|Images (JPEG/JPG, PNG, BMP, HEIF) | Each image = 1 page unit | Total images  |
|PDF | Each page in the PDF = 1 page unit | Total pages in the PDF |
|TIFF | Each image in the TIFF = 1 page unit | Total images in the TIFF |
|Word (DOCX)  | Up to 3,000 characters = 1 page unit, embedded or linked images not supported | Total pages of up to 3,000 characters each |
|Excel (XLSX)  | Each worksheet = 1 page unit, embedded or linked images not supported | Total worksheets | 
|PowerPoint (PPTX) |  Each slide = 1 page unit, embedded or linked images not supported | Total slides | 
|HTML | Up to 3,000 characters = 1 page unit, embedded or linked images not supported | Total pages of up to 3,000 characters each |

::: moniker-end

::: moniker range="doc-intel-3.0.0"
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
        "spans": []
    }
]
```

::: moniker-end

::: moniker range="doc-intel-3.1.0"

#### [Sample code](#tab/sample-code)
```Python
# Analyze pages.
for page in result.pages:
    print(f"----Analyzing layout from page #{page.page_number}----")
    print(
        f"Page has width: {page.width} and height: {page.height}, measured with unit: {page.unit}"
    )
```
> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/v3.1(2023-07-31-GA)/Python(v3.1)/Layout_model/sample_analyze_layout.py)

#### [Output](#tab/output)
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
        "spans": []
    }
]
```
---
::: moniker-end

::: moniker range="doc-intel-4.0.0"

#### [Sample code](#tab/sample-code)
```Python
# Analyze pages.
for page in result.pages:
    print(f"----Analyzing layout from page #{page.page_number}----")
    print(f"Page has width: {page.width} and height: {page.height}, measured with unit: {page.unit}")
```
> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Layout_model/sample_analyze_layout.py)

#### [Output](#tab/output)
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
        "spans": []
    }
]
```
---

::: moniker-end

::: moniker range=">=doc-intel-3.0.0"

### Extract selected pages from documents

For large multi-page documents, use the `pages` query parameter to indicate specific page numbers or page ranges for text extraction.

### Paragraphs

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

### Paragraph roles

The new machine-learning based page object detection extracts logical roles like titles, section headings, page headers, page footers, and more. The Document Intelligence Layout model assigns certain text blocks in the `paragraphs` collection with their specialized role or type predicted by the model. They're best used with unstructured documents to help understand the layout of the extracted content for a richer semantic analysis. The following paragraph roles are supported:

| **Predicted role**   | **Description**   | **Supported file types** | 
| --- | --- | --- |
| `title`  | The main headings in the page | pdf, image, docx, pptx, xlsx, html |
| `sectionHeading`  | One or more subheadings on the page  | pdf, image, docx, xlsx, html |
| `footnote`  | Text near the bottom of the page  | pdf, image |
| `pageHeader`  | Text near the top edge of the page  | pdf, image, docx |
| `pageFooter`  | Text near the bottom edge of the page  | pdf, image, docx, pptx, html |
| `pageNumber`  | Page number  | pdf, image |

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

### Text, lines, and words

The document layout model in Document Intelligence extracts print and handwritten style text as `lines` and `words`. The `styles` collection includes any handwritten style for lines if detected along with the spans pointing to the associated text. This feature applies to [supported handwritten languages](language-support.md).

For Microsoft Word, Excel, PowerPoint, and HTML, Document Intelligence versions 2024-02-29-preview and  2023-10-31-preview Layout model extract all embedded text as is. Texts are extracted as words and paragraphs. Embedded images aren't supported.

::: moniker-end

::: moniker range="doc-intel-3.0.0"

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
::: moniker-end

::: moniker range="doc-intel-3.1.0"

#### [Sample code](#tab/sample-code)
```Python
# Analyze lines.
for line_idx, line in enumerate(page.lines):
    words = line.get_words()
    print(
        f"...Line # {line_idx} has word count {len(words)} and text '{line.content}' "
        f"within bounding polygon '{format_polygon(line.polygon)}'"
    )

    # Analyze words.
    for word in words:
        print(
            f"......Word '{word.content}' has a confidence of {word.confidence}"
        )
```
> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/v3.1(2023-07-31-GA)/Python(v3.1)/Layout_model/sample_analyze_layout.py)

#### [Output](#tab/output)
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
---
::: moniker-end

::: moniker range="doc-intel-4.0.0"

#### [Sample code](#tab/sample-code)
```Python
# Analyze lines.
if page.lines:
    for line_idx, line in enumerate(page.lines):
    words = get_words(page, line)
    print(
        f"...Line # {line_idx} has word count {len(words)} and text '{line.content}' "
        f"within bounding polygon '{line.polygon}'"
    )

    # Analyze words.
    for word in words:
        print(f"......Word '{word.content}' has a confidence of {word.confidence}")
```
> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Layout_model/sample_analyze_layout.py)

#### [Output](#tab/output)
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
---
::: moniker-end

::: moniker range=">=doc-intel-3.0.0"

### Handwritten style for text lines

The response includes classifying whether each text line is of handwriting style or not, along with a confidence score. For more information. See [Handwritten language support](language-support-ocr.md). The following example shows an example JSON snippet.

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

If you enable the [font/style addon capability](concept-add-on-capabilities.md#font-property-extraction), you also get the font/style result as part of the `styles` object.

### Selection marks

The Layout model also extracts selection marks from documents. Extracted selection marks appear within the `pages` collection for each page. They include the bounding `polygon`, `confidence`, and selection `state` (`selected/unselected`). The text representation (that is, `:selected:` and `:unselected`) is also included as the starting index (`offset`) and `length` that references the top level `content` property that contains the full text from the document.

::: moniker-end

::: moniker range="doc-intel-3.0.0"
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
::: moniker-end

::: moniker range="doc-intel-3.1.0"

#### [Sample code](#tab/sample-code)
```Python
# Analyze selection marks.
for selection_mark in page.selection_marks:
    print(
        f"Selection mark is '{selection_mark.state}' within bounding polygon "
        f"'{format_polygon(selection_mark.polygon)}' and has a confidence of {selection_mark.confidence}"
    )
```
> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/v3.1(2023-07-31-GA)/Python(v3.1)/Layout_model/sample_analyze_layout.py)

#### [Output](#tab/output)
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
---
::: moniker-end

::: moniker range="doc-intel-4.0.0"

#### [Sample code](#tab/sample-code)
```Python
# Analyze selection marks.
if page.selection_marks:
    for selection_mark in page.selection_marks:
        print(
            f"Selection mark is '{selection_mark.state}' within bounding polygon "
            f"'{selection_mark.polygon}' and has a confidence of {selection_mark.confidence}"
        )
```
> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Layout_model/sample_analyze_layout.py)

#### [Output](#tab/output)
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
---
::: moniker-end

::: moniker range=">=doc-intel-3.0.0"

### Tables

Extracting tables is a key requirement for processing documents containing large volumes of data typically formatted as tables. The Layout model extracts tables in the `pageResults` section of the JSON output. Extracted table information includes the number of columns and rows, row span, and column span. Each cell with its bounding polygon is output along with information whether the area is recognized as a `columnHeader` or not. The model supports extracting tables that are rotated. Each table cell contains the row and column index and bounding polygon coordinates. For the cell text, the model outputs the `span` information containing the starting index (`offset`). The model also outputs the `length` within the top-level content that contains the full text from the document.

> [!NOTE]
> Table is not supported if the input file is XLSX.

::: moniker-end

::: moniker range="doc-intel-3.0.0"

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
::: moniker-end

::: moniker range="doc-intel-3.1.0"

#### [Sample code](#tab/sample-code)
```Python
# Analyze tables.
for table_idx, table in enumerate(result.tables):
    print(
        f"Table # {table_idx} has {table.row_count} rows and "
        f"{table.column_count} columns"
    )
    for region in table.bounding_regions:
        print(
            f"Table # {table_idx} location on page: {region.page_number} is {format_polygon(region.polygon)}"
        )
    for cell in table.cells:
        print(
            f"...Cell[{cell.row_index}][{cell.column_index}] has text '{cell.content}'"
        )
        for region in cell.bounding_regions:
            print(
                f"...content on page {region.page_number} is within bounding polygon '{format_polygon(region.polygon)}'"
            )
```
> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/v3.1(2023-07-31-GA)/Python(v3.1)/Layout_model/sample_analyze_layout.py)

#### [Output](#tab/output)
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
---
::: moniker-end

::: moniker range="doc-intel-4.0.0"

#### [Sample code](#tab/sample-code)
```Python
if result.tables:
    for table_idx, table in enumerate(result.tables):
        print(f"Table # {table_idx} has {table.row_count} rows and " f"{table.column_count} columns")
        if table.bounding_regions:
            for region in table.bounding_regions:
                print(f"Table # {table_idx} location on page: {region.page_number} is {region.polygon}")
        # Analyze cells.
        for cell in table.cells:
            print(f"...Cell[{cell.row_index}][{cell.column_index}] has text '{cell.content}'")
            if cell.bounding_regions:
                for region in cell.bounding_regions:
                print(f"...content on page {region.page_number} is within bounding polygon '{region.polygon}'")
```
> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Layout_model/sample_analyze_layout.py)

#### [Output](#tab/output)
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
---
::: moniker-end

::: moniker range="doc-intel-3.1.0"

### Annotations (available only in ``2023-02-28-preview`` API.)

The Layout model extracts annotations in documents, such as checks and crosses. The response includes the kind of annotation, along with a confidence score and bounding polygon.

```json
    {
    "pages": [
    {
        "annotations": [
        {
            "kind": "cross",
            "polygon": [...],
            "confidence": 1
        }
        ]
    }
    ]
}
```
::: moniker-end

::: moniker range="doc-intel-4.0.0"

### Output to markdown format

The Layout API can output the extracted text in markdown format. Use the `outputContentFormat=markdown` to specify the output format in markdown. The markdown content is output as part of the `content` section.

#### [Sample code](#tab/sample-code)
```Python
document_intelligence_client = DocumentIntelligenceClient(endpoint=endpoint, credential=AzureKeyCredential(key))
poller = document_intelligence_client.begin_analyze_document(
    "prebuilt-layout",
    AnalyzeDocumentRequest(url_source=url),
    output_content_format=ContentFormat.MARKDOWN,
)

```

> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/documentintelligence/azure-ai-documentintelligence/samples/sample_analyze_documents_output_in_markdown.py)

#### [Output](#tab/output)

```Markdown
<!-- PageHeader="This is the header of the document." -->

This is title
===
# 1\. Text
Latin refers to an ancient Italic language originating in the region of Latium in ancient Rome.
# 2\. Page Objects
## 2.1 Table
Here's a sample table below, designed to be simple for easy understand and quick reference.
| Name | Corp | Remark |
| - | - | - |
| Foo | | |
| Bar | Microsoft | Dummy |
Table 1: This is a dummy table
## 2.2. Figure
<figure>
<figcaption>

Figure 1: Here is a figure with text
</figcaption>

![](figures/0)
<!-- FigureContent="500 450 400 400 350 250 200 200 200- Feb" -->
</figure>

# 3\. Others
Al Document Intelligence is an Al service that applies advanced machine learning to extract text, key-value pairs, tables, and structures from documents automatically and accurately:
 :selected:
clear
 :selected:
precise
 :unselected:
vague
 :selected:
coherent
 :unselected:
Incomprehensible
Turn documents into usable data and shift your focus to acting on information rather than compiling it. Start with prebuilt models or create custom models tailored to your documents both on premises and in the cloud with the Al Document Intelligence studio or SDK.  
Learn how to accelerate your business processes by automating text extraction with Al Document Intelligence. This webinar features hands-on demos for key use cases such as document processing, knowledge mining, and industry-specific Al model customization.
<!-- PageFooter="This is the footer of the document." -->
<!-- PageFooter="1 | Page" -->
```
---

### Figures

Figures (charts, images) in documents play a crucial role in complementing and enhancing the textual content, providing visual representations that aid in the understanding of complex information. The figures object detected by the Layout model has key properties like `boundingRegions` (the spatial locations of the figure on the document pages, including the page number and the polygon coordinates that outline the figure's boundary), `spans` (details the text spans related to the figure, specifying their offsets and lengths within the document's text. This connection helps in associating the figure with its relevant textual context), `elements` (the identifiers for text elements or paragraphs within the document that are related to or describe the figure) and `caption` if there's any.

#### [Sample code](#tab/sample-code)
```Python
# Analyze figures.
if result.figures:                    
    for figures_idx,figures in enumerate(result.figures):
        print(f"Figure # {figures_idx} has the following spans:{figures.spans}")
        for region in figures.bounding_regions:
            print(f"Figure # {figures_idx} location on page:{region.page_number} is within bounding polygon '{region.polygon}'")                    
```
> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Layout_model/sample_analyze_layout.py)

#### [Output](#tab/output)

```json
{
    "figures": [
      {
        "boundingRegions": [],
        "spans": [],
        "elements": [
          "/paragraphs/15",
          ...
        ],
        "caption": {
          "content": "Here is a figure with some text",
          "boundingRegions": [],
          "spans": [],
          "elements": [
            "/paragraphs/15"
          ]
        }
      }
    ]
}
```
:::image type="content" source="media/document-layout-example-figures.png" alt-text="Screenshot of examples of document figures.":::

---
### Sections
Hierarchical document structure analysis is pivotal in organizing, comprehending, and processing extensive documents. This approach is vital for semantically segmenting long documents to boost comprehension, facilitate navigation, and improve information retrieval. The advent of [Retrieval Augmented Generation (RAG)](concept-retrieval-augmented-generation.md) in document generative AI underscores the significance of hierarchical document structure analysis. The Layout model supports sections and subsections in the output, which identifies the relationship of sections and object within each section. The hierarchical structure is maintained in `elements` of each section. You can use [output to markdown format](#output-to-markdown-format) to easily get the sections and subsections in markdown.

#### [Sample code](#tab/sample-code)
```Python
document_intelligence_client = DocumentIntelligenceClient(endpoint=endpoint, credential=AzureKeyCredential(key))
poller = document_intelligence_client.begin_analyze_document(
    "prebuilt-layout",
    AnalyzeDocumentRequest(url_source=url),
    output_content_format=ContentFormat.MARKDOWN,
)

```
> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/documentintelligence/azure-ai-documentintelligence/samples/sample_analyze_documents_output_in_markdown.py)

#### [Output](#tab/output)
```json
{
    "sections": [
      {
        "spans": [],
        "elements": [
          "/paragraphs/0",
          "/sections/1",
          "/sections/2",
          "/sections/5"
        ]
      },
...
}
```

:::image type="content" source="media/document-layout-example-section.png" alt-text="Screenshot of examples of document sections.":::

---

::: moniker-end

::: moniker range="doc-intel-2.1.0"

### Natural reading order output (Latin only)

You can specify the order in which the text lines are output with the `readingOrder` query parameter. Use `natural` for a more human-friendly reading order output as shown in the following example. This feature is only supported for Latin languages.

:::image type="content" source="media/layout-reading-order-example.png" alt-text="Screenshot of `layout` model reading order processing." lightbox="../../ai-services/Computer-vision/Images/ocr-reading-order-example.png":::

### Select page numbers or ranges for text extraction

For large multi-page documents, use the `pages` query parameter to indicate specific page numbers or page ranges for text extraction. The following example shows a document with 10 pages, with text extracted for both cases - all pages (1-10) and selected pages (3-6).

:::image type="content" source="./media/layout-select-pages.png" alt-text="Screen shot of the layout model selected pages output.":::

## The Get Analyze Layout Result operation

The second step is to call the [Get Analyze Layout Result](https://westcentralus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/GetAnalyzeLayoutResult) operation. This operation takes as input the Result ID the `Analyze Layout` operation created. It returns a JSON response that contains a **status** field with the following possible values.

|Field| Type | Possible values |
|:-----|:----:|:----|
|status | string | `notStarted`: The analysis operation isn't started.</br></br>`running`: The analysis operation is in progress.</br></br>`failed`: The analysis operation failed.</br></br>`succeeded`: The analysis operation succeeded.|

Call this operation iteratively until it returns the `succeeded` value. To avoid exceeding the requests per second (RPS) rate, use an interval of 3 to 5 seconds.

When the **status** field has the `succeeded` value, the JSON response includes the extracted layout, text, tables, and selection marks. The extracted data includes extracted text lines and words, bounding boxes, text appearance with handwritten indication, tables, and selection marks with selected/unselected indicated.

### Handwritten classification for text lines (Latin only)

The response includes classifying whether each text line is of handwriting style or not, along with a confidence score. This feature is only supported for Latin languages. The following example shows the handwritten classification for the text in the image.

:::image type="content" source="./media/layout-handwriting-classification.png" alt-text="Screenshot of `layout` model handwriting classification process.":::

### Sample JSON output

The response to the *Get Analyze Layout Result* operation is a structured representation of the document with all the information extracted.
See here for a [sample document file](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/tree/master/curl/form-recognizer/sample-layout.pdf) and its structured output [sample layout output](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/tree/master/curl/form-recognizer/sample-layout-output.json).

The JSON output has two parts:

* `readResults` node contains all of the recognized text and selection mark. The text presentation hierarchy is page, then line, then individual words.
* `pageResults` node contains the tables and cells extracted with their bounding boxes, confidence, and a reference to the lines and words in "readResults" field.

## Example Output

### Text

Layout API extracts text from documents and images with multiple text angles and colors. It accepts photos of documents, faxes, printed and/or handwritten (English only) text, and mixed modes. Text is extracted with information provided on lines, words, bounding boxes, confidence scores, and style (handwritten or other). All the text information is included in the `readResults` section of the JSON output.

### Tables with headers

Layout API extracts tables in the `pageResults` section of the JSON output. Documents can be scanned, photographed, or digitized. Tables can be complex with merged cells or columns, with or without borders, and with odd angles. Extracted table information includes the number of columns and rows, row span, and column span. Each cell with its bounding box is output along with whether the area is recognized as part of a header or not. The model predicted header cells can span multiple rows and aren't necessarily the first rows in a table. They also work with rotated tables. Each table cell also includes the full text with references to the individual words in the `readResults` section.

![Tables example](./media/layout-table-header-demo.gif)

### Selection marks

Layout API also extracts selection marks from documents. Extracted selection marks include the bounding box, confidence, and state (selected/unselected). Selection mark information is extracted in the `readResults` section of the JSON output.

### Migration guide

* Follow our [**Document Intelligence v3.1 migration guide**](v3-1-migration-guide.md) to learn how to use the v3.1 version in your applications and workflows.
::: moniker-end

## Next steps

::: moniker range=">=doc-intel-3.0.0"

* [Learn how to process your own forms and documents](quickstarts/try-document-intelligence-studio.md) with the [Document Intelligence Studio](https://documentintelligence.ai.azure.com/studio).

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

::: moniker-end

::: moniker range="doc-intel-4.0.0"
* [Find more samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/tree/main/Python(v4.0)/Layout_model)
::: moniker-end

::: moniker range="doc-intel-3.1.0"
* [Find more samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/tree/v3.1(2023-07-31-GA)/Python(v3.1)/Layout_model)
::: moniker-end

::: moniker range="doc-intel-2.1.0"

* [Learn how to process your own forms and documents](quickstarts/try-sample-label-tool.md) with the [Document Intelligence Sample Labeling tool](https://fott-2-1.azurewebsites.net/).

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-2.1.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

::: moniker-end
