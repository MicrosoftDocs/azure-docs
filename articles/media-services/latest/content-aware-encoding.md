---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: An experimental preset for content-aware encoding - Azure | Microsoft Docs
description: This article discusses content-aware encoding in Microsoft Azure Media Services v3.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 04/05/2019
ms.author: juliako
ms.custom: 

---

# Experimental preset for content-aware encoding

In order to prepare content for delivery by [adaptive bitrate streaming](https://en.wikipedia.org/wiki/Adaptive_bitrate_streaming), video needs to be encoded at multiple bit-rates (high to low). In order to ensure graceful degradation of quality, as the bitrate is lowered so is the resolution of the video. This results in a so-called encoding ladder – a table of resolutions and bitrates; see the Media Services [built-in encoding presets](https://docs.microsoft.com/rest/api/media/transforms/createorupdate#encodernamedpreset).

## Overview

Interest in moving beyond a one-preset-fits-all-videos approach increased after Netflix published their [blog](https://medium.com/netflix-techblog/per-title-encode-optimization-7e99442b62a2) in December 2015. Since then, multiple solutions for content-aware encoding have been released in the marketplace; see [this article](https://www.streamingmedia.com/Articles/Editorial/Featured-Articles/Buyers-Guide-to-Per-Title-Encoding-130676.aspx) for an overview. The idea is to be aware of the content – to customize or tune the encoding ladder to the complexity of the individual video. At each resolution, there is a bitrate beyond which any increase in quality is not perceptive – the encoder operates at this optimal bitrate value. The next level of optimization is to select the resolutions based on the content – for example, a video of a PowerPoint presentation does not benefit from going below 720p. Going further, the encoder can be tasked to optimize the settings for each shot within the video. Netflix described [such an approach](https://medium.com/netflix-techblog/optimized-shot-based-encodes-now-streaming-4b9464204830) in 2018.

In early 2017, Microsoft released the [Adaptive Streaming](autogen-bitrate-ladder.md) preset to address the problem of the variability in the quality and resolution of the source videos. Our customers had a varying mix of content, some at 1080p, others at 720p, and a few at SD and lower resolutions. Furthermore, not all source content was high quality mezzanines from film or TV studios. The Adaptive Streaming preset addresses these problems by ensuring that the bitrate ladder never exceeds the resolution or the average bitrate of the input mezzanine.

The new content-aware encoding preset extends that mechanism, by incorporating custom logic that lets the encoder seek the optimal bitrate value for a given resolution, but without requiring extensive computational analysis. This preset produces a set of GOP-aligned MP4s. Given any input content, the service performs an initial lightweight analysis of the input content, and uses the results to determine the optimal number of layers, appropriate bitrate and resolution settings for delivery by adaptive streaming. This preset is particularly effective for low and medium complexity videos, where the output files will be at lower bitrates than the Adaptive Streaming preset but at a quality that still delivers a good experience to viewers. The output will contain MP4 files with video and audio interleaved

See the following sample graphs that show the comparison using quality metrics like [PSNR](https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio) and [VMAF](https://en.wikipedia.org/wiki/Video_Multimethod_Assessment_Fusion). The source was created by concatenating short clips of high complexity shots from movies and TV shows, intended to stress the encoder. By definition, this preset produces results that vary from content to content – it also means that for some content, there may not be significant reduction in bitrate or improvement in quality.

![Rate-distortion (RD) curve using PSNR](media/cae-experimental/msrv1.png)

**Figure 1: Rate-distortion (RD) curve using PSNR metric for high complexity source**

![Rate-distortion (RD) curve using VMAF](media/cae-experimental/msrv2.png)

**Figure 2: Rate-distortion (RD) curve using VMAF metric for high complexity source**

Below are the results for another category of source content, where the encoder was able to determine that the input was of poor quality (many compression artifacts because of the low bitrate). Note that with the content-aware preset, the encoder decided to produce just one output layer – at a low enough bitrate so that most clients would be able to play the stream without stalling.

![RD curve using PSNR](media/cae-experimental/msrv3.png)

**Figure 3: RD curve using PSNR for low quality input (at 1080p)**

![RD curve using VMAF](media/cae-experimental/msrv4.png)

**Figure 4: RD curve using VMAF for low quality input (at 1080p)**

## Use the experimental preset

You can create transforms that use this preset as follows. If using a tutorial [such as this](stream-files-tutorial-with-api.md), you can update the code as follows:

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

> [!NOTE]
> The underlying algorithms are subject to further improvements. There can and will be changes over time to the logic used for generating bitrate ladders, with the goal of providing an algorithm that is robust, and adapts to a wide variety of input conditions. Encoding jobs using this preset will still be billed based on output minutes, and the output asset can be delivered from our streaming endpoints in protocols such as DASH and HLS.

## Next steps

Now that you have learned about this new option of optimizing your videos, we invite you to try it out. You can send us feedback using the links at the end of this article.
