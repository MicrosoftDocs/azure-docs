---
title: Develop apps with the Speech SDK - Speech Services
titleSuffix: Azure Cognitive Services
description: Learn how to create apps using the Speech SDK.
services: cognitive-services
author: wolfma61
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/05/2019
ms.author: wolfma
ms.custom: seodec18
---

# Ship an application

Observe the [Speech SDK license](https://aka.ms/csspeech/license201809), as well as the [third-party software notices](https://csspeechstorage.blob.core.windows.net/drop/1.0.0/ThirdPartyNotices.html) when you distribute the Azure Cognitive Services Speech SDK. Also, review the [Microsoft Privacy Statement](https://aka.ms/csspeech/privacy).

Depending on the platform, different dependencies exist to execute your application.

## Windows

The Cognitive Services Speech SDK is tested on Windows 10 and on Windows Server 2016.

The Cognitive Services Speech SDK requires the [Microsoft Visual C++ Redistributable for Visual Studio 2019](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads) on the system. You can download installers for the latest version of the `Microsoft Visual C++ Redistributable for Visual Studio 2019` here:

- [Win32](https://aka.ms/vs/16/release/vc_redist.x86.exe)
- [x64](https://aka.ms/vs/16/release/vc_redist.x64.exe)

If your application uses managed code, the `.NET Framework 4.6.1` or later is required on the target machine.

For microphone input, the Media Foundation libraries must be installed. These libraries are part of Windows 10 and Windows Server 2016. It's possible to use the Speech SDK without these libraries, as long as a microphone isn't used as the audio input device.

The required Speech SDK files can be deployed in the same directory as your application. This way your application can directly access the libraries. Make sure you select the correct version (Win32/x64) that matches your application.

| Name | Function
|:-----|:----|
| `Microsoft.CognitiveServices.Speech.core.dll` | Core SDK, required for native and managed deployment
| `Microsoft.CognitiveServices.Speech.csharp.dll` | Required for managed deployment

>[!NOTE]
> Starting with the release 1.3.0 the file `Microsoft.CognitiveServices.Speech.csharp.bindings.dll` (shipped in previous releases) isn't needed anymore. The functionality is now integrated in the core SDK.

>[!NOTE]
> For the Windows Forms App (.NET Framework) C# project, make sure the libraries are included in your project's deployment settings. You can check this under `Properties -> Publish Section`. Click the  `Application Files` button and find corresponding libraries from the scroll down list. Make sure the  value is set to `Included`. Visual Studio will include the file when project is published/deployed.

## Linux

The Speech SDK currently supports the Ubuntu 16.04, Ubuntu 18.04, and Debian 9 distributions.
For a native application, you need to ship the Speech SDK library, `libMicrosoft.CognitiveServices.Speech.core.so`.
Make sure you select the version (x86, x64) that matches your application. Depending on the Linux version, you also might need to include the following dependencies:

* The shared libraries of the GNU C library (including the POSIX Threads Programming library, `libpthreads`)
* The OpenSSL library (`libssl.so.1.0.0` or `libssl.so.1.0.2`)
* The shared library for ALSA applications (`libasound.so.2`)

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

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in C#](quickstart-csharp-dotnet-windows.md)
