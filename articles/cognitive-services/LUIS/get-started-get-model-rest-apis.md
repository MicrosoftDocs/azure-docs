---
title: "Quickstart: Get intent with REST APIs - LUIS"
titleSuffix: Azure Cognitive Services
description: In this REST API quickstart, use an available public LUIS app to determine a user's intention from conversational text.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18, tracking-python
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: quickstart
ms.date: 06/03/2020
ms.author: diberry
zone_pivot_groups: programming-languages-set-one
#Customer intent: As an API developer familiar with REST but new to the LUIS service, I want to query the LUIS endpoint of a published model so that I can see the JSON prediction response.
---

# Quickstart: Change model with REST APIs

In this quickstart, you will add example utterances to a Pizza app and train the app. Example utterances are conversational user text mapped to an intent. By providing example utterances for intents, you teach LUIS what kinds of user-supplied text belongs to which intent.

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
