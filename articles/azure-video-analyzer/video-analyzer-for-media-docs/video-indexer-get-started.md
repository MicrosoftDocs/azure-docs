---
title: Sign up for Azure Video Analyzer for Media (formerly Video Indexer) and upload your first video - Azure
titleSuffix: Azure Video Analyzer for Media
description: Learn how to sign up and upload your first video using the Azure Video Analyzer for Media (formerly Video Indexer) portal.
services: azure-video-analyzer
author: Juliako
manager: femila
ms.topic: quickstart
ms.subservice: azure-video-analyzer-media
ms.date: 01/25/2021
ms.author: juliako
---

# Quickstart: How to sign up and upload your first video

This getting started quickstart shows how to sign in to the Azure Video Analyzer for Media (formerly Video Indexer) website and how to upload your first video.

When creating a Video Analyzer for Media account, you can choose a free trial account (where you get a certain number of free indexing minutes) or a paid option (where you are not limited by the quota). With free trial, Video Analyzer for Media provides up to 600 minutes of free indexing to website users and up to 2400 minutes of free indexing to API users. With paid option, you create a Video Analyzer for Media account that is [connected to your Azure subscription and an Azure Media Services account](connect-to-azure.md). You pay for minutes indexed, for more information, see [Media Services pricing](https://azure.microsoft.com/pricing/details/media-services/). 

## Sign up for Video Analyzer for Media

To start developing with Video Analyzer for Media, browse to the [Video Analyzer for Media](https://www.videoindexer.ai/) website and sign up.

Once you start using Video Analyzer for Media, all your stored data and uploaded content are encrypted at rest with a Microsoft managed key.

> [!NOTE]
> Review [planned Video Analyzer for Media website authenticatication changes](./release-notes.md#planned-video-analyzer-for-media-website-authenticatication-changes).

## Upload a video using the Video Analyzer for Media website

### Supported file formats for Video Analyzer for Media

See the [input container/file formats](../../media-services/latest/encode-media-encoder-standard-formats-reference.md) article for a list of file formats that you can use with Video Analyzer for Media.

### Upload a video

1. Sign in on the [Video Analyzer for Media](https://www.videoindexer.ai/) website.
1. To upload a video, press the **Upload** button or link.

    > [!NOTE]
    > The name of the video must be no greater than 80 characters.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/video-indexer-get-started/video-indexer-upload.png" alt-text="Upload":::
1. Once your video has been uploaded, Video Analyzer for Media starts indexing and analyzing the video. You see the progress. 

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/video-indexer-get-started/progress.png" alt-text="Progress of the upload":::
1. Once Video Analyzer for Media is done analyzing, you will get an email with a link to your video and a short description of what was found in your video. For example: people, spoken and written words, topics, and named entities.
1. You can later find your video in the library list and perform different operations. For example: search, re-index, edit.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/video-indexer-get-started/uploaded.png" alt-text="Uploaded the upload":::

## Supported browsers

For more information, see [supported browsers](video-indexer-overview.md#supported-browsers).

## See also

See [Upload and index videos](upload-index-videos.md) for more details.

After you upload and index a video, you can start using [Video Analyzer for Media website](video-indexer-view-edit.md) or [Video Analyzer for Media Developer Portal](video-indexer-use-apis.md) to see the insights of the video. 

[Start using APIs](video-indexer-use-apis.md)

## Next steps

For detailed introduction please visit our [introduction lab](https://github.com/Azure-Samples/media-services-video-indexer/blob/master/IntroToVideoIndexer.md). 

At the end of the workshop you will have a good understanding of the kind of information that can be extracted from video and audio content, you will be more prepared to identify opportunities related to content intelligence, pitch video AI on Azure, and demo several scenarios on Video Analyzer for Media.

