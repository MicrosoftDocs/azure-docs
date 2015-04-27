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
	- ingest live content using various live streaming protocols (for example RTMP or Smooth Streaming), 
	- preview your live stream,
	- store the ingested content in order to be streamed later (Video-on-Demand)
	- deliver the content through common streaming protocols (for example, MPEG DASH, Smooth, HLS, HDS) directly to your customers, or to a Content Delivery Network (CDN) for further distribution.


**Microsoft Azure Media Services** provides the ability to ingest, preview, store, and deliver your live streaming content. In Media Services, Channels, Programs, and StreamingEndpoints handle all the live streaming functionalities including ingest, formatting, DVR, security, scalability and redundancy.

When delivering your content to customers your goal is to deliver a high quality video to various devices under different network conditions. 

- To take care of quality and network conditions, use live encoders to encode your stream to multi-bitrate (adaptive bitrate) video stream. 
- To take care of streaming on different devices, use Media Services [dynamic packaging](media-services-dynamic-packaging-overview.md) to dynamically re-package your stream to different protocols. Media Services supports delivery of the following adaptive bitrate streaming technologies: HTTP Live Streaming (HLS), Smooth Streaming, MPEG DASH, and HDS (for Adobe PrimeTime/Access licensees only).

Currently, Media Services allows ingesting streams in the following formats: RTMP or Smooth Streaming. At this time, Media Services does not provide a Live Encoder service. To encode your single bitrate stream to multiple bitrate, use one of the following third party Live Encoders: Elemental, Envivio, Cisco, RGP encoders output Smooth Streaming; Adobe Flash Live, Wirecast and Tredek encoders output RTMP. 

The following diagram shows the major parts of the Media Services platform that are involved in the Live Streaming Workflow.

![Live workflow][live-overview]

This topic describes concepts related to live streaming and links to relevant topics.

##Concepts

###Live Encoding

When working with Live Streaming, one of the components that is involved in the workflow is a live video encoder that converts signals from the camera to streams that are sent to a live streaming service. In Azure Media Services (AMS), a **Channel** represents a pipeline for processing live streaming content. A **Channel** can receive live input streams from an on-premises live encoder that outputs a multi-bitrate streams in one of the following formats: RTMP or Fragmented MP4 (Smooth Streaming) stream. You can use the following live encoders that output Smooth Streaming: Elemental, Envivio, Cisco.  The following live encoders output RTMP: Adobe Flash Live, Telestream Wirecast, and Tricaster transcoders. The ingested streams pass through **Channel**s without any further processing. The live encoder can also ingest a single bitrate stream, but since the stream is not processed, the client applications will also receive a single bitrate stream (this option is not recommended). Once the received content is published, it can be streamed to client playback applications through one or more **Streaming Endpoint**s. The following adaptive streaming protocols can be used to play the stream: HLS,  MPEG DASH, Smooth Stream, HDS. 

###Channels, programs and assets

A channel is associated with programs that enable you to control the publishing and storage of segments in a live stream. Channels manage Programs. The Channel and Program relationship is very similar to traditional media where a channel has a constant stream of content and a program is scoped to some timed event on that channel.

You can specify the number of hours you want to retain the recorded content for the program by setting the **Archive Window** length. This value can be set from a minimum of 5 minutes to a maximum of 25 hours. Archive window length also dictates the maximum amount of time clients can seek back in time from the current live position. Programs can run over the specified amount of time, but content that falls behind the window length is continuously discarded. This value of this property also determines how long the client manifests can grow.

Each program is associated with an Asset which stores the streamed content. An asset is mapped to a blob container in the Azure Storage account and the files in the asset are stored as blobs in that container. To publish the program so your customers can view the stream you must create an OnDemand locator for the associated asset. Having this locator will enable you to build a streaming URL that you can provide to your clients.

A channel supports up to three concurrently running programs so you can create multiple archives of the same incoming stream. This allows you to publish and archive different parts of an event as needed. For example, your business requirement is to archive 6 hours of a program, but to broadcast only last 10 minutes. To accomplish this, you need to create two concurrently running programs. One program is set to archive 6 hours of the event but the program is not published. The other program is set to archive for 10 minutes and this program is published.

You should not reuse existing programs for new events. Instead, create and start a new program for each event as described in the Programming Live Streaming Applications section.

Start the program when you are ready to start streaming and archiving. Stop the program whenever you want to stop streaming and archiving the event. 

To delete archived content, stop and delete the program and then delete the associated asset. An asset cannot be deleted if it is used by a program; the program must be deleted first. 

Even after you stop and delete the program, the users would be able to stream your archived content as a video on demand, for as long as you do not delete the asset.

If you do want to retain the archived content, but not have it available for streaming, delete the streaming locator.


###Streaming Endpoint

A **Streaming Endpoint** represents a streaming service that can deliver content directly to a client player application, or to a Content Delivery Network (CDN) for further distribution. The outbound stream from a streaming endpoint service can be a live stream, or a video on demand asset in your Media Services account. In addition, you can control the capacity of the Streaming Endpoint service to handle growing bandwidth needs by adjusting streaming reserved units. When using [dynamic packaging](media-services-dynamic-packaging-overview.md) you need to allocate at least one reserved unit. For more information, see [How to Scale a Media Service](media-services-manage-origins.md#scale_streaming_endpoints).

##Working with Channels that Receive Multi-bitrate Live Stream from On-premises Encoders

For more information, see [Working with Channels that Receive Multi-bitrate Live Stream from On-premises Encoders
](media-services-manage-channels-overview.md). 


[live-overview]: ./media/media-services-overview/media-services-live-streaming-current.png