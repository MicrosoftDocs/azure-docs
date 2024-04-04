---
title: Query field extraction - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Use Document Intelligence query fields to extend model schema.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 01/19/2024
ms.author: nitinme
monikerRange: 'doc-intel-4.0.0'
---

<!-- markdownlint-disable MD033 -->

# Document Intelligence query field extraction

**Document Intelligence now supports query field to extend the schema of any prebuilt model to extract the specific fields you need. Query fields can also be added to layout to extract fields in addition to structure from forms or documents.
> [!NOTE]
>
> Document Intelligence Studio query field extraction is currently available with layout and prebuilt models, excluding the UX.Tax prebuilt models.

## Query fields or key value pairs

Query fields and key value pairs perform similar functions, there are a few distinctions to be aware of when deciding which feature to choose.

* Key value pairs are only available with layout and invoice models. If you're looking to extend the schema for a prebuilt model, use query fields.

* You don't know the specific fields to be extracted, or the number of fields is large (greater than 20), key value pairs might be a better solution.

* Key-value pairs extract the keys and values as they exist in the form or document, you need to plan for any key variations. For example, keys `First Name` or `Given Name`. With query fields, you define the key and the model only extracts the corresponding value.

* Use query fields when the value you require can't be described as a key value pair in the document. For example, the agreement date of a contract. 

For query field extraction, specify the fields you want to extract and Document Intelligence analyzes the document accordingly. Here's an example:

* If you're processing a contract in the [Document Intelligence Studio](https://documentintelligence.ai.azure.com/studio/layout), use the `2024-02-29-preview`, `2023-10-31-preview`, or later API version:

    :::image type="content" source="media/studio/query-fields.png" alt-text="Screenshot of the query fields button in Document Intelligence Studio.":::

* You can pass a list of field labels like `Party1`, `Party2`, `TermsOfUse`, `PaymentTerms`, `PaymentDate`, and `TermEndDate`" as part of the `AnalyzeDocument` request.

   :::image type="content" source="media/studio/query-field-select.png" alt-text="Screenshot of query fields selection window in Document Intelligence Studio.":::

* In addition to the query fields, the response includes the model output. For a list of features or schema extracted by each model, see [model analysis features](concept-model-overview.md#model-analysis-features).


## Query fields REST API request**

Use the query fields feature with the [general document model](concept-general-document.md), and add fields to the extraction process without having to train a custom model:

```http
POST https://{endpoint}/documentintelligence/documentModels/prebuilt-layout:analyze?api-version=2024-02-29-preview&features=queryFields&queryFields=Terms,PaymentDate HTTP/1.1
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

> [!div class="nextstepaction"]
> [Learn about other add-on capabilities](concept-add-on-capabilities.md)
