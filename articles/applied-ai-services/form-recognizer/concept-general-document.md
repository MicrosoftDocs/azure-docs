---
title: General key-value extraction - Form Recognizer
titleSuffix: Azure Applied AI Services
description: Extract key-value pairs, tables, selection marks, and text from your documents with Form Recognizer
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 03/15/2023
ms.author: lajanuar
monikerRange: 'form-recog-3.0.0'
recommendations: false
---
<!-- markdownlint-disable MD033 -->

# Form Recognizer general document model

**This article applies to:** ![Form Recognizer v3.0 checkmark](media/yes-icon.png) **Form Recognizer v3.0**.

The General document v3.0 model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to extract key-value pairs, tables, and selection marks from documents. General document is only available with the v3.0 API.  For more information on using the v3.0 API, see our [migration guide](v3-migration-guide.md).

> [!NOTE]
> The ```2023-02-28-preview``` version of the general document model adds support for **normalized keys**.

## General document features

* The general document model is a pre-trained model; it doesn't require labels or training.

* A single API extracts key-value pairs, selection marks, text, tables, and structure from documents.

* The general document model supports structured, semi-structured, and unstructured documents.

* Key names are spans of text within the document that are associated with a value. With the ```2023-02-28-preview``` API version, key names are normalized where applicable.

* Selection marks are identified as fields with a value of ```:selected:``` or ```:unselected:```

***Sample document processed in the Form Recognizer Studio***

:::image type="content" source="media/studio/general-document-analyze.png" alt-text="Screenshot of general document analysis in the Form Recognizer Studio.":::

## Key-value pair extraction

The general document API supports most form types and analyzes your documents and extract keys and associated values. It's ideal for extracting common key-value pairs from documents. You can use the general document model as an alternative to training a custom model without labels.

### Key normalization (common name)

When the service analyzes documents with variations in key names like ```Social Security Number```, ```Social Security Nbr```, ```SSN```, the output normalizes the key variations to a single common name, ```SocialSecurityNumber```. This normalization simplifies downstream processing for documents where you no longer need to account for variations in the key name.

:::image type="content" source="media/common-name.png" alt-text="Screenshot of general document processing in the Form Recognizer Studio.":::

## Development options

Form Recognizer v3.0 supports the following tools:

| Feature | Resources | Model ID
|----------|----------|---------------|
| **General document model**|<ul ><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li></ul>|**prebuilt-document**|

### Try Form Recognizer

Try extracting data from forms and documents using the Form Recognizer Studio.

You need the following resources:

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

Keys can also exist in isolation when the model detects that a key exists, with no associated value or when processing optional fields. For example, a middle name field may be left blank on a form in some instances. Key-value pairs are spans of text contained in the document. For documents where the same value is described in different ways, for example, customer/user, the associated key is either customer or user (based on context).

## Data extraction

| **Model**   | **Text extraction** |**Key-Value pairs** |**Selection Marks**   | **Tables**   | **Common Names** |
| --- | :---: |:---:| :---: | :---: | :---: |
|General document  | ✓  |  ✓ | ✓  | ✓  | ✓* |

✓* - Only available in the 2023-02-28-preview API version.

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Supported languages and locales

>[!NOTE]
 > It's not necessary to specify a locale. This is an optional parameter. The Form Recognizer deep-learning technology will auto-detect the language of the text in your image.

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
