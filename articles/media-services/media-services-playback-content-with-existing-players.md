<properties 
	pageTitle="Playback your content" 
	description="This topic lists existing players that you can use to playback your content." 
	services="media-services" 
	documentationCenter="" 
	authors="Juliako" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/22/2016" 
	ms.author="juliako"/>


#Playing your content with existing players

Azure Media Services supports many popular streaming formats, such as Smooth Streaming, HTTP Live Streaming, and MPEG-Dash. This topic points you to existing players that you can use to test your streams.  

>[AZURE.NOTE]To play dynamically packaged or dynamically encrypted content, make sure to get at least one streaming unit for the streaming endpoint from which you plan to deliver your content. For information about scaling streaming units, see: [How to scale streaming units](media-services-manage-origins.md#scale_streaming_endpoints).

###Azure Classic Portal Media Services content Player

The **Azure Classic Portal** provides a content player that you can use to test your video.

Click on the desired video (make sure it was [published](media-services-manage-content.md#publish)) and click the **Play** button at the bottom of the portal. 
 
Some considerations apply:

- The **MEDIA SERVICES CONTENT PLAYER** plays from the default streaming endpoint. If you want to play from a non-default streaming endpoint, use another player. For example, [Azure Media Player](http://amsplayer.azurewebsites.net/azuremediaplayer.html).
 

![AMSPlayer][AMSPlayer]

###Azure Media Player

Use [Azure Media Player](http://amsplayer.azurewebsites.net/azuremediaplayer.html) to playback your content (clear or protected) in any of the following formats:

- Smooth Streaming
- MPEG DASH
- HLS
- Progressive MP4


###Flash Player

####AES-encrypted with Token 

[http://aestoken.azurewebsites.net](http://aestoken.azurewebsites.net)

###Silverlight Players

####Monitoring

[http://smf.cloudapp.net/healthmonitor](http://smf.cloudapp.net/healthmonitor)

####PlayReady with Token

[http://sltoken.azurewebsites.net](http://sltoken.azurewebsites.net)

### DASH Players

[http://dashplayer.azurewebsites.net](http://dashplayer.azurewebsites.net)

[http://dashif.org](http://dashif.org)

###Other

To test HLS URLs you can also use:

- **Safari** on an iOS device or
- **3ivx HLS Player** on Windows.

##Developing video players

For information about how to develop your own players, see [Developing video players](media-services-develop-video-players.md)




##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

 
[AMSPlayer]: ./media/media-services-playback-content-with-existing-players/media-services-portal-player.png 