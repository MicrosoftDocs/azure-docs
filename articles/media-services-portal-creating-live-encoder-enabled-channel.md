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


>[AZURE.NOTE]
To complete this tutorial, you need an Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. 
For details, see <a href="http://www.windowsazure.com/pricing/free-trial/?WT.mc_id=A8A8397B5" target="_blank">Azure Free Trial</a>.
>
>You also need a Media Services account. For more information, see [Create Account](media-services-create-account.md).

This tutorial walks you through the steps of creating a **Channel** that receives a single-bitrate live stream and encodes it to multi-bitrate stream.

>[AZURE.NOTE]For more conceptual information related to Channels that are enabled for live encoding, see [Working with Channels that Perform Live Encoding from a Single-bitrate to Multi-bitrate Stream](media-services-manage-live-encoder-enabled-channels.md).

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