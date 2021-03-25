---
title: Media Services architectures
description: This article describes architectures for Media Services.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: conceptual
ms.date: 11/20/2020
ms.author: inhenkel

---

# Media Services architectures

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

## Live streaming digital media

A live streaming solution allows you to capture video in real-time and broadcast it to consumers in real time, such as streaming interviews, conferences, and sporting events online. In this solution, video is captured by a video camera and sent to a channel input endpoint. The channel receives the live input stream and makes it available for streaming through a streaming endpoint to a web browser or mobile app. The channel also provides a preview monitoring endpoint to preview and validate your stream before further processing and delivery. The channel can also record and store the ingested content in order to be streamed later (video-on-demand).

This solution is built on the Azure managed services: Media Services and Content Delivery Network. These services run in a high-availability environment, patched and supported, allowing you to focus on your solution instead of the environment they run in.

See [Live streaming digital media](/azure/architecture/solution-ideas/articles/digital-media-live-stream) in the Azure Architecture center.

## Video-on-demand digital media

A basic video-on-demand solution that gives you the capability to stream recorded video content such as movies, news clips, sports segments, training videos, and customer support tutorials to any video-capable endpoint device, mobile application, or desktop browser. Video files are uploaded to Azure Blob storage, encoded to a multi-bitrate standard format, and then distributed via all major adaptive bit-rate streaming protocols (HLS, MPEG-DASH, Smooth) to the Azure Media Player client.

This solution is built on the Azure managed services: Blob Storage, Content Delivery Network and Azure Media Player. These services run in a high-availability environment, patched and supported, allowing you to focus on your solution instead of the environment they run in.

See [Video-on-demand digital media](/azure/architecture/solution-ideas/articles/digital-media-video) in the Azure Architecture center.

## Gridwich media processing system

The Gridwich system embodies best practices for processing and delivering media assets on Azure. Although the Gridwich system is media-specific, the message processing and eventing framework can apply to any stateless event processing workflow.

See [Gridwich media processing system](/azure/architecture/reference-architectures/media-services/gridwich-architecture) in the Azure Architecture center.

## Next steps

> [Azure Media Services overview](media-services-overview.md)