---
title: What is Azure AI Translator?
titlesuffix: Azure AI services
description: Integrate Translator into your applications, websites, tools, and other solutions for multi-language user experiences.
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: overview
ms.date: 02/12/2024
ms.author: lajanuar
---

# What is Azure AI Translator?

Translator Service is a cloud-based neural machine translation service that is part of the [Azure AI services](../what-are-ai-services.md) family and can be used with any operating system. Translator powers many Microsoft products and services used by thousands of businesses worldwide for language translation and other language-related operations. In this overview, you learn how Translator can enable you to build intelligent, multi-language solutions for your applications across all [supported languages](./language-support.md).

## Translator features and development options

Translator service supports the following features. Use the links in this table to learn more about each feature and browse the API references.

| Feature | Description | Development options |
|----------|-------------|--------------------------|
| [**Text Translation**](text-translation-overview.md) | Execute text translation between supported source and target languages in real time. Create a [dynamic dictionary](dynamic-dictionary.md) and learn how to [prevent translations](prevent-translation.md) using the Translator API. | &bull; [**REST API**](reference/rest-api-guide.md) </br>&bull; [**Text translation container**](containers/translator-how-to-install-container.md)
| [**Asynchronous Batch Document Translation**](document-translation/overview.md) | Translate batch and complex files while preserving the structure and format of the original documents. [Create a glossary](document-translation/how-to-guides/create-use-glossaries.md) to use with document translation. The batch translation process requires an Azure Blob storage account with containers for your source and translated documents.| &bull; [**REST API**](document-translation/reference/rest-api-guide.md)</br>&bull; [**Client-library SDK**](document-translation/quickstarts/asynchronous-sdk.md) |
|[**Synchronous Document translation**](document-translation/reference/synchronous-rest-api-guide.md)| Translate a single document file alone or with a glossary file while preserving the structure and format of the original document. The file translation process doesn't require an Azure Blob storage account. The final response contains the translated document and is returned directly to the calling client.|[**REST API**](document-translation/quickstarts/synchronous-rest-api.md)|
| [**Custom Translator**](custom-translator/overview.md) | Build customized models to translate domain- and industry-specific language, terminology, and style. [Create a dictionary (phrase or sentence)](custom-translator/concepts/dictionaries.md) for custom translations. | &bull; [**Custom Translator portal**](https://portal.customtranslator.azure.ai/)|

For detailed information regarding Azure AI Translator Service request limits, *see* [**Service and request limits**](service-limits.md#text-translation).

## Try the Translator service for free

First, you need a Microsoft account; if you don't have one, you can sign up for free at the [**Microsoft account portal**](https://account.microsoft.com/account). Select **Create a Microsoft account** and follow the steps to create and verify your new account.

Next, you need to  have an Azure account—navigate to the [**Azure sign-up page**](https://azure.microsoft.com/free/ai/), select the **Start free** button, and create a new Azure account using your Microsoft account credentials.

Now, you're ready to get started! [**Create a Translator service**](create-translator-resource.yml "Go to the Azure portal."), [**get your access keys and API endpoint**](create-translator-resource.yml#authentication-keys-and-endpoint-url "An endpoint URL and read-only key are required for authentication."), and try our [**quickstart**](quickstart-text-rest-api.md "Learn to use Translator via REST.").

## Next steps

* Learn more about the following features:

  * [**Text Translation**](text-translation-overview.md)
  * [**Document Translation**](document-translation/overview.md)
  * [**Custom Translator**](custom-translator/overview.md)

* Review [**Translator pricing**](https://azure.microsoft.com/pricing/details/cognitive-services/translator-text-api/)
