<properties 
	pageTitle="Playback your content" 
	description="This topic describes how to playback your content." 
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
	ms.date="02/16/2015" 
	ms.author="juliako"/>


#Playback your content

Azure Media Services supports many popular streaming formats, such as Smooth Streaming, HTTP Live Streaming, and MPEG-Dash. This topic points you to existing players that you can use to test your streams.  

##Playing your content with existing players

This topic shows the existing players with which you can playback your content.

>[AZURE.NOTE]To play dynamically packaged or dynamically encrypted content, make sure to get at least one streaming unit for the streaming endpoint from which you plan to deliver your content. For information about scaling streaming units, see: [How to scale streaming units](media-services-manage-origins.md#scale_streaming_endpoints).


###Azure Management Portal Media Services content Player

The **Azure Management Portal** provides a content player that you can use to test your video.

Click on the desired video (make sure it was [published](media-services-manage-content.md#publish)) and click the **Play** button at the bottom of the portal. 
 
Some considerations apply:

- The **MEDIA SERVICES CONTENT PLAYER** plays from the default streaming endpoint. If you want to play from a non-default streaming endpoint, use another player. For example, [Azure Media Services Player](http://amsplayer.azurewebsites.net/azuremediaplayer.html).
 

![AMSPlayer][AMSPlayer]

###Azure Media Services Player

Use [Azure Media Services Player](http://amsplayer.azurewebsites.net/azuremediaplayer.html) to playback your content.


##Developing video players

For information about how to develop your own players, see [Developing video players](media-services-develop-video-players.md)
 
[AMSPlayer]: ./media/media-services-players/media-services-portal-player.png