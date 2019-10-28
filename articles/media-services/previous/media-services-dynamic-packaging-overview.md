---
title: Azure Media Services dynamic packaging overview | Microsoft Docs
description: The topic gives an overview of dynamic packaging.
author: Juliako
manager: femila
editor: ''
services: media-services
documentationcenter: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/21/2019
ms.author: juliako

---
# Dynamic packaging

> [!div class="op_single_selector" title1="Select the version of Media Services that you are using:"]
> * [Version 3](../latest/dynamic-packaging-overview.md)
> * [Version 2](media-services-dynamic-packaging-overview.md)

> [!NOTE]
> No new features or functionality are being added to Media Services v2. <br/>Check out the latest version, [Media Services v3](https://docs.microsoft.com/azure/media-services/latest/). Also, see [migration guidance from v2 to v3](../latest/migrate-from-v2-to-v3.md)

Microsoft Azure Media Services can be used to deliver many media source file formats, media streaming formats, and content protection formats to a variety of client technologies (for example, iOS, XBOX, Silverlight, Windows 8). These clients understand different protocols, for example iOS requires an HTTP Live Streaming (HLS) V4 format and Silverlight and Xbox require Smooth Streaming. If you have a set of adaptive bitrate (multi-bitrate) MP4 (ISO Base Media 14496-12) files or a set of adaptive bitrate Smooth Streaming files that you want to serve to clients that understand MPEG DASH, HLS or Smooth Streaming, you should take advantage of Media Services dynamic packaging.

With dynamic packaging all, you need is to create an asset that contains a set of adaptive bitrate MP4 files or adaptive bitrate Smooth Streaming files. Then, based on the specified format in the manifest or fragment request, the On-Demand Streaming server will ensure that you receive the stream in the protocol you have chosen. As a result, you only need to store and pay for the files in single storage format and Media Services service will build and serve the appropriate response based on requests from a client.

The following diagram shows the traditional encoding and static packaging workflow.

![Static Encoding](./media/media-services-dynamic-packaging-overview/media-services-static-packaging.png)

The following diagram shows the dynamic packaging workflow.

![Dynamic Encoding](./media/media-services-dynamic-packaging-overview/media-services-dynamic-packaging.png)

## Common scenario

1. Upload an input file (called a mezzanine file). For example, H.264, MP4, or WMV (for the list of supported formats see [Formats Supported by the Media Encoder Standard](media-services-media-encoder-standard-formats.md).
2. Encode your mezzanine file to H.264 MP4 adaptive bitrate sets.
3. Publish the asset that contains the adaptive bitrate MP4 set by creating the On-Demand Locator.
4. Build the streaming URLs to access and stream your content.

## Preparing assets for dynamic streaming

To prepare your asset for dynamic streaming, you have the following options:

- [Upload a master file](media-services-dotnet-upload-files.md).
- [Use the Media Encoder Standard encoder to produce H.264 MP4 adaptive bitrate sets](media-services-dotnet-encode-with-media-encoder-standard.md).
- [Stream your content](media-services-deliver-content-overview.md).

## Audio codecs supported by dynamic packaging

Dynamic Packaging supports MP4 files, which contain audio encoded with [AAC](https://en.wikipedia.org/wiki/Advanced_Audio_Coding) (AAC-LC, HE-AAC v1, HE-AAC v2), [Dolby Digital Plus](https://en.wikipedia.org/wiki/Dolby_Digital_Plus)(Enhanced AC-3 or E-AC3), Dolby Atmos, or [DTS](https://en.wikipedia.org/wiki/DTS_%28sound_system%29) (DTS Express, DTS LBR, DTS HD, DTS HD Lossless). Streaming of Dolby Atmos content is supported for standards like MPEG-DASH protocol with either Common Streaming Format (CSF) or Common Media Application Format (CMAF) fragmented MP4, and via HTTP Live Streaming (HLS) with CMAF.

> [!NOTE]
> Dynamic Packaging does not support files that contain [Dolby Digital](https://en.wikipedia.org/wiki/Dolby_Digital) (AC3) audio (it is a legacy codec).

## Media Services learning paths

[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback

[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

