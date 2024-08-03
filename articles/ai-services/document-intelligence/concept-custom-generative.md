---
title: Azure AI Document Intelligence (formerly Form Recognizer) custom generative field extraction
titleSuffix: Azure AI services
description: Utilize custom generative AI model to extract user-specified fields from documents across a wide variety of visual templates.
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

The custom generative model combines the power of document understanding with Large Language Models (LLMs) and the rigor and schema from custom extraction capabilities to enable you to easily automate their data extraction workflows for any type of document, with minimal labeling and with greater accuracy and speed.

## Custom generative model key features

* **Automatic labeling**. Utilize large language models (`LLM`s) to extract user-specified fields for various document types and visual templates.
* **Improved Generalization**. Extract data from unstructured data and varying document templates with higher accuracy.
* **Grounded results**. Localize the data extracted in documents to ensure the response is generated from the content and enables human review workflows.
* **High confidence scores** - Use confidence scores to quickly filter high quality extracted data for downstream processing and lower manual review time.

### Common use cases

* **Contract Lifecycle Management**. Build a generative model to extract the fields, clauses, and obligations from a wide array of contract types.  
* **Loan & Mortgage Applications** – Automation of loan and mortgage application process enables banks, lenders, and government entities to quickly process loan and mortgage application.  
* **Financial Services –** Analyze complex documents like financial reports and asset management reports.
* **Expense management** - Custom generative can extract expenses, receipts, and invoices with varying different formats and templates.  

## Build mode  

The build custom model operation supports _template_, _neural_ and _generative_ custom models. Previous versions of the REST API and client libraries only supported two build modes - template and neural. For more information, _see_ [Custom model build mode](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/concept-custom?view=doc-intel-4.0.0#build-mode). 

*   **Template:** custom template or custom form model relies on a consistent visual template to extract the labeled data. Structured forms such as questionnaires or applications are examples of consistent visual templates. 
*   **Neural:** custom neural models uses deep learning models to accurately extract labeled fields from documents, suitable to be trained for extracting fields from structured, semi-structured documents. 
*   **Generative:** custom generative can process complex documents with variety of formats, templates and unstructured data. 

Model Capabilities  

Custom generative currently supports the following,   

Form fields        Selection marks   Tabular fields    Signature           Region labelling    Overlapping Fields 

Supported Supported       Supported\*       Unsupported   Unsupported          Supported 

\*- Dynamic table is supported in preview, fixed table support will be made available soon 

Supported languages 

Only US English "en-us" is supported during preview. You can see our [Language support - custom models](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/language-support-custom?view=doc-intel-4.0.0) page for a complete list of supported languages.   

Supported regions 

During preview, Custom Generative model building, and analysis will only be available in North Central US.  

Input requirements 

*   For best results, provide at least one clear photo or high-quality scan per document. 
*   Supported file formats: 

**Model** 

**PDF** 

**Image:** 

**JPEG/JPG, PNG, BMP, TIFF, HEIF** 

**Microsoft Office:** 

**Word (DOCX), Excel (XLSX), PowerPoint (PPTX), and HTML** 

Read 

✔ 

✔ 

✔ 

Layout 

✔ 

✔ 

✔ (2024-07-31-preview, 2024-02-29-preview, 2023-10-31-preview) 

General Document 

✔ 

✔ 

Prebuilt 

✔ 

✔ 

Custom extraction 

✔ 

✔ 

Custom classification 

✔ 

✔ 

✔ (2024-07-31-preview, 2024-02-29-preview) 

*   For PDF and TIFF, up to 2000 pages can be processed (with a free tier subscription, only the first two pages are processed). 
*   The file size for analyzing documents is 500 MB for the paid (S0) tier and 4 MB for free (F0) tier. 
*   Image dimensions must be between 50 x 50 pixels and 10,000 x 10,000 pixels. 
*   If your PDFs are password-locked, you must remove the lock before submission. 
*   The minimum height of the text to be extracted is 12 pixels for a 1024 x 768 pixel image. This dimension corresponds to about 8-point text at 150 dots per inch (DPI). 
*   For custom model training, the maximum number of pages for training data is 500 for the custom template model and 50,000 for the custom neural model. 
*   For custom extraction model training, the total size of training data is 50 MB for template model and 1G-MB for neural model. 
*   For custom classification model training, the total size of training data is 1GB with a maximum of 10,000 pages. For 2024-07-31-preview and later, the total size of training data is 2GB with a maximum of 10,000 pages.  

Best Practices  

*   **Representative data** - Use representative documents that target actual data distribution, to train a high-quality custom generative model. For example, if the target document has partially filled tabular fields, add training documents that have partially filled tables. Or if field is named date, values for this field should be a date as random strings can affect model performance. 
*   **Field naming** - Choose a precise field name that represents the field values. For example, for a field value containing the Transaction Date, consider naming the field _TransactionDate_ instead of Date1. 
*   **Field Description** \- Provide additional contextual information in description to help clarify the field that needs to be extracted. Examples include location in the document, potential field labels it may be associated with, ways to differentiate with other terms that could be ambiguous.  
*   **Dealing with variation** - Custom generative models can generalize across different document templates of the same document type. As a best practice, create a single model for all variations of a document type. Ideally, include a visual template for each type, especially for ones that 

Current Limitations 

*   Custom Generative doesn't support fixed table and signature extraction in preview   
*   Inference on the same document could yield slightly different results across calls and this is a known limitation of current GPT models   
*   Confidence scores for each field might vary, recommend testing with your representative data to establish the confidence thresholds for your scenario.   
*   Grounding, especially for tabular fields, is challenging and might not be perfect in some cases.  
*   Latency for large documents is high, this is a known limitation in preview  
*   Compose model doesn't support Custom Generative  

Training a model  

Custom generative models are available starting 2024-07-31-preview API and onward  

**Document Type** 

**REST API** 

**SDK** 

**Train and test Models** 

Custom document 

[Document Intelligence 4.0 (2024-07-31-preview)](https://learn.microsoft.com/en-us/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2024-07-31&preserve-view=true&tabs=HTTP) 

[Document Intelligence SDK](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/quickstarts/get-started-sdks-rest-api?view=doc-intel-3.0.0&preserve-view=true) 

[AI Studio](https://formrecognizer.appliedai.azure.com/studio) 

The build operation to train model supports a new "buildMode" property, to train a custom generative model, set the "buildMode" to generative. 

_https://{endpoint}/documentintelligence/documentModels:build?api-version=2024-07-31-preview_ 

_{_ 

 _"modelId": "string",_ 

 _"description": "string",_ 

 _"buildMode": "generative",_ 

 _"azureBlobSource":_ 

 _{_ 

   _"containerUrl": "string",_ 

   _"prefix": "string"_ 

 _}_ 

_}_ 

Next steps 

*   Learn how to create custom generative models - link (build-a-custom-generative.md) 
*   Custom model overview – link to [Custom document models - Document Intelligence (formerly Form Recognizer) - Azure AI services | Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/concept-custom?view=doc-intel-4.0.0)