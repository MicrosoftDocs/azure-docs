---
title: Video Indexer concepts
titlesuffix: Azure Media Services
description: This topic describes some concepts of the Video Indexer service.
services: media-services
author: Juliako
manager: femila

ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 05/15/2019
ms.author: juliako
---

# Video Indexer concepts
 
This article describes some concepts of the Video Indexer service.
 	
## Summarized insights

Summarized insights contain an aggregated view of the data: faces, topics, emotions. For example, instead of going over each of the thousands of time ranges and checking which faces are in it, the summarized insights contains all the faces and for each one, the time ranges it appears in and the % of the time it is shown.

## time range vs. adjusted time range

TimeRange is the time range in the original video. AdjustedTimeRange is the time range relative to the current playlist. Since you can create a playlist from different lines of different videos, you can take a 1-hour video and use just 1 line from it, for example, 10:00-10:15. In that case, you will have a playlist with 1 line, where the time range is 10:00-10:15 but the adjustedTimeRange is 00:00-00:15.
 
## Blocks

Blocks are meant to make it easier to go through the data. For example, block might be broken down based on when speakers change or there is a long pause.

## Next steps

For information about how to get started, see [How to sign up and upload your first video](video-indexer-get-started.md).

## See also

[Video Indexer overview](video-indexer-overview.md)
