---
title: About the Speech SDK - Speech service
titleSuffix: Azure Cognitive Services
description: The Speech software development kit (SDK) exposes many of the Speech service capabilities, making it easier to develop speech-enabled applications.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: overview
ms.date: 01/16/2022
ms.author: eur
---

# What is the Speech SDK?

The Speech software development kit (SDK) exposes many of the Speech service capabilities you can use to develop speech-enabled applications. The Speech SDK is available in many programming languages and across all platforms.

[!INCLUDE [Speech SDK Platforms](../../../includes/cognitive-services-speech-service-speech-sdk-platforms.md)]

## Scenario capabilities

The Speech SDK exposes many features from the Speech service, but not all of them. The capabilities of the Speech SDK are often associated with scenarios. The Speech SDK is ideal for both real-time and non-real-time scenarios, by using local devices, files, Azure Blob Storage, and even input and output streams. When a scenario can't be achieved with the Speech SDK, look for a REST API alternative.

### Speech-to-text

[Speech-to-text](speech-to-text.md) transcribes audio streams to text that your applications, tools, or devices can consume or display. Speech-to-text is also known as *speech recognition*. Use speech-to-text with [Language Understanding (LUIS)](../luis/index.yml) to derive user intents from transcribed speech and act on voice commands. Use [speech translation](speech-translation.md) to translate speech input to a different language with a single call. For more information, see [Speech-to-text basics](./get-started-speech-to-text.md).

**Speech recognition, phrase list, intent, translation, and on-premises containers** are available on the following platforms:

  - C++/Windows and Linux and macOS
  - C# (Framework and .NET Core)/Windows and UWP and Unity and Xamarin and Linux and macOS
  - Java (Jre and Android)
  - JavaScript (browser and NodeJS)
  - Python
  - Swift
  - Objective-C
  - Go (speech recognition only)

### Text-to-speech

[Text-to-speech](text-to-speech.md) converts text into humanlike synthesized speech. Text-to-speech is also known as *speech synthesis*. The input text is either string literals or uses the [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md). For more information on standard or neural voices, see [Text-to-speech language and voice support](language-support.md#text-to-speech).

**Text-to-speech** is available on the following platforms:

  - C++/Windows and Linux and macOS
  - C# (Framework and .NET Core)/Windows and UWP and Unity and Xamarin and Linux and macOS
  - Java (Jre and Android)
  - JavaScript (browser and NodeJS)
  - Python
  - Swift
  - Objective-C
  - Go
  - Text-to-speech REST API can be used in every other situation

### Voice assistants

[Voice assistants](voice-assistants.md) using the Speech SDK enable you to create natural, humanlike conversational interfaces for your applications and experiences. The Speech SDK provides fast, reliable interaction that includes speech-to-text, text-to-speech, and conversational data on a single connection. Your implementation can use the Bot Framework's Direct Line Speech channel or the integrated Custom Commands service for task completion. Also, voice assistants can use custom voices created in the [Custom Voice portal](https://aka.ms/customvoice) to add a unique voice output experience.

**Voice assistant** support is available on the following platforms:

  - C++/Windows and Linux and macOS
  - C#/Windows
  - Java/Windows and Linux and macOS and Android (Speech Devices SDK)
  - Go

#### Keyword recognition

The concept of [keyword recognition](custom-keyword-basics.md) is supported in the Speech SDK. Keyword recognition is the act of identifying a keyword in speech, followed by an action upon hearing the keyword. For example, "Hey Cortana" would activate the Cortana assistant.

**Keyword recognition** is available on the following platforms:

  - C++/Windows and Linux
  - C#/Windows and Linux
  - Python/Windows and Linux
  - Java/Windows and Linux and Android

### Meeting scenarios

The Speech SDK is perfect for transcribing meeting scenarios, whether from a single device or multidevice conversation.

#### Conversation transcription

[Conversation transcription](conversation-transcription.md) enables real-time, and asynchronous, speech recognition, speaker identification, and sentence attribution to each speaker. This process is also known as *diarization*. It's perfect for transcribing in-person meetings with the ability to distinguish speakers.

**Conversation transcription** is available on the following platforms:

  - C++/Windows and Linux
  - C# (Framework and .NET Core)/Windows and UWP and Linux
  - Java/Windows and Linux and Android

#### Multidevice conversation

With [multidevice conversation](multi-device-conversation.md), you can connect multiple devices or clients in a conversation to send speech-based or text-based messages, with easy support for transcription and translation.

**Multidevice conversation** is available on the following platforms:

  - C++/Windows
  - C# (Framework and .NET Core)/Windows

### Custom/agent scenarios

The Speech SDK can be used for transcribing call center scenarios, where telephony data is generated.

#### Call center transcription

[Call center transcription](call-center-transcription.md) is a common scenario for speech-to-text for transcribing large volumes of telephony data that might come from various systems, such as interactive voice response. The latest speech recognition models from the Speech service excel at transcribing this telephony data, even in cases when the data is difficult for a human to understand.

**Call center transcription** is available through the batch Speech service via its REST API and can be used in any situation.

### Codec-compressed audio input

Several of the Speech SDK programming languages support codec-compressed audio input streams. For more information, see <a href="/azure/cognitive-services/speech-service/how-to-use-codec-compressed-audio-input-streams" target="_blank">Use compressed audio input formats</a>.

**Codec-compressed audio input** is available on the following platforms:

  - C++/Linux
  - C#/Linux
  - Java/Linux, Android, and iOS

## REST API

The Speech SDK covers many feature capabilities of the Speech service, but for some scenarios you might want to use the REST API.

### Batch transcription

[Batch transcription](batch-transcription.md) enables asynchronous speech-to-text transcription of large volumes of data. Batch transcription is only possible from the REST API. In addition to converting speech audio to text, batch speech-to-text also allows for diarization and sentiment analysis.

## Customization

The Speech service delivers great functionality with its default models across speech-to-text, text-to-speech, and speech translation. Sometimes you might want to increase the baseline performance to work even better with your unique use case. The Speech service has various no-code customization tools that make it easy. You can use them to create a competitive advantage with custom models based on your own data. These models will only be available to you and your organization.

### Custom speech-to-text

When you use speech-to-text for recognition and transcription in a unique environment, you can create and train custom acoustic, language, and pronunciation models to address ambient noise or industry-specific vocabulary. The creation and management of no-code Custom Speech models is available in the [Speech Studio](./custom-speech-overview.md). After the Custom Speech model is published, it can be consumed by the Speech SDK.

### Custom text-to-speech

Custom text-to-speech, also known as Custom Voice, is a set of online tools that allow you to create a recognizable, one-of-a-kind voice for your brand. The creation and management of no-code Custom Voice models is available through the [Custom Voice portal](https://aka.ms/customvoice). After the Custom Voice model is published, it can be consumed by the Speech SDK.

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

* [Create a free Azure account](https://azure.microsoft.com/free/cognitive-services/)
* [See how to recognize speech in C#](./get-started-speech-to-text.md?pivots=programming-language-csharp&tabs=dotnet)
