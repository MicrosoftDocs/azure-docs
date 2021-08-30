---
title: How to use the content-aware encoding preset
description: This article discusses how to use the content-aware encoding preset in Microsoft Azure Media Services v3.
services: media-services
documentationcenter: ''
author: jiayali-ms
manager: femila
editor: ''
ms.service: media-services
ms.workload: 
ms.topic: how-to
ms.date: 08/17/2021
ms.author: inhenkel
ms.custom: devx-track-csharp
---

# How to use the content aware encoding preset

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

## Introduction
The [content aware encoding preset](encode-content-aware-how-to.md) better prepares content for delivery by [adaptive bitrate streaming](encode-autogen-bitrate-ladder.md), where videos need to encode at multiple bitrates.It includes custom logic that lets the encoder seek the optimal bitrate value for a given resolution without requiring extensive computational analysis. The preset determines the optimal number of layers, appropriate bitrate and resolution settings for delivery by adaptive streaming. 

Compared to the adaptive streaming preset, content aware encoding is more effective for low and medium complexity videos, where the output files will be at a lower bitrate but still at a quality that delivers a good viewing experience.

## Use the content aware encoding preset
You can create transforms that use this preset as follows.

> [!NOTE]
> Make sure to use the **ContentAwareEncoding** preset not  ContentAwareEncodingExperimental. Or, if you would like to encode with HEVC, you can use **H265ContentAwareEncoding**.

```csharp
TransformOutput[] output = new TransformOutput[]
{
   new TransformOutput
   {
      // The preset for the Transform is set to one of Media Services built-in sample presets.
      // You can customize the encoding settings by changing this to use "StandardEncoderPreset" class.
      Preset = new BuiltInStandardEncoderPreset()
      {
         // This sample uses the new preset for content-aware encoding
         PresetName = EncoderNamedPreset.ContentAwareEncoding
      }
   }
};
```

See the [Next steps](#next-steps) section for tutorials that use transform outputs. The output asset can be delivered from Media Services streaming endpoints in protocols such as MPEG-DASH and HLS (as shown in the tutorials).

> [!NOTE]
> Encoding jobs using the `ContentAwareEncoding` preset are being billed based on solely the output minutes. AMS uses two-pass encoding and there are not any additional charges associated with using any of the presets beyond what is listed on our [pricing page](https://azure.microsoft.com/pricing/details/media-services/#overview).
  
## Next steps

* [Tutorial: Upload, encode, and stream videos with Media Services v3](stream-files-tutorial-with-api.md)
* [Tutorial: Encode a remote file based on URL and stream the video - REST](stream-files-tutorial-with-rest.md)
* [Tutorial: Encode a remote file based on URL and stream the video - CLI](stream-files-cli-quickstart.md)
* [Tutorial: Encode a remote file based on URL and stream the video - .NET](stream-files-dotnet-quickstart.md)
* [Tutorial: Encode a remote file based on URL and stream the video - Node.js](stream-files-nodejs-quickstart.md)
