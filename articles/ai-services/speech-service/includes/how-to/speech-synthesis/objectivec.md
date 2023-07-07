---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 9/22/2020
ms.author: eur
---

[!INCLUDE [Header](../../common/objectivec.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

### Install the Speech SDK and samples

The [Azure-Samples/cognitive-services-speech-sdk](https://github.com/Azure-Samples/cognitive-services-speech-sdk) repository contains samples written in Objective-C for iOS and Mac. Select a link to see installation instructions for each sample:

* [Synthesize speech in Objective-C on macOS](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/objectivec/macos/text-to-speech)
* [Synthesize speech in Objective-C on iOS](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/objectivec/ios/text-to-speech)
* [Additional samples for Objective-C on iOS](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/objective-c/ios)

## Run and use a container

Speech containers provide websocket-based query endpoint APIs that are accessed through the Speech SDK and Speech CLI. By default, the Speech SDK and Speech CLI use the public Speech service. To use the container, you need to change the initialization method. Use a container host URL instead of key and region.

For more information about containers, see the [speech containers](../../../speech-container-howto.md#host-urls) how-to guide.

