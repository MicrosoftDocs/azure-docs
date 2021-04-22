---
title: Encode custom transform  .NET
description: This topic shows how to use Azure Media Services v3 to encode a custom transform using .NET.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''
ms.service: media-services
ms.workload: 
ms.topic: how-to
ms.date: 08/31/2020
ms.author: inhenkel
ms.custom: seodec18
---

# How to encode with a custom transform - .NET

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

When encoding with Azure Media Services, you can get started quickly with one of the recommended built-in presets based on industry best practices as demonstrated in the [Streaming files](stream-files-tutorial-with-api.md) tutorial. You can also build a custom preset to target your specific scenario or device requirements.

## Considerations

When creating custom presets, the following considerations apply:

* All values for height and width on AVC content must be a multiple of 4.
* In Azure Media Services v3, all of the encoding bitrates are in bits per second. This is different from the presets with our v2 APIs, which used kilobits/second as the unit. For example, if the bitrate in v2 was specified as 128 (kilobits/second), in v3 it would be set to 128000 (bits/second).

## Prerequisites

[Create a Media Services account](./account-create-how-to.md)

## Download the sample

Clone a GitHub repository that contains the full .NET Core sample to your machine using the following command:  

 ```bash
 git clone https://github.com/Azure-Samples/media-services-v3-dotnet.git
 ```
 
The custom preset sample is located in the [Encoding with a custom preset using .NET](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/VideoEncoding/EncodingWithMESCustomPreset_H264) folder.

## Create a transform with a custom preset

When creating a new [Transform](/rest/api/media/transforms), you need to specify what you want it to produce as an output. The required parameter is a [TransformOutput](/rest/api/media/transforms/createorupdate#transformoutput) object, as shown in the code below. Each **TransformOutput** contains a **Preset**. The **Preset** describes the step-by-step instructions of video and/or audio processing operations that are to be used to generate the desired **TransformOutput**. The following **TransformOutput** creates custom codec and layer output settings.

When creating a [Transform](/rest/api/media/transforms), you should first check if one already exists using the **Get** method, as shown in the code that follows. In Media Services v3, **Get** methods on entities return **null** if the entity doesn't exist (a case-insensitive check on the name).

## Next steps

[Streaming files](stream-files-tutorial-with-api.md) 
