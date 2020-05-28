---
title: About the Speech SDK - Speech service
titleSuffix: Azure Cognitive Services
description: The Speech software development kit (SDK) exposes many of the Speech service capabilities, making it easier to develop speech-enabled applications.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/03/2020
ms.author: trbye
---

# About the Speech SDK

The Speech software development kit (SDK) exposes many of the Speech service capabilities, to empower you to develop speech-enabled applications. The Speech SDK is available in many programming languages and across all platforms.

[!INCLUDE [Speech SDK Platforms](../../../includes/cognitive-services-speech-service-speech-sdk-platforms.md)]

## Scenario capabilities

The Speech SDK exposes many features from the Speech service, but not all of them. The capabilities of the Speech SDK are often associated with scenarios. The Speech SDK is ideal for both real-time and non-real-time scenarios, using local devices, files, Azure blob storage, and even input and output streams. When a scenario is not achievable with the Speech SDK, look for a REST API alternative.

### Speech-to-text

[Speech-to-text](speech-to-text.md) (also known as *speech recognition*) transcribes audio streams to text that your applications, tools, or devices can consume or display. Use speech-to-text with [Language Understanding (LUIS)](../luis/index.yml) to derive user intents from transcribed speech and act on voice commands. Use [Speech Translation](speech-translation.md) to translate speech input to a different language with a single call. For more information, see [Speech-to-text basics](speech-to-text-basics.md).

### Text-to-speech

[Text-to-speech](text-to-speech.md) (also known as *speech synthesis*) converts text into human-like synthesized speech. The input text is either string literals or using the [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md). For more information on standard or neural voices, see [Text-to-speech language and voice support](language-support.md#text-to-speech).

### Voice assistants

Voice assistants using the Speech SDK enable developers to create natural, human-like conversational interfaces for their applications and experiences. The voice assistant service provides fast, reliable interaction between a device and an assistant. The implementation uses the Bot Framework's Direct Line Speech channel or the integrated Custom Commands (Preview) service for task completion. Additionally, voice assistants can be created using the [Custom Voice Portal](https://aka.ms/customvoice) to create a unique voice experience.

#### Keyword spotting

The concept of [keyword spotting](speech-devices-sdk-create-kws.md) is supported in the Speech SDK. Keyword spotting is the act of identifying a keyword in speech, followed by an action upon hearing the keyword. For example, "Hey Cortana" would activate the Cortana assistant.

### Meeting scenarios

The Speech SDK is perfect for transcribing meeting scenarios, whether from a single device or multi-device conversation.

#### Conversation Transcription

[Conversation Transcription](conversation-transcription.md) enables real-time (and asynchronous) speech recognition, speaker identification, and sentence attribution to each speaker (also known as *diarization*). It's perfect for transcribing in-person meetings with the ability to distinguish speakers.

#### Multi-device Conversation

With [Multi-device Conversation](multi-device-conversation.md), connect multiple devices or clients in a conversation to send speech-based or text-based messages, with easy support for transcription and translation.

### Custom / agent scenarios

The Speech SDK can be used for transcribing call center scenarios, where telephony data is generated.

#### Call Center Transcription

[Call Center Transcription](call-center-transcription.md) is common scenario for speech-to-text for transcribing large volumes of telephony data that may come from various systems, such as Interactive Voice Response (IVR). The latest speech recognition models from the Speech service excel at transcribing this telephony data, even in cases when the data is difficult for a human to understand.

### Codec compressed audio input

Several of the Speech SDK programming languages support codec compressed audio input streams. For more information, see <a href="https://docs.microsoft.com/azure/cognitive-services/speech-service/how-to-use-codec-compressed-audio-input-streams" target="_blank">use compressed audio input formats <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

## REST API

While the Speech SDK covers many feature capabilities of the Speech Service, for some scenarios you might want to use the REST API.

### Batch transcription

[Batch transcription](batch-transcription.md) enables asynchronous speech-to-text transcription of large volumes of data. Batch transcription is only possible from the REST API. In addition to converting speech audio to text, batch speech-to-text also allows for diarization and sentiment-analysis.

## Customization

The Speech Service delivers great functionality with its default models across speech-to-text, text-to-speech, and speech-translation. Sometimes you may want to increase the baseline performance to work even better with your unique use case. The Speech Service has a variety of no-code customization tools that make it easy, and allow you to create a competitive advantage with custom models based on your own data. These models will only be available to you and your organization.

### Custom Speech-to-text

When using speech-to-text for recognition and transcription in a unique environment, you can create and train custom acoustic, language, and pronunciation models to address ambient noise or industry-specific vocabulary. The creation and management of no-code Custom Speech models is available through the [Custom Speech Portal](https://aka.ms/customspeech). Once the Custom Speech model is published, it can be consumed by the Speech SDK.

### Custom Text-to-speech

Custom text-to-speech, also known as Custom Voice is a set of online tools that allow you to create a recognizable, one-of-a-kind voice for your brand. The creation and management of no-code Custom Voice models is available through the [Custom Voice Portal](https://aka.ms/customvoice). Once the Custom Voice model is published, it can be consumed by the Speech SDK.

## Get the Speech SDK

# [Windows](#tab/windows)

[!INCLUDE [Get the Speech SDK](includes/get-speech-sdk-windows.md)]

# [Linux](#tab/linux)

[!INCLUDE [Get the Speech SDK](includes/get-speech-sdk-linux.md)]

# [iOS](#tab/ios)

[!INCLUDE [Get the Speech SDK](includes/get-speech-sdk-ios.md)]

# [macOS](#tab/macos)

[!INCLUDE [Get the Speech SDK](includes/get-speech-sdk-macos.md)]

# [Android](#tab/android)

[!INCLUDE [Get the Speech SDK](includes/get-speech-sdk-android.md)]

# [Node.js](#tab/nodejs)

[!INCLUDE [Get the Node.js Speech SDK](includes/get-speech-sdk-nodejs.md)]

# [Browser](#tab/browser)

[!INCLUDE [Get the Browser Speech SDK](includes/get-speech-sdk-browser.md)]

---

[!INCLUDE [License notice](../../../includes/cognitive-services-speech-service-license-notice.md)]

[!INCLUDE [Sample source code](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in C#](quickstarts/speech-to-text-from-microphone.md?pivots=programming-language-csharp&tabs=dotnet)
