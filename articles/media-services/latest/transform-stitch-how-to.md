---
title: How to stitch two or more video files with .NET | Microsoft Docs
description: This article shows how to stitch two or more video files.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: how-to
ms.date: 03/24/2021
ms.author: inhenkel
ms.custom: devx-track-csharp
---

# How to stitch two or more video files with .NET

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

## Stitch two or more video files

The following example illustrates how you can generate a preset to stitch two or more video files. The most common scenario is when you want to add a header or a trailer to the main video.

> [!NOTE]
> Video files edited together should share properties (video resolution, frame rate, audio track count, etc.). You should take care not to mix videos of different frame rates, or with different number of audio tracks.

## Prerequisites

Clone or download the [Media Services .NET samples](https://github.com/Azure-Samples/media-services-v3-dotnet/).  The code that is referenced below is located in the [EncodingWithMESCustomStitchTwoAssets folder](https://github.com/Azure-Samples/media-services-v3-dotnet/blob/main/VideoEncoding/EncodingWithMESCustomStitchTwoAssets/Program.cs).
