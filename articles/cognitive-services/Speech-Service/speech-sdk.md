---
title: About the Speech SDK - Speech Services
titleSuffix: Azure Cognitive Services
description: The Speech Software Development Kit (SDK) gives your applications native access to the functions of the Speech service, making it easier to develop software. This article provides additional details about the SDK for Windows, Linux, and Android.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/05/2019
ms.author: wolfma
---

# About the Speech SDK

The Speech Software Development Kit (SDK) gives your applications access to the functions of the Speech Services, making it easier to develop speech-enabled software. Currently, the SDKs provide access to **speech-to-text**, **text-to-speech**, **speech translation**, **intent recognition**, and **Bot Framework’s Direct Line Speech channel**. A general overview about the capabilities and supported platforms can be found on the documentation [entry page](https://aka.ms/csspeech).

[!INCLUDE [Speech SDK Platforms](../../../includes/cognitive-services-speech-service-speech-sdk-platforms.md)]

[!INCLUDE [License Notice](../../../includes/cognitive-services-speech-service-license-notice.md)]

## Get the SDK

### Windows

For Windows, we support the following languages:

* C# (UWP and .NET), C++:
  You can reference and use the latest version of our Speech SDK NuGet package. The package includes 32-bit and 64-bit client libraries and managed (.NET) libraries. The SDK can be installed in Visual Studio by using NuGet. Search for **Microsoft.CognitiveServices.Speech**.

* Java:
  You can reference and use the latest version of our Speech SDK Maven package, which supports only Windows x64. In your Maven project, add `https://csspeechstorage.blob.core.windows.net/maven/` as an additional repository and reference `com.microsoft.cognitiveservices.speech:client-sdk:1.6.0` as a dependency.

### Linux

> [!NOTE]
> Currently, we support only Ubuntu 16.04, Ubuntu 18.04, and Debian 9 on a PC (x86 or x64 for C++ development and x64 for .NET Core, Java, and Python).

Make sure you have the required libraries installed by running the following shell commands:

On Ubuntu:

```sh
sudo apt-get update
sudo apt-get install libssl1.0.0 libasound2
```

On Debian 9:

```sh
sudo apt-get update
sudo apt-get install libssl1.0.2 libasound2
```

* C#:
  You can reference and use the latest version of our Speech SDK NuGet package. To reference the SDK, add the following package reference to your project:

  ```xml
  <PackageReference Include="Microsoft.CognitiveServices.Speech" Version="1.6.0" />
  ```

* Java:
  You can reference and use the latest version of our Speech SDK Maven package. In your Maven project, add `https://csspeechstorage.blob.core.windows.net/maven/` as an additional repository and reference `com.microsoft.cognitiveservices.speech:client-sdk:1.6.0` as a dependency.

* C++: Download the SDK as a [.tar package](https://aka.ms/csspeech/linuxbinary) and unpack the files in a directory of your choice. The following table shows the SDK folder structure:

  |Path|Description|
  |-|-|
  |`license.md`|License|
  |`ThirdPartyNotices.md`|Third-party notices|
  |`include`|Header files for C and C++|
  |`lib/x64`|Native x64 library for linking with your application|
  |`lib/x86`|Native x86 library for linking with your application|

  To create an application, copy or move the required binaries (and libraries) into your development environment. Include them as required in your build process.

### Android

The Java SDK for Android is packaged as an [AAR (Android Library)](https://developer.android.com/studio/projects/android-library), which includes the necessary libraries and required Android permissions. It's hosted in a Maven repository at `https://csspeechstorage.blob.core.windows.net/maven/` as package `com.microsoft.cognitiveservices.speech:client-sdk:1.6.0`.

To consume the package from your Android Studio project, make the following changes:

* In the project-level build.gradle file, add the following to the `repository` section:

  ```gradle
  maven { url 'https://csspeechstorage.blob.core.windows.net/maven/' }
  ```

* In the module-level build.gradle file, add the following to the `dependencies` section:

  ```gradle
  implementation 'com.microsoft.cognitiveservices.speech:client-sdk:1.6.0'
  ```

The Java SDK is also part of the [Speech Devices SDK](speech-devices-sdk.md).

[!INCLUDE [Get the samples](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in C#](quickstart-csharp-dotnet-windows.md)
