---
title: Azure Cognitive Services, Cognitive Services Speech SDK API Documentation - Tutorials, API Reference | Microsoft Docs
description: Learn how to create and develop apps with the Cognitive Services Speech SDK
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: wolfma61
manager: onano

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 05/01/2018
ms.author: wolfma
---

# Shipping an application

Observe the [Speech SDK license](license.md), as well as the [third party software notices](third-party-notices.md) when distributing the Cognitive Services Speech SDK. Also, review the [Microsoft Privacy Statement](https://aka.ms/csspeech/privacy).

Depending on the platform you are distributing your application on, different files are required for your application.

## Windows

We are testing the SDK on Windows 10 as well as on Windows Server 2016.

The Cognitive Services Speech SDK requires the `VS2017 C++ Runtime libraries` on the system. You can find the latest version of the `VS2017 C++ redistributables` here: https://aka.ms/vs/15/release/vc_redist.x86.exe or https://aka.ms/vs/15/release/vc_redist.x64.exe.

If your application is using managed code, the `.Net Framework 4.6.1` or later is required on the target machine.

For microphone input the Media Foundation Libraries need to be installed. These libraries are by default installed on Windows 10 and on Windows Server 2016. In there absence it is possible to use the Speech SDK, as long as the microphone isn't used as an audio input device.

The required Speech SDK files can be deployed in the same directory as your application. This guarantees that your application can access them and won't interfer with other applications using different version of the SDK on your system. Make sure you select the version (Win32/x64) matching your application.

| Name | Function
|:-----|:----|
| `Microsoft.CognitiveServices.Speech.core.dll` | core SDK, required for native and managed deployment
| `Microsoft.CognitiveServices.Speech.csharp.bindings.dll` | required for managed deployment
| `Microsoft.CognitiveServices.Speech.csharp.dll` | required for managed deployment

## Linux

For a native application you need to ship the Speech SDK library, `libMicrosoft.CognitiveServices.Speech.core.so`.
Make sure you select the version (x32, x64) matching your application.
Depending on the Linux version or distro you are targeting, you may also need to include the following dependencies:

* The shared libraries of the GNU C Library (including the POSIX Threads Programming library, `libpthreads`)
* The OpenSSL library (`libssl.so.1.0.0`)
* The cURL library (`libcurl.so.4`)
* The shared library for ALSA applications (`libasound.so.2`)

On Ubuntu 16.04, for example, the GNU C libraries should already be installed by default. The last three can be installed using these commands:

```sh
sudo apt-get update
sudo apt-get install libssl1.0.0 libcurl3 libasound2 wget
```

If you need to support multiple Linux versions or distros, consider simply shipping all the dependencies with your application.

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in C#](quickstart-csharp-windows.md)
