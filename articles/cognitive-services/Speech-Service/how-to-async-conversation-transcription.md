---
title: Asynchronous Conversation Transcription - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to use asynchronous Conversation Transcription using the Speech service. Available for Java and C# only.
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 11/04/2019
ms.devlang: csharp, java
ms.custom: cogserv-non-critical-speech, devx-track-csharp
zone_pivot_groups: programming-languages-set-twenty-one
---

# Asynchronous Conversation Transcription

In this article, asynchronous Conversation Transcription is demonstrated using the **RemoteConversationTranscriptionClient** API. If you have configured Conversation Transcription to do asynchronous transcription and have a `conversationId`, you can obtain the transcription associated with that `conversationId` using the **RemoteConversationTranscriptionClient** API.

## Asynchronous vs. real-time + asynchronous

With asynchronous transcription, you stream the conversation audio, but don't need a transcription returned in real time. Instead, after the audio is sent, use the `conversationId` of `Conversation` to query for the status of the asynchronous transcription. When the asynchronous transcription is ready, you'll get a `RemoteConversationTranscriptionResult`.

With real-time plus asynchronous, you get the transcription in real time, but also get the transcription by querying with the `conversationId` (similar to asynchronous scenario).

Two steps are required to accomplish asynchronous transcription. The first step is to upload the audio, choosing either asynchronous only or real-time plus asynchronous. The second step is to get the transcription results.

::: zone pivot="programming-language-csharp"
[!INCLUDE [prerequisites](includes/how-to/remote-conversation/csharp/examples.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [prerequisites](includes/how-to/remote-conversation/java/examples.md)]
::: zone-end


## Next steps

> [!div class="nextstepaction"]
> [Explore our samples on GitHub](https://aka.ms/csspeech/samples)
