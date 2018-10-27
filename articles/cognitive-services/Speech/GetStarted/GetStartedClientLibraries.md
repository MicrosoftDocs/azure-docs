---
title: Get started with the Bing Speech Recognition API by using client libraries | Microsoft Docs
titlesuffix: Azure Cognitive Services
description: Use the Bing Speech client libraries in Microsoft Cognitive Services to develop applications that convert spoken audio to text.
services: cognitive-services
author: zhouwangzw
manager: wolfma
ms.service: cognitive-services
ms.component: bing-speech
ms.topic: article
ms.date: 09/18/2018
ms.author: zhouwang
---
# Get started with Bing Speech Service client libraries

[!INCLUDE [Deprecation note](../../../../includes/cognitive-services-bing-speech-api-deprecation-note.md)]

Besides making direct HTTP requests via a REST API, Bing Speech Service provides developers with Speech client libraries in different languages. The Speech client libraries:

- Support more advanced capabilities in speech recognition, such as intermediate results in real time, long audio stream (up to 10 minutes), and continuous recognition.
- Provide a simple and idiomatic API in the language of your preference.
- Hide low-level communication details.

Currently, the following Bing Speech client libraries are available:

- [C# desktop library](GetStartedCSharpDesktop.md)
- [C# service library](GetStartedCSharpServiceLibrary.md)
- [JavaScript library](GetStartedJSWebsockets.md)
- [Java library for Android](GetStartedJavaAndroid.md)
- [Objective-C library for iOS](Get-Started-ObjectiveC-iOS.md)

## Additional resources

- The [samples](../samples.md) page provides complete samples to use Speech client libraries.
- If you need a client library that's not yet supported, you can create your own SDK. Implement the [Speech WebSocket protocol](../API-Reference-REST/websocketprotocol.md) on the platform and use the language of your choice.

## License

All Cognitive Services SDKs and samples are licensed with the MIT License. For more information, see [License](https://github.com/Microsoft/Cognitive-Speech-STT-JavaScript/blob/master/LICENSE.md).

