---
title: Turn off local preview mirroring
titleSuffix: An Azure Communication Services article
description: This article describes how to turn off local preview mirroring.
author: yassirbisteni
manager: gaobob

ms.author: yassirb
ms.date: 6/26/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other, devx-track-js

zone_pivot_groups: acs-plat-web-windows-android-ios
---

### Code to turn off local preview mirroring

````csharp
var uri = await localOutgoingVideoStream.StartPreviewAsync();
mediaPlayerElement.Source = MediaSource.CreateFromUri(uri);

var mediaPlayer = mediaPlayerElement.MediaPlayer;
var playbackSession = mediaPlayer.PlaybackSession;
playbackSession.IsMirroring = true;
````