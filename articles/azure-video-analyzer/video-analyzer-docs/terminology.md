---
title: Azure Video Analyzer terminology
description: This article provides an overview of Azure Video Analyzer terminology.
ms.topic: conceptual
ms.date: 03/10/2021

---
# Azure Video Analyzer terminology

This article provides an overview of terminology related to [Azure Video Analyzer](overview.md).

## Video

When you create an Azure Video Analyzer account, you have to associate an Azure storage account with it. If you use Azure Video Analyzer to record the live video from a camera, that data is stored as blobs in a container in the storage account. Videos are resources in your Azure Video Analyzer account that map to such blob containers. All content associated with such video resources are stored as blobs in the corresponding containers, while Azure Video Analyzer holds the metadata (such as a name, description, creation time).

You can use Azure Video Analyzer to create video resources and add data to existing videos. This enables the scenarios of continuous and event-based video recording and playback (with video capture on the edge device, recording to Azure Video Analyzer, and playback via Azure Video Analyzer streaming capabilities).

## gRPC

[gRPC](https://grpc.io/docs/guides/) is a language agnostic, high-performance Remote Procedure Call (RPC) framework. It uses session-based structured schemas via [Protocol Buffers 3](https://developers.google.com/protocol-buffers/docs/proto3) as its underlying message interchange format for communication.

## Pipeline Topology

[Pipeline Topology]()<!--media-graph.md--> lets you define where media should be captured from, how it should be processed, and where the results should be delivered. It enables you to define a graph consisting of sources, processors, and sink nodes and hence provides the ability for you to build live video analytics applications. 

## Recording

In the context of a video management system for security cameras, video recording refers to the process of capturing video from the cameras and storing it in a file (or files) for subsequent viewing via mobile and browser apps. Video recording can be categorized into [continuous video recording]()<!--continuous-video-recording.md--> and [event-based video recording]()<!--event-based-video-recording.md-->. These are explained in more detail in the [Video recording]()<!--video-recording.md--> concept page.

## RTSP

[RTSP](https://tools.ietf.org/html/rfc2326) refers to Real-Time Streaming Protocol. It is an application-level protocol for control over the delivery of data with real-time properties. RTSP provides an extensible framework to enable controlled, on-demand delivery of real-time data, such as audio and video. 

## Streaming

<!--//TODO: Update when AVA Player is shipped-->
If you have watched video on a mobile device from services like Netflix, YouTube, and others, you have experienced streaming video. Playback begins soon after you hit “play” (if you have sufficient bandwidth), and you can seek back and forth along the timeline of the video. With streaming, the idea is to deliver only the portion of the video that is being watched, and to let the viewer start playing the video while the data is still being transferred from a server to the playback client. In the context of Azure Video Analyzer, [streaming](https://en.wikipedia.org/wiki/Streaming_media) refers to the process of delivering media from Azure Video Analyzer videos to a streaming client (for example, Azure Video Analyzer Player<<TODO: LINK>>). You can use Azure Video Analyzer to stream video to clients using industry-standard, HTTP-based media streaming protocols like [HTTP Live Streaming (HLS)](https://developer.apple.com/streaming/) and [MPEG-DASH](https://dashif.org/about/). HLS is supported by Azure Video Analyzer Player, and web-players like [JW Player](https://www.jwplayer.com/), [hls.js](https://github.com/video-dev/hls.js/), [VideoJS](https://videojs.com/), [Google’s Shaka Player](https://github.com/google/shaka-player), or you can render natively in mobile apps with Android's [Exoplayer](https://github.com/google/ExoPlayer) and iOS's [AV Foundation](https://developer.apple.com/av-foundation/). MPEG-DASH is likewise supported by Azure Video Analyzer Player, [find a list of clients on this page](https://dashif.org/clients/). 

By using [pipeline topologies]()<!--[pipeline-topologies.md--> to record video to an Azure Video Analyzer video resource, you can make use of Azure Video Analyzer streaming capability to deliver video streams in HLS and DASH. You can learn more about that in the [video playback]()<!--video-playback.md--> article.

## VMS

[VMS](https://en.wikipedia.org/wiki/Video_management_system) refers to a Video Management System. Such systems are used to configure and control CCTV cameras, capture and record videos from them. These systems also provide client applications to play back the recorded video

## Next steps

[Media graphs]()<!--media-graph.md-->
