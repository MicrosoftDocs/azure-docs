---
title: What is Azure Text Translation?
titlesuffix: Azure AI services
description: Integrate the Text Translation API into your applications, websites, tools, and other solutions to provide multi-language user experiences.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: overview
ms.date: 07/18/2023
ms.author: lajanuar
---

# What is Azure Text Translation?

 Azure Text Translation is a cloud-based REST API feature of the Translator service that uses neural machine translation technology to enable quick and accurate source-to-target text translation in real time across all [supported languages](language-support.md). In this overview, you learn how the Text Translation REST APIs enable you to build intelligent solutions for your applications and workflows.

Text translation documentation contains the following article types:

* [**Quickstarts**](quickstart-text-rest-api.md). Getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](create-translator-resource.md). Instructions for accessing and using the service in more specific or customized ways.
* [**Reference articles**](reference/v3-0-reference.md). REST API documentation and programming language-based content.

## Text translation features

 Text Translation supports the following methods:

* [**Languages**](reference/v3-0-languages.md). Returns a list of languages supported by **Translate**, **Transliterate**, and **Dictionary Lookup** operations. This request doesn't require authentication; just copy and paste the following GET request into Postman or your favorite API tool or browser:

    ```http
    https://api.cognitive.microsofttranslator.com/languages?api-version=3.0
    ```

* [**Translate**](reference/v3-0-translate.md#translate-to-multiple-languages). Renders single source-language text to multiple target-language texts with a single request.

* [**Transliterate**](reference/v3-0-transliterate.md). Converts characters or letters of a source language to the corresponding characters or letters of a target language.

* [**Detect**](reference/v3-0-detect.md). Returns the source code language code and a boolean variable denoting whether the detected language is supported for text translation and transliteration.

    > [!NOTE]
    > You can **Translate, Transliterate, and Detect** text with [a single REST API call](reference/v3-0-translate.md#translate-a-single-input-with-language-autodetection) .

* [**Dictionary lookup**](reference/v3-0-dictionary-lookup.md). Returns equivalent words for the source term in the target language.
* [**Dictionary example**](reference/v3-0-dictionary-examples.md) Returns grammatical structure and context examples for the source term and target term pair.

## Text translation deployment options

Add Text Translation to your projects and applications using the following resources:

* Access the cloud-based Translator service via the [**REST API**](reference/rest-api-guide.md), available in Azure.

* Use the REST API [translate request](containers/translator-container-supported-parameters.md) with the [**Text translation Docker container**](containers/translator-how-to-install-container.md).

    > [!IMPORTANT]
    >
    > * To use the Translator container you must complete and submit the [**Azure AI services application for Gated Services**](https://aka.ms/csgate-translator) online request form and have it approved to acquire access to the container.
    >
    > * The [**Translator container image**](https://mcr.microsoft.com/product/azure-cognitive-services/translator/text-translation/about) supports limited features compared to cloud offerings.
    >

## Get started with Text Translation

Ready to begin?

* [**Create a Translator resource**](create-translator-resource.md "Go to the Azure portal.") in the Azure portal.

* [**Get your access keys and API endpoint**](create-translator-resource.md#authentication-keys-and-endpoint-url). An endpoint URL and read-only key are required for authentication.

* Explore our [**Quickstart**](quickstart-text-rest-api.md "Learn to use Translator via REST and a preferred programming language.") and view use cases and code samples for the following programming languages: 
  * [**C#/.NET**](quickstart-text-rest-api.md?tabs=csharp)
  * [**Go**](quickstart-text-rest-api.md?tabs=go)
  * [**Java**](quickstart-text-rest-api.md?tabs=java)
  * [**JavaScript/Node.js**](quickstart-text-rest-api.md?tabs=nodejs)
  * [**Python**](quickstart-text-rest-api.md?tabs=python)

## Next steps

Dive deeper into the Text Translation REST API:

> [!div class="nextstepaction"]
> [See the REST API reference](./reference/v3-0-reference.md)
