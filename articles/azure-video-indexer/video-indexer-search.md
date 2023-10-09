---
title: Search for exact moments in videos with Azure AI Video Indexer
description: Learn how to search for exact moments in videos using Azure AI Video Indexer.
ms.topic: how-to
ms.date: 11/23/2019
ms.author: inhenkel
author: IngridAtMicrosoft
---

# Search for exact moments in videos with Azure AI Video Indexer

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

This topic shows you how to use the Azure AI Video Indexer website to search for exact moments in videos.

1. Go to the [Azure AI Video Indexer](https://www.videoindexer.ai/) website and sign in.
1. Specify the search keywords and the search will be performed among all videos in your account's library. 

    You can filter your search by selecting **Filters**. In below example, we search for "Microsoft" that appears as an on-screen text only (OCR).

    :::image type="content" source="./media/video-indexer-search/filter.png" alt-text="Filter, text only":::
1. Press **Search** to see the result.

    :::image type="content" source="./media/video-indexer-search/results.png" alt-text="Video search result":::

    If you select one of the results, the player brings you to that exact moment in the video.
1. View and search the summarized insights of the video by clicking **Play** on the video or selecting one of your original search results. 

    You can view, search, edit the **insights**. When you select one of the insights, the player brings you to that exact moment in the video.  

    :::image type="content" source="./media/video-indexer-search/insights.png" alt-text="View, search and edit the insights of the video":::

    If you embed the video through Azure AI Video Indexer widgets, you can achieve the player/insights view and synchronization in your app. For more information, see [Embed Azure AI Video Indexer widgets into your app](video-indexer-embed-widgets.md).
1. You can view, search, and edit the transcripts by clicking on the **Timeline** tab. 

    :::image type="content" source="./media/video-indexer-search/timeline.png" alt-text="View, search and edit the transcripts of the video":::

    To edit the text, select **Edit** from the top-right corner and change the text as you need. 

    You can also translate and download the transcripts by selecting the appropriate option from the top-right corner. 

## Embed, download, create projects

You can embed your video by selecting **</>Embed** under your video. For details, see [Embed visual widgets in your application](video-indexer-embed-widgets.md).

You can download the source video, insights of the video, transcripts by clicking **Download** under your video.

You can create a clip based on your video of specific lines and moments by clicking **Open in editor**. Then editing the video, and saving the project. For details, see [Use your videos' deep insights](use-editor-create-project.md).

:::image type="content" source="./media/video-indexer-search/embed-download-create-projects.png" alt-text="Embed, download, create projects of the video":::

## Next steps

[Process content with Azure AI Video Indexer REST API](video-indexer-use-apis.md)
