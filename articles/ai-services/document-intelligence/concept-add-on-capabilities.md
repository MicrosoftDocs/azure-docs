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
ms.date: 11/21/2023
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

Document Intelligence supports more sophisticated and modular analysis capabilities. Use the add-on features to extend the results to include more features extracted from your documents. Some add-on features incur an extra cost. These optional features can be enabled and disabled depending on the scenario of the document extraction. To enable a feature simply add the associated feature name to the `features` query string property. You can enable more than one add-on feature on a request by providing a comma seperated list of features. The following add-on capabilities are available for `2023-07-31 (GA)` and later releases.

* [`ocrHighResolution`](#high-resolution-extraction)

* [`formulas`](#formula-extraction)

* [`styleFont`](#font-property-extraction)

* [`barcodes`](#barcode-property-extraction)

* [`languages`](#language-detection)

:::moniker-end

:::moniker range="doc-intel-4.0.0"

> [!NOTE]
>
> Not all add-on capabilities are supported by all models. For more information, *see* [model data extraction](concept-model-overview.md#analysis-features).

The following add-on capability is available for `2023-10-31-preview` and later releases:

* [`keyValuePairs`](#key-value-pairs)

* [`queryFields`](#query-fields)

> [!NOTE]
>
> The query fields implementation in the 2023-10-30-preview API is different from the last preview release. The new implementation is less expensive and works well with structured documents.

::: moniker-end

|Add-on Capability| Add-On/Free|[2023-10-31-preview](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-10-31-preview&preserve-view=true&tabs=HTTP)|[2023-07-31 (GA)](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)|[2022-08-31 (GA)](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)|[v2.1 (GA)](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeBusinessCardAsync)|
|----------------|-----------|---|--|---|---|
|Font property extraction|Add-On| ✔️| ✔️| n/a| n/a|
|Formula extraction|Add-On| ✔️| ✔️| n/a| n/a|
|High resolution extraction|Add-On| ✔️| ✔️| n/a| n/a|
|Barcode extraction|Free| ✔️| ✔️| n/a| n/a|
|Language detection|Free| ✔️| ✔️| n/a| n/a|
|Key value pairs|Free| ✔️|n/a|n/a| n/a|
|Query fields|Add-On*| ✔️|n/a|n/a| n/a|


Add-On* - Query fields are priced differently than the other add on features. See [pricing](https://azure.microsoft.com/pricing/details/ai-document-intelligence/) for details.

## High resolution extraction

The task of recognizing small text from large-size documents, like engineering drawings, is a challenge. Often the text is mixed with other graphical elements and has varying fonts, sizes and orientations. Moreover, the text can be broken into separate parts or connected with other symbols. Document Intelligence now supports extracting content from these types of documents with the `ocr.highResolution` capability. You get improved quality of content extraction from A1/A2/A3 documents by enabling this add-on capability.

### REST API

::: moniker range="doc-intel-4.0.0"
```REST
https://{your resource}.cognitiveservices.azure.com/documentintelligence/documentModels/prebuilt-layout:analyze?api-version=2023-10-31-preview&features=ocrHighResolution
```
:::moniker-end

:::moniker range="doc-intel-3.1.0"
```REST
https://{your resource}.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-layout:analyze?api-version=2023-07-31&features=ocrHighResolution
```
:::moniker-end

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

   ### REST API

::: moniker range="doc-intel-4.0.0"
```REST
https://{your resource}.cognitiveservices.azure.com/documentintelligence/documentModels/prebuilt-layout:analyze?api-version=2023-10-31-preview&features=formulas
```
:::moniker-end

:::moniker range="doc-intel-3.1.0"
```REST
https://{your resource}.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-layout:analyze?api-version=2023-07-31&features=formulas
```
:::moniker-end

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

### REST API

::: moniker range="doc-intel-4.0.0"
```REST
https://{your resource}.cognitiveservices.azure.com/documentintelligence/documentModels/prebuilt-layout:analyze?api-version=2023-10-31-preview&features=styleFont
```
:::moniker-end

:::moniker range="doc-intel-3.1.0"
```REST
https://{your resource}.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-layout:analyze?api-version=2023-07-31&features=styleFont
```
:::moniker-end

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

### REST API

::: moniker range="doc-intel-4.0.0"
```REST
https://{your resource}.cognitiveservices.azure.com/documentintelligence/documentModels/prebuilt-layout:analyze?api-version=2023-10-31-preview&features=barcodes
```
:::moniker-end

:::moniker range="doc-intel-3.1.0"
```REST
https://{your resource}.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-layout:analyze?api-version=2023-07-31&features=barcodes
```
:::moniker-end

## Language detection

Adding the `languages` feature to the analyze request predicts the detected primary language for each text line along with the `confidence` in the `languages` collection under `analyzeResult`.

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

### REST API

::: moniker range="doc-intel-4.0.0"
```REST
https://{your resource}.cognitiveservices.azure.com/documentintelligence/documentModels/prebuilt-layout:analyze?api-version=2023-10-31-preview&features=languages
```
:::moniker-end

:::moniker range="doc-intel-3.1.0"
```REST
https://{your resource}.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-layout:analyze?api-version=2023-07-31&features=languages
```
:::moniker-end

:::moniker range="doc-intel-4.0.0"

## Key-value Pairs

In earlier API versions the prebuilt-document model extracted keyvalue pairs from forms and documents. With the addition of the `keyValuePairs` feature to prebuilt-layout, the layout model now produces the same results. 

Key-value pairs are specific spans within the document that identify a label or key and its associated response or value. In a structured form, these pairs could be the label and the value the user entered for that field. In an unstructured document, they could be the date a contract was executed on based on the text in a paragraph. The AI model is trained to extract identifiable keys and values based on a wide variety of document types, formats, and structures.

Keys can also exist in isolation when the model detects that a key exists, with no associated value or when processing optional fields. For example, a middle name field can be left blank on a form in some instances. Key-value pairs are spans of text contained in the document. For documents where the same value is described in different ways, for example, customer/user, the associated key is either customer or user (based on context).

### REST API

::: moniker range="doc-intel-4.0.0"
```REST
https://{your resource}.cognitiveservices.azure.com/documentintelligence/documentModels/prebuilt-layout:analyze?api-version=2023-10-31-preview&features=keyValuePairs
```
:::moniker-end

## Query Fields

Query fields is an add-on capability to extend the schema extracted from any prebuilt model or define a specific key name when the key name is variable. To use query fields, set the features to `queryFields` and provide a comma seperated list of field names in the `queryFields` property.

* Document Intelligence now supports query field extractions. With query field extraction, you can add fields to the extraction process using a query request without the need for added training.

* Use query fields when you need to extend the schema of a prebuilt or custom model or need to extract a few fields with the output of layout.

* Query fields are a premium add-on capability. For best results, define the fields you want to extract using camel case or Pascal case field names for multi-word field names.

* Query fields support a maximum of 20 fields per request. If the document contains a value for the field, the field and value are returned.

* This release has a new implementation of the query fields capability that is priced lower than the earlier implementation and should be validated.

> [!NOTE]
>
> Document Intelligence Studio query field extraction is currently available with the Layout and Prebuilt models starting with the `2023-10-31-preview` API and later releases.

### Query field extraction

For query field extraction, specify the fields you want to extract and Document Intelligence analyzes the document accordingly. Here's an example:

* If you're processing a contract in the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/document), use the `2023-10-31-preview` version:

    :::image type="content" source="media/studio/query-fields.png" alt-text="Screenshot of the query fields button in Document Intelligence Studio.":::

* You can pass a list of field labels like `Party1`, `Party2`, `TermsOfUse`, `PaymentTerms`, `PaymentDate`, and `TermEndDate`" as part of the `analyze document` request.

   :::image type="content" source="media/studio/query-field-select.png" alt-text="Screenshot of query fields selection window in Document Intelligence Studio.":::

* Document Intelligence is able to analyze and extract the field data and return the values in a structured JSON output.

* In addition to the query fields, the response includes text, tables, selection marks, and other relevant data.

### REST API

```REST
https://{your resource}.cognitiveservices.azure.com/documentintelligence/documentModels/prebuilt-layout:analyze?api-version=2023-10-31-preview&features=queryFields&queryFields=TERMS
```

:::moniker-end

## Next steps

> [!div class="nextstepaction"]
> Learn more:
> [**Read model**](concept-read.md) [**Layout model**](concept-layout.md).

> [!div class="nextstepaction"]
> SDK samples:
> [**python**](python/api/overview/azure/ai-documentintelligence-readme?view=azure-python-preview#add-on-capabilities) .

