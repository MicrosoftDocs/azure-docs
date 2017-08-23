---
title: Get started with delivering video-on-demand by using the Azure portal | Microsoft Docs
description: This tutorial walks you through the steps of implementing a basic video-on-demand content delivery service with an Azure Media Services application in the Azure portal.
services: media-services
documentationcenter: ''
author: Juliako
manager: erikre
editor: ''

ms.assetid: 6c98fcfa-39e6-43a5-83a5-d4954788f8a4
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 08/07/2017
ms.author: juliako

---
# Get started with delivering content on demand by using the Azure portal
[!INCLUDE [media-services-selector-get-started](../../includes/media-services-selector-get-started.md)]

This tutorial walks you through the steps of implementing a basic video-on-demand content delivery service with an Azure Media Services application in the Azure portal.

## Prerequisites
The following items are required to complete the tutorial:

* An Azure account. For details, see [Azure free trial](https://azure.microsoft.com/pricing/free-trial/). 
* A Media Services account. To create a Media Services account, see [How to create a Media Services account](media-services-portal-create-account.md).

This tutorial includes the following tasks:

1. Start the streaming endpoint.
2. Upload a video file.
3. Encode the source file into a set of adaptive bitrate MP4 files.
4. Publish the asset, and get streaming and progressive download URLs.  
5. Play your content.

## Start the streaming endpoint

One of the most common scenarios when working with Azure Media Services is delivering video via adaptive bitrate streaming. Media Services provides dynamic packaging. With dynamic packaging, you can deliver your adaptive bitrate MP4 encoded content in just-in-time streaming formats supported by Media Services. Examples include Apple HTTP Live Streaming (HLS), Microsoft Smooth Streaming, and Dynamic Adaptive Streaming over HTTP (DASH, also called MPEG-DASH). By using Media Services adaptive bitrate streaming, you can deliver your videos without storing prepackaged versions of each of these streaming formats.

> [!NOTE]
> When you create your Media Services account, a **default** streaming endpoint is added to your account in the **Stopped** state. To start streaming your content, and to take advantage of dynamic packaging and dynamic encryption, the streaming endpoint from which you want to stream content has to be in the **Running** state. 

To start the streaming endpoint:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. In the **Settings** pane, select **Streaming endpoints**. 
3. Select the default streaming endpoint. 

	The **DEFAULT STREAMING ENDPOINT DETAILS** window appears.

4. Select the **Start** icon.
5. Select the **Save** button.

## Upload files
To stream videos by using Media Services, you upload the source videos, encode them into multiple bitrates, and then publish the result. The first step is covered in this section. 

1. In the [Azure portal](https://portal.azure.com/), select your Azure Media Services account.
2. Select **Settings** > **Assets**.
   
    ![Upload files](./media/media-services-portal-vod-get-started/media-services-upload.png)
3. Select the **Upload** button.
   
    The **Upload a video asset** window appears.
   
   > [!NOTE]
   > Media Services doesn't limit the file size for uploading videos.
   > 
   > 
4. On your computer, go to the video that you want to upload. Select the video, and then select **OK**.  
   
    The upload begins. You can see the progress under the file name.  

When the upload is finished, you see the new asset listed in the **Assets** pane. 

## Encode assets

Another common scenario when working with Azure Media Services is delivering adaptive bitrate streaming to your clients. Media Services supports the following adaptive bitrate streaming technologies: Apple HTTP Live Streaming (HLS), Microsoft Smooth Streaming, and Dynamic Adaptive Streaming over HTTP (DASH, also called MPEG-DASH). To prepare your videos for adaptive bitrate streaming, first encode your source video as multi-bitrate files. You can use the Azure Media Encoder Standard encoder to encode your videos.  

Media Services offers you dynamic packaging. With dynamic packaging, you can deliver your multi-bitrate MP4s in MPEG-DASH, HLS, and Smooth Streaming, without repackaging in these streaming formats. When you use dynamic packaging, you can store and pay for the files in single-storage format. Media Services builds and serves the appropriate response based on a client's request.

To take advantage of dynamic packaging, you must encode your source file into a set of multi-bitrate MP4 files. The encoding steps are demonstrated later in this section.

### To use the portal to encode

To encode your content by using Media Encoder Standard:

1. In the [Azure portal](https://portal.azure.com/), select your Azure Media Services account.
2. Select **Settings** > **Assets**.
3. Select the asset that you want to encode.
4. Select the **Encode** button.
5. In the **Encode an asset** pane, select the **Media Encoder Standard** processor and a preset. For information about presets, see [Auto-generate a bitrate ladder](media-services-autogen-bitrate-ladder-with-mes.md) and [Task presets for Media Encoder Standard](media-services-mes-presets-overview.md). It's important to choose the preset that will work best for your input video. For example, if you know your input video has a resolution of 1,920 &#215; 1,080 pixels, you might choose the **H264 Multiple Bitrate 1080p** preset. If you have a low-resolution (640 &#215; 360) video, you shouldn't use the **H264 Multiple Bitrate 1080p** preset.
   
   To help you manage your resources, you can edit the name of the output asset and the name of the job.
   
   ![Encode assets](./media/media-services-portal-vod-get-started/media-services-encode1.png)
6. Select **Create**

### Monitor encoding job progress
To monitor the progress of the encoding job, at the top of the page, select **Settings**, and then select **Jobs**.

![Jobs](./media/media-services-portal-vod-get-started/media-services-jobs.png)

## Publish content
To provide your user with a URL that they can use to stream or download your content, first you must publish your asset by creating a locator. Locators provide access to files that are in the asset. Azure Media Services supports two types of locators: 

* **Streaming (OnDemandOrigin) locators**. Streaming locators are used for adaptive streaming. Examples of adaptive streaming include Apple HTTP Live Streaming (HLS), Microsoft Smooth Streaming, and Dynamic Adaptive Streaming over HTTP (DASH, also called MPEG-DASH). To create a streaming locator, your asset must include an .ism file. 
* **Progressive (shared access signature) locators**. Progressive locators are used to deliver video via progressive download.

You can use a streaming URL to play Smooth Streaming assets. A streaming URL has the following format:

    {streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest

To build an HLS streaming URL, append *(format=m3u8-aapl)* to the URL:

    {streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{file name}.ism/Manifest(format=m3u8-aapl)

To build an MPEG-DASH streaming URL, append *(format=mpd-time-csf)* to the URL:

    {streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{file name}.ism/Manifest(format=mpd-time-csf)

A shared access signature URL has the following format:

    {blob container name}/{asset name}/{file name}/{shared access signature}

> [!NOTE]
> Locators that were created in the Azure portal before March 2015 have a two-year expiration date.  
> 
> 

To update an expiration date on a locator, use [REST APIs](https://docs.microsoft.com/rest/api/media/operations/locator#update_a_locator) or [.NET APIs](http://go.microsoft.com/fwlink/?LinkID=533259). When you update the expiration date of a shared access signature locator, the URL changes.

### To use the portal to publish an asset

1. In the [Azure portal](https://portal.azure.com/), select your Azure Media Services account.
2. Select **Settings** > **Assets**.
3. Select the asset that you want to publish.
4. Select the **Publish** button.
5. Select the locator type.
6. Select **Add**.
   
    ![Publish the video](./media/media-services-portal-vod-get-started/media-services-publish1.png)

The URL is added to the list of **Published URLs**.

## Play content from the portal
You can test your video on a content player in the Azure portal.

Select the video, and then select the **Play** button.

![Play the video in the Azure portal](./media/media-services-portal-vod-get-started/media-services-play.png)

Some considerations apply:

* To begin streaming, start running the default streaming endpoint.
* Make sure that the video has been published.
* The Azure portal media player plays from the default streaming endpoint. If you want to play from a non-default streaming endpoint, select and copy the URL, and then use another player. For example, you can test your video on the [Azure Media Player](http://amsplayer.azurewebsites.net/azuremediaplayer.html).

## Next steps
Review Media Services learning paths.

[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

