---
title: What is Form Recognizer?
titleSuffix: Azure Cognitive Services
description: Learn how to use the Form Recognizer to parse form and table data.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 07/25/2019
ms.author: pafarley
#Customer intent: As a developer of form-processing software, I want to learn what the Form Recognizer service does so I can determine if I should use it.
---

# What is Form Recognizer?

Azure Form Recognizer is a cognitive service that uses machine learning technology to identify and extract text, key/value pairs and table data from form documents. It then outputs structured data that includes the relationships in the original file. You can call Form Recognizer models by using a simple REST API to reduce complexity and easily integrate it into your workflow or application. You quickly get accurate results that are tailored to your specific content without heavy manual intervention or extensive data science expertise.

Form Recognizer is comprised of the following services:
* **Custom** -  Extract key value pairs and table from forms. Tailored to your forms, trains to your own data. 
* **Pre-built Receipt** - A model for reading [sales receipts](link to sales receipt image) 
* **Layout** -  Extract text and table structure from forms

**Add attached Image**

## Custom models

The Form Recognizer custom model trains to your own data. To get started, you just need five filled-in form documents from the same type (same structure and format) to train a model. You can train a model to automaticaly disocver key value pairs and tables or label the forms to extract the values of intrest. When you submit your input data, the algorithm learns your forms and creates a model for your forms. After you train the model, you can test it and eventually use it to reliably extract data from more forms according to your needs.

Form Recognizer custom enables you to train a model in the following options: 

* **Train without labels** - uses unsupervised learning to understand the layout and relationships between fields and entries without manual data labeling or intensive coding and maintenance.

* **Train with labels** - uses supervised learning to extract the vlaues of intrest based on the labeled froms provided. 

## Prebuilt receipt model

Form Recognizer also includes a model for reading sales thermal receipts (**add image of thermal receipt**). This model extracts key information such as the time and date of the transaction, merchant information, amounts of taxes, line items and totals and more. In addition, the prebuilt receipt model is trained to recognize and return all of the text on a receipt.

## Layout

Form Recognizer also extracts text and table structure (row-1,col-1..row-n,col-n) from forms. The Layout feature uses high definition OCR to extract text and table structure from forms. 

## What it includes

Form Recognizer is available as a REST API. You can create, train, and score a custom model or access the prebuilt receipts and layout model by invoking these APIs. If you want, you can train and run custom models in a local Docker container.

## Input requirements
### Custom model

[!INCLUDE [input requirements](./includes/input-requirements.md)]

### Prebuilt receipt model

The input requirements for the receipt model are slightly different.

* Format must be JPEG, PNG, BMP, PDF (text or scanned) or TIFF.
* File size must be less than 20 MB.
* Image dimensions must be between 50 x 50 pixels and 10000 x 10000 pixels. 
* PDF dimensions must be at most 17 x 17 inches, corresponding to Legal or A3 paper sizes and smaller.
* For PDF and TIFF, only the first 200 pages are processed (with a free tier subscription, only the first two pages are processed).

## Where do I start?

**Step 1:** Request access 

Form Recognizer is available in a limited-access preview. To get access to the preview, fill out and submit the [Form Recognizer access request](https://aka.ms/FormRecognizerRequestAccess) form. The form requests information about you, your company, and the user scenario for which you'll use Form Recognizer. If your request is approved by the Azure Cognitive Services team, you'll receive an email with instructions for accessing the service.

**Step 2:** Create a Form Recognizer resource in the Azure portal.

**Step 3:** Extract data from your forms:
* Custom - train a model to your forms
    * Train without labels 
      * [Quickstart: Train without labels a Form Recognizer model and extract form data by using the REST API with cURL]  (quickstarts/curl-train-extract.md)
      * [Quickstart: Train without labels a Form Recognizer model and extract form data by using the REST API with Python](quickstarts/python-train-extract.md)
       * Train with labels 
         * [Quickstart: Train with labels a Form Recognizer model and extract form data by using the Labeling Tool]  (quickstarts/label.md)
          * [Quickstart: Train with labels a Form Recognizer model and extract form data by using the REST API with Python](quickstarts/python-train-with-labels-extract.md)
           * [Quickstart: Train with labels a Form Recognizer model and extract form data by using the REST API with cURL]  (quickstarts/curl-train-wiht-labels-extract.md)
           
* Pre-built receipts - extract data from US thermal receipts 
  * [Quickstart: Extract receipt data using cURL](quickstarts/curl-receipts.md)
  * [Quickstart: Extract receipt data using Python](quickstarts/python-receipts.md)

* Layout - extract text and table structure from forms  
  * [Quickstart: Extract layout data using cURL](quickstarts/curl-layout.md)
  * [Quickstart: Extract layout data using Python](quickstarts/python-layout.md)

We recommend that you use the free service when you're learning the technology. Keep in mind that the number of free pages is limited to 500 per month.

**Step 4:** Review the REST APIs.

You use the following APIs to train and extract structured data from forms.

|Name |Description |
|---|---|
| **Train Custom Model**| Train a new model to analyze your forms by using five forms of the same type. Use the 'useLabelFile' parameter to train with our without labels |
| **Analyze Form** |Analyze a single document passed in as a stream to extract text, key/value pairs and tables from the form with your custom model.  |
| **Analyze Receipt** |Analyze a single receipt document to extract key information and other receipt text.|
| **Analyze Layout** |Analyze the layout of a form to extract text and table strcutre.|

Explore the [REST API reference documentation](https://aka.ms/form-recognizer/api) to learn more. If you're familiar with a previous version of the API, see the [What's new](./whats-new.md) article to learn about recent changes.

## Data privacy and security

This service is offered as a [preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) of an Azure service under the [Online Service Terms](https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=31). As with all the cognitive services, developers using the Form Recognizer service should be aware of Microsoft policies on customer data. See the [Cognitive Services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more.

## Next steps

Complete a [quickstart](quickstarts/curl-train-extract.md) to get started with the [Form Recognizer APIs](https://aka.ms/form-recognizer/api).
