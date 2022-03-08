---
title: Install Azure Spatial Anchors for a C++/WinRT HoloLens application
description: Configure a C++/WinRT HoloLens project to use Azure Spatial Anchors
author: pamistel
manager: MehranAzimi-msft
services: azure-spatial-anchors

ms.author: pamistel
ms.date: 11/20/2020
ms.topic: how-to
ms.service: azure-spatial-anchors
---

# Configuring Azure Spatial Anchors in a C++/WinRT HoloLens project

## Requirements

* [Visual Studio 2019](https://www.visualstudio.com/downloads/) installed with the **Universal Windows Platform development** workload and the **Windows 10 SDK (10.0.18362.0 or newer)** component.

## Configuring a project

Azure Spatial Anchors for HoloLens and C++/WinRT is distributed using the [Microsoft.Azure.SpatialAnchors.WinRT](https://www.nuget.org/packages/Microsoft.Azure.SpatialAnchors.WinRT/) NuGet package.

Follow the instructions [here](/nuget/consume-packages/install-use-packages-visual-studio) to use Visual Studio's NuGet Package Manager to install the [Microsoft.Azure.SpatialAnchors.WinRT](https://www.nuget.org/packages/Microsoft.Azure.SpatialAnchors.WinRT/) NuGet package into your project.

## Next steps

> [!div class="nextstepaction"]
> [How To: Create and locate anchors in C++/WinRT](./create-locate-anchors-cpp-winrt.md)