---
title: Azure Media Services dynamic packaging overview | Microsoft Docs
description: The topic gives and overview of dynamic packaging.
author: Juliako
manager: erikre
editor: ''
services: media-services
documentationcenter: ''

ms.assetid: 0d9e4f54-5daa-45c1-bfaa-cf09ca89b812
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/29/2017
ms.author: juliako

---
# Dynamic packaging
## Overview
Microsoft Azure Media Services can be used to deliver many media source file formats, media streaming formats, and content protection formats to a variety of client technologies (for example, iOS, XBOX, Silverlight, Windows 8). These clients understand different protocols, for example iOS requires an HTTP Live Streaming (HLS) V4 format and Silverlight and Xbox require Smooth Streaming. If you have a set of adaptive bitrate (multi-bitrate) MP4 (ISO Base Media 14496-12) files or a set of adaptive bitrate Smooth Streaming files that you want to serve to clients that understand MPEG DASH, HLS or Smooth Streaming, you should take advantage of Media Services dynamic packaging.

With dynamic packaging all you need is to create an asset that contains a set of adaptive bitrate MP4 files or adaptive bitrate Smooth Streaming files. Then, based on the specified format in the manifest or fragment request, the On-Demand Streaming server will ensure that you receive the stream in the protocol you have chosen. As a result, you only need to store and pay for the files in single storage format and Media Services service will build and serve the appropriate response based on requests from a client.

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
To prepare your asset for dynamic streaming you have two options:

1. [Upload a master file](media-services-dotnet-upload-files.md).
2. [Use the Media Encoder Standard encoder to produce H.264 MP4 adaptive bitrate sets](media-services-dotnet-encode-with-media-encoder-standard.md).
3. [Stream your content](media-services-deliver-content-overview.md).

## <a id="unsupported_formats"></a>Formats that are not supported by dynamic packaging
The following source file formats are not supported by dynamic packaging.

* Dolby digital mp4 files.
* Dolby digital smooth files.

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

