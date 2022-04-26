---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 09/08/2020
ms.author: eur
---

[!INCLUDE [Introduction](intro.md)]

## GStreamer configuration

Handling compressed audio is implemented by using [GStreamer](https://gstreamer.freedesktop.org). For licensing reasons, GStreamer binaries aren't compiled and linked with the Speech SDK. You need to install several dependencies and plug-ins. For more information, see [Installing on Windows](https://gstreamer.freedesktop.org/documentation/installing/on-windows.html?gi-language=c) or [Installing on Linux](https://gstreamer.freedesktop.org/documentation/installing/on-linux.html?gi-language=c).

GStreamer binaries need to be in the system path so that the Speech SDK can load the binaries during runtime. For example, on Windows, if the Speech SDK finds `libgstreamer-1.0-0.dll` during runtime, it means the GStreamer binaries are in the system path.

Choose a platform for installation instructions.

### [Linux](#tab/linux)

[!INCLUDE [Linux](gstreamer-linux.md)]

### [Windows](#tab/windows)

[!INCLUDE [Linux](gstreamer-windows.md)]

***

## Example

The `--format` option specifies the container format for the audio file being recognized. For an mp4 file, set the format to `any` as shown in the following command:

# [Terminal](#tab/terminal)

```console
spx recognize --file YourAudioFile.mp4 --format any
```

# [PowerShell](#tab/powershell)

```powershell
spx --% recognize --file YourAudioFile.mp4 --format any
```

***

To get a list of supported audio formats, run the following command:

# [Terminal](#tab/terminal)

```console
spx help recognize format
```

# [PowerShell](#tab/powershell)

```powershell
spx help recognize format
```

***

