---
title: View and edit Video Indexer insights
titlesuffix: Azure Media Services
description: This topic demonstrates how to view and edit Video Indexer insights.
services: media-services
author: Juliako
manager: femila

ms.service: media-services
ms.topic: article
ms.date: 03/01/2019
ms.author: juliako
---

# View and edit Video Indexer insights

Video Indexer website, enables you to use your videos' deep insights to: find the right media content, locate the parts that you’re interested in, and use the results to create an entirely new project. Once created, the project can be rendered and downloaded from Video Indexer and be used in your own editing applications or downstream workflows.

Some scenarios where you may find this feature useful are: 

* Creating movie highlights for trailers.
* Using old clips of videos in news casts.
* Creating shorter content for social media.

This article shows how to create a project from scratch and also how to create a project from a video in your account.

## Create new project and manage videos

1. In the home page of the Video Indexer website, select the **Projects** tab. 
1. Click **Create new project**. If you have created projects before, you see all of your projects. 

    ![New project](./media/video-indexer-view-edit/new-project.png)
1. Give your project a name by clicking on the pencil icon.

    ![New project](./media/video-indexer-view-edit/new-project3.png)
1. Add a video that you want to work with to this project by selecting **Add videos**.

    You see all the videos in your account and a search box that says "Search for text, keywords, or visual content". You can search for videos with the specified criteria (person, label, brand, keyword, or occurrence in the transcript and OCR). For example, in the image below, we are looking for videos that contain "GitHub".
    
    ![GitHub](./media/video-indexer-view-edit/github.png)

    You can further filter your results by selecting Filter results. You can filter by a person or owner. You can specify the scope of your original query. For example, if you want to search "GitHub" in the OCR, select **Visual Text**.

    ![Filter](./media/video-indexer-view-edit/visual-text.png)

    You can layer multiple filters to your query. Use +/- button to add/remove filters. Use **Clear filters** to remove all filters.
1. To add the video, select them and then select Add.
1. You can rearrange the order of the videos by hovering over each video and choosing to drag and drop. 

    ![Rearrange](./media/video-indexer-view-edit/rearrange.png)
1. You can remove the video by clicking on the list menu button.
1. You can add multiple occurrences of the same video to your project. 

    You might want to do it if you want to show a clip from one video and then a clip from another and then you want to go back to show another clip from the first video. 
1. Once you are done, make sure that your project has been saved. You can now render this project. Select **Render and Download**. 

    ![Save](./media/video-indexer-view-edit/save.png)

    A popup that tells you that Video indexer will render a file and then the download link will be send to your email. Select Proceed. You will see a notification that the project is being rendered. Once it is done being rendered, you will see a new notification that the project has been successfully rendered. Click here to download the project. It will download the project in mp4 format.

1. You can access saved projects from the **Project** tab. 

    If you select this project, you  see all the insights and the timeline of this project. If you select **Video editor**, you can continue making edits. 

    ![Video editor](./media/video-indexer-view-edit/video-editor.png)

1. Click the pencil icon to make edits to the project. 
 
    Edits include adding or removing videos and clips or renaming the project.

> [!NOTE]
> Currently, projects may only contain videos indexed in the same language. Once you select a video in one language, you cannot add the videos in your account that are in a different language.

## Manage videos and edit insights

If you click on the downward arrow on the right side of each video, you will open up the insights in the video based on time stamps (clips of the video). 

1. Select **View Insights** to customize which insights you want to see and which you don't want to see. 


    ![View insights](./media/video-indexer-view-edit/insights.png)
1. To create queries for specific clips, use the search box that says "Search in transcript, visual text, people, and labels".
1. Add filters to clips by specifying what scenes you are looking for. 

    ![Filter options](./media/video-indexer-view-edit/filter-options.png)
1. Include or exclude a certain insight. 

    For example, you may want to see clips where GitHub is mentioned while Donovan Brown is on the screen. For this, you need to add an "include" filter and specify which type of insight this filter is for. 
1. Select People as the type of insight and then type in “Donovan Brown” in the search box for the filter.

    You can select from People, Keywords, Labels, Brands, Emotions, Speakers, Transcript, and Visual Text. 

    ![Include](./media/video-indexer-view-edit/include.png)

1. Select the segment that you want by selecting a clip. This will add that clip to your project. 

    You can unselect this clip by clicking on the segment again.
1. Add all segments by clicking on the list menu option next to the video you are looking at and selecting Select all segments. 

    ![Add all](./media/video-indexer-view-edit/add-all.png)

    You can clear all of your selection automatically by selecting Clear selection.

As you are selecting and ordering your clips, you can preview it in the player on the right side of the page. You should also save your project when you make changes by selecting Save project. 

## Create a project from your video

You can create a new project directly from a video in your account. 

1. Go to the **Library** tab of the Video Indexer website.
1. Open the video that you want to use to create your project. On the insights and timeline page, select the **Video editor** button.

    ![Video editor](./media/video-indexer-view-edit/video-editor.png)

    This takes you to the same page that you used to create a new project scratch. Unlike the new project, you see the timestamped insights segments of the video, that you had started with previously.

## Next steps

[Learn how to create your own Video Indexer insights based on some other video](video-indexer-create-new.md).

## See also

[Video Indexer overview](video-indexer-overview.md)

