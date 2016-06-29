<properties 
	pageTitle="Configure the NewTek TriCaster encoder to send a single bitrate live stream" 
	description="This topic shows how to configure the Tricaster live encoder to send a single bitrate stream to AMS channels that are enabled for live encoding." 
	services="media-services" 
	documentationCenter="" 
	authors="Juliako,cenkdin,anilmur" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="ne" 
	ms.topic="article" 
	ms.date="06/22/2016" 
	ms.author="juliako"/>

#Use the NewTek TriCaster encoder to send a single bitrate live stream

> [AZURE.SELECTOR]
- [Tricaster](media-services-configure-tricaster-live-encoder.md)
- [Elemental Live](media-services-configure-elemental-live-encoder.md)
- [Wirecast](media-services-configure-wirecast-live-encoder.md)
- [FMLE](media-services-configure-fmle-live-encoder.md)

This topic shows how to configure the [NewTek TriCaster](http://newtek.com/products/tricaster-40.html) live encoder to send a single bitrate stream to AMS channels that are enabled for live encoding. For more information, see [Working with Channels that are Enabled to Perform Live Encoding with Azure Media Services](media-services-manage-live-encoder-enabled-channels.md).

This tutorial shows how to manage Azure Media Services (AMS) with Azure Media Services Explorer (AMSE) tool. This tool only runs on Windows PC. If you are on Mac or Linux, use the Azure Classic Portal to create [channels](media-services-portal-creating-live-encoder-enabled-channel.md#create-a-channel) and [programs](media-services-portal-creating-live-encoder-enabled-channel.md#create-and-manage-a-program).

>[AZURE.NOTE]When using Tricaster for sending in a contribution feed to AMS channels that are enabled for live encoding, there can be video/audio glitches in your live event if you use certain features of Tricaster, such as rapid cutting between feeds, or switching to/from slates. The AMS team is working on fixing these issues, until then, it is not recommend to use these features.


##Prerequisites

- [Create an Azure Media Services account](media-services-create-account.md)
- Ensure there is a Streaming Endpoint running with at least one streaming unit allocated. For more information, see [Manage Streaming Endpoints in a Media Services Account](media-services-manage-origins.md)
- Install the latest version of the [AMSE](https://github.com/Azure/Azure-Media-Services-Explorer) tool.
- Launch the tool and connect to your AMS account.

##Tips

- Whenever possible, use a hardwired internet connection.
- A good rule of thumb when determining bandwidth requirements is to double the streaming bitrates. While this is not a mandatory requirement, it will help mitigate the impact of network congestion.
- When using software based encoders, close out any unnecessary programs.

## Create a channel

1.  In the AMSE tool, navigate to the **Live** tab, and right click within the channel area. Select **Create channel…** from the menu.

![tricaster](./media/media-services-tricaster-live-encoder/media-services-tricaster1.png)

2. Specify a channel name, the description field is optional. Under Channel Settings, select **Standard** for the Live Encoding option, with the Input Protocol set to **RTMP**. You can leave all other settings as is.


Make sure the **Start the new channel now** is selected.

3. Click **Create Channel**.
![tricaster](./media/media-services-tricaster-live-encoder/media-services-tricaster2.png)

>[AZURE.NOTE] The channel can take as long as 20 minutes to start.


While the channel is starting you can [configure the encoder](media-services-configure-tricaster-live-encoder.md#configure_tricaster_rtmp).

>[AZURE.IMPORTANT] Note that billing starts as soon as Channel goes into a ready state. For more information, see [Channel's states](media-services-manage-live-encoder-enabled-channels.md#states).

##<a id=configure_tricaster_rtmp></a>Configure the NewTek TriCaster encoder

In this tutorial the following output settings are used. The rest of this section describes configuration steps in more detail. 

**Video**:
 
- Codec: H.264 
- Profile: High (Level 4.0) 
- Bitrate: 5000 kbps 
- Keyframe: 2 seconds (60 seconds) 
- Frame Rate: 30
 
**Audio**:

- Codec: AAC (LC) 
- Bitrate: 192 kbps 
- Sample Rate: 44.1 kHz


###Configuration steps

1. Create a new **NewTek TriCaster** project depending on what video input source is being used. 
2. Once within that project, find the **Stream** button, and click the gear icon next to it to access the stream configuration menu.

	![tricaster](./media/media-services-tricaster-live-encoder/media-services-tricaster3.png)
3. Once the menu has opened, click **New** under the Connection heading. When prompted for the connection type, select **Adobe Flash**.

	![tricaster](./media/media-services-tricaster-live-encoder/media-services-tricaster4.png)

4. Click **OK**.

5. An FMLE profile can now be imported by clicking the drop down arrow under **Streaming Profile** and navigating to **Browse**.

	![tricaster](./media/media-services-tricaster-live-encoder/media-services-tricaster5.png)

6. Navigate to where the configured FMLE profile was saved.
7. Select it, and press **OK**.

	Once the profile is uploaded, proceed to the next step.

6. Get the channel's input URL in order to assign it to the Tricaster **RTMP Endpoint**.
	
	Navigate back to the AMSE tool, and check on the channel completion status. Once the State has changed from **Starting** to **Running**, you can get the input URL.
	  
	When the channel is running, right click the channel name, navigate down to hover over **Copy Input URL to clipboard** and then select **Primary Input 
	URL**.  
	
	![tricaster](./media/media-services-tricaster-live-encoder/media-services-tricaster6.png)

7. Paste this information in the **Location** field under **Flash Server** within the Tricaster project. Also assign a stream name in the **Stream ID** field. 

	If stream information was added to the FMLE profile, it can also be imported to this section by clicking **Import Settings**, navigating to the saved FMLE profile and clicking **OK**. The relevant Flash Server fields should populate with the information from FMLE.

	![tricaster](./media/media-services-tricaster-live-encoder/media-services-tricaster7.png)

9. When finished, click **OK** at the bottom of the screen. When video and audio inputs into the Tricaster are ready, begin streaming to AMS by clicking the **Stream** button.

	![tricaster](./media/media-services-tricaster-live-encoder/media-services-tricaster11.png)

>[AZURE.IMPORTANT] Before you click **Stream**, you **must** ensure that the Channel is ready. 
>Also, make sure not to leave the Channel in a ready state without an input contribution feed for longer than > 15 minutes. 

##Test playback
  
1. Navigate to the AMSE tool, and right click the channel to be tested. From the menu, hover over **Playback the Preview** and select **with Azure Media Player**.  

	![tricaster](./media/media-services-tricaster-live-encoder/media-services-tricaster8.png)

If the stream appears in the player, then the encoder has been properly configured to connect to AMS. 

If an error is received, the channel will need to be reset and encoder settings adjusted. Please see the [troubleshooting](media-services-troubleshooting-live-streaming.md) topic for guidance.  

##Create a program

1. Once channel playback is confirmed, create a program. Under the **Live** tab in the AMSE tool, right click within the program area and select **Create New Program**.  

	![tricaster](./media/media-services-tricaster-live-encoder/media-services-tricaster9.png)

2. Name the program and, if needed, adjust the **Archive Window Length** (which defaults to 4 hours). You can also specify a storage location or leave as the default.  
3. Check the **Start the Program now** box.
4. Click **Create Program**.  
  
	Note: Program creation takes less time than channel creation.    
 
5. Once the program is running, confirm playback by right clicking the program and navigating to **Playback the program(s)** and then selecting **with Azure Media Player**.  
6. Once confirmed, right click the program again and select **Copy the Output URL to Clipboard** (or retrieve this information from the **Program information and settings** option from the menu). 

The stream is now ready to be embedded in a player, or distributed to an audience for live viewing.  


## Troubleshooting

Please see the [troubleshooting](media-services-troubleshooting-live-streaming.md) topic for guidance. 


##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]
