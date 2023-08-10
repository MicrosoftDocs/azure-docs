---
title: 'Quickstart: Create a custom voice assistant - Speech service'
titleSuffix: Azure AI services
services: cognitive-services
author: trrwilson
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 03/20/2020
ms.author: travisw
---

In this quickstart, you will use the [Speech SDK](~/articles/ai-services/speech-service/speech-sdk.md) to create a custom voice assistant application that connects to a bot that you have already authored and configured. If you need to create a bot, see [the related tutorial](~/articles/ai-services/speech-service/tutorial-voice-enable-your-bot-speech-sdk.md) for a more comprehensive guide.

After satisfying a few prerequisites, connecting your custom voice assistant takes only a few steps:
> [!div class="checklist"]
> * Create a `BotFrameworkConfig` object from your subscription key and region.
> * Create a `DialogServiceConnector` object using the `BotFrameworkConfig` object from above.
> * Using the `DialogServiceConnector` object, start the listening process for a single utterance.
> * Inspect the `ActivityReceivedEventArgs` returned.
