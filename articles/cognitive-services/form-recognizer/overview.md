---
title: What is Form Recognizer?
titleSuffix: Azure Cognitive Services
description: The Azure Cognitive Services Form Recognizer allows you to identify and extract key/value pairs and table data from form documents.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 04/14/2020
ms.author: pafarley
#Customer intent: As a developer of form-processing software, I want to learn what the Form Recognizer service does so I can determine if I should use it.
---

# What is Form Recognizer?

[!INCLUDE [TLS 1.2 enforcement](../../../includes/cognitive-services-tls-announcement.md)]

Azure Form Recognizer is a cognitive service that uses machine learning technology to identify and extract text, key/value pairs and table data from form documents. It ingests text from forms and outputs structured data that includes the relationships in the original file. You quickly get accurate results that are tailored to your specific content without heavy manual intervention or extensive data science expertise. Form Recognizer is comprised of custom models, the prebuilt receipt model, and the layout API. You can call Form Recognizer models by using a REST API to reduce complexity and integrate it into your workflow or application.

Form Recognizer is made up of the following services:
* **Custom models** - Extract key/value pairs and table data from forms. These models are trained with your own data, so they're tailored to your forms.
* **Prebuilt receipt model** - Extract data from USA sales receipts using a prebuilt model.
* **Layout API** - Extract text and table structures, along with their bounding box coordinates, from documents.

<!-- add diagram -->

## Custom models

Form Recognizer custom models train to your own data, and you only need five sample input forms to start. A trained model can output structured data that includes the relationships in the original form document. After you train the model, you can test and retrain it and eventually use it to reliably extract data from more forms according to your needs.

You have the following options when you train custom models: training with labeled data and without labeled data.

### Train without labels

By default, Form Recognizer uses unsupervised learning to understand the layout and relationships between fields and entries in your forms. When you submit your input forms, the algorithm clusters the forms by type, discovers what keys and tables are present, and associates values to keys and entries to tables. This doesn't require manual data labeling or intensive coding and maintenance, and we recommend you try this method first.

### Train with labels

When you train with labeled data, the model does supervised learning to extract values of interest, using the labeled forms you provide. This results in better-performing models and can produce models that work with complex forms or forms containing values without keys.

Form Recognizer uses the [Layout API](#layout-api) to learn the expected sizes and positions of printed and handwritten text elements. Then it uses user-specified labels to learn the key/value associations in the documents. We recommend that you use five manually labeled forms of the same type to get started when training a new model and add more labeled data as needed to improve the model accuracy.

## Prebuilt receipt model

Form Recognizer also includes a model for reading English sales receipts from the United States&mdash;the type used by restaurants, gas stations, retail, and so on ([sample receipt](./media/contoso-receipt-small.png)). This model extracts key information such as the time and date of the transaction, merchant information, amounts of taxes and totals and more. In addition, the prebuilt receipt model is trained to recognize and return all of the text on a receipt.

## Layout API

Form Recognizer can also extract text and table structure (the row and column numbers associated with the text) using high-definition optical character recognition (OCR).

## Get started

Follow a quickstart to get started extracting data from your forms. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.

* Custom - train a model to your forms
  * Train without labels
    * [Quickstart: Train a Form Recognizer model and extract form data by using the REST API with cURL](quickstarts/curl-train-extract.md)
    * [Quickstart: Train a Form Recognizer model and extract form data by using the REST API with Python](quickstarts/python-train-extract.md)
  * Train with labels
    * [Train a Form Recognizer model with labels using the sample labeling tool](quickstarts/label-tool.md)
    * [Train a Form Recognizer model with labels using REST API and Python](quickstarts/python-labeled-data.md)
* Prebuilt receipts - extract data from USA sales receipts
  * [Quickstart: Extract receipt data using cURL](quickstarts/curl-receipts.md)
  * [Quickstart: Extract receipt data using Python](quickstarts/python-receipts.md)
* Layout - extract text and table structure from forms
  * [Quickstart: Extract layout data using Python](quickstarts/python-layout.md)

### Review the REST APIs

You'll use the following APIs to train models and extract structured data from forms.

|Name |Description |
|---|---|
| **Train Custom Model**| Train a new model to analyze your forms by using five forms of the same type. Set the _useLabelFile_ parameter to `true` to train with manually labeled data. |
| **Analyze Form** |Analyze a single document passed in as a stream to extract text, key/value pairs and tables from the form with your custom model.  |
| **Analyze Receipt** |Analyze a single receipt document to extract key information and other receipt text.|
| **Analyze Layout** |Analyze the layout of a form to extract text and table structure.|

Explore the [REST API reference documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-preview/operations/AnalyzeWithCustomForm) to learn more. If you're familiar with a previous version of the API, see the [What's new](./whats-new.md) article to learn about recent changes.

## Input requirements
### Custom model

[!INCLUDE [input requirements](./includes/input-requirements.md)]

### Prebuilt receipt model

The input requirements for the receipt model are slightly different.

* Format must be JPEG, PNG, PDF (text or scanned) or TIFF.
* File size must be less than 20 MB.
* Image dimensions must be between 50 x 50 pixels and 10000 x 10000 pixels.
* PDF dimensions must be at most 17 x 17 inches, corresponding to Legal or A3 paper sizes and smaller.
* For PDF and TIFF, only the first 200 pages are processed (with a free tier subscription, only the first two pages are processed).

## Data privacy and security

This service is offered as a [preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) of an Azure service under the [Online Service Terms](https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=31). As with all the cognitive services, developers using the Form Recognizer service should be aware of Microsoft policies on customer data. See the [Cognitive Services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more.

## Next steps

Complete a [quickstart](quickstarts/curl-train-extract.md) to get started with the [Form Recognizer APIs](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-preview/operations/AnalyzeWithCustomForm).
