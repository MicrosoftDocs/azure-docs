---
title: Add-on capabilities - Document Intelligence
titleSuffix: Azure AI services
description: How to increase service limit capacity with add-on capabilities.
author: jaep3347
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: lajanuar
monikerRange: 'doc-intel-3.1.0'
---




<!-- markdownlint-disable MD033 -->

# Document Intelligence add-on capabilities

[!INCLUDE [applies to v3.1](includes/applies-to-v3-1.md)]

> [!NOTE]
>
> Add-on capabilities for Document Intelligence Studio are available with the Read and Layout models for the `2023-07-31` (GA)release.

Document Intelligence now supports more sophisticated analysis capabilities. These optional capabilities can be enabled and disabled depending on the scenario of the document extraction. There are three add-on capabilities available for the `2023-07-31` (GA) release:

* [`ocr.highResolution`](#high-resolution-extraction)

* [`ocr.formula`](#formula-extraction)

* [`ocr.font`](#font-property-extraction)

## High resolution extraction

The task of recognizing small text from large-size documents, like engineering drawings, is a challenge. Often the text is mixed with other graphical elements and has varying fonts, sizes and orientations. Moreover, the text may be broken into separate parts or connected with other symbols. Document Intelligence now supports extracting content from these types of documents with the `ocr.highResolution` capability. You get improved quality of content extraction from A1/A2/A3 documents by enabling this add-on capability.

## Barcode extraction

The Read OCR model extracts all identified barcodes in the `barcodes` collection as a top level object under `content`. Inside the `content`, detected barcodes are represented as `:barcode:`. Each entry in this collection represents a barcode and includes the barcode type as `kind` and the embedded barcode content as `value` along with its `polygon` coordinates. Initially, barcodes appear at the end of each page. Here, the `confidence` is hard-coded for the public preview (`2023-02-28`) release.

### Supported barcode types

| **Barcode Type**   | **Example**   |
| --- | --- |
| QR Code |:::image type="content" source="media/barcodes/qr-code.png" alt-text="Screenshot of the QR Code.":::|
| Code 39 |:::image type="content" source="media/barcodes/code-39.png" alt-text="Screenshot of the Code 39.":::|
| Code 128 |:::image type="content" source="media/barcodes/code-128.png" alt-text="Screenshot of the Code 128.":::|
| UPC (UPC-A & UPC-E) |:::image type="content" source="media/barcodes/upc.png" alt-text="Screenshot of the UPC.":::|
| PDF417 |:::image type="content" source="media/barcodes/pdf-417.png" alt-text="Screenshot of the PDF417.":::|

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

## Next steps

> [!div class="nextstepaction"]
> Learn more:
> [**Read model**](concept-read.md) [**Layout model**](concept-layout.md).
