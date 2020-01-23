---
title: "Quickstart: Speech SDK for C# Unity platform setup - Speech service"
titleSuffix: Azure Cognitive Services
description: Use this guide to set up your platform for C# Unity with the Speech service SDK.
services: cognitive-services
author: markamos
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 10/10/2019
ms.author: erhopf
---

This guide shows how to install the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) for [Unity](https://unity3d.com/).

> [!NOTE]
> The Speech SDK for Unity supports Windows Desktop (x86 and x64) or Universal Windows Platform (x86, x64, ARM/ARM64), Android (x86, ARM32/64) and iOS (x64 simulator, ARM32 and ARM64)

[!INCLUDE [License Notice](~/includes/cognitive-services-speech-service-license-notice.md)]

## Prerequisites

This quickstart requires:

- [Unity 2018.3 or later](https://store.unity.com/) with [Unity 2019.1 adding support for UWP ARM64](https://blogs.unity3d.com/2019/04/16/introducing-unity-2019-1/#universal).
- [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/). Version 15.9 or higher of Visual Studio 2017 is also acceptable.
- For Windows ARM64 support, install the [optional build tools for ARM64, and the Windows 10 SDK for ARM64](https://blogs.windows.com/buildingapps/2018/11/15/official-support-for-windows-10-on-arm-development/).

## Install the Speech SDK

To install the Speech SDK for Unity, follow these steps:

1. Download and open the [Speech SDK for Unity](https://aka.ms/csspeech/unitypackage), which is packaged as a Unity asset package (.unitypackage), and should already be associated with Unity. When the asset package is opened, the **Import Unity Package** dialog box appears. You may need to create and open an empty project for this step to work.

   [![Import Unity Package dialog box in the Unity Editor](~/articles/cognitive-services/speech-service/media/sdk/qs-csharp-unity-01-import.png)](~/articles/cognitive-services/speech-service/media/sdk/qs-csharp-unity-01-import.png#lightbox)

1. Ensure that all files are selected, and select **Import**. After a few moments, the Unity asset package is imported into your project.

For more information about importing asset packages into Unity, see the [Unity documentation](https://docs.unity3d.com/Manual/AssetPackages.html).

You can now move on to [Next steps](#next-steps) below.

## Next steps

[!INCLUDE [windows](../quickstart-list.md)]
