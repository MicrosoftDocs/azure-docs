---
author: PatrickFarley
ms.service: cognitive-services
ms.topic: include
ms.date: 08/01/2023
ms.author: pafarley
---

The Vision SDK for Java is compatible with Windows and Linux.

# [Windows](#tab/windows)

On Windows, you must use the 64-bit target architecture. Windows 10 or later is required.

The Java SDK uses native binaries. You must install the [Microsoft Visual C++ Redistributable for Visual Studio 2015, 2017, 2019, and 2022](/cpp/windows/latest-supported-vc-redist?view=msvc-170&preserve-view=true) for your platform. Installing this package for the first time might require a restart.

# [Linux](#tab/linux)

The Vision SDK for Java only supports **Ubuntu 18.04/20.04/22.04** and **Debian 9/10/11** on the x64 architecture when used with Linux.

[!INCLUDE [Linux distributions](linux-distributions.md)]

---

## JAVA Development Kit

Java 8 or above is required.

Install a Java Development Kit (JDK) such as [Azul Zulu OpenJDK](https://www.azul.com/downloads/?package=jdk), [Microsoft Build of OpenJDK](https://www.microsoft.com/openjdk), [Oracle Java](https://www.java.com/download/), or your preferred JDK. 

Run `java -version` from a command line to confirm successful installation and see the version. Make sure that the Java installation is native to the system architecture and not running through emulation.



