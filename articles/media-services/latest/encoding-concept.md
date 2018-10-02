---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Encoding in the cloud with Azure Media Services  | Microsoft Docs
description: This topic describes the encoding process when using Azure Media Services
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 04/21/2018
ms.author: juliako
---

# Encoding with Azure Media Services

Azure Media Services enables you to encode your high-quality digital media files into formats that can be played on a wide variety of browsers and devices. For example, you might want to stream your content in Apple's HLS or MPEG DASH formats. Media Services also lets you analyze your video or audio content. This topic give you guidance on how to encode your content with Media Services v3.

To encode with Media Services v3, you need to create a transform and a job. A transform defines the recipe for your encoding settings and outputs, and the job is an instance of the recipe. For more information, see [Transforms and Jobs](transform-concept.md)

When encoding with Azure Media Services, you use presets to tell the encoder how the input media files should be processed. For example, you can specify the video resolution and/or the number of audio channels you want in the encoded content. 

You can get started quickly with one of the recommended built-in presets based on industry best practices or you can choose to build a custom preset to target your specific scenario or device requirements. 

Find details about the encoder in the [OpenAPI Specification](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/mediaservices/resource-manager/Microsoft.Media/preview/2018-03-30-preview). 

## Built-in presets

Media Services currently supports the following built-in encoding presets:  

|**Preset name**|**Scenario**|**Details**|
|---|---|---|
|**AudioAnalyzerPreset**|Analyzing audio|The preset applies a pre-defined set of AI-based analysis operations, including speech transcription. Currently, the preset supports processing of content with a single audio track.<br/>You can specify the language for the audio payload in the input using the BCP-47 format of 'language tag-region' (for example, 'en-US'). The list of supported languages are, 'en-US', 'en-GB', 'es-ES', 'es-MX', 'fr-FR', 'it-IT', 'ja-JP', 'pt-BR', 'zh-CN'.|
|**VideoAnalyzerPreset**|Analyzing audio and video|Extracts insights (rich metadata) from both audio and video, and outputs a JSON format file. You can specify whether you only want to extract audio insights when processing a video file. For more information, see [Analyze video](analyze-videos-tutorial-with-api.md).|
|**BuiltInStandardEncoderPreset**|Streaming|Used to set a built-in preset for encoding the input video with the Standard Encoder. <br/>The following presets are currently supported:<br/>**EncoderNamedPreset.AdaptiveStreaming** (recommended). For more information, see [auto-generating a bitrate ladder](autogen-bitrate-ladder.md).<br/>**EncoderNamedPreset.AACGoodQualityAudio** - produces a single MP4 file containing only stereo audio encoded at 192 kbps.<br/>**EncoderNamedPreset.H264MultipleBitrate1080p** - produces a set of 8 GOP-aligned MP4 files, ranging from 6000 kbps to 400 kbps, and stereo AAC audio. Resolution starts at 1080p and goes down to 360p.<br/>**EncoderNamedPreset.H264MultipleBitrate720p** - produces a set of 6 GOP-aligned MP4 files, ranging from 3400 kbps to 400 kbps, and stereo AAC audio. Resolution starts at 720p and goes down to 360p.<br/>**EncoderNamedPreset.H264MultipleBitrateSD** - produces a set of 5 GOP-aligned MP4 files, ranging from 1600kbps to 400 kbps, and stereo AAC audio. Resolution starts at 480p and goes down to 360p.<br/><br/>For more information, see [Uploading, encoding, and streaming files](stream-files-tutorial-with-api.md).|
|**StandardEncoderPreset**|Streaming|Describes settings to be used when encoding the input video with the Standard Encoder. <br/>Use this preset when customizing Transform presets. For more information, see [How to customize Transform presets](customize-encoder-presets-how-to.md).|

## Custom presets

Media Services fully supports customizing all values in presets to meet your specific encoding needs and requirements. You use the **StandardEncoderPreset** preset when customizing Transform presets. For a detailed explanations and example, see [How to customize encoder presets](customize-encoder-presets-how-to.md).

## Scaling encoding in v3

Currently, customers have to use the Azure portal or AMS v2 APIs to set RUs (as described in [Scaling media processing](../previous/media-services-scale-media-processing-overview.md). 

## Next steps

### Tutorials

The following tutorals show how to encode your content with Media Services:

* [Upload, encode, and stream using Azure Media Services](stream-files-tutorial-with-api.md)
* [Analyze videos with Azure Media Services](analyze-videos-tutorial-with-api.md)

### Code samples

The following code samples contain code that shows how to encode with Media Services:

* [.NET Core](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/tree/master/NETCore)
* [Azure CLI](https://github.com/Azure/azure-docs-cli-python-samples/tree/master/media-services)

### SDKs

You can use any of the following supported Media Services v3 SDKs to encode your content.

* [Azure CLI](https://docs.microsoft.com/cli/azure/ams?view=azure-cli-latest)
* [REST](https://docs.microsoft.com/rest/api/media/transforms)
* [.NET](https://docs.microsoft.com/dotnet/api/overview/azure/mediaservices/management?view=azure-dotnet)
* [Java](https://docs.microsoft.com/java/api/overview/azure/mediaservices)
* [Python](https://docs.microsoft.com/python/api/overview/azure/media-services?view=azure-python)

