---
title: Query field extraction - Form Recognizer
titleSuffix: Azure Applied AI Services
description: Use Form Recognizer to extract query field data.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 04/25/2023
ms.author: netahw
monikerRange: 'form-recog-3.0.0'
recommendations: false
---
<!-- markdownlint-disable MD033 -->

# Azure Form Recognizer query field extraction (preview)

**This article applies to:** ![Form Recognizer checkmark](media/yes-icon.png) **The latest [public preview SDK](sdk-preview.md) supported by Form Recognizer REST API version [2023-02-28-preview](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-02-28-preview/operations/AnalyzeDocument)**.

> [!IMPORTANT]
>
> * The Form Recognizer Studio query fields extraction feature is currently in gated preview. Features, approaches and processes may change, prior to General Availability (GA), based on user feedback.
> * Complete and submit the [**Form Recognizer private preview request form**](https://aka.ms/form-recognizer/preview/survey) to request access.

Form Recognizer now supports query field extractions using Azure OpenAI capabilities. With query field extraction, you can add fields to the extraction process using a query request without the need for added training.

> [!NOTE]
>
> Form Recognizer Studio query field extraction is currently available with the general document model for the `2023-02-28-preview` release.

## Select query fields

For query field extraction, specify the fields you want to extract and Form Recognizer analyzes the document accordingly. Here's an example:

* If you're processing a contract in the Form Recognizer Studio, you can pass a list of field labels like `Party1`, `Party2`, `TermsOfUse`, `PaymentTerms`, `PaymentDate`, and `TermEndDate`" as part of the analyze document request.

   :::image type="content" source="media/studio/query-field-select.png" alt-text="Screenshot of query fields selection window in Form Recognizer Studio.":::

* Form Recognizer utilizes the capabilities of both [**Azure OpenAI Service**](../../cognitive-services/openai/overview.md) and extraction models to analyze and extract the field data and return the values in a structured JSON output.

* In addition to the query fields, the response includes text, tables, selection marks, general document key-value pairs, and other relevant data.

## Next steps

> [!div class="nextstepaction"]
> [Try the Form Recognizer Studio quickstart](./quickstarts/try-form-recognizer-studio.md)
