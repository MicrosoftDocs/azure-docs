---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Encoding in the cloud with Media Services - Azure | Microsoft Docs
description: This topic describes the encoding process when using Azure Media Services
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 02/17/2019
ms.author: juliako
ms.custom: seodec18

---

# Encoding with Media Services

Azure Media Services enables you to encode your high-quality digital media files into formats that can be played on a wide variety of browsers and devices. For example, you might want to stream your content in Apple's HLS or MPEG DASH formats. This topic gives you guidance on how to encode your content with Media Services v3.

To encode with Media Services v3, you need to create a [Transform](https://docs.microsoft.com/rest/api/media/transforms) and a [Job](https://docs.microsoft.com/rest/api/media/jobs). A transform defines the recipe for your encoding settings and outputs, and the job is an instance of the recipe. For more information, see [Transforms and Jobs](transforms-jobs-concept.md)

When encoding with Media Services, you use presets to tell the encoder how the input media files should be processed. For example, you can specify the video resolution and/or the number of audio channels you want in the encoded content. 

You can get started quickly with one of the recommended built-in presets based on industry best practices or you can choose to build a custom preset to target your specific scenario or device requirements. For more information, see [Encode with a custom Transform](customize-encoder-presets-how-to.md). 

Starting with January 2019, when encoding with Media Encoder Standard to produce MP4 file(s), a new .mpi file is generated and added to the output Asset. This MPI file is intended to improve performance for [dynamic packaging](dynamic-packaging-overview.md) and streaming scenarios.

> [!NOTE]
> You should not modify or remove the MPI file, or take any dependency in your service on the existence (or not) of such a file.

## Built-in presets

Media Services currently supports the following built-in encoding presets:  

### BuiltInStandardEncoderPreset preset

[BuiltInStandardEncoderPreset](https://docs.microsoft.com/rest/api/media/transforms/createorupdate#builtinstandardencoderpreset) is used to set a built-in preset for encoding the input video with the Standard Encoder. 

The following presets are currently supported:

- **EncoderNamedPreset.AdaptiveStreaming** (recommended). For more information, see [auto-generating a bitrate ladder](autogen-bitrate-ladder.md).
- **EncoderNamedPreset.AACGoodQualityAudio** - produces a single MP4 file containing only stereo audio encoded at 192 kbps.
- **EncoderNamedPreset.H264MultipleBitrate1080p** - produces a set of 8 GOP-aligned MP4 files, ranging from 6000 kbps to 400 kbps, and stereo AAC audio. Resolution starts at 1080p and goes down to 360p.
- **EncoderNamedPreset.H264MultipleBitrate720p** - produces a set of 6 GOP-aligned MP4 files, ranging from 3400 kbps to 400 kbps, and stereo AAC audio. Resolution starts at 720p and goes down to 360p.
- **EncoderNamedPreset.H264MultipleBitrateSD** - produces a set of 5 GOP-aligned MP4 files, ranging from 1600kbps to 400 kbps, and stereo AAC audio. Resolution starts at 480p and goes down to 360p.<br/><br/>For more information, see [Uploading, encoding, and streaming files](stream-files-tutorial-with-api.md).

### StandardEncoderPreset preset

[StandardEncoderPreset](https://docs.microsoft.com/rest/api/media/transforms/createorupdate#standardencoderpreset) describes settings to be used when encoding the input video with the Standard Encoder. Use this preset when customizing Transform presets. 

#### Custom presets

Media Services fully supports customizing all values in presets to meet your specific encoding needs and requirements. You use the **StandardEncoderPreset** preset when customizing Transform presets. For a detailed explanations and example, see [How to customize encoder presets](customize-encoder-presets-how-to.md).

## Scaling encoding in v3

Currently, customers have to use the Azure portal or Media Services v2 APIs to set RUs (as described in [Scaling media processing](../previous/media-services-scale-media-processing-overview.md). 

## Next steps

* [Transforms and Jobs](transforms-jobs-concept.md)
* [Upload, encode, and stream using Media Services](stream-files-tutorial-with-api.md)
