---
title: Speech service REST APIs | Microsoft Docs
description: Reference for REST APIs for the Speech service.
services: cognitive-services
author: v-jerkin
manager: wolfma

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 04/27/2018
ms.author: v-jerkin
---
# Speech service REST APIs

The REST APIs of the unified Speech service are similar to the APIs provided by the [Speech service](https://docs.microsoft.com/azure/cognitive-services/Speech) (formerly known as the Bing Speech Service) and the [Translator Speech service](https://docs.microsoft.com/azure/cognitive-services/translator-speech/). In general, only the endpoints used differ.

> [!NOTE]
> The Speech Translation feature does not have a REST API. See [WebSocket protocols](websockets.md).

## Speech to Text

In the Speech to Text API, only the endpoints used differ from the previous Speech service Speech Recognition API. Use the one that is appropriate to your subscription. The new endpoints are shown in the table below.

Region|	Endpoint
-|-
West US|	https://westus.tts.speech.microsoft.com/cognitiveservices/v1
East Asia|	https://eastasia.tts.speech.microsoft.com/cognitiveservices/v1
North Europe|	https://northeurope.tts.speech.microsoft.com/cognitiveservices/v1

> [!NOTE]
> If you customized the acoustic model, the language model, or the pronunciation model, use your custom endpoint instead.

Keep these differences in mind as you read the [REST API documentation](https://docs.microsoft.com/azure/cognitive-services/speech/getstarted/getstartedrest) for the Speech service.

The Speech to Text API supports REST only for short (< 15 seconds) utterances. The Speech to Text API also supports a [WebSockets protocol](websockets.md) for streaming speech recognition.

## Text to Speech

In the Text to Speech API, the `X-Microsoft-OutputFormat` header now takes the following values.

|||
|-|-|
`raw-16khz-16bit-mono-pcm`         | `audio-16khz-16kbps-mono-siren `
`riff-16khz-16kbps-mono-siren`     | `riff-16khz-16bit-mono-pcm`
`audio-16khz-128kbitrate-mono-mp3` | `audio-16khz-64kbitrate-mono-mp3`
`audio-16khz-32kbitrate-mono-mp3`  | `raw-24khz-16bit-mono-pcm`
`riff-24khz-16bit-mono-pcm`        | `audio-24khz-160kbitrate-mono-mp3`
`audio-24khz-96kbitrate-mono-mp3`  | `audio-24khz-48kbitrate-mono-mp3`

The service now includes two new voices:

Locale | Language | Gender  | Service name mapping
-------|-----------|--------|------------
en-US | US English | Male   | "Microsoft Server Speech Text to Speech Voice (en-US, Jessa24kRUS)" 
en-US | US English | Female | "Microsoft Server Speech Text to Speech Voice (en-US, Guy24kRUS)"

The following are the REST endpoints for the unified Speech service Text to Speech API. Use the one that is appropriate to your subscription.

Region|	Endpoint
-|-
West US|	https://westus.tts.speech.microsoft.com/cognitiveservices/v1
East Asia|	https://eastasia.tts.speech.microsoft.com/cognitiveservices/v1
North Europe|	https://northeurope.tts.speech.microsoft.com/cognitiveservices/v1

> [!NOTE]
> If you created a custom voice font, use your custom endpoint instead.

Keep these differences in mind as you refer to the [REST API documentation](https://docs.microsoft.com/azure/cognitive-services/speech/api-reference-rest/bingvoiceoutput) for the Speech service.
