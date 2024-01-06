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
ms.date: 11/21/2023
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

Query fields and key value pairs perform very similar functions, there are a few distinctions to be aware of when deciding which feature to choose.

* Key value pairs are only available with layout and invoice models. I f you are looking to extend the schema for anot of the other supported prebuuilt models, use query fields.

* You do not know the specific fields to be extracted, or the number of fields is very large. This would be a scenario where you use the key value pairs feature.

* Key value pairs extracts the keys and values as they exist in the form or document. This will require you to deal with any key variations. For example keys `First Name` or `Given Name`. With query fields, you define the key and the model only extracts the appriate value.

* Use query fields when the value you require may not be described as a key value pair in the document. For example the agreement date of a contract. 

For query field extraction, specify the fields you want to extract and Document Intelligence analyzes the document accordingly. Here's an example:

* If you're processing a contract in the [Document Intelligence Studio](https://documentintelligence.appliedai.azure.com/studio/layout), use the `2023-10-31-preview` or later API version:

    :::image type="content" source="media/studio/query-fields.png" alt-text="Screenshot of the query fields button in Document Intelligence Studio.":::

* You can pass a list of field labels like `Party1`, `Party2`, `TermsOfUse`, `PaymentTerms`, `PaymentDate`, and `TermEndDate`" as part of the analyze document request.

   :::image type="content" source="media/studio/query-field-select.png" alt-text="Screenshot of query fields selection window in Document Intelligence Studio.":::

* In addition to the query fields, the response includes the model output. For a list of features or schema extracted by each model, see [model analysis features](concept-model-overview.md#analysis-features).

## Query fields REST API request**

Use the query fields feature with the [general document model](concept-general-document.md), to add fields to the extraction process without having to train a custom model:

```http
POST https://{endpoint}/documentintelligence/documentModels/prebuilt-layout:analyze?api-version=2023-10-31-preview&features=queryFields&queryFields=Terms,PaymentDate HTTP/1.1
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
