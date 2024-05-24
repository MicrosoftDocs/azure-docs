---
title: Add-on capabilities - Document Intelligence
titleSuffix: Azure AI services
description: How to increase service limit capacity with add-on capabilities.
author: jaep3347
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 05/23/2024
ms.author: lajanuar
monikerRange: '>=doc-intel-3.1.0'
---

<!-- markdownlint-disable MD033 -->

# Document Intelligence add-on capabilities

::: moniker range="doc-intel-4.0.0"
[!INCLUDE [preview-version-notice](includes/preview-notice.md)]

**This content applies to:** ![checkmark](media/yes-icon.png) **v4.0 (preview)** | **Previous versions:** ![blue-checkmark](media/blue-yes-icon.png) [**v3.1 (GA)**](?view=doc-intel-3.1.0&preserve-view=tru)
:::moniker-end

:::moniker range="doc-intel-3.1.0"
**This content applies to:** ![checkmark](media/yes-icon.png) **v3.1 (GA)** | **Latest version:** ![purple-checkmark](media/purple-yes-icon.png) [**v4.0 (preview)**](?view=doc-intel-4.0.0&preserve-view=true)
:::moniker-end

:::moniker range="doc-intel-3.1.0"
> [!NOTE]
> Add-on capabilities are available within all models except for the [Business card model](concept-business-card.md).
:::moniker-end

:::moniker range=">=doc-intel-3.1.0"

## Capabilities

Document Intelligence supports more sophisticated and modular analysis capabilities. Use the add-on features to extend the results to include more features extracted from your documents. Some add-on features incur an extra cost. These optional features can be enabled and disabled depending on the scenario of the document extraction. To enable a feature, add the associated feature name to the `features` query string property. You can enable more than one add-on feature on a request by providing a comma-separated list of features. The following add-on capabilities are available for `2023-07-31 (GA)` and later releases.

