---
title: How to translate speech  | Microsoft Docs
description: How to use Speech Translation in the Speech service.
services: cognitive-services
author: v-jerkin
manager: noellelacharite

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 04/28/2018
ms.author: v-jerkin
---
# How to use Speech to Text

You can use Speech Translation in your applications in two different ways.

| Method | Description |
|-|-|
| SDK | Simplest method for C/C++, C#, and Java developers |
| WebSockets | Allows translation of long, streaming utterances from any language |

> [!NOTE]
> The Java SDK is part of the [Speech Devices SDK](speech-devices-sdk.md) and is in restricted preview. [Apply to join](get-speech-devices-sdk.md) the preview.

## Using the SDK

The [Speech SDK](speech-sdk.md) is the simplest way to use Speech Translation in your application. The SDK gives you full functionality, without the limitations of the WebSockets method. The basic process is as follows.

1. Create a speech factory, providing a Speech service subscription key or an authorization token. You also configure the source and target translation languages at this point, as well as specifying whether you want text or speech output.

2. Get a recognizer from the factory. The recognizer you want is the translation recognizer. (The others are for Speech to Text.) There are various flavors of translation recognizer based on the audio source you are using.

4. Hook up events for asynchronous operation, if desired. The recognizer will then call your event handlers when it has interim and final results. Otherwise, your application will receive a final translation result.

5. Start recognition and translation.

### SDK samples

You can download code samples demonstrating the use of the SDK for Speech Translation using the links below.

- [Download samples for Windows](https://aka.ms/csspeech/winsample)
- [Download samples for Linux](https://aka.ms/csspeech/linuxsample)

## Using the WebSockets API

The WebSockets API is how you use Speech Translation if you are not using a language supported by the Speech SDK. You must build all the "plumbing" yourself, including the following tasks.

* Get the audio from some source, such as microphone or a file
* Transmit the audio to the Speech Translation endpoint
* Deal with the interim and final results returned by the Speech service

The WebSockets request must include an authorization, either your subscription key or a token. See [how to authenticate](how-to-authenticate.md).

See [WebSockets protocols](websockets.md#speech-translation) for more information on the Speech to Text WebSockets API.