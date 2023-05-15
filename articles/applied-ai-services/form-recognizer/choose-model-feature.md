---
title: Choose the best Form Recognizer model
titleSuffix: Azure Applied AI Services
description: Choose the best Form Recognizer model to meet your needs.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 03/30/2023
ms.author: lajanuar
recommendations: false
---

# Which Form Recognizer model should I use?

Azure Form Recognizer supports a wide variety of models that enable you to add intelligent document processing to your applications and optimize your workflows. Selecting the right model is essential to ensure the success of your enterprise. In this article, we explore the available Form Recognizer models and provide guidance for how to choose the best solution for your projects.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE5fX1b]

The following decision chart highlights the features of each **Form Recognizer v3.0** supported model and helps you choose the best model to meet the needs and requirements of your application.

Document analysis models

| Document type | Example| Data to extract | Your best solution |
| -----------------|-----------|--------|-------------------|
|**A generic document** written or printed in a [supported language](language-support.md#read-layout-and-custom-form-template-model).| A contract or letter. |You want to extract primarily text lines, words, locations, and detected languages.|[**Read OCR model**](concept-read.md)|
|**A document that includes structural information** written or printed in a [supported language](language-support.md#read-layout-and-custom-form-template-model).|A report or study.| In addition to text, you need to extract structural information like tables, selection marks, paragraphs, titles, headings, and subheadings.| [**Layout analysis model**](concept-layout.md)
|**A structured or semi-structured document that includes content formatted as fields and values**.|A form or document that is a standardized format commonly used in your business or industry like a credit application or survey. | You want to extract fields and values including ones not covered by the scenario-specific prebuilt models **without having to train a custom model**.| [**General document  model**](concept-general-document.md)|

Pretrained models

| Document type | Data to extract | Your best solution |
| -----------------|--------------|-------------------|
|**U.S. W-2 tax form**|You want to extract key information such as salary, wages, and taxes withheld.|[**W-2 model**](concept-w2.md)|
|**Health insurance card** or health insurance ID.| You want to extract key information such as insurer, member, prescription, and group number.|[**Health insurance card model**](./concept-insurance-card.md)|
|**Invoice** or billing statement.|You want to extract key information such as customer name, billing address, and amount due.|[**Invoice model**](concept-invoice.md)
 |**Receipt**, voucher, or single-page hotel receipt. |You want to extract key information such as merchant name, transaction date, and transaction total.|[**Receipt model**](concept-receipt.md)|
|**Identity document (ID)** like a U.S. driver's license or international passport. |You want to extract key information such as first name, last name, and date of birth. | [**Identity document (ID) model**](concept-id-document.md)|
|**Business card** or calling card.|You want to extract key information such as first name, last name, company name, email address, and phone number.|[**Business card model**](concept-business-card.md)|
|**Mixed-type document(s)** with structured, semi-structured, and/or unstructured elements. | You want to extract key-value pairs, selection marks, tables, signature fields, and selected regions not extracted by prebuilt or general document models.| [**Custom model**](concept-custom.md)|

>[!Tip]
>
> * If you're still unsure which model to use, try the **General Document model** to extract key-value pairs.
> * The General Document model is powered by the Read OCR engine to detect text lines, words, locations, and languages.
> * General document also extracts the same data as the Layout model (pages, tables, styles).

