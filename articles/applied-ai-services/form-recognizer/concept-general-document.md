---
title: Form Recognizer general document model
titleSuffix: Azure Applied AI Services
description: Concepts related to data extraction and analysis using prebuilt general document v3.0 model
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 10/14/2022
ms.author: lajanuar
monikerRange: 'form-recog-3.0.0'
recommendations: false
---
<!-- markdownlint-disable MD033 -->

# Form Recognizer general document model

**This article applies to:** ![Form Recognizer v3.0 checkmark](media/yes-icon.png) **Form Recognizer v3.0**.

The General document v3.0 model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to extract key-value pairs, tables, and selection marks from documents. General document is only available with the v3.0 API.  For more information on using the v3.0 API, see our [migration guide](v3-migration-guide.md).

The general document API supports most form types and will analyze your documents and extract keys and associated values. It's ideal for extracting common key-value pairs from documents. You can use the general document model as an alternative to training a custom model without labels.

> [!NOTE]
> The ```2022-06-30``` and later versions of the general document model add support for selection marks.

## General document features

* The general document model is a pre-trained model; it doesn't require labels or training.

* A single API extracts key-value pairs, selection marks, text, tables, and structure from documents.

* The general document model supports structured, semi-structured, and unstructured documents.

* Key names are spans of text within the document that are associated with a value.

* Selection marks are identified as fields with a value of ```:selected:``` or ```:unselected:``` 

***Sample document processed in the Form Recognizer Studio***

:::image type="content" source="media/studio/general-document-analyze.png" alt-text="Screenshot: general document analysis in the Form Recognizer Studio.":::

## Development options

The following tools are supported by Form Recognizer v3.0:

| Feature | Resources | Model ID
|----------|----------|---------------|
| **General document model**|<ul ><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li></ul>|**prebuilt-document**|

### Try Form Recognizer

Try extracting data from forms and documents using the Form Recognizer Studio.

You'll need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

#### Form Recognizer Studio 

> [!NOTE]
> Form Recognizer studio and the general document model are available with the v3.0 API.

1. On the Form Recognizer Studio home page, select **General documents**

1. You can analyze the sample document or select the **+ Add** button to upload your own sample.

1. Select the **Analyze** button:

    :::image type="content" source="media/studio/general-document-analyze-1.png" alt-text="Screenshot: analyze general document menu.":::

    > [!div class="nextstepaction"]
    > [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=document)

## Key-value pairs

Key-value pairs are specific spans within the document that identify a label or key and its associated response or value. In a structured form, these pairs could be the label and the value the user entered for that field. In an unstructured  document, they could be the date a contract was executed on based on the text in a paragraph.  The AI model is trained to extract identifiable keys and values based on a wide variety of document types, formats, and structures.

Keys can also exist in isolation when the model detects that a key exists, with no associated value or when processing optional fields. For example, a middle name field may be left blank on a form in some instances. Key-value pairs are spans of text contained in the document. For documents where the same value is described in different ways, for example, customer/user, the associated key will be either customer or user (based on context).

## Data extraction

| **Model**   | **Text extraction** |**Key-Value pairs** |**Selection Marks**   | **Tables**   |
| --- | :---: |:---:| :---: | :---: |
|General document  | ✓  |  ✓ | ✓  | ✓  |

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Supported languages and locales

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|General document| <ul><li>English (United States)—en-US</li></ul>| English (United States)—en-US|

## Considerations

* Keys are spans of text extracted from the document, for semi structured documents, keys may need to be mapped to an existing dictionary of keys.

* Expect to see key-value pairs with a key, but no value. For example if a user chose to not provide an email address on the form.

## Next steps

* Follow our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md) to learn how to use the v3.0 version in your applications and workflows.

* Explore our [**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument) to learn more about the v3.0 version and new capabilities.

> [!div class="nextstepaction"]
> [Try the Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio)
