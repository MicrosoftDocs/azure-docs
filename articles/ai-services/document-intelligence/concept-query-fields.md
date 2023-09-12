---
title: Query field extraction - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Use Document Intelligence to extract query field data.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: nitinme
monikerRange: 'doc-intel-3.0.0'
---

<!-- markdownlint-disable MD033 -->

# Document Intelligence query field extraction

Document Intelligence now supports query field extractions using Azure OpenAI capabilities. With query field extraction, you can add fields to the extraction process using a query request without the need for added training.

> [!NOTE]
>
> Document Intelligence Studio query field extraction is currently available with the general document model starting with the `2023-02-28-preview`  and later releases.

## Select query fields

For query field extraction, specify the fields you want to extract and Document Intelligence analyzes the document accordingly. Here's an example:

* If you're processing a contract in the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/document), use the `2023-07-31` version:

    :::image type="content" source="media/studio/query-fields.png" alt-text="Screenshot of the query fields button in Document Intelligence Studio.":::

* You can pass a list of field labels like `Party1`, `Party2`, `TermsOfUse`, `PaymentTerms`, `PaymentDate`, and `TermEndDate`" as part of the analyze document request.

   :::image type="content" source="media/studio/query-field-select.png" alt-text="Screenshot of query fields selection window in Document Intelligence Studio.":::

* Document Intelligence utilizes the capabilities of both [**Azure OpenAI Service**](../../ai-services/openai/overview.md) and extraction models to analyze and extract the field data and return the values in a structured JSON output.

* In addition to the query fields, the response includes text, tables, selection marks, general document key-value pairs, and other relevant data.

## Query fields REST API request

Use the query fields feature with the [general document model](concept-general-document.md), to add fields to the extraction process without having to train a custom model:

```http
POST https://{endpoint}/formrecognizer/documentModels/prebuilt-document:analyze?api-version=2023-07-31&queryFields=Party1, Party2, PaymentDate HTTP/1.1
Host: *.cognitiveservices.azure.com
Content-Type: application/json
Ocp-Apim-Subscription-Key:

{
  "urlSource": "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf"
}
``````

## Next steps

> [!div class="nextstepaction"]
> [Try the Document Intelligence Studio quickstart](./quickstarts/try-document-intelligence-studio.md)
