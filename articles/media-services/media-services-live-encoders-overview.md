<properties 
	pageTitle="Configuring on-premises live encoders" 
	description="This topic lists on-premises live encoders that you can use to capture your live events and send a single bitrate live stream to AMS channels (that are live encoding enabled) for further processing. The topic links to tutorials that show how to configure listed encoders." 
	services="media-services" 
	documentationCenter="" 
	authors="juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/29/2015"    
	ms.author="juliako"/>



#Configuring on-premises live encoders

This topic lists on-premises live encoders that you can use to capture your live events and send a single bitrate live stream to AMS channels (that are live encoding enabled) for further processing. The topic also links to tutorials that show how to configure listed encoders.


##Elemental Live

For information on how to configure the [Elemental Live](http://www.elementaltechnologies.com/products/elemental-live) encoder to send a single bitrate live stream to an AMS Channel, see [Configuring Elemental Live](media-services-configure-elemental-live-encoder.md).
 
##Flash Media Live Encoder

For information on how to configure the [Flash Media Live Encoder](http://www.adobe.com/products/flash-media-encoder.html) (FMLE) encoder to send a single bitrate live stream to an AMS Channel, see [Configuring FMLE](media-services-configure-fmle-live-encoder.md) .

##Telestream Wirecast

For information on how to configure the [Telestream Wirecast](http://www.telestream.net/wirecast/overview.htm) encoder to send a single bitrate live stream to an AMS Channel, see [Configuring Wirecast](media-services-configure-wirecast-live-encoder.md).

##NewTek TriCaster

For information on how to configure the [Tricaster](http://newtek.com/products/tricaster-40.html) encoder to send a single bitrate live stream to an AMS Channel, see [Configuring Tricaster](media-services-configure-tricaster-live-encoder.md).

##Troubleshooting guide 

###Problem: There is no option for outputting a progressive stream

- **Potential issue**: The encoder being used doesn't automatically deinterlace. 

	**Troubleshooting steps**: Look for a de-interlacing option within the encoder interface. Once de-interlacing is enabled, check again for progressive output settings. 
 
###Problem: Tried several encoder output settings and still unable to connect. 

- **Potential issue**: Azure encoding channel was not properly reset. 

	**Troubleshooting steps**: Make sure the encoder is no longer pushing to AMS, stop and reset the channel. Once running again, try connecting your encoder with the new settings. If this still does not correct the issue, try creating a new channel entirely, sometimes channels can become corrupt after several failed attempts.  

- **Potential issue**: The GOP size or key frame settings are not optimal. 

	**Troubleshooting steps**: Recommended GOP size or keyframe interval is 2 seconds. Some encoders calculate this setting in number of frames, while others use seconds. For example: When outputting 30fps, the GOP size would be 60 frames, which is equivalent to 2 seconds.  
	 
- **Potential issue**: Closed ports are blocking the stream. 

	**Troubleshooting steps**: When streaming via RTMP, check firewall and/or proxy settings to confirm that outbound ports 1935 and 1936 are open. When using RTP streaming, confirm that outbound port 2010 is open. 


###Problem: When configuring the encoder to stream with the RTP protocol, there is no place to enter a host name. 

- **Potential issue**: Many RTP encoders do not allow for host names, and an IP address will need to be acquired.  

	**Troubleshooting steps**: To find the IP address, open a command prompt on any computer. To do this in Windows, open the Run launcher (WIN + R) and type “cmd” to open.  

	Once the command prompt is open, type "Ping [AMS Host Name]". 

	The host name can be derived by omitting the port number from the Azure Ingest URL, as highlighted in the following example: 

	rtp://test2-amstest009.rtp.channel.mediaservices.windows.net:2010/ 

	![fmle](./media/media-services-fmle-live-encoder/media-services-fmle10.png)

###Problem: Unable to playback the published stream.
 
- **Potential issue**: There is no Streaming Endpoint running, or there is no streaming units (scale units) allocated. 

	**Troubleshooting steps**: Navigate to the "Streaming Endpoint" tab in the AMSE tool, and confirm there is a Streaming Endpoint running with one streaming unit. 
	
>[AZURE.NOTE] If after following the troubleshooting steps you still cannot successfully stream, submit a support ticket using the Azure Management Portal.

##Media Services learning paths

You can view AMS learning paths here:

- [AMS Live Streaming Workflow](http://azure.microsoft.com/documentation/learning-paths/media-services-streaming-live/)
- [AMS on Demand Streaming Workflow](http://azure.microsoft.com/documentation/learning-paths/media-services-streaming-on-demand/)

## See also

[Working with Channels that are Enabled to Perform Live Encoding with Azure Media Services](media-services-manage-live-encoder-enabled-channels.md).