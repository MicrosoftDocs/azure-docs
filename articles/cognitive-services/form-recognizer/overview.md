---
title: What is Form Recognizer?
titleSuffix: Azure Cognitive Services
description: Learn how to use the Form Recognizer to parse form and table data.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: form-recognizer
ms.topic: overview
ms.date: 04/03/2019
ms.author: pafarley
#Customer intent: As the developer of form-processing software, I want to learn what the Form Recognizer service does so I can determine if I should use its features.
---

# What is Form Recognizer?

Azure Form Recognizer is a cognitive service that uses machine learning technology to identify and extract key-value pairs and table data from form documents. It then outputs structured data that includes the relationships in the original file. You can call your custom Form Recognizer model using a simple REST API in order to reduce complexity and easily integrate it into your workflow or application. You only need five form documents or an empty form of the same type as your input material to get started. You can get results quickly, accurately and tailored to your specific content without the need for heavy manual intervention or extensive data science expertise.

## What it does

When you submit your input data the algorithm trains to it, clusters the forms by types, discovers what keys and tables are present in the forms, and learns to associate values to keys and entries to tables. Once the model is trained, you can test, retrain, and eventually use it to reliably extract data from more forms according to your needs.

## What it includes

Form Recognizer is available as a REST API. You can create, train and score a model by invoking this API, and you can optionally run the model in a local Docker container.

## Input requirements

Form Recognizer works on input documents that meet the following requirements:

* PDF (text or scanned), JPG, or PNG format
* For images:
  * File size must be less than 4 megabytes (MB)
  * Dimensions must be between 50x50 and 4200x4200 pixels
* Must use the Latin alphabet (English characters)
* Printed data (not handwritten)
* Must contain keys and values
* Keys must appear on the top or the left of the document
* If scanned from paper documents, forms should be high-quality scans

## Data privacy and security

The service is offered as a [Preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) of an Azure Service under the [Online Service Terms](https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=31). You will retain ownership of your data and we only use it to provide the Online Services as explained in your agreement:

### Processing of customer data; ownership

Customer Data will be used or otherwise processed only to provide Customer the Online Services including purposes compatible with providing those services. Microsoft will not use or otherwise process Customer Data or derive information from it for any advertising or similar commercial purposes. As between the parties, Customer retains all right, title and interest in and to Customer Data. Microsoft acquires no rights in Customer Data, other than the rights Customer grants to Microsoft to provide the Online Services to Customer.

As with all the Cognitive Services, developers using the Form Recognizer service should be aware of Microsoft's policies on customer data. See the [Cognitive Services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more.

## Next steps

Follow a quickstart to get started using the Form Recognizer APIs.