---
title: Stream codec-compressed audio with the Speech SDK - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to stream compressed audio to the Speech service with the Speech SDK. 
services: cognitive-services
author: eric-urban
ms.author: eur
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/13/2022
ms.devlang: cpp, csharp, golang, java, python
ms.custom: devx-track-csharp
zone_pivot_groups: programming-languages-set-twenty-eight
---

# Stream codec-compressed audio

The Speech SDK and Speech CLI use GStreamer to support different kinds of input audio formats. GStreamer decompresses the audio before it's sent over the wire to the Speech service as raw PCM.

[!INCLUDE [supported-audio-formats](includes/supported-audio-formats.md)]

## Installing GStreamer

Choose a platform for installation instructions. 

Platform | Languages | Supported GStreamer version
| :--- | ---: | :---:
Android  | Java | [1.18.3](https://gstreamer.freedesktop.org/data/pkg/android/1.18.3/) 
Linux  | C++, C#, Java, Python, Go | [Supported Linux distributions and target architectures](~/articles/cognitive-services/speech-service/speech-sdk.md) 
Windows (excluding UWP) | C++, C#, Java, Python | [1.18.3](https://gstreamer.freedesktop.org/data/pkg/windows/1.18.3/msvc/gstreamer-1.0-msvc-x86_64-1.18.3.msi) 

### [Android](#tab/android)

See [GStreamer configuration by programming language](#gstreamer-configuration) for the details about building libgstreamer_android.so.

For more information, see [Android installation instructions](https://gstreamer.freedesktop.org/documentation/installing/for-android-development.html?gi-language=c). 

### [Linux](#tab/linux)

For more information, see [Linux installation instructions](https://gstreamer.freedesktop.org/documentation/installing/on-linux.html?gi-language=c).  

```sh
sudo apt install libgstreamer1.0-0 \
gstreamer1.0-plugins-base \
gstreamer1.0-plugins-good \
gstreamer1.0-plugins-bad \
gstreamer1.0-plugins-ugly
```
### [Windows](#tab/windows)

Make sure that packages of the same platform (x64 or x86) are installed. For example, if you installed the x64 package for Python, then you need to install the x64 GStreamer package. The instructions below are for the x64 packages. 

1. Create a folder c:\gstreamer
1. Download [installer](https://gstreamer.freedesktop.org/data/pkg/windows/1.18.3/msvc/gstreamer-1.0-msvc-x86_64-1.18.3.msi) 
1. Copy the installer to c:\gstreamer
1. Open PowerShell as an administrator.
1. Run the following command in the PowerShell:

    ```powershell
    cd c:\gstreamer
    msiexec /passive INSTALLLEVEL=1000 INSTALLDIR=C:\gstreamer /i gstreamer-1.0-msvc-x86_64-1.18.3.msi
    ```

1. Add the system variables GST_PLUGIN_PATH with value C:\gstreamer\1.0\msvc_x86_64\lib\gstreamer-1.0
1. Add the system variables GSTREAMER_ROOT_X86_64 with value C:\gstreamer\1.0\msvc_x86_64
1. Add another entry in the path variable as C:\gstreamer\1.0\msvc_x86_64\bin
1. Reboot the machine

For more information about GStreamer, see [Windows installation instructions](https://gstreamer.freedesktop.org/documentation/installing/on-windows.html?gi-language=c). 

***

## GStreamer configuration

> [!NOTE]
> GStreamer configuration requirements vary by programming language. For details, choose your programming language at the top of this page. The contents of this section will be updated. 

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

## Example

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
