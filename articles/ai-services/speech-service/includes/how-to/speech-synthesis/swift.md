---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 08/30/2023
ms.author: eur
---

[!INCLUDE [Header](../../common/swift.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

### Install the Speech SDK and samples

The [Azure-Samples/cognitive-services-speech-sdk](https://github.com/Azure-Samples/cognitive-services-speech-sdk) repository contains samples written in Swift for iOS and Mac. Select a link to see installation instructions for each sample:

- [Synthesize speech in Swift on macOS](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/swift/macos/text-to-speech)
- [Synthesize speech in Swift on iOS](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/swift/ios/text-to-speech)

## Run and use a container

Speech containers provide websocket-based query endpoint APIs that are accessed through the Speech SDK and Speech CLI. By default, the Speech SDK and Speech CLI use the public Speech service. To use the container, you need to change the initialization method. Use a container host URL instead of key and region.

For more information about containers, see [Install and run Speech containers with Docker](../../../speech-container-howto.md).
