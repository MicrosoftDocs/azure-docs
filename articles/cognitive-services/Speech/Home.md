---
title: Microsoft Bing Speech Service | Microsoft Docs
titlesuffix: Azure Cognitive Services
description: Use Microsoft Speech API to add speech-driven actions to your apps, including real-time interaction with users.
services: cognitive-services
author: zhouwangzw
manager: wolfma
ms.service: cognitive-services
ms.component: bing-speech
ms.topic: article
ms.date: 09/18/2018
ms.author: zhouwang
---

# What is Bing Speech?

[!INCLUDE [Deprecation note](../../../includes/cognitive-services-bing-speech-api-deprecation-note.md)]

The cloud-based Microsoft Bing Speech API provides developers an easy way to create powerful speech-enabled features in their applications, like voice command control, user dialog using natural speech conversation, and speech transcription and dictation. The Microsoft Speech API supports both *Speech to Text* and *Text to Speech* conversion.

- **Speech to Text** API converts human speech to text that can be used as input or commands to control your application.
- **Text to Speech** API converts text to audio streams that can be played back to the user of your application.

## Speech to text (speech recognition)

Microsoft speech recognition API *transcribes* audio streams into text that your application can display to the user or act upon as command input. It provides two ways for developers to add Speech to their apps: REST APIs **or** Websocket-based client libraries.

- [REST APIs](GetStarted/GetStartedREST.md): Developers can use HTTP calls from their apps to the service for speech recognition.
- [Client libraries](GetStarted/GetStartedClientLibraries.md): For advanced features, developers can download Microsoft Speech client libraries, and link into their apps.  The client libraries are available on various platforms (Windows, Android, iOS) using different languages (C#, Java, JavaScript, ObjectiveC). Unlike the REST APIs, the client libraries utilize Websocket-based protocol.

| Use cases | [REST APIs](GetStarted/GetStartedREST.md) | [Client Libraries](GetStarted/GetStartedClientLibraries.md) |
|-----|-----|-----|
| Convert a short spoken audio, for example, commands (audio length < 15 s) without interim results | Yes | Yes |
| Convert a long audio (> 15 s) | No | Yes |
| Stream audio with interim results desired | No | Yes |
| Understand the text converted from audio using LUIS | No | Yes |

Whichever approach developers choose (REST APIs or client libraries), Microsoft speech service supports the following:

- Advanced speech recognition technologies from Microsoft that are used by Cortana, Office Dictation, Office Translator, and other Microsoft products.
- Real-time continuous recognition. The speech recognition API enables users to transcribe audio into text in real time, and supports to receive the intermediate results of the words that have been recognized so far. The speech service also supports end-of-speech detection. In addition, users can choose additional formatting capabilities, like capitalization and punctuation, masking profanity, and text normalization.
- Supports optimized speech recognition results for *interactive*, *conversation*, and *dictation* scenarios. For user scenarios which require customized language models and acoustic models, [Custom Speech Service](../custom-speech-service/cognitive-services-custom-speech-home.md) allows you to create speech models that tailored to your application and your users.
- Support many spoken languages in multiple dialects. For the full list of supported languages in each recognition mode, see [recognition languages](api-reference-rest/supportedlanguages.md).
- Integration with language understanding. Besides converting the input audio into text, the *Speech to Text* provides applications an additional capability to understand what the text means. It uses the [Language Understanding Intelligent Service(LUIS)](../LUIS/what-is-luis.md) to extract intents and entities from the recognized text.

### Next steps

- Get started to use Microsoft speech recognition service with [REST APIs](GetStarted/GetStartedREST.md) or [client libraries](GetStarted/GetStartedClientLibraries.md).
- Check out [sample applications](samples.md) in your preferred programming language.
- Go to the Reference section to find [Microsoft Speech Protocol](API-Reference-REST/websocketprotocol.md) details and API references.

## Text to speech (speech synthesis)

*Text to Speech* APIs use REST to convert structured text to an audio stream. The APIs provide fast text to speech conversion in various voices and languages. In addition users also have the ability to change audio characteristics like pronunciation, volume, pitch etc. using SSML tags.

### Next steps

- Get started to use Microsoft text to speech service: [Text to Speech API Reference](api-reference-rest/bingvoiceoutput.md). For the full list of languages and voices supported by Text to Speech, see [Supported Locales and Voice Fonts](api-reference-rest/bingvoiceoutput.md#SupLocales).
