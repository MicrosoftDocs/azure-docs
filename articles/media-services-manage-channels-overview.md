<properties 
	pageTitle="Managing Channels and Programs" 
	description="This topic describes how to create Media Services Channels and Programs for live streaming." 
	services="media-services" 
	documentationCenter="" 
	authors="juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="ne" 
	ms.topic="article" 
	ms.date="03/22/2015" 
	ms.author="juliako"/>

#Managing Channels and Programs

##Overview

In Azure Media Services (AMS), the Channel entity represents a pipeline for processing live streaming content. A Program enables you to control the publishing and storage of segments in a live stream. Channels manage Programs. The Channel and Program relationship is very similar to traditional media where a channel has a constant stream of content and a program is scoped to some timed event on that channel. 

A Channel receives live input streams from a 3rd party encoder that outputs multi-bitrate RTMP, Smooth Streaming (Fragmented MP4). The content can then be streamed to client playback applications through one or more streaming endpoints, using one of the following adaptive streaming protocols: HLS, Smooth Stream, MPEG DASH, HDS.

A streaming endpoint represents a streaming service that can deliver content directly to a client player application, or to a Content Delivery Network (CDN) for further distribution. The outbound stream from a streaming endpoint service can be a live stream, or a video on demand asset in your Media Services account. In addition, you can control the capacity of the StreamingEndpoint service to handle growing bandwidth needs by adjusting streaming reserved units. It is recommended to allocate 1 or more streaming reserved units for applications in production environment. For more information, see  [How to Scale a Media Service](media-services-manage-origins.md#scale_streaming_endpoints).

###Live Streaming using an on-premises live encoder

The following diagram represents the live streaming workflow using an on-premises live encoder that outputs multi-bitrate RTMP, or Smooth Streaming (Fragmented MP4). When using an on-premises encoder, the incoming stream passes through to the streaming endpoint without any encoding.

Note that it is valid, but undesirable, for a single bitrate RTMP or Smooth Streaming live stream to be sent. The stream will also passe through, but the client applications will get a single bitrate stream.


![Live workflow][live-overview]


##Concepts

For information about concepts, see [Media Services Concepts](media-services-concepts.md#live-streaming). 

##Basic Scenario

This section describes the steps involved in creating most basic live streaming application.

###Deliver live streaming media using on-premises encoder

1. Create and start a channel.
1. Retrieve the channel ingest (input) URL.
1. Start and configure the live transcoder of your choice. For more information, see [Using 3rd Party Live Encoders with Azure Media Services](https://msdn.microsoft.com/library/azure/dn783464.aspx).
1. Retrieve the channel’s preview endpoint and verify that your channel is properly receiving the live stream.
2. Create an asset and configure asset delivery policy (used by dynamic packaging).
3. Create a program and specify to use the asset that you created.
1. Publish the asset associated with the program by creating an OnDemand locator.  

	Make sure to have at least one streaming reserved unit on the streaming endpoint from which you want to stream content.
1. Start the program when you are ready to start streaming and archiving.
1. Stop the program whenever you want to stop streaming and archiving the event.
1. Delete the Program (and optionally delete the asset). 

The rest of the topic describes the main components of the Media Services Channel and Program.

##Channel input (ingest) configurations

###<a id="Ingest_Protocols"></a>Ingest streaming protocol

Valid streaming protocol options are: 

- Multi-bitrate Fragmented MP4 (Smooth Streaming). You can ingest live Fragmented MP4 (Smooth Streaming) content over an SSL connection.
- Multi-bitrate RTMP. Currently, you cannot ingest RTMP over SSL.

Note that it is valid, but undesirable, for a single bitrate RTMP or Smooth Streaming live stream to be sent. The stream will also passed through, but the client applications will get a single bitrate stream.


You cannot change the input protocol while the Channel or its associated programs are running. If you require different protocols, you should create separate channels for each input protocol. 

###Allowed IP addresses

You can define the IP addresses that are allowed to publish video to this channel. Allowed IP addresses can be specified as either a single IP address (e.g. ‘10.0.0.1’), an IP range using an IP address and a CIDR subnet mask (e.g. ‘10.0.0.1/22’), or an IP range using an IP address and a dotted decimal subnet mask (e.g. ‘10.0.0.1(255.255.252.0)’). 

If no IP addresses are specified and there is no rule definition then no IP address will be allowed. To allow any IP address, create a rule and set 0.0.0.0/0.

###Ingest URLs (endpoints) 

A Channel provides an input endpoint (ingest URL) that you then use to ingest your live stream. The channel receives live input streams and makes the output streams available for streaming through one or more streaming endpoints. 

You can get the ingest URLs when you create the channel. To get these URLs, the channel does not have to be in the started state. When you are ready to start pushing data into the channel, the channel must be started. Once the live transcoder starts ingesting data, you can preview your stream through the preview URL.

Media Services enables you to ingest a live Smooth Streaming (FMP4) content over an SSL connection. To ingest over SSL, make sure to update the ingest URL to HTTPS. 

Currently, you cannot ingest an RTMP live stream over an SSL connection.

###<a id="keyframe_interval"></a>Keyframe interval

When using an on-premise live encoder to generate multi-bitrate stream, the keyframe interval specifies GOP duration (as used by that external encoder). Once this incoming stream is received by the Channel, you can then deliver your live stream to client playback applications in any of the following formats: Smooth Streaming, DASH and HLS. When doing live streaming, HLS is always packaged dynamically. By default, Media Services automatically calculates HLS segment packaging ratio (fragments per segment) based on the keyframe interval, also referred to as Group of Pictures – GOP, that is received from the live encoder. 

The following table shows how the segment duration is being calculated:

<table border="1">
<tr><th>Keyframe Interval</th><th>HLS segment packaging ratio (FragmentsPerSegment)</th><th>Example</th></tr>
<tr><td>less than or equal to 3 seconds</td><td>3:1</td><td>If the KeyFrameInterval (or GOP) is 2 seconds long, the default HLS segment packaging ratio will be 3 to 1, which will create a 6 seconds HLS segment.</td></tr>
<tr><td>3 to 5  seconds</td><td>2:1</td><td>If the KeyFrameInterval (or GOP) is 4 seconds long, the default HLS segment packaging ratio will be 2 to 1, which will create a 8 seconds HLS segment.</td></tr>
<tr><td>greater than 5 seconds</td><td>1:1</td><td>If the KeyFrameInterval (or GOP) is 6 seconds long, the default HLS segment packaging ratio will be 1 to 1, which will create a 6 second long HLS segment.</td></tr>
</table>

You can change the fragments per segment ratio by configuring channel’s output and setting FragmentsPerSegment on ChannelOutputHls. 

You can also change the keyframe interval value, by setting the KeyFrameInterval property on ChanneInput. 

If you explicitly set the KeyFrameInterval, the HLS segment packaging ratio FragmentsPerSegment is calculated using the rules described above.  

If you explicitly set both KeyFrameInterval and FragmentsPerSegment, Media Services will use the values set by you. 

##Channel preview 

###Preview URLs

Channels provide a preview endpoint (preview URL) that you use to preview and validate your stream before further processing and delivery.

You can get the preview URL when you create the channel. To get the URL, the channel does not have to be in the started state. 

Once the Channel starts ingesting data, you can preview your stream.

Note that currently the preview stream can only be delivered in Fragmented MP4 (Smooth Streaming) format regardless of the specified input type. You can use the [http://smf.cloudapp.net/healthmonitor](http://smf.cloudapp.net/healthmonitor) player to test the Smooth Stream. You can also use a player hosted in the Azure Management Portal to view your stream.


###Allowed IP Addresses

You can define the IP addresses that are allowed to connect to the preview endpoint. If no IP addresses are specified any IP address will be allowed. Allowed IP addresses can be specified as either a single IP address (e.g. ‘10.0.0.1’), an IP range using an IP address and a CIDR subnet mask (e.g. ‘10.0.0.1/22’), or an IP range using an IP address and a dotted decimal subnet mask (e.g. ‘10.0.0.1(255.255.252.0)’).

##Channel output

For more information see the [setting keyframe interval](#keyframe_interval) section.


##Channel's programs

A channel is associated with programs that enable you to control the publishing and storage of segments in a live stream. Channels manage Programs. The Channel and Program relationship is very similar to traditional media where a channel has a constant stream of content and a program is scoped to some timed event on that channel.

You can specify the number of hours you want to retain the recorded content for the program by setting the **Archive Window** length. This value can be set from a minimum of 5 minutes to a maximum of 25 hours. Archive window length also dictates the maximum amount of time clients can seek back in time from the current live position. Programs can run over the specified amount of time, but content that falls behind the window length is continuously discarded. This value of this property also determines how long the client manifests can grow.

Each program is associated with an Asset. To publish the program you must create an OnDemand locator for the associated asset. Having this locator will enable you to build a streaming URL that you can provide to your clients.

A channel supports up to three concurrently running programs so you can create multiple archives of the same incoming stream. This allows you to publish and archive different parts of an event as needed. For example, your business requirement is to archive 6 hours of a program, but to broadcast only last 10 minutes. To accomplish this, you need to create two concurrently running programs. One program is set to archive 6 hours of the event but the program is not published. The other program is set to archive for 10 minutes and this program is published.

You should not reuse existing programs for new events. Instead, create and start a new program for each event as described in the Programming Live Streaming Applications section.

Start the program when you are ready to start streaming and archiving. Stop the program whenever you want to stop streaming and archiving the event. 

To delete archived content, stop and delete the program and then delete the associated asset. An asset cannot be deleted if it is used by a program; the program must be deleted first. 

Even after you stop and delete the program, the users would be able to stream your archived content as a video on demand, for as long as you do not delete the asset.

If you do want to retain the archived content, but not have it available for streaming, delete the streaming locator.

If you want to protect your asset follow the steps below. You can find links to relevant articles [here](media-services-live-streaming-workflow.md). 

- Configuring content key authorization policy.
- Configuring asset delivery policy. 

##Channel state

The current state of channel. Possible values include:

- Stopped. This is the initial state of the Channel after its creation. In this state, the Channel properties can be updated but streaming is not allowed.
- Starting. Channel is being started. No updates or streaming is allowed during this state. If an error occurs, the Channel returns to the Stopped state.
- Running. The Channel is capable of processing live streams.
- Stopping. The channel is being stopped. No updates or streaming is allowed during this state.
- Deleting. The Channel is being deleted. No updates or streaming is allowed during this state. 

##Closed Captioning and Ad Insertion 

The following table demonstrates supported closed captioning and ad insertion standards.

<table border="1">
<tr><th>Standard</th><th>Notes</th></tr>
<tr><td>CEA-708 and EIA-608 (708/608)</td><td>CEA-708 and EIA-608 are closed captioning standards for the United States and Canada.<br/>Currently, captioning is only supported if carried in the encoded input stream. You need to use a live media encoder that can insert 608 or 708 captions into the encoded stream which is sent to Media Services. Media Services will deliver the content with inserted captions to your viewers.</td></tr>
<tr><td>TTML inside ismt (Smooth Streaming Text Tracks)</td><td>Media Services dynamic packaging enables your clients to stream content in any of the following formats: MPEG DASH, HLS or Smooth Streaming. However, if you ingest fragmented MP4 (Smooth Streaming) with captions inside .ismt (Smooth Streaming text tracks), you would only be able to deliver the stream to Smooth Streaming clients.</td></tr>
<tr><td>SCTE-35</td><td>Digital signaling system used to cue advertising insertion. Downstream receivers use the signal to splice advertising into the stream for the allotted time. SCTE-35 must be sent as a sparse track in the input stream.<br/>Note that currently, the only supported input stream format that carries ad signals is fragmented MP4 (Smooth Streaming). The only supported output format is also Smooth Streaming.</td></tr>
</table>

##Considerations

You are only billed when your channel is in running state.

Every time you reconfigure the transcoder, call the **Reset** method on the channel. Before you reset the channel, you have to stop the program. After you reset the channel, restart the program. 

A channel can be stopped only when it is in the Running state, and all programs on the channel have been stopped.

By default you can only add 5 channels to your Media Services account. For more information, see [Quotas and Limitations](media-services-quotas-and-limitations.md).


[live-overview]: ./media/media-services-overview/media-services-live-streaming-current.png