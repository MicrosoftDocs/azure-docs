---
title: "Quickstart: Get intent with REST APIs - LUIS"
titleSuffix: Azure Cognitive Services
description: In this REST API quickstart, use an available public LUIS app to determine a user's intention from conversational text.  
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: quickstart
ms.date: 10/17/2019
ms.author: diberry
zone_pivot_groups: programming-languages-set-one
#Customer intent: As an API developer familiar with REST but new to the LUIS service, I want to query the LUIS endpoint of a published model so that I can see the JSON prediction response.
---

# Quickstart: Get intent with REST APIs

In this quickstart, use an available public LUIS app to determine a user's intention from conversational text. Send the user's intention as text to the public app's HTTP prediction endpoint. At the endpoint, LUIS applies the public app's model to analyze the natural language text for meaning, determining overall intent and extracting data relevant to the app's subject domain. 

This quickstart uses the endpoint REST API. For more information, see the [endpoint API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee78).

For this article, you need a free [LUIS](https://www.luis.ai) account. 

<a name="create-luis-subscription-key"></a>

::: zone pivot="programming-language-csharp"

[!INCLUDE [Get intent with C# and REST](./includes/get-started-get-intent-rest-csharp.md)]

::: zone-end

::: zone pivot="programming-language-java"

[!INCLUDE [Get intent with Java and REST](./includes/get-started-get-intent-rest-java.md)]

::: zone-end

::: zone pivot="programming-language-python"

[!INCLUDE [Get intent with Python and REST](./includes/get-started-get-intent-rest-python.md)]

::: zone-end

::: zone pivot="programming-language-nodejs"

[!INCLUDE [Get intent with Node.js and REST](./includes/get-started-get-intent-rest-nodejs.md)]

::: zone-end

::: zone pivot="programming-language-go"

[!INCLUDE [Get intent with Go and REST](./includes/get-started-get-intent-rest-go.md)]

::: zone-end
