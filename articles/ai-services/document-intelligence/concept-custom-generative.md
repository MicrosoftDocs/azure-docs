---
title: Azure AI Document Intelligence (formerly Form Recognizer) custom generative document field extraction
titleSuffix: Azure AI services
description: Custom generative AI model extracts user-specified fields from documents across a wide variety of visual templates.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: overview
ms.date: 08/09/2024
ms.author: lajanuar
monikerRange: '>=doc-intel-4.0.0'
---

# Document Field extraction - custom generative AI model

> [!IMPORTANT]
>
> * Document Intelligence public preview releases provide early access to features that are in active development. Features, approaches, and processes may change, prior to General Availability (GA), based on user feedback.
> * The public preview version of Document Intelligence client libraries default to REST API version [**2024-07-31-preview**](/rest/api/aiservices/operation-groups?view=rest-aiservices-2024-07-31-preview&preserve-view=true) and is currently only available in the following Azure regions.
>   * **East US**
>   * **West US2**
>   * **West Europe**
>   * **North Central US**
>
> * **The new custom generative model in AI Studio is only available in the North Central US region**:

The document field extraction (custom generative AI) model utilizes generative AI to extract user-specified fields from documents across a wide variety of visual templates. The custom generative AI model combines the power of document understanding with Large Language Models (LLMs) and the rigor and schema from custom extraction capabilities to create a model with high accuracy in minutes. With this generative model type, you can start with a single document and go through the schema addition and model creation process with minimal labeling. The custom generative model allows developers and enterprises to easily automate data extraction workflows with greater accuracy and speed for any type of document. The custom generative AI model excels in extracting simple fields from documents without labeled samples. However, providing a few labeled samples improves the extraction accuracy for complex fields and user-defined fields like tables. You can use the [REST API](/rest/api/aiservices/operation-groups?view=rest-aiservices-2024-07-31-preview&preserve-view=true) or client libraries to submit a document for analysis with a model build and use the custom generative process.

## Custom generative AI model benefits

* **Automatic labeling**. Utilize large language models (LLM) and extract user-specified fields for various document types and visual templates.

* **Improved Generalization**. Extract data from unstructured data and varying document templates with higher accuracy.

* **Grounded results**. Localize the data extracted in the documents. Custom generative models ground the results where applicable, ensuring the response is generated from the content and enable human review workflows.

* **Confidence scores**. Use confidence scores for each extracted field to, filter high quality extracted data, maximize straight through processing of documents and minimize human review costs.

### Common use cases

* **Contract Lifecycle Management**. Build a generative model and extract the fields, clauses, and obligations from a wide array of contract types.

* **Loan & Mortgage Applications**. Automation of loan and mortgage application process enables banks, lenders, and government entities to quickly process loan and mortgage application.

* **Financial Services**. With the custom generative AI model, analyze complex documents like financial reports and asset management reports.

* **Expense management**. Receipts and invoices from various retailers and businesses need to be parsed to validate the expenses. The custom generative AI model can extract expenses across different formats and documents with varying templates.

### Managing the training dataset

With our other custom models, you need to maintain the dataset, add new samples, and train the model for accuracy improvements. With the custom generative AI model, the labeled documents are transformed, encrypted, and stored as part of the model. This process ensures that the model can continually use the labeled samples to improve the extraction quality. As with other custom models, models are stored in Microsoft storage, and you can delete them anytime.

The Document Intelligence service does manage your datasets, but your documents are stored encrypted and only used to improve the model results for your specific model. A service-manged key can be used to encrypt your data or it can be optionally encrypted with a customer managed key. The change in management and lifecycle of the dataset only applies to custom generative models.

## Model capabilities  

Field extraction custom generative model currently supports dynamic table with the `2024-07-31-preview` and the following fields:

| Form fields | Selection marks | Tabular fields | Signature | Region labeling | Overlapping fields |
|:--:|:--:|:--:|:--:|:--:|:--:|
|Supported| Supported |Supported| Unsupported |Unsupported |Supported|

## Build mode  

The `build custom model` operation supports custom **template**, **neural**, and **generative** models, _see_ [Custom model build mode](concept-custom.md#build-mode). Here are the differences in the model types:

* **Custom generative AI models** can process complex documents with various formats, varied templates, and unstructured data.

* **Custom neural models** support complex document processing and also support more variance in pages for structured and semi-structured documents.

* **Custom template models** rely on consistent visual templates, such as questionnaires or applications, to extract the labeled data.

## Languages and locale support

Field extraction custom generative model `2024-07-31-preview` version supports the **en-us** locale. For more information on language support, _see_ [Language support - custom models](language-support-custom.md).

## Region support

Field extraction custom generative model `2024-07-31-preview` version is only available in `North Central US`.  

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Best practices  

* **Representative data**. Use representative documents that target actual data distribution, and train a high-quality custom generative model. For example, if the target document includes partially filled tabular fields, add training documents that consist of partially filled tables. Or if field is named date, values for this field should be a date as random strings can affect model performance.

* **Field naming**. Choose a precise field name that represents the field values. For example, for a field value containing the Transaction Date, consider naming the field _TransactionDate_ instead of `Date1`.

* **Field Description**. Provide more contextual information in description to help clarify the field that needs to be extracted. Examples include location in the document, potential field labels it can be associated with, and ways to differentiate with other terms that could be ambiguous.

* **Variation**. Custom generative models can generalize across different document templates of the same document type. As a best practice, create a single model for all variations of a document type. Ideally, include a visual template for each type, especially for ones that

## Service guidance

* The Custom Generative preview model doesn't currently support fixed table and signature extraction.

* Inference on the same document could yield slightly different results across calls and is a known limitation of current `GPT` models.

* Confidence scores for each field might vary. We recommend testing with your representative data to establish the confidence thresholds for your scenario.

* Grounding, especially for tabular fields, is challenging and might not be perfect in some cases.

* Latency for large documents is high and a known limitation in preview.

* Composed models don't support custom generative extraction.

## Training a model  

Custom generative models are available with the `2024-07-31-preview` version and later models.

The `build operation` to train model supports the `buildMode` property, to train a custom generative model, set the `buildMode` to `generative`.

```bash

https://{endpoint}/documentintelligence/documentModels:build?api-version=2024-07-31-preview

{
  "modelId": "string",
  "description": "string",
  "buildMode": "generative",
  "azureBlobSource":
  {
    "containerUrl": "string",
    "prefix": "string"
  }
}

```

## Next steps

* Learn how to [create custom generative models](how-to-guides/build-train-custom-generative-model.md)
* Learn more about [custom models](concept-custom.md)
