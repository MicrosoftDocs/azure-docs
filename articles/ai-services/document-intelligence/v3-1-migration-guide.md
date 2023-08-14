---
title: "How-to: Migrate Document Intelligence (formerly Form Recognizer) applications to v3.1."
titleSuffix: Azure AI services
description: In this how-to guide, learn the differences between Document Intelligence API v3.0 and v3.1 and how to move to the newer version of the API.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: how-to
ms.date: 07/18/2023
ms.author: lajanuar
monikerRange: '<=doc-intel-3.1.0'
---

<!-- markdownlint-disable MD004 -->
# Document Intelligence v3.1 migration

::: moniker range="<=doc-intel-3.1.0"
[!INCLUDE [applies to v3.1, v3.0, and v2.1](includes/applies-to-v3-1-v3-0-v2-1.md)]
::: moniker-end

> [!IMPORTANT]
>
> Document Intelligence REST API v3.1 introduces breaking changes in the REST API request and analyze response JSON.

## Migrating from v3.1 preview API version

Preview APIs are periodically deprecated. If you're using a preview API version, update your application to target the GA API version. To migrate from the 2023-02-28-preview API version to the `2023-07-31` (GA) API version using the SDK, update to the [current version of the language specific SDK](sdk-overview.md).

The `2023-07-31` (GA) API has a few updates and changes from the preview API version:

- The features that are enabled by default are limited to ones essential to the particular model with the benefit of reduced latency and response size. Added features can be enabled via enum values in `features` parameter.
- Some layout features from prebuilt-read and keyValuePairs beyond prebuilt-{document,invoice} are no longer supported.
- Disabling barcodes by default for prebuilt-read and prebuilt-layout, languages for prebuilt-read, and keyValuePairs for prebuilt-invoice.
- Annotation extraction is removed.
- Query fields and common names of key-value pairs are removed.
- Office/HTML files are supported in prebuilt-read model, extracting words and paragraphs without bounding boxes. Embedded images are no longer supported. If add-on features are requested for Office/HTML files, an empty array is returned without errors.

### Analysis features

| Model ID | Text Extraction | Paragraphs | Paragraph Roles | Selection Marks | Tables | Key-Value Pairs | Languages | Barcodes | Document Analysis | Formulas* | StyleFont* | OCR High Resolution* |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| prebuilt-read | ✓ | ✓ |  |  |  |  | O | O |  | O | O | O |
| prebuilt-layout | ✓ | ✓ | ✓ | ✓ | ✓ |  | O | O |  | O | O | O |
| prebuilt-document | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | O | O |  | O | O | O |
| prebuilt-businessCard | ✓ |  |  |  |  |  |  |  | ✓ |  |  |  |
| prebuilt-idDocument | ✓ |  |  |  |  |  | O | O | ✓ | O | O | O |
| prebuilt-invoice | ✓ |  |  | ✓ | ✓ | O | O | O | ✓ | O | O | O |
| prebuilt-receipt | ✓ |  |  |  |  |  | O | O | ✓ | O | O | O |
| prebuilt-healthInsuranceCard.us | ✓ |  |  |  |  |  | O | O | ✓ | O | O | O |
| prebuilt-tax.us.w2 | ✓ |  |  | ✓ |  |  | O | O | ✓ | O | O | O |
| prebuilt-tax.us.1098 | ✓ |  |  | ✓ |  |  | O | O | ✓ | O | O | O |
| prebuilt-tax.us.1098E | ✓ |  |  | ✓ |  |  | O | O | ✓ | O | O | O |
| prebuilt-tax.us.1098T | ✓ |  |  | ✓ |  |  | O | O | ✓ | O | O | O |
| prebuilt-contract | ✓ | ✓ | ✓ | ✓ |  |  | O | O | ✓ | O | O | O |
| { *customModelName* } | ✓ | ✓ | ✓ | ✓ | ✓ |  | O | O | ✓ | O | O | O |

