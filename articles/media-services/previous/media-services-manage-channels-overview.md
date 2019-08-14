---
title: Overview of Live Streaming using Azure Media Services | Microsoft Docs
description: This topic gives an overview of live streaming using Azure Media Services.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.assetid: fb63502e-914d-4c1f-853c-4a7831bb08e8
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: ne
ms.topic: article
ms.date: 03/18/2019
ms.author: juliako

---
# Overview of Live Streaming using Media Services

> [!NOTE]
> No new features or functionality are being added to Media Services v2. <br/>Check out the latest version, [Media Services v3](https://docs.microsoft.com/azure/media-services/latest/). Also, see [migration guidance from v2 to v3](../latest/migrate-from-v2-to-v3.md)

## Overview

When delivering live streaming events with Azure Media Services the following components are commonly involved:

* A camera that is used to broadcast an event.
* A live video encoder that converts signals from the camera to streams that are sent to a live streaming service.

    Optionally, multiple live time synchronized encoders. For certain critical live events that demand very high availability and quality of experience, it is recommended to employ active-active redundant encoders with time synchronization to achieve seamless failover with no data loss.
* A live streaming service that enables you to do the following:

  * ingest live content using various live streaming protocols (for example RTMP or Smooth Streaming),
  * (optionally) encode your stream into adaptive bitrate stream
  * preview your live stream,
  * record and store the ingested content in order to be streamed later (Video-on-Demand)
  * deliver the content through common streaming protocols (for example, MPEG DASH, Smooth, HLS) directly to your customers, or to a Content Delivery Network (CDN) for further distribution.

**Microsoft Azure Media Services** (AMS) provides the ability to ingest,  encode, preview, store, and deliver your live streaming content.

With Media Services, you can take advantage of [dynamic packaging](media-services-dynamic-packaging-overview.md), which allows you to broadcast your live streams in MPEG DASH, HLS, and Smooth Streaming formats from the contribution feed that is being sent to the service. Your viewers can play back the live stream with any HLS, DASH, or Smooth Streaming compatible players. You can use Azure Media Player in your web or mobile applications to deliver your stream in any of these protocols.

> [!NOTE]
> Starting May 12, 2018, live channels will no longer support the RTP/MPEG-2 transport stream ingest protocol. Please migrate from RTP/MPEG-2 to RTMP or fragmented MP4 (Smooth Streaming) ingest protocols.

## Streaming Endpoints, Channels, Programs

In Azure Media Services, **Channels**, **Programs**, and **StreamingEndpoints** handle all the live streaming functionalities including ingest, formatting, DVR, security, scalability and redundancy.

A **Channel** represents a pipeline for processing live streaming content. A Channel can receive a live input streams in the following ways:

* An on-premises live encoder sends multi-bitrate **RTMP** or **Smooth Streaming** (fragmented MP4) to the Channel that is configured for **pass-through** delivery. The **pass-through** delivery is when the ingested streams pass through **Channel**s without any further processing. You can use the following live encoders that output multi-bitrate Smooth Streaming: MediaExcel, Ateme, Imagine Communications, Envivio, Cisco and Elemental. The following live encoders output RTMP: Adobe Flash Media Live Encoder (FMLE), Telestream Wirecast, Haivision, Teradek and Tricaster transcoders.  A live encoder can also send a single bitrate stream to a channel that is not enabled for live encoding, but that is not recommended. When requested, Media Services delivers the stream to customers.

  > [!NOTE]
  > Using a pass-through method is the most economical way to do live streaming when you are doing multiple events over a long period of time, and you have already invested in on-premises encoders. See [pricing](https://azure.microsoft.com/pricing/details/media-services/) details.
  > 
  > 
* An on-premises live encoder sends a single-bitrate stream to the Channel that is enabled to perform live encoding with Media Services in one of the following formats: RTMP or Smooth Streaming (fragmented MP4). The following live encoders with RTMP output are known to work with channels of this type: Telestream Wirecast, FMLE. The Channel then performs live encoding of the incoming single bitrate stream to a multi-bitrate (adaptive) video stream. When requested, Media Services delivers the stream to customers.

Starting with the Media Services 2.10 release, when you create a Channel, you can specify in which way you want for your channel to receive the input stream and whether or not you want for the channel to perform live encoding of your stream. You have two options:

* **None** (pass-through) – Specify this value, if you plan to use an on-premises live encoder which will output multi-bitrate stream (a pass-through stream). In this case, the incoming stream passed through to the output without any encoding. This is the behavior of a Channel prior to 2.10 release.  
* **Standard** – Choose this value, if you plan to use Media Services to encode your single bitrate live stream to multi-bitrate stream. This method is more economical for scaling up quickly for infrequent events. Be aware that there is a billing impact for live encoding and you should remember that leaving a live encoding channel in the "Running" state will incur billing charges.  It is recommended that you immediately stop your running channels after your live streaming event is complete to avoid extra hourly charges.

## Comparison of Channel Types

Following table provides a guide to comparing the two Channel types supported in Media Services

| Feature | Pass-through Channel | Standard Channel |
| --- | --- | --- |
| Single bitrate input is encoded into multiple bitrates in the cloud |No |Yes |
| Maximum resolution, number of layers |1080p, 8 layers, 60+fps |720p, 6 layers, 30 fps |
| Input protocols |RTMP, Smooth Streaming |RTMP, Smooth Streaming |
| Price |See the [pricing page](https://azure.microsoft.com/pricing/details/media-services/) and click on "Live Video" tab |See the [pricing page](https://azure.microsoft.com/pricing/details/media-services/) |
| Maximum run time |24x7 |8 hours |
| Support for inserting slates |No |Yes |
| Support for ad signaling |No |Yes |
| Pass-through CEA 608/708 captions |Yes |Yes |
| Support for non-uniform input GOPs |Yes |No – input must be fixed 2sec GOPs |
| Support for variable frame rate input |Yes |No – input must be fixed frame rate.<br/>Minor variations are tolerated, for example, during high motion scenes. But encoder cannot drop to 10 frames/sec. |
| Auto-shutoff of Channels when input feed is lost |No |After 12 hours, if there is no Program running |

## Working with Channels that receive multi-bitrate live stream from on-premises encoders (pass-through)

The following diagram shows the major parts of the AMS platform that are involved in the **pass-through** workflow.

![Live workflow](./media/media-services-live-streaming-workflow/media-services-live-streaming-current.png)

For more information, see [Working with Channels that Receive Multi-bitrate Live Stream from On-premises Encoders](media-services-live-streaming-with-onprem-encoders.md).

## Working with Channels that are enabled to perform live encoding with Azure Media Services

The following diagram shows the major parts of the AMS platform that are involved in Live Streaming workflow where a Channel is enabled to perform live encoding with Media Services.

![Live workflow](./media/media-services-live-streaming-workflow/media-services-live-streaming-new.png)

For more information, see [Working with Channels that are Enabled to Perform Live Encoding with Azure Media Services](media-services-manage-live-encoder-enabled-channels.md).

## Description of a Channel and its related components

### Channel

In Media Services, [Channel](https://docs.microsoft.com/rest/api/media/operations/channel)s are responsible for processing live streaming content. A Channel provides an input endpoint (ingest URL) that you then provide to a live transcoder. The channel receives live input streams from the live transcoder and makes it available for streaming through one or more StreamingEndpoints. Channels also provide a preview endpoint (preview URL) that you use to preview and validate your stream before further processing and delivery.

You can get the ingest URL and the preview URL when you create the channel. To get these URLs, the channel does not have to be in the started state. When you are ready to start pushing data from a live transcoder into the channel, the channel must be started. Once the live transcoder starts ingesting data, you can preview your stream.

Each Media Services account can contain multiple Channels, multiple Programs, and multiple StreamingEndpoints. Depending on the bandwidth and security needs, StreamingEndpoint services can be dedicated to one or more channels. Any StreamingEndpoint can pull from any Channel.

When creating a Channel, you can specify allowed IP addresses in one of the following formats: IpV4 address with 4 numbers, CIDR address range.

### Program
A [Program](https://docs.microsoft.com/rest/api/media/operations/program) enables you to control the publishing and storage of segments in a live stream. Channels manage Programs. The Channel and Program relationship is very similar to traditional media where a channel has a constant stream of content and a program is scoped to some timed event on that channel.
You can specify the number of hours you want to retain the recorded content for the program by setting the **ArchiveWindowLength** property. This value can be set from a minimum of 5 minutes to a maximum of 25 hours.

ArchiveWindowLength also dictates the maximum amount of time clients can seek back in time from the current live position. Programs can run over the specified amount of time, but content that falls behind the window length is continuously discarded. This value of this property also determines how long the client manifests can grow.

Each program is associated with an Asset. To publish the program you must create a locator for the associated asset. Having this locator will enable you to build a streaming URL that you can provide to your clients.

A channel supports up to three concurrently running programs so you can create multiple archives of the same incoming stream. This allows you to publish and archive different parts of an event as needed. For example, your business requirement is to archive 6 hours of a program, but to broadcast only last 10 minutes. To accomplish this, you need to create two concurrently running programs. One program is set to archive 6 hours of the event but the program is not published. The other program is set to archive for 10 minutes and this program is published.

## Billing Implications
A channel begins billing as soon as it's state transitions to "Running" via the API.  

The following table shows how Channel states map to billing states in the API and Azure portal. Note that the states are slightly different between the API and Portal UX. As soon as a channel is in the "Running" state via the API, or in the "Ready" or "Streaming" state in the Azure portal, billing will be active.

To stop the Channel from billing you further, you have to Stop the Channel via the API or in the Azure portal.
You are responsible for stopping your channels when you are done with the channel. Failure to stop the channel will result in continued billing.

> [!NOTE]
> When working with Standard channels, AMS will auto shutoff any Channel that is still in “Running” state 12 hours after the input feed is lost, and there are no Programs running. However, you will still be billed for the time the Channel was in “Running” state.
>
>

### <a id="states"></a>Channel states and how they map to the billing mode
The current state of a Channel. Possible values include:

* **Stopped**. This is the initial state of the Channel after its creation (unless autostart was selected in the portal.) No billing occurs in this state. In this state, the Channel properties can be updated but streaming is not allowed.
* **Starting**. The Channel is being started. No billing occurs in this state. No updates or streaming is allowed during this state. If an error occurs, the Channel returns to the Stopped state.
* **Running**. The Channel is capable of processing live streams. It is now billing usage. You must stop the channel to prevent further billing.
* **Stopping**. The Channel is being stopped. No billing occurs in this transient state. No updates or streaming is allowed during this state.
* **Deleting**. The Channel is being deleted. No billing occurs in this transient state. No updates or streaming is allowed during this state.

The following table shows how Channel states map to the billing mode.

| Channel state | Portal UI Indicators | Is it Billing? |
| --- | --- | --- |
| Starting |Starting |No (transient state) |
| Running |Ready (no running programs)<br/>or<br/>Streaming (at least one running program) |YES |
| Stopping |Stopping |No (transient state) |
| Stopped |Stopped |No |

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

## Related topics
[Azure Media Services Fragmented MP4 Live Ingest Specification](../media-services-fmp4-live-ingest-overview.md)

[Working with Channels that are Enabled to Perform Live Encoding with Azure Media Services](media-services-manage-live-encoder-enabled-channels.md)

[Working with Channels that Receive Multi-bitrate Live Stream from On-premises Encoders](media-services-live-streaming-with-onprem-encoders.md)

[Quotas and limitations](media-services-quotas-and-limitations.md).  

[Media Services Concepts](media-services-concepts.md)
