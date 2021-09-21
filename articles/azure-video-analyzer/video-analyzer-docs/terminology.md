---
title: Azure Video Analyzer terminology
description: This article provides an overview of Azure Video Analyzer terminology.
ms.service: azure-video-analyzer
ms.topic: conceptual
ms.date: 06/01/2021

---
# Azure Video Analyzer terminology

This article provides an overview of terminology related to [Azure Video Analyzer](overview.md).

## Pipeline topology

A [pipeline topology](pipeline.md) lets you define where media should be captured from, how it should be processed, and where the results should be delivered. It enables you to define a pipeline consisting of sources, processors, and sink nodes with which you can build live video analytics applications. 

## RTSP

[RTSP](https://tools.ietf.org/html/rfc2326) refers to Real-Time Streaming Protocol. It is an application-level protocol for control over the delivery of data with real-time properties. RTSP provides an extensible framework to enable controlled, on-demand delivery of real-time data, such as audio and video. Video Analyzer [supports](pipeline.md#rtsp-source) capturing, analyzing, and recording of video from IP cameras that support RTSP.


## Recording

In the context of a video management system for security cameras, video recording refers to the process of capturing video from the cameras and storing it for subsequent viewing via mobile and browser apps. Video recording can be categorized into [continuous video recording](continuous-video-recording.md) and [event-based video recording](event-based-video-recording-concept.md). These are explained in more detail in the [video recording](video-recording.md) concept page.

## Video

When you create an Video Analyzer account, you have to associate an Azure storage account with it. You can use Video Analyzer to record the live video from a camera and persist that data to either disk or cloud storage. In the latter case data is stored as blobs in a container in the storage account. Videos are resources in your Video Analyzer account that map to such blob containers. All content associated with such video resources are stored as blobs in the corresponding containers, while Video Analyzer holds the metadata (such as a name, description, creation time).

You can use Video Analyzer to create video resources and add data to existing videos. This enables the scenarios of continuous and event-based video recording and playback (with video capture on the edge device, recording to Video Analyzer, and playback via Video Analyzer streaming capabilities).

## gRPC

[gRPC](https://grpc.io/docs/guides/) is a language agnostic, high-performance Remote Procedure Call (RPC) framework. It uses session-based structured schemas via [Protocol Buffers 3](https://developers.google.com/protocol-buffers/docs/proto3) as its underlying message interchange format for communication.

## Streaming

You can use Video Analyzer to stream video recordings to clients using industry-standard, HTTP-based media streaming protocols like [HTTP Live Streaming (HLS)](https://developer.apple.com/streaming/) and [MPEG-DASH](https://dashif.org/about/). You can use the [Azure Video Analyzer player widgets](https://github.com/Azure/video-analyzer/blob/main/widgets/readme.md) (web components) to play back video resources. In addition, HLS is supported by web-players like [JW Player](https://www.jwplayer.com/), [hls.js](https://github.com/video-dev/hls.js/), [VideoJS](https://videojs.com/), [Google’s Shaka Player](https://github.com/google/shaka-player), or you can render natively in mobile apps with Android's [Exoplayer](https://github.com/google/ExoPlayer) and iOS's [AV Foundation](https://developer.apple.com/av-foundation/). MPEG-DASH is likewise supported by [a list of clients on this page](https://dashif.org/clients/).

## VMS

[VMS](https://en.wikipedia.org/wiki/Video_management_system) refers to a Video Management System. Such systems are used to configure and control CCTV cameras, capture and record videos from them. These systems also provide client applications to play back the recorded video.

## Next steps

- Read about [pipelines](pipeline.md).
