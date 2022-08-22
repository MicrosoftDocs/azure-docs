---
title: Layouts - Form Recognizer
titleSuffix: Azure Applied AI Services
description: Learn concepts related to the Layout API with Form Recognizer REST API usage and limits.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 08/22/2022
ms.author: lajanuar
recommendations: false
---

# Form Recognizer layout model

The Form Recognizer Layout API extracts text, tables, selection marks, and structure information from documents (PDF, TIFF) and images (JPG, PNG, BMP).

***Sample form processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/layout)***

:::image type="content" source="media/studio/form-recognizer-studio-layout-newspaper.png" alt-text="Screenshot of sample newspaper page processed using Form Recognizer studio":::

## Supported document types

| **Model**   | **Images**   | **PDF**  | **TIFF** |
| --- | --- | --- | --- |
| Layout  | ✓  | ✓  | ✓  |

### Data extraction

| **Model**   | **Text**   | **Selection Marks**   | **Tables**  | **Paragraphs** | **Paragraph roles** |
| --- | --- | --- | --- | --- | --- |
| Layout  | ✓  | ✓  | ✓  | ✓  | ✓  |

**Supported paragraph roles**:
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
|**Layout model**| <ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/get-started-v3-sdk-rest-api.md)</li><li>[**Python SDK**](quickstarts/get-started-v3-sdk-rest-api.md)</li><li>[**Java SDK**](quickstarts/get-started-v3-sdk-rest-api.md)</li><li>[**JavaScript SDK**](quickstarts/get-started-v3-sdk-rest-api.md)</li></ul>|**prebuilt-layout**|

The following tools are supported by Form Recognizer v2.1:

| Feature | Resources |
|----------|-------------------------|
|**Layout API**| <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/layout-analyze)</li><li>[**REST API**](quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#analyze-layout)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?branch=main&tabs=layout#run-the-container-with-the-docker-compose-up-command)</li></ul>|

## Try Form Recognizer

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

### Text lines and words

Layout API extracts print and handwritten style text as `lines` and `words`. The model outputs bounding `polygon` coordinates and `confidence` for the extracted words. The `styles` collection includes any handwritten style for lines, if detected, along with the spans pointing to the associated text. This feature applies to [supported handwritten languages](language-support.md).

```json
{
    "words": [
        {
            "content": "CONTOSO",
            "polygon": [
                76,
                30,
                118,
                32,
                118,
                43,
                76,
                43
            ],
            "confidence": 1,
            "span": {
                "offset": 0,
                "length": 7
            }
        }
    ]
}

```

### Selection marks

Layout API also extracts selection marks from documents. Extracted selection marks appear within the `pages` collection for each page. They include the bounding `polygon`, `confidence`, and selection `state` (`selected/unselected`). Any associated text if extracted is also included as the starting index (`offset`) and `length` that references the top level `content` property that contains the full text from the document.

```json
{
    "selectionMarks": [
        {
            "state": "unselected",
            "polygon": [
                217,
                862,
                254,
                862,
                254,
                899,
                217,
                899
            ],
            "confidence": 0.995,
            "span": {
                "offset": 1421,
                "length": 12
            }
        }
    ]
}


```

### Tables and table headers

Layout API extracts tables in the `pageResults` section of the JSON output. Documents can be scanned, photographed, or digitized. Extracted table information includes the number of columns and rows, row span, and column span. Each cell with its bounding `polygon` is output along with information whether it's recognized as a `columnHeader` or not. The API also works with rotated tables. Each table cell contains the row and column index and bounding polygon coordinates. For the cell text, the model outputs the `span` information containing the starting index (`offset`). The model also outputs the `length` within the top level `content` that contains the full text from the document.

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
                    "boundingRegions": [
                        {
                            "pageNumber": 1,
                            "polygon": [
                                36,
                                184,
                                843,
                                183,
                                843,
                                209,
                                36,
                                207
                                ]
                            }
                        ],
                        "spans": [
                            {
                                "offset": 511,
                                "length": 40
                            }
                        ]
                    },
            ]
        }
        .
        .
        .
    ]
}

```

### Paragraphs

The Layout model extracts all identified blocks of text in the `paragraphs` collection as a top level object under `analyzeResults`. Each entry in this collection represents a text block and includes the extracted text as`content`and the bounding `polygon` coordinates. The `span` information points to the text fragment within the top level `content` property that contains the full text from the document.

```json
{
    "paragraphs": [
                {
                    "spans": [
                        {
                            "offset": 0,
                            "length": 21
                        }
                    ],
                    "boundingRegions": [
                        {
                            "pageNumber": 1,
                            "polygon": [
                                75,
                                30,
                                118,
                                31,
                                117,
                                68,
                                74,
                                67
                            ]
                        }
                    ],
                    "content": "Tuesday, Sep 20, YYYY"
                }
    ]
}

```

### Paragraph roles

The Layout model may flag certain paragraphs with their specialized type or `role` as predicted by the model. They're best used with unstructured documents to help understand the layout of the extracted content for a richer semantic analysis. The following paragraph roles are supported:

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
                    "spans": [
                        {
                            "offset": 22,
                            "length": 10
                        }
                    ],
                    "boundingRegions": [
                        {
                            "pageNumber": 1,
                            "polygon": [
                                139,
                                10,
                                605,
                                8,
                                605,
                                56,
                                139,
                                58
                            ]
                        }
                    ],
                    "role": "title",
                    "content": "NEWS TODAY"
                }
    ]
}

```

### Select page numbers or ranges for text extraction

For large multi-page documents, use the `pages` query parameter to indicate specific page numbers or page ranges for text extraction.

## Next steps

* Complete a Form Recognizer quickstart:

  > [!div class="nextstepaction"]
  > [Form Recognizer quickstart](quickstarts/try-sdk-rest-api.md)

* Explore our REST API:

  > [!div class="nextstepaction"]
  > [Form Recognizer API v3.0](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)
