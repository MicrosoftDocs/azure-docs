---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 9/22/2020
ms.author: eur
---

[!INCLUDE [Header](../../common/objectivec.md)]

[!INCLUDE [Introduction](intro.md)]

## GStreamer configuration

Handling compressed audio is implemented using [GStreamer](https://gstreamer.freedesktop.org). For licensing reasons GStreamer binaries are not compiled and linked with the Speech SDK. Instead, a wrapper library containing these functions needs to be built and shipped with the apps using the SDK.

To build this wrapper library, first download and install the [GStreamer SDK](https://gstreamer.freedesktop.org/data/pkg/ios/1.16.0/gstreamer-1.0-devel-1.16.0-ios-universal.pkg). Then, download the **Xcode** project for the [wrapper library](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/objective-c/ios/compressed-streams/GStreamerWrapper).

Open the project in **Xcode** and build it for the **Generic iOS Device** target -- it will *not* work to build it for a specific target.

The build step will generate a dynamic framework bundle with a dynamic library for all necessary architectures with the name of `GStreamerWrapper.framework`.

This framework must be included in all apps that use compressed audio streams with the Speech service SDK.

Apply the following settings in your **Xcode** project to accomplish this:

1. Copy the `GStreamerWrapper.framework` you just built and the framework of the Cognitive Services Speech SDK, which you can download from [here](https://aka.ms/csspeech/iosbinary), to the directory containing your sample project.
1. Adjust the paths to the frameworks in the *Project Settings*.
   1. In the **General** tab under the **Embedded Binaries** header, add the SDK library as a framework: **Add embedded binaries** > **Add other...** > Navigate to the directory you chose and select both frameworks.
   1. Go to the **Build Settings** tab and activate **All** settings.
1. Add the directory `$(SRCROOT)/..` to the _Framework Search Paths_ under the **Search Paths** heading.

## Example

To configure Speech SDK to accept compressed audio input, create a `SPXPullAudioInputStream` or `SPXPushAudioInputStream`.

The following snippet shows how to create a `SPXAudioConfiguration` from an instance of a `SPXPushAudioInputStream`, specifying an MP3 as the compression format of the stream.

:::code language="objectivec" source="~/samples-cognitive-services-speech-sdk/samples/objective-c/ios/compressed-streams/CompressedStreamsSample/CompressedStreamsSample/ViewController.m" id="setup-stream":::

The next snippet shows how compressed audio data can be read from a file and pumped into the `SPXPushAudioInputStream`.

:::code language="objectivec" source="~/samples-cognitive-services-speech-sdk/samples/objective-c/ios/compressed-streams/CompressedStreamsSample/CompressedStreamsSample/ViewController.m" id="push-compressed-stream":::
