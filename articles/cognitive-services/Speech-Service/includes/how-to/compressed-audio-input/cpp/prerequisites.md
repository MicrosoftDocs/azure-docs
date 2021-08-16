---
author: laujan
ms.service: cognitive-services
ms.topic: include
ms.date: 03/09/2020
ms.author: lajanuar
---

Handling compressed audio is implemented using [GStreamer](https://gstreamer.freedesktop.org). For licensing reasons GStreamer binaries are not compiled and linked with the Speech SDK. Developers need to install several dependencies and plugins.

> [!NOTE]
> For mandatory general setup on Linux, see [system requirements and setup instructions](~/articles/cognitive-services/speech-service/speech-sdk.md#get-the-speech-sdk).

# [Ubuntu/Debian](#tab/debian)

```sh
sudo apt install libgstreamer1.0-0 \
gstreamer1.0-plugins-base \
gstreamer1.0-plugins-good \
gstreamer1.0-plugins-bad \
gstreamer1.0-plugins-ugly
```

# [RHEL/CentOS](#tab/centos)

```sh
sudo yum install gstreamer1 \
gstreamer1-plugins-base \
gstreamer1-plugins-good \
gstreamer1-plugins-bad-free \
gstreamer1-plugins-ugly-free
```

> [!NOTE]
> - On RHEL/CentOS 7 and RHEL/CentOS 8, in case of using "ANY" compressed format, more GStreamer plugins needs to be installed if stream media format plugin is not in the above installed plugins. 


---