---
title: Real-time Conversation Transcription quickstart - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to use real-time Conversation Transcription with the REST API and SDK. Conversation Transcription allows you to transcribe meetings and other conversations with the ability to add, remove, and identify multiple participants by streaming audio to the Speech service.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/24/2022
ms.author: eur
zone_pivot_groups: acs-js-csharp
ms.devlang: csharp, javascript
ms.custom: ignite-fall-2021
---

# Get started with real-time Conversation Transcription

You can transcribe meetings and other conversations with the ability to add, remove, and identify multiple participants by streaming audio to the Speech service. You first create voice signatures for each participant using the REST API, and then use the voice signatures with the Speech SDK to transcribe conversations. See the Conversation Transcription [overview](conversation-transcription.md) for more information.

## Limitations

* Only available in the following subscription regions: `centralus`, `eastasia`, `eastus`, `westeurope`
* Requires a 7-mic circular multi-microphone array. The microphone array should meet [our specification](./speech-sdk-microphone.md).

## Prerequisites

This article assumes that you have an Azure account and Speech service subscription. If you don't have an account and subscription, [try the Speech service for free](overview.md#try-the-speech-service-for-free).

::: zone pivot="programming-language-javascript"
[!INCLUDE [JavaScript Basics include](includes/how-to/conversation-transcription/real-time-javascript.md)]
::: zone-end

::: zone pivot="programming-language-csharp"
[!INCLUDE [C# Basics include](includes/how-to/conversation-transcription/real-time-csharp.md)]
::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Asynchronous Conversation Transcription](how-to-async-conversation-transcription.md)

