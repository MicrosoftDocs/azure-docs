---
title: About the Speech SDK - Speech service
titleSuffix: Azure Cognitive Services
description: The Speech software development kit (SDK) exposes many of the Speech service capabilities, making it easier to develop speech-enabled applications.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/03/2020
ms.author: dapine
---

# About the Speech SDK

The Speech software development kit (SDK) exposes many of the Speech service capabilities, to empower you to develop speech-enabled applications. The Speech SDK is available in many programming languages, all of which work cross-platform, except for Objective-C, which is only available on iOS and macOS.

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

A common scenario for speech-to-text is transcribing large volumes of telephony data that may come from various systems, such as Interactive Voice Response (IVR). The latest speech recognition models from the Speech service excel at transcribing this telephony data, even in cases when the data is difficult for a human to understand.

### Codec compressed audio input

Several of the Speech SDK programming languages support codec compressed audio input streams. For more information, see <a href="https://docs.microsoft.com/azure/cognitive-services/speech-service/how-to-use-codec-compressed-audio-input-streams" target="_blank">use compressed audio input formats <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

## REST API

While the Speech SDK covers many feature capabilities of the Speech Service, for some scenarios you might want to use the REST API. Certain functionalities are only available from the Azure portal, Custom Speech portal, Custom Voice portal, or the REST API. As an example, endpoint management is only exposed via the REST API.

> [!TIP]
> When relying on the REST API, use the <a href="https://editor.swagger.io/" target="_blank">Swagger Editor <span class="docon docon-navigate-external x-hidden-focus"></span></a> to automatically generate client libraries.
> For example, to generate a Batch transcription client library:
> 1. Select **File** > **Import URL**
> 1. Paste `https://westus.cris.ai/swagger/ui/index#/Custom%20Speech%20transcriptions%3A`
> 1. Select **Generate Client** and choose your desired programming language

### Batch transcription

[Batch transcription](batch-transcription.md) enables asynchronous speech-to-text transcription of large volumes of data. Batch transcription is only possible from the REST API.

## Customization

The Speech Service delivers great functionality with its default models across speech-to-text, text-to-speech, and speech-translation. Sometimes you may want to increase the baseline performance to work even better with your unique use case. The Speech Service has a variety of no-code customization tools that make it easy, and allow you to create a competitive advantage with custom models based on your own data. These models will only be available to you and your organization.

### Custom Speech-to-text

