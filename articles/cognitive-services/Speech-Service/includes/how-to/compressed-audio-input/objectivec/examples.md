---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/09/2020
ms.author: eur
---

To configure Speech SDK to accept compressed audio input, create a `SPXPullAudioInputStream` or `SPXPushAudioInputStream`.

The following snippet shows how to create a `SPXAudioConfiguration` from an instance of a `SPXPushAudioInputStream`, specifying an MP3 as the compression format of the stream.

:::code language="objectivec" source="~/samples-cognitive-services-speech-sdk/samples/objective-c/ios/compressed-streams/CompressedStreamsSample/CompressedStreamsSample/ViewController.m" id="setup-stream":::

The next snippet shows how compressed audio data can be read from a file and pumped into the `SPXPushAudioInputStream`.

:::code language="objectivec" source="~/samples-cognitive-services-speech-sdk/samples/objective-c/ios/compressed-streams/CompressedStreamsSample/CompressedStreamsSample/ViewController.m" id="push-compressed-stream":::
