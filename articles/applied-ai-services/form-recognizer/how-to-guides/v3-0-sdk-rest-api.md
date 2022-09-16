---
title: "Use Form Recognizer client library SDKs or REST API (v3.0)"
titleSuffix: Azure Applied AI Services
description: How to use Form Recognizer SDKs or REST API (v3.0) to create apps that extracts key data from documents.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: how-to
ms.date: 09/13/2022
ms.author: lajanuar
zone_pivot_groups: programming-languages-set-formre
recommendations: false
---

# Use Form Recognizer SDKs or REST API (v3.0)

 In this how-to guide, you'll learn how to add Form Recognizer to your applications and workflows using an SDK, in a programming language of your choice, or the REST API. Azure Form Recognizer is a cloud-based Azure Applied AI Service that uses machine learning to extract key-value pairs, text, and tables from your documents. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.

You'll use the following APIs and models to extract structured data from forms and documents:

* [Authenticate the client](#authenticate-the-client)
* [prebuilt-read](#read-model)
* [prebuilt-layout](#layout-model)
* [prebuilt-document](#general-document-model)
* [prebuilt-tax.us.w2](#w2-model)
* [prebuilt-invoice](#invoice-model)
* [prebuilt-receipt](#receipt-model)
* [prebuilt-idDocument](#id-document-model)
* [prebuilt-businessCard](#business-card-model)
* [Train a custom model](#train-a-custom-model)
* [Analyze forms with a custom model](#analyze-forms-with-a-custom-model)
* [Manage custom models](#manage-custom-models)

::: zone pivot="programming-language-csharp"

[!INCLUDE [C# SDK quickstart](includes/v3-0/csharp-sdk.md)]

::: zone-end

::: zone pivot="programming-language-java"

[!INCLUDE [Java SDK quickstart](includes/v3-0/java-sdk.md)]

::: zone-end

::: zone pivot="programming-language-javascript"

[!INCLUDE [NodeJS SDK quickstart](includes/v3-0/javascript-sdk.md)]

::: zone-end

::: zone pivot="programming-language-python"

[!INCLUDE [Python SDK quickstart](includes/v3-0/python-sdk.md)]

::: zone-end

::: zone pivot="programming-language-rest-api"

[!INCLUDE [REST API quickstart](includes/v3-0/rest-api.md)]

::: zone-end
