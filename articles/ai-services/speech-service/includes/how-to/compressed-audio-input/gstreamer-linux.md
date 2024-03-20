---
author: eric-urban
ms.service: azure-ai-speech
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

# [RHEL/CentOS](#tab/centos)

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

```sh
sudo yum install gstreamer1 \
gstreamer1-plugins-base \
gstreamer1-plugins-good \
gstreamer1-plugins-bad-free \
gstreamer1-plugins-ugly-free
```

> [!NOTE]
> On RHEL/CentOS 7 and RHEL/CentOS 8, in case of using "ANY" compressed format, more GStreamer plug-ins need to be installed if the stream media format plug-in isn't in the preceding installed plug-ins.

---

For more information, see [Linux installation instructions](https://gstreamer.freedesktop.org/documentation/installing/on-linux.html?gi-language=c) and [supported Linux distributions and target architectures](~/articles/ai-services/speech-service/speech-sdk.md).
