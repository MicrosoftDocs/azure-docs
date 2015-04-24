<properties 
	pageTitle="Use Management Portal to Create Channels that Receive Multi-bitrate Live Stream from On-premises Encoders" 
	description="This tutorial walks you through the steps of implementing a basic Media Services live streaming application where a Channel receives a multi-bitrate live stream from an on-premises live encoder." 
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


#Use Management Portal to Create Channels that Receive Multi-bitrate Live Stream from On-premises Encoders

[AZURE.INCLUDE [media-services-selector-manage-channels](../includes/media-services-selector-manage-channels.md)]


>[AZURE.NOTE]
To complete this tutorial, you need an Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. 
For details, see <a href="http://www.windowsazure.com/pricing/free-trial/?WT.mc_id=A8A8397B5" target="_blank">Azure Free Trial</a>.
>
You also need a webcam and a live encoder. This tutorial uses <a href="http://www.telestream.net/wirecast/overview.htm">Telestream Wirecast</a> live encoder.

This tutorial walks you through the steps of implementing a basic Media Services live streaming application where a **Channel** receives a multi-bitrate live stream from an on-premises live encoder. 

In Azure Media Services (AMS), a **Channel** represents a pipeline for processing live streaming content. A **Program** enables you to control the publishing and storage of segments in a live stream. Channels manage Programs. The Channel and Program relationship is very similar to traditional media where a Channel has a constant stream of content and a program is scoped to some timed event on that Channel. 

When working with Live Streaming, one of the components that is involved in the workflow is a live video encoder that converts signals from the camera to streams that are sent to a live streaming service. A **Channel** can receive live input streams from an on-premises live encoder that outputs a multi-bitrate RTMP or Fragmented MP4 (Smooth Streaming) stream. You can use the following live encoders that output Smooth Streaming: Elemental, Envivio, Cisco.  The following live encoders output RTMP: Adobe Flash Live, Telestream Wirecast, and Tricaster transcoders. The ingested streams pass through **Channel**s without any further processing. The live encoder can also ingest a single bitrate stream, but since the stream is not processed, the client applications will also receive a single bitrate stream (this option is not recommended). Once the received content is published, it can be streamed to client playback applications through one or more **Streaming Endpoint**s. The following adaptive streaming protocols can be used to play the stream: HLS,  MPEG DASH, Smooth Stream, HDS. 

