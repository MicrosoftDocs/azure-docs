---
title: Business cards - Form Recognizer
titleSuffix: Azure Cognitive Services
description: Learn concepts related to business card analysis with the Form Recognizer API - usage and limits.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 08/17/2019
ms.author: pafarley
---

# Business card concepts

Azure Form Recognizer can analyze business cards using one of its prebuilt models. The Business Card API combines powerful Optical Character Recognition (OCR) capabilities with our Business Card Understanding model to extract key information from business cards in English. It extracts personal contact info, company name, job title, and more. The Prebuilt Business Card API is publicly available in the Form Recognizer v2.1 preview. 

## What does the Business Card API do?

The Business Card API extracts key fields from business cards and returns them in an organized JSON response.

![Contoso itemized image from FOTT + JSON output](./media/business-card-english.jpg)

### Fields Extracted: 
* Contact Names 
* First Name 
* Last Name 
* Company Names 
* Departments 
* Job Titles 
* Emails 
* Websites 
* Addresses 
* Phone Numbers 
  * Mobile Phones 
  * Faxes 
  * Work Phones 
  * Other Phones 

The Business Card API also returns all recognized text from the Business Card. This OCR output is included in the JSON response.  

### Input Requirements 

[!INCLUDE [input reqs](./includes/input-requirements-receipts.md)]

## Customer Scenarios  

The data extracted with the Business Card API can be used to perform a variety of tasks. Extracting this contact info automatically saves time for those in client-facing roles. The following are a few examples of what our customers have accomplished with the Business Card API:

* Extract contact info from Business cards and quickly create phone contacts. 
* Integrate with CRM to automatically create contact using business card images. 
* Keep track of sales leads.  
* Extract contact info in bulk from existing business card images. 

The Business Card API also powers the [AIBuilder Business Card Processing feature](https://docs.microsoft.com/ai-builder/prebuilt-business-card).

## Next steps

Now that you've become familiar with business card processing concepts, follow a quickstart to get started using the API

* [Business Cards API Python quickstart](./quickstarts/python-business-cards.md)