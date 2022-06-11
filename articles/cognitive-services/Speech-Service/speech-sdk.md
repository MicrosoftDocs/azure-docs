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

The Speech SDK (software development kit) exposes many of the Speech service capabilities you can use to develop speech-enabled applications. The Speech SDK is available [in many programming languages](quickstarts/setup-platform.md) and across all platforms. The Speech SDK is ideal for both real-time and non-real-time scenarios, by using local devices, files, Azure Blob Storage, and even input and output streams.

| SDK | Platform support |
|----------------------|----------|
| [.NET SDK](/dotnet/api/overview/azure/cognitiveservices/client/speechservice) <sup>1</sup> | Windows, Linux, macOS, Mono, Xamarin.iOS, Xamarin.Mac, Xamarin.Android, UWP, Unity |
| [C++ SDK](/cpp/cognitive-services/speech/) | Windows, Linux, macOS |
| [Go SDK](https://github.com/Microsoft/cognitive-services-speech-sdk-go) | Linux | 
| [Java SDK](/java/api/com.microsoft.cognitiveservices.speech) | Android, Windows, Linux, macOS |
| [JavaScript SDK](/javascript/api/microsoft-cognitiveservices-speech-sdk/) | Browser, Node.js |
| [Objective-C SDK](/objectivec/cognitive-services/speech/) | iOS, macOS |
| [Python SDK](/python/api/azure-cognitiveservices-speech/) | Windows, Linux, macOS |

<sup>1 The Speech SDK for C# is based on .NET Standard 2.0, so it supports many platforms. For more information, see [.NET implementation support](/dotnet/standard/net-standard#net-implementation-support).</sup>

> [!IMPORTANT]
> C isn't a supported programming language for the Speech SDK. Several supported programming languages, for example, C++, include C headers that are part of a common Application Binary Interface (ABI) layer. These ABI headers are *not* intended for direct use and are subject to change across versions.

## Platform requirements

Before you install the Speech SDK on Windows or Linux, make sure you have the following prerequisites:

# [Windows](#tab/windows)

[!INCLUDE [Get the Speech SDK](includes/get-speech-sdk-windows.md)]

# [Linux](#tab/linux)

[!INCLUDE [Get the Speech SDK](includes/get-speech-sdk-linux.md)]

---

## REST API

In some cases, you can't or shouldn't use the [Speech SDK](speech-sdk.md). In those cases, you can use REST APIs to access the Speech service. For example, use REST APIs for [batch transcription](batch-transcription.md) and [speaker recognition](/rest/api/speakerrecognition/) REST APIs.


## Code examples

The Speech SDK team actively maintains a large set of examples in an open-source repository. For the sample source code repository, see the <a href="https://aka.ms/csspeech/samples" target="_blank">Microsoft Cognitive Services Speech SDK on GitHub <span class="docon docon-navigate-external x-hidden-focus"></span></a>. There are samples for C#, C++, Java, Python, Objective-C, Swift, JavaScript, UWP, Unity, and Xamarin.

## Next steps

* [Install the SDK](quickstarts/setup-platform.md)
* [Try the speech to text quickstart](./get-started-speech-to-text.md)
