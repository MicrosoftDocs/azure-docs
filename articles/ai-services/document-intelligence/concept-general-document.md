---
title: General key-value extraction - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Extract key-value pairs, tables, selection marks, and text from your documents with Document Intelligence
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/21/2023
ms.author: lajanuar
---

<!-- markdownlint-disable MD033 -->

# Document Intelligence general document model

:::moniker range="doc-intel-4.0.0"

> [!IMPORTANT]
> Starting with D:ocument Intelligence **2023-10-31-preview** and going forward, the general document model (prebuilt-document) is deprecated. To extract key-value pairs, selection marks, text, tables, and structure from documents, use the following models:

| Feature   | version| Model ID |
|----------  |---------|--------|
|`Layout` model with the optional query string parameter **`features=keyValuePairs`** enabled.|&bullet; v4:2023-10-31-preview</br>&bullet; v3.1:2023-07-31 (GA) |**`prebuilt-layout`**|
|General document model|&bullet; v3.1:2023-07-31 (GA)</br>&bullet; v3.0:2022-08-31 (GA)</br>&bullet; v2.1 (GA)|**`prebuilt-document`**|
:::moniker-end

::: moniker range="doc-intel-3.1.0"
**This content applies to:** ![checkmark](media/yes-icon.png) **v3.1 (GA)**  | **Latest version:** ![purple-checkmark](media/purple-yes-icon.png) [**v4.0 (preview)**](?view=doc-intel-4.0.0&preserve-view=true) | **Previous version:** ![blue-checkmark](media/blue-yes-icon.png) [**v3.0**](?view=doc-intel-3.0.0&preserve-view=true)
::: moniker-end

::: moniker range="doc-intel-3.0.0"
**This content applies to:** ![checkmark](media/yes-icon.png) **v3.0 (GA)** | **Latest versions:** ![purple-checkmark](media/purple-yes-icon.png) [**v4.0 (preview)**](?view=doc-intel-4.0.0&preserve-view=true) ![purple-checkmark](media/purple-yes-icon.png) [**v3.1 (preview)**](?view=doc-intel-3.1.0&preserve-view=true)
::: moniker-end

The General document model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to extract key-value pairs, tables, and selection marks from documents. General document is available with the v3.1 and v3.0 APIs.  For more information, _see_ our [migration guide](v3-1-migration-guide.md).

::: moniker range="doc-intel-3.1.0 || doc-intel-3.0.0"

## General document features

* The general document model is a pretrained model; it doesn't require labels or training.

* A single API extracts key-value pairs, selection marks, text, tables, and structure from documents.

* The general document model supports structured, semi-structured, and unstructured documents.

* Selection marks are identified as fields with a value of ```:selected:``` or ```:unselected:```

***Sample document processed in the Document Intelligence Studio***

:::image type="content" source="media/studio/general-document-analyze.png" alt-text="Screenshot of general document analysis in the Document Intelligence Studio.":::

## Key-value pair extraction

The general document API supports most form types and analyzes your documents and extract keys and associated values. It's ideal for extracting common key-value pairs from documents. You can use the general document model as an alternative to training a custom model without labels.

:::moniker-end

::: moniker range="doc-intel-3.1.0"

## Development options

Document Intelligence v3.1 supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**General document model**|&bullet; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</br>&bullet;  [**REST API**](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)|**prebuilt-document**|
::: moniker-end

::: moniker range="doc-intel-3.0.0"

Document Intelligence v3.0 supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**General document model**|&bullet; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</br>&bullet;  [**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)|**prebuilt-document**|
::: moniker-end

::: moniker range="doc-intel-3.1.0 || doc-intel-3.0.0"

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

### General document model data extraction

Try extracting data from forms and documents using the Document Intelligence Studio.

You need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Document Intelligence instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

> [!NOTE]
> Document Intelligence Studio and the general document model are available with the v3.0 API.

1. On the Document Intelligence Studio home page, select **General documents**

1. You can analyze the sample document or upload your own files.

1. Select the **Run analysis** button and, if necessary, configure the **Analyze options** :

    :::image type="content" source="media/studio/run-analysis-analyze-options.png" alt-text="Screenshot of Run analysis and Analyze options buttons in the Document Intelligence Studio.":::

    > [!div class="nextstepaction"]
    > [Try Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=document)

## Key-value pairs

Key-value pairs are specific spans within the document that identify a label or key and its associated response or value. In a structured form, these pairs could be the label and the value the user entered for that field. In an unstructured  document, they could be the date a contract was executed on based on the text in a paragraph.  The AI model is trained to extract identifiable keys and values based on a wide variety of document types, formats, and structures.

Keys can also exist in isolation when the model detects that a key exists, with no associated value or when processing optional fields. For example, a middle name field can be left blank on a form in some instances. Key-value pairs are spans of text contained in the document. For documents where the same value is described in different ways, for example, customer/user, the associated key is either customer or user (based on context).

## Data extraction

| **Model**   | **Text extraction** |**Key-Value pairs** |**Selection Marks**   | **Tables**   | **Common Names** |
| --- | :---: |:---:| :---: | :---: | :---: |
|General document  | ✓  |  ✓ | ✓  | ✓  | ✓* |

✓* - Only available in the ``2023-07-31`` (v3.1 GA) and later API versions.

## Supported languages and locales

*See* our [Language Support—document analysis models](language-support-ocr.md) page for a complete list of supported languages.

## Considerations

* Keys are spans of text extracted from the document, for semi structured documents, keys can need to be mapped to an existing dictionary of keys.

* Expect to see key-value pairs with a key, but no value. For example if a user chose to not provide an email address on the form.

::: moniker-end

## Next steps

* Follow our [**Document Intelligence v3.1 migration guide**](v3-1-migration-guide.md) to learn how to use the v3.1 version in your applications and workflows.

* Explore our [**REST API**](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP).
  
> [!div class="nextstepaction"]
> [Try the Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)