A **Streaming Endpoint** represents a streaming service that can deliver content directly to a client player application, or to a Content Delivery Network (CDN) for further distribution. The outbound stream from a streaming endpoint service can be a live stream, or a video on demand asset in your Media Services account. In addition, you can control the capacity of the Streaming Endpoint service to handle growing bandwidth needs by adjusting streaming reserved units. You should allocate at least one reserved unit for applications in a production environment. For more information, see [How to Scale a Media Service](media-services-manage-origins.md#scale_streaming_endpoints).

For a more detailed overview of working with channels and related components, see [Working with Channels that Receive Multi-bitrate Live Stream from On-premises Encoders](media-services-channels-overview.md).   

In this tutorial, the Azure Management Portal is used to accomplish the following tasks: 

1.  Create a Media Services account
2.  Configure streaming endpoints
3.  Create a channel
1.  Configure a live encoder and ingest live stream into the channel (Wirecast is used in this step)
1.  Create a program (and an asset)
1.  Publish the asset and get streaming URLs  
1.  Play your content 
2.  Cleaning up

##Create a Media Services account

1. In the [Management Portal][], click **New**, click **Media Service**, and then click **Quick Create**.
   
	![Media Services Quick Create](./media/media-services-create-account/wams-QuickCreate.png)

2. In **NAME**, enter the name of the new account. A Media Services account name is all lower-case numbers or letters with no spaces, and is 3 - 24 characters in length. 

3. In **REGION**, select the geographic region that will be used to store the metadata records for your Media Services account. Only the available Media Services regions appear in the dropdown. 

4. In **STORAGE ACCOUNT**, select a storage account to provide blob storage of the media content from your Media Services account. You can select an existing storage account in the same geographic region as your Media Services account, or you can create a new storage account. A new storage account is created in the same region. 

5. If you created a new storage account, in **NEW STORAGE ACCOUNT NAME**, enter a name for the storage account. The rules for storage account names are the same as for Media Services accounts.

6. Click **Quick Create** at the bottom of the form.

	You can monitor the status of the process in the message area at the bottom of the window.

	Once account is successfully created, the status changes to Active. 
	
	At the bottom of the page, the **MANAGE KEYS** button appears. When you click on this button, a dialog with the Media Services account name and the primary and secondary keys is displayed. You will need the account name and the primary key information to programmatically access the Media Services account. 

	
	![Media Services Page](./media/media-services-create-account/wams-mediaservices-page.png)

	When you double-click on the account name, the Quick Start page is displayed by default. This page enables you to do some management tasks that are also available on other pages of the portal. For example, you can upload a video file from this page, or do it from the CONTENT page.

	 
##Configure streaming endpoint using Portal

When working with Azure Media Services, one of the most common scenarios is delivering adaptive bitrate streaming to your clients. With adaptive bitrate streaming, the client can switch to a higher or lower bitrate stream as the video is displayed based on the current network bandwidth, CPU utilization, and other factors. Media Services supports the following adaptive bitrate streaming technologies: HTTP Live Streaming (HLS), Smooth Streaming, MPEG DASH, and HDS (for Adobe PrimeTime/Access licensees only). 

When working with live streaming, an on-premises live encoder (in our case Wirecast) ingests a multi-bitrate live stream into your channel. When the stream is requested by a user, Media Services uses dynamic packaging to re-package the source stream into the requested adaptive bitrate stream (HLS, DASH, or Smooth). 

To take advantage of dynamic packaging, you need to get at least one streaming unit for the **streaming endpoint** from which you plan to delivery your content.

To change the number of streaming reserved units, do the following:

1. In the [Management Portal](https://manage.windowsazure.com/), click **Media Services**. Then, click the name of the media service.

2. Select the STREAMING ENDPOINTS page. Then, click on the streaming endpoint that you want to modify.

3. To specify the number of streaming units, select the SCALE tab and move the **reserved capacity** slider.

	![Scale page](./media/media-services-how-to-scale/media-services-origin-scale.png)

4. Press the SAVE button to save your changes.

	The allocation of any new units takes around 20 minutes to complete. 

	 
	>[AZURE.NOTE] Currently, going from any positive value of streaming units back to none, can disable streaming for up to an hour.
	>
	> The highest number of units specified for the 24-hour period is used in calculating the cost. For information about pricing details, see [Media Services Pricing Details](http://go.microsoft.com/fwlink/?LinkId=275107).


##Create a channel

In the Azure Management Portal, select the **CHANNEL** page. Then, click **NEW**.

In the **Create a new Live Channel** dialog enter a name for your channel and specify the ingest protocol. Wirecast outputs RTMP, so we will leave this protocol.

Press **OK**.   

 
![createchannel](./media/media-services-managing-channels/media-services-create-channel.png)

After a few minutes the channel gets created and started.

##Get ingest URLs

Once the channel is created, you can get ingest URLs that you will provide to the live encoder. The encoder uses these URLs to input a live stream.

![readychannel](./media/media-services-managing-channels/media-services-ready-channel.png)


![ingesturls](./media/media-services-managing-channels/media-services-ingest-urls.png)

For more information about Ingest URLs, see [Using on-premises encoders to send multi-bitrate live stream to a channel](media-services-channels-overview.md).   

##Configure a live encoder and ingest live stream 

>[AZURE.NOTE]This step will require the channel’s ingest URL that was mentioned in the previous step.

For detailed information about how to configure Wirecast and start ingesting the stream, see [Wirecast Configuration](http://azure.microsoft.com/blog/2014/09/18/azure-media-services-rtmp-support-and-live-encoders/).

>[AZURE.NOTE]If for any reason you stop the encoder and then need to restart it you should first reset the channel by clicking the **RESET** command in the Azure management portal.


##Create and manage a program

###Overview

A channel is associated with programs that enable you to control the publishing and storage of segments in a live stream. Channels manage Programs. The Channel and Program relationship is very similar to traditional media where a channel has a constant stream of content and a program is scoped to some timed event on that channel.

You can specify the number of hours you want to retain the recorded content for the program by setting the **Archive Window** length. This value can be set from a minimum of 5 minutes to a maximum of 25 hours. Archive window length also dictates the maximum amount of time clients can seek back in time from the current live position. Programs can run over the specified amount of time, but content that falls behind the window length is continuously discarded. This value of this property also determines how long the client manifests can grow.

Each program is associated with an Asset. To publish the program you must create an OnDemand locator for the associated asset. Having this locator will enable you to build a streaming URL that you can provide to your clients.

A channel supports up to three concurrently running programs so you can create multiple archives of the same incoming stream. This allows you to publish and archive different parts of an event as needed. For example, your business requirement is to archive 6 hours of a program, but to broadcast only last 10 minutes. To accomplish this, you need to create two concurrently running programs. One program is set to archive 6 hours of the event but the program is not published. The other program is set to archive for 10 minutes and this program is published.

You should not reuse existing programs for new events. Instead, create and start a new program for each event as described in the Programming Live Streaming Applications section.

Start the program when you are ready to start streaming and archiving. Stop the program whenever you want to stop streaming and archiving the event. 

To delete archived content, stop and delete the program and then delete the associated asset. An asset cannot be deleted if it is used by a program; the program must be deleted first. 

Even after you stop and delete the program, the users would be able to stream your archived content as a video on demand, for as long as you do not delete the asset.

If you do want to retain the archived content, but not have it available for streaming, delete the streaming locator.

###Create/Start/Stop Programs

Once you have the stream flowing into the Channel you can begin the streaming event by creating an Asset, Program, and Streaming Locator. This will archive the stream and make it available to viewers through the Streaming Endpoint. 

There are two ways to start event: 

1. From the **CHANNEL** page, press **ADD** to add a new program.

	Specify: program name, asset name, archive window, and encryption option.
	
	![createprogram](./media/media-services-managing-channels/media-services-create-program.png)
	
	If you left **Publish this program now** checked, the program the PUBLISHING URLs will get created.
	
	You can press **START**, whenever you are ready streaming the program.

	Once you start the program, you can press PLAY to start playing the content.


	![createdprogram](./media/media-services-managing-channels/media-services-created-program.png)

2. Alternatively, you can use a shortcut and press **START STREAMING** button on the **CHANNEL** page. This will create an Asset, Program, and Streaming Locator.

	The program is named DefaultProgram and the archive window is set to 1 hour.

	You can play the published program from the CHANNEL page. 

	![channelpublish](./media/media-services-managing-channels/media-services-channel-play.png)


If you click **STOP STREAMING** on the **CHANNEL** page, the default program will be stopped and deleted. The asset will still be there and you can publish or unpublish it from the **CONTENT**  page.

If you switch to the **CONTENT** page, you will see the assets that were created for your programs.

![contentasset](./media/media-services-managing-channels/media-services-content-assets.png)


##Playing content

To provide your user with a  URL that can be used to stream your content, you first need to "publish" your asset (as was described in the previous section) by creating a locator (when you publish an asset using Portal, locators are created for you). Locators provide access to files contained in the asset. 

Depending on what streaming protocol you want to use to playback your content, you might need to modify the URL that you get from the **PUBLISH URL** link of the channel\program.

Dynamic packaging will take care of packaging the live stream into the specified protocol. 

By default, a streaming URL has the following format and you can use it to play Smooth Streaming assets:

	{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest

To build an HLS streaming URL, append (format=m3u8-aapl) to the URL.

	{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=m3u8-aapl)

To build an  MPEG DASH streaming URL, append (format=mpd-time-csf) to the URL.

	{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=mpd-time-csf)

For more information about delivering your content, see [Delivering content](media-services-deliver-content-overview.md).

You can playback Smooth Stream using [AMS Player](http://amsplayer.azurewebsites.net/azuremediaplayer.html) or use iOS and Android devices to play HLS version 3.

##Clean up

If you are done streaming events and want to clean up the resources provisioned earlier, follow the following procedure.

- Stop pushing the stream from the encoder.
- Stop the channel. Once the Channel is stopped, it will not incur any charges. When you need to start it again, it will have the same ingest URL so you won't need to reconfigure your encoder.
- You can stop your Streaming Endpoint, unless you want to continue to provide the archive of your live event as an on-demand stream. If the channel is in stopped state, it will not incur any charges.



##Next step

Learn more about building Live Streaming applications [Build Live Streaming applications](media-services-live-streaming-workflow.md)

###Additional Resources
- <a href="http://channel9.msdn.com/Shows/Azure-Friday/Azure-Media-Services-101-Get-your-video-online-now-">Azure Media Services 101 - Get your video online now!</a>
- <a href="http://channel9.msdn.com/Shows/Azure-Friday/Azure-Media-Services-102-Dynamic-Packaging-and-Mobile-Devices">Azure Media Services 102 - Dynamic Packaging and Mobile Devices</a>


<!-- Anchors. -->


<!-- URLs. -->
[Management Portal]: http://manage.windowsazure.com/

<!-- Images -->
