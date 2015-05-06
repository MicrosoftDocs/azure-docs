<properties 
	pageTitle="Working with Channels that Receive Multi-bitrate Live Stream from On-premises Encoders" 
	description="This topic describes how to set up a Channel that receives a multi-bitrate live stream from an on-premises encoder. The stream can then be delivered to client playback applications through one or more Streaming Endpoints, using one of the following adaptive streaming protocols: HLS, Smooth Stream, MPEG DASH, HDS." 
	services="media-services" 
	documentationCenter="" 
	authors="Juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="ne" 
	ms.topic="article" 
	ms.date="04/29/2015" 
	ms.author="juliako"/>

#Working with Channels that Receive Multi-bitrate Live Stream from On-premises Encoders

##Overview

In Azure Media Services, a **Channel** represents a pipeline for processing live streaming content. A **Channel** receives live input streams in the following way:

- An on-premises live encoder sends multi-bitrate **RTMP** or **Smooth Streaming** (Fragmented MP4) to the Channel. You can use the following live encoders that output multi-bitrate Smooth Streaming: Elemental, Envivio, Cisco.  The following live encoders output RTMP: Adobe Flash Live, Telestream Wirecast, and Tricaster transcoders. The ingested streams pass through **Channel**s without any further processing. Your live encoder can lso send a single bitrate stream, but that is not recommended. When requested, Media Services delivers the stream to customers.


The following diagram represents a live streaming workflow that uses an on-premises live encoder to output multi-bitrate RTMP or Fragmented MP4 (Smooth Streaming) streams. 

![Live workflow][live-overview]

This topic covers the following:

