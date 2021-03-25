---
title: How to crop video files with Media Services - .NET | Microsoft Docs
description: Cropping is the process of selecting a rectangular window within the video frame, and encoding just the pixels within that window. This topic shows how to crop video files with Media Services using .NET.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: how-to
ms.date: 03/24/2021
ms.author: inhenkel
---

# How to crop video files with Media Services - .NET

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

You can use Media Services to crop an input video. Cropping is the process of selecting a rectangular window within the video frame, and encoding just the pixels within that window. The following diagram helps illustrate the process.

Cropping is a pre-processing stage, so the *cropping parameters* in the encoding preset apply to the *input* video. Encoding is a subsequent stage, and the width/height settings apply to the *pre-processed* video, and not to the original video. When designing your preset, do the following:

1. Select the crop parameters based on the original input video
1. Select your encode settings based on the cropped video.

> [!WARNING]
> If you do not match your encode settings to the cropped video, the output will not be as you expect.

For example, your input video has a resolution of 1920x1080 pixels (16:9 aspect ratio), but has black bars (pillar boxes) at the left and right, so that only a 4:3 window or 1440x1080 pixels contains active video. You can crop the black bars, and encode the 1440x1080 area.

## Transform code

The following code snippet illustrates how to write a transform in .NET to crop videos.  The code assumes that you have a local file to work with.

- Left is the left-most location of the crop.
- Top is the top-most location of the crop.
- Width is the final width of the crop.
- Height is the final height of the crop.

```dotnet
var preset = new StandardEncoderPreset

    {

        Filters = new Filters

        {                   

            Crop = new Rectangle

            {

                Left = "200",

                Top = "200",

                Width = "1280",

                Height = "720"

            }

        },

        Codecs =

        {

            new AacAudio(),

            new H264Video()

            {

                Layers =

                {                           

                    new H264Layer

                    {

                        Bitrate = 1000000,

                        Width = "1280",

                        Height = "720"

                    }

                }

            }

        },

        Formats =

        {

            new Mp4Format

            {

                FilenamePattern = "{Basename}_{Bitrate}{Extension}"

            }

        }

    }

```
