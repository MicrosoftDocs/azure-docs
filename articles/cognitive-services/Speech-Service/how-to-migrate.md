---
title: Migrating to the unified Speech service | Microsoft Docs
description: Migrate from separate speech services to the unified Speech service.
services: cognitive-services
author: v-jerkin
manager: noellelacharite

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 04/28/2018
ms.author: v-jerkin
---
# Migrating to the unified Speech service

The Speech service unites several Azure speech services that were previously available separately: Bing Speech (comprising speech recognition and synthesis), Custom Speech, and Speech Translation.

If you have been using these separate speech services through their REST or WebSockets interfaces, there is no pressing need to migrate to the unified Speech service. The pre-existing speech services will continue to be available for some time. However, migrating requires minimal code changes and may provide additional functionality.

Changes to the Speech APIs are summarized in the following sections.

## Speech to Text

In the previous [Speech service](https://docs.microsoft.com/azure/cognitive-services/speech) (also called Bing Speech), Speech to Text was called Speech Recognition. It is essentially the same functionality; only the name has changed.

The previous [Custom Speech](https://docs.microsoft.com/azure/cognitive-services/custom-speech-service/cognitive-services-custom-speech-home) service is now an integrated part of the Speech service and no longer requires a separate subscription.

The REST and WebSockets Speech to Text endpoints in the unified Speech service are shown here. While we recommend using the Speech SDK instead of WebSockets, if you have already written code using WebSockets, you can continue to use it with the Speech service.

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

Speech Translation functionality is essentially the same as the [Translator Speech](https://docs.microsoft.com/azure/cognitive-services/translator-speech) service. 

Only the WebSockets endpoints are different, as shown here. While we recommend using the Speech SDK instead of WebSockets, if you have already written client code using WebSockets, you can continue to use it with the Speech service.

Region|	Endpoint
-|-
West US| wss://westus.s2s.speech.microsoft.com/v1.0/
East Asia|	wss://eastasia.s2s.speech.microsoft.com/v1.0/
North Europe| wss://northeurope.s2s.speech.microsoft.com/v1.0/



## Software Development Kits

The unified Speech SDK currently supports C/C++ and C#. If you are using another programming language, you may not want to migrate at this time.
