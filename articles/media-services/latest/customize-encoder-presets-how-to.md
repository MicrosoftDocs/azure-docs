---
title: Encode custom transform using Media Services v3 .NET - Azure | Microsoft Docs
description: This topic shows how to use Azure Media Services v3 to encode a custom transform using .NET.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 05/03/2019
ms.author: juliako
ms.custom: seodec18

---

# How to encode with a custom transform - .NET

When encoding with Azure Media Services, you can get started quickly with one of the recommended built-in presets based on industry best practices as demonstrated in the [Streaming files](stream-files-tutorial-with-api.md) tutorial. You can also build a custom preset to target your specific scenario or device requirements.

## Considerations

When creating custom presets, the following considerations apply:

* All values for height and width on AVC content must be a multiple of 4.
* In Azure Media Services v3, all of the encoding bitrates are in bits per second. This is different from the presets with our v2 APIs, which used kilobits/second as the unit. For example, if the bitrate in v2 was specified as 128 (kilobits/second), in v3 it would be set to 128000 (bits/second).

## Prerequisites 

[Create a Media Services account](create-account-cli-how-to.md)

## Download the sample

Clone a GitHub repository that contains the full .NET Core sample to your machine using the following command:  

 ```bash
 git clone https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials.git
 ```
 
The custom preset sample is located in the [EncodeCustomTransform](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/blob/master/NETCore/EncodeCustomTransform/) folder.

## Create a transform with a custom preset 

When creating a new [Transform](https://docs.microsoft.com/rest/api/media/transforms), you need to specify what you want it to produce as an output. The required parameter is a [TransformOutput](https://docs.microsoft.com/rest/api/media/transforms/createorupdate#transformoutput) object, as shown in the code below. Each **TransformOutput** contains a **Preset**. The **Preset** describes the step-by-step instructions of video and/or audio processing operations that are to be used to generate the desired **TransformOutput**. The following **TransformOutput** creates custom codec and layer output settings.

When creating a [Transform](https://docs.microsoft.com/rest/api/media/transforms), you should first check if one already exists using the **Get** method, as shown in the code that follows. In Media Services v3, **Get** methods on entities return **null** if the entity doesn't exist (a case-insensitive check on the name).

### Example

The following example defines a set of outputs that we want to be generated when this Transform is used. We first add an AacAudio layer for the audio encoding and two H264Video layers for the video encoding. In the video layers, we assign labels so that they can be used in the output file names. Next, we want the output to also include thumbnails. In the example below we specify images in PNG format, generated at 50% of the resolution of the input video, and at three timestamps - {25%, 50%, 75} of the length of the input video. Lastly, we specify the format for the output files - one for video + audio, and another for the thumbnails. Since we have multiple H264Layers, we have to use macros that produce unique names per layer. We can either use a `{Label}` or `{Bitrate}` macro, the example shows the former.

[!code-csharp[Main](../../../media-services-v3-dotnet-core-tutorials/NETCore/EncodeCustomTransform/MediaV3ConsoleApp/Program.cs#EnsureTransformExists)]

## Next steps

[Streaming files](stream-files-tutorial-with-api.md) 
