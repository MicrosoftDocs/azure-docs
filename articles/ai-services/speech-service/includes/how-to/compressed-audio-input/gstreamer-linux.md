---
author: eric-urban
ms.service: azure-ai-speech
ms.custom: linux-related-content
ms.topic: include
ms.date: 04/25/2022
ms.author: eur
---

You need to install several dependencies and plug-ins.

# [Ubuntu/Debian](#tab/debian)

```sh
sudo apt install libgstreamer1.0-0 \
gstreamer1.0-plugins-base \
gstreamer1.0-plugins-good \
gstreamer1.0-plugins-bad \
gstreamer1.0-plugins-ugly
```

---

For more information, see [Linux installation instructions](https://gstreamer.freedesktop.org/documentation/installing/on-linux.html?gi-language=c) and [supported Linux distributions and target architectures](~/articles/ai-services/speech-service/speech-sdk.md).
