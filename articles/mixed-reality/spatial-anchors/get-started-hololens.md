---
title: Create HoloLens app - Azure Spatial Anchors | Microsoft Docs
description: Learn how to build a HoloLens app using Spatial Anchors.
author: craigktreasure
manager: aliemami
services: spatial-anchors

ms.assetid: 7bc4dab8-ca78-4423-b06b-3962a7b45eaa
ms.author: crtreasu
ms.date: 12/13/2018
ms.topic: quickstart
ms.service: spatial-anchors
# ms.reviewer: MSFT-alias-of-reviewer
---
# Quickstart: Create a HoloLens app with Spatial Anchors

[Spatial Anchors](overview.md) is a cross-platform developer service that makes it easy for you to create
Mixed Reality experiences. This quickstart shows how to create a HoloLens DirectX C++/WinRT app using spatial anchors. When you're finished,
you'll have an HoloLens app that can save and recall a spatial anchor.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

Before you get started, here's a list of prerequisites:

- A Windows machine with <a href="https://www.visualstudio.com/downloads/" target="_blank">Visual Studio 2017</a> installed with the **Universal Windows Platform development** workload and the **Windows 10 SDK (10.0.17763.0)** component.
- The [C++/WinRT Visual Studio Extension (VSIX)](https://aka.ms/cppwinrt/vsix) for Visual Studio should be installed from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/).
- A HoloLens device with [developer mode](https://docs.microsoft.com/en-us/windows/mixed-reality/using-visual-studio) enabled.

> [!NOTE]
> This article requires a HoloLens device with the [Windows 10 October 2018 Update](https://blogs.windows.com/windowsexperience/2018/10/02/find-out-whats-new-in-windows-and-office-in-october/) (also known
> as RS5). To update to the latest release on HoloLens, open the **Settings** app, go to **Update & Security**, then select
> the **Check for updates** button.

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Open the sample project

[!INCLUDE [Clone Sample Repo](../../../includes/spatial-anchors-clone-sample-repository.md)]

Open `holo.cpp\samples\SampleHoloLens.sln` in Visual Studio.

## Configure the Spatial Anchors endpoint and account key

**TODO**

## Deploy the app to your HoloLens

Change the **Solution Configuration** to **Release**, change **Solution Platform** to **x86**, and select **Device** from the deployment target options.

![Visual Studio Configuration](./media/get-started-hololens/visual-studio-configuration.png)

Power on the HoloLens device, sign in, and connect it to the PC using a USB cable.

Select **Debug** > **Start debugging** to deploy your app and start debugging.

Follow the instructions in the app to place and recall an anchor.

In Visual Studio, stop the app by either selecting **Stop Debugging** or pressing **Shift + F5**.

[!INCLUDE [Clean-up section](../../../includes/clean-up-section-portal.md)]
