---
author: trevorbye
ms.service: cognitive-services
ms.topic: include
ms.date: 03/09/2020
ms.author: trbye
---

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
