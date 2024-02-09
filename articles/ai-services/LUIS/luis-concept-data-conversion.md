---
title: Data conversion - LUIS
titleSuffix: Azure AI services
description: Learn how utterances can be changed before predictions in Language Understanding (LUIS)
#services: cognitive-services
ms.author: aahi
author: aahill
manager: nitinme
ms.custom: seodec18
ms.service: azure-ai-language
ms.subservice: azure-ai-luis
ms.topic: conceptual
ms.date: 03/21/2022

---

# Convert data format of utterances

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

LUIS provides the following conversions of a user utterance before prediction.

* Speech to text using [Azure AI Speech](../speech-service/overview.md) service.

## Speech to text

Speech to text is provided as an integration with LUIS.

### Intent conversion concepts
Conversion of speech to text in LUIS allows you to send spoken utterances to an endpoint and receive a LUIS prediction response. The process is an integration of the [Speech](../speech-service/overview.md) service with LUIS. Learn more about Speech to Intent with a [tutorial](../speech-service/how-to-recognize-intents-from-speech-csharp.md).

### Key requirements
You do not need to create a **Bing Speech API** key for this integration. A **Language Understanding** key created in the Azure portal works for this integration. Do not use the LUIS starter key.

### Pricing Tier
This integration uses a different [pricing](luis-limits.md#resource-usage-and-limits) model than the usual Language Understanding pricing tiers.

### Quota usage
See [Key limits](luis-limits.md#resource-usage-and-limits) for information.

## Next steps

> [!div class="nextstepaction"]
> [Extracting data](luis-concept-data-extraction.md)
