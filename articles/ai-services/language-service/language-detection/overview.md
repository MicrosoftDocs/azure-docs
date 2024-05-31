---
title: What is language detection in Azure AI Language?
titleSuffix: Azure AI services
description: An overview of language detection in Azure AI services, which helps you detect the language that text is written in by returning language codes.
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: overview
ms.date: 12/19/2023
ms.author: jboback
ms.custom: language-service-language-detection
---

# What is language detection in Azure AI Language?

Language detection is one of the features offered by [Azure AI Language](../overview.md), a collection of machine learning and AI algorithms in the cloud for developing intelligent applications that involve written language. Language detection is able to detect more than 100 languages in their primary script. In addition, it offers [script detection](./how-to/call-api.md#script-name-and-script-code) to detect multiple scripts per language according to the [ISO 15924 standard](https://wikipedia.org/wiki/ISO_15924) for a [select number of languages](./language-support.md#script-detection).

This documentation contains the following types of articles:

* [**Quickstarts**](quickstart.md) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](how-to/call-api.md) contain instructions for using the service in more specific or customized ways.

## Language detection features

* Language detection: Returns one predominant language for each document you submit, along with its ISO 639-1 name, a human-readable name, confidence score, script name and script code according to ISO 15924 standard.

* Script detection: To distinguish between multiple scripts used to write certain languages, such as Kazakh, language detection returns a script name and script code according to the ISO 15924 standard.  

* Ambiguous content handling: To help disambiguate language based on the input, you can specify an ISO 3166-1 alpha-2 country/region code. For example, the word "communication" is common to both English and French. Specifying the origin of the text as France can help the language detection model determine the correct language.

[!INCLUDE [Typical workflow for pre-configured language features](../includes/overview-typical-workflow.md)]


## Get started with language detection

[!INCLUDE [development options](./includes/development-options.md)]

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it's deployed. Read the [transparency note for language detection](/legal/cognitive-services/language-service/transparency-note-language-detection?context=/azure/ai-services/language-service/context/context) to learn about responsible AI use and deployment in your systems. You can also see the following articles for more information:

[!INCLUDE [Responsible AI links](../includes/overview-responsible-ai-links.md)]

## Next steps

There are two ways to get started using the entity linking feature:
* [Language Studio](../language-studio.md), which is a web-based platform that enables you to try several Azure AI Language features without needing to write code.
* The [quickstart article](quickstart.md) for instructions on making requests to the service using the REST API and client library SDK.  
