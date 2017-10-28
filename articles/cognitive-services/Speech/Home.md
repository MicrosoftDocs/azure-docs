---
title: Bing Speech API in Microsoft Cognitive Services | Microsoft Docs
description: Use the Bing Speech API to add speech-driven actions to your apps, including real-time interaction with users.
services: cognitive-services
author: priyaravi20
manager: yanbo

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 02/28/2017
ms.author: prrajan
---
# Bing Speech API overview
Microsoft’s *Speech to Text* and *Text to Speech* cloud offerings help you put speech to work in your application. Microsoft's
Speech APIs can transcribe speech *to* text and can generate speech *from* text. These
APIs enable you to create powerful experiences that delight your users.

* **Speech to Text** APIs convert human speech to text that can be used as input or commands to control your application.
* **Text to Speech** APIs convert text to audio streams that can be played back to the user of your application.

## Speech to text (speech recognition)
The *Speech to Text* APIs *transcribe* audio streams into text that your application can display to the user or act upon as command input. The *Speech To Text* APIs come in two flavors.

* A REST API, useful for apps that need to convert short spoken commands to text but do not need simultaneous user feedback. The REST API uses
[HTTP chunked-transfer encoding](https://en.wikipedia.org/wiki/Chunked_transfer_encoding) to send the audio bytes to the service.
* A [WebSocket](https://en.wikipedia.org/wiki/WebSocket) API, useful for apps need an
improved user experience by using the power of the full-duplex WebSocket connection. Apps using this API
get access to advanced features like speech recognition hypotheses. This API choice is also better for apps that need to transcribe longer audio passages.  

Both *Speech to Text* APIs enrich the transcribed text by adding capitalization and punctuation, masking profanity, and text normalization.

### Comparing API options for speech recognition

| Feature | WebSocket API | REST API |
|-----|-----|-----|
| Speech hypotheses | Yes | No |
| Continuous recognition | Yes | No |
| Maximum audio input | 10 minutes of audio | 15 seconds of audio |
| Service detects when speech ends | Yes| No |
| Subscription key authorization | Yes | No |

### Speech recognition modes
Microsoft's *Speech to Text* APIs support multiple modes of speech recognition. Choose the mode that produces the best recognition results for your application.

| Mode | Description |
|---|---|
| *interactive* | "Command and control" recognition for interactive user application scenarios. Users speak short phrases intended as commands to an application. |
| *dictation* | Continuous recognition for dictation scenarios. Users speak longer sentences that are displayed as text. Users adopt a more formal speaking style. |
| *conversation* | Continuous recognition for transcribing conversations between humans. Users adopt a less formal speaking style and may alternate between longer sentences and shorter phrases. |

For more information, see [Recognition Modes](api-reference-rest/bingvoicerecognition.md#recognition-modes) in the API reference.

### Speech recognition supported languages  
The *Speech to Text* APIs support many spoken languages in multiple dialects. For the full list of supported languages in
each recognition mode, see [Recognition Languages](api-reference-rest/bingvoicerecognition.md#recognition-language).

## Text to speech (speech synthesis)
*Text to Speech* APIs use REST to convert structured text to an audio stream. The APIs provide fast text to speech
conversion in various voices and languages. For the full list of supported languages and voices, see
[Supported Locales and Voice Fonts](api-reference-rest/bingvoiceoutput.md#a-namesuplocalesasupported-locales-and-voice-fonts).

### Text to speech API
The maximum amount of audio returned for any single request is 15 seconds.
