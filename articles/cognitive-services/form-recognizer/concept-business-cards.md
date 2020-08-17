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

Azure Form Recognizer includes several Prebuilt models for unique form types and scenarios. These prebuilt models are pre-trained on our data and ready to use off the shelf— no manual data labeling or model training required.  

One of these Prebuilt models is our Prebuilt Business Card API. This API combines powerful Optical Character Recognition (OCR) capabilities with our Business Card Understanding model to extract key information from business cards in English. We detect and extract personal contact info, as well as company name, job title, and more. The Prebuilt Business Card API is now publicly available in the Form Recognizer v2.1 preview. 

## Business Card API 

### Input Requirements 

* Supported file formats: JPEG, PNG, BMP, PDF, and TIFF 
* For PDF AND TIFF, up to 2000 pages are processed. For free tier subscribers, only the first two pages are processed. 
* The file size must be less than 50 MB and dimensions at least 50 x 50 pixels and at most 10000 x 10000 pixels. 
* The PDF dimensions must be at most 17 x 17 inches, corresponding to legal or A3 paper sizes and smaller. 

### Sample Business Card API output 

![Contoso itemized image from FOTT + JSON output](./media/business-card-english.jpg)

## What does the Prebuilt Business Card API do?  

The Receipt API extracts key fields from business cards. For more on input requirements and supported business card types, please see our API reference and the input requirements. 

**Fields Extracted:** 
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

## Customer Scenarios  

The Business Card API enables you to easily extract key fields from English business cards. Using the simple JSON output, you can extract contact information from business cards. Because the model is pre-trained on our data, you can easily analyze your business cards in one step – no model training or labeling required. 

The Business Card API powers the [AIBuilder Business Card Processing feature](https://docs.microsoft.com/en-us/ai-builder/prebuilt-business-card).  

Extracting this contact info painlessly saves time for those in client-facing roles. Here are some examples of ways customers can use the Business Card API: 

* Extract contact info from Business cards and quickly create phone contacts. 
* Integrate with CRM to automatically create contact using business card images. 
* Keep track of sales leads.  
* Extract contact info in bulk from existing business card images. 

 

 