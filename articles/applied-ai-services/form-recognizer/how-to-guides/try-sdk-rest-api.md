---
title: "Quickstart: Form Recognizer client library or REST API"
titleSuffix: Azure Applied AI Services
description: Use the Form Recognizer client library or REST API to create a forms processing app that extracts key/value pairs and table data from your custom documents.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: how-to
ms.date: 10/18/2021
ms.author: lajanuar
zone_pivot_groups: programming-languages-set-formre
recommendations: false
---

# How to use the client library SDKs and REST API

In this how-to guide, you'll learn how to incorporate the Form Recognizer features into your applications using an SDK in a programming language of your choice or the REST API. Azure Form Recognizer is an Azure Applied AI Servicez that lets you build automated data processing software using machine learning technology. Identify and extract text, key/value pairs, selection marks, table data, and more from your form documents&mdash;the service outputs structured data that includes the relationships in the original file. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.

You'll use the following APIs to extract structured data from forms and documents:

* [Authenticate the client](#authenticate-the-client)
* [Analyze Layout](#analyze-layout)
* [Analyze receipts](#analyze-receipts)
* [Analyze business cards](#analyze-business-cards)
* [Analyze invoices](#analyze-invoices)
* [Analyze ID documents](#analyze-id-documents)
* [Train a custom model](#train-a-custom-model)
* [Analyze forms with a custom model](#analyze-forms-with-a-custom-model)
* [Manage custom models](#manage-custom-models)

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