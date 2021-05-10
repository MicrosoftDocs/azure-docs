---
title: "Quickstart: Form Recognizer client library or REST API"
titleSuffix: Azure Cognitive Services
description: Use the Form Recognizer client library or REST API to create a forms processing app that extracts key/value pairs and table data from your custom documents.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: quickstart
ms.date: 04/14/2021
ms.author: lajanuar
zone_pivot_groups: programming-languages-set-formre

ms.custom: "devx-track-js, devx-track-csharp, cog-serv-seo-aug-2020"
keywords: forms processing, automated data processing
---

# Quickstart: Use the Form Recognizer client library or REST API

Get started with the Form Recognizer using the development language of your choice. Azure Form Recognizer is a cognitive service that lets you build automated data processing software using machine learning technology. Identify and extract text, key/value pairs, selection marks, table data and more from your form documents&mdash;the service outputs structured data that includes the relationships in the original file. You can use Form Recognizer via the REST API or SDK. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.

You'll use the following APIs to extract structured data from forms and documents:

|Name |Description |
|---|---|
| **Analyze layout** | Analyze a document passed in as a stream to extract text, selection marks, tables, and structure from the document |
| **Analyze receipts** | Analyze a receipt document to extract key information, and other receipt text.|
| **Analyze business cards** | Analyze a business card to extract key information and text.|
| **Analyze invoices** | Analyze an invoice to extract key information, tables, and other invoice text.|
| **Analyze identity documents** | Analyze an identity documents to extract key information, and other identification card text.|
| **Train a custom model**| Train a new model to analyze your forms by using five forms of the same type. Set the _useLabelFile_ parameter to `true` to train with manually labeled data. |
| **Analyze forms with a custom model**|Analyze a form passed in as a stream to extract text, key/value pairs, and tables from the form with your custom model.  |
|**Manage custom models**| You can check the number of custom models in your Form Recognizer account, get a specific model using its ID, and delete a model from your accounty.|

::: zone pivot="programming-language-csharp"

[!INCLUDE [C# SDK quickstart](../includes/quickstarts/csharp-sdk.md)]

::: zone-end

::: zone pivot="programming-language-java"

[!INCLUDE [Java SDK quickstart](../includes/quickstarts/java-sdk.md)]

::: zone-end

::: zone pivot="programming-language-javascript"

[!INCLUDE [NodeJS SDK quickstart](../includes/quickstarts/javascript-sdk.md)]

::: zone-end

::: zone pivot="programming-language-python"

[!INCLUDE [Python SDK quickstart](../includes/quickstarts/python-sdk.md)]

::: zone-end

::: zone pivot="programming-language-rest-api"

[!INCLUDE [REST API quickstart](../includes/quickstarts/rest-api.md)]

::: zone-end
