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

Azure Media Services enables you to encode your media files in the cloud. You might want to stream your content in Apple's HLS or MPEG DASH formats so it can be played on a wide variety of browsers and devices. Or, you might want to analyze your video or audio content. This topic give you guidance on how to encode your content with Media Services.

## Presets

### Built-in presets

Media Services defines a set of built-in system encoding presets you can use when creating encoding jobs. Currently, the following predefined presets are supported.

|Preset name|Scenario|More info|
|---|---|---|
|AudioAnalyzerPreset|Analyzing audio||
|VideoAnalyzerPreset|Analyzing video|For more information, see [Analyze video](analyze-videos-tutorial-with-api.md)|
|BuiltInStandardEncoderPreset|Streaming|Used to set built-in presets:<br/>EncoderNamedPreset.AdaptiveStreaming (recommended). For more information, see [auto-generating a bitrate ladder](autogen-bitrate-ladder.md).<br/>EncoderNamedPreset.AACGoodQualityAudio (produces a single MP4 file containing only stereo audio encoded at 192 kbps).<br/>EncoderNamedPreset.H264MultipleBitrate1080p (produces a set of 8 GOP-aligned MP4 files, ranging from 6000 kbps to 400 kbps, and stereo AAC audio. Resolution starts at 1080p and goes down to 360p).<br/>EncoderNamedPreset.H264MultipleBitrate720p (produces a set of 6 GOP-aligned MP4 files, ranging from 3400 kbps to 400 kbps, and stereo AAC audio. Resolution starts at 720p and goes down to 360p.)<br/>EncoderNamedPreset.H264MultipleBitrateSD (Produces a set of 5 GOP-aligned MP4 files, ranging from 1600kbps to 400 kbps, and stereo AAC audio. Resolution starts at 480p and goes down to 360p).<br/><br/>For more information, see [Uploading, encoding, and streaming files](stream-files-tutorial-with-api.md).|
|StandardEncoderPreset|Streaming|Used to set a custom encoder preset. For more information, see [How to customize encoder presets](customize-encoder-presets-how-to.md).|

### Custom presets

Media Services fully supports customizing all values in presets to meet your specific encoding needs and requirements. General steps when encoding with a custom preset are:

For a detailed explanations and example, see [How to customize encoder presets](customize-encoder-presets-how-to.md).

Find more detailed information about the schema of the encoder is in the [REST reference documentation](https://docs.microsoft.com/rest/api/media/transforms). 

## Tranforms and jobs

To encode with Media Services v3, you need to create a transform and a job. A transform defines the recipe for your encoding settings and outputs, and the job is an instance of the recipe. 

For more information, see [Transforms and Jobs](transform-concept.md)

## Scaling encoding in v3

Currently, customers have to use the Azure portal or AMS v2 APIs to set RUs (as described in [Scaling media processing](../previous/media-services-scale-media-processing-overview.md). 

## Using APIs to encode

### Tutorials

The following tutorals show how to encode your content with Media Services:

* [Upload, encode, and stream using Azure Media Services](stream-files-tutorial-with-api.md)
* [Analyze videos with Azure Media Services](analyze-videos-tutorial-with-api.md)

### Code samples

The following code samples contain code that shows how to encode with Media Services:

* [.NET Core](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/tree/master/NETCore)
* [CLI 2.0](https://github.com/Azure/azure-docs-cli-python-samples/tree/master/media-services)

### SDKs

You can use any of the following supported Media Services SDKs to encode your content.

* [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/ams?view=azure-cli-latest)
* [REST](https://go.microsoft.com/fwlink/p/?linkid=873030)
* [.NET](https://docs.microsoft.com/dotnet/api/overview/azure/mediaservices/management?view=azure-dotnet)
* [Java](https://docs.microsoft.com/java/api/overview/azure/mediaservices)
* [Python](https://docs.microsoft.com/python/api/overview/azure/media-services?view=azure-python)

## Next steps

> [!div class="nextstepaction"]
> [Stream video files](stream-files-dotnet-quickstart.md)
