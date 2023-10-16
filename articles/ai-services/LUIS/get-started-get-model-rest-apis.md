---
title: "How to update your LUIS model using the REST API"
titleSuffix: Azure AI services
description: In this article, add example utterances to change a model and train the app.
services: cognitive-services
ms.author: aahi
author: aahill
manager: nitinme
ms.devlang: csharp, golang, java, javascript, python
ms.custom: seodec18, devx-track-python, devx-track-js, devx-track-csharp, devx-track-extended-java, devx-track-go
ms.service: azure-ai-language
ms.subservice: azure-ai-luis
ms.topic: how-to
ms.date: 11/30/2020
zone_pivot_groups: programming-languages-set-one
#Customer intent: As an API developer familiar with REST but new to the LUIS service, I want to query the LUIS endpoint of a published model so that I can see the JSON prediction response.
---

# How to update the LUIS model with REST APIs

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]


In this article, you will add example utterances to a Pizza app and train the app. Example utterances are conversational user text mapped to an intent. By providing example utterances for intents, you teach LUIS what kinds of user-supplied text belongs to which intent.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Get intent with C# and REST](./includes/get-started-get-model-rest-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Get intent with Java and REST](./includes/get-started-get-model-rest-java.md)]
::: zone-end

::: zone pivot="programming-language-go"
[!INCLUDE [Get intent with Go and REST](./includes/get-started-get-model-rest-go.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Get intent with Node.js and REST](./includes/get-started-get-model-rest-nodejs.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Get intent with Python and REST](./includes/get-started-get-model-rest-python.md)]
::: zone-end
