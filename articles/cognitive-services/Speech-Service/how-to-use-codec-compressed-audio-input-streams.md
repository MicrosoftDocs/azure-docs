---
title: Stream codec compressed audio with the Speech SDK - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to stream compressed audio to the Speech service with the Speech SDK. Available for C++, C#, and Java for Linux, Java in Android and Objective-C in iOS.
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/30/2020
ms.custom: devx-track-csharp
zone_pivot_groups: programming-languages-set-twenty-eight
---

# Use codec compressed audio input

The Speech SDK and Speech CLI can accept compressed audio formats using GStreamer. GStreamer decompresses the audio before it is sent over the wire to the Speech service as raw PCM.

Platform | Languages | Supported GStreamer version
| :--- | ---: | :---:
Linux  | C++, C#, Java, Python, Go | [Supported Linux distributions and target architectures](~/articles/cognitive-services/speech-service/speech-sdk.md) 
Windows (excluding UWP) | C++, C#, Java, Python | [1.18.3](https://gstreamer.freedesktop.org/data/pkg/windows/1.18.3/msvc/gstreamer-1.0-msvc-x86_64-1.18.3.msi) 
Android  | Java | [1.18.3](https://gstreamer.freedesktop.org/data/pkg/android/1.18.3/) 

## Installing GStreamer on Linux

For more information, see [Linux installation instructions](https://gstreamer.freedesktop.org/documentation/installing/on-linux.html?gi-language=c).  

```sh
sudo apt install libgstreamer1.0-0 \
gstreamer1.0-plugins-base \
gstreamer1.0-plugins-good \
gstreamer1.0-plugins-bad \
gstreamer1.0-plugins-ugly
```
## Installing GStreamer on Windows

For more information, see [Windows installation instructions](https://gstreamer.freedesktop.org/documentation/installing/on-windows.html?gi-language=c). 

* Create a folder c:\gstreamer
* Download [installer](https://gstreamer.freedesktop.org/data/pkg/windows/1.18.3/msvc/gstreamer-1.0-msvc-x86_64-1.18.3.msi) 
* Copy the installer to c:\gstreamer
* Open PowerShell as an administrator.
* Run the following command in the PowerShell:

```powershell
cd c:\gstreamer
msiexec /passive INSTALLLEVEL=1000 INSTALLDIR=C:\gstreamer /i gstreamer-1.0-msvc-x86_64-1.18.3.msi
```
* Add the system variables GST_PLUGIN_PATH with value C:\gstreamer\1.0\msvc_x86_64\lib\gstreamer-1.0
* Add the system variables GSTREAMER_ROOT_X86_64 with value C:\gstreamer\1.0\msvc_x86_64
* Add another entry in the path variable as C:\gstreamer\1.0\msvc_x86_64\bin
* Reboot the machine

## Using GStreamer in Android
Look at the Java tab above for the details about building libgstreamer_android.so 

For more information see [Android installation instructions](https://gstreamer.freedesktop.org/documentation/installing/for-android-development.html?gi-language=c). 

## Speech SDK version required for compressed audio input
* Speech SDK version 1.10.0 or later is required for RHEL 8 and CentOS 8
* Speech SDK version 1.11.0 or later is required for Windows.
* Speech SDK version 1.16.0 or later for the latest GStreamer on Windows and Android.

[!INCLUDE [supported-audio-formats](includes/supported-audio-formats.md)]

## GStreamer required to handle compressed audio

::: zone pivot="programming-language-csharp"
[!INCLUDE [prerequisites](includes/how-to/compressed-audio-input/csharp/prerequisites.md)]
::: zone-end

::: zone pivot="programming-language-cpp"
[!INCLUDE [prerequisites](includes/how-to/compressed-audio-input/cpp/prerequisites.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [prerequisites](includes/how-to/compressed-audio-input/java/prerequisites.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [prerequisites](includes/how-to/compressed-audio-input/python/prerequisites.md)]
::: zone-end

::: zone pivot="programming-language-go"
[!INCLUDE [prerequisites](includes/how-to/compressed-audio-input/go/prerequisites.md)]
::: zone-end

## Example code using codec compressed audio input

::: zone pivot="programming-language-csharp"
[!INCLUDE [prerequisites](includes/how-to/compressed-audio-input/csharp/examples.md)]
::: zone-end

::: zone pivot="programming-language-cpp"
[!INCLUDE [prerequisites](includes/how-to/compressed-audio-input/cpp/examples.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [prerequisites](includes/how-to/compressed-audio-input/java/examples.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [prerequisites](includes/how-to/compressed-audio-input/python/examples.md)]
::: zone-end

::: zone pivot="programming-language-go"
[!INCLUDE [prerequisites](includes/how-to/compressed-audio-input/go/examples.md)]
::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Learn how to recognize speech](./get-started-speech-to-text.md)