- [Common live streaming scenario](media-services-manage-channels-overview.md#scenario)
- [Description of a Channel and its related components](media-services-manage-channels-overview.md#channel)
- [Considerations](media-services-manage-channels-overview.md#considerations)
- [Tasks related to Live Streaming](media-services-manage-channels-overview.md#tasks)

##<a id="scenario"></a>Common live streaming scenario
The following steps describe tasks involved in creating common live streaming applications.

1. Connect a video camera to a computer. Launch and configure an on-premises live encoder that outputs a multi-bitrate RTMP or Fragmented MP4 (Smooth Streaming) stream. For more information, see [Azure Media Services RTMP Support and Live Encoders](http://go.microsoft.com/fwlink/?LinkId=532824).
	
	This step could also be performed after you create your Channel.

1. Create and start a Channel.
1. Retrieve the Channel ingest URL. 

	The ingest URL is used by the live encoder to send the stream to the Channel.
1. Retrieve the Channel preview URL. 

	Use this URL to verify that your channel is properly receiving the live stream.

2. Create an asset.
3. If you want for the asset to be dynamically encrypted during playback, do the following: 	
	
	1. 	Create a content key. 
	1. 	Configure the content key's authorization policy.
1. Configure asset delivery policy (used by dynamic packaging and dynamic encryption).
3. Create a program and specify to use the asset that you created.
1. Publish the asset associated with the program by creating an OnDemand locator.  

	Make sure to have at least one streaming reserved unit on the streaming endpoint from which you want to stream content.
1. Start the program when you are ready to start streaming and archiving.
1. Stop the program whenever you want to stop streaming and archiving the event.
1. Delete the Program (and optionally delete the asset).   

The [live streaming tasks](media-services-manage-channels-overview.md#tasks) section links to topics that demonstrate how to achieve tasks described above.

##<a id="channel"></a>Description of a Channel and its related components

###<a id="channel_input"></a>Channel input (ingest) configurations

####<a id="ingest_protocols"></a>Ingest streaming protocol

Media Services supports ingesting live feeds using the following streaming protocol: 

- **Multi-bitrate Fragmented MP4**
 
- **Multi-bitrate RTMP** 

	When the **RTMP** ingest streaming protocol is selected, two ingest(input) endpoints are created for the channel: 
	
	**Primary URL**: Specifies the fully qualified URL of the channel's primary RTMP ingest endpoint.

	**Secondary URL**(optional): Specifies the fully qualified URL of the channel's secondary RTMP ingest endpoint. 

	Use the secondary URL to improve the durability and fault tolerance of your ingest stream as well as encoder failover and fault-tolerance. 
	
	- To improve ingest durability and fault-tolerance:
		
		Use one encoder to send the same data to the primary and secondary ingest URLs. Most RTMP encoders (for example, Flash Media Encoder or Wirecast) have the ability to use Primary and Secondary URLs.

	- To handle encoder failover and fault-tolerance:
		
		Use multiple encoders to generate the same data and send it to the primary and secondary ingest URLs. This approach improves both ingest durability and encoder high availability. NOTE: the encoder needs to support high availability scenario and also needs to be time synchronized internally (for details, refer to your encoder manual).
	
 	Using secondary ingest URL requires additional bandwidth. 

Note that you can ingest a single bitrate into your channel, but since the stream is not processed by the channel, the client applications will also receive a single bitrate stream (this option is not recommended).

For information about RTMP live encoders, see [Azure Media Services RTMP Support and Live Encoders](http://go.microsoft.com/fwlink/?LinkId=532824).

The following considerations apply:

- Make sure you have sufficient free Internet connectivity to send data to the ingest points. 
- The incoming multi-bitrate stream can have a maximum of 10 video quality levels (aka layers), and a maximum of 5 audio tracks.
- The highest average bitrate for any of the video quality levels or layers should be below 10 Mbps.
- The aggregate of the average bitrates for all the video and audio streams should be below 25 Mbps.
- You cannot change the input protocol while the Channel or its associated programs are running. If you require different protocols, you should create separate channels for each input protocol. 


####Ingest URLs (endpoints) 

A Channel provides an input endpoint (ingest URL) that you specify in the live encoder, so the encoder can push streams to your channels.   

You can get the ingest URLs when you create the channel. To get these URLs, the channel does not have to be in the **Running** state. When you are ready to start pushing data into the channel, the channel must be in the **Running** state. Once the channel starts ingesting data, you can preview your stream through the preview URL.

You have an option of ingesting Fragmented MP4 (Smooth Streaming) live stream over an SSL connection. To ingest over SSL, make sure to update the ingest URL to HTTPS. Currently, you cannot ingest RTMP over SSL. 

####<a id="keyframe_interval"></a>Keyframe interval

When using an on-premises live encoder to generate multi-bitrate stream, the keyframe interval specifies GOP duration (as used by that external encoder). Once this incoming stream is received by the Channel, you can then deliver your live stream to client playback applications in any of the following formats: Smooth Streaming, DASH and HLS. When doing live streaming, HLS is always packaged dynamically. By default, Media Services automatically calculates HLS segment packaging ratio (fragments per segment) based on the keyframe interval, also referred to as Group of Pictures – GOP, that is received from the live encoder. 

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


####Allowed IP addresses

You can define the IP addresses that are allowed to publish video to this channel. Allowed IP addresses can be specified as either a single IP address (e.g. ‘10.0.0.1’), an IP range using an IP address and a CIDR subnet mask (e.g. ‘10.0.0.1/22’), or an IP range using an IP address and a dotted decimal subnet mask (e.g. ‘10.0.0.1(255.255.252.0)’). 

If no IP addresses are specified and there is no rule definition, then no IP address will be allowed. To allow any IP address, create a rule and set 0.0.0.0/0.

###Channel preview 

####Preview URLs

Channels provide a preview endpoint (preview URL) that you use to preview and validate your stream before further processing and delivery.

You can get the preview URL when you create the channel. To get the URL, the channel does not have to be in the **Running** state. 

Once the Channel starts ingesting data, you can preview your stream.

Note that currently the preview stream can only be delivered in Fragmented MP4 (Smooth Streaming) format regardless of the specified input type. You can use the [http://smf.cloudapp.net/healthmonitor](http://smf.cloudapp.net/healthmonitor) player to test the Smooth Stream. You can also use a player hosted in the Azure Management Portal to view your stream.


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
 
<table border="1">
<tr><th>Channel state</th><th>Portal UI Indicators</th><th>Billed?</th></tr>
<tr><td>Starting</td><td>Starting</td><td>No (transient state)</td></tr>
<tr><td>Running</td><td>Ready (no running programs)<br/>or<br/>Streaming (at least one running program)</td><td>Yes</td></tr>
<tr><td>Stopping</td><td>Stopping</td><td>No (transient state)</td></tr>
<tr><td>Stopped</td><td>Stopped</td><td>No</td></tr>
</table>

###Closed Captioning and Ad Insertion 

The following table demonstrates supported closed captioning and ad insertion standards.

<table border="1">
<tr><th>Standard</th><th>Notes</th></tr>
<tr><td>CEA-708 and EIA-608 (708/608)</td><td>CEA-708 and EIA-608 are closed captioning standards for the United States and Canada.<br/>Currently, captioning is only supported if carried in the encoded input stream. You need to use a live media encoder that can insert 608 or 708 captions into the encoded stream which is sent to Media Services. Media Services will deliver the content with inserted captions to your viewers.</td></tr>
<tr><td>TTML inside ismt (Smooth Streaming Text Tracks)</td><td>Media Services dynamic packaging enables your clients to stream content in any of the following formats: MPEG DASH, HLS or Smooth Streaming. However, if you ingest fragmented MP4 (Smooth Streaming) with captions inside .ismt (Smooth Streaming text tracks), you would only be able to deliver the stream to Smooth Streaming clients.</td></tr>
<tr><td>SCTE-35</td><td>Digital signaling system used to cue advertising insertion. Downstream receivers use the signal to splice advertising into the stream for the allotted time. SCTE-35 must be sent as a sparse track in the input stream.<br/>Note that currently, the only supported input stream format that carries ad signals is fragmented MP4 (Smooth Streaming). The only supported output format is also Smooth Streaming.</td></tr>
</table>

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
- You are only billed when your Channel is in the **Running** state. For more information, refer to [this](media-services-manage-channels-overview.md#states) section.

##<a id="tasks"></a>Tasks related to Live Streaming

###Creating a Media Services account

[Create Azure Media Services Account](media-services-create-account.md).

###Configuring streaming endpoints

For an overview about streaming endpoints and information on how to manage them, see [How to Manage Streaming Endpoints in a Media Services Account](media-services-manage-origins.md)

###Setting up development environment  

Choose **.NET** or **REST API** for your development environment.

[AZURE.INCLUDE [media-services-selector-setup](../includes/media-services-selector-setup.md)]

###Connecting programmatically  

Choose **.NET** or **REST API** to programmatically connect to Azure Media Services.

[AZURE.INCLUDE [media-services-selector-connect](../includes/media-services-selector-connect.md)]

###Creating Channels that receive multi-bitrate live stream from on-premises encoders

For more information about on-premises live encoders, see [Using 3rd Party Live Encoders with Azure Media Services](https://msdn.microsoft.com/library/azure/dn783464.aspx).

Choose **Portal**, **.NET**, **REST API** to see how to create and manage channels and programs.

[AZURE.INCLUDE [media-services-selector-manage-channels](../includes/media-services-selector-manage-channels.md)]

###Protecting assets

If you want to encrypt an asset associate with a program with Advanced Encryption Standard (AES) (using 128-bit encryption keys) or PlayReady DRM, you need to create a content key.

Use **.NET** or **REST API** to create keys.

[AZURE.INCLUDE [media-services-selector-create-contentkey](../includes/media-services-selector-create-contentkey.md)]

Once you create the content key, you can configure key authorization policy using **.NET** or **REST API**.

[AZURE.INCLUDE [media-services-selector-content-key-auth-policy](../includes/media-services-selector-content-key-auth-policy.md)]

###Publishing and delivering assets

**Overview**: 

- [Dynamic Packaging Overview](media-services-dynamic-overview.md)
- [Delivering Content Overview](media-services-deliver-content-overview.md)

Configure asset delivery policy using **.NET** or **REST API**.

[AZURE.INCLUDE [media-services-selector-asset-delivery-policy](../includes/media-services-selector-asset-delivery-policy.md)]

Publish assets (by creating Locators) using **Azure Management Portal** or **.NET**.

[AZURE.INCLUDE [media-services-selector-publish](../includes/media-services-selector-publish.md)]


###Enabling Azure CDN

Media Services supports integration with Azure CDN. For information on how to enable Azure CDN, see [How to Manage Streaming Endpoints in a Media Services Account](media-services-manage-origins.md#enable_cdn).

###Scaling a Media Services account

You can scale **Media Services** by specifying the number of **Streaming Reserved Units** you would like your account to be provisioned with. 

For information about scaling streaming units, see: [How to scale streaming units](media-services-manage-origins.md#scale_streaming_endpoints.md).

##Related topics

[Delivering Live Streaming Events with Azure Media Services](media-services-live-streaming-workflow.md)

[Media Services Concepts](media-services-concepts.md)

[live-overview]: ./media/media-services-overview/media-services-live-streaming-current.png
