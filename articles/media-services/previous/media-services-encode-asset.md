---
title: Overview of Azure on-demand media encoders | Microsoft Docs
description: Azure Media Services provides multiple options for the encoding of media in the cloud. This article gives an overview of Azure on-demand media encoders.
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/25/2019
ms.author: juliako

---
# Overview of Azure on-demand media encoders 

> [!NOTE]
> No new features or functionality are being added to Media Services v2. <br/>Check out the latest version, [Media Services v3](https://docs.microsoft.com/azure/media-services/latest/). Also, see [migration guidance from v2 to v3](../latest/migrate-from-v2-to-v3.md)

Azure Media Services provides multiple options for the encoding of media in the cloud.

When starting out with Media Services, it is important to understand the difference between codecs and file formats.
Codecs are the software that implements the compression/decompression algorithms whereas file formats are containers that hold the compressed video.

Media Services provides dynamic packaging which allows you to deliver your adaptive bitrate MP4 or Smooth Streaming encoded content in streaming formats supported by Media Services (MPEG DASH, HLS, Smooth Streaming) without you having to re-package into these streaming formats.

When your Media Services account is created a **default** streaming endpoint is added to your account in the **Stopped** state. To start streaming your content and take advantage of dynamic packaging and dynamic encryption, the streaming endpoint from which you want to stream content has to be in the **Running** state. Billing for streaming endpoints occurs whenever the endpoint is in a **Running** state.

Media Services supports the following on demand encoders that are described in this article:

* [Media Encoder Standard](media-services-encode-asset.md#media-encoder-standard)
* [Media Encoder Premium Workflow](media-services-encode-asset.md#media-encoder-premium-workflow)

This article gives a brief overview of on demand media encoders and provides links to articles that give more detailed information. The topic also provides comparison of the encoders.

By default each Media Services account can have one active encoding task at a time. You can reserve encoding units that allow you to have multiple encoding tasks running concurrently, one for each encoding reserved unit you purchase. For information, see [Scaling encoding units](media-services-scale-media-processing-overview.md).

## Media Encoder Standard

### How to use
[How to encode with Media Encoder Standard](media-services-dotnet-encode-with-media-encoder-standard.md)

### Formats
[Formats and codecs](media-services-media-encoder-standard-formats.md)

### Presets
Media Encoder Standard is configured using one of the encoder presets described [here](https://go.microsoft.com/fwlink/?linkid=618336&clcid=0x409).

### Input and output metadata
The encoders input metadata is described [here](media-services-input-metadata-schema.md).

The encoders output metadata is described [here](media-services-output-metadata-schema.md).

### Generate thumbnails
For information, see [How to generate thumbnails using Media Encoder Standard](media-services-advanced-encoding-with-mes.md#thumbnails).

### Trim videos (clipping)
For information, see [How to trim videos using Media Encoder Standard](media-services-advanced-encoding-with-mes.md#trim_video).

### Create overlays
For information, see [How to create overlays using Media Encoder Standard](media-services-advanced-encoding-with-mes.md#overlay).

### See also
[The Media Services blog](https://azure.microsoft.com/blog/2015/07/16/announcing-the-general-availability-of-media-encoder-standard/)

## Media Encoder Premium Workflow
### Overview
[Introducing Premium Encoding in Azure Media Services](https://azure.microsoft.com/blog/2015/03/05/introducing-premium-encoding-in-azure-media-services/)

### How to use
Media Encoder Premium Workflow is configured using complex workflows. Workflow files could be created and updated using the [Workflow Designer](media-services-workflow-designer.md) tool.

[How to Use Premium Encoding in Azure Media Services](https://azure.microsoft.com/blog/2015/03/06/how-to-use-premium-encoding-in-azure-media-services/)

### Known issues
If your input video does not contain closed captioning, the output Asset will still contain an empty TTML file.

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

## Related articles
* [Perform advanced encoding tasks by customizing Media Encoder Standard presets](media-services-custom-mes-presets-with-dotnet.md)
* [Quotas and Limitations](media-services-quotas-and-limitations.md)

<!--Reference links in article-->
[1]: https://azure.microsoft.com/pricing/details/media-services/
