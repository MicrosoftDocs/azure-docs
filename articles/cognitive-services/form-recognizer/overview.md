---
title: What is Form Recognizer?
titleSuffix: Azure Cognitive Services
description: Learn how to use the Form Recognizer to parse form and table data.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 07/01/2019
ms.author: pafarley
#Customer intent: As a developer of form-processing software, I want to learn what the Form Recognizer service does so I can determine if I should use it.
---

# What is Form Recognizer?

Azure Form Recognizer is a cognitive service that uses machine learning technology to identify and extract key/value pairs and table data from form documents. It then outputs structured data that includes the relationships in the original file. You can call your custom Form Recognizer model by using a simple REST API to reduce complexity and easily integrate it into your workflow or application. To get started, you just need five filled-in form documents or two filled-in forms plus an empty form of the same type as your input material. You quickly get accurate results that are tailored to your specific content without heavy manual intervention or extensive data science expertise.

## Custom models

The Form Recognizer custom model trains to your own data, and you only need five sample input forms to start. When you submit your input data, the algorithm clusters the forms by type, discovers what keys and tables are present, and associates values to keys and entries to tables. It then outputs structured data that includes the relationships in the original file. After you train the model, you can test and retrain it and eventually use it to reliably extract data from more forms according to your needs.

Unsupervised learning allows the model to understand the layout and relationships between fields and entries without manual data labeling or intensive coding and maintenance. By contrast, pre-trained machine learning models require standardized data. They're less accurate with input material that deviates from traditional formats, like industry-specific forms.

## Pre-built receipt model

Form Recognizer also includes a model for reading sales receipts. This model extracts key information such as the time and date of the transaction, merchant information, amounts of taxes and totals and more. In addition, the pre-built receipts model is trained to recognize and return all of the text on a receipt.

## What it includes

Form Recognizer is available as a REST API. You can create, train, and score a custom model or access the pre-built model by invoking these APIs. If you want, you can train and run custom models in a local Docker container.

## Input requirements (custom model)

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Request access

Form Recognizer is available in a limited-access preview. To get access to the preview, fill out and submit the [Form Recognizer access request](https://aka.ms/FormRecognizerRequestAccess) form. The form requests information about you, your company, and the user scenario for which you'll use Form Recognizer. If your request is approved by the Azure Cognitive Services team, you'll receive an email with instructions for accessing the service.

## Where do I start?

**Step 1:** Create a Form Recognizer resource in the Azure portal.

**Step 2:** Follow a quickstart to use the REST API:
* [Quickstart: Train a Form Recognizer model and extract form data by using the REST API with cURL](quickstarts/curl-train-extract.md)
* [Quickstart: Train a Form Recognizer model and extract form data by using the REST API with Python](quickstarts/python-train-extract.md)
* [Quickstart: Extract receipt data using cURL](quickstarts/curl-receipts.md)
* [Quickstart: Extract receipt data using Python](quickstarts/python-receipts.md)

We recommend that you use the free service when you're learning the technology. Keep in mind that the number of free pages is limited to 500 per month.

**Step 3:** Review the REST APIs

You use the following APIs to train and extract structured data from forms.

|||
|---|---|
| Train Model| Train a new model to analyze your forms by using five forms of the same type. Or, train with an empty form and two filled-in forms.  |
| Analyze Form |Analyze a single document passed in as a stream to extract key/value pairs and tables from the form with your custom model.  |
| Analyze Receipt |Analyze a single receipt document to extract key information and other receipt text.|

Explore the [REST API reference documentation](https://aka.ms/form-recognizer/api) to learn more. 

## Data privacy and security

This service is offered as a [preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) of an Azure service under the [Online Service Terms](https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=31). As with all the cognitive services, developers using the Form Recognizer service should be aware of Microsoft policies on customer data. See the [Cognitive Services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more.

## Next steps

Complete a [quickstart](quickstarts/curl-train-extract.md) to get started with the [Form Recognizer APIs](https://aka.ms/form-recognizer/api).
