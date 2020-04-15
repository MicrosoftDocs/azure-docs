---
author: trevorbye
ms.service: cognitive-services
ms.topic: include
ms.date: 03/09/2020
ms.author: trbye
---

To stream in a compressed audio format to the Speech service, create a `SPXPullAudioInputStream` or `SPXPushAudioInputStream`.

The following snippet shows how to create a `SPXAudioConfiguration` from an instance of a `SPXPushAudioInputStream`, specifying an MP3 as the compression format of the stream.

[!code-objectivec[Set up the input stream](~/samples-cognitive-services-speech-sdk/samples/objective-c/ios/compressed-streams/CompressedStreamsSample/CompressedStreamsSample/ViewController.m?range=67-76&highlight=2-11)]

The next snippet shows how compressed audio data can be read from a file and pumped into the `SPXPushAudioInputStream`.

[!code-objectivec[Push compressed audio data into the stream](~/samples-cognitive-services-speech-sdk/samples/objective-c/ios/compressed-streams/CompressedStreamsSample/CompressedStreamsSample/ViewController.m?range=106-150&highlight=19-44)]
