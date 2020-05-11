---
title: Use existing players to playback your content - Azure | Microsoft Docs
description: This article lists existing players that you can use to playback your content.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.assetid: 7e9fcf89-0fb6-4fa4-96cb-666320684d69
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/19/2019
ms.author: juliako

---
# Playing your content with existing players
Azure Media Services supports many popular streaming formats, such as Smooth Streaming, HTTP Live Streaming, and MPEG-Dash. This topic points you to existing players that you can use to test your streams.

### The Azure portal Media Services content player
The **Azure** portal provides a content player that you can use to test your video.

Click on the desired video (make sure it was [published](media-services-portal-publish.md)) and click the **Play** button at the bottom of the portal.

Some considerations apply:

* The **MEDIA SERVICES CONTENT PLAYER** plays from the default streaming endpoint. If you want to play from a non-default streaming endpoint, use another player. For example, [Azure Media Player](https://aka.ms/azuremediaplayer).

![AMSPlayer][AMSPlayer]

### Azure Media Player

Use [Azure Media Player](https://aka.ms/azuremediaplayer) to playback your content (clear or protected) in any of the following formats:

* Smooth Streaming
* MPEG DASH
* HLS
* Progressive MP4

### Flash Player

#### PlayReady with Token

[https://sltoken.azurewebsites.net](https://sltoken.azurewebsites.net)

### DASH Players

[https://dashplayer.azurewebsites.net](https://dashplayer.azurewebsites.net)

[https://dashif.org](https://dashif.org)

### Other
To test HLS URLs you can also use:

* **Safari** on an iOS device or
* **3ivx HLS Player** on Windows.

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

[AMSPlayer]: ./media/media-services-playback-content-with-existing-players/media-services-portal-player.png
