---
title: Azure Media Services dynamic packaging overview | Microsoft Docs
description: The topic gives an overview of dynamic packaging in Media Services.
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
ms.date: 02/25/2019
ms.author: juliako

---
# Dynamic packaging

Microsoft Azure Media Services can be used to deliver many media source file formats, media streaming formats, and content protection formats to a variety of client technologies (for example, iOS and XBOX). These clients understand different protocols, for example iOS requires an HTTP Live Streaming (HLS) format and Xbox require Smooth Streaming. If you have a set of adaptive bitrate (multi-bitrate) MP4 (ISO Base Media 14496-12) files or a set of adaptive bitrate Smooth Streaming files that you want to serve to clients that understand HLS, MPEG DASH, or Smooth Streaming, you can take advantage of Dynamic Packaging. The packaging is agnostic to the video resolution, SD/HD/UHD-4K are supported.

[Streaming Endpoints](streaming-endpoint-concept.md) is the dynamic packaging service in Media Services used to deliver media content to client players. Dynamic Packaging is a feature that comes standard on all Streaming Endpoints (Standard or Premium). There is no extra cost associated with this feature in Media Services v3. With Dynamic Packaging, all you need is an asset that contains a set of adaptive bitrate MP4 files with manifest file(s). Then, based on the specified format in the manifest or fragment request, you receive the stream in the protocol you have chosen. As a result, you only need to store and pay for the files in single storage format and Media Services service will build and serve the appropriate response based on requests from a client.

In Media Services, Dynamic Packaging is used whether you are streaming on-demand or live.

The following diagram shows the on-demand streaming with dynamic packaging workflow.

![Dynamic Encoding](./media/dynamic-packaging-overview/media-services-dynamic-packaging.svg)

## Common video on-demand workflow

The following is a common Media Services streaming workflow where Dynamic Packaging is used.

1. Upload an input file (called a mezzanine file). For example, H.264, MP4, or WMV (for the list of supported formats see [Formats Supported by the Media Encoder Standard](media-encoder-standard-formats.md).
2. Encode your mezzanine file to H.264 MP4 adaptive bitrate sets.
3. Publish the asset that contains the adaptive bitrate MP4 set.
4. Build URLs that target different formats (HLS, Dash, and Smooth Streaming). The Streaming Endpoint would take care of serving the correct manifest and requests for all these different formats. For example:

    - HLS: `https://amsv3account-usw22.streaming.media.azure.net/21b17732-0112-4d76-b526-763dcd843449/ignite.ism/manifest(format=m3u8-aapl)`
    - Dash: `https://amsv3account-usw22.streaming.media.azure.net/21b17732-0112-4d76-b526-763dcd843449/ignite.ism/manifest(format=mpd-time-csf)`
    - Smooth: `https://amsv3account-usw22.streaming.media.azure.net/21b17732-0112-4d76-b526-763dcd843449/ignite.ism/manifest`

## Video codecs supported by dynamic packaging

Dynamic Packaging supports MP4 files, which contain video encoded with [H.264](https://en.m.wikipedia.org/wiki/H.264/MPEG-4_AVC) (MPEG-4 AVC or AVC1), [H.265](https://en.m.wikipedia.org/wiki/High_Efficiency_Video_Coding) (HEVC, hev1 or hvc1).

## Audio codecs supported by dynamic packaging

Dynamic Packaging supports MP4 files, which contain audio encoded with [AAC](https://en.wikipedia.org/wiki/Advanced_Audio_Coding) (AAC-LC, HE-AAC v1, HE-AAC v2), [Dolby Digital Plus](https://en.wikipedia.org/wiki/Dolby_Digital_Plus) (Enhanced AC-3 or E-AC3), or [DTS](https://en.wikipedia.org/wiki/DTS_%28sound_system%29) (DTS Express, DTS LBR, DTS HD, DTS HD Lossless).

> [!NOTE]
> Dynamic Packaging does not support files that contain [Dolby Digital](https://en.wikipedia.org/wiki/Dolby_Digital) (AC3) audio (it is a legacy codec).

## Next steps

[Upload, encode, stream videos](stream-files-tutorial-with-api.md)