✓ - Enabled
O - Optional
Formulas/StyleFont/OCR High Resolution* - Premium features incur added costs

## Migrating from v3.0

Compared with v3.0, Document Intelligence v3.1 introduces several new features and capabilities:

* [Barcode](concept-read.md#barcode-extraction) extraction.
* [Add-on capabilities](concept-add-on-capabilities.md) including high resolution, formula, and font properties extraction.
* [Custom classification model](concept-custom-classifier.md) for document splitting and classification.
* Language expansion and new fields support in [Invoice](concept-invoice.md) and [Receipt](concept-receipt.md) model.
* New document type support in [ID document](concept-id-document.md) model.
* New prebuilt [Health insurance card](concept-insurance-card.md) model.
* Office/HTML files are supported in prebuilt-read model, extracting words and paragraphs without bounding boxes. Embedded images are no longer supported. If add-on features are requested for Office/HTML files, an empty array is returned without errors.
* Model expiration for custom extraction and classification models - Our new custom models build upon on a large base model that we update periodically for quality improvement. An expiration date is introduced to all custom models to enable the retirement of the corresponding base models.  Once a custom model expires, you need to retrain the model using the latest API version (base model).

```http
GET /documentModels/{customModelId}?api-version={apiVersion}
{
  "modelId": "{customModelId}",
  "description": "{customModelDescription}",
  "createdDateTime": "2023-09-24T12:54:35Z",
  "expirationDateTime": "2025-01-01T00:00:00Z",
  "apiVersion": "2023-07-31",
  "docTypes": { ... }
}
```

* Custom neural model build quota - The number of neural models each subscription can build per region every month is limited. We expand the result JSON to include the quota and used information to help you understand the current usage as part of the resource information returned by GET /info.

```http
{
  "customDocumentModels": { ... },
  "customNeuralDocumentModelBuilds": {
    "used": 1,
    "quota": 10,
    "quotaResetDateTime": "2023-03-01T00:00:00Z"
  }
}
```

* An optional `features` query parameter to Analyze operations can optionally enable specific features.  Some premium features may incur added billing. Refer to [Analyze feature list](#analysis-features) for details.
* Extend extracted currency field objects to output a normalized currency code field when possible.  Currently, current fields may return amount (ex. 123.45) and currencySymbol (ex. $).  This feature maps the currency symbol to a canonical ISO 4217 code (ex. USD).  The model may optionally utilize the global document content to disambiguate or infer the currency code.

```http
{
  "fields": {
    "Total": {
      "type": "currency",
      "content": "$123.45",
      "valueCurrency": {
        "amount": 123.45,
        "currencySymbol": "$",
        "currencyCode": "USD"
      },
      ...
    }
  }
}
```

Besides model quality improvement, you're highly recommended to update your application to use v3.1 to benefit from these new capabilities.

## Migrating from v2.1 or v2.0

Document Intelligence v3.1 is the latest GA version with the richest features, most languages and document types coverage, and improved model quality. Refer to [model overview](overview.md) for the features and capabilities available in v3.1.

Starting from v3.0, [Document Intelligence REST API](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true) has been redesigned for better usability. In this section, learn the differences between Document Intelligence v2.0, v2.1 and v3.1 and how to move to the newer version of the API.

> [!CAUTION]
>
> * REST API **2023-07-31** release includes a breaking change in the REST API analyze response JSON.
> * The `boundingBox` property is renamed to `polygon` in each instance.

## Changes to the REST API endpoints

 The v3.1 REST API combines the analysis operations for layout analysis, prebuilt models, and custom models into a single pair of operations by assigning **`documentModels`**  and  **`modelId`** to the layout analysis (prebuilt-layout) and prebuilt models.

### POST request

```http
https://{your-form-recognizer-endpoint}/formrecognizer/documentModels/{modelId}?api-version=2023-07-31

```

### GET request

```http
https://{your-form-recognizer-endpoint}/formrecognizer/documentModels/{modelId}/AnalyzeResult/{resultId}?api-version=2023-07-31
```

### Analyze operation

* The request payload and call pattern remain unchanged.
* The Analyze operation specifies the input document and content-specific configurations, it returns the analyze result URL via the Operation-Location header in the response.
* Poll this Analyze Result URL, via a GET request to check the status of the analyze operation (minimum recommended interval between requests is 1 second).
* Upon success, status is set to succeeded and [analyzeResult](#changes-to-analyze-result) is returned in the response body. If errors are encountered, status sets to `failed`, and an error is returned.

| Model | v2.0 | v2.1 | v3.1 |
|:--| :--|:--| :--|
| **Request URL prefix**| **https://{your-form-recognizer-endpoint}/formrecognizer/v2.0**  |**https://{your-form-recognizer-endpoint}/formrecognizer/v2.1**  | **https://{your-form-recognizer-endpoint}/formrecognizer** |
| **General document**| N/A |N/A|`/documentModels/prebuilt-document:analyze` |
| **Layout**| /layout/analyze | /layout/analyze |`/documentModels/prebuilt-layout:analyze`|
|**Custom**| /custom/models/{modelId}/analyze |/custom/{modelId}/analyze    |`/documentModels/{modelId}:analyze` |
| **Invoice** | N/A |/prebuilt/invoice/analyze    | `/documentModels/prebuilt-invoice:analyze` |
| **Receipt** | /prebuilt/receipt/analyze|/prebuilt/receipt/analyze    | `/documentModels/prebuilt-receipt:analyze` |
| **ID document** |N/A | /prebuilt/idDocument/analyze |  `/documentModels/prebuilt-idDocument:analyze` |
|**Business card**|N/A | /prebuilt/businessCard/analyze| `/documentModels/prebuilt-businessCard:analyze`|
|**W-2**| N/A |N/A| `/documentModels/prebuilt-tax.us.w2:analyze`|
|**Health insurance card**| N/A |N/A| `/documentModels/prebuilt-healthInsuranceCard.us:analyze`|
|**Contract**| N/A | N/A| `/documentModels/prebuilt-contract:analyze`|

### Analyze request body

The content to be analyzed is provided via the request body. Either the URL or base64 encoded data can be user to construct the request.

  To specify a publicly accessible web URL, set  Content-Type to **application/json** and send the following JSON body:

  ```json
  {
    "urlSource": "{urlPath}"
  }
  ```

Base 64 encoding is also supported in Document Intelligence v3.0:

```json
{
  "base64Source": "{base64EncodedContent}"
}
```

### Additionally supported parameters

Parameters that continue to be supported:

* `pages` : Analyze only a specific subset of pages in the document. List of page numbers indexed from the number `1` to analyze. Ex. "1-3,5,7-9"
* `locale` : Locale hint for text recognition and document analysis. Value may contain only the language code (ex. `en`, `fr`) or BCP 47 language tag (ex. "en-US").

Parameters no longer supported:

* includeTextDetails

The new response format is more compact and the full output is always returned.

## Changes to analyze result

Analyze response has been refactored to the following top-level results to support multi-page elements.

* `pages`
* `tables`
* `keyValuePairs`
* `entities`
* `styles`
* `documents`

> [!NOTE]
>
> The analyzeResult response changes includes a number of changes like moving up from a property of pages to a top lever property within analyzeResult.

```json

{
// Basic analyze result metadata
"apiVersion": "2022-08-31", // REST API version used
"modelId": "prebuilt-invoice", // ModelId used
"stringIndexType": "textElements", // Character unit used for string offsets and lengths:
// textElements, unicodeCodePoint, utf16CodeUnit // Concatenated content in global reading order across pages.
// Words are generally delimited by space, except CJK (Chinese, Japanese, Korean) characters.
// Lines and selection marks are generally delimited by newline character.
// Selection marks are represented in Markdown emoji syntax (:selected:, :unselected:).
"content": "CONTOSO LTD.\nINVOICE\nContoso Headquarters...", "pages": [ // List of pages analyzed
{
// Basic page metadata
"pageNumber": 1, // 1-indexed page number
"angle": 0, // Orientation of content in clockwise direction (degree)
"width": 0, // Page width
"height": 0, // Page height
"unit": "pixel", // Unit for width, height, and polygon coordinates
"spans": [ // Parts of top-level content covered by page
{
"offset": 0, // Offset in content
"length": 7 // Length in content
}
], // List of words in page
"words": [
{
"text": "CONTOSO", // Equivalent to $.content.Substring(span.offset, span.length)
"boundingBox": [ ... ], // Position in page
"confidence": 0.99, // Extraction confidence
"span": { ... } // Part of top-level content covered by word
}, ...
], // List of selectionMarks in page
"selectionMarks": [
{
"state": "selected", // Selection state: selected, unselected
"boundingBox": [ ... ], // Position in page
"confidence": 0.95, // Extraction confidence
"span": { ... } // Part of top-level content covered by selection mark
}, ...
], // List of lines in page
"lines": [
{
"content": "CONTOSO LTD.", // Concatenated content of line (may contain both words and selectionMarks)
"boundingBox": [ ... ], // Position in page
"spans": [ ... ], // Parts of top-level content covered by line
}, ...
]
}, ...
], // List of extracted tables
"tables": [
{
"rowCount": 1, // Number of rows in table
"columnCount": 1, // Number of columns in table
"boundingRegions": [ // Polygons or Bounding boxes potentially across pages covered by table
{
"pageNumber": 1, // 1-indexed page number
"polygon": [ ... ], // Previously Bounding box, renamed to polygon in the 2022-08-31 API
}
],
"spans": [ ... ], // Parts of top-level content covered by table // List of cells in table
"cells": [
{
"kind": "stub", // Cell kind: content (default), rowHeader, columnHeader, stub, description
"rowIndex": 0, // 0-indexed row position of cell
"columnIndex": 0, // 0-indexed column position of cell
"rowSpan": 1, // Number of rows spanned by cell (default=1)
"columnSpan": 1, // Number of columns spanned by cell (default=1)
"content": "SALESPERSON", // Concatenated content of cell
"boundingRegions": [ ... ], // Bounding regions covered by cell
"spans": [ ... ] // Parts of top-level content covered by cell
}, ...
]
}, ...
], // List of extracted key-value pairs
"keyValuePairs": [
{
"key": { // Extracted key
"content": "INVOICE:", // Key content
"boundingRegions": [ ... ], // Key bounding regions
"spans": [ ... ] // Key spans
},
"value": { // Extracted value corresponding to key, if any
"content": "INV-100", // Value content
"boundingRegions": [ ... ], // Value bounding regions
"spans": [ ... ] // Value spans
},
"confidence": 0.95 // Extraction confidence
}, ...
],
"styles": [
{
"isHandwritten": true, // Is content in this style handwritten?
"spans": [ ... ], // Spans covered by this style
"confidence": 0.95 // Detection confidence
}, ...
], // List of extracted documents
"documents": [
{
"docType": "prebuilt-invoice", // Classified document type (model dependent)
"boundingRegions": [ ... ], // Document bounding regions
"spans": [ ... ], // Document spans
"confidence": 0.99, // Document splitting/classification confidence // List of extracted fields
"fields": {
"VendorName": { // Field name (docType dependent)
"type": "string", // Field value type: string, number, array, object, ...
"valueString": "CONTOSO LTD.",// Normalized field value
"content": "CONTOSO LTD.", // Raw extracted field content
"boundingRegions": [ ... ], // Field bounding regions
"spans": [ ... ], // Field spans
"confidence": 0.99 // Extraction confidence
}, ...
}
}, ...
]
}

```

## Build or train model

The model object has three updates in the new API

* ```modelId``` is now a property that can be set on a model for a human readable name.
* ```modelName``` has been renamed to ```description```
* ```buildMode``` is a new property with values of  ```template``` for custom form models or ```neural``` for custom neural models.

The ```build``` operation is invoked to train a model. The request payload and call pattern remain unchanged. The build operation specifies the model and training dataset, it returns the result via the Operation-Location header in the response. Poll this model operation URL, via a GET request to check the status of the build operation (minimum recommended interval between requests is 1 second). Unlike v2.1, this URL isn't the resource location of the model. Instead, the model URL can be constructed from the given modelId, also retrieved from the resourceLocation property in the response. Upon success, status is set to ```succeeded``` and result contains the custom model info. If errors are encountered, status is set to ```failed```, and the error is returned.

The following code is a sample build request using a SAS token. Note the trailing slash when setting the prefix or folder path.

```json
POST https://{your-form-recognizer-endpoint}/formrecognizer/documentModels:build?api-version=2022-08-31

{
  "modelId": {modelId},
  "description": "Sample model",
  "buildMode": "template",
  "azureBlobSource": {
    "containerUrl": "https://{storageAccount}.blob.core.windows.net/{containerName}?{sasToken}",
    "prefix": "{folderName/}"
  }
}
```

## Changes to compose model

Model compose is now limited to single level of nesting. Composed models are now consistent with custom models with the addition of ```modelId``` and ```description``` properties.

```json
POST https://{your-form-recognizer-endpoint}/formrecognizer/documentModels:compose?api-version=2022-08-31
{
  "modelId": "{composedModelId}",
  "description": "{composedModelDescription}",
  "componentModels": [
    { "modelId": "{modelId1}" },
    { "modelId": "{modelId2}" },
  ]
}

```

## Changes to copy model

The call pattern for copy model remains unchanged:

* Authorize the copy operation with the target resource calling ```authorizeCopy```. Now a POST request.
* Submit the authorization to the source resource to copy the model calling ```copyTo```
* Poll the returned operation to validate the operation completed successfully

The only changes to the copy model function are:

* HTTP action on the ```authorizeCopy``` is now a POST request.
* The authorization payload contains all the information needed to submit the copy request.

***Authorize the copy***

```json
POST https://{targetHost}/formrecognizer/documentModels:authorizeCopy?api-version=2022-08-31
{
  "modelId": "{targetModelId}",
  "description": "{targetModelDescription}",
}
```

Use the response body from the authorize action to construct the request for the copy.

```json
POST https://{sourceHost}/formrecognizer/documentModels/{sourceModelId}:copyTo?api-version=2022-08-31
{
  "targetResourceId": "{targetResourceId}",
  "targetResourceRegion": "{targetResourceRegion}",
  "targetModelId": "{targetModelId}",
  "targetModelLocation": "https://{targetHost}/formrecognizer/documentModels/{targetModelId}",
  "accessToken": "{accessToken}",
  "expirationDateTime": "2021-08-02T03:56:11Z"
}
```

## Changes to list models

List models have been extended to now return prebuilt and custom models. All prebuilt model names start with ```prebuilt-```. Only models with a status of succeeded are returned. To list models that either failed or are in progress, see [List Operations](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/GetModels).

***Sample list models request***

```json
GET https://{your-form-recognizer-endpoint}/formrecognizer/documentModels?api-version=2022-08-31
```

## Change to get model

As get model now includes prebuilt models, the get operation returns a ```docTypes``` dictionary. Each document type description includes name, optional description, field schema, and optional field confidence. The field schema describes the list of fields potentially returned with the document type.

```json
GET https://{your-form-recognizer-endpoint}/formrecognizer/documentModels/{modelId}?api-version=2022-08-31
```

## New get info operation

The ```info``` operation on the service returns the custom model count and custom model limit.

```json
GET https://{your-form-recognizer-endpoint}/formrecognizer/info? api-version=2022-08-31
```

***Sample response***

```json
{
  "customDocumentModels": {
    "count": 5,
    "limit": 100
  }
}
```

## Next steps

* [Review the new REST API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument)
* [What is Document Intelligence?](overview.md)
* [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md)
