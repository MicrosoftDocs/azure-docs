---
title: About the Cognitive Services Speech SDK | Microsoft Docs
description: An overview of the SDKs available for the Speech service.
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: v-jerkin
manager: noellelacharite

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 07/16/2018
ms.author: v-jerkin
---

# About the Cognitive Services Speech SDK

The Cognitive Services Speech Software Development Kit (SDK) provides your applications native access to the functions of the Speech service, making it easier to develop software. Currently, the SDK provides access to **Speech to Text**, **Speech Translation**, and **Intent Recognition**.

[!include[Speech SDK Platforms](../../../includes/cognitive-services-speech-service-speech-sdk-platforms.md)]

[!include[License Notice](includes/license-notice.md)]

## Get the Windows SDK

The Windows version of the Speech SDK includes 32-bit and 64-bit C/C++ client libraries as well as managed (.NET) libraries for use with C#. The SDK can be installed in Visual Studio using NuGet; simply search for `Microsoft.CognitiveServices.Speech`.

## Get the Linux SDK

Make sure you have the required compiler and libraries by running the following shell commands:

```sh
sudo apt-get update
sudo apt-get install build-essential libssl1.0.0 libcurl3 libasound2
```

> [!NOTE]
> These instructions assume you're running Ubuntu 16.04 on a PC (x86 or x64). On a different Ubuntu version, or a different Linux distribution, adapt these steps to your environment.

Then, [download the SDK](https://aka.ms/csspeech/linuxbinary) and unpack the files in into a directory of your choice. This table shows the SDK folder structure.

|Path|Description|
|-|-|
|`license.md`|License|
|`third-party-notices.md`|Third-party notices|
|`include`|Header files for C and C++|
|`lib/x64`|Native x64 library for linking with your application|
|`lib/x86`|Native x86 library for linking with your application|

To create an application, copy or move the required binaries (and libraries) into your development environment, and include them as required into your build process.

## Get the Java SDK

The Java SDK for Android is packaged as an [AAR (Android Library)](https://developer.android.com/studio/projects/android-library), which includes the necessary libraries as well as required Android permissions for using it.
It is hosted in a Maven repository at `https://csspeechstorage.blob.core.windows.net/maven/` as package `com.microsoft.cognitiveservices.speech:client-sdk:0.5.0`.

* In your Android Studio project, add

  ```text
  implementation 'com.microsoft.cognitiveservices.speech:client-sdk:0.5.0'
  ```

  in the `dependencies` section of your module-level `build.gradle` file.

The Java SDK is also part of the [Speech Devices SDK](speech-devices-sdk.md).

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in C#](quickstart-csharp-dotnet-windows.md)
