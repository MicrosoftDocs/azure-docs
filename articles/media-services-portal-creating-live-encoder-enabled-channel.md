<properties 
	pageTitle="Use Management Portal to Create Channels that Perform Live Encoding from a Single-bitrate to Multi-bitrate Stream" 
	description="This tutorial walks you through the steps of creating a Channel that receives a single-bitrate live stream and encodes it to multi-bitrate stream." 
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
	ms.date="04/16/2015" 
	ms.author="juliako"/>


#Use Management Portal to Create Channels that Perform Live Encoding from a Single-bitrate to Multi-bitrate Stream (Preview)


This tutorial walks you through the steps of creating a **Channel** that receives a single-bitrate live stream and encodes it to multi-bitrate stream.

>[AZURE.NOTE]For more conceptual information related to Channels that are enabled for live encoding, see [Working with Channels that Perform Live Encoding from a Single-bitrate to Multi-bitrate Stream](media-services-manage-live-encoder-enabled-channels.md).

##Common Live Streaming Scenario

The following steps describe tasks involved in creating common live streaming applications.

1. Connect a video camera to a computer. Launch and configure an on-premises live encoder that can output a single bitrate stream in one of the following protocols: RTMP, Smooth Streaming, or RTP (MPEG-TS). For more information, see [Azure Media Services RTMP Support and Live Encoders](http://go.microsoft.com/fwlink/?LinkId=532824).
	
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
2. Optionally, the live encoder can be signaled to start an advertisement. The advertisement is inserted in the output stream.
1. Stop the program whenever you want to stop streaming and archiving the event.
1. Delete the Program (and optionally delete the asset).   

##Prerequisites
The following are required to complete the tutorial.

- To complete this tutorial, you need an Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. 
For details, see [Azure Free Trial](azure.microsoft.com).
- A Media Services account. To create a Media Services account, see [Create Account](media-services-create-account.md).
- A webcam and an encoder that can send a single bitrate live stream.
 
##Create a CHANNEL

1.	In the [Management Portal](http://manage.windowsazure.com/), click Media Services and then click on the Media Services account name.
2.	Select the CHANNELS page.
3.	Select Add+ to add a new channel.

Choose **Standard** encoding types. This types specifies that you want to create a Channel that is enabled for live encoding. That means the incoming single bitrate stream is sent to the Channel and encoded into a multi-bitrate stream using specified live encoder settings. For more information, see [Working with Channels that Perform Live Encoding from a Single-bitrate to Multi-bitrate Stream](media-services-manage-live-encoder-enabled-channels.md).

![standard0][standard0]

For the **Standard** encoding type, valid ingest protocol options are:

- Single bitrate Fragmented MP4 (Smooth Streaming)
- Single bitrate RTMP
- RTP (MPEG-TS): MPEG-2 Transport Stream over RTP.

For detailed explanation about each protocol, see [Working with Channels that Perform Live Encoding from a Single-bitrate to Multi-bitrate Stream](media-services-manage-live-encoder-enabled-channels.md).

![standard1][standard1]

You cannot change the input protocol while the Channel or its associated programs are running. If you require different protocols, you should create separate channels for each input protocol.  

On the **Advertising Configuration** page you can specify the source for ad markers signals. When using Portal, you can only select API, which indicates that the live encoder within the Channel should listen to an asynchronous Ad Marker API. When using Portal, you can only select API.

For more information, see [Working with Channels that Perform Live Encoding from a Single-bitrate to Multi-bitrate Stream](media-services-manage-live-encoder-enabled-channels.md).

![standard2][standard2]

On the **Encoding Preset** page, you can select system presets. Currently, the only system preset you can select is **Default 720p**.

![standard3][standard3]

On the **Channel Creation** page, you can define the IP addresses that are allowed to publish video to this channel. Allowed IP addresses can be specified as either a single IP address (e.g. ‘10.0.0.1’), an IP range using an IP address and a CIDR subnet mask (e.g. ‘10.0.0.1/22’), or an IP range using an IP address and a dotted decimal subnet mask (e.g. ‘10.0.0.1(255.255.252.0)’).

If no IP addresses are specified and there is no rule definition then no IP address will be allowed. To allow any IP address, create a rule and set 0.0.0.0/0.


![standard4][standard4]

>[AZURE.NOTE] Channel start up can take up to 30 minutes. Channel reset can take up to 5 minutes.

Once you created the Channel, you can select the **ENCODER** tab where you can view your channels configurations. You can also manage advertisements and slates. 

![standard5][standard5]

For more information, see [Working with Channels that Perform Live Encoding from a Single-bitrate to Multi-bitrate Stream](media-services-manage-live-encoder-enabled-channels.md).




[standard0]: ./media/media-services-managing-channels/media-services-create-channel-standard0.png
[standard1]: ./media/media-services-managing-channels/media-services-create-channel-standard1.png
[standard2]: ./media/media-services-managing-channels/media-services-create-channel-standard2.png
[standard3]: ./media/media-services-managing-channels/media-services-create-channel-standard3.png
[standard4]: ./media/media-services-managing-channels/media-services-create-channel-standard4.png
[standard5]: ./media/media-services-managing-channels/media-services-create-channel-standard_encode.png