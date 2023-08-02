---
title: Asynchronous meeting transcription - Speech service
titleSuffix: Azure AI services
description: Learn how to use asynchronous meeting transcription using the Speech service. Available for Java and C# only.
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 11/04/2019
ms.devlang: csharp, java
ms.custom: cogserv-non-critical-speech, devx-track-csharp, devx-track-extended-java
zone_pivot_groups: programming-languages-set-twenty-one
---

# Asynchronous meeting transcription

In this article, asynchronous meeting transcription is demonstrated using the **RemoteMeetingTranscriptionClient** API. If you have configured meeting transcription to do asynchronous transcription and have a `meetingId`, you can obtain the transcription associated with that `meetingId` using the **RemoteMeetingTranscriptionClient** API.

## Asynchronous vs. real-time + asynchronous

With asynchronous transcription, you stream the meeting audio, but don't need a transcription returned in real-time. Instead, after the audio is sent, use the `meetingId` of `Meeting` to query for the status of the asynchronous transcription. When the asynchronous transcription is ready, you'll get a `RemoteMeetingTranscriptionResult`.

With real-time plus asynchronous, you get the transcription in real-time, but also get the transcription by querying with the `meetingId` (similar to asynchronous scenario).

Two steps are required to accomplish asynchronous transcription. The first step is to upload the audio, choosing either asynchronous only or real-time plus asynchronous. The second step is to get the transcription results.

::: zone pivot="programming-language-csharp"
[!INCLUDE [prerequisites](includes/how-to/remote-meeting/csharp/examples.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [prerequisites](includes/how-to/remote-meeting/java/examples.md)]
::: zone-end


## Next steps

> [!div class="nextstepaction"]
> [Explore our samples on GitHub](https://aka.ms/csspeech/samples)
