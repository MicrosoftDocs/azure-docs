---
title: "Use SDKs and REST API for Read Model"
titleSuffix: Azure Applied AI Services
description: Learn how to use Read Model using SDKs and REST API.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: how-to
zone_pivot_groups: programming-languages-set-formre
ms.date: 04/11/2022
ms.author: jaep3347
---

# Use the Read Model

 In this how-to guide, you'll learn to use Azure Form Recognizer's [Read model](../concept-read.md) to extract printed and handwritten text lines, words, locations, and detected languages, in a programming language of your choice, or the REST API. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.

 Read model is the core of all the other Form Recognizer models. Layout, General Document, Custom Models and our Prebuilt Models all utilize the Read model as a basis for extracting texts from documents.

>[!NOTE]
> Form Recognizer v3.0 is currently in public preview. Some features may not be supported or have limited capabilities.
The current API version is ```2022-01-30-preview```.

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
