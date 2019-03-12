---
title: Encode custom transform using Media Services v3 CLI - Azure | Microsoft Docs
description: This topic shows how to use Azure Media Services v3 to encode a custom transform using CLI.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.custom: 
ms.date: 03/11/2019
ms.author: juliako

---

# How to encode with a custom Transform

When encoding with Azure Media Services, you can get started quickly with one of the recommended built-in presets based on industry best practices as demonstrated in the [Streaming files](stream-files-cli-quickstart.md#create-a-transform-for-adaptive-bitrate-encoding) quickstart. You can also build a custom preset to target your specific scenario or device requirements.

> [!Note]
> In Azure Media Services v3, all of the encoding bit rates are in bits per second. This is different than the REST v2 Media Encoder Standard presets. For example, the bitrate in v2 would be specified as 128, but in v3 it would be 128000.

## Prerequisites 

[Create a Media Services account](create-account-cli-how-to.md). Make sure to remember the resource group name and the Media Services account name. 

[!INCLUDE [media-services-cli-instructions](../../../includes/media-services-cli-instructions.md)]

## Define a custom preset

The following example defines a custom preset that we are going to save in the `customPreset.json` file. 

```json
{
  "@odata.type": "#Microsoft.Media.StandardEncoderPreset",
  "codecs": [
      {
          "@odata.type": "#Microsoft.Media.AacAudio",
          "profile": "AacLc",
          "channels": 2,
          "samplingRate": 48000,
          "bitrate": 128000
      },
      {
          "@odata.type": "#Microsoft.Media.H264Video",
          "sceneChangeDetection": false,
          "complexity": "Balanced",
          "layers": [
              {
                  "@odata.type": "#Microsoft.Media.H264Layer",
                  "profile": "Auto",
                  "level": "auto",
                  "bufferWindow": "PT5S",
                  "referenceFrames": 3,
                  "entropyMode": "Cabac",
                  "bitrate": 2000000,
                  "maxBitrate": 2000000,
                  "bFrames": 3,
                  "slices": 0,
                  "adaptiveBFrame": true,
                  "width": "1280",
                  "height": "720"
              },
              {
                  "@odata.type": "#Microsoft.Media.H264Layer",
                  "profile": "Auto",
                  "level": "auto",
                  "bufferWindow": "PT5S",
                  "referenceFrames": 3,
                  "entropyMode": "Cabac",
                  "bitrate": 1000000,
                  "maxBitrate": 1000000,
                  "bFrames": 3,
                  "slices": 0,
                  "adaptiveBFrame": true,
                  "width": "640",
                  "height": "360"
              }
          ],
          "keyFrameInterval": "PT2S",
          "stretchMode": "AutoSize"
      }
  ],
  "formats": [
      {
          "@odata.type": "#Microsoft.Media.Mp4Format",
          "outputFiles": [],
          "filenamePattern": "{Basename}_{Bitrate}{Extension}"
      }
  ]
}
```

## Create a transform with the custom preset 

You create a [Transform](https://docs.microsoft.com/cli/azure/ams/transform?view=azure-cli-latest) to configure common tasks for encoding or analyzing your videos. In this example, we create a **Transform** that is based on the custom preset we defined earlier. When creating a Transform, you should first check if one already exists. The following `show` command returns the `customTransformName` if the transform exists:

```cli
az ams transform show -a amsaccount -g amsResourceGroup -n customTransformName
```

The following CLI command creates the Transform based on the custom preset (defined earlier). 

```cli
az ams transform create -a amsaccount -g amsResourceGroup -n customTransformName --description "Basic Transform using a custom encoding preset" --preset customPreset.json
```

If the Transform has been successfully created, you can submit a job under the transform. The job is the request to Media Services to apply the transform to the given video. For a complete example that shows how to submit a job under a transform, see [Quickstart: Stream video files - CLI](stream-files-cli-quickstart.md).

## See also

[Azure CLI](https://docs.microsoft.com/cli/azure/ams?view=azure-cli-latest)
