---
title: Get started with synchronous document translation
description: "How to translate documents synchronously using the REST API"
#services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: quickstart
ms.date: 01/23/2024
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD049 -->

# Synchronous document translation REST API guide

Reference</br>
Service: **Azure AI Document Translation**</br>
API Version: **v1.1**</br>

Synchronously translate a single document.

## Request URL

Send a `POST` request to"

```http
https://api.cognitive.microsofttranslator.com/translator/document:translate?api-version=2023-11-01-preview

```

## Request headers

To call the synchronous document translation feature via the REST API, you need to include the following headers with each request. 

Header|Value| Condition  |
|--- |:--- |:---|
|**Ocp-Apim-Subscription-Key** |Your Translator service key from the Azure portal.|&bullet; ***Required***|
|**Ocp-Apim-Subscription-Region**|The region where your resource was created. |&bullet; ***Required*** when using an Azure AI multi-service or regional (geographic) resource like **West US**.</br>&bullet; ***Optional*** when using a single-service global Translator Resource.

## Request parameters

Query string parameters:

### Required parameters

|Query parameter | Description |
| --- | --- |
|**api-version** | _Required parameter_.<\br>Version of the API requested by the client. Current value is `2023-11-01-preview`. |
|**targetLanguage**|_Required parameter_.<\br>Specifies the language of the output document. The target language must be one of the supported languages included in the translation scope.|

### Optional parameters

|Query parameter | Description |
| --- | --- |
|**sourceLanguage**|Specifies the language of the input document. If the `sourceLanguage` parameter isn't specified, automatic language detection is applied to determine the source language.|

## Request body

The body of the request is a JSON array. Each array element is a JSON object with a string property

## Response body

If the request is successful, then the response body contains translated document with same document format provided for translation.
