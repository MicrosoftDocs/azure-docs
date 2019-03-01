---
title: Azure Media Services LiveEvent types | Microsoft Docs
description: This article shows a detailed table that compare LiveEvent types. 
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: ne
ms.topic: article
ms.date: 02/28/2019
ms.author: juliako

---
# Live Event types comparison

In Azure Media Services, a  [Live Event](https://docs.microsoft.com/rest/api/media/liveevents) can be one of two types: live encoding and pass-through. 

## Types comparison 

The following table compares features of the two Live Event types.

| Feature | Pass-through Live Event | Standard Live Event |
| --- | --- | --- |
| Single bitrate input is encoded into multiple bitrates in the cloud |No |Yes |
| Maximum video resolution for contribution feed |4K (4096x2160 at 60 frames/sec) |1080p (1920x1088 at 30 frames/sec)|
| Recommended maximum layers in contribution feed|Up to 12|One audio|
| Maximum layers in output| Same as input|Up to 6|
| Maximum aggregate bandwidth of contribution feed|60 Mbps|N/A|
| Maximum bitrate for a single layer in the contribution |20 Mbps|20 Mbps|
| Support for multiple language audio tracks|Yes|No|
| Supported input video codecs |H.264/AVC and H.265/HEVC|H.264/AVC|
| Supported output video codecs|Same as input|H.264/AVC|
| Supported video bit depth, input, and output|Up to 10-bit including HDR 10/HLG|8-bit|
| Supported input audio codecs|AAC-LC, HE-AAC v1, HE-AAC v2|AAC-LC, HE-AAC v1, HE-AAC v2|
| Supported output audio codecs|Same as input|AAC-LC|
| Maximum video resolution of output video|Same as input|720p (at 30 frames/second)|
| Input protocols|RTMP, fragmented-MP4 (Smooth Streaming)|RTMP, fragmented-MP4 (Smooth Streaming)|
| Price|See the [pricing page](https://azure.microsoft.com/pricing/details/media-services/) and click on "Live Video" tab|See the [pricing page](https://azure.microsoft.com/pricing/details/media-services/) and click on "Live Video" tab|
| Maximum run time| 24 hrs x 365 days, live linear | Up to 24 hours|
| Ability to pass through embedded CEA 608/708 captions data|Yes|Yes|
| Support for inserting slates|No|No|
| Support for ad signaling via API| No|No|
| Support for ad signaling via SCTE-35 in-band messages|Yes|Yes|
| Ability to recover from brief stalls in contribution feed|Yes|No (Live Event will begin slating after 6+ seconds w/o input data)|
| Support for non-uniform input GOPs|Yes|No – input must have fixed GOP duration|
| Support for variable frame rate input|Yes|No – input must be fixed frame rate. Minor variations are tolerated, for example, during high motion scenes. But the contribution feed cannot drop the frame rate (for example, to 15 frames/sec).|
| Auto-shutoff of Live Event when input feed is lost|No|After 12 hours, if there is no LiveOutput running|

## Next steps

[Live streaming overview](live-streaming-overview.md)
