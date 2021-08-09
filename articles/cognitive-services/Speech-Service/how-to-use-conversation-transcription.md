---
title: Real-time Conversation Transcription quickstart - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to use real-time Conversation Transcription with the Speech SDK. Conversation Transcription allows you to transcribe meetings and other conversations with the ability to add, remove, and identify multiple participants by streaming audio to the Speech service.
services: cognitive-services
author: nitinme
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/20/2020
ms.author: nitinme
zone_pivot_groups: acs-js-csharp
---

# Get started with real-time Conversation Transcription

The Speech SDK's **ConversationTranscriber** API allows you to transcribe meetings and other conversations with the ability to add, remove, and identify multiple participants by streaming audio to the Speech service using `PullStream` or `PushStream`. You first create voice signatures for each participant using the REST API, and then use the voice signatures with the SDK to transcribe conversations. See the Conversation Transcription [overview](conversation-transcription.md) for more information.

## Limitations

* Only available in the following subscription regions: `centralus`, `eastasia`, `eastus`, `westeurope`
* Requires a 7-mic circular multi-microphone array. The microphone array should meet [our specification](./speech-devices-sdk-microphone.md).
* The [Speech Devices SDK](speech-devices-sdk.md) provides suitable devices and a sample app demonstrating Conversation Transcription.

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
> [ROOBO device sample code](https://github.com/Azure-Samples/Cognitive-Services-Speech-Devices-SDK/blob/master/Samples/Java/Android/Speech%20Devices%20SDK%20Starter%20App/example/app/src/main/java/com/microsoft/cognitiveservices/speech/samples/sdsdkstarterapp/ConversationTranscription.java)
> [Azure Kinect Dev Kit sample code](https://github.com/Azure-Samples/Cognitive-Services-Speech-Devices-SDK/blob/master/Samples/Java/Windows_Linux/SampleDemo/src/com/microsoft/cognitiveservices/speech/samples/Cts.java)