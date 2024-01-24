---
title: "Speech SDK for C# Unity platform setup - Speech service"
titleSuffix: Azure AI services
description: 'Use this guide to set up your platform for C# Unity with the Speech SDK.'
author: markamos
manager: nitinme
ms.service: azure-ai-speech
ms.topic: include
ms.date: 09/05/2023
ms.author: eur
ms.custom: devx-track-csharp, ignite-fall-2021
---

This guide shows how to install the [Speech SDK](~/articles/ai-services/speech-service/speech-sdk.md) for [Unity](https://unity3d.com/).

For Unity development, the Speech SDK supports Windows Desktop (x86 and x64) or Universal Windows Platform (x86, x64, ARM/ARM64), Android (x86, ARM32/64), iOS (x64 simulator and ARM64), and Mac (x64).

### Prerequisites

This guide requires:

- [Microsoft Visual C++ Redistributable for Visual Studio 2019](https://support.microsoft.com/topic/the-latest-supported-visual-c-downloads-2647da03-1eea-4433-9aff-95f26a218cc0) for the Windows platform. Installing it for the first time might require a restart.
- [Unity 2018.3 or later](https://store.unity.com/) with [Unity 2019.1 adding support for UWP ARM64](https://blogs.unity3d.com/2019/04/16/introducing-unity-2019-1/#universal).
- [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/). Version 15.9 or later of Visual Studio 2017 is also acceptable.
- For Windows ARM64 support, installation of the [optional build tools for ARM64 and the Windows 10 SDK for ARM64](https://blogs.windows.com/buildingapps/2018/11/15/official-support-for-windows-10-on-arm-development/).
- On Android, an ARM-based Android device (API 23: Android 6.0 Marshmallow or later) enabled for development with a working microphone.
- On iOS, an iOS device (ARM64) enabled for development with a working microphone.
- On macOS, a Mac device (x64) and the latest LTS version of Unity 2019 or later for integrated support for microphone access in Unity Player settings.

### Install the Speech SDK for Unity

To install the Speech SDK for Unity, follow these steps:

1. Download and open the [Speech SDK for Unity](https://aka.ms/csspeech/unitypackage). It's packaged as a Unity asset package (*.unitypackage*) and should already be associated with Unity. When the asset package is opened, the **Import Unity Package** dialog box appears. You might need to create and open an empty project for this step to work.

1. Ensure that all files are selected, and then select **Import**. After a few moments, the Unity asset package is imported into your project.

   :::image type="content" source="~/articles/ai-services/speech-service/media/sdk/qs-csharp-unity-01-import.png" alt-text="Screenshot of the Import Unity Package dialog box in the Unity Editor." lightbox="~/articles/ai-services/speech-service/media/sdk/qs-csharp-unity-01-import.png":::

For more information about importing asset packages into Unity, see the [Unity documentation](https://docs.unity3d.com/Manual/AssetPackages.html).
