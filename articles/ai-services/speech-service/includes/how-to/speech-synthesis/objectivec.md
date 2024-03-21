---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 08/30/2023
ms.author: eur
---

[!INCLUDE [Header](../../common/objectivec.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

### Install the Speech SDK and samples

The [Azure-Samples/cognitive-services-speech-sdk](https://github.com/Azure-Samples/cognitive-services-speech-sdk) repository contains samples written in Objective-C for iOS and Mac. Select a link to see installation instructions for each sample:

- [Synthesize speech in Objective-C on macOS](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/objectivec/macos/text-to-speech)
- [Synthesize speech in Objective-C on iOS](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/objectivec/ios/text-to-speech)
- [More samples for Objective-C on iOS](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/objective-c/ios)

## Use a custom endpoint

The custom endpoint is functionally identical to the standard endpoint that's used for text to speech requests. 

One difference is that the `EndpointId` must be specified to use your custom voice via the Speech SDK. You can start with the [text to speech quickstart](../../../get-started-text-to-speech.md) and then update the code with the `EndpointId` and `SpeechSynthesisVoiceName`.

```ObjectiveC
SPXSpeechConfiguration *speechConfig = [[SPXSpeechConfiguration alloc] initWithSubscription:speechKey region:speechRegion];
speechConfig.speechSynthesisVoiceName = @"YourCustomVoiceName";
speechConfig.EndpointId = @"YourEndpointId";
```

To use a custom voice via [Speech Synthesis Markup Language (SSML)](../../../speech-synthesis-markup-voice.md#use-voice-elements), specify the model name as the voice name. This example uses the `YourCustomVoiceName` voice. 

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="YourCustomVoiceName">
        This is the text that is spoken. 
    </voice>
</speak>
```

## Run and use a container

Speech containers provide websocket-based query endpoint APIs that are accessed through the Speech SDK and Speech CLI. By default, the Speech SDK and Speech CLI use the public Speech service. To use the container, you need to change the initialization method. Use a container host URL instead of key and region.

For more information about containers, see [Install and run Speech containers with Docker](../../../speech-container-howto.md).
