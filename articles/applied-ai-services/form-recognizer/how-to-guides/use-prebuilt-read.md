---
title: "Use SDKs and REST API for read Model"
titleSuffix: Azure Applied AI Services
description: Learn how to use read model using SDKs and REST API.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: how-to
zone_pivot_groups: programming-languages-set-formre
ms.date: 09/09/2022
ms.author: jppark
recommendations: false
---

# Use the Read Model

 In this how-to guide, you'll learn to use Azure Form Recognizer's [read model](../concept-read.md) to extract typeface and handwritten text from documents. The read model can detect lines, words, locations, and languages. You can use a programming language of your choice or the REST API. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.

 The read model is the core of all the other Form Recognizer models. Layout, general document, custom, and prebuilt models all use the read model as a foundation for extracting texts from documents.

The current API version is ```2022-08-31```.

::: zone pivot="programming-language-csharp"

[!INCLUDE [C# SDK](includes/csharp-read.md)]

::: zone-end

::: zone pivot="programming-language-java"

[!INCLUDE [Java SDK](includes/java-read.md)]

::: zone-end

::: zone pivot="programming-language-javascript"

[!INCLUDE [NodeJS SDK](includes/javascript-read.md)]

::: zone-end

::: zone pivot="programming-language-python"

[!INCLUDE [Python SDK](includes/python-read.md)]

::: zone-end

::: zone pivot="programming-language-rest-api"

[!INCLUDE [REST API](includes/rest-api-read.md)]

::: zone-end
