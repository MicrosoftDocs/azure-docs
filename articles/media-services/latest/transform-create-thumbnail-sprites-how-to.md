---
title: Create a thumbnail sprites transform
description: How do I create thumbnail sprites? You can create a transform for a job that will generate thumbnail sprites for your videos.  This article shows you how.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: 

ms.assetid:
ms.service: media-services
ms.devlang: csharp
ms.topic: how-to
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 2/17/2021
ms.author: inhenkel
---

# Create a thumbnail sprite transform

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

This article shows you how with the Media Services 2020-05-01 v3 API.

You can use Media Encoder Standard to generate a thumbnail sprite, which is a JPEG file that contains multiple small resolution thumbnails stitched together into a single (large) image, together with a VTT file. This VTT file specifies the time range in the input video that each thumbnail represents, together with the size and coordinates of that thumbnail within the large JPEG file. Video players use the VTT file and sprite image to show a 'visual' seekbar, providing a viewer with visual feedback when scrubbing back and forward along the video timeline.

Add the code snippets for your preferred development language.

## [REST](#tab/rest/)

[!INCLUDE [code snippet for thumbnail sprites using REST](./includes/task-create-thumb-sprites-rest.md)]

## [.NET](#tab/dotnet/)

[!INCLUDE [code snippet for thumbnail sprites using REST](./includes/task-create-thumb-sprites-dotnet.md)]

See also thumbnail sprite creation in a [complete encoding sample](https://github.com/Azure-Samples/media-services-v3-dotnet/blob/main/VideoEncoding/Encoding_SpriteThumbnail/Program.cs#L261-L287) at Azure Samples.

---

## Next steps

[!INCLUDE [transforms next steps](./includes/transforms-next-steps.md)]
