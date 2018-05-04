---
title: Speech service REST APIs | Microsoft Docs
description: Reference for REST APIs for the Speech service.
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: v-jerkin
manager: noellelacharite

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 04/28/2018
ms.author: v-jerkin
---
# Speech service REST APIs

The REST APIs for the unified Speech service are similar to the APIs provided by the [Speech service](https://docs.microsoft.com/azure/cognitive-services/Speech) (formerly known as the Bing Speech Service) and the [Translator Speech service](https://docs.microsoft.com/azure/cognitive-services/translator-speech/). In general, only the endpoints differ between the two.

<a name="speech-to-text"></a>
## Speech to Text API

In the **Speech to Text** API, only the endpoints used differ from the previous Speech service Speech Recognition API. Use the one that is appropriate to your subscription. The new endpoints are shown in the table below.

Region|	Endpoint
-|-
West US|	`https://westus.stt.speech.microsoft.com/cognitiveservices/v1`
East Asia|	`https://eastasia.stt.speech.microsoft.com/cognitiveservices/v1`
North Europe|	`https://northeurope.stt.speech.microsoft.com/cognitiveservices/v1`

> [!NOTE]
> If you customized the acoustic or language model, or the pronunciation, use your custom endpoint instead.

Keep these differences in mind as you read the [REST API documentation](https://docs.microsoft.com/azure/cognitive-services/speech/getstarted/getstartedrest) for the Bing Speech service. The Speech to Text API supports REST only for short (< 15 seconds) utterances.

<a name="text-to-speech"></a>
## Text to Speech API

The following are the REST endpoints for the unified Speech service Text to Speech API. Use the one that is appropriate to your subscription.

Region|	Endpoint
-|-
West US|	https://westus.tts.speech.microsoft.com/cognitiveservices/v1
East Asia|	https://eastasia.tts.speech.microsoft.com/cognitiveservices/v1
North Europe|	https://northeurope.tts.speech.microsoft.com/cognitiveservices/v1

> [!NOTE]
> If you created a custom voice font, use your custom endpoint instead.

In the **Text to Speech** API, the `X-Microsoft-OutputFormat` header now takes the following values.

|||
|-|-|
`raw-16khz-16bit-mono-pcm`         | `audio-16khz-16kbps-mono-siren `
`riff-16khz-16kbps-mono-siren`     | `riff-16khz-16bit-mono-pcm`
`audio-16khz-128kbitrate-mono-mp3` | `audio-16khz-64kbitrate-mono-mp3`
`audio-16khz-32kbitrate-mono-mp3`  | `raw-24khz-16bit-mono-pcm`
`riff-24khz-16bit-mono-pcm`        | `audio-24khz-160kbitrate-mono-mp3`
`audio-24khz-96kbitrate-mono-mp3`  | `audio-24khz-48kbitrate-mono-mp3`

The service includes two additional voices:

Locale | Language | Gender  | Service name mapping
-------|-----------|--------|------------
en-US | US English | Male   | "Microsoft Server Speech Text to Speech Voice (en-US, Jessa24kRUS)" 
en-US | US English | Female | "Microsoft Server Speech Text to Speech Voice (en-US, Guy24kRUS)"


Keep these differences in mind as you refer to the [REST API documentation](https://docs.microsoft.com/azure/cognitive-services/speech/api-reference-rest/bingvoiceoutput) for the Speech service.

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in C#](quickstart-csharp-windows.md)
