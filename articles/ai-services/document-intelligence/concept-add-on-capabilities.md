---
title: Add-on capabilities - Document Intelligence
titleSuffix: Azure AI services
description: How to increase service limit capacity with add-on capabilities.
author: jaep3347
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 11/15/2023
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

Document Intelligence supports more sophisticated and modular analysis capabilities. Use the add-on features to extend the results to include more features extracted from your documents. Some add-on features incur an extra cost. These optional features can be enabled and disabled depending on the scenario of the document extraction. The following add-on capabilities are available for `2023-07-31 (GA)` and later releases:

* [`ocr.highResolution`](#high-resolution-extraction)

* [`ocr.formula`](#formula-extraction)

* [`ocr.font`](#font-property-extraction)

* [`ocr.barcode`](#barcode-property-extraction)
:::moniker-end

:::moniker range="doc-intel-4.0.0"

> [!NOTE]
>
> Add-on capabilities are available within all models except for the [Read model](concept-read.md).

The following add-on capability is available for `2023-10-31-preview` and later releases:

* [`queryFields`](#query-fields)

> [!NOTE]
>
> The query fields implementation in the 2023-10-30-preview API is different from the last preview release. The new implementation is less expensive and works well with structured documents.

::: moniker-end

## High resolution extraction

The task of recognizing small text from large-size documents, like engineering drawings, is a challenge. Often the text is mixed with other graphical elements and has varying fonts, sizes and orientations. Moreover, the text can be broken into separate parts or connected with other symbols. Document Intelligence now supports extracting content from these types of documents with the `ocr.highResolution` capability. You get improved quality of content extraction from A1/A2/A3 documents by enabling this add-on capability.

## Formula extraction

The `ocr.formula` capability extracts all identified formulas, such as mathematical equations, in the `formulas` collection as a top level object under `content`. Inside `content`, detected formulas are represented as `:formula:`. Each entry in this collection represents a formula that includes the formula type as `inline` or `display`, and its LaTeX representation as `value` along with its `polygon` coordinates. Initially, formulas appear at the end of each page.

   > [!NOTE]
   > The `confidence` score is hard-coded.

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

## Font property extraction

The `ocr.font` capability extracts all font properties of text extracted in the `styles` collection as a top-level object under `content`. Each style object specifies a single font property, the text span it applies to, and its corresponding confidence score. The existing style property is extended with more font properties such as `similarFontFamily` for the font of the text, `fontStyle` for styles such as italic and normal, `fontWeight` for bold or normal, `color` for color of the text, and `backgroundColor` for color of the text bounding box.

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

:::moniker range="doc-intel-4.0.0"

## Query Fields

* Document Intelligence now supports query field extractions. With query field extraction, you can add fields to the extraction process using a query request without the need for added training.

* Use query fields when you need to extend the schema of a prebuilt or custom model or need to extract a few fields with the output of layout.

* Query fields are a premium add-on capability. For best results, define the fields you want to extract using camel case or Pascal case field names for multi-work field names.

* Query fields support a maximum of 20 fields per request. If the document contains a value for the field, the field and value are returned.

* This release has a new implementation of the query fields capability that is priced lower than the earlier implementation and should be validated.

> [!NOTE]
>
> Document Intelligence Studio query field extraction is currently available with the Layout and Prebuilt models starting with the `2023-10-31-preview` API and later releases.

### Query field extraction

For query field extraction, specify the fields you want to extract and Document Intelligence analyzes the document accordingly. Here's an example:

* If you're processing a contract in the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/document), use the `2023-10-31-preview` version:

    :::image type="content" source="media/studio/query-fields.png" alt-text="Screenshot of the query fields button in Document Intelligence Studio.":::

* You can pass a list of field labels like `Party1`, `Party2`, `TermsOfUse`, `PaymentTerms`, `PaymentDate`, and `TermEndDate`" as part of the analyze document request.

   :::image type="content" source="media/studio/query-field-select.png" alt-text="Screenshot of query fields selection window in Document Intelligence Studio.":::

* Document Intelligence is able to analyze and extract the field data and return the values in a structured JSON output.

* In addition to the query fields, the response includes text, tables, selection marks, and other relevant data.

:::moniker-end

## Next steps

> [!div class="nextstepaction"]
> Learn more:
> [**Read model**](concept-read.md) [**Layout model**](concept-layout.md).
