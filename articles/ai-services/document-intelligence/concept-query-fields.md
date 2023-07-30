---
title: Query field extraction - Document Intelligence
titleSuffix: Azure AI services
description: Use Document Intelligence to extract query field data.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: nitinme
monikerRange: '>=doc-intel-3.0.0'
---

<!-- markdownlint-disable MD033 -->

# Document Intelligence query field extraction

[!INCLUDE [applies to v3.1 and v3.0](includes/applies-to-v3-1-v3-0.md)]

Document Intelligence now supports query field extractions using Azure OpenAI capabilities. With query field extraction, you can add fields to the extraction process using a query request without the need for added training.

> [!NOTE]
>
> Document Intelligence Studio query field extraction is currently available with the general document model for the `2023-07-31` (GA) release.

## Select query fields

For query field extraction, specify the fields you want to extract and Document Intelligence analyzes the document accordingly. Here's an example:

* If you're processing a contract in the Document Intelligence Studio, you can pass a list of field labels like `Party1`, `Party2`, `TermsOfUse`, `PaymentTerms`, `PaymentDate`, and `TermEndDate`" as part of the analyze document request.

   :::image type="content" source="media/studio/query-field-select.png" alt-text="Screenshot of query fields selection window in Document Intelligence Studio.":::

* Document Intelligence utilizes the capabilities of both [**Azure OpenAI Service**](../../ai-services/openai/overview.md) and extraction models to analyze and extract the field data and return the values in a structured JSON output.

* In addition to the query fields, the response includes text, tables, selection marks, general document key-value pairs, and other relevant data.

## Next steps

> [!div class="nextstepaction"]
> [Try the Document Intelligence Studio quickstart](./quickstarts/try-document-intelligence-studio.md)
