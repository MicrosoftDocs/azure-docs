---
title: What is the Microsoft Azure Cognitive Services Translator?
titlesuffix: Azure Cognitive Services
description: Integrate Translator into your applications, websites, tools, and other solutions to provide multi-language user experiences.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.topic: overview
ms.subservice: translator-text
ms.date: 08/10/2021
ms.author: lajanuar
ms.custom: cog-serv-seo-aug-2020
keywords: translator, text translation, machine translation, translation service, custom translator
---
# What is Translator?

 Translator is a cloud-based neural machine translation service that is part of the [Azure Cognitive Services](../what-are-cognitive-service.md) family of REST APIs.  Translator can be used with any operating system and powers many Microsoft products and services used by thousands of businesses worldwide to perform language translation and other language-related operations. In this overview, you'll learn how Translator can enable you to build intelligent, multi-language solutions for your applications across all [supported languages](./language-support.md).

Translator documentation contains the following article types:

* [**Quickstarts**](quickstart-translator.md). Getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](translator-how-to-signup.md). Instructions for accessing and using the service in more specific or customized ways.
* [**Reference articles**](reference/v3-0-reference.md). REST API documentation and programming language-based content.

## Translator features and development options

The following features are supported by the Translator service. Use the links in this table to learn more about each feature and browse the API references.

| Feature | Description | Development options |
|----------|-------------|--------------------------|
| [**Text Translation**](text-translation-overview.md) | Execute text translation between supported source and target languages in real time. | <ul><li>[**REST API**](reference/rest-api-guide.md) </li><li>[Text translation Docker container](/containers/translator-how-to-install-container)—currently in gated preview.</li></ul> |
| [**Document Translation**](document-translation/overview.md) | Translate batch and complex files while preserving the structure and format of the original documents. | <ul><li>[**REST API**](document-translation/reference/rest-api-guide.md)</li><li>[**Client-library SDK**](document-translation/client-sdks.md)</li></ul> |
| [**Custom Translator**](custom-translator/overview.md) | Build customized models to translate domain- and industry-specific language, terminology, and style. | <ul><li>[**Custom Translator portal**](https://portal.customtranslator.azure.ai/)</li></ul> |

## Try the Translator service for free

First, you'll need a Microsoft account; if you do not one, you can sign up for free at the [**Microsoft account portal**](https://account.microsoft.com/account).  Select **Create a Microsoft account** and follow the steps to create and verify your new account.

Next, you'll need to  have an Azure account—navigate to the [**Azure sign-up page**](https://azure.microsoft.com/free/ai/), select the **Start free** button, and create a new Azure account using your Microsoft account credentials.

Now, you're ready to get started! [**Create a Translator service**](translator-how-to-signup.md "Go to the Azure portal."), [**get your access keys and API endpoint**](translator-how-to-signup.md#authentication-keys-and-endpoint-url "An endpoint URL and read-only key are required for authentication."), and try our [**quickstart**](quickstart-translator.md "Learn to use Translator via REST.").

## Next steps

* Learn more about the following features:
  * [**Text Translation**](text-translation-overview.md)
  * [**Document Translation**](document-translation/overview.md)
  * [**Custom Translator**](custom-translator/overview.md)
* Review [**Translator pricing**](https://azure.microsoft.com/pricing/details/cognitive-services/translator-text-api/).
