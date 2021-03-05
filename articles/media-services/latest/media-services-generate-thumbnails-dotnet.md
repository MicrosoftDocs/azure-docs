---
title: Generate thumbnails using Media Encoder Standard .NET
description: This article shows how to use .NET to encode an asset and generate thumbnails at the same time using Media Encoder Standard.
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
ms.date: 12/01/2020
ms.author: inhenkel
ms.custom: devx-track-csharp
---
# How to generate thumbnails using Encoder Standard with .NET

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

You can use Media Encoder Standard to generate one or more thumbnails from your input video in [JPEG](https://en.wikipedia.org/wiki/JPEG) or [PNG](https://en.wikipedia.org/wiki/Portable_Network_Graphics) image file formats.

## Recommended reading and practice

It is recommended that you become familiar with custom transforms by reading [How to encode with a custom transform - .NET](customize-encoder-presets-how-to.md).

## Transform code example

The below code example creates just a thumbnail.  You should set the following parameters:

- **start** - The position in the input video from where to start generating thumbnails. The value can be in ISO 8601 format (For example, PT05S to start at 5 seconds), or a frame count (For example, 10 to start at the 10th frame), or a relative value to stream duration (For example, 10% to start at 10% of stream duration). Also supports a macro {Best}, which tells the encoder to select the best thumbnail from the first few seconds of the video and will only produce one thumbnail, no matter what other settings are for Step and Range. The default value is macro {Best}.
- **step** - The intervals at which thumbnails are generated. The value can be in ISO 8601 format (for example, PT05S for one image every 5 seconds), or a frame count (for example, 30 for one image every 30 frames), or a relative value to stream duration (for example, 10% for one image every 10% of stream duration). Step value will affect the first generated thumbnail, which may not be exactly the one specified at transform preset start time. This is due to the encoder, which tries to select the best thumbnail between start time and step position from start time as the first output. As the default value is 10%, it means that if the stream has long duration, the first generated thumbnail might be far away from the one specified at start time. Try to select a reasonable value for step if the first thumbnail is expected be close to start time, or set the range value to 1 if only one thumbnail is needed at start time.
- **range** - The position relative to transform preset start time in the input video at which to stop generating thumbnails. The value can be in ISO 8601 format (For example, PT5M30S to stop at 5 minutes and 30 seconds from start time), or a frame count (For example, 300 to stop at the 300th frame from the frame at start time. If this value is 1, it means only producing one thumbnail at start time), or a relative value to the stream duration (For example, 50% to stop at half of stream duration from start time). The default value is 100%, which means to stop at the end of the stream.
- **layers** - A collection of output image layers to be produced by the encoder.

```csharp

private static Transform EnsureTransformExists(IAzureMediaServicesClient client, string resourceGroupName, string accountName, string transformName)
{
    // Does a Transform already exist with the desired name? Assume that an existing Transform with the desired name
    // also uses the same recipe or Preset for processing content.
    Transform transform = client.Transforms.Get(resourceGroupName, accountName, transformName);

    if (transform == null)
    {
        // Create a new Transform Outputs array - this defines the set of outputs for the Transform
        TransformOutput[] outputs = new TransformOutput[]
        {
            // Create a new TransformOutput with a custom Standard Encoder Preset
            // This demonstrates how to create custom codec and layer output settings

          new TransformOutput(
                new StandardEncoderPreset(
                    codecs: new Codec[]
                    {
                        // Generate a set of PNG thumbnails
                        new PngImage(
                            start: "25%",
                            step: "25%",
                            range: "80%",
                            layers: new PngLayer[]{
                                new PngLayer(
                                    width: "50%",
                                    height: "50%"
                                )
                            }
                        )
                    },
                    // Specify the format for the output files for the thumbnails
                    formats: new Format[]
                    {
                        new PngFormat(
                            filenamePattern:"Thumbnail-{Basename}-{Index}{Extension}"
                        )
                    }
                ),
                onError: OnErrorType.StopProcessingJob,
                relativePriority: Priority.Normal
            )
        };

        string description = "A transform that includes thumbnails.";
        // Create the custom Transform with the outputs defined above
        transform = client.Transforms.CreateOrUpdate(resourceGroupName, accountName, transformName, outputs, description);
    }

    return transform;
}
```

## Next steps

[Generate thumbnails using REST](media-services-generate-thumbnails-rest.md)
