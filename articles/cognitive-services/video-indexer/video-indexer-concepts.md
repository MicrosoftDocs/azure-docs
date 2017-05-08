---
title: Azure Video Indexer concepts | Microsoft Docs
description: This topic describes some concepts of the Video Indexer service.
services: cognitive services
documentationcenter: ''
author: juliako
manager: erikre

ms.service: video-indexer
ms.topic: article
ms.date: 04/17/2017
ms.author: juliako;

---
# Video Indexer concepts
 
This topic describes some concepts of the Video Indexer service.
 	
## Breakdowns

The **breakdowns** element has the full list and details of everything. For example, it has a list of blocks where each block has its transcript lines, OCR lines, faces. In addition, transcript lines, OCR lines, faces have their timestamps and other details. This is where the full transcript comes from. However, the breadown can be too detailed and too long for most users, in which case you would look at **Summarized insights**.

## Summarized insights

Summarized insights contain an aggregated view of the data: faces, keywords, sentiments. For example, instead of going over each of the thousands of time ranges and checking which faces are in it, the summarized insights contains all the faces and for each one, the time ranges it appears in and the % of the time it is shown.

## Topics/keywords

Topics/keywords are in the list of key phrases that Video Indexer extracts from the text. For example, a Scott Guthrie video might contain the following topics/keywords: Security, Azure, Microsoft Cloud, Revenue.

## Sentiments

When Video Indexer analyzes transcripts, it detects sentiments as well. For example, "this is a very exciting event" is a positive sentiment.

## time range vs. adjusted time range

TimeRange is the time range in the original video. AdjustedTimeRange is the time range relative to the current playlist. Since you can create a playlist from different lines of different videos, you can take a 1-hour video and use just 1 line from it, for example, 10:00-10:15. In that case, you will have a playlist with 1 line, where the time range is 10:00-10:15 but the adjustedTimeRange is 00:00-00:15.
 
## Blocks

Blocks are meant to make it easier to go through the data. For example, block might be broken down based on when speakers change or there is a long pause.

## Next steps

For information about how to get started, see [How to sign up and upload your first video](video-indexer-get-started.md).

## See also

[Vider Indexer overview](video-indexer-overview.md)

