---
title: 'Quickstart: Create a custom voice assistant - Speech service'
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: trrwilson
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 02/10/2020
ms.author: travisw
---

In this quickstart you will use the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) to create a custom voice assistant application that connects to a bot that you have already authored and configured. If you need to create a bot, please see [the related tutorial](~/articles/cognitive-services/speech-service/tutorial-voice-enable-your-bot-speech-sdk.md) for a more comprehensive guide.

After satisfying a few prerequisites, connecting your custom voice assistant takes only a few steps:
> [!div class="checklist"]
> * Create a `BotFrameworkConfig` object from your subscription key and region.
> * Create a `DialogServiceConnector` object using the `BotFrameworkConfig` object from above.
> * Using the `DialogServiceConnector` object, start the listening process for a single utterance.
> * Inspect the `ActivityReceivedEventArgs` returned.

## Prerequisites

Before you get started, make sure to:

> [!div class="checklist"]
> * [Create an Azure Speech resource](../../../../get-started.md)
> * [Set up your development environment and create an empty project](../../../../quickstarts/setup-platform.md?tabs=uwp)
> * Create a bot connected to the [Direct Line Speech channel](https://docs.microsoft.com/azure/bot-service/bot-service-channel-connect-directlinespeech)

  > [!NOTE]
  > Please refer to [the list of supported regions for voice assistants](~/articles/cognitive-services/speech-service/regions.md#voice-assistants) and ensure your resources are deployed in one of those regions.