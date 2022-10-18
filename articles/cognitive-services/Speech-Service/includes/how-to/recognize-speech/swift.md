---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 9/22/2020
ms.author: eur
---

[!INCLUDE [Header](../../common/swift.md)]

[!INCLUDE [Introduction](intro.md)]

## Install Speech SDK and samples

The [Azure-Samples/cognitive-services-speech-sdk](https://github.com/Azure-Samples/cognitive-services-speech-sdk) repository contains samples written in Swift for iOS and Mac. Select a link to see installation instructions for each sample:

* [Recognize speech in Swift on macOS](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/swift/macos/from-microphone)
* [Recognize speech in Swift on iOS](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/swift/ios/from-microphone)

For more information, see the [Speech SDK for Swift reference](/objectivec/cognitive-services/speech/).

## Use a custom endpoint

With [Custom Speech](../../../custom-speech-overview.md), you can upload your own data, test and train a custom model, compare accuracy between models, and deploy a model to a custom endpoint. The following example shows how to set a custom endpoint.

```swift
let speechConfig = SPXSpeechConfiguration(subscription: "YourSubscriptionKey", region: "YourServiceRegion");
speechConfig.endpointId = "YourEndpointId";
let speechRecognizer = SPXSpeechRecognizer(speechConfiguration: speechConfig);
```
