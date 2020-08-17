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

Azure Form Recognizer includes several Prebuilt models for unique form types and scenarios. These prebuilt models are pre-trained on images of receipts and ready to use off-the-shelf&mdash;no manual data labeling or model training required.  

One of these Prebuilt models is our Prebuilt Receipt API. This API combines powerful Optical Character Recognition (OCR) capabilities with our Receipt Understanding model to extract key information from sales receipts in English. We detect and extract fields such as merchant name, transaction date, transaction total, line items, and more. 

## Prebuilt Receipt API 

### Input requirements 

* Supported file formats: JPEG, PNG, BMP, PDF, and TIFF 
* For PDF AND TIFF, up to 2000 pages are processed. For free tier subscribers, only the first two pages are processed. 
* The file size must be less than 50 MB and dimensions at least 50 x 50 pixels and at most 10000 x 10000 pixels. 
* The PDF dimensions must be at most 17 x 17 inches, corresponding to legal or A3 paper sizes and smaller. 

## Best Practices 

Currently, sales receipts are supported in the Pre-built Receipt API. This is the type of receipt you would commonly get at a restaurant, retailer, or grocery store.  

**Pre-built Receipt v2.0** (GA) supports sales receipts in the EN-US market 

**Pre-built Receipt v2.1-preview.1** (Public Preview) adds additional support for the following EN receipt locales: 
* EN-AU 
* EN-CA 
* EN-GB 
* EN-IN 

> [!NOTE]
> Language input 
>
> Prebuilt Receipt v2.1-preview.1 has an optional request parameter to specify receipt locale from additional English markets. For sales receipts in English from Australia (EN-AU), Canada (EN-CA), Great Britain (EN-GB), and India (EN-IN), you can specify the locale to get improved results. If no locale is specified in v2.1-preview.1, the model will default to the EN-US model.

## Sample Receipt API output 

![sample receipt](./media/contoso-receipt-small.png)

## Understanding Receipts 

Thousands of paper receipts are printed daily around the world. Many businesses and individuals rely on manually extracting data from these receipts, whether it is for business expense reports, reimbursements, tax purposes, budgeting, and more. Often in these scenarios, images of the physical receipt are required for validation purposes.  

However, extracting data from these Receipts can be very tricky. Receipts can be crumpled and hard to read, and many smartphone images of receipts can be low quality. Receipt templates and fields can vary greatly by market, region, and merchant. These challenges in both data extraction and field detection make Receipt processing a unique problem.  

Using Optical Character Recognition (OCR) and our Receipt model, we were able to create the Prebuilt Receipt API to enable receipt processing scenarios. Because the model is pre-trained on our data, you can easily analyze your receipts in one step – no model training or labeling required. With the Receipt API, extract key fields such as merchant name, transaction total, and more. 

## What does the Receipt API do? 

The Receipt API extracts key fields from sales receipts. For more on input requirements and supported receipt types, please see our API reference or the input requirements and best practices.  

**Fields Extracted:**

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

## Additional Features: 

* Receipt Type (such as itemized, credit card, and so on)
* Field confidence level (each field returns an associated confidence value)
* OCR raw text (OCR-extracted text output for the entire receipt)

## Customer Scenarios  

The data extracted with the Receipt API can be used to perform a wide variety of tasks. Here are a few examples for what our customers have accomplished with the Receipt API!  

### Business Expense Reporting  

Filing business expenses can be a painful process. Often, employees must spend valuable time manually entering data from images of receipts. With the Receipt API, you can use the extracted fields to partially automate this process and analyze your receipts quickly.  

Because the Receipt API has a simple JSON output, you can use the extracted field values in multiple ways. Integrate with internal expense applications to pre-populate expense reports. For more on this scenario, read about how our customer Acumatica is utilizing Receipt API to [make expense reporting a less painful process](https://customers.microsoft.com/en-us/story/762684-acumatica-partner-professional-services-azure).  

### Auditing and Accounting 

The Receipt API output can also be used to perform analysis on large amounts of expenses in various parts of the expense reporting and reimbursement process. Process receipts to triage them for manual audit or quick approvals.  

The Receipt output is also very useful for general book-keeping for business or personal use, especially if a large amount of receipt images with latent information. Use Receipt to transform this raw receipt image/PDF data into a digital output which is actionable.  

### Consumer Behavior 

Receipts contain useful data which can be used to analyze consumer behavior and shopping trends. With the Receipt API, you can quickly and easily analyze consumer behavior on a large scale. Sales receipts can be tricky to analyze because of the large variety of merchants— our Prebuilt Receipt API can analyze these receipts out of the box, no model training or labeling required.  
