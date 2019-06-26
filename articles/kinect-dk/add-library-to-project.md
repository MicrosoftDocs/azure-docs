---
title: Add Azure Kinect library to your Visual Studio project
description: Add the Azure Kinect library to a project
author: wes-b
ms.author: wes-b
ms.prod: kinect-dk
ms.date: 06/26/2019
ms.topic: conceptual
keywords: kinect, azure, sensor, sdk, visual studio 2017, visual studio 2019, nuget
---

# Add Azure Kinect library to your Visual Studio project

This article walks you through the process of adding Azure Kinect NuGet package to your Visual Studio Project.

## Install Azure Kinect NuGet package

To install the Azure Kinect NuGet package:

1. You can find detailed instructions for installing a NuGet package in Visual Studio in the [Quickstart: Install and use a package in Visual Studio](https://docs.microsoft.com/nuget/quickstart/install-and-use-a-package-in-visual-studio).
2. To add the package, you can use Package Manager UI by right-clicking References and choosing Manage NuGet Packages from Solution Explorer.
3. Choose [nuget.org](https://www.nuget.org) as the Package source, select Browse tab, and search for `Microsoft.Azure.Kinect.Sensor`.
4. Select that package from the list and install.

## Use Azure Kinect NuGet package

Once the package is added, add header file includes to the source code, such as:

- `#include <k4a/k4a.h>`
- `#include <k4arecord/record.h>`
- `#include <k4arecord/playback.h>`

## Next steps

> [!div class="nextstepaction"]
>[Now you are ready to build your first application](build-first-app.md)
