---
title: Get Started with Microsoft Speech Recognition API Using Client Libraries | Microsoft Docs
description: Use the Microsoft Speech Client libraries in Microsoft Cognitive Services to develop applications that convert spoken audio to text.
services: cognitive-services
author: zhouwangzw
manager: wolfma

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 09/15/2017
ms.author: zhouwang
---
# Get started with Microsoft speech client libraries

Besides making direct HTTP requests via REST API, Microsoft Speech Services also provides developers with Speech Client Libraries in different languages. The Speech Client Libraries

- support more advanced capabilities in speech recognition, like getting intermediate results in real-time, long audio stream (up to 10 minutes), and continuous recognition.
- provide simple and idiomatic API in the language of your preference.
- hide low-level communication details.

Currently, the following Microsoft Speech Client Libraries are available:

- [C# desktop library](GetStartedCSharpDesktop.md)

- [C# service library](GetStartedCSharpServiceLibrary.md)

- [JavaScript library](GetStartedJSWebsockets.md)

- [Java library for Android](GetStartedJavaAndroid.md)

- [ObjectiveC library for iOS](Get-Started-ObjectiveC-iOS.md)

## Additional resources

- The [samples](../samples.md) page provides complete samples to use Speech Client Libraries.
- Creating your own SDK. If you need a client library that is not yet supported, you can create your own SDK by implementing the [Speech WebSocket Protocol](../API-Reference-REST/websocketprotocol.md) on the platform and using the language of your choice.

## License

All Microsoft Cognitive Services SDKs and samples are licensed with the MIT License. For more information, see [LICENSE](https://github.com/Microsoft/Cognitive-Speech-STT-JavaScript/blob/master/LICENSE.md).
