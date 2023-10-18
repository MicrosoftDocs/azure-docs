---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 06/10/2022
ms.author: eur
---

The Speech SDK for Python is compatible with Windows, Linux, and macOS.

# [Windows](#tab/windows)

On Windows, you must use the 64-bit target architecture. Windows 10 or later is required.

You must install the [Microsoft Visual C++ Redistributable for Visual Studio 2015, 2017, 2019, and 2022](/cpp/windows/latest-supported-vc-redist?view=msvc-170&preserve-view=true) for your platform. Installing this package for the first time might require a restart.

> [!IMPORTANT]
> Make sure that packages of the same target architecture are installed. For example, if you install the x64 redistributable package, then you need to install the x64 Python package.

# [Linux](#tab/linux)

The Speech SDK for Python only supports **Ubuntu 18.04/20.04/22.04**, **Debian 10/11**, **Red Hat Enterprise Linux (RHEL) 8**, and **CentOS 8** on the x64 and ARM64 architectures when used with Linux.

[!INCLUDE [Linux distributions](linux-distributions.md)]

# [macOS](#tab/macos)

A macOS version 10.14 or later is required.

---

Install a version of [Python from 3.7 or later](https://www.python.org/downloads/). 

To check your installation, open a terminal and run the command `python --version`. If it's installed properly, you'll get a response like "Python 3.8.10". If you're using macOS or Linux, you might need to run the command `python3 --version` instead. To enable use of `python` instead of `python3`, run `alias python='python3'` to set up an alias. The Speech SDK quickstart samples specify `python` usage. 
