<properties 
	pageTitle="Live streaming with on-premise encoders that create multi-bitrate streams" 
	description="This topic describes how to set up a Channel that receives a multi-bitrate live stream from an on-premises encoder. The stream can then be delivered to client playback applications through one or more Streaming Endpoints, using one of the following adaptive streaming protocols: HLS, Smooth Stream, MPEG DASH, HDS." 
	services="media-services" 
	documentationCenter="" 
	authors="Juliako" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="ne" 
	ms.topic="article" 
	ms.date="06/22/2016" 
	ms.author="cenkdin;juliako"/>

#Live streaming with on-premise encoders that create multi-bitrate streams

##Overview

In Azure Media Services, a **Channel** represents a pipeline for processing live streaming content. A **Channel** receives live input streams in one of two ways:


- An on-premises live encoder sends a multi-bitrate **RTMP** or **Smooth Streaming** (Fragmented MP4) to the Channel that is not enabled to perform live encoding with AMS. The ingested streams pass through **Channel**s without any further processing. This method is called **pass-through**. You can use the following live encoders that output multi-bitrate Smooth Streaming: Elemental, Envivio, Cisco.  The following live encoders output RTMP: Adobe Flash Live, Telestream Wirecast, and Tricaster transcoders.  A live encoder can also send a single bitrate stream to a channel that is not enabled for live encoding, but that is not recommended. When requested, Media Services delivers the stream to customers.

	>[AZURE.NOTE] Using a pass-through method is the most economical way to do live streaming.
	
- An on-premises live encoder sends a single-bitrate stream to the Channel that is enabled to perform live encoding with Media Services in one of the following formats: RTP (MPEG-TS), RTMP, or Smooth Streaming (Fragmented MP4). The Channel then performs live encoding of the incoming single bitrate stream to a multi-bitrate (adaptive) video stream. When requested, Media Services delivers the stream to customers.

Starting with the Media Services 2.10 release, when you create a Channel, you can specify in which way you want for your channel to receive the input stream and whether or not you want for the channel to perform live encoding of your stream. You have two options:

- **None** – Specify this value, if you plan to use an on-premises live encoder which will output multi-bitrate stream (a pass-through stream). In this case, the incoming stream passed through to the output without any encoding. This is the behavior of a Channel prior to 2.10 release.  This topic gives details about working with channels of this type.

- **Standard** – Choose this value, if you plan to use Media Services to encode your single bitrate live stream to multi-bitrate stream. Be aware that there is a billing impact for live encoding and you should remember that leaving a live encoding channel in the "Running" state will incur billing charges.  It is recommended that you immediately stop your running channels after your live streaming event is complete to avoid extra hourly charges.
When requested, Media Services delivers the stream to customers. 

>[AZURE.NOTE]This topic discusses attributes of channels that are not enabled to perform live encoding (**None** encoding type). For information about working with channels that are enabled to perform live encoding, see [Live streaming using Azure Media Services to create multi-bitrate streams](media-services-manage-live-encoder-enabled-channels.md).

The following diagram represents a live streaming workflow that uses an on-premises live encoder to output multi-bitrate RTMP or Fragmented MP4 (Smooth Streaming) streams.

![Live workflow][live-overview]

This topic covers the following:

