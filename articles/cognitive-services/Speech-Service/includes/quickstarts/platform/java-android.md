---
title: 'Quickstart: Speech SDK for Java (Android) platform setup - Speech service'
titleSuffix: Azure Cognitive Services
description: Use this guide to set up your platform for using Java (Android) with the Speech SDK.
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

This guide shows how to install the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) for Java on Android. The setup is based on the Speech SDK Maven Package and Android Studio 3.3.

## Supported platforms

The Speech SDK is compatible with Android devices that have 32/64-bit ARM and Intel x86/x64 compatible processors.

:::row:::
    :::column span="3":::
        The Java SDK for Android is packaged as an <a href="https://developer.android.com/studio/projects/android-library" target="_blank">AAR (Android Library)</a>, which includes the necessary libraries and required Android permissions. It's hosted in a Maven repository at `https://csspeechstorage.blob.core.windows.net/maven/` as package `com.microsoft.cognitiveservices.speech:client-sdk:1.22.0`. Make sure 1.22.0 is the latest version by [searching our GitHub repo](https://github.com/Azure-Samples/cognitive-services-speech-sdk/search?q=com.microsoft.cognitiveservices.speech%3Aclient-sdk).
    :::column-end:::
    :::column:::
        <br>
        <div class="icon is-large">
            <img alt="Java" src="/media/logos/logo_java.svg" width="60px">
        </div>
    :::column-end:::
:::row-end:::

To consume the package from your Android Studio project, make the following changes:

1. In the project-level *build.gradle* file, add the following to the `repositories` section:
      ```gradle
      maven { url 'https://csspeechstorage.blob.core.windows.net/maven/' }
      ```

1. In the module-level *build.gradle* file, add the following to the `dependencies` section:
      ```gradle
      implementation 'com.microsoft.cognitiveservices.speech:client-sdk:1.22.0'
      ```

## Install the Speech SDK by using Android Studio

[!INCLUDE [](~/includes/cognitive-services-speech-service-quickstart-java-android-create-proj.md)]
