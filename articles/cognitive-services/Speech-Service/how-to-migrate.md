---
title: Migrating to the unified Speech service | Microsoft Docs
description: How to migrate from separate speech services to the unified Speech service.
services: cognitive-services
author: zhouwangzw
manager: wolfma

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 10/15/2017
ms.author: zhouwang
---
# Migrating to the unified Speech service

The Speech service unites several Azure speech services that were previously available separately: Bing Speech (comprising speech recognition and text to speech), Custom Speech, and Speech Translation.

If you have been using these separate speech services through their REST or WebSockets interfaces, there is no pressing need to migrate to the unified Speech service. The pre-existing speech services will continue to be available for some time. However, migrating requires minimal code changes and may provide additional functionality.

Changes to the Speech APIs are summarized in the following sections.

## Speech to Text

In the previous [Speech service](https://docs.microsoft.com/azure/cognitive-services/speech) (also called Bing Speech), Speech to Text was called Speech Recognition. It is essentially the same functionality; only the name has changed.

The previous [Custom Speech](https://docs.microsoft.com/azure/cognitive-services/custom-speech-service/cognitive-services-custom-speech-home) service is now an integrated part of the Speech service and no longer requires a separate subscription.

The REST and WebSockets Speech to Text endpoints in the unified Speech service are shown here.

Method | Region|	Endpoint
-|-|-
REST | West US|	`https://westus.tts.speech.microsoft.com/cognitiveservices/v1`
||East Asia|	`https://eastasia.tts.speech.microsoft.com/cognitiveservices/v1`
||North Europe|	`https://northeurope.tts.speech.microsoft.com/cognitiveservices/v1`
WebSockets|West US| `wss://westus.stt.speech.microsoft.com/v1.0/`
||East Asia|	`wss://eastasia.stt.speech.microsoft.com/v1.0/`
||North Europe| `wss://northeurope.stt.speech.microsoft.com/v1.0/`

## Text to Speech

The Text to Speech functionality of the unified Speech service is similar to the same functionality in the previous [Speech service](https://docs.microsoft.com/azure/cognitive-services/speech), also called Bing Search. However, there have been some important improvements. For example, it is now possible to create [custom voice fonts](how-to-customize-voice-font.md) by providing recorded voice samples and a corresponding text transcription.

In the Text to Speech API, the `X-Microsoft-OutputFormat` header can now specify the following formats.

|||
|-|-|
`raw-16khz-16bit-mono-pcm`         | `audio-16khz-16kbps-mono-siren `
`riff-16khz-16kbps-mono-siren`     | `riff-16khz-16bit-mono-pcm`
`audio-16khz-128kbitrate-mono-mp3` | `audio-16khz-64kbitrate-mono-mp3`
`audio-16khz-32kbitrate-mono-mp3`  | `raw-24khz-16bit-mono-pcm`
`riff-24khz-16bit-mono-pcm`        | `audio-24khz-160kbitrate-mono-mp3`
`audio-24khz-96kbitrate-mono-mp3`  | `audio-24khz-48kbitrate-mono-mp3`

Text to Speech also offers two new voices.

Locale | Language | Gender  | Service name mapping
-------|-----------|--------|------------
en-US | US English | Male   | "Microsoft Server Speech Text to Speech Voice (en-US, Jessa24kRUS)" 
en-US | US English | Female | "Microsoft Server Speech Text to Speech Voice (en-US, Guy24kRUS)

The REST endpoints for Text to Speech in the unified Speech service are shown here.

Region|	Endpoint
-|-
West US|	https://westus.tts.speech.microsoft.com/cognitiveservices/v1
East Asia|	https://eastasia.tts.speech.microsoft.com/cognitiveservices/v1
North Europe|	https://northeurope.tts.speech.microsoft.com/cognitiveservices/v1

## Speech Translation

Speech Translation functionality is essentially the same as the [Translator Speech](https://docs.microsoft.com/azure/cognitive-services/translator-speech) service. Only the WebSockets endpoints are different, as shown here.

Region|	Endpoint
-|-
West US| wss://westus.s2s.speech.microsoft.com/v1.0/
East Asia|	wss://eastasia.s2s.speech.microsoft.com/v1.0/
North Europe| wss://northeurope.s2s.speech.microsoft.com/v1.0/

## Native clients

The unified Speech SDK currently supports C/C++, C#, and Java. If you are using a native client library with some other programming language, you might want to wait for a unified Speech SDK for your platform.

> [!NOTE]
> The Java SDK is part of the [Speech Devices SDK](speech-devices-sdk.md) and is in restricted preview. [Apply to join](get-speech-devices-sdk.md) the preview.