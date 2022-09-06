---
title: How to use local inference with the Personalizer SDK
description: Learn how to use local inference to improve latency.
services: cognitive-services
author: jcodella
ms.author: jacodel
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: quickstart
ms.date: 09/06/2022
zone_pivot_groups: programming-languages-set-six
---

# Get started with the local interence SDK for Azure Personalizer

The Personalizer local inference SDK (Preview) downloads the Personalizer model locally, and thus significantly reduces the latency of Rank calls by eliminating network calls. Every minute the client will download the most recent model in the background and use it for inference.

In this guide, you'll learn how to use the Personalizer local inference SDK.

::: zone pivot="programming-language-csharp"

[!INCLUDE [Try local inference with C#](./includes/quickstart-local-inference-csharp.md)]

::: zone-end