---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 09/08/2020
ms.author: eur
---

[!INCLUDE [Introduction](intro.md)]

## GStreamer configuration

The Speech CLI can use [GStreamer](https://gstreamer.freedesktop.org) to handle compressed audio. For licensing reasons, GStreamer binaries aren't compiled and linked with the Speech CLI. You need to install some dependencies and plug-ins. 

GStreamer binaries must be in the system path so that they can be loaded by the Speech CLI at runtime. For example, on Windows, if the Speech CLI finds `libgstreamer-1.0-0.dll` or `gstreamer-1.0-0.dll` (for the latest GStreamer) during runtime, it means the GStreamer binaries are in the system path.

Choose a platform for installation instructions.

### [Linux](#tab/linux)

[!INCLUDE [Linux](gstreamer-linux.md)]

### [Windows](#tab/windows)

[!INCLUDE [Windows](gstreamer-windows.md)]

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

