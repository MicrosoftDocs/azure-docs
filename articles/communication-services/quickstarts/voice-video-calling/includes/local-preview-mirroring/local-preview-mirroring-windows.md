---
title: Quickstart - Local preview mirroring
titleSuffix: An Azure Communication Services Quickstart
description: This quickstart describes how to mirror local preview
author: yassirbisteni
manager: gaobob

ms.author: yassirb
ms.date: 2/21/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other, devx-track-js

zone_pivot_groups: acs-plat-web-windows-android-ios
---

## Mirror local preview

````csharp
var uri = await localOutgoingVideoStream.StartPreviewAsync();
mediaPlayerElement.Source = MediaSource.CreateFromUri(uri);

var mediaPlayer = mediaPlayerElement.MediaPlayer;
var playbackSession = mediaPlayer.PlaybackSession;
playbackSession.IsMirroring = true;
````