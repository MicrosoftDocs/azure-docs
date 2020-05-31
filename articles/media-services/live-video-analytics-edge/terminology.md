---
title: Terminology - Azure
description: This article provides an overview of Live Video Analytics on IoT Edge terminology.
ms.topic: conceptual
ms.date: 05/30/2020

---
# Terminology

This article provides an overview of terminology related to [Live Video Analytics on IoT Edge](overview.md).

## Azure Media Services

Azure Media Services is a cloud media platform that enables you to build media solutions. You can learn more about it in the [Azure Media Services](../latest/media-services-overview.md) documentation.

## Asset

[Asset](../latest/assets-concept.md) is an entity in Azure Media Services that maps to a blob container in the Azure storage account that is attached to a Media Services account. All files associated with an asset are stored as blobs in that container while Media Services holds the metadata (for example, a name, description, creation time) associated with the asset.

Live Video Analytics on IoT Edge can create assets and/or add data to existing assets. This enables the scenarios of continuous and event-based video recording and playback (with video capture on the edge device, recording to Azure Media Services, and playback via existing Azure Media Services streaming capabilities).

## Streaming

If you have watched video on a mobile device from services like Netflix, YouTube, and others, you have experienced streaming video. Playback begins soon after you hit “play” (if you have sufficient bandwidth), and you can seek back and forth along the timeline of the video. With streaming, the idea is to deliver only the portion of the video that is being watched, and to let the viewer start playing the video while the data is still being transferred from a server to the playback client. In the context of Azure Media Services, [streaming](https://en.wikipedia.org/wiki/Streaming_media) refers to the process of delivering media from [Azure Media Services](https://docs.microsoft.com/azure/media-services/azure-media-player/azure-media-player-overview) to a streaming client (for example, Azure Media Player). You can use Azure Media Services to stream video to clients using industry-standard, HTTP-based media streaming protocols like [HTTP Live Streaming (HLS)](https://developer.apple.com/streaming/) and [MPEG-DASH](https://dashif.org/about/). HLS is supported by Azure Media Player, and web-players like [JW Player](https://www.jwplayer.com/), [hls.js](https://github.com/video-dev/hls.js/), [VideoJS](https://videojs.com/), [Google’s Shaka Player](https://github.com/google/shaka-player), or you can render natively in mobile apps with Android's [Exoplayer](https://github.com/google/ExoPlayer) and iOS's [AV Foundation](https://developer.apple.com/av-foundation/). MPEG-DASH is likewise supported by Azure Media Player, [find a list of clients on this page](https://dashif.org/clients/). 

By using [media graph](#media-graph)s to record videos to an asset in Azure Media Services, you can make use of Media Services streaming capability to deliver video streams in HLS and DASH. You can learn more about that in the [video playback](video-playback-concept.md) article.

## Recording

In the context of a video management system for security cameras, video recording refers to the process of capturing video from the cameras and storing it in a file (or files) for subsequent viewing via mobile and browser apps. Video recording can be categorized into [continuous video recording](continuous-video-recording-concept.md) and [event-based video recording](event-based-video-recording-concept.md). These are explained in more detail in the [Video recording](video-recording-concept.md) concept page.

## Media graph

[Media graph](media-graph-concept.md) lets you define where media should be captured from, how it should be processed, and where the results should be delivered. It enables you to define a graph consisting of sources, processors, and sink nodes and hence provides the ability for you to build live video analytics applications. Media graph is covered in detail in the media graph concept page.

## RTSP

[RTSP](https://tools.ietf.org/html/rfc2326) refers to Real-Time Streaming Protocol. It is an application-level protocol for control over the delivery of data with real-time properties. RTSP provides an extensible framework to enable controlled, on-demand delivery of real-time data, such as audio and video. 

## VMS

[VMS](https://en.wikipedia.org/wiki/Video_management_system) refers to a Video Management System. Such systems are used to configure and control CCTV cameras, capture and record videos from them. These systems also provide client applications to play back the recorded video

## Next steps

[Media graphs](media-graph-concept.md)
