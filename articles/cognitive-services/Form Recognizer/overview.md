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

Form Recognizer applies machine learning technology to identify and extract key-value pairs and tables from forms. It associates values and table entries to them and then outputs structured data that includes the relationships in the original file. You can call your custom Form Recognizer model using a simple REST API in order to reduce complexity and easily integrate it in your workflow automation process or other application. Only five documents (or an empty form) are needed, so you can get results quickly, accurately and tailored to your specific content, without heavy manual intervention or extensive data science expertise. It does not require data labeling or data annotation.

## What it does

The Form Recognizer service uses machine learning algorithms to extract key-value pairs and tables out of forms. You, the developer, must submit a minimum of five sample forms or an empty form of the same type as your input material. Then the algorithm trains to this data, clusters the forms by types, discovers what are the keys and tables in the forms and learns to associate values to keys and entries to tables. Once the model is trained, you can test, retrain, and eventually use it to extract key-value pairs and tables from forms according to the needs of your app.

## What it includes

The Form Recognizer private preview service is available as a container. You can create, train and score a model by invoking the Form Recognizer container REST API. You can install the Form Recognizer Docker container closer to your data in the cloud or locally.

## Input requirements

The Form Recognizer private preview release can extract key-value pairs and tables from forms that meet the following requirements:

* The forms must be presented in PDF (text or scanned), JPG and PNG format
* For images:
  * The file size of the image must be less than 4 megabytes (MB)
  * The dimensions of the image must be between 50 x 50 and 4200 x 4200 pixels
* Latin alphabet forms (English characters forms)
* Printed forms
* Keys and values must appear on the form
* Keys can be on the top or on the left (keys under or on the right are not supported)
* Forms should be good quality scanned images or PDF

## Data privacy and security

The service is offered as a [Preview](https://azure.microsoft.com/en-us/support/legal/preview-supplemental-terms/) of an Azure Service under the [Online Service Terms](https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=31). You will retain ownership of your data and we only use it to provide the Online Services as explained in your agreement:  

### Processing of customer data; ownership

Customer Data will be used or otherwise processed only to provide Customer the Online Services including purposes compatible with providing those services. Microsoft will not use or otherwise process Customer Data or derive information from it for any advertising or similar commercial purposes. As between the parties, Customer retains all right, title and interest in and to Customer Data. Microsoft acquires no rights in Customer Data, other than the rights Customer grants to Microsoft to provide the Online Services to Customer.

As with all the Cognitive Services, developers using the Form Recognizer service should be aware of Microsoft's policies on customer data. See the [Cognitive Services page](https://www.microsoft.com/en-us/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more.