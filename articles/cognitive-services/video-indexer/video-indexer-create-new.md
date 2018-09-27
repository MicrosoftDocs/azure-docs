---
title: "Tutorial: Create video insights from existing videos"
titlesuffix: Azure Cognitive Services
description: This topic shows you how to create and publish video insights based on existing video files.
services: cognitive services
author: juliako
manager: cgronlun

ms.service: cognitive-services
ms.component: video-indexer
ms.topic: tutorial
ms.date: 09/15/2018
ms.author: juliako
---

# Tutorial: Create highlights from existing videos

This topic shows you how to create and publish video insights based on some other video.

1. Browse to the [Video Indexer](https://www.videoindexer.ai/) website and sign in.
2. Find a video from which you want to create your video insights.
3. Press **Play**.

	The page shows the video's summarized insights. 

	![Insights](./media/video-indexer-create-new/video-indexer-summarized-insights.png)

3. Press the **Edit** button.

	This page shows you the full breakdown of a video. The breakdown is broken into blocks. Blocks are here to make it easier to go through the data. For example, block might be broken down based on when speakers change or there is a long pause. You can create your own playlist that contains only lines that you want. To show only specific parts of the source video, you can filter by topics/keywords, sentiments, people, speakers. You can choose to only view the video's transcript or OCR.    

	![Insights](./media/video-indexer-create-new/video-indexer-create-new-playlist.png)

4. Create your playlist.

	To add or remove lines to/from your playlist, press **+**/**-**.

5. Preview your playlist.

	Once you are done creating the playlist, press **Preview**.
6. Publish the playlist.

	After you preview the playlist, you can publish it.

	Once you publish the playlist, it is added to the list of your video insights.


## Next steps 

Once you create the new playlist, you can continue processing it, as described in one of these topics: 

- [Process content with Video Indexer REST API](video-indexer-use-apis.md)
- [Embed visual widgets in your application](video-indexer-embed-widgets.md)

## See also

[Video Indexer overview](video-indexer-overview.md) 
