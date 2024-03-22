---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 02/02/2024
ms.author: eur
---

The Speech SDK for C++ is compatible with Windows, Linux, and macOS.

# [Windows](#tab/windows)

On Windows, you must use the 64-bit target architecture. Windows 10 or later is required.

Install the [Microsoft Visual C++ Redistributable for Visual Studio 2015, 2017, 2019, and 2022](/cpp/windows/latest-supported-vc-redist?view=msvc-170&preserve-view=true) for your platform. Installing this package for the first time might require a restart.

# [Linux](#tab/linux)

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

The Speech SDK for C++ only supports the following distributions on the x86 (Debian/Ubuntu), x64, ARM32 (Debian/Ubuntu), and ARM64 (Debian/Ubuntu) architectures:

- Ubuntu 18.04/20.04
- Debian 10/11
- Red Hat Enterprise Linux (RHEL) 7/8
- CentOS 7

[!INCLUDE [Linux distributions](linux-distributions.md)]

# [macOS](#tab/macos)

A macOS version 10.14 or later is required.

---
