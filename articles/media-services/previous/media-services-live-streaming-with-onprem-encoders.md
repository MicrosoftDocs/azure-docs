---
title: Stream live with on-premises encoders that create multi-bitrate streams - Azure | Microsoft Docs
description: This topic describes how to set up a channel that receives a multi-bitrate live stream from an on-premises encoder. 
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.assetid: d9f0912d-39ec-4c9c-817b-e5d9fcf1f7ea
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: ne
ms.topic: article
ms.date: 03/18/2019
ms.author: juliako

---
# Working with Channels that receive multi-bitrate live stream from on-premises encoders

> [!NOTE]
> Starting May 12, 2018, live channels will no longer support the RTP/MPEG-2 transport stream ingest protocol. Please migrate from RTP/MPEG-2 to RTMP or fragmented MP4 (Smooth Streaming) ingest protocols.

## Overview
In Azure Media Services, a *channel* represents a pipeline for processing live-streaming content. A channel receives live input streams in one of two ways:

* An on-premises live encoder sends a multi-bitrate RTMP or Smooth Streaming (fragmented MP4) stream to the channel that is not enabled to perform live encoding with Media Services. The ingested streams pass through channels without any further processing. This method is called *pass-through*. A live encoder can also send a single-bitrate stream to a channel that is not enabled for live encoding, but we don't recommend that. Media Services delivers the stream to customers who request it.

  > [!NOTE]
  > Using a pass-through method is the most economical way to do live streaming.


* An on-premises live encoder sends a single-bitrate stream to the channel that is enabled to perform live encoding with Media Services in one of the following formats: RTMP or Smooth Streaming (fragmented MP4). The channel then performs live encoding of the incoming single-bitrate stream to a multi-bitrate (adaptive) video stream. Media Services delivers the stream to customers who request it.

Starting with the Media Services 2.10 release, when you create a channel, you can specify how you want your channel to receive the input stream. You can also specify whether you want the channel to perform live encoding of your stream. You have two options:

* **Pass Through**: Specify this value if you plan to use an on-premises live encoder that has a multi-bitrate stream (a pass-through stream) as output. In this case, the incoming stream passes through to the output without any encoding. This is the behavior of a channel before the 2.10 release. This article gives details about working with channels of this type.
* **Live Encoding**: Choose this value if you plan to use Media Services to encode your single-bitrate live stream to a multi-bitrate stream. Leaving a live encoding channel in a **Running** state incurs billing charges. We recommend that you immediately stop your running channels after your live-streaming event is complete to avoid extra hourly charges. Media Services delivers the stream to customers who request it.

> [!NOTE]
> This article discusses attributes of channels that are not enabled to perform live encoding. For information about working with channels that are enabled to perform live encoding, see [Live streaming using Azure Media Services to create multi-bitrate streams](media-services-manage-live-encoder-enabled-channels.md).
>
>For information about recommended on premises encoders, see [Recommended on premises encoders](media-services-recommended-encoders.md).

The following diagram represents a live-streaming workflow that uses an on-premises live encoder to have multi-bitrate RTMP or fragmented MP4 (Smooth Streaming) streams as output.

![Live workflow][live-overview]

## <a id="scenario"></a>Common live-streaming scenario
The following steps describe tasks involved in creating common live-streaming applications.

