---
title: "Quickstart: Speech SDK for Java (Windows, Linux, macOS) platform setup - Speech service"
titleSuffix: Azure Cognitive Services
description: Use this guide to set up your platform for using Java (Windows, Linux, macOS) with the Speech SDK.
services: cognitive-services
author: markamos
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 10/15/2020
ms.custom: devx-track-java
ms.author: eur
---

This guide shows how to install the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) for Java. If you just want the package name to get started on your own, the Java SDK is not available in the Maven central repository. Whether you're using Gradle or a *pom.xml* dependency file, you need to add a custom repository that points to `https://azureai.azureedge.net/maven/`. (See below for the package name.)

[!INCLUDE [License Notice](~/includes/cognitive-services-speech-service-license-notice.md)]

## Supported operating systems

The Java Speech SDK package is available for these operating systems:

- Windows: 64-bit only.
- Mac: macOS X version 10.14 or later.
- Linux: See the list of [supported Linux distributions and target architectures](~/articles/cognitive-services/speech-service/speech-sdk.md).

## Prerequisites

- [Azul Zulu OpenJDK](https://www.azul.com/downloads/?package=jdk). The [Microsoft Build of OpenJDK](https://www.microsoft.com/openjdk) or your preferred JDK should also work. 

- [Eclipse Java IDE](https://www.eclipse.org/downloads/). This IDE requires Java to already be installed.

- [Microsoft Visual C++ Redistributable for Visual Studio 2019](https://support.microsoft.com/topic/the-latest-supported-visual-c-downloads-2647da03-1eea-4433-9aff-95f26a218cc0) for the Windows platform. Installing it for the first time might require a restart.

- For Linux, see the [system requirements and setup instructions](~/articles/cognitive-services/speech-service/speech-sdk.md#get-the-speech-sdk).

## Gradle configurations

Gradle configurations require both a custom repository and an explicit reference to the .jar dependency extension:

```groovy
// build.gradle

repositories {
    maven {
        url "https://azureai.azureedge.net/maven/"
    }
}

dependencies {
    implementation group: 'com.microsoft.cognitiveservices.speech', name: 'client-sdk', version: "1.21.0", ext: "jar"
}
```

## Create an Eclipse project and install the Speech SDK

[!INCLUDE [](~/includes/cognitive-services-speech-service-quickstart-java-create-proj.md)]

## Next steps

[!INCLUDE [windows](../quickstart-list.md)]
