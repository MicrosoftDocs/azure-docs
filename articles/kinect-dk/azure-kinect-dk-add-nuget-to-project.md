---
title: Azure Kinect Add NuGet package to VS project
description: Azure Kinect Add NuGet package to VS project
author: wesbarc
ms.author: wesbarc
ms.prod: kinect-dk
ms.date: 29/05/2019
ms.topic: conceptual
keywords: kinect, azure, sensor, sdk, visual studio 2017, visual studio 2019, nuget
---

# Adding Azure Kinect NuGet package to your Visual Studio Project

The Azure Kinect NuGet package to install is `Microsoft.Azure.Kinect.Sensor` and is published at [nuget.org](https://www.nuget.org). The ["Install and use a Package"](https://docs.microsoft.com/en-us/nuget/quickstart/install-and-use-a-package-in-visual-studio) article illustrates how to add NuGet packages to a project. 

Once the package is added, add header file includes to the source code, such as: 
- `#include <k4a/k4a.h>`
- `#include <k4arecord/record.h>`
- `#include <k4arecord/playback.h>`