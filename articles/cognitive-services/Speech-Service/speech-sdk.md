---
title: About the Speech SDK - Speech service
titleSuffix: Azure Cognitive Services
description: The Speech Software Development Kit (SDK) gives your applications native access to the functions of the Speech service, making it easier to develop software. This article provides additional details about the SDK for Windows, Linux, and Android.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 02/13/2020
ms.author: dapine
---

# About the Speech SDK

The Speech Software Development Kit (SDK) gives your applications access to the functions of the Speech service, making it easier to develop speech-enabled software. Currently, the SDKs provide access to **speech-to-text**, **text-to-speech**, **speech translation**, **intent recognition**, and **Bot Framework’s Direct Line Speech channel**.

You can easily capture audio from a microphone, read from a stream, or access audio files from storage with the Speech SDK. The Speech SDK supports WAV/PCM 16-bit, 16 kHz/8 kHz, single-channel audio for speech recognition. Additional audio formats are supported using the [speech-to-text REST endpoint](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis) or the [batch transcription service](https://docs.microsoft.com/azure/cognitive-services/speech-service/batch-transcription#supported-formats).

A general overview about the capabilities and supported platforms can be found on the documentation [entry page](https://aka.ms/csspeech).

[!INCLUDE [Speech SDK Platforms](../../../includes/cognitive-services-speech-service-speech-sdk-platforms.md)]

[!INCLUDE [License Notice](../../../includes/cognitive-services-speech-service-license-notice.md)]

## Get the SDK

# [Windows](#tab/windows)

> [!WARNING]
> The Speech SDK supports Windows 10 or later versions. Earlier Windows versions are **not supported**.

For Windows, we support the following languages:

* C# (UWP and .NET), C++:
  You can reference and use the latest version of our Speech SDK NuGet package. The package includes 32-bit and 64-bit client libraries and managed (.NET) libraries. The SDK can be installed in Visual Studio by using NuGet, [Microsoft.CognitiveServices.Speech](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech).

* Java:
  You can reference and use the latest version of our Speech SDK Maven package, which supports only Windows x64. In your Maven project, add `https://csspeechstorage.blob.core.windows.net/maven/` as an additional repository and reference `com.microsoft.cognitiveservices.speech:client-sdk:1.8.0` as a dependency.

# [Linux](#tab/linux)

> [!NOTE]
> Currently, we only support the following distributions and development languages/platforms:
>
> | Distribution | Development |
> |:-|:-|
> |Ubuntu 16.04 x86     |C++|
> |Ubuntu 16.04 x64     |C++, Java, .NET Core, Python|
> |Ubuntu 16.04 ARM32   |C++, Java, .NET Core|
> |Ubuntu 16.04 ARM64   |C++, Java, .NET Core[<sup>[1]</sup>](#footnote1)|
> |Ubuntu 18.04 x86     |C++|
> |Ubuntu 18.04 x64     |C++, Java, .NET Core, Python|
> |Ubuntu 18.04 ARM32   |C++, Java, .NET Core|
> |Ubuntu 18.04 ARM64   |C++, Java, .NET Core[<sup>[1]</sup>](#footnote1)|
> |Debian 9 x86         |C++|
> |Debian 9 x64         |C++, Java, .NET Core, Python|
> |Debian 9 ARM32       |C++, Java, .NET Core|
> |Debian 9 ARM64       |C++, Java, .NET Core[<sup>[1]</sup>](#footnote1)|
> |Red Hat Enterprise Linux (RHEL) 7 x64[<sup>[2]</sup>](#footnote2) |C++, Java, .NET Core, Python|
> |Red Hat Enterprise Linux (RHEL) 8 x64                             |C++, Java, .NET Core, Python|
> |CentOS 7 x64[<sup>[2]</sup>](#footnote2) |C++, Java, .NET Core, Python|
> |CentOS 8 x64                             |C++, Java, .NET Core, Python|
>
> **[<a name="footnote1">1</a>]** Linux ARM64 requires .NET Core 3.x (dotnet-sdk-3.x package) for proper ARM64 support.<br>
> **[<a name="footnote2">2</a>]** Follow the instructions on [how to configure RHEL/CentOS 7 for Speech SDK](~/articles/cognitive-services/speech-service/how-to-configure-rhel-centos-7.md).


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

On RHEL/CentOS 8:

```sh
sudo yum update
sudo yum install alsa-lib openssl
```

> [!NOTE]
> On RHEL/CentOS 8, follow the instructions on [how to configure OpenSSL for Linux](~/articles/cognitive-services/speech-service/how-to-configure-openssl-linux.md).

* C#:
  You can reference and use the latest version of our Speech SDK NuGet package. To reference the SDK, add the following package reference to your project:

  ```xml
  <PackageReference Include="Microsoft.CognitiveServices.Speech" Version="1.8.0" />
  ```

* Java:
  You can reference and use the latest version of our Speech SDK Maven package. In your Maven project, add `https://csspeechstorage.blob.core.windows.net/maven/` as an additional repository and reference `com.microsoft.cognitiveservices.speech:client-sdk:1.7.0` as a dependency.

* C++: Download the SDK as a [.tar package](https://aka.ms/csspeech/linuxbinary) and unpack the files in a directory of your choice. The following table shows the SDK folder structure:

  |Path|Description|
  |-|-|
  |`license.md`|License|
  |`ThirdPartyNotices.md`|Third-party notices|
  |`include`|Header files for C and C++|
  |`lib/x64`|Native x64 library for linking with your application|
  |`lib/x86`|Native x86 library for linking with your application|

  To create an application, copy or move the required binaries (and libraries) into your development environment. Include them as required in your build process.

# [Android](#tab/android)

The Java SDK for Android is packaged as an [AAR (Android Library)](https://developer.android.com/studio/projects/android-library), which includes the necessary libraries and required Android permissions. It's hosted in a Maven repository at `https://csspeechstorage.blob.core.windows.net/maven/` as package `com.microsoft.cognitiveservices.speech:client-sdk:1.7.0`.

To consume the package from your Android Studio project, make the following changes:

* In the project-level build.gradle file, add the following to the `repository` section:

  ```gradle
  maven { url 'https://csspeechstorage.blob.core.windows.net/maven/' }
  ```

* In the module-level build.gradle file, add the following to the `dependencies` section:

  ```gradle
  implementation 'com.microsoft.cognitiveservices.speech:client-sdk:1.7.0'
  ```

The Java SDK is also part of the [Speech Devices SDK](speech-devices-sdk.md).

---

[!INCLUDE [Get the samples](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in C#](~/articles/cognitive-services/Speech-Service/quickstarts/speech-to-text-from-microphone.md?pivots=programming-language-csharp&tabs=dotnet)
