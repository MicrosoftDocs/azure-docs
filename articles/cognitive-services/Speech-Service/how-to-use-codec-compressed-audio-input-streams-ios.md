---
title: Stream codec compressed audio with the Speech SDK on iOS - Speech Service
titleSuffix: Azure Cognitive Services
description: Learn how to stream compressed audio to Azure Speech Services with the Speech SDK on iOS.
services: cognitive-services
author: chlandsi
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 09/20/2019
ms.author: chlandsi
---

# Using codec compressed audio input with the Speech SDK on iOS

The Speech SDK's **Compressed Audio Input Stream** API provides a way to stream compressed audio to the Speech Service using a pull or push stream.

> [!IMPORTANT]
> Speech SDK version 1.7.0 or higher is required for streaming compressed audio on iOS. It is also supported for [C++, C#, and Java on Linux (Ubuntu 16.04, Ubuntu 18.04, Debian 9)](how-to-use-codec-compressed-audio-input-streams.md) and [Java in Android.](how-to-use-codec-compressed-audio-input-streams-android.md)

For wav/PCM see the mainline speech documentation.  Outside of wav/PCM, the following codec compressed input formats are supported:

- MP3
- OPUS/OGG
- FLAC
- ALAW in wav container
- MULAW in wav container

## Prerequisites

Handling compressed audio is implemented using [GStreamer](https://gstreamer.freedesktop.org).
For licensing reasons, these functions can not be shipped with the SDK, but a wrapper library containing these functions needs to be built by application developers and shipped with the apps using the SDK.
To build this wrapper library, first download and install the [GStreamer SDK](https://gstreamer.freedesktop.org/data/pkg/ios/1.16.0/gstreamer-1.0-devel-1.16.0-ios-universal.pkg).
Then, download the Xcode project for the [wrapper library](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/objective-c/ios/compressed-streams/GStreamerWrapper).
Open the project in Xcode and build it for the **Generic iOS Device** target -- it will not work to build it for a specific target.
The build step will generate a dynamic framework bundle with a dynamic library for all necessary architectures with the name of `GStreamerWrapper.framework`.
This framework must be included in all apps that use compressed audio streams with the Speech Services SDK.

Apply the following settings in your Xcode project to accomplish this:

1. Copy both the `GStreamerWrapper.framework` you just built and the framework of the Cognitive Services Speech SDK, which you can download from [here](https://aka.ms/csspeech/iosbinary), to the directory containing your sample project.
1. Adjust the paths to the frameworks in the *Project Settings*.
    1. In the **General** tab under the **Embedded Binaries** header, add the SDK library as a framework: **Add embedded binaries** > **Add other...** > Navigate to the directory you chose and select both frameworks.
    1. Go to the **Build Settings** tab and activate **All** settings.
1. Add the directory `$(SRCROOT)/..` to the *Framework Search Paths* under the **Search Paths** heading.

## Example code using codec compressed audio input

To stream in a compressed audio format to the Speech Services, create a `SPXPullAudioInputStream` or `SPXPushAudioInputStream`.
The following snippet shows how to create an `SPXAudioConfiguration` from an instance of a `SPXPushAudioInputStream`, specifying mp3 as the compression format of the stream.

[!code-objectivec[Set up the input stream](~/samples-cognitive-services-speech-sdk/samples/objective-c/ios/compressed-streams/CompressedStreamsSample/CompressedStreamsSample/ViewController.m?range=66-77&highlight=2-11)]

The next snippet shows how compressed audio data can be read from a file and pumped into the `SPXPushAudioInputStream`.

[!code-objectivec[Push compressed audio data into the stream](~/samples-cognitive-services-speech-sdk/samples/objective-c/ios/compressed-streams/CompressedStreamsSample/CompressedStreamsSample/ViewController.m?range=105-151&highlight=19-44)]

## Next steps

- [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in Java](~/articles/cognitive-services/Speech-Service/quickstarts/speech-to-text-from-microphone.md?pivots=programming-language-java)
