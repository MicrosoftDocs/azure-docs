---
title: How to Choose Bing Speech Recognition Mode | Microsoft Docs
titlesuffix: Azure Cognitive Services
description: How to choose the best recognition mode in Bing Speech.
services: cognitive-services
author: zhouwangzw
manager: wolfma
ms.service: cognitive-services
ms.component: bing-speech
ms.topic: article
ms.date: 09/18/2018
ms.author: zhouwang
---
# Bing Speech recognition modes

[!INCLUDE [Deprecation note](../../../../includes/cognitive-services-bing-speech-api-deprecation-note.md)]

The Bing Speech to Text APIs support multiple modes of speech recognition. Choose the mode that produces the best recognition results for your application.

| Mode | Description |
|---|---|
| *interactive* | "Command and control" recognition for interactive user application scenarios. Users speak short phrases intended as commands to an application. |
| *dictation* | Continuous recognition for dictation scenarios. Users speak longer sentences that are displayed as text. Users adopt a more formal speaking style. |
| *conversation* | Continuous recognition for transcribing conversations between humans. Users adopt a less formal speaking style and may alternate between longer sentences and shorter phrases.

> [!NOTE]
> These modes are applicable when you use the [REST APIs](../GetStarted/GetStartedREST.md). The [client libraries](../GetStarted/GetStartedClientLibraries.md) use different parameters to specify recognition mode. For more information, see the client library of your choice.

For more information, see the [Recognition Modes](../concepts.md#recognition-modes) page.
