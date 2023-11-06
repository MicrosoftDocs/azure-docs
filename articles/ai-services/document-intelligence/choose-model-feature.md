---
title: Choose the best Document Intelligence (formerly Form Recognizer) model for your applications and workflows
titleSuffix: Azure AI services
description: Choose the best Document Intelligence model to meet your needs.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: overview
ms.date: 11/15/2023
ms.author: lajanuar
---


# Which model should I choose?

 ::: moniker range="doc-intel-4.0.0"
[!INCLUDE [preview-version-notice](includes/preview-notice.md)]

**This content applies to:**![checkmark](media/yes-icon.png) **v4.0 (preview)** | **Previous versions:** ![blue-checkmark](media/blue-yes-icon.png) [**v3.1 (GA)**](?view=doc-intel-3.1.0&preserve-view=tru) ![blue-checkmark](media/blue-yes-icon.png) [**v3.0 (GA)**](?view=doc-intel-3.0.0&preserve-view=tru)
::: moniker-end

::: moniker range="doc-intel-3.1.0"
**This content applies to:** ![checkmark](media/yes-icon.png) **v3.1 (GA)** | **Latest version:** ![purple-checkmark](media/purple-yes-icon.png) [**v4.0 (preview)**](?view=doc-intel-4.0.0&preserve-view=true) | **Previous versions:** ![blue-checkmark](media/blue-yes-icon.png) [**v3.0**](?view=doc-intel-3.0.0&preserve-view=true)
::: moniker-end

::: moniker range="doc-intel-3.0.0"
**This content applies to:** ![checkmark](media/yes-icon.png) **v3.0 (GA)** | **Latest versions:** ![purple-checkmark](media/purple-yes-icon.png) [**v4.0 (preview)**](?view=doc-intel-4.0.0&preserve-view=true) ![purple-checkmark](media/purple-yes-icon.png) [**v3.1 (preview)**](?view=doc-intel-3.1.0&preserve-view=true)
::: moniker-end

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
|**US W-2 tax form**|You want to extract key information such as salary, wages, and taxes withheld.|[**US tax W-2 model**](concept-tax-document.md)|
|**US Tax 1098 form**|You want to extract mortgage interest details such as principal, points, and tax.|[**US tax 1098 model**](concept-tax-document.md)|
|**US Tax 1098-E form**|You want to extract student loan interest details such as lender and interest amount.|[**US tax 1098-E model**](concept-tax-document.md)|
|**US Tax 1098T form**|You want to extract qualified tuition details such as scholarship adjustments, student status, and lender information.|[**US tax 1098-T model**](concept-tax-document.md)|
|**Contract** (legal agreement between parties).|You want to extract contract agreement details such as parties, dates, and intervals.|[**Contract model**](concept-contract.md)|
|**Health insurance card** or health insurance ID.| You want to extract key information such as insurer, member ID, prescription coverage, and group number.|[**Health insurance card model**](./concept-health-insurance-card.md)|
|**Invoice** or billing statement.|You want to extract key information such as customer name, billing address, and amount due.|[**Invoice model**](concept-invoice.md)
 |**Receipt**, voucher, or single-page hotel receipt. |You want to extract key information such as merchant name, transaction date, and transaction total.|[**Receipt model**](concept-receipt.md)|
|**Identity document (ID)** like a U.S. driver's license or international passport. |You want to extract key information such as first name, last name, date of birth, address, and signature. | [**Identity document (ID) model**](concept-id-document.md)|
|**Business card** or calling card.|You want to extract key information such as first name, last name, company name, email address, and phone number.|[**Business card model**](concept-business-card.md)|
|**Mixed-type document(s)** with structured, semi-structured, and/or unstructured elements. | You want to extract key-value pairs, selection marks, tables, signature fields, and selected regions not extracted by prebuilt or general document models.| [**Custom model**](concept-custom.md)|

>[!Tip]
>
> * If you're still unsure which pretrained model to use, try the **layout model** with the optional query string parameter **`features=keyValuePairs`** enabled.
> * The layout model is powered by the Read OCR engine to detect pages, tables, styles, text, lines, words, locations, and languages.

## Custom extraction models

| Training set | Example documents | Your best solution |
| -----------------|--------------|-------------------|
|**Structured, consistent, documents with a static layout**. |Structured forms such as questionnaires or applications. | [**Custom template model**](./concept-custom-template.md)|
|**Structured, semi-structured, and unstructured documents**.|&#9679; Structured &rightarrow; surveys</br>&#9679; Semi-structured &rightarrow; invoices</br>&#9679; Unstructured &rightarrow; letters| [**Custom neural model**](concept-custom-neural.md)|
|**A collection of several models each trained on similar-type documents.** |&#9679; Supply purchase orders</br>&#9679; Equipment purchase orders</br>&#9679; Furniture purchase orders</br> **All composed into a single model**.| [**Composed custom model**](concept-composed-models.md)|

## Next steps

* [Learn how to process your own forms and documents](quickstarts/try-document-intelligence-studio.md) with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)
