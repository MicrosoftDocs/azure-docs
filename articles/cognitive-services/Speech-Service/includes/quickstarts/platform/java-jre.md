---
title: "Quickstart: Speech SDK for Java (Windows, Linux, macOS) platform setup - Speech service"
titleSuffix: Azure Cognitive Services
description: Use this guide to set up your platform for using Java (Windows, Linux, macOS) with the Speech service SDK.
services: cognitive-services
author: markamos
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 10/11/2019
ms.author: erhopf
---

This guide shows how to install the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) for 64-bit Java 8 JRE. If you just want the package name to get started on your own, the Java SDK is not available in the Maven central repository. Whether you're using Gradle or a `pom.xml` dependency file, you need to add a custom repository pointing to `https://csspeechstorage.blob.core.windows.net/maven/` (see below for package name).

> [!NOTE]
> For the Speech Devices SDK and the Roobo device, see [Speech Devices SDK](~/articles/cognitive-services/speech-service/speech-devices-sdk.md).

[!INCLUDE [License Notice](~/includes/cognitive-services-speech-service-license-notice.md)]

## Supported operating systems

- The Java Speech SDK package is available for these operating systems:
  - Windows: 64-bit only
  - Mac: macOS X version 10.13 or later
  - Linux: 64-bit only on Ubuntu 16.04, Ubuntu 18.04, Debian 9, RHEL 7/8, CentOS 7/8

## Prerequisites

- [Java 8](https://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html) or [JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/index.html)

- [Eclipse Java IDE](https://www.eclipse.org/downloads/) (requires Java already installed)
- Supported Linux platforms will require certain libraries installed (`libssl` for secure sockets layer support and `libasound2` for sound support). Refer to your distribution below for the commands needed to install the correct versions of these libraries.

  - On Ubuntu, run the following commands to install the required packages:

    ```sh
    sudo apt-get update
    sudo apt-get install build-essential libssl1.0.0 libasound2
    ```

  - On Debian 9, run the following commands to install the required packages:

    ```sh
    sudo apt-get update
    sudo apt-get install build-essential libssl1.0.2 libasound2
    ```

  - On RHEL/CentOS, run the following commands to install the required packages:

    ```sh
    sudo yum update
    sudo yum install alsa-lib java-1.8.0-openjdk-devel openssl
    ```

> [!NOTE]
> - On RHEL/CentOS 7, follow the instructions on [how to configure RHEL/CentOS 7 for Speech SDK](~/articles/cognitive-services/speech-service/how-to-configure-rhel-centos-7.md).
> - On RHEL/CentOS 8, follow the instructions on [how to configure OpenSSL for Linux](~/articles/cognitive-services/speech-service/how-to-configure-openssl-linux.md).

- On Windows, you need the [Microsoft Visual C++ Redistributable for Visual Studio 2019](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads) for your platform. Note that installing this for the first time may require you to restart Windows before continuing with this guide.

## Create an Eclipse project and install the Speech SDK

[!INCLUDE [](~/includes/cognitive-services-speech-service-quickstart-java-create-proj.md)]

## Next steps

[!INCLUDE [windows](../quickstart-list.md)]
