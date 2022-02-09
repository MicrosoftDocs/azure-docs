---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/09/2020
ms.author: eur
---

Handling compressed audio is implemented by using [GStreamer](https://gstreamer.freedesktop.org). For licensing reasons, GStreamer binaries aren't compiled and linked with the Speech SDK. You need to install several dependencies and plug-ins. For more information, see [Installing on Windows](https://gstreamer.freedesktop.org/documentation/installing/on-windows.html?gi-language=c) or [Installing on Linux](https://gstreamer.freedesktop.org/documentation/installing/on-linux.html?gi-language=c).

GStreamer binaries need to be in the system path so that the Speech SDK can load the binaries during runtime. For example, on Windows, if the Speech SDK finds `libgstreamer-1.0-0.dll` or `gstreamer-1.0-0.dll` (for the latest GStreamer) during runtime, it means the GStreamer binaries are in the system path.