- [Common live streaming scenario](media-services-live-streaming-with-onprem-encoders.md#scenario)
- [Description of a Channel and its related components](media-services-live-streaming-with-onprem-encoders.md#channel)
- [Considerations](media-services-live-streaming-with-onprem-encoders.md#considerations)

##<a id="scenario"></a>Common live streaming scenario
The following steps describe tasks involved in creating common live streaming applications.

1. Connect a video camera to a computer. Launch and configure an on-premises live encoder that outputs a multi-bitrate RTMP or Fragmented MP4 (Smooth Streaming) stream. For more information, see [Azure Media Services RTMP Support and Live Encoders](http://go.microsoft.com/fwlink/?LinkId=532824).
	
	This step could also be performed after you create your Channel.

1. Create and start a Channel.
1. Retrieve the Channel ingest URL. 

	The ingest URL is used by the live encoder to send the stream to the Channel.
1. Retrieve the Channel preview URL. 

	Use this URL to verify that your channel is properly receiving the live stream.

3. Create a program. 

	When using the Azure Classic Portal, creating a program also creates an asset. 

	When using .NET SDK or REST you need to create an asset and specify to use this asset when creating a Program. 
1. Publish the asset associated with the program.   

	Make sure to have at least one streaming reserved unit on the streaming endpoint from which you want to stream content.
1. Start the program when you are ready to start streaming and archiving.
2. Optionally, the live encoder can be signaled to start an advertisement. The advertisement is inserted in the output stream.
1. Stop the program whenever you want to stop streaming and archiving the event.
1. Delete the Program (and optionally delete the asset).     

##<a id="channel"></a>Description of a Channel and its related components

###<a id="channel_input"></a>Channel input (ingest) configurations

####<a id="ingest_protocols"></a>Ingest streaming protocol

Media Services supports ingesting live feeds using the following streaming protocol: 

- **Multi-bitrate Fragmented MP4**
 
- **Multi-bitrate RTMP** 

	When the **RTMP** ingest streaming protocol is selected, two ingest(input) endpoints are created for the channel: 
	
	**Primary URL**: Specifies the fully qualified URL of the channel's primary RTMP ingest endpoint.

	**Secondary URL** (optional): Specifies the fully qualified URL of the channel's secondary RTMP ingest endpoint. 


	Use the secondary URL if you want to improve the durability and fault tolerance of your ingest stream as well as encoder failover and fault-tolerance, especially for the following scenarios.

	- Single encoder double pushing to both Primary and Secondary URLs:
	
		The main purpose of this is to provide more resiliency to network fluctuations and jitters. Some RTMP encoders do not handle network disconnects well. When a network disconnect happens, an encoder may stop encoding and will not send the buffered data when reconnect happens, this causes discontinuities and data lost. Network disconnects can happen because of a bad network or a maintenance on Azure side. Primary/secondary URLs reduce the network issues and also provide a controlled upgrade process. Each time a scheduled network disconnect happens, Media Services manages the primary and secondary disconnect and provides a delayed disconnect between the two which gives time for encoders to keep sending data and reconnect again. The order of the disconnects can be random, but there will be always a delay between primary/secondary or secondary/primary. In this scenario encoder is still the single point of failure.
	 
	- Multiple encoders each encoder pushing to dedicated point:
		
		This scenario provides both encoder and ingest redundancy. In this scenario encoder1 pushes to the primary URL and encoder2 pushes to secondary URL. When there is an encoder failure other encoder can still keep sending data. Data redundancy can still be maintained because Media Services does not disconnect primary and secondary at the same time. This scenario assumes encoders are time sync and provides exactly same data.  
 
	- Multiple encoder double pushing to both primary and secondary URLs:
	
		In this scenario both encoders push data to both primary and secondary URLs. This provides the best reliability and fault tolerance as well as data redundancy. It can tolerate both encoder failures and also disconnects even if one encoder stops working. This scenario assumes encoders are time sync and provides exactly same data.  

For information about RTMP live encoders, see [Azure Media Services RTMP Support and Live Encoders](http://go.microsoft.com/fwlink/?LinkId=532824).

The following considerations apply:

- Make sure you have sufficient free Internet connectivity to send data to the ingest points. 
- Using secondary ingest URL requires additional bandwidth. 
- The incoming multi-bitrate stream can have a maximum of 10 video quality levels (aka layers), and a maximum of 5 audio tracks.
- The highest average bitrate for any of the video quality levels or layers should be below 10 Mbps.
- The aggregate of the average bitrates for all the video and audio streams should be below 25 Mbps.
- You cannot change the input protocol while the Channel or its associated programs are running. If you require different protocols, you should create separate channels for each input protocol. 
- You can ingest a single bitrate into your channel, but since the stream is not processed by the channel, the client applications will also receive a single bitrate stream (this option is not recommended).

####Ingest URLs (endpoints) 

A Channel provides an input endpoint (ingest URL) that you specify in the live encoder, so the encoder can push streams to your channels.   

You can get the ingest URLs when you create the channel. To get these URLs, the channel does not have to be in the **Running** state. When you are ready to start pushing data into the channel, the channel must be in the **Running** state. Once the channel starts ingesting data, you can preview your stream through the preview URL.

You have an option of ingesting Fragmented MP4 (Smooth Streaming) live stream over an SSL connection. To ingest over SSL, make sure to update the ingest URL to HTTPS. Currently, you cannot ingest RTMP over SSL. 

####<a id="keyframe_interval"></a>Keyframe interval

When using an on-premises live encoder to generate multi-bitrate stream, the keyframe interval specifies GOP duration (as used by that external encoder). Once this incoming stream is received by the Channel, you can then deliver your live stream to client playback applications in any of the following formats: Smooth Streaming, DASH and HLS. When doing live streaming, HLS is always packaged dynamically. By default, Media Services automatically calculates HLS segment packaging ratio (fragments per segment) based on the keyframe interval, also referred to as Group of Pictures – GOP, that is received from the live encoder. 

The following table shows how the segment duration is being calculated:

Keyframe Interval|HLS segment packaging ratio (FragmentsPerSegment)|Example
---|---|---
less than or equal to 3 seconds|3:1|If the KeyFrameInterval (or GOP) is 2 seconds long, the default HLS segment packaging ratio will be 3 to 1, which will create a 6 seconds HLS segment.
3 to 5  seconds|2:1|If the KeyFrameInterval (or GOP) is 4 seconds long, the default HLS segment packaging ratio will be 2 to 1, which will create a 8 seconds HLS segment.
greater than 5 seconds|1:1|If the KeyFrameInterval (or GOP) is 6 seconds long, the default HLS segment packaging ratio will be 1 to 1, which will create a 6 second long HLS segment.


You can change the fragments per segment ratio by configuring channel’s output and setting FragmentsPerSegment on ChannelOutputHls. 

You can also change the keyframe interval value, by setting the KeyFrameInterval property on ChanneInput. 

If you explicitly set the KeyFrameInterval, the HLS segment packaging ratio FragmentsPerSegment is calculated using the rules described above.  

If you explicitly set both KeyFrameInterval and FragmentsPerSegment, Media Services will use the values set by you. 


####Allowed IP addresses

You can define the IP addresses that are allowed to publish video to this channel. Allowed IP addresses can be specified as either a single IP address (e.g. ‘10.0.0.1’), an IP range using an IP address and a CIDR subnet mask (e.g. ‘10.0.0.1/22’), or an IP range using an IP address and a dotted decimal subnet mask (e.g. ‘10.0.0.1(255.255.252.0)’). 

If no IP addresses are specified and there is no rule definition, then no IP address will be allowed. To allow any IP address, create a rule and set 0.0.0.0/0.

###Channel preview 

####Preview URLs

Channels provide a preview endpoint (preview URL) that you use to preview and validate your stream before further processing and delivery.

You can get the preview URL when you create the channel. To get the URL, the channel does not have to be in the **Running** state. 

Once the Channel starts ingesting data, you can preview your stream.

Note that currently the preview stream can only be delivered in Fragmented MP4 (Smooth Streaming) format regardless of the specified input type. You can use the [http://smf.cloudapp.net/healthmonitor](http://smf.cloudapp.net/healthmonitor) player to test the Smooth Stream. You can also use a player hosted in the Azure Classic Portal to view your stream.


####Allowed IP Addresses

You can define the IP addresses that are allowed to connect to the preview endpoint. If no IP addresses are specified any IP address will be allowed. Allowed IP addresses can be specified as either a single IP address (e.g. ‘10.0.0.1’), an IP range using an IP address and a CIDR subnet mask (e.g. ‘10.0.0.1/22’), or an IP range using an IP address and a dotted decimal subnet mask (e.g. ‘10.0.0.1(255.255.252.0)’).

###Channel output

For more information see the [setting keyframe interval](#keyframe_interval) section.


###Channel's programs

A channel is associated with programs that enable you to control the publishing and storage of segments in a live stream. Channels manage Programs. The Channel and Program relationship is very similar to traditional media where a channel has a constant stream of content and a program is scoped to some timed event on that channel.

You can specify the number of hours you want to retain the recorded content for the program by setting the **Archive Window** length. This value can be set from a minimum of 5 minutes to a maximum of 25 hours. Archive window length also dictates the maximum amount of time clients can seek back in time from the current live position. Programs can run over the specified amount of time, but content that falls behind the window length is continuously discarded. This value of this property also determines how long the client manifests can grow.

Each program is associated with an Asset which stores the streamed content. An asset is mapped to a blob container in the Azure Storage account and the files in the asset are stored as blobs in that container. To publish the program so your customers can view the stream you must create an OnDemand locator for the associated asset. Having this locator will enable you to build a streaming URL that you can provide to your clients.

A channel supports up to three concurrently running programs so you can create multiple archives of the same incoming stream. This allows you to publish and archive different parts of an event as needed. For example, your business requirement is to archive 6 hours of a program, but to broadcast only last 10 minutes. To accomplish this, you need to create two concurrently running programs. One program is set to archive 6 hours of the event but the program is not published. The other program is set to archive for 10 minutes and this program is published.

You should not reuse existing programs for new events. Instead, create and start a new program for each event as described in the Programming Live Streaming Applications section.

Start the program when you are ready to start streaming and archiving. Stop the program whenever you want to stop streaming and archiving the event. 

To delete archived content, stop and delete the program and then delete the associated asset. An asset cannot be deleted if it is used by a program; the program must be deleted first. 

Even after you stop and delete the program, the users would be able to stream your archived content as a video on demand, for as long as you do not delete the asset.

If you do want to retain the archived content, but not have it available for streaming, delete the streaming locator.

##<a id="states"></a>Channel states and how states map to the billing mode 

The current state of a Channel. Possible values include:

- **Stopped**. This is the initial state of the Channel after its creation. In this state, the Channel properties can be updated but streaming is not allowed.
- **Starting**. The Channel is being started. No updates or streaming is allowed during this state. If an error occurs, the Channel returns to the Stopped state.
- **Running**. The Channel is capable of processing live streams.
- **Stopping**. The Channel is being stopped. No updates or streaming is allowed during this state.
- **Deleting**. The Channel is being deleted. No updates or streaming is allowed during this state.

The following table shows how Channel states map to the billing mode. 
 
Channel state|Portal UI Indicators|Billed?
---|---|---|---
Starting|Starting|No (transient state)
Running|Ready (no running programs)<p>or<p>Streaming (at least one running program)|Yes
Stopping|Stopping|No (transient state)
Stopped|Stopped|No

##<a id="cc_and_ads"></a>Closed Captioning and Ad Insertion 

The following table demonstrates supported closed captioning and ad insertion standards.

Standard|Notes
---|---
CEA-708 and EIA-608 (708/608)|CEA-708 and EIA-608 are closed captioning standards for the United States and Canada.<p><p>Currently, captioning is only supported if carried in the encoded input stream. You need to use a live media encoder that can insert 608 or 708 captions into the encoded stream which is sent to Media Services. Media Services will deliver the content with inserted captions to your viewers.
TTML inside ismt (Smooth Streaming Text Tracks)|Media Services dynamic packaging enables your clients to stream content in any of the following formats: MPEG DASH, HLS or Smooth Streaming. However, if you ingest fragmented MP4 (Smooth Streaming) with captions inside .ismt (Smooth Streaming text tracks), you would only be able to deliver the stream to Smooth Streaming clients.
SCTE-35|Digital signaling system used to cue advertising insertion. Downstream receivers use the signal to splice advertising into the stream for the allotted time. SCTE-35 must be sent as a sparse track in the input stream.<p><p>Note that currently, the only supported input stream format that carries ad signals is fragmented MP4 (Smooth Streaming). The only supported output format is also Smooth Streaming.


##<a id="Considerations"></a>Considerations

When using an on-premises live encoder to send a multi-bitrate stream into a Channel, the following constraints apply:

- Make sure you have sufficient free internet connectivity to send data to the ingest points.
- The incoming multi-bitrate stream can have a maximum of 10 video quality levels (10 layers), and maximum of 5 audio tracks.
- The highest average bitrate for any of the video quality levels or layers should be below 10 Mbps
- The aggregate of the average bitrates for all the video and audio streams should be below 25 Mbps
- You cannot change the input protocol while the Channel or its associated programs are running. If you require different protocols, you should create separate channels for each input protocol.


Other considerations related to working with channels and related components:

- Every time you reconfigure the live encoder, call the **Reset** method on the channel. Before you reset the channel, you have to stop the program. After you reset the channel, restart the program.
- A channel can be stopped only when it is in the Running state, and all programs on the channel have been stopped.
- By default you can only add 5 channels to your Media Services account. For more information, see [Quotas and Limitations](media-services-quotas-and-limitations.md).
- You cannot change the input protocol while the Channel or its associated programs are running. If you require different protocols, you should create separate channels for each input protocol.
- You are only billed when your Channel is in the **Running** state. For more information, refer to [this](media-services-live-streaming-with-onprem-encoders.md#states) section.

##How to create channels that receive multi-bitrate live stream from on-premises encoders

For more information about on-premises live encoders, see [Using 3rd Party Live Encoders with Azure Media Services](https://azure.microsoft.com/blog/azure-media-services-rtmp-support-and-live-encoders/).

Choose **Portal**, **.NET**, **REST API** to see how to create and manage channels and programs.

[AZURE.INCLUDE [media-services-selector-manage-channels](../../includes/media-services-selector-manage-channels.md)]



##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]



##Related topics

[Azure Media Services Fragmented MP4 Live Ingest Specification](media-services-fmp4-live-ingest-overview.md)

[Delivering Live Streaming Events with Azure Media Services](media-services-live-streaming-workflow.md)

[Media Services Concepts](media-services-concepts.md)

[live-overview]: ./media/media-services-manage-channels-overview/media-services-live-streaming-current.png

