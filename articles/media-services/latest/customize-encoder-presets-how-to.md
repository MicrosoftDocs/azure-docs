---
title: Encode custom transform using Azure Media Services v3 | Microsoft Docs
description: This topic shows how to use Azure Media Services v3 to encode a custom transform.
services: media-services
documentationcenter: ''
author: Juliako
manager: cflower
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.custom: 
ms.date: 05/17/2018
ms.author: juliako
---

# How to encode with a custom Transform

When encoding with Azure Media Services, you can get started quickly with one of the recommended built-in presets based on industry best practices as demonstrated in the [Streaming files](stream-files-tutorial-with-api.md) tutorial, or you can choose to build a custom preset to target your specific scenario or device requirements. 

> [!Note]
> In Azure Media Services v3, all of the encoding bit rates are in bits per second. This is different than the REST v2 Media Encoder Standard presets. For example, the bitrate in v2 would be specified as 128, but in v3 it would be 128000.

## Download the sample

Clone a GitHub repository that contains the full .NET Core sample to your machine using the following command:  

 ```bash
 git clone https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials.git
 ```
 
The custom preset sample is located in the [EncodeCustomTransform](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/blob/master/NETCore/EncodeCustomTransform/) folder.

## Create a transform with a custom preset 

When creating a new [Transform](https://docs.microsoft.com/rest/api/media/transforms), you need to specify what you want it to produce as an output. The required parameter is a **TransformOutput** object, as shown in the code below. Each **TransformOutput** contains a **Preset**. **Preset** describes the step-by-step instructions of video and/or audio processing operations that are to be used to generate the desired **TransformOutput**. The following **TransformOutput** creates custom codec and layer output settings.

When creating a [Transform](https://docs.microsoft.com/rest/api/media/transforms), you should first check if one already exists using the **Get** method, as shown in the code that follows.  In Media Services v3, **Get** methods on entities return **null** if the entity doesn't exist (a case-insensitive check on the name).

[!code-csharp[Main](../../../media-services-v3-dotnet-core-tutorials/NETCore/EncodeCustomTransform/MediaV3ConsoleApp/Program.cs#EnsureTransformExists)]

## Next steps

[Streaming files](stream-files-tutorial-with-api.md) 
