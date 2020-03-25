---
title: About the Speech SDK - Speech service
titleSuffix: Azure Cognitive Services
description: The Speech software development kit (SDK) exposes many of the Speech service capabilities, making it easier to develop speech-enabled applications.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/25/2020
ms.author: dapine
---

# About the Speech SDK

The Speech software development kit (SDK) exposes many of the Speech service capabilities, making it easier to develop speech-enabled applications. There are various SDKs available in many programming languages. Depending on the programming language, the SDK is likely cross-platform. Refer to the following table as a point of reference.

[!INCLUDE [Speech SDK Platforms](../../../includes/cognitive-services-speech-service-speech-sdk-platforms.md)]

## Capabilities

The Speech SDK exposes many features from the Speech service, but not all of them. The capabilities of the Speech SDK are often associated to scenarios. It's ideal for both real-time and non-real-time scenarios, utilizing local devices, files, and even input and out streams. There are known [limitations](#limitations) with the Speech SDK, where feature gaps exist. When a scenario is unachievable with the Speech SDK, look for a REST API alternative.

<!-- NOTES!

- Speech-to-text (STT, SR, speech recognition, etc.) Phrase list, intent, translation
- Text-to-speech (TTS, SS, speech synthesis, etc.)
- Keyword spotting (KWS)
- Voice assistants
- Conversation Transcription
- Multi-device Conversation
- Call Center Transcription
- Codec Compressed Audio input

1. We have a SDK that currently covers SR, Speech Translation, Speech Intent, TTS, CTS, Commands, and Dialog.  Additionally, as a backup, a limited REST API for SR and TTS is available for the rare situation that the SDK can't be used.
2. The SDK currently does not cover Batch (non-realtime with input files in Blob storage), Endpoint Management, or Custom Model Creation/training and those are controlled via REST APIs.  Some of these may be covered by the SDK in the future.

### SDK APIs are ideal for real time and non-real time scenarios utilizing local devices, files, and streams

* Real time scenarios (basic TTS and Custom TTS w/local device outputs)
* Real time scenarios (basic SR and Custom Speech, w/local device inputs or w/stream inputs)
* Real time scenarios (translation, both speech to text, and speech to speech, w/local device inputs or w/local stream inputs)
* Real time scenarios (keyword spotting, intent recognition, bot framework, and custom commands, w/local device inputs or w/stream inputs)

* Non real time scenarios (basic TTS and Custom TTS, w/local file or stream outputs)
* Non real time scenarios (basic SR and Custom Speech, w/local file or stream inputs)
* Non real time scenarios (translation, both speech to text, and speech to speech, w/local file or stream inputs)
* Non real time scenarios (keyword spotting, intent recognition, bot framework, and custom commands, w/local file or stream inputs)

### MANAGEMENT REST APIs are ideal for Custom Voice and Custom Speech model and endpoint management
* Custom Voice project/dataset/model/endpoint management, and quality testing
* Custom Speech project/dataset/model/endpoint management, and accuracy testing

### BATCH REST APIs is ideal for non-real time Custom Speech utilizing remote files stored in blob storage

* Non real time scenarios (basic SR and Custom SR,  w/remote files in blob storage)
* Non real time scenarios (basic SR and Customer SR + Sentiment analysis, w/remote files in blob storage)

### NON-BATCH REST APIs are ideal for non-real time scenarios utilizing non-supported SDK programming languages or platforms

* Non real time scenarios (basic TTS and Custom TTS, w/non-streaming output)
* Non real time scenarios (basic SR and Custom SR,  w/non-streaming input or output) 

-->

## Limitations

While the Speech SDK covers many scenarios, there are known gaps. 

## Get the SDK

[!INCLUDE [License notice](../../../includes/cognitive-services-speech-service-license-notice.md)]

# [Windows](#tab/windows)

> [!WARNING]
> The Speech SDK supports Windows 10 or later versions. Earlier Windows versions are **not supported**.

The Cognitive Services Speech SDK is tested on Windows 10 and on Windows Server 2016.

The Cognitive Services Speech SDK requires the [Microsoft Visual C++ Redistributable for Visual Studio 2019](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads) on the system. You can download installers for the latest version of the `Microsoft Visual C++ Redistributable for Visual Studio 2019` here:

- [Win32](https://aka.ms/vs/16/release/vc_redist.x86.exe)
- [x64](https://aka.ms/vs/16/release/vc_redist.x64.exe)

If your application uses managed code, the `.NET Framework 4.6.1` or later is required on the target machine.

For microphone input, the Media Foundation libraries must be installed. These libraries are part of Windows 10 and Windows Server 2016. It's possible to use the Speech SDK without these libraries, as long as a microphone isn't used as the audio input device.

The required Speech SDK files can be deployed in the same directory as your application. This way your application can directly access the libraries. Make sure you select the correct version (Win32/x64) that matches your application.

| Name                                            | Function                                             |
|:------------------------------------------------|:-----------------------------------------------------|
| `Microsoft.CognitiveServices.Speech.core.dll`   | Core SDK, required for native and managed deployment |
| `Microsoft.CognitiveServices.Speech.csharp.dll` | Required for managed deployment                      |

> [!NOTE]
> Starting with the release 1.3.0 the file `Microsoft.CognitiveServices.Speech.csharp.bindings.dll` (shipped in previous releases) isn't needed anymore. The functionality is now integrated in the core SDK.

> [!NOTE]
> For the Windows Forms App (.NET Framework) C# project, make sure the libraries are included in your project's deployment settings. You can check this under `Properties -> Publish Section`. Click the `Application Files` button and find corresponding libraries from the scroll down list. Make sure the value is set to `Included`. Visual Studio will include the file when project is published/deployed.

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

  | Path                   | Description                                          |
  |------------------------|------------------------------------------------------|
  | `license.md`           | License                                              |
  | `ThirdPartyNotices.md` | Third-party notices                                  |
  | `include`              | Header files for C++                                 |
  | `lib/x64`              | Native x64 library for linking with your application |
  | `lib/x86`              | Native x86 library for linking with your application |

  To create an application, copy or move the required binaries (and libraries) into your development environment. Include them as required in your build process.

---

The Speech SDK currently supports the Ubuntu 16.04, Ubuntu 18.04, Debian 9, RHEL 8, CentOS 8 distributions.
For a native application, you need to ship the Speech SDK library, `libMicrosoft.CognitiveServices.Speech.core.so`.
Make sure you select the version (x86, x64) that matches your application. Depending on the Linux version, you also might need to include the following dependencies:

- The shared libraries of the GNU C library (including the POSIX Threads Programming library, `libpthreads`)
- The OpenSSL library (`libssl.so.1.0.0` or `libssl.so.1.0.2`)
- The shared library for ALSA applications (`libasound.so.2`)

On Ubuntu, the GNU C libraries should already be installed by default. The last three can be installed by using these commands:

```sh
sudo apt-get update
sudo apt-get install libssl1.0.0 libasound2
```

On Debian 9 install these packages:

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

[!INCLUDE [Sample source code](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in C#](~/articles/cognitive-services/Speech-Service/quickstarts/speech-to-text-from-microphone.md?pivots=programming-language-csharp&tabs=dotnet)
