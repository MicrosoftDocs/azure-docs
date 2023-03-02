---
title: Choose the best Form Recognizer model
titleSuffix: Azure Applied AI Services
description: Choose the best Form Recognizer model to meet your needs.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 03/01/2023
ms.author: lajanuar
recommendations: false
---

## Choose the best Form Recognizer model

Which Form Recognizer model should I use?

The following will help you decide the best **Form Recognizer v3.0** supported model to meet your needs and those of your application.

| Type of document | Data to extract |Document format | Your best solution |
| -----------------|-------------------| ----------|-------------------|
|**A generic document** like a contract or letter.|You want to extract primarily text lines, words, locations, and detected languages.|</li></ul>The document is written or printed in a [supported language](language-support.md#read-layout-and-custom-form-template-model).| [**Read OCR model**](concept-read.md)|
|**A document that includes structural information** like a report or study.|In addition to text, you need to extract structural information like tables, selection marks, paragraphs, titles, headings, and subheadings.|The document is written or printed in a [supported language](language-support.md#read-layout-and-custom-form-template-model)| [**Layout analysis model**](concept-layout.md)
|**A structured or semi-structured document that includes content formatted as fields and values**, like a credit application or survey form.|You want to extract fields and values including ones not covered by the scenario-specific prebuilt models **without having to train a custom model**.| The form or document is a standardized format commonly used in your business or industry and printed in a [supported language](language-support.md#read-layout-and-custom-form-template-model).|[**General document  model**](concept-general-document.md)
|**U.S. W-2 form**|You want to extract key information such as salary, wages, and taxes withheld from US W2 tax forms.</li></ul> |The W-2 document is in United States English (en-US) text.|[**W-2 model**](concept-w2.md)
|**Invoice**|You want to extract key information such as customer name, billing address, and amount due from invoices.</li></ul> |The invoice document is written or printed in a [supported language](language-support.md#invoice-model).|[**Invoice model**](concept-invoice.md)
 |**Receipt**|You want to extract key information such as merchant name, transaction date, and transaction total from a sales or single-page hotel receipt.</li></ul> |The receipt is written or printed in a [supported language](language-support.md#receipt-model). |[**Receipt model**](concept-receipt.md)|
|**Identity document (ID)** like a passport or driver's license. |You want to extract key information such as first name, last name, and date of birth from US drivers' licenses or international passports. |Your ID document is a US driver's license or the biographical page from an international passport (not a visa).| [**Identity document (ID) model**](concept-id-document.md)|
|**Business card**|You want to extract key information such as first name, last name, company name, email address, and phone number from business cards.</li></ul>|The business card document is in English or Japanese text. | [**Business card model**](concept-business-card.md)|
|**Mixed-type document(s)**| You want to extract key-value pairs, selection marks, tables, signature fields, and selected regions not extracted by prebuilt or general document models.| You have various documents with structured, semi-structured, and/or unstructured elements.| [**Custom model**](concept-custom.md)|

>[!Tip]
>
> * If you're still unsure which model to use, try the General Document model to extract key-value pairs.
> * The General Document model is powered by the Read OCR engine to detect text lines, words, locations, and languages.
> * General document also extracts the same data as the document layout model (pages, tables, styles).

