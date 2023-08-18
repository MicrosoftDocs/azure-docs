---
title: About the Speech SDK - Speech service
titleSuffix: Azure AI services
description: The Speech software development kit (SDK) exposes many of the Speech service capabilities, making it easier to develop speech-enabled applications.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: overview
ms.date: 09/16/2022
ms.author: eur
---

# What is the Speech SDK?

The Speech SDK (software development kit) exposes many of the [Speech service capabilities](overview.md), so you can develop speech-enabled applications. The Speech SDK is available [in many programming languages](quickstarts/setup-platform.md) and across platforms. The Speech SDK is ideal for both real-time and non-real-time scenarios, by using local devices, files, Azure Blob Storage, and input and output streams.

In some cases, you can't or shouldn't use the [Speech SDK](speech-sdk.md). In those cases, you can use REST APIs to access the Speech service. For example, use the [Speech to text REST API](rest-speech-to-text.md) for [batch transcription](batch-transcription.md) and [custom speech](custom-speech-overview.md).

## Supported languages

The Speech SDK supports the following languages and platforms:

| Programming language | Reference | Platform support |
|----------------------|----------|----------|
| [C#](quickstarts/setup-platform.md?pivots=programming-language-csharp) <sup>1</sup> | [.NET](/dotnet/api/microsoft.cognitiveservices.speech) | Windows, Linux, macOS, Mono, Xamarin.iOS, Xamarin.Mac, Xamarin.Android, UWP, Unity |
| [C++](quickstarts/setup-platform.md?pivots=programming-language-cpp) <sup>2</sup> | [C++](/cpp/cognitive-services/speech/) | Windows, Linux, macOS |
| [Go](quickstarts/setup-platform.md?pivots=programming-language-go) | [Go](https://github.com/Microsoft/cognitive-services-speech-sdk-go) | Linux | 
| [Java](quickstarts/setup-platform.md?pivots=programming-language-java) | [Java](/java/api/com.microsoft.cognitiveservices.speech) | Android, Windows, Linux, macOS |
| [JavaScript](quickstarts/setup-platform.md?pivots=programming-language-javascript) | [JavaScript](/javascript/api/microsoft-cognitiveservices-speech-sdk/) | Browser, Node.js |
| [Objective-C](quickstarts/setup-platform.md?pivots=programming-language-objectivec) | [Objective-C](/objectivec/cognitive-services/speech/) | iOS, macOS |
| [Python](quickstarts/setup-platform.md?pivots=programming-language-python) | [Python](/python/api/azure-cognitiveservices-speech/) | Windows, Linux, macOS |
| [Swift](quickstarts/setup-platform.md?pivots=programming-language-swift) | [Objective-C](/objectivec/cognitive-services/speech/) <sup>3</sup> | iOS, macOS |

<sup>1 C# code samples are available in the documentation. The Speech SDK for C# is based on .NET Standard 2.0, so it supports many platforms and programming languages. For more information, see [.NET implementation support](/dotnet/standard/net-standard#net-implementation-support).</sup>  
<sup>2 C isn't a supported programming language for the Speech SDK.</sup>  
<sup>3 The Speech SDK for Swift shares client libraries and reference documentation with the Speech SDK for Objective-C.</sup>  

[!INCLUDE [License Notice](~/articles/ai-services/speech-service/includes/cognitive-services-speech-service-license-notice.md)]

## Speech SDK demo

The following video shows how to install the [Speech SDK for C#](quickstarts/setup-platform.md) and write a simple .NET console application for speech to text.

> [!VIDEO c20d3b0c-e96a-4154-9299-155e27db7117]

## Code samples

Speech SDK code samples are available in the documentation and GitHub. 

### Docs samples

At the top of documentation pages that contain samples, options to select include C#, C++, Go, Java, JavaScript, Objective-C, Python, or Swift.

:::image type="content" source="./media/sdk/pivot-programming-languages-speech-sdk.png" alt-text="Screenshot showing how to select a programming language in the documentation.":::

If a sample is not available in your preferred programming language, you can select another programming language to get started and learn about the concepts, or see the reference and samples linked from the beginning of the article.

### GitHub samples

In depth samples are available in the [Azure-Samples/cognitive-services-speech-sdk](https://aka.ms/csspeech/samples) repository on GitHub. There are samples for C# (including UWP, Unity, and Xamarin), C++, Java, JavaScript (including Browser and Node.js), Objective-C, Python, and Swift. Code samples for Go are available in the [Microsoft/cognitive-services-speech-sdk-go](https://github.com/Microsoft/cognitive-services-speech-sdk-go) repository on GitHub.

## Help options

The [Microsoft Q&A](/answers/topics/azure-speech.html) and [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-speech) forums are available for the developer community to ask and answer questions about Azure Cognitive Speech and other services. Microsoft monitors the forums and replies to questions that the community has not yet answered. To make sure that we see your question, tag it with 'azure-speech'.  

You can suggest an idea or report a bug by creating an issue on GitHub:
- [Azure-Samples/cognitive-services-speech-sdk](https://aka.ms/GHspeechissues)
- [Microsoft/cognitive-services-speech-sdk-go](https://github.com/microsoft/cognitive-services-speech-sdk-go/issues)
- [Microsoft/cognitive-services-speech-sdk-js](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues)

See also [Azure AI services support and help options](../cognitive-services-support-options.md?context=/azure/ai-services/speech-service/context/context) to get support, stay up-to-date, give feedback, and report bugs for Azure AI services.

## Next steps

* [Install the SDK](quickstarts/setup-platform.md)
* [Try the speech to text quickstart](./get-started-speech-to-text.md)
