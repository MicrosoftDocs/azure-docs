---
title: Quickstart - Create HoloLens app with Azure Spatial Anchors | Microsoft Docs
description: In this quickstart, you learn how to build a HoloLens app using Spatial Anchors.
author: craigktreasure
manager: aliemami
services: azure-spatial-anchors

ms.assetid: 7bc4dab8-ca78-4423-b06b-3962a7b45eaa
ms.author: crtreasu
ms.date: 12/13/2018
ms.topic: quickstart
ms.service: azure-spatial-anchors
# ms.reviewer: MSFT-alias-of-reviewer
#Customer intent: As a Mixed Reality developer, I want to learn how to use Spatial Anchors in my HoloLens app that can place and locate a 3D object that persists across devices and platforms.
---
# Quickstart: Create a HoloLens app with Spatial Anchors

[Spatial Anchors](../overview.md) is a cross-platform developer service that allows you to create Mixed Reality experiences
using objects that persist their location across devices over time. This tutorial covers how to create a HoloLens DirectX C++/WinRT
app using Spatial Anchors. When you're finished, you'll have a HoloLens app that can save and recall a spatial anchor.

You'll learn how to:

> [!div class="checklist"]
> * Create a Spatial Anchors account
> * Configure the Spatial Anchors endpoint and account key
> * Deploy and run on a HoloLens device

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this quickstart, make sure you have:

- A Windows machine with <a href="https://www.visualstudio.com/downloads/" target="_blank">Visual Studio 2017</a> installed with the **Universal Windows Platform development** workload and the **Windows 10 SDK (10.0.17763.0)** component.
- The [C++/WinRT Visual Studio Extension (VSIX)](https://aka.ms/cppwinrt/vsix) for Visual Studio should be installed from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/).
- A HoloLens device with [developer mode](https://docs.microsoft.com/windows/mixed-reality/using-visual-studio) enabled.

> [!NOTE]
> This article requires a HoloLens device with the [Windows 10 October 2018 Update](https://blogs.windows.com/windowsexperience/2018/10/02/find-out-whats-new-in-windows-and-office-in-october/) (also known
> as RS5). To update to the latest release on HoloLens, open the **Settings** app, go to **Update & Security**, then select
> the **Check for updates** button.

[!INCLUDE [Create Spatial Anchors resource](../../../includes/azure-spatial-anchors-get-started-create-resource.md)]

## Open the sample project

[!INCLUDE [Clone Sample Repo](../../../includes/azure-spatial-anchors-clone-sample-repository.md)]

Open `HoloLens\DirectX\SampleHoloLens.sln` in Visual Studio.

## Configure the Spatial Anchors endpoint and account key

The next step is to use the endpoint and account key recorded previously when setting up the Spatial Anchors resource to configure the app.

Open `HoloLens\DirectX\SampleHoloLens\ViewController.cpp`.

Locate the `SpatialAnchorsAccountKey` field and replace `Set me` with the account key.

Locate the `SpatialAnchorsEndpoint` field and replace `Set me` with the endpoint.

## Deploy the app to your HoloLens

Change the **Solution Configuration** to **Release**, change **Solution Platform** to **x86**, and select **Device** from the deployment target options.

![Visual Studio Configuration](./media/get-started-hololens/visual-studio-configuration.png)

Power on the HoloLens device, sign in, and connect it to the PC using a USB cable.

Select **Debug** > **Start debugging** to deploy your app and start debugging.

Follow the instructions in the app to place and recall an anchor.

In Visual Studio, stop the app by either selecting **Stop Debugging** or pressing **Shift + F5**.

[!INCLUDE [Clean-up section](../../../includes/clean-up-section-portal.md)]
