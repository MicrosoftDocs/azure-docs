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

# Document Field extraction - generative model

> [!IMPORTANT]
>
> * Document Intelligence public preview releases provide early access to features that are in active development. Features, approaches, and processes may change, prior to General Availability (GA), based on user feedback.
> * The public preview version of Document Intelligence client libraries default to REST API version [**2024-07-31-preview**](/rest/api/aiservices/operation-groups?view=rest-aiservices-2024-07-31-preview&preserve-view=true) and is currently only available in the following Azure regions. 
>   * **East US**
>   * **West US2**
>   * **West Europe**
>   * **North Central US**
> * Note that the new document field extraction model in AI Studio is only available in North Central US region:


Field Extraction - generative is the latest Document Intelligence offering which utilizes generative AI to extract user specified fields from documents across a wide variety of visual templates. Custom Generative model combines the power of document understanding with Large Language Models (LLMs) and the rigor and schema from custom extraction capabilities to create a model with high accuracy in minutes. With this new model type, users can start with a single document and go through the schema addition and model creation process with minimal labeling.  Leverage AI studio for an interactive experience to train and test the custom model. Custom Generative will allow developers and businesses to easily automate their data extraction workflows for any type of document, with even greater accuracy and speed.  

Field Extraction generative AI models perform well on extracting simple fields from documents with no labeled samples. Providing a few labeled samples improves the extraction accuracy for complex fields and user defined fields like tables. Using a custom generative model for inference (analysis) is identical to using any other Document Intelligence model, use the API or SDK submit a document for analysis with a model build using the custom generative process.


##  Benefits

* **Automatic labeling**. Utilize large language models (LLM) and extract user-specified fields for various document types and visual templates.
  
* **Improved Generalization**. Extract data from unstructured data and varying document templates with higher accuracy.
  
* **Grounded results**. Localize the data extracted in the documents. Custom generative models will ground the results where applicable, ensuring the response is generated from the content and enable human review workflows.
  
* **Confidence scores**. Use confidence scores for each extracted field to, filter high quality extracted data, maximize straight through processing of documents and minimize human review costs.



### Common use cases

* **Contract Lifecycle Management**. Build a generative model and extract the fields, clauses, and obligations from a wide array of contract types.
  
* **Loan & Mortgage Applications**. Automation of loan and mortgage application process enables banks, lenders, and government entities to quickly process loan and mortgage application.
  
* **Financial Services**. With custom geenrative, analyze complex documents like financial reports and asset management reports.
  
* **Expense management**. Receipts and invoices from various retailers and businesses will need to be parsed to validate the expenses. Custom generative can extract expenses across different formats and documents with varying templates.


### Managing the training dataset
With other custom models, you needed to maintain the dataset and add new samples to the dataset and train the model for any model improvements. With custom generative, the labeled documents are transformed, encrypted and stored as part of the model to ensure the model can continually use the labeled samples to improve the extraction quality. As with other custom models, models are stored in Microsoft storage, and can be deleted by you.

While the dataset is managed by the service, the documents are stored encrypted and only used to improve the model results for your specific model. The data is encrypted by a service managed key and can be optionally encrypted with a customer managed key as well. The change in management and lifecycle of the dataset only applies to custom generative models.


## Model capabilities  

Field extraction custom generative model currently supports dynamic table with the `2024-07-31-preview` and the following fields:

| Form fields | Selection marks | Tabular fields | Signature | Region labeling | Overlapping fields |
|:--:|:--:|:--:|:--:|:--:|:--:|
|Supported| Supported |Supported| Unsupported |Unsupported |Supported|

## Build mode  

The `build custom model` operation supports custom _template_, _neural_ and _generative_ models, _see_ [Custom model build mode](concept-custom.md#build-mode):

* **Custom generative models** can process complex documents in various formats, templates, and unstructured data.
  
* **Custom neural models** support complex document processing and also support more variance in page for structured and semi-structured documents.
  
* **Custom template models** rely on consistent visual templates, such as questionnaires or applications, to extract the labeled data.
  

## Languages and locale support

Field extraction custom generative model `2024-07-31-preview` version supports the **en-us** locale. For more information on language support, *see* [Language support - custom models](language-support-custom.md).

## Region support

Field extraction custom generative model `2024-07-31-preview` version is only available in `North Central US`.  

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
