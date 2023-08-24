---
title: Choose the best Document Intelligence (formerly Form Recognizer) model for your applications and workflows
titleSuffix: Azure AI services
description: Choose the best Document Intelligence model to meet your needs.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 07/18/2023
ms.author: lajanuar
monikerRange: '>=doc-intel-3.0.0'
---





# Which model should I choose?

Azure AI Document Intelligence supports a wide variety of models that enable you to add intelligent document processing to your applications and optimize your workflows. Selecting the right model is essential to ensure the success of your enterprise. In this article, we explore the available Document Intelligence models and provide guidance for how to choose the best solution for your projects.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE5fX1b]

The following decision charts highlight the features of each **Document Intelligence v3.0** supported model and help you choose the best model to meet the needs and requirements of your application.

> [!IMPORTANT]
> Be sure to check the [**language support**](language-support.md) page for supported language text and field extraction  by feature.

## Pretrained document-analysis models

| Document type | Example| Data to extract | Your best solution |
| -----------------|-----------|--------|-------------------|
|**A generic document**. | A contract or letter. |You want to primarily extract written or printed text lines, words, locations, and detected languages.|[**Read OCR model**](concept-read.md)|
|**A document that includes structural information**. |A report or study.| In addition to written or printed text, you need to extract structural information like tables, selection marks, paragraphs, titles, headings, and subheadings.| [**Layout analysis model**](concept-layout.md)
|**A structured or semi-structured document that includes content formatted as fields and values**.|A form or document that is a standardized format commonly used in your business or industry like a credit application or survey. | You want to extract fields and values including ones not covered by the scenario-specific prebuilt models **without having to train a custom model**.| [**General document  model**](concept-general-document.md)|

## Pretrained scenario-specific models

| Document type | Data to extract | Your best solution |
| -----------------|--------------|-------------------|
|**U.S. W-2 tax form**|You want to extract key information such as salary, wages, and taxes withheld.|[**W-2 model**](concept-w2.md)|
|**Health insurance card** or health insurance ID.| You want to extract key information such as insurer, member ID, prescription coverage, and group number.|[**Health insurance card model**](./concept-insurance-card.md)|
|**Invoice** or billing statement.|You want to extract key information such as customer name, billing address, and amount due.|[**Invoice model**](concept-invoice.md)
 |**Receipt**, voucher, or single-page hotel receipt. |You want to extract key information such as merchant name, transaction date, and transaction total.|[**Receipt model**](concept-receipt.md)|
|**Identity document (ID)** like a U.S. driver's license or international passport. |You want to extract key information such as first name, last name, date of birth, address, and signature. | [**Identity document (ID) model**](concept-id-document.md)|
|**Business card** or calling card.|You want to extract key information such as first name, last name, company name, email address, and phone number.|[**Business card model**](concept-business-card.md)|
|**Mixed-type document(s)** with structured, semi-structured, and/or unstructured elements. | You want to extract key-value pairs, selection marks, tables, signature fields, and selected regions not extracted by prebuilt or general document models.| [**Custom model**](concept-custom.md)|

>[!Tip]
>
> * If you're still unsure which pretrained model to use, try the **General Document model** to extract key-value pairs.
> * The General Document model is powered by the Read OCR engine to detect text lines, words, locations, and languages.
> * General document also extracts the same data as the Layout model (pages, tables, styles).

## Custom extraction models

| Training set | Example documents | Your best solution |
| -----------------|--------------|-------------------|
|**Structured, consistent, documents with a static layout**. |Structured forms such as questionnaires or applications. | [**Custom template model**](./concept-custom-template.md)|
|**Structured, semi-structured, and unstructured documents**.|&#9679; Structured &rightarrow; surveys</br>&#9679; Semi-structured &rightarrow; invoices</br>&#9679; Unstructured &rightarrow; letters| [**Custom neural model**](concept-custom-neural.md)|
|**A collection of several models each trained on similar-type documents.** |&#9679; Supply purchase orders</br>&#9679; Equipment purchase orders</br>&#9679; Furniture purchase orders</br> **All composed into a single model**.| [**Composed custom model**](concept-composed-models.md)|

## Next steps

* [Learn how to process your own forms and documents](quickstarts/try-document-intelligence-studio.md) with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)