When using speech-to-text for recognition and transcription in a unique environment, you can create and train custom acoustic, language, and pronunciation models to address ambient noise or industry-specific vocabulary. The creation and management of no-code Custom Speech models is available through the [Custom Speech Portal](https://aka.ms/customspeech). Once the Custom Speech model is published, it can be consumed by the Speech SDK.

### Custom Text-to-speech

Custom text-to-speech, also known as Custom Voice is a set of online tools that allow you to create a recognizable, one-of-a-kind voice for your brand. The creation and management of no-code Custom Voice models is available through the [Custom Voice Portal](https://aka.ms/customvoice). Once the Custom Voice model is published, it can be consumed by the Speech SDK.

## Get the SDK

# [Windows](#tab/windows)

> [!WARNING]
> The Speech SDK supports Windows 10 and Windows Server 2016, or later versions. Earlier versions are **not supported**.

The Speech SDK requires the <a href="https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads" target="_blank">Microsoft Visual C++ Redistributable for Visual Studio 2019 <span class="docon docon-navigate-external x-hidden-focus"></span></a> on the system.

- <a href="https://aka.ms/vs/16/release/vc_redist.x86.exe" target="_blank">Install for x86 <span class="docon docon-navigate-external x-hidden-focus"></span></a>
- <a href="https://aka.ms/vs/16/release/vc_redist.x64.exe" target="_blank">Install for x64 <span class="docon docon-navigate-external x-hidden-focus"></span></a>
- <a href="https://aka.ms/vs/16/release/vc_redist.arm64.exe" target="_blank">Install for ARMx64 <span class="docon docon-navigate-external x-hidden-focus"></span></a>

For microphone input, the Media Foundation libraries must be installed. These libraries are part of Windows 10 and Windows Server 2016. It's possible to use the Speech SDK without these libraries, as long as a microphone isn't used as the audio input device.

The required Speech SDK files can be deployed in the same directory as your application. This way your application can directly access the libraries. Make sure you select the correct version (x86/x64) that matches your application.

| Name                                            | Function                                             |
|-------------------------------------------------|------------------------------------------------------|
| `Microsoft.CognitiveServices.Speech.core.dll`   | Core SDK, required for native and managed deployment |
| `Microsoft.CognitiveServices.Speech.csharp.dll` | Required for managed deployment                      |

> [!NOTE]
> Starting with the release 1.3.0 the file `Microsoft.CognitiveServices.Speech.csharp.bindings.dll` (shipped in previous releases) isn't needed anymore. The functionality is now integrated in the core SDK.

> [!NOTE]
> For the Windows Forms App (.NET Framework) C# project, make sure the libraries are included in your project's deployment settings. You can check this under `Properties -> Publish Section`. Click the `Application Files` button and find corresponding libraries from the scroll down list. Make sure the value is set to `Included`. Visual Studio will include the file when project is published/deployed.

For Windows, we support the following languages:

* C# (UWP and .NET), C++:
  You can reference and use the latest version of our Speech SDK NuGet package. The package includes 32-bit and 64-bit client libraries and managed (.NET) libraries. The SDK can be installed in Visual Studio by using NuGet, [Microsoft.CognitiveServices.Speech](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech).

* Java:
  You can reference and use the latest version of our Speech SDK Maven package, which supports only Windows x64. In your Maven project, add `https://csspeechstorage.blob.core.windows.net/maven/` as an additional repository and reference `com.microsoft.cognitiveservices.speech:client-sdk:1.8.0` as a dependency.

# [Linux](#tab/linux)

> [!NOTE]
> Currently, we only support the following distributions and development languages/platforms:
>
> | Distribution | Development |
> |:-|:-|
> |Ubuntu 16.04 x86     |C++|
> |Ubuntu 16.04 x64     |C++, Java, .NET Core, Python|
> |Ubuntu 16.04 ARM32   |C++, Java, .NET Core|
> |Ubuntu 16.04 ARM64   |C++, Java, .NET Core[<sup>[1]</sup>](#footnote1)|
> |Ubuntu 18.04 x86     |C++|
> |Ubuntu 18.04 x64     |C++, Java, .NET Core, Python|
> |Ubuntu 18.04 ARM32   |C++, Java, .NET Core|
> |Ubuntu 18.04 ARM64   |C++, Java, .NET Core[<sup>[1]</sup>](#footnote1)|
> |Debian 9 x86         |C++|
> |Debian 9 x64         |C++, Java, .NET Core, Python|
> |Debian 9 ARM32       |C++, Java, .NET Core|
> |Debian 9 ARM64       |C++, Java, .NET Core[<sup>[1]</sup>](#footnote1)|
> |Red Hat Enterprise Linux (RHEL) 7 x64[<sup>[2]</sup>](#footnote2) |C++, Java, .NET Core, Python|
> |Red Hat Enterprise Linux (RHEL) 8 x64                             |C++, Java, .NET Core, Python|
> |CentOS 7 x64[<sup>[2]</sup>](#footnote2) |C++, Java, .NET Core, Python|
> |CentOS 8 x64                             |C++, Java, .NET Core, Python|
>
> **[<a name="footnote1">1</a>]** Linux ARM64 requires .NET Core 3.x (dotnet-sdk-3.x package) for proper ARM64 support.<br>
> **[<a name="footnote2">2</a>]** Follow the instructions on [how to configure RHEL/CentOS 7 for Speech SDK](~/articles/cognitive-services/speech-service/how-to-configure-rhel-centos-7.md).


Make sure you have the required libraries installed by running the following shell commands:

On Ubuntu:

```sh
sudo apt-get update
sudo apt-get install libssl1.0.0 libasound2
```

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