1. Connect a video camera to a computer. Start and configure an on-premises live encoder that has a multi-bitrate RTMP or fragmented MP4 (Smooth Streaming) stream as output. For more information, see [Azure Media Services RTMP Support and Live Encoders](https://go.microsoft.com/fwlink/?LinkId=532824).

    You can also perform this step after you create your channel.
2. Create and start a channel.

3. Retrieve the channel ingest URL.

    The live encoder uses the ingest URL to send the stream to the channel.
4. Retrieve the channel preview URL.

    Use this URL to verify that your channel is properly receiving the live stream.
5. Create a program.

    When you use the Azure portal, creating a program also creates an asset.

    When you use the .NET SDK or REST, you need to create an asset and specify to use this asset when creating a program.
6. Publish the asset that's associated with the program.   

	>[!NOTE]
	>When your Azure Media Services account is created, a **default** streaming endpoint is added to your account in the **Stopped** state. The streaming endpoint from which you want to stream content has to be in the **Running** state.

7. Start the program when you're ready to start streaming and archiving.

8. Optionally, the live encoder can be signaled to start an advertisement. The advertisement is inserted in the output stream.

9. Stop the program whenever you want to stop streaming and archiving the event.

10. Delete the program (and optionally delete the asset).     

## <a id="channel"></a>Description of a channel and its related components
### <a id="channel_input"></a>Channel input (ingest) configurations
#### <a id="ingest_protocols"></a>Ingest streaming protocol
Media Services supports ingesting live feeds by using multi-bitrate fragmented MP4 and multi-bitrate RTMP as streaming protocols. When the RTMP ingest streaming protocol is selected, two ingest (input) endpoints are created for the channel:

* **Primary URL**: Specifies the fully qualified URL of the channel's primary RTMP ingest endpoint.
* **Secondary URL** (optional): Specifies the fully qualified URL of the channel's secondary RTMP ingest endpoint.

Use the secondary URL if you want to improve the durability and fault tolerance of your ingest stream (as well as encoder failover and fault tolerance), especially for the following scenarios:

- Single encoder double-pushing to both primary and secondary URLs:

    The main purpose of this scenario is to provide more resiliency to network fluctuations and jitters. Some RTMP encoders don't handle network disconnects well. When a network disconnect happens, an encoder might stop encoding and then not send the buffered data when a reconnect happens. This causes discontinuities and data loss. Network disconnects can happen because of a bad network or maintenance on the Azure side. Primary/secondary URLs reduce the network problems and provide a controlled upgrade process. Each time a scheduled network disconnect happens, Media Services manages the primary and secondary disconnects and provides a delayed disconnect between the two. Encoders then have time to keep sending data and reconnect again. The order of the disconnects can be random, but there will always be a delay between primary/secondary or secondary/primary URLs. In this scenario, the encoder is still the single point of failure.

- Multiple encoders, with each encoder pushing to a dedicated point:

    This scenario provides both encoder and ingests redundancy. In this scenario, encoder1 pushes to the primary URL, and encoder2 pushes to the secondary URL. When an encoder fails, the other encoder can keep sending data. Data redundancy can be maintained because Media Services does not disconnect primary and secondary URLs at the same time. This scenario assumes that encoders are time synced and provide exactly the same data.  

- Multiple encoders double-pushing to both primary and secondary URLs:

    In this scenario, both encoders push data to both primary and secondary URLs. This provides the best reliability and fault tolerance, as well as data redundancy. This scenario can tolerate both encoder failures and disconnects, even if one encoder stops working. It assumes that encoders are time synced and provide exactly the same data.  

For information about RTMP live encoders, see [Azure Media Services RTMP Support and Live Encoders](https://go.microsoft.com/fwlink/?LinkId=532824).

#### Ingest URLs (endpoints)
A channel provides an input endpoint (ingest URL) that you specify in the live encoder, so the encoder can push streams to your channels.   

You can get the ingest URLs when you create the channel. For you to get these URLs, the channel does not have to be in the **Running** state. When you're ready to start pushing data to the channel, the channel must be in the **Running** state. After the channel starts ingesting data, you can preview your stream through the preview URL.

You have an option of ingesting a fragmented MP4 (Smooth Streaming) live stream over a TLS connection. To ingest over TLS, make sure to update the ingest URL to HTTPS. Currently, you cannot ingest RTMP over TLS.

#### <a id="keyframe_interval"></a>Keyframe interval
When you're using an on-premises live encoder to generate multi-bitrate stream, the keyframe interval specifies the duration of the group of pictures (GOP) as used by that external encoder. After the channel receives this incoming stream, you can deliver your live stream to client playback applications in any of the following formats: Smooth Streaming, Dynamic Adaptive Streaming over HTTP (DASH), and HTTP Live Streaming (HLS). When you're doing live streaming, HLS is always packaged dynamically. By default, Media Services automatically calculates the HLS segment packaging ratio (fragments per segment) based on the keyframe interval that's received from the live encoder.

The following table shows how the segment duration is calculated:

| Keyframe interval | HLS segment packaging ratio (FragmentsPerSegment) | Example |
| --- | --- | --- |
| Less than or equal to 3 seconds |3:1 |If KeyFrameInterval (or GOP) is 2 seconds, the default HLS segment packaging ratio is 3 to 1. This creates a 6-second HLS segment. |
| 3 to 5 seconds |2:1 |If KeyFrameInterval (or GOP) is 4 seconds, the default HLS segment packaging ratio is 2 to 1. This creates an 8-second HLS segment. |
| Greater than 5 seconds |1:1 |If KeyFrameInterval (or GOP) is 6 seconds, the default HLS segment packaging ratio is 1 to 1. This creates a 6-second HLS segment. |

You can change the fragments-per-segment ratio by configuring the channel’s output and setting FragmentsPerSegment on ChannelOutputHls.

You can also change the keyframe interval value by setting the KeyFrameInterval property on ChannelInput. If you explicitly set KeyFrameInterval, the HLS segment packaging ratio FragmentsPerSegment is calculated via the rules described previously.  

If you explicitly set both KeyFrameInterval and FragmentsPerSegment, Media Services uses the values that you set.

#### Allowed IP addresses
You can define the IP addresses that are allowed to publish video to this channel. An allowed IP address can be specified as one of the following:

* A single IP address (for example, 10.0.0.1)
* An IP range that uses an IP address and a CIDR subnet mask (for example, 10.0.0.1/22)
* An IP range that uses an IP address and a dotted decimal subnet mask (for example, 10.0.0.1(255.255.252.0))

If no IP addresses are specified and there's no rule definition, then no IP address is allowed. To allow any IP address, create a rule and set 0.0.0.0/0.

### Channel preview
#### Preview URLs
Channels provide a preview endpoint (preview URL) that you use to preview and validate your stream before further processing and delivery.

You can get the preview URL when you create the channel. For you to get the URL, the channel does not have to be in the **Running** state. After the channel starts ingesting data, you can preview your stream.

Currently, the preview stream can be delivered only in fragmented MP4 (Smooth Streaming) format, regardless of the specified input type. You can use the [Smooth Streaming Health Monitor](https://playready.directtaps.net/smoothstreaming/) player to test the smooth stream. You can also use a player that's hosted in the Azure portal to view your stream.

#### Allowed IP addresses
You can define the IP addresses that are allowed to connect to the preview endpoint. If no IP addresses are specified, any IP address is allowed. An allowed IP address can be specified as one of the following:

* A single IP address (for example, 10.0.0.1)
* An IP range that uses an IP address and a CIDR subnet mask (for example, 10.0.0.1/22)
* An IP range that uses an IP address and a dotted decimal subnet mask (for example, 10.0.0.1(255.255.252.0))

### Channel output
For information about channel output, see the [Keyframe interval](#keyframe_interval) section.

### Channel-managed programs
A channel is associated with programs that you can use to control the publishing and storage of segments in a live stream. Channels manage programs. The channel and program relationship is similar to traditional media, where a channel has a constant stream of content and a program is scoped to some timed event on that channel.

You can specify the number of hours you want to retain the recorded content for the program by setting the **Archive Window** length. This value can be set from a minimum of 5 minutes to a maximum of 25 hours. Archive window length also dictates the maximum number of time clients can seek back in time from the current live position. Programs can run over the specified amount of time, but content that falls behind the window length is continuously discarded. This value of this property also determines how long the client manifests can grow.

Each program is associated with an asset that stores the streamed content. An asset is mapped to a block blob container in the Azure storage account, and the files in the asset are stored as blobs in that container. To publish the program so your customers can view the stream, you must create an OnDemand locator for the associated asset. You can use this locator to build a streaming URL that you can provide to your clients.

A channel supports up to three concurrently running programs, so you can create multiple archives of the same incoming stream. You can publish and archive different parts of an event as needed. For example, imagine that your business requirement is to archive 6 hours of a program, but to broadcast only the last 10 minutes. To accomplish this, you need to create two concurrently running programs. One program is set to archive six hours of the event, but the program is not published. The other program is set to archive for 10 minutes, and this program is published.

You should not reuse existing programs for new events. Instead, create a new program for each event. Start the program when you're ready to start streaming and archiving. Stop the program whenever you want to stop streaming and archiving the event.

To delete archived content, stop and delete the program, and then delete the associated asset. An asset cannot be deleted if a program uses it. The program must be deleted first.

Even after you stop and delete the program, users can stream your archived content as a video on demand, until you delete the asset. If you want to retain the archived content but not have it available for streaming, delete the streaming locator.

## <a id="states"></a>Channel states and billing
Possible values for the current state of a channel include:

* **Stopped**: This is the initial state of the channel after its creation. In this state, the channel properties can be updated but streaming is not allowed.
* **Starting**: The channel is being started. No updates or streaming is allowed during this state. If an error occurs, the channel returns to the **Stopped** state.
* **Running**: The channel can process live streams.
* **Stopping**: The channel is being stopped. No updates or streaming is allowed during this state.
* **Deleting**: The channel is being deleted. No updates or streaming is allowed during this state.

The following table shows how channel states map to the billing mode.

| Channel state | Portal UI indicators | Billed? |
| --- | --- | --- |
| **Starting** |**Starting** |No (transient state) |
| **Running** |**Ready** (no running programs)<p><p>or<p>**Streaming** (at least one running program) |Yes |
| **Stopping** |**Stopping** |No (transient state) |
| **Stopped** |**Stopped** |No |

## <a id="cc_and_ads"></a>Closed captioning and ad insertion
The following table demonstrates supported standards for closed captioning and ad insertion.

| Standard | Notes |
| --- | --- |
| CEA-708 and EIA-608 (708/608) |CEA-708 and EIA-608 are closed-captioning standards for the United States and Canada.<p><p>Currently, captioning is supported only if carried in the encoded input stream. You need to use a live media encoder that can insert 608 or 708 captions in the encoded stream that's sent to Media Services. Media Services delivers the content with inserted captions to your viewers. |
| TTML inside .ismt (Smooth Streaming text tracks) |Media Services dynamic packaging enables your clients to stream content in any of the following formats: DASH, HLS, or Smooth Streaming. However, if you ingest fragmented MP4 (Smooth Streaming) with captions inside .ismt (Smooth Streaming text tracks), you can deliver the stream to only Smooth Streaming clients. |
| SCTE-35 |SCTE-35 is a digital signaling system that's used to cue advertising insertion. Downstream receivers use the signal to splice advertising into the stream for the allotted time. SCTE-35 must be sent as a sparse track in the input stream.<p><p>Currently, the only supported input stream format that carries ad signals is fragmented MP4 (Smooth Streaming). The only supported output format is also Smooth Streaming. |

## <a id="considerations"></a>Considerations
When you're using an on-premises live encoder to send a multi-bitrate stream to a channel, the following constraints apply:

* Make sure you have sufficient free Internet connectivity to send data to the ingest points.
* Using a secondary ingest URL requires additional bandwidth.
* The incoming multi-bitrate stream can have a maximum of 10 video quality levels (layers) and a maximum of 5 audio tracks.
* The highest average bitrate for any of the video quality levels should be below 10 Mbps.
* The aggregate of the average bitrates for all the video and audio streams should be below 25 Mbps.
* You cannot change the input protocol while the channel or its associated programs are running. If you require different protocols, you should create separate channels for each input protocol.
* You can ingest a single bitrate in your channel. But because the channel does not process the stream, the client applications will also receive a single bitrate stream. (We don't recommend this option.)

Here are other considerations related to working with channels and related components:

* Every time you reconfigure the live encoder, call the **Reset** method on the channel. Before you reset the channel, you have to stop the program. After you reset the channel, restart the program.

  > [!NOTE]
  > When you restart the program, you need to associate it with a new asset and create a new locator. 
  
* A channel can be stopped only when it's in the **Running** state and all programs on the channel have been stopped.
* By default, you can add only five channels to your Media Services account. For more information, see [Quotas and limitations](media-services-quotas-and-limitations.md).
* You are billed only when your channel is in the **Running** state. For more information, see the [Channel states and billing](media-services-live-streaming-with-onprem-encoders.md#states) section.

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

## Related topics
[Recommended on premises encoders](media-services-recommended-encoders.md)

[Azure Media Services fragmented MP4 lives ingest specification](../media-services-fmp4-live-ingest-overview.md)

[Azure Media Services overview and common scenarios](media-services-overview.md)

[Media Services concepts](media-services-concepts.md)

[live-overview]: ./media/media-services-manage-channels-overview/media-services-live-streaming-current.png
