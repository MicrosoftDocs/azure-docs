---
title: Add-on capabilities - Form Recognizer
titleSuffix: Azure Applied AI Services
description: How to increase service limit capacity with add-on capabilities.
author: jaep3347
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 02/28/2023
ms.author: lajanuar
monikerRange: 'form-recog-3.0.0'
recommendations: false
---
<!-- markdownlint-disable MD033 -->

# Azure Form Recognizer Add-On Capabilities

**This article applies to:** ![Form Recognizer v3.0 checkmark](media/yes-icon.png) **Form Recognizer v3.0**.

> [!NOTE]
>
> Add-on capabilities for Form Recognizer Studio are only available within the Read and Layout public preview (`2023-03-06`) release models.

## Extract content from large documents with small texts (high resolution documents)

Recognizing small text from large-size documents, like engineering drawings, is a challenging task because the text is often mixed with other graphical elements and have varying fonts, sizes and orientations. Moreover, the text may be broken into separate parts or connected with other symbols. Form Recognizer now supports extracting content from these types of documents with the `ocr.highResolution` capability. You get improved quality of content extraction from A1/A2/A3 documents by enabling this add-on capability.

## Extracting formulas from documents

The `ocr.formula` capability extracts all identified formulas, such as mathematical equations, in the `formulas` collection as a top level object under `content`. Inside `content`, detected formulas are represented as `:formula:`. Each entry in this collection represents a formula that includes the formula type as `inline` or `display`, and its LaTeX representation as `value` along with its `polygon` coordinates. Initially, formulas appear at the end of each page.

   > [!NOTE]
   > The `confidence` scored is hard-coded for the `2023-03-06` public preview release.

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

## Extracting font styles from documents

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
> [**Read model**](concept-read.md) [**Layout model**](./concept-layout.md).
