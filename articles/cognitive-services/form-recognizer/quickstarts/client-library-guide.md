---
title: Client library and REST API guide
titleSuffix: Azure Cognitive Services
description: Choose your programming language or the REST API and get started with a select feature
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: reference
ms.date: 05/10/2021
ms.author: lajanuar
---


# Client library and REST API guide

## Choose your programming language SDK or the REST API

Use the following APIs to extract structured data from forms and documents:

<!-- markdownlint-disable MD033 -->

|Name |Description |
|---|---|
| **[Analyze layout](#analyze-layout)** | Analyze a document passed in as a stream to extract text, selection marks, tables, and structure from the document |
| **[Analyze receipts](#analyze-receipts)** | Analyze a receipt document to extract key information, and other receipt text.|
| **[Analyze business cards](#analyze-business-cards)** | Analyze a business card to extract key information and text.|
| **[Analyze invoices](#analyze-invoices)** | Analyze an invoice to extract key information, tables, and other invoice text.|
| **[Analyze identity documents](#analyze-identity-documents)** | Analyze an identity documents to extract key information, and other identification card text.|
| **[Train a custom model](#train-a-custom-model)**| Train a new model to analyze your forms by using five forms of the same type. Set the _useLabelFile_ parameter to `true` to train with manually labeled data. |
| **[Analyze forms with a custom model](#analyze-forms-with-a-custom-model)**|Analyze a form passed in as a stream to extract text, key/value pairs, and tables from the form with your custom model.  |
|**[Manage custom models](#manage-custom-models)**| You can check the number of custom models in your Form Recognizer account, get a specific model using its ID, and delete a model from your account.|

## Analyze layout

|Language|Quickstart|
|-----------|------------------|
|[**C#**](csharp-sdk.md#analyze-layout)|  <a href="csharp-sdk.md#analyze-layout"><img src="../media/logos/logo_NET.svg" alt="c-sharp logo" width="32px" height="32px"></a>|
|[**Java**](java-sdk.md#analyze-layout) |  <a href="java-sdk.md#analyze-layout"><img src="../media/logos/logo_java.svg" alt="java logo"  width="32px" height="32px"></a>  |
|[**JavaScript**](javascript-sdk.md#analyze-layout) |<a href="javascript-sdk.md#analyze-layout"><img src=" ../media/logos/logo_js.svg" alt="javascript logo"  width="32px" height="32px"></a> |
|[**Python**](python-sdk.md#analyze-layout) | <a href="python-sdk.md#analyze-layout"><img src="../media/logos/logo_python.svg"  alt="python logo"  width="32px" height="32px"></a>  |
|[**REST API**](rest-api.md#analyze-layout) |<a href="rest-api.md#analyze-layout"><img src=" ../media/logos/logo_REST.svg"  alt="rest logo"  width="32px" height="32px"></a>  |

## Analyze receipts

|Language|Quickstart|
|-----------|------------------|
|[**C#**](csharp-sdk.md#analyze-receipts)|  <a href="csharp-sdk.md#analyze-receipts"><img src="../media/logos/logo_NET.svg" alt="c-sharp logo" width="32px" height="32px"></a>|
|[**Java**](java-sdk.md#analyze-receipts) |  <a href="java-sdk.md#analyze-receipts"><img src="../media/logos/logo_java.svg" alt="java logo"  width="32px" height="32px"></a>  |
|[**JavaScript**](javascript-sdk.md#analyze-receipts) |<a href="javascript-sdk.md#analyze-receipts"><img src=" ../media/logos/logo_js.svg" alt="javascript logo"  width="32px" height="32px"></a> |
|[**Python**](python-sdk.md#analyze-receipts) | <a href="python-sdk.md#analyze-receipts"><img src="../media/logos/logo_python.svg"  alt="python logo"  width="32px" height="32px"></a>  |
|[**REST API**](rest-api.md#analyze-receipts) |<a href="rest-api.md#analyze-receipts"><img src=" ../media/logos/logo_REST.svg"  alt="rest logo"  width="32px" height="32px"></a>  |

## Analyze business cards

|Language|Quickstart|
|-----------|------------------|
|[**C#**](csharp-sdk.md#analyze-business-cards)|  <a href="csharp-sdk.md#analyze-business-cards"><img src="../media/logos/logo_NET.svg" alt="c-sharp logo" width="32px" height="32px"></a>|
|[**Java**](java-sdk.md#analyze-business-cards) |  <a href="java-sdk.md#analyze-business-cards"><img src="../media/logos/logo_java.svg" alt="java logo"  width="32px" height="32px"></a>  |
|[**JavaScript**](javascript-sdk.md#analyze-business-cards) |<a href="javascript-sdk.md#analyze-business-cards"><img src=" ../media/logos/logo_js.svg" alt="javascript logo"  width="32px" height="32px"></a> |
|[**Python**](python-sdk.md#analyze-business-cards) | <a href="python-sdk.md#analyze-business-cards"><img src="../media/logos/logo_python.svg"  alt="python logo"  width="32px" height="32px"></a>  |
|[**REST API**](rest-api.md#analyze-business-cards) |<a href="rest-api.md#analyze-business-cards"><img src=" ../media/logos/logo_REST.svg"  alt="rest logo"  width="32px" height="32px"></a>  |

## Analyze invoices

|Language|Quickstart|
|-----------|------------------|
|[**C#**](csharp-sdk.md#analyze-invoices)|  <a href="csharp-sdk.md#analyze-invoices"><img src="../media/logos/logo_NET.svg" alt="c-sharp logo" width="32px" height="32px"></a>|
|[**Java**](java-sdk.md#analyze-invoices) |  <a href="java-sdk.md#analyze-invoices"><img src="../media/logos/logo_java.svg" alt="java logo"  width="32px" height="32px"></a>  |
|[**JavaScript**](javascript-sdk.md#analyze-invoices) |<a href="javascript-sdk.md#analyze-invoices"><img src=" ../media/logos/logo_js.svg" alt="javascript logo"  width="32px" height="32px"></a> |
|[**Python**](python-sdk.md#analyze-invoices) | <a href="python-sdk.md#analyze-invoices"><img src="../media/logos/logo_python.svg"  alt="python logo"  width="32px" height="32px"></a>  |
|[**REST API**](rest-api.md#analyze-invoices) |<a href="rest-api.md#analyze-invoices"><img src=" ../media/logos/logo_REST.svg"  alt="rest logo"  width="32px" height="32px"></a>  |

## Analyze identity documents

|Language|Quickstart|
|-----------|------------------|
|[**C#**](csharp-sdk.md#analyze-identity-documents)|  <a href="csharp-sdk.md#analyze-identity-documents"><img src="../media/logos/logo_NET.svg" alt="c-sharp logo" width="32px" height="32px"></a>|
|[**Java**](java-sdk.md#analyze-identity-documents) |  <a href="java-sdk.md#analyze-identity-documents"><img src="../media/logos/logo_java.svg" alt="java logo"  width="32px" height="32px"></a>  |
|[**JavaScript**](javascript-sdk.md#analyze-identity-documents) |<a href="javascript-sdk.md#analyze-identity-documents"><img src=" ../media/logos/logo_js.svg" alt="javascript logo"  width="32px" height="32px"></a> |
|[**Python**](python-sdk.md#analyze-identity-documents) | <a href="python-sdk.md#analyze-identity-documents"><img src="../media/logos/logo_python.svg"  alt="python logo"  width="32px" height="32px"></a>  |
|[**REST API**](rest-api.md#analyze-identity-documents) |<a href="rest-api.md#analyze-identity-documents"><img src=" ../media/logos/logo_REST.svg"  alt="rest logo"  width="32px" height="32px"></a>  |

## Train a custom model

|Language|Quickstart|
|-----------|------------------|
|[**C#**](csharp-sdk.md#train-a-custom-model)|  <a href="csharp-sdk.md#train-a-custom-model"><img src="../media/logos/logo_NET.svg" alt="c-sharp logo" width="32px" height="32px"></a>|
|[**Java**](java-sdk.md#train-a-custom-model) |  <a href="java-sdk.md#train-a-custom-model"><img src="../media/logos/logo_java.svg" alt="java logo"  width="32px" height="32px"></a>  |
|[**JavaScript**](javascript-sdk.md#train-a-custom-model) |<a href="javascript-sdk.md#train-a-custom-model"><img src=" ../media/logos/logo_js.svg" alt="javascript logo"  width="32px" height="32px"></a> |
|[**Python**](python-sdk.md#train-a-custom-model) | <a href="python-sdk.md#train-a-custom-model"><img src="../media/logos/logo_python.svg"  alt="python logo"  width="32px" height="32px"></a>  |
|[**REST API**](rest-api.md#train-a-custom-model) |<a href="rest-api.md#train-a-custom-model"><img src=" ../media/logos/logo_REST.svg"  alt="rest logo"  width="32px" height="32px"></a>  |

## Analyze forms with a custom model

|Language|Quickstart|
|-----------|------------------|
|[**C#**](csharp-sdk.md#analyze-forms-with-a-custom-model)|  <a href="csharp-sdk.md#analyze-forms-with-a-custom-model"><img src="../media/logos/logo_NET.svg" alt="c-sharp logo" width="32px" height="32px"></a>|
|[**Java**](java-sdk.md#analyze-forms-with-a-custom-model) |  <a href="java-sdk.md#analyze-forms-with-a-custom-model"><img src="../media/logos/logo_java.svg" alt="java logo"  width="32px" height="32px"></a>  |
|[**JavaScript**](javascript-sdk.md#analyze-forms-with-a-custom-model) |<a href="javascript-sdk.md#analyze-forms-with-a-custom-model"><img src=" ../media/logos/logo_js.svg" alt="javascript logo"  width="32px" height="32px"></a> |
|[**Python**](python-sdk.md#analyze-forms-with-a-custom-model) | <a href="python-sdk.md#analyze-forms-with-a-custom-model"><img src="../media/logos/logo_python.svg"  alt="python logo"  width="32px" height="32px"></a>  |
|[**REST API**](rest-api.md#analyze-forms-with-a-custom-model) |<a href="rest-api.md#analyze-forms-with-a-custom-model"><img src=" ../media/logos/logo_REST.svg"  alt="rest logo"  width="32px" height="32px"></a>  |

## Manage custom models

|Language|Quickstart|
|-----------|------------------|
|[**C#**](csharp-sdk.md#manage-custom-models)|  <a href="csharp-sdk.md#manage-custom-models"><img src="../media/logos/logo_NET.svg" alt="c-sharp logo" width="32px" height="32px"></a>|
|[**Java**](java-sdk.md#manage-custom-models) |  <a href="java-sdk.md#manage-custom-models"><img src="../media/logos/logo_java.svg" alt="java logo"  width="32px" height="32px"></a>  |
|[**JavaScript**](javascript-sdk.md#manage-custom-models) |<a href="javascript-sdk.md#manage-custom-models"><img src=" ../media/logos/logo_js.svg" alt="javascript logo"  width="32px" height="32px"></a> |
|[**Python**](python-sdk.md#manage-custom-models) | <a href="python-sdk.md#manage-custom-models"><img src="../media/logos/logo_python.svg"  alt="python logo"  width="32px" height="32px"></a>  |
|[**REST API**](rest-api.md#manage-custom-models) |<a href="rest-api.md#manage-custom-models"><img src=" ../media/logos/logo_REST.svg"  alt="rest logo"  width="32px" height="32px"></a>  |

> [!div class="nextstepaction"]
> [Browse our Form Recognizer API reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeBusinessCardAsync)
