---
author: PatrickFarley
ms.service: azure-ai-vision
ms.topic: include
ms.date: 08/01/2023
ms.author: pafarley
---

The Vision SDK for Python is compatible with Windows and Linux.

# [Windows](#tab/windows)

On Windows, you must use the 64-bit target architecture. Windows 10 or later is required.

You must install the [Microsoft Visual C++ Redistributable for Visual Studio 2015, 2017, 2019, and 2022](/cpp/windows/latest-supported-vc-redist?view=msvc-170&preserve-view=true) for your platform. Installing this package for the first time might require a restart.

> [!IMPORTANT]
> Make sure that packages of the same target architecture are installed. For example, if you install the x64 redistributable package, then you need to install the x64 Python package.

# [Linux](#tab/linux)

The Vision SDK for Python only supports **Ubuntu 18.04/20.04/22.04** and **Debian 9/10/11** on the x64 architecture when used with Linux.

[!INCLUDE [Linux distributions](linux-distributions.md)]

---

Install a version of [Python from 3.8 or later](https://wiki.python.org/moin/BeginnersGuide/Download).

To check your installation, open a terminal and run the command `python --version`. If it's installed properly, you'll get a response like "Python 3.8.10". If you're using Linux, you might need to run the command `python3 --version` instead. To enable use of `python` instead of `python3`, run `alias python='python3'` to set up an alias. The Vision SDK quickstart samples specify `python` usage. 

Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check if you have pip installed by running `pip --version` on the command line.
