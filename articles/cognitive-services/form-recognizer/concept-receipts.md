---
title: Receipts - Form Recognizer
titleSuffix: Azure Cognitive Services
description: Learn concepts related to receipt analysis with the Form Recognizer API - usage and limits.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 08/17/2019
ms.author: pafarley
---

# Receipt concepts

AzureForm Recognizer can analyze receipts using one of its prebuilt models. The Receipt API extracts key information from sales receipts in English, such as merchant name, transaction date, transaction total, line items, and more. 

## Understanding Receipts 

Many businesses and individuals still rely on manually extracting data from their sales receipts, whether for business expense reports, reimbursements, tax purposes, budgeting, or other purposes. Often in these scenarios, images of the physical receipt are required for validation purposes.  

Automatically extracting data from these Receipts can be complicated. Receipts may be crumpled and hard to read, and smartphone images of receipts may be low quality. Also, receipt templates and fields can vary greatly by market, region, and merchant. These challenges in both data extraction and field detection make receipt processing a unique problem.  

Using Optical Character Recognition (OCR) and our prebuilt receipt model, the Receipt API enables these receipt processing scenarios. Because the model is pre-trained on our data, you can easily analyze your receipts in one step&mdash;no model training or labeling required.

![sample receipt](./media/contoso-receipt-small.png)

## What does the Receipt API do? 

The prebuilt Receipt API extracts the contents of sales receipts&mdash;the type of receipt you would commonly get at a restaurant, retailer, or grocery store.

### Fields extracted

* Merchant Name 
* Merchant Address 
* Merchant Phone Number 
* Transaction Date 
* Transaction Time 
* Subtotal 
* Tax 
* Total 
* Tip 
* Line-item extraction (for example item quantity, item price, item name)

### Additional features

The Receipt API also returns the following information:

* Receipt Type (such as itemized, credit card, and so on)
* Field confidence level (each field returns an associated confidence value)
* OCR raw text (OCR-extracted text output for the entire receipt)

## Input requirements

[!INCLUDE [input reqs](./includes/input-requirements-receipts.md)]

## Supported locales 

* **Pre-built Receipt v2.0** (GA) supports sales receipts in the EN-US locale
* **Pre-built Receipt v2.1-preview.1** (Public Preview) adds additional support for the following EN receipt locales: 
  * EN-AU 
  * EN-CA 
  * EN-GB 
  * EN-IN 

  > [!NOTE]
  > Language input 
  >
  > Prebuilt Receipt v2.1-preview.1 has an optional request parameter to specify a receipt locale from additional English markets. For sales receipts in English from Australia (EN-AU), Canada (EN-CA), Great Britain (EN-GB), and India (EN-IN), you can specify the locale to get improved results. If no locale is specified in v2.1-preview.1, the model will default to the EN-US model.

## Customer scenarios  

The data extracted with the Receipt API can be used to perform a variety of tasks. The following are a few examples of what our customers have accomplished with the Receipt API. 

### Business expense reporting  

Often filing business expenses involves spending time manually entering data from images of receipts. With the Receipt API, you can use the extracted fields to partially automate this process and analyze your receipts quickly.  

Because the Receipt API has a simple JSON output, you can use the extracted field values in multiple ways. Integrate with internal expense applications to pre-populate expense reports. For more on this scenario, read about how Acumatica is utilizing Receipt API to [make expense reporting a less painful process](https://customers.microsoft.com/en-us/story/762684-acumatica-partner-professional-services-azure).  

### Auditing and accounting 

The Receipt API output can also be used to perform analysis on a large number of expenses at various points in the expense reporting and reimbursement process. You can process receipts to triage them for manual audit or quick approvals.  

The Receipt output is also useful for general book-keeping for business or personal use. Use the Receipt API to transform any raw receipt image/PDF data into a digital output that is actionable.

### Consumer behavior 

Receipts contain useful data which you can use to analyze consumer behavior and shopping trends.