* [`ocrHighResolution`](#high-resolution-extraction)

* [`formulas`](#formula-extraction)

* [`styleFont`](#font-property-extraction)

* [`barcodes`](#barcode-property-extraction)

* [`languages`](#language-detection)

:::moniker-end

:::moniker range="doc-intel-4.0.0"

> [!NOTE]
>
> * Not all add-on capabilities are supported by all models. For more information, *see* [model data extraction](concept-model-overview.md#model-analysis-features).
>
> * Add-on capabilities are currently not supported for Microsoft Office file types.

The following add-on capabilities are available for`2024-02-29-preview`, `2024-02-29-preview`, and later releases:

* [`keyValuePairs`](#key-value-pairs)

* [`queryFields`](#query-fields)

> [!NOTE]
>
> The query fields implementation in the 2023-10-30-preview API is different from the last preview release. The new implementation is less expensive and works well with structured documents.

::: moniker-end

## Version availability

|Add-on Capability| Add-On/Free|[2024-02-29-preview](/rest/api/aiservices/operation-groups?view=rest-aiservices-2024-02-29-preview&preserve-view=true)|[`2023-07-31` (GA)](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)|[`2022-08-31` (GA)](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-v3.0%20(2022-08-31)&preserve-view=true&tabs=HTTP)|[v2.1 (GA)](/rest/api/aiservices/analyzer?view=rest-aiservices-v2.1&preserve-view=true)|
|----------------|-----------|---|--|---|---|
|Font property extraction|Add-On| ✔️| ✔️| n/a| n/a|
|Formula extraction|Add-On| ✔️| ✔️| n/a| n/a|
|High resolution extraction|Add-On| ✔️| ✔️| n/a| n/a|
|Barcode extraction|Free| ✔️| ✔️| n/a| n/a|
|Language detection|Free| ✔️| ✔️| n/a| n/a|
|Key value pairs|Free| ✔️|n/a|n/a| n/a|
|Query fields|Add-On*| ✔️|n/a|n/a| n/a|

✱ Add-On - Query fields are priced differently than the other add-on features. See [pricing](https://azure.microsoft.com/pricing/details/ai-document-intelligence/) for details.

## Supported file formats

* `PDF`

* Images: `JPEG`/`JPG`, `PNG`, `BMP`, `TIFF`, `HEIF`

✱ Microsoft Office files are currently not supported.

## High resolution extraction

The task of recognizing small text from large-size documents, like engineering drawings, is a challenge. Often the text is mixed with other graphical elements and has varying fonts, sizes, and orientations. Moreover, the text can be broken into separate parts or connected with other symbols. Document Intelligence now supports extracting content from these types of documents with the `ocr.highResolution` capability. You get improved quality of content extraction from A1/A2/A3 documents by enabling this add-on capability.

::: moniker range="doc-intel-4.0.0"

### [REST API](#tab/rest-api)
```bash
{your-resource-endpoint}.cognitiveservices.azure.com/documentintelligence/documentModels/prebuilt-layout:analyze?api-version=2024-02-29-preview&features=ocrHighResolution
```

### [Sample code](#tab/sample-code)
```Python
# Analyze a document at a URL:
formUrl = "https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Data/add-on/add-on-highres.png?raw=true"
poller = document_intelligence_client.begin_analyze_document(
    "prebuilt-layout",
    AnalyzeDocumentRequest(url_source=formUrl),
    features=[DocumentAnalysisFeature.OCR_HIGH_RESOLUTION],  # Specify which add-on capabilities to enable.
)
result: AnalyzeResult = poller.result()

# [START analyze_with_highres]
if result.styles and any([style.is_handwritten for style in result.styles]):
    print("Document contains handwritten content")
else:
    print("Document does not contain handwritten content")

for page in result.pages:
    print(f"----Analyzing layout from page #{page.page_number}----")
    print(f"Page has width: {page.width} and height: {page.height}, measured with unit: {page.unit}")

    if page.lines:
        for line_idx, line in enumerate(page.lines):
            words = get_words(page, line)
            print(
                f"...Line # {line_idx} has word count {len(words)} and text '{line.content}' "
                f"within bounding polygon '{line.polygon}'"
            )

            for word in words:
                print(f"......Word '{word.content}' has a confidence of {word.confidence}")

    if page.selection_marks:
        for selection_mark in page.selection_marks:
            print(
                f"Selection mark is '{selection_mark.state}' within bounding polygon "
                f"'{selection_mark.polygon}' and has a confidence of {selection_mark.confidence}"
            )

if result.tables:
    for table_idx, table in enumerate(result.tables):
        print(f"Table # {table_idx} has {table.row_count} rows and " f"{table.column_count} columns")
        if table.bounding_regions:
            for region in table.bounding_regions:
                print(f"Table # {table_idx} location on page: {region.page_number} is {region.polygon}")
        for cell in table.cells:
            print(f"...Cell[{cell.row_index}][{cell.column_index}] has text '{cell.content}'")
            if cell.bounding_regions:
                for region in cell.bounding_regions:
                    print(f"...content on page {region.page_number} is within bounding polygon '{region.polygon}'")   
```
> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Add-on_capabilities/sample_analyze_addon_highres.py)

### [Output](#tab/output)
```json
"styles": [true],
"pages": [
  {
    "page_number": 1,
    "width": 1000,
    "height": 800,
    "unit": "px",
    "lines": [
      {
        "line_idx": 1,
        "content": "This",
        "polygon": [10, 20, 30, 40],
        "words": [
          {
            "content": "This",
            "confidence": 0.98
          }
        ]
      }
    ],
    "selection_marks": [
      {
        "state": "selected",
        "polygon": [50, 60, 70, 80],
        "confidence": 0.91
      }
    ]
  }
],
"tables": [
  {
    "table_idx": 1,
    "row_count": 3,
    "column_count": 4,
    "bounding_regions": [
      {
        "page_number": 1,
        "polygon": [100, 200, 300, 400]
      }
    ],
    "cells": [
      {
        "row_index": 1,
        "column_index": 1,
        "content": "Content 1",
        "bounding_regions": [
          {
            "page_number": 1,
            "polygon": [110, 210, 310, 410]
          }
        ]
      }
    ]
  }
]

```
---
::: moniker-end

::: moniker range="doc-intel-3.1.0"
### [REST API](#tab/rest-api)
```bash
{your-resource-endpoint}.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-layout:analyze?api-version=2023-07-31&features=ocrHighResolution
```
### [Sample code](#tab/sample-code)
```Python
# Analyze a document at a URL:
url = "(https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Data/add-on/add-on-highres.png?raw=true"
poller = document_analysis_client.begin_analyze_document_from_url(
    "prebuilt-layout", document_url=url, features=[AnalysisFeature.OCR_HIGH_RESOLUTION]    # Specify which add-on capabilities to enable.
)
result = poller.result()

# [START analyze_with_highres]
if any([style.is_handwritten for style in result.styles]):
    print("Document contains handwritten content")
else:
    print("Document does not contain handwritten content")

for page in result.pages:
    print(f"----Analyzing layout from page #{page.page_number}----")
    print(
        f"Page has width: {page.width} and height: {page.height}, measured with unit: {page.unit}"
    )

    for line_idx, line in enumerate(page.lines):
        words = line.get_words()
        print(
            f"...Line # {line_idx} has word count {len(words)} and text '{line.content}' "
            f"within bounding polygon '{format_polygon(line.polygon)}'"
        )

        for word in words:
            print(
                f"......Word '{word.content}' has a confidence of {word.confidence}"
            )

    for selection_mark in page.selection_marks:
        print(
            f"Selection mark is '{selection_mark.state}' within bounding polygon "
            f"'{format_polygon(selection_mark.polygon)}' and has a confidence of {selection_mark.confidence}"
        )

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
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/v3.1(2023-07-31-GA)/Python(v3.1)/Add-on_capabilities/sample_analyze_addon_highres.py)

### [Output](#tab/output)
```json
"styles": [true],
"pages": [
  {
    "page_number": 1,
    "width": 1000,
    "height": 800,
    "unit": "px",
    "lines": [
      {
        "line_idx": 1,
        "content": "This",
        "polygon": [10, 20, 30, 40],
        "words": [
          {
            "content": "This",
            "confidence": 0.98
          }
        ]
      }
    ],
    "selection_marks": [
      {
        "state": "selected",
        "polygon": [50, 60, 70, 80],
        "confidence": 0.91
      }
    ]
  }
],
"tables": [
  {
    "table_idx": 1,
    "row_count": 3,
    "column_count": 4,
    "bounding_regions": [
      {
        "page_number": 1,
        "polygon": [100, 200, 300, 400]
      }
    ],
    "cells": [
      {
        "row_index": 1,
        "column_index": 1,
        "content": "Content 1",
        "bounding_regions": [
          {
            "page_number": 1,
            "polygon": [110, 210, 310, 410]
          }
        ]
      }
    ]
  }
]

```
---
::: moniker-end

## Formula extraction

The `ocr.formula` capability extracts all identified formulas, such as mathematical equations, in the `formulas` collection as a top level object under `content`. Inside `content`, detected formulas are represented as `:formula:`. Each entry in this collection represents a formula that includes the formula type as `inline` or `display`, and its LaTeX representation as `value` along with its `polygon` coordinates. Initially, formulas appear at the end of each page.

   > [!NOTE]
   > The `confidence` score is hard-coded.

::: moniker range="doc-intel-4.0.0"

### [REST API](#tab/rest-api)
```bash
{your-resource-endpoint}.cognitiveservices.azure.com/documentintelligence/documentModels/prebuilt-layout:analyze?api-version=2024-02-29-preview&features=formulas
```
### [Sample code](#tab/sample-code)
```Python
# Analyze a document at a URL:
formUrl = "https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Data/add-on/layout-formulas.png?raw=true"
poller = document_intelligence_client.begin_analyze_document(
    "prebuilt-layout",
    AnalyzeDocumentRequest(url_source=formUrl),
    features=[DocumentAnalysisFeature.FORMULAS],  # Specify which add-on capabilities to enable
)       
result: AnalyzeResult = poller.result()

# [START analyze_formulas]
for page in result.pages:
    print(f"----Formulas detected from page #{page.page_number}----")
    if page.formulas:
        inline_formulas = [f for f in page.formulas if f.kind == "inline"]
        display_formulas = [f for f in page.formulas if f.kind == "display"]

        # To learn the detailed concept of "polygon" in the following content, visit: https://aka.ms/bounding-region 
        print(f"Detected {len(inline_formulas)} inline formulas.")
        for formula_idx, formula in enumerate(inline_formulas):
            print(f"- Inline #{formula_idx}: {formula.value}")
            print(f"  Confidence: {formula.confidence}")
            print(f"  Bounding regions: {formula.polygon}")

        print(f"\nDetected {len(display_formulas)} display formulas.")
        for formula_idx, formula in enumerate(display_formulas):
            print(f"- Display #{formula_idx}: {formula.value}")
            print(f"  Confidence: {formula.confidence}")
            print(f"  Bounding regions: {formula.polygon}")
```
> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Add-on_capabilities/sample_analyze_addon_formulas.py)

### [Output](#tab/output)
```json
"content": ":formula:",
 "pages": [
   {
     "pageNumber": 1,
     "formulas": [
       {
         "kind": "inline",
         "value": "\\frac { \\partial a } { \\partial b }",
         "polygon": [...],
         "span": {...},
         "confidence": 0.99
       },
       {
         "kind": "display",
         "value": "y = a \\times b + a \\times c",
         "polygon": [...],
         "span": {...},
         "confidence": 0.99
       }
     ]
   }
 ]
```
::: moniker-end

::: moniker range="doc-intel-3.1.0"

### [REST API](#tab/rest-api)
```bash
{your-resource-endpoint}.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-layout:analyze?api-version=2023-07-31&features=formulas
```
### [Sample code](#tab/sample-code)
```Python
# Analyze a document at a URL:
url = "https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Data/add-on/layout-formulas.png?raw=true"
poller = document_analysis_client.begin_analyze_document_from_url(
    "prebuilt-layout", document_url=url, features=[AnalysisFeature.FORMULAS]    # Specify which add-on capabilities to enable
)
result = poller.result()

# [START analyze_formulas]
for page in result.pages:
    print(f"----Formulas detected from page #{page.page_number}----")
    inline_formulas = [f for f in page.formulas if f.kind == "inline"]
    display_formulas = [f for f in page.formulas if f.kind == "display"]

    print(f"Detected {len(inline_formulas)} inline formulas.")
    for formula_idx, formula in enumerate(inline_formulas):
        print(f"- Inline #{formula_idx}: {formula.value}")
        print(f"  Confidence: {formula.confidence}")
        print(f"  Bounding regions: {format_polygon(formula.polygon)}")

    print(f"\nDetected {len(display_formulas)} display formulas.")
    for formula_idx, formula in enumerate(display_formulas):
        print(f"- Display #{formula_idx}: {formula.value}")
        print(f"  Confidence: {formula.confidence}")
        print(f"  Bounding regions: {format_polygon(formula.polygon)}")
```
> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/v3.1(2023-07-31-GA)/Python(v3.1)/Add-on_capabilities/sample_analyze_addon_formulas.py)

### [Output](#tab/output)
```json
 "content": ":formula:",
   "pages": [
     {
       "pageNumber": 1,
       "formulas": [
         {
           "kind": "inline",
           "value": "\\frac { \\partial a } { \\partial b }",
           "polygon": [...],
           "span": {...},
           "confidence": 0.99
         },
         {
           "kind": "display",
           "value": "y = a \\times b + a \\times c",
           "polygon": [...],
           "span": {...},
           "confidence": 0.99
         }
       ]
     }
   ]
```
---
::: moniker-end

## Font property extraction

The `ocr.font` capability extracts all font properties of text extracted in the `styles` collection as a top-level object under `content`. Each style object specifies a single font property, the text span it applies to, and its corresponding confidence score. The existing style property is extended with more font properties such as `similarFontFamily` for the font of the text, `fontStyle` for styles such as italic and normal, `fontWeight` for bold or normal, `color` for color of the text, and `backgroundColor` for color of the text bounding box.

::: moniker range="doc-intel-4.0.0"

### [REST API](#tab/rest-api)

```bash
  {your-resource-endpoint}.cognitiveservices.azure.com/documentintelligence/documentModels/prebuilt-layout:analyze?api-version=2024-02-29-preview&features=styleFont
```

### [Sample code](#tab/sample-code)
```Python
# Analyze a document at a URL:
formUrl = "https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Data/receipt/receipt-with-tips.png?raw=true"
poller = document_intelligence_client.begin_analyze_document(
    "prebuilt-layout",
    AnalyzeDocumentRequest(url_source=formUrl),
    features=[DocumentAnalysisFeature.STYLE_FONT]    # Specify which add-on capabilities to enable.
)       
result: AnalyzeResult = poller.result()

# [START analyze_fonts]
# DocumentStyle has the following font related attributes:
similar_font_families = defaultdict(list)  # e.g., 'Arial, sans-serif
font_styles = defaultdict(list)  # e.g, 'italic'
font_weights = defaultdict(list)  # e.g., 'bold'
font_colors = defaultdict(list)  # in '#rrggbb' hexadecimal format
font_background_colors = defaultdict(list)  # in '#rrggbb' hexadecimal format

if result.styles and any([style.is_handwritten for style in result.styles]):
    print("Document contains handwritten content")
else:
    print("Document does not contain handwritten content")
    return

print("\n----Fonts styles detected in the document----")

# Iterate over the styles and group them by their font attributes.
for style in result.styles:
    if style.similar_font_family:
        similar_font_families[style.similar_font_family].append(style)
    if style.font_style:
        font_styles[style.font_style].append(style)
    if style.font_weight:
        font_weights[style.font_weight].append(style)
    if style.color:
        font_colors[style.color].append(style)
    if style.background_color:
        font_background_colors[style.background_color].append(style)

print(f"Detected {len(similar_font_families)} font families:")
for font_family, styles in similar_font_families.items():
    print(f"- Font family: '{font_family}'")
    print(f"  Text: '{get_styled_text(styles, result.content)}'")

print(f"\nDetected {len(font_styles)} font styles:")
for font_style, styles in font_styles.items():
    print(f"- Font style: '{font_style}'")
    print(f"  Text: '{get_styled_text(styles, result.content)}'")

print(f"\nDetected {len(font_weights)} font weights:")
for font_weight, styles in font_weights.items():
    print(f"- Font weight: '{font_weight}'")
    print(f"  Text: '{get_styled_text(styles, result.content)}'")

print(f"\nDetected {len(font_colors)} font colors:")
for font_color, styles in font_colors.items():
    print(f"- Font color: '{font_color}'")
    print(f"  Text: '{get_styled_text(styles, result.content)}'")

print(f"\nDetected {len(font_background_colors)} font background colors:")
for font_background_color, styles in font_background_colors.items():
    print(f"- Font background color: '{font_background_color}'")
    print(f"  Text: '{get_styled_text(styles, result.content)}'")
```
> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Add-on_capabilities/sample_analyze_addon_fonts.py)

### [Output](#tab/output)
```json
"content": "Foo bar",
"styles": [
   {
     "similarFontFamily": "Arial, sans-serif",
     "spans": [ { "offset": 0, "length": 3 } ],
     "confidence": 0.98
   },
   {
     "similarFontFamily": "Times New Roman, serif",
     "spans": [ { "offset": 4, "length": 3 } ],
     "confidence": 0.98
   },
   {
     "fontStyle": "italic",
     "spans": [ { "offset": 1, "length": 2 } ],
     "confidence": 0.98
   },
   {
     "fontWeight": "bold",
     "spans": [ { "offset": 2, "length": 3 } ],
     "confidence": 0.98
   },
   {
     "color": "#FF0000",
     "spans": [ { "offset": 4, "length": 2 } ],
     "confidence": 0.98
   },
   {
     "backgroundColor": "#00FF00",
     "spans": [ { "offset": 5, "length": 2 } ],
     "confidence": 0.98
   }
 ]
```
---
::: moniker-end

::: moniker range="doc-intel-3.1.0"

### [REST API](#tab/rest-api)
```bash
  {your-resource-endpoint}.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-layout:analyze?api-version=2023-07-31&features=styleFont
```

### [Sample code](#tab/sample-code)
```Python
# Analyze a document at a URL:
url = "https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Data/receipt/receipt-with-tips.png?raw=true"
poller = document_analysis_client.begin_analyze_document_from_url(
    "prebuilt-layout", document_url=url, features=[AnalysisFeature.STYLE_FONT]    # Specify which add-on capabilities to enable.
)
result = poller.result()

# [START analyze_fonts]
# DocumentStyle has the following font related attributes:
similar_font_families = defaultdict(list)   # e.g., 'Arial, sans-serif
font_styles = defaultdict(list)             # e.g, 'italic'
font_weights = defaultdict(list)            # e.g., 'bold'
font_colors = defaultdict(list)             # in '#rrggbb' hexadecimal format
font_background_colors = defaultdict(list)  # in '#rrggbb' hexadecimal format

if any([style.is_handwritten for style in result.styles]):
    print("Document contains handwritten content")
else:
    print("Document does not contain handwritten content")

print("\n----Fonts styles detected in the document----")

# Iterate over the styles and group them by their font attributes.
for style in result.styles:
    if style.similar_font_family:
        similar_font_families[style.similar_font_family].append(style)
    if style.font_style:
        font_styles[style.font_style].append(style)
    if style.font_weight:
        font_weights[style.font_weight].append(style)
    if style.color:
        font_colors[style.color].append(style)
    if style.background_color:
        font_background_colors[style.background_color].append(style)

print(f"Detected {len(similar_font_families)} font families:")
for font_family, styles in similar_font_families.items():
    print(f"- Font family: '{font_family}'")
    print(f"  Text: '{get_styled_text(styles, result.content)}'")

print(f"\nDetected {len(font_styles)} font styles:")
for font_style, styles in font_styles.items():
    print(f"- Font style: '{font_style}'")
    print(f"  Text: '{get_styled_text(styles, result.content)}'")

print(f"\nDetected {len(font_weights)} font weights:")
for font_weight, styles in font_weights.items():
    print(f"- Font weight: '{font_weight}'")
    print(f"  Text: '{get_styled_text(styles, result.content)}'")

print(f"\nDetected {len(font_colors)} font colors:")
for font_color, styles in font_colors.items():
    print(f"- Font color: '{font_color}'")
    print(f"  Text: '{get_styled_text(styles, result.content)}'")

print(f"\nDetected {len(font_background_colors)} font background colors:")
for font_background_color, styles in font_background_colors.items():
    print(f"- Font background color: '{font_background_color}'")
    print(f"  Text: '{get_styled_text(styles, result.content)}'")
```
> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/v3.1(2023-07-31-GA)/Python(v3.1)/Add-on_capabilities/sample_analyze_addon_fonts.py)

### [Output](#tab/output)
```json
"content": "Foo bar",
"styles": [
   {
     "similarFontFamily": "Arial, sans-serif",
     "spans": [ { "offset": 0, "length": 3 } ],
     "confidence": 0.98
   },
   {
     "similarFontFamily": "Times New Roman, serif",
     "spans": [ { "offset": 4, "length": 3 } ],
     "confidence": 0.98
   },
   {
     "fontStyle": "italic",
     "spans": [ { "offset": 1, "length": 2 } ],
     "confidence": 0.98
   },
   {
     "fontWeight": "bold",
     "spans": [ { "offset": 2, "length": 3 } ],
     "confidence": 0.98
   },
   {
     "color": "#FF0000",
     "spans": [ { "offset": 4, "length": 2 } ],
     "confidence": 0.98
   },
   {
     "backgroundColor": "#00FF00",
     "spans": [ { "offset": 5, "length": 2 } ],
     "confidence": 0.98
   }
 ]
```
---
::: moniker-end

## Barcode property extraction

The `ocr.barcode` capability extracts all identified barcodes in the `barcodes` collection as a top level object under `content`. Inside the `content`, detected barcodes are represented as `:barcode:`. Each entry in this collection represents a barcode and includes the barcode type as `kind` and the embedded barcode content as `value` along with its `polygon` coordinates. Initially, barcodes appear at the end of each page. The `confidence` is hard-coded for as 1.

### Supported barcode types

| **Barcode Type**   | **Example**   |
| --- | --- |
| `QR Code` |:::image type="content" source="media/barcodes/qr-code.png" alt-text="Screenshot of the QR Code.":::|
| `Code 39` |:::image type="content" source="media/barcodes/code-39.png" alt-text="Screenshot of the Code 39.":::|
| `Code 93` |:::image type="content" source="media/barcodes/code-93.gif" alt-text="Screenshot of the Code 93.":::|
| `Code 128` |:::image type="content" source="media/barcodes/code-128.png" alt-text="Screenshot of the Code 128.":::|
| `UPC (UPC-A & UPC-E)` |:::image type="content" source="media/barcodes/upc.png" alt-text="Screenshot of the UPC.":::|
| `PDF417` |:::image type="content" source="media/barcodes/pdf-417.png" alt-text="Screenshot of the PDF417.":::|
| `EAN-8` |:::image type="content" source="media/barcodes/european-article-number-8.gif" alt-text="Screenshot of the European-article-number barcode ean-8.":::|
| `EAN-13` |:::image type="content" source="media/barcodes/european-article-number-13.gif" alt-text="Screenshot of the European-article-number barcode ean-13.":::|
| `Codabar` |:::image type="content" source="media/barcodes/codabar.png" alt-text="Screenshot of the Codabar.":::|
| `Databar` |:::image type="content" source="media/barcodes/databar.png" alt-text="Screenshot of the Data bar.":::|
| `Databar` Expanded |:::image type="content" source="media/barcodes/databar-expanded.gif" alt-text="Screenshot of the Data bar Expanded.":::|
| `ITF` |:::image type="content" source="media/barcodes/interleaved-two-five.png" alt-text="Screenshot of the interleaved-two-of-five barcode (ITF).":::|
| `Data Matrix` |:::image type="content" source="media/barcodes/datamatrix.gif" alt-text="Screenshot of the Data Matrix.":::|

::: moniker range="doc-intel-4.0.0"
### [REST API](#tab/rest-api)
```bash
{your-resource-endpoint}.cognitiveservices.azure.com/documentintelligence/documentModels/prebuilt-layout:analyze?api-version=2024-02-29-preview&features=barcodes
```
### [Sample code](#tab/sample-code)
```Python
# Analyze a document at a URL:
formUrl = "https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Data/add-on/add-on-barcodes.jpg?raw=true"
poller = document_intelligence_client.begin_analyze_document(
    "prebuilt-read",
    AnalyzeDocumentRequest(url_source=formUrl),
    features=[DocumentAnalysisFeature.BARCODES]    # Specify which add-on capabilities to enable.
)       
result: AnalyzeResult = poller.result()

# [START analyze_barcodes]
# Iterate over extracted barcodes on each page.
for page in result.pages:
    print(f"----Barcodes detected from page #{page.page_number}----")
    if page.barcodes:
        print(f"Detected {len(page.barcodes)} barcodes:")
        for barcode_idx, barcode in enumerate(page.barcodes):
            print(f"- Barcode #{barcode_idx}: {barcode.value}")
            print(f"  Kind: {barcode.kind}")
            print(f"  Confidence: {barcode.confidence}")
            print(f"  Bounding regions: {barcode.polygon}")
```
> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Add-on_capabilities/sample_analyze_addon_barcodes.py)

### [Output](#tab/output)
```json
----Barcodes detected from page #1----
Detected 2 barcodes:
- Barcode #0: 123456
  Kind: QRCode
  Confidence: 0.95
  Bounding regions: [10.5, 20.5, 30.5, 40.5]
- Barcode #1: 789012
  Kind: QRCode
  Confidence: 0.98
  Bounding regions: [50.5, 60.5, 70.5, 80.5]
```
---
:::moniker-end

:::moniker range="doc-intel-3.1.0"

### [REST API](#tab/rest-api)
```bash
{your-resource-endpoint}.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-layout:analyze?api-version=2023-07-31&features=barcodes
```
### [Sample code](#tab/sample-code)
```Python
# Analyze a document at a URL:
url = "https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Data/add-on/add-on-barcodes.jpg?raw=true"
poller = document_analysis_client.begin_analyze_document_from_url(
    "prebuilt-layout", document_url=url, features=[AnalysisFeature.BARCODES]    # Specify which add-on capabilities to enable.
)
result = poller.result()

# [START analyze_barcodes]
# Iterate over extracted barcodes on each page.
for page in result.pages:
    print(f"----Barcodes detected from page #{page.page_number}----")
    print(f"Detected {len(page.barcodes)} barcodes:")
    for barcode_idx, barcode in enumerate(page.barcodes):
        print(f"- Barcode #{barcode_idx}: {barcode.value}")
        print(f"  Kind: {barcode.kind}")
        print(f"  Confidence: {barcode.confidence}")
        print(f"  Bounding regions: {format_polygon(barcode.polygon)}")
```
> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/v3.1(2023-07-31-GA)/Python(v3.1)/Add-on_capabilities/sample_analyze_addon_barcodes.py)

### [Output](#tab/output)
```json
----Barcodes detected from page #1----
Detected 2 barcodes:
- Barcode #0: 123456
  Kind: QRCode
  Confidence: 0.95
  Bounding regions: [10.5, 20.5, 30.5, 40.5]
- Barcode #1: 789012
  Kind: QRCode
  Confidence: 0.98
  Bounding regions: [50.5, 60.5, 70.5, 80.5]
```
---
::: moniker-end

## Language detection

Adding the `languages` feature to the `analyzeResult` request predicts the detected primary language for each text line along with the `confidence` in the `languages` collection under `analyzeResult`.

::: moniker range="doc-intel-4.0.0"

### [REST API](#tab/rest-api)
```bash
{your-resource-endpoint}.cognitiveservices.azure.com/documentintelligence/documentModels/prebuilt-layout:analyze?api-version=2024-02-29-preview&features=languages
```
### [Sample code](#tab/sample-code)
```Python
# Analyze a document at a URL:
formUrl = "https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Data/add-on/add-on-fonts_and_languages.png?raw=true"
poller = document_intelligence_client.begin_analyze_document(
    "prebuilt-layout",
    AnalyzeDocumentRequest(url_source=formUrl),
    features=[DocumentAnalysisFeature.LANGUAGES]     # Specify which add-on capabilities to enable.
)       
result: AnalyzeResult = poller.result()

# [START analyze_languages]
print("----Languages detected in the document----")
if result.languages:
    print(f"Detected {len(result.languages)} languages:")
    for lang_idx, lang in enumerate(result.languages):
        print(f"- Language #{lang_idx}: locale '{lang.locale}'")
        print(f"  Confidence: {lang.confidence}")
        print(
            f"  Text: '{','.join([result.content[span.offset : span.offset + span.length] for span in lang.spans])}'"
        )
```
> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Add-on_capabilities/sample_analyze_addon_languages.py)

### [Output](#tab/output)
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
---
:::moniker-end

:::moniker range="doc-intel-3.1.0"

### [REST API](#tab/rest-api)
```bash
{your-resource-endpoint}.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-layout:analyze?api-version=2023-07-31&features=languages
```
### [Sample code](#tab/sample-code)
```Python
# Analyze a document at a URL:
url = "https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Data/add-on/add-on-fonts_and_languages.png?raw=true"
poller = document_analysis_client.begin_analyze_document_from_url(
    "prebuilt-layout", document_url=url, features=[AnalysisFeature.LANGUAGES]    # Specify which add-on capabilities to enable.
)
result = poller.result()

# [START analyze_languages]
print("----Languages detected in the document----")
print(f"Detected {len(result.languages)} languages:")
for lang_idx, lang in enumerate(result.languages):
    print(f"- Language #{lang_idx}: locale '{lang.locale}'")
    print(f"  Confidence: {lang.confidence}")
    print(f"  Text: '{','.join([result.content[span.offset : span.offset + span.length] for span in lang.spans])}'")
```
> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/v3.1(2023-07-31-GA)/Python(v3.1)/Add-on_capabilities/sample_analyze_addon_languages.py)

### [Output](#tab/output)
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
---
::: moniker-end

::: moniker range="doc-intel-4.0.0"

## Key-value Pairs

In earlier API versions, the prebuilt-document model extracted key-value pairs from forms and documents. With the addition of the `keyValuePairs` feature to prebuilt-layout, the layout model now produces the same results. 

Key-value pairs are specific spans within the document that identify a label or key and its associated response or value. In a structured form, these pairs could be the label and the value the user entered for that field. In an unstructured document, they could be the date a contract was executed on based on the text in a paragraph. The AI model is trained to extract identifiable keys and values based on a wide variety of document types, formats, and structures.

Keys can also exist in isolation when the model detects that a key exists, with no associated value or when processing optional fields. For example, a middle name field can be left blank on a form in some instances. Key-value pairs are spans of text contained in the document. For documents where the same value is described in different ways, for example, customer/user, the associated key is either customer or user (based on context).

### REST API

```bash
{your-resource-endpoint}.cognitiveservices.azure.com/documentintelligence/documentModels/prebuilt-layout:analyze?api-version=2024-02-29-preview&features=keyValuePairs
```

## Query Fields

Query fields are an add-on capability to extend the schema extracted from any prebuilt model or define a specific key name when the key name is variable. To use query fields, set the features to `queryFields` and provide a comma-separated list of field names in the `queryFields` property.

* Document Intelligence now supports query field extractions. With query field extraction, you can add fields to the extraction process using a query request without the need for added training.

* Use query fields when you need to extend the schema of a prebuilt or custom model or need to extract a few fields with the output of layout.

* Query fields are a premium add-on capability. For best results, define the fields you want to extract using camel case or Pascal case field names for multi-word field names.

* Query fields support a maximum of 20 fields per request. If the document contains a value for the field, the field and value are returned.

* This release has a new implementation of the query fields capability that is priced lower than the earlier implementation and should be validated.

> [!NOTE]
>
> Document Intelligence Studio query field extraction is currently available with the Layout and Prebuilt models `2024-02-29-preview` `2023-10-31-preview` API and later releases except for the `US tax` models (W2, 1098s, and 1099s models).

### Query field extraction

For query field extraction, specify the fields you want to extract and Document Intelligence analyzes the document accordingly. Here's an example:

* If you're processing a contract in the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/document), use the `2024-02-29-preview` or `2023-10-31-preview` versions:

    :::image type="content" source="media/studio/query-fields.png" alt-text="Screenshot of the query fields button in Document Intelligence Studio.":::

* You can pass a list of field labels like `Party1`, `Party2`, `TermsOfUse`, `PaymentTerms`, `PaymentDate`, and `TermEndDate` as part of the `analyze document` request.

   :::image type="content" source="media/studio/query-field-select.png" alt-text="Screenshot of query fields selection window in Document Intelligence Studio.":::

* Document Intelligence is able to analyze and extract the field data and return the values in a structured JSON output.

* In addition to the query fields, the response includes text, tables, selection marks, and other relevant data.

### [REST API](#tab/rest-api)

```bash
{your-resource-endpoint}.cognitiveservices.azure.com/documentintelligence/documentModels/prebuilt-layout:analyze?api-version=2024-02-29-preview&features=queryFields&queryFields=TERMS
```

### [Sample code](#tab/sample-code)
```Python
# Analyze a document at a URL:
formUrl = "https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Data/invoice/simple-invoice.png?raw=true"
poller = document_intelligence_client.begin_analyze_document(
    "prebuilt-layout",
    AnalyzeDocumentRequest(url_source=formUrl),   
    features=[DocumentAnalysisFeature.QUERY_FIELDS],    # Specify which add-on capabilities to enable.
    query_fields=["Address", "InvoiceNumber"],  # Set the features and provide a comma-separated list of field names.
)
result: AnalyzeResult = poller.result()
print("Here are extra fields in result:\n")
if result.documents:
    for doc in result.documents:
        if doc.fields and doc.fields["Address"]:
            print(f"Address: {doc.fields['Address'].value_string}")
        if doc.fields and doc.fields["InvoiceNumber"]:
            print(f"Invoice number: {doc.fields['InvoiceNumber'].value_string}")
```
> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Add-on_capabilities/sample_analyze_addon_query_fields.py)

### [Output](#tab/output)
```json
Address: 1 Redmond way Suite 6000 Redmond, WA Sunnayvale, 99243
Invoice number: 34278587
```
---

::: moniker-end


## Next steps

> [!div class="nextstepaction"]
> Learn more:
> [**Read model**](concept-read.md) [**Layout model**](concept-layout.md)

> [!div class="nextstepaction"]
> SDK samples:
> [**python**](/python/api/overview/azure/ai-documentintelligence-readme)

::: moniker range="doc-intel-4.0.0"
> [!div class="nextstepaction"]
> Find more samples:
> [**Add-on capabilities**](https://github.com/Azure-Samples/document-intelligence-code-samples/tree/main/Python(v4.0)/Add-on_capabilities)
::: moniker-end

::: moniker range="doc-intel-3.1.0"
> [!div class="nextstepaction"]
> Find more samples:
> [**Add-on capabilities**](https://github.com/Azure-Samples/document-intelligence-code-samples/tree/v3.1(2023-07-31-GA)/Python(v3.1)/Add-on_capabilities)
::: moniker-end
