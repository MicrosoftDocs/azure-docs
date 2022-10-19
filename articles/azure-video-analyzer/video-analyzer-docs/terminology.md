---
title: Terminology
description: This article provides an overview of Azure Video Analyzer terminology.
ms.service: azure-video-analyzer
ms.topic: conceptual
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---
# Azure Video Analyzer terminology

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

This article provides an overview of terminology related to [Azure Video Analyzer](overview.md).

## Pipeline topology

A [pipeline topology](pipeline.md) lets you define where media should be captured from, how it should be processed, and where the results should be delivered. It enables you to define a pipeline consisting of sources, processors, and sink nodes with which you can build live video analytics applications. 

## RTSP

[RTSP](https://tools.ietf.org/html/rfc2326) refers to the Real-Time Streaming Protocol. It is an application-level protocol for control over the delivery of data with real-time properties. RTSP provides an extensible framework to enable controlled, on-demand delivery of real-time data, such as audio and video. Video Analyzer [supports](pipeline.md#rtsp-source) capturing, analyzing, and recording of video from IP cameras that support RTSP.

## VMS

[VMS](https://en.wikipedia.org/wiki/Video_management_system) refers to a Video Management System. Such systems are used to configure and control CCTV cameras, and to capture and record videos from them. These systems also provide client applications to play back the recorded video.

## Recording

In the context of a video management system for security cameras, video recording refers to the process of capturing video from the cameras and storing it for subsequent viewing via mobile and browser apps. Video recording can be categorized into [continuous video recording](continuous-video-recording.md) and [event-based video recording](event-based-video-recording-concept.md). These are explained in more detail in the [video recording](video-recording.md) concept page.

## Streaming

You can use Video Analyzer to stream video recordings to clients using industry-standard, HTTP-based media streaming protocols like [HTTP Live Streaming (HLS)](https://developer.apple.com/streaming/) and [MPEG-DASH](https://dashif.org/about/). You can use the [Azure Video Analyzer player widgets](https://github.com/Azure/video-analyzer-widgets/blob/main/README.md) (web components) to play back video resources. In addition, HLS is supported by web-players like [JW Player](https://www.jwplayer.com/), [hls.js](https://github.com/video-dev/hls.js/), [VideoJS](https://videojs.com/), [Google’s Shaka Player](https://github.com/google/shaka-player), or you can render natively in mobile apps with Android's [Exoplayer](https://github.com/google/ExoPlayer) and iOS's [AV Foundation](https://developer.apple.com/av-foundation/). MPEG-DASH is likewise supported by [a list of clients on this page](https://dashif.org/tools/clients/).

## Exporting

In the context of a VMS for security cameras, video exporting refers to the process of taking selected portion(s) of a video recording and creating a separate file, typically an [MP4](https://en.wikipedia.org/wiki/MPEG-4_Part_14) file, which can then be shared externally. For example, the video recording could contain footage where prompt action by staff prevented a safety incident. That portion of the recording could be exported to an MP4 file for use in future training sessions.

## Video

Videos are resources in your Video Analyzer account that enable VMS capabilities such as recording, playback, streaming, and exporting. Videos can be recorded from RTSP cameras or can be created by exporting portions of an existing recorded video. Recorded videos can be streamed and viewed using the Video Analyzer player widget or other compatible players. Exported videos can be downloaded as MP4 files.

When using Video Analyzer for recording from an RTSP camera, you should associate that video resource to that camera. You can continuously record video from that camera to that video resource, or you can record sporadically based on events - Video Analyzer supports appending data to an existing video resource. However, this requires that the properties of the RTSP camera (its resolution, frame rate, etc.) remain unchanged. If you have a need to change the camera settings, then you should switch to recording to a new video resource.

When you create a Video Analyzer account, you have to associate an Azure storage account with it. Both recorded and exported videos stored as blobs in a container in the storage account. All content associated with such video resources are stored as blobs in the corresponding containers, while Video Analyzer holds the metadata (such as a name, description, creation time).

## gRPC

[gRPC](https://grpc.io/docs/guides/) is a language agnostic, high-performance Remote Procedure Call (RPC) framework. It uses session-based structured schemas via [Protocol Buffers 3](https://developers.google.com/protocol-buffers/docs/proto3) as its underlying message interchange format for communication.

## Low latency streaming

Low latency video streaming is a beneficial capability of a VMS system. Video Analyzer can stream live video with a delay of around 2 seconds. Latency means the delay between the instant when an event happens in front of the camera and when that event is seen on a playback device.

## Next steps

- Read about [pipelines](pipeline.md).
