---
title: Data conversion 
titleSuffix: Language Understanding - Azure Cognitive Services
description: Learn how utterances can be changed before predictions in Language Understanding (LUIS)
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 01/16/2019
ms.author: diberry
---

# Convert data format of utterances
LUIS uses Cognitive Services Speech service to convert utterances from spoken utterances to text utterances before prediction. 

## Speech to intent conversion concepts
Conversion of speech to text in LUIS allows you to send spoken utterances to an endpoint and receive a LUIS prediction response. The process is an integration of the [Speech](https://docs.microsoft.com/azure/cognitive-services/Speech) service with LUIS. Learn more about Speech to Intent with a [tutorial](../speech-service/how-to-recognize-intents-from-speech-csharp.md).

### Key requirements
You do not need to create a **Bing Speech API** key for this integration. A **Language Understanding** key created in the Azure portal works for this integration. Do not use the LUIS starter key.

### Pricing Tier
This integration uses a different [pricing](luis-boundaries.md#key-limits) model than the usual Language Understanding pricing tiers. 

### Quota usage
See [Key limits](luis-boundaries.md#key-limits) for information. 

## Next steps

> [!div class="nextstepaction"]
> [Extracting data](luis-concept-data-extraction.md)

