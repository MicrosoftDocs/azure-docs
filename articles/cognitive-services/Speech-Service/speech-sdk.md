---
title: Speech SDK overview | Microsoft Docs
description: An overview of the SDKs available for the Speech service.
services: cognitive-services
author: v-jerkin
manager: chriswendt1

ms.service: cognitive-services
ms.component: speech
ms.topic: article
ms.date: 4/28/2018
ms.author: v-jerkin
---

# Speech SDK overview

The Speech service provides native client libraries (SDKs) to provide your applications access to the functions of the Speech service, making it easier to develop software. Currently, the SDKs provide access to Speech to Text and Speech Translation. Text to Speech employs REST POST calls over HTTP.

The table below the currently supported programming languages and operating systems.

|Supported operating system|Programming language|
|-|-|
|Windows|C/C++, C#|
|Linux|C/C++|
|Any|Java*|

\* *The Java SDK is part of the [Speech Devices SDK](speech-devices-sdk.md) and is in restricted preview. [Apply to join](get-speech-devices-sdk.md) the preview.*

Additional languages and platforms are currently being considered for future support.

## Getting the Windows SDK

The Windows version of the Speech SDK includes 32-bit and 64-bit C/C++ client libraries as well as managed (.NET) libraries for use with C#. The SDK can be installed in Visual Studio using NuGet; simply search for "Cognitive Services Speech SDK." You may also [download it directly](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech) from NuGet.org.

## Getting the C++ SDK

If you are running Ubuntu 16.04, ensure that you have the required compiler and libraries. Run the following shell commands:

```sh
sudo apt-get update
sudo apt-get install build-essential libssl1.0.0 libcurl3 libasound2
```

Then [download the SDK](#TODO) and unpack the files in into a directory of your choice. This table shows the 

|Path|Description|
|-|-|
|license.md|License|
|third-party-notices.md|Third-party notices|
|include|Header files for C and C++|
|lib/x64|Native x64 library for linking with your application|
|lib/x86|Native x86 library for linking with your application|

To create an application, copy/move the required binaries (and libraries) into your development environment, and include them as required into your build process.

## Getting the Java SDK

The Java SDK is part of the [Speech Devices SDK](speech-devices-sdk.md) and is in restricted preview. [Apply to join](get-speech-devices-sdk.md) the preview.
