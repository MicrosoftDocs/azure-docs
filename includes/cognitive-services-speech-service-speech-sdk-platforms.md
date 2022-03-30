---
author: trevorbye
ms.service: cognitive-services
ms.topic: include
ms.date: 03/03/2021
ms.author: trbye
---

| Programming language | Platform | SDK reference |
|----------------------|----------|---------------|
| C# <sup>1</sup> | Windows, Linux, macOS, Mono, Xamarin.iOS, Xamarin.Mac, Xamarin.Android, UWP, Unity | [.NET SDK](/dotnet/api/overview/azure/cognitiveservices/client/speechservice) |
| C++ | Windows, Linux, macOS | [C++ SDK](/cpp/cognitive-services/speech/)      |
| Go  | Linux | [Go SDK](https://github.com/Microsoft/cognitive-services-speech-sdk-go) |
| Java | Android, Windows, Linux, macOS | [Java SDK](/java/api/com.microsoft.cognitiveservices.speech) |
| JavaScript | Browser, Node.js | [JavaScript SDK](/javascript/api/microsoft-cognitiveservices-speech-sdk/) |
| Objective-C / Swift | iOS, macOS | [Objective-C SDK](/objectivec/cognitive-services/speech/) |
| Python | Windows, Linux, macOS | [Python SDK](/python/api/azure-cognitiveservices-speech/) |

<sup>1 The .NET Speech SDK is based on .NET Standard 2.0, so it supports many platforms. For more information, see [.NET implementation support](/dotnet/standard/net-standard#net-implementation-support).</sup>

> [!IMPORTANT]
> C isn't a supported programming language for the Speech SDK. Several supported programming languages, for example, C++, include C headers that are part of a common Application Binary Interface (ABI) layer. These ABI headers are *not* intended for direct use and are subject to change across versions.
