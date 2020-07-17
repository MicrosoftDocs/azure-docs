---
title: Search for exact moments in videos with Video Indexer
titleSuffix: Azure Media Services
description: Learn how to search for exact moments in videos using Video Indexer.
services: media-services
author: Juliako
manager: femila
ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 05/15/2019
ms.author: juliako
---

# Search for exact moments in videos with Video Indexer

This topic shows you the search options that enable you to search for exact moments in videos.

1. Go to the [Video Indexer](https://www.videoindexer.ai/) website and sign in.
2. Search among all videos in your account.

    In the following example, we search for all videos that talk about security and in which Satya appears.

    ![Search for video in Video Indexer](./media/video-indexer-search/video-indexer-search01.png)

3. Search the summarized insights of the video.

    You can then search in a video by selecting **Play** on the video. Then, you can search for exact moments in the video by selecting the **Search** tab.

    In the following example, we search for "secure" inside the selected video.

    ![Search in a video with Video Indexer](./media/video-indexer-search/video-indexer-search02.png)

    If you select one of the results, the player brings you to that exact moment in the video. You can achieve the player/insights view and synchronization in your app. For more information, see [Embed Video Indexer widgets into your app](video-indexer-embed-widgets.md).

4. Search the detailed breakdown of the video.

    If you want to create your own clip based on the video that you found, select the **Edit** button. This page shows you the video along with its insights as filters. For more information, see [View and edit Video Indexer insights](video-indexer-view-edit.md).

    You can search for exact moments within the video to only show the lines you're interested in. Use the side insights to filter the parts you want to see. When you finish, you can preview your clip and select **Publish** to create the new clip that appears in your gallery.

    In the following example, we searched for the "mixed reality" text. We also applied additional filters, as shown in the screen below.

    ![Search for exact moment in Video Indexer](./media/video-indexer-search/video-indexer-search03.png)

## Next steps

Once you find the exact moment in the video you want to work with, you can continue processing the video. For more information, see the following topics:

- [Use your videos' deep insights](use-editor-create-project.md)
- [Process content with Video Indexer REST API](video-indexer-use-apis.md)
- [Embed visual widgets in your application](video-indexer-embed-widgets.md)

## See also

[Video Indexer overview](video-indexer-overview.md)
