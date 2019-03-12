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

## Prerequisites 

[Create a Media Services account](create-account-cli-how-to.md). Make sure to remember the resource group name and the Media Services account name. 

[!INCLUDE [media-services-cli-instructions](../../../includes/media-services-cli-instructions.md)]

## Considerations

When creating custom presets, the following considerations apply:

* All values for height and width on AVC content must be a multiple of 4.
* In Azure Media Services v3, all of the encoding bitrates are in bits per second. This is different than the REST v2 Media Encoder Standard presets. For example, the bitrate in v2 would be specified as 128, but in v3 it would be 128000.

## Define a custom preset

The following example defines a custom Transform with a set of outputs that we want to be generated when this Transform is used. In this example, we add an AacAudio layer for the audio encoding and a H264Video for the video encoding. In the video layers, we assign labels so that they can be used for the output file names. We also want to generate a set of PNG thumbnails.

We then specify the format for the output files - one for video + audio, and another for the thumbnails. Since we have multiple H264Layers, we have to use macros that produce unique names per layer. We can either use a `{Label}` or `{Bitrate}`.

We are going to save this transform in a file. In this example, we name the file `customPreset.json`. 

```json
{
    "@odata.type": "#Microsoft.Media.StandardEncoderPreset",
    "codecs": [
        {
            "@odata.type": "#Microsoft.Media.AacAudio",
            "channels": 2,
            "samplingRate": 48000,
            "bitrate": 128000,
            "profile": "AacLc"
        },
        {
            "@odata.type": "#Microsoft.Media.H264Video",
            "keyFrameInterval": "PT2S",
            "stretchMode": "AutoSize",
            "sceneChangeDetection": false,
            "complexity": "Balanced",
            "layers": [
                {
                    "width": "1280",
                    "height": "720",
                    "label": "HD",
                    "bitrate": 1000000,
                    "maxBitrate": 1000000,
                    "bFrames": 3,
                    "slices": 0,
                    "adaptiveBFrame": true,
                    "profile": "Auto",
                    "level": "auto",
                    "bufferWindow": "PT5S",
                    "referenceFrames": 3,
                    "entropyMode": "Cabac"
                },
                {
                    "width": "640",
                    "height": "360",
                    "label": "SD",
                    "bitrate": 600000,
                    "maxBitrate": 600000,
                    "bFrames": 3,
                    "slices": 0,
                    "adaptiveBFrame": true,
                    "profile": "Auto",
                    "level": "auto",
                    "bufferWindow": "PT5S",
                    "referenceFrames": 3,
                    "entropyMode": "Cabac"
                }
            ]
        },
        {
            "@odata.type": "#Microsoft.Media.PngImage",
            "stretchMode": "AutoSize",
            "start": "25%",
            "step": "25%",
            "range": "80%",
            "layers": [
                {
                    "width": "50%",
                    "height": "50%"
                }
            ]
        }
    ],
    "formats": [
        {
            "@odata.type": "#Microsoft.Media.Mp4Format",
            "filenamePattern": "Video-{Basename}-{Label}-{Bitrate}{Extension}",
            "outputFiles": []
        },
        {
            "@odata.type": "#Microsoft.Media.PngFormat",
            "filenamePattern": "Thumbnail-{Basename}-{Index}{Extension}"
        }
    ]
  }
```

## Create a new transform  

In this example, we create a **Transform** that is based on the custom preset we defined earlier. When creating a Transform, you should first check if the desired Transform might already exist. The following `show` command returns the `customTransformName` transform if it exists:

```cli
az ams transform show -a amsaccount -g amsResourceGroup -n customTransformName
```

The following CLI command creates the Transform based on the custom preset (defined earlier). 

```cli
az ams transform create -a amsaccount -g amsResourceGroup -n customTransformName --description "Basic Transform using a custom encoding preset" --preset customPreset.json
```

You submit a Job under the Transform to request for Media Services to apply the transform to the specified video or audio. For a complete example that shows how to submit a job under a transform, see [Quickstart: Stream video files - CLI](stream-files-cli-quickstart.md).

## See also

[Azure CLI](https://docs.microsoft.com/cli/azure/ams?view=azure-cli-latest)
