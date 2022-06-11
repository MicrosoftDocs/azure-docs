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

## Scenario capabilities

The Speech SDK exposes many features from the Speech service, but not all of them. The capabilities of the Speech SDK are often associated with scenarios. The Speech SDK is ideal for both real-time and non-real-time scenarios, by using local devices, files, Azure Blob Storage, and even input and output streams. When a scenario can't be achieved with the Speech SDK, look for a REST API alternative.

## REST API

The Speech SDK covers many feature capabilities of the Speech service, but for some scenarios you might want to use the REST API.

[Batch transcription](batch-transcription.md) enables asynchronous speech-to-text transcription of large volumes of data. Batch transcription is only possible from the REST API. In addition to converting speech audio to text, batch speech-to-text also allows for diarization and sentiment analysis.


## Platform requirements

Before you install the Speech SDK on Windows or Linux, make sure you have the following prerequisites:

# [Windows](#tab/windows)

[!INCLUDE [Get the Speech SDK](includes/get-speech-sdk-windows.md)]

# [Linux](#tab/linux)

[!INCLUDE [Get the Speech SDK](includes/get-speech-sdk-linux.md)]


---

[!INCLUDE [License notice](../../../includes/cognitive-services-speech-service-license-notice.md)]

[!INCLUDE [Sample source code](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]

## Next steps

* [Create a free Azure account](https://azure.microsoft.com/free/cognitive-services/)
* [See how to recognize speech in C#](./get-started-speech-to-text.md?pivots=programming-language-csharp&tabs=dotnet)
