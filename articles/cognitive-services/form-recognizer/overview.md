---
title: What is Form Recognizer?
titleSuffix: Azure Cognitive Services
description: Learn how to use the Form Recognizer to parse form and table data.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: form-recognizer
ms.topic: overview
ms.date: 04/08/2019
ms.author: pafarley
#Customer intent: As the developer of form-processing software, I want to learn what the Form Recognizer service does so I can determine if I should use its features.
---

# What is Form Recognizer?

Azure Form Recognizer is a cognitive service that uses machine learning technology to identify and extract key-value pairs and table data from form documents. It then outputs structured data that includes the relationships in the original file. You can call your custom Form Recognizer model using a simple REST API in order to reduce complexity and easily integrate it into your workflow or application. You only need five form documents or an empty form of the same type as your input material to get started. You can get results quickly, accurately and tailored to your specific content without the need for heavy manual intervention or extensive data science expertise.

## Request access
Form Recognizer is available as a limited-access preview. To get access to the preview, please fill out and submit the [Cognitive Services Form Recognizer access request](https://aka.ms/FormRecognizerRequestAccess) form. The form requests information about you, your company, and the user scenario for which you'll use Form Recognizer. If your request is approved by the Azure Cognitive Services team, you'll receive an email with instructions on how to access the service.

## What it does

When you submit your input data, the algorithm trains to it, clusters the forms by types, discovers what keys and tables are present, and learns to associate values to keys and entries to tables. Unsupervised learning allows the model to understand the layout and relationships between fields and entries without manual data labeling or intensive coding and maintenance. By contrast, pre-trained machine learning models require standardized data and are less accurate with input material that deviates from traditional formats, like industry-specific forms.

Once the model is trained, you can test, retrain, and eventually use it to reliably extract data from more forms according to your needs.

## What it includes

Form Recognizer is available as a REST API. You can create, train and score a model by invoking the API, and you can optionally run the model in a local Docker container.

## Input requirements

Form Recognizer works on input documents that meet the following requirements:

* JPG, PNG, or PDF format (text or scanned). Text embedded PDFs are preferable because there is no possibility of error in character extraction and location.
* File size must be less than 4 megabytes (MB)
* For images, dimensions must be between 50x50 and 4200x4200 pixels
* If scanned from paper documents, forms should be high-quality scans
* Must use the Latin alphabet (English characters)
* Printed data (not handwritten)
* Must contain keys and values
* Keys can appear above or to the left of the values, but not below or to the right.

Additionally, Form Recognizer is **not** compatible with the following types of input data:

* Complex tables (tables whose header and data associations cannot be easily determined from the layout)
* Forms with checkboxes or radio buttons
* Images which appear tilted
* PDF documents longer than 50 pages

## Where do I start?

**Step 1:** Create a Form Recognizer resource in the Azure portal.

**Step 2:** Try our quickstart for hands-on experience
*	[Quickstart: Train a Form Recognizer model and extract form data using REST API with cURL](quickstarts/curl-train-extract.md)

We recommend the Free service for learning purposes, but be aware that the number of free pages is limited to 500 pages per month.

**Step 3:** Review the REST API 
Use the following APIs to train and extract structured data from forms. 

| REST API | Description |
|-----|-------------|
| Train | Train	a new model to analyze your forms using 5 forms from the same type or an empty form.  |
| Analyze  |Analyze a single document passed in as a stream to extract key-value pairs and tables from the form with your custom model.  |
 
Explore the [REST API reference document](https://aka.ms/from-recognizer/api). 


## Data privacy and security

The service is offered as a [Preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) of an Azure Service under the [Online Service Terms](https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=31). You will retain ownership of your data and we only use it to provide the Online Services as explained in your agreement:

### Processing of customer data; ownership

Customer Data will be used or otherwise processed only to provide Customer the Online Services including purposes compatible with providing those services. Microsoft will not use or otherwise process Customer Data or derive information from it for any advertising or similar commercial purposes. As between the parties, Customer retains all right, title and interest in and to Customer Data. Microsoft acquires no rights in Customer Data, other than the rights Customer grants to Microsoft to provide the Online Services to Customer.

As with all the Cognitive Services, developers using the Form Recognizer service should be aware of Microsoft's policies on customer data. See the [Cognitive Services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more.

## Next steps

Follow a [quickstart](quickstarts/curl-train-extract.md) to get started using the [Form Recognizer APIs](https://aka.ms/from-recognizer/api).
