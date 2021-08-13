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
ms.date: 10/15/2020
ms.custom: devx-track-java
ms.author: lajanuar
---

This guide shows how to install the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) for 64-bit Java 8 JRE. If you just want the package name to get started on your own, the Java SDK is not available in the Maven central repository. Whether you're using Gradle or a `pom.xml` dependency file, you need to add a custom repository pointing to `https://csspeechstorage.blob.core.windows.net/maven/` (see below for package name).

> [!NOTE]
> For the Speech Devices SDK and the Roobo device, see [Speech Devices SDK](~/articles/cognitive-services/speech-service/speech-devices-sdk.md).

[!INCLUDE [License Notice](~/includes/cognitive-services-speech-service-license-notice.md)]

## Supported operating systems

- The Java Speech SDK package is available for these operating systems:
  - Windows: 64-bit only
  - Mac: macOS X version 10.13 or later
  - Linux; see the list of [supported Linux distributions and target architectures](~/articles/cognitive-services/speech-service/speech-sdk.md).

## Prerequisites

- [Java 8](https://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html) or [JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/index.html)

- [Eclipse Java IDE](https://www.eclipse.org/downloads/) (requires Java already installed)

- On Windows, you need the [Microsoft Visual C++ Redistributable for Visual Studio 2019](https://support.microsoft.com/topic/the-latest-supported-visual-c-downloads-2647da03-1eea-4433-9aff-95f26a218cc0) for your platform. Installing this for the first time may require a restart.

- On Linux, see the [system requirements and setup instructions](~/articles/cognitive-services/speech-service/speech-sdk.md#get-the-speech-sdk).

## Gradle config

Gradle configs require both a custom repository, and an explicit reference to the dependency extension `.jar`. 

```groovy
// build.gradle

repositories {
    maven {
        url "https://csspeechstorage.blob.core.windows.net/maven/"
    }
}

dependencies {
    implementation group: 'com.microsoft.cognitiveservices.speech', name: 'client-sdk', version: "1.17.0", ext: "jar"
}
```

## Create an Eclipse project and install the Speech SDK

[!INCLUDE [](~/includes/cognitive-services-speech-service-quickstart-java-create-proj.md)]

## Next steps

[!INCLUDE [windows](../quickstart-list.md)]
