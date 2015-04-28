<properties 
	pageTitle="Delivering Live Streaming with Azure Media Services" 
	description="This topic gives an overview of main components involoved in live streaming." 
	services="media-services" 
	documentationCenter="" 
	authors="Juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/23/2015" 
	ms.author="juliako"/>


#Delivering Live Streaming Events with Azure Media Services

##Overview

When working with Live Streaming the following components are commonly involved: 

- A camera that is used to broadcast an event.
- A live video encoder that converts signals from the camera to streams that are sent to a live streaming service. 
  
	Optionally, multiple live encoders. For certain critical live events that demand very high availability and quality of experience, it is recommended to employ active-active redundant encoders to achieve seamless failover with no data loss.
- A live streaming service that enables you to do the following: 
	- ingest live content using various live streaming protocols (for example RTMP, RTP, or Smooth Streaming), 
	- encode your stream into adaptive bitrate stream
	- preview your live stream,
	- store the ingested content in order to be streamed later (Video-on-Demand)
	- deliver the content through common streaming protocols (for example, MPEG DASH, Smooth, HLS, HDS) directly to your customers, or to a Content Delivery Network (CDN) for further distribution. 
	
		
**Microsoft Azure Media Services** provides the ability to ingest, preview, encode live stream, store, and deliver your live streaming content. When delivering your content to customers your goal is to deliver a high quality video to various devices under different network conditions. To take care of quality and network conditions, use live encoders to encode your stream to multi-bitrate (adaptive bitrate) video stream.  To take care of streaming on different devices, use Media Services [dynamic packaging](media-services-dynamic-packaging-overview.md) to dynamically re-package your stream to different protocols. Media Services supports delivery of the following adaptive bitrate streaming technologies: HTTP Live Streaming (HLS), Smooth Streaming, MPEG DASH, and HDS (for Adobe PrimeTime/Access licensees only).

In Azure Media Services, **Channels**, **Programs**, and **StreamingEndpoints** handle all the live streaming functionalities including ingest, formatting, DVR, security, scalability and redundancy. 

A **Channel** represents a pipeline for processing live streaming content. A Channel receives live input streams in one of two ways:

- An on-premises live encoder sends multi-bitrate **RTMP** or **Smooth Streaming** (Fragmented MP4) to the Channel. You can use the following live encoders that output multi-bitrate Smooth Streaming: Elemental, Envivio, Cisco.  The following live encoders output RTMP: Adobe Flash Live, Telestream Wirecast, and Tricaster transcoders. The ingested streams pass through **Channel**s without any further processing. When requested, Media Services delivers the stream to customers.
- A single bitrate stream (in one of the following formats: **RTP** (MPEG-TS)), **RTMP**, or **Smooth Streaming** (Fragmented MP4)) is sent to the **Channel** that is enabled to perform live encoding with Media Services. The **Channel** then performs live encoding of the incoming single bitrate stream to a multi-bitrate (adaptive) video stream. When requested, Media Services delivers the stream to customers. 

	Encoding a live stream with Media Services is currently in Preview.


The following sections link you to appropriate topics depending on what Live Streaming workflow you choose. 

##Working with Channels that are Enabled to Perform Live Encoding with Azure Media Services (Preview)

The following diagram shows the major parts of the Media Services platform that are involved in this Live Streaming workflow.

![Live workflow][live-overview]

For more information, see [Working with Channels that are Enabled to Perform Live Encoding with Azure Media Services
](media-services-manage-live-encoder-enabled-channels.md).

##Working with Channels that Receive Multi-bitrate Live Stream from On-premises Encoders


The following diagram shows the major parts of the Media Services platform that are involved in this Live Streaming workflow.

![Live workflow][live-overview]

For more information, see [Working with Channels that Receive Multi-bitrate Live Stream from On-premises Encoders
](media-services-manage-channels-overview.md). 


[live-overview]: ./media/media-services-overview/media-services-live-streaming-current.png

##Related topics

[Media Services Concepts](media-services-concepts.md)