---
title: Use existing players to playback your content - Azure | Microsoft Docs
description: This topic lists existing players that you can use to playback your content.
services: media-services
documentationcenter: ''
author: Juliako
manager: erikre
editor: ''

ms.assetid: 7e9fcf89-0fb6-4fa4-96cb-666320684d69
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/23/2017
ms.author: juliako

---
# Playing your content with existing players
Azure Media Services supports many popular streaming formats, such as Smooth Streaming, HTTP Live Streaming, and MPEG-Dash. This topic points you to existing players that you can use to test your streams.

### The Azure portal Media Services content player
The **Azure** portal provides a content player that you can use to test your video.

Click on the desired video (make sure it was [published](media-services-portal-publish.md)) and click the **Play** button at the bottom of the portal.

Some considerations apply:

* The **MEDIA SERVICES CONTENT PLAYER** plays from the default streaming endpoint. If you want to play from a non-default streaming endpoint, use another player. For example, [Azure Media Player](http://amsplayer.azurewebsites.net/azuremediaplayer.html).

![AMSPlayer][AMSPlayer]

### Azure Media Player
Use [Azure Media Player](http://amsplayer.azurewebsites.net/azuremediaplayer.html) to playback your content (clear or protected) in any of the following formats:

* Smooth Streaming
* MPEG DASH
* HLS
* Progressive MP4

### Flash Player
#### AES-encrypted with Token
[http://aestoken.azurewebsites.net](http://aestoken.azurewebsites.net)

### Silverlight Players
#### Monitoring
[http://smf.cloudapp.net/healthmonitor](http://smf.cloudapp.net/healthmonitor)

#### PlayReady with Token
[http://sltoken.azurewebsites.net](http://sltoken.azurewebsites.net)

### DASH Players
[http://dashplayer.azurewebsites.net](http://dashplayer.azurewebsites.net)

[http://dashif.org](http://dashif.org)

### Other
To test HLS URLs you can also use:

* **Safari** on an iOS device or
* **3ivx HLS Player** on Windows.

## Developing video players
For information about how to develop your own players, see [Developing video players](media-services-develop-video-players.md)

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

[AMSPlayer]: ./media/media-services-playback-content-with-existing-players/media-services-portal-player.png
