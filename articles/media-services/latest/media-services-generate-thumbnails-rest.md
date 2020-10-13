---
title: How to generate thumbnails using Azure Media Services Encoder Standard with REST
description: This article shows how to use REST to encode an asset and generate thumbnails at the same time using Media Encoder Standard.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 08/31/2020
ms.author: inhenkel

---
# How to generate thumbnails using Encoder Standard with REST

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

You can use Media Encoder Standard to generate one or more thumbnails from your input video in [JPEG](https://en.wikipedia.org/wiki/JPEG), [PNG](https://en.wikipedia.org/wiki/Portable_Network_Graphics), or [BMP](https://en.wikipedia.org/wiki/BMP_file_format) image file formats.

## Recommended reading and practice

It is recommended that you become familiar with custom transforms by reading [How to encode with a custom transform - REST](custom-preset-rest-howto.md).

## Thumbnail parameters

You should set the following parameters:

- **start** - The position in the input video from where to start generating thumbnails. The value can be in ISO 8601 format (For example, PT05S to start at 5 seconds), or a frame count (For example, 10 to start at the 10th frame), or a relative value to stream duration (For example, 10% to start at 10% of stream duration). Also supports a macro {Best}, which tells the encoder to select the best thumbnail from the first few seconds of the video and will only produce one thumbnail, no matter what other settings are for Step and Range. The default value is macro {Best}.
- **step** - The intervals at which thumbnails are generated. The value can be in ISO 8601 format (for example, PT05S for one image every 5 seconds), or a frame count (for example, 30 for one image every 30 frames), or a relative value to stream duration (for example, 10% for one image every 10% of stream duration). Step value will affect the first generated thumbnail, which may not be exactly the one specified at transform preset start time. This is due to the encoder, which tries to select the best thumbnail between start time and step position from start time as the first output. As the default value is 10%, it means that if the stream has long duration, the first generated thumbnail might be far away from the one specified at start time. Try to select a reasonable value for step if the first thumbnail is expected be close to start time, or set the range value to 1 if only one thumbnail is needed at start time.
- **range** - The position relative to transform preset start time in the input video at which to stop generating thumbnails. The value can be in ISO 8601 format (For example, PT5M30S to stop at 5 minutes and 30 seconds from start time), or a frame count (For example, 300 to stop at the 300th frame from the frame at start time. If this value is 1, it means only producing one thumbnail at start time), or a relative value to the stream duration (For example, 50% to stop at half of stream duration from start time). The default value is 100%, which means to stop at the end of the stream.
- **layers** - A collection of output image layers to be produced by the encoder.

## Example of a "single PNG file" preset

The following JSON preset can be used to produce a single output PNG file from the first few seconds of the input video, where the encoder makes a best-effort attempt at finding an “interesting” frame. Note that the output image dimensions have been set to 100%, meaning these match the dimensions of the input video. Note also how the “Format” setting in "Outputs" is required to match the use of "PngLayers" in the “Codecs” section.  

```json
{
    "properties": {
        "description": "Basic Transform using a custom encoding preset for thumbnails",
        "outputs": [
            {
                "onError": "StopProcessingJob",
                "relativePriority": "Normal",
                "preset": {
                    "@odata.type": "#Microsoft.Media.StandardEncoderPreset",
                    "codecs": [
                        {
                            "@odata.type": "#Microsoft.Media.PngImage",
                            "stretchMode": "AutoSize",
                            "start": "{Best}",
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
            }
        ]
    }
}

```

## Example of a "series of JPEG images" preset

The following JSON preset can be used to produce a set of 10 images at timestamps of 5%, 15%, …, 95% of the input timeline, where the image size is specified to be one quarter that of the input video.

### JSON preset

```json
{
  "Version": 1.0,
  "Codecs": [
    {
      "JpgLayers": [
        {
          "Quality": 90,
          "Type": "JpgLayer",
          "Width": "25%",
          "Height": "25%"
        }
      ],
      "Start": "5%",
      "Step": "10%",
      "Range": "96%",
      "Type": "JpgImage"
    }
  ],
  "Outputs": [
    {
      "FileName": "{Basename}_{Index}{Extension}",
      "Format": {
        "Type": "JpgFormat"
      }
    }
  ]
}
```

## Example of a "one image at a specific timestamp" preset

The following JSON preset can be used to produce a single JPEG image at the 30-second mark of the input video. This preset expects the input video to be more than 30 seconds in duration (else the job fails).

### JSON preset

```json
{
  "Version": 1.0,
  "Codecs": [
    {
      "JpgLayers": [
        {
          "Quality": 90,
          "Type": "JpgLayer",
          "Width": "25%",
          "Height": "25%"
        }
      ],
      "Start": "00:00:30",
      "Step": "1",
      "Range": "1",
      "Type": "JpgImage"
    }
  ],
  "Outputs": [
    {
      "FileName": "{Basename}_{Index}{Extension}",
      "Format": {
        "Type": "JpgFormat"
      }
    }
  ]
}
```

## Example of a "thumbnails at different resolutions" preset

The following preset can be used to generate thumbnails at different resolutions in one task. In the example, at positions 5%, 15%, …, 95% of the input timeline, the encoder generates two images – one at 100% of the input video resolution and the other at 50%.

Note the use of {Resolution} macro in the FileName; it indicates to the encoder to use the width and height that you specified in the Encoding section of the preset while generating the file name of the output images. This also helps you distinguish between the different images easily.

### JSON preset

```json
{
  "Version": 1.0,
  "Codecs": [
    {
      "JpgLayers": [
{
  "Quality": 90,
  "Type": "JpgLayer",
  "Width": "100%",
  "Height": "100%"
},
{
  "Quality": 90,
  "Type": "JpgLayer",
  "Width": "50%",
  "Height": "50%"
}

      ],
      "Start": "5%",
      "Step": "10%",
      "Range": "96%",
      "Type": "JpgImage"
    }
  ],
  "Outputs": [
    {
      "FileName": "{Basename}_{Resolution}_{Index}{Extension}",
      "Format": {
"Type": "JpgFormat"
      }
    }
  ]
}
```

## Example of generating a thumbnail while encoding

While all of the above examples have discussed how you can submit an encoding task that only produces images, you can also combine video/audio encoding with thumbnail generation. The following JSON preset tells Encoder Standard to generate a thumbnail during encoding.

### JSON preset

For information about schema, see [this](/azure/media-services/previous/media-services-mes-schema) article.

```json
{
  "Version": 1.0,
  "Codecs": [
    {
      "KeyFrameInterval": "00:00:02",
      "SceneChangeDetection": "true",
      "H264Layers": [
        {
          "Profile": "Auto",
          "Level": "auto",
          "Bitrate": 4500,
          "MaxBitrate": 4500,
          "BufferWindow": "00:00:05",
          "Width": 1280,
          "Height": 720,
          "ReferenceFrames": 3,
          "EntropyMode": "Cabac",
          "AdaptiveBFrame": true,
          "Type": "H264Layer",
          "FrameRate": "0/1"

        }
      ],
      "Type": "H264Video"
    },
    {
      "JpgLayers": [
        {
          "Quality": 90,
          "Type": "JpgLayer",
          "Width": "100%",
          "Height": "100%"
        }
      ],
      "Start": "{Best}",
      "Type": "JpgImage"
    },
    {
      "Channels": 2,
      "SamplingRate": 48000,
      "Bitrate": 128,
      "Type": "AACAudio"
    }
  ],
  "Outputs": [
    {
      "FileName": "{Basename}_{Index}{Extension}",
      "Format": {
        "Type": "JpgFormat"
      }
    },
    {
      "FileName": "{Basename}_{Resolution}_{VideoBitrate}.mp4",
      "Format": {
        "Type": "MP4Format"
      }
    }
  ]
}
```

## Next steps
[Generate thumbnails using .NET](media-services-generate-thumbnails-dotnet.md)
