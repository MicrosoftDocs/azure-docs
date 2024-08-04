---
title: Azure AI Document Intelligence (formerly Form Recognizer) custom generative field extraction
titleSuffix: Azure AI services
description: Custom generative AI model extracts user-specified fields from documents across a wide variety of visual templates.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: overview
ms.date: 08/07/2024
ms.author: lajanuar
monikerRange: '>=doc-intel-4.0.0'
---

# Document Intelligence custom generative model

[!INCLUDE [preview-version-notice](includes/preview-notice.md)]

The custom generative model combines the power of document understanding with Large Language Models (LLMs) and the rigor and schema from custom extraction capabilities. Custom generative extraction enables you to easily automate data extraction workflows for any type of document, with minimal labeling and greater accuracy and speed.

## Custom generative model key features

* **Automatic labeling**. Utilize large language models (LLM) and extract user-specified fields for various document types and visual templates.
* **Improved Generalization**. Extract data from unstructured data and varying document templates with higher accuracy.
* **Grounded results**. Localize the data extracted in documents and ensure the response is generated from the content and enables human review workflows.
* **High confidence scores**. Use confidence scores and quickly filter high quality extracted data for downstream processing and lower manual review time.

### Common use cases

* **Contract Lifecycle Management**. Build a generative model and extract the fields, clauses, and obligations from a wide array of contract types.  
* **Loan & Mortgage Applications**. Automation of loan and mortgage application process enables banks, lenders, and government entities to quickly process loan and mortgage application.  
* **Financial Services**. Analyze complex documents like financial reports and asset management reports.
* **Expense management**. The custom generative model can extract expenses, receipts, and invoices with varying formats and templates.  

## Model capabilities  

The Custom generative model currently supports dynamic table with the `2024-07-31-preview` and the following fields:

| Form fields | Selection marks | Tabular fields | Signature | Region labeling | Overlapping fields |
|:--:|:--:|:--:|:--:|:--:|:--:|
|Supported| Supported |Supported| Unsupported |Unsupported |Supported|

## Build mode  

The `build custom model` operation supports custom _template_, _neural_ and _generative_ models, _see_ [Custom model build mode](concept-custom.md#build-mode):

* **Custom generative models** can process complex documents in various formats, templates, and unstructured data.
* **Custom neural models** support complex document processing and also support more variance in page for structured and semi-structured documents.
* **Custom template models** rely on consistent visual templates, such as questionnaires or applications, to extract the labeled data.

## Languages and locale support

The custom generative model `2024-07-31-preview` version supports the **en-us** locale. For more information on language support, *see* [Language support - custom models](language-support-custom.md).

## Region support

The custom generative model `2024-07-31-preview` version is only available in `North Central US`.  

## Input requirements 

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Best practices  

* **Representative data**. Use representative documents that target actual data distribution, and train a high-quality custom generative model. For example, if the target document includes partially filled tabular fields, add training documents that consist of partially filled tables. Or if field is named date, values for this field should be a date as random strings can affect model performance.
* **Field naming**. Choose a precise field name that represents the field values. For example, for a field value containing the Transaction Date, consider naming the field _TransactionDate_ instead of `Date1`.
* **Field Description**. Provide more contextual information in description to help clarify the field that needs to be extracted. Examples include location in the document, potential field labels it may be associated with, ways to differentiate with other terms that could be ambiguous.  
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

The `build operation` to train model supports the ```buildMode``` property, to train a custom generative model, set the ```buildMode``` to ```generative```.

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
