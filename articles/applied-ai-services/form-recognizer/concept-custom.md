---
title: Form Recognizer custom and composed models
titleSuffix: Azure Applied AI Services
description: Learn to create, use, and manage Form Recognizer custom and composed models.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 02/09/2022
ms.author: vikurpad
recommendations: false
---
# Form Recognizer custom models

Form Recognizer uses advanced machine learning technology to detect and extract information from forms and documents and returns the extracted data in a structured JSON output. With Form Recognizer, you can use pre-built or pre-trained models or you can train standalone custom models. Standalone custom models can be combined to create composed models.

To create a custom model, you label a dataset of documents with the values you want extracted and train the model on the labeled dataset. You only need five examples of the same form or document type to get started.

## Custom model types

Custom models can be one of two types, [**custom form**](concept-custom-form.md) or [**custom document**](concept-custom-document) models. The labeling and training process for both models is identical, but the models differ as follows:

### Custom form model

 The custom form model relies on a consistent visual template to extract the labeled data. The accuracy of your model is affected by variances in the visual structure of your documents. Questionnaires or application forms are examples of consistent visual templates.Your training set will consist of structured documents where the formatting and layout are static and constant from one document instance to the next. Custom form  models support key value pairs, selection marks, tables, signature fields and regions and can be trained on documents in any of the [supported languages](language-support.md). For more information, *see* [custom form models](concept-custom-form.md).

> [!TIP]
>
>To confirm that your training documents present a consistent visual template, remove all the user-entered data from each form in the set. If the blank forms are identical in appearance, they represent a consistent visual template.
>
> For more information, *see* [Interpret and improve accuracy and confidence for custom models](concept-accuracy-confidence.md).

### Custom document model

The custom document model is a deep learning model type relies on a base model trained on a large collection of labeled documents using key-value pairs. This model is then fine-tuned or adapted to your data when you train the model with a labeled dataset. Custom document models support structured, semi-structured, and unstructured documents to extract fields. Custom document models currently support English-language documents.

## Model features

The table below compares custom form and custom document features:

|Feature    |Custom Form | Custom Document |
|-----------|------------------|-----------------------|
|Document structure |Template, fixed form, and structured documents.| Structured, semi-structured, and unstructured documents.|
|Training time | 1 - 5 minutes | 20 - 60 minutes |
|Data extraction| Key-value pairs, tables, selection marks, signatures, and regions| Key-value pairs and selections marks.|
|Models per Document type | Requires one model per each document-type variation| Supports a single model for all document-type variations.|
|Language support| See [custom form model language support](language-support.md#layout-and-custom-form-model)| The custom document model currently supports English-language documents only.|

## Model capabilities

This table compares the supported data extraction areas:

|Model| Form fields | Selection marks | Structured fields (Tables) | Signature | Region labeling |
|--|:--:|:--:|:--:|:--:|:--:|
|Custom Form| ✔ | ✔ | ✔ |&#10033; | ✔ |
|Custom Document| ✔| ✔ |**n/a**| **n/a** | **n/a** |

**Table symbols**: ✔ — supported; &#10033; — preview; **n/a** — currently unavailable

> [!TIP]
> When choosing between the two model types, start with a custom document model if it meets your functional needs. See [custom document](concept-custom-document.md) to learn more about custom document models.

## Development options

The following table describes the features available with the associated tools and SDKs. As a best practice, ensure that you use the compatible tools listed here.

|  | REST API | SDK | Label and Test Models|
|--|--|--|--|
| Custom form 2.1 | [Form Recognizer 2.1 GA API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm) | [Form Recognizer SDK](https://docs.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/quickstarts/get-started-sdk-rest-api?pivots=programming-language-python)| [Sample labeling tool](https://fott-2-1.azurewebsites.net/)|
| Custom form 3.0 | [Form Recognizer 3.0 (preview)](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument)| [Form Recognizer Preview SDK](https://docs.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/quickstarts/try-v3-python-sdk)| [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio)|
| Custom document | [Form Recognizer 3.0 (preview)](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument)| [Form Recognizer Preview SDK](https://docs.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/quickstarts/try-v3-python-sdk)| [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio)

> [!NOTE]
> Custom form models trained with the 3.0 API will have a few improvements over the 2.1 API stemming from improvements to the OCR engine. Datasets used to train a custom form model using the 2.1 API can still be used to train a new model using the 3.0 API.

## Next steps

Explore Form Recognizer quickstarts and REST APIs:

| Quickstart | REST API|
|--|--|
|[v3.0 Studio quickstart](quickstarts/try-v3-form-recognizer-studio.md) |[Form Recognizer v3.0 API 2022-01-30-preview](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/AnalyzeDocument)|
| [v2.1 quickstart](quickstarts/get-started-sdk-rest-api.md) | [Form Recognizer API v2.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/BuildDocumentModel) |