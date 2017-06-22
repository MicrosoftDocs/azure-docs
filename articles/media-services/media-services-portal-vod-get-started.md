---
title: Get started with delivering VoD using the Azure portal | Microsoft Docs
description: This tutorial walks you through the steps of implementing a basic Video-on-Demand (VoD) content delivery service with Azure Media Services (AMS) application using the Azure portal.
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
ms.date: 01/23/2017
ms.author: juliako

---
# Get started with delivering content on demand using the Azure portal
[!INCLUDE [media-services-selector-get-started](../../includes/media-services-selector-get-started.md)]

This tutorial walks you through the steps of implementing a basic Video-on-Demand (VoD) content delivery service with Azure Media Services (AMS) application using the Azure portal.

## Prerequisites
The following are required to complete the tutorial:

* An Azure account. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/). 
* A Media Services account. To create a Media Services account, see [How to Create a Media Services Account](media-services-portal-create-account.md).

This tutorial includes the following tasks:

1. Start streaming endpoint.
2. Upload a video file.
3. Encode the source file into a set of adaptive bitrate MP4 files.
4. Publish the asset and get streaming and progressive download URLs.  
5. Play your content.

## Start streaming endpoints 

When working with Azure Media Services one of the most common scenarios is delivering video via adaptive bitrate streaming. Media Services provides dynamic packaging, which allows you to deliver your adaptive bitrate MP4 encoded content in streaming formats supported by Media Services (MPEG DASH, HLS, Smooth Streaming) just-in-time, without you having to store pre-packaged versions of each of these streaming formats.

>[!NOTE]
>When your AMS account is created a **default** streaming endpoint is added to your account in the **Stopped** state. To start streaming your content and take advantage of dynamic packaging and dynamic encryption, the streaming endpoint from which you want to stream content has to be in the **Running** state. 

To start the streaming endpoint, do the following:

1. Log in at the [Azure portal](https://portal.azure.com/).
2. In the Settings window, click Streaming endpoints. 
3. Click the default streaming endpoint. 

	The DEFAULT STREAMING ENDPOINT DETAILS window appears.

4. Click the Start icon.
5. Click the Save button to save your changes.

## Upload files
To stream videos using Azure Media Services, you need to upload the source videos, encode them into multiple bitrates, and publish the result. The first step is covered in this section. 

1. In the **Setting** window, click **Assets**.
   
    ![Upload files](./media/media-services-portal-vod-get-started/media-services-upload.png)
2. Click the **Upload** button.
   
    The **Upload a video asset** window appears.
   
   > [!NOTE]
   > There is no file size limitation.
   > 
   > 
3. Browse to the desired video on your computer, select it, and hit OK.  
   
    The upload starts and you can see the progress under the file name.  

Once the upload completes, you see the new asset listed in the **Assets** window. 

## Encode assets
When working with Azure Media Services one of the most common scenarios is delivering adaptive bitrate streaming to your clients. Media Services supports the following adaptive bitrate streaming technologies: HTTP Live Streaming (HLS), Smooth Streaming, MPEG DASH. To prepare your videos for adaptive bitrate streaming, you need to encode your source video into multi-bitrate files. You should use the **Media Encoder Standard** encoder to encode your videos.  

Media Services also provides dynamic packaging, which allows you to deliver your multi-bitrate MP4s in the following streaming formats: MPEG DASH, HLS, Smooth Streaming, without you having to repackage into these streaming formats. With dynamic packaging, you only need to store and pay for the files in single storage format and Media Services builds and serves the appropriate response based on requests from a client.

To take advantage of dynamic packaging, you need to encode your source file into a set of multi-bitrate MP4 files (the encoding steps are demonstrated later in this section).

### To use the portal to encode
This section describes the steps you can take to encode your content with Media Encoder Standard.

1. In the **Settings** window, select **Assets**.  
2. In the **Assets** window, select the asset that you would like to encode.
3. Press the **Encode** button.
4. In the **Encode an asset** window, select the "Media Encoder Standard" processor and a preset. For example, if you know your input video has a resolution of 1920x1080 pixels, then you could use the "H264 Multiple Bitrate 1080p" preset. For more information about presets, see [this](media-services-mes-presets-overview.md) article – it is important to select the preset that is most appropriate for your input video. If you have a low resolution (640x360) video, then you should not be using the default "H264 Multiple Bitrate 1080p" preset.
   
   For easier management, you have an option of editing the name of the output asset, and the name of the job.
   
   ![Encode assets](./media/media-services-portal-vod-get-started/media-services-encode1.png)
5. Press **Create**.

### Monitor encoding job progress
To monitor the progress of the encoding job, click **Settings** (at the top of the page) and then select **Jobs**.

![Jobs](./media/media-services-portal-vod-get-started/media-services-jobs.png)

## Publish content
To provide your user with a  URL that can be used to stream or download your content, you first need to "publish" your asset by creating a locator. Locators provide access to files contained in the asset. Media Services supports two types of locators: 

* Streaming (OnDemandOrigin) locators, used for adaptive streaming (for example, to stream MPEG DASH, HLS, or Smooth Streaming). To create a streaming locator your asset must contain an .ism file. 
* Progressive (SAS) locators, used for delivery of video via progressive download.

A streaming URL has the following format and you can use it to play Smooth Streaming assets.

    {streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest

To build an HLS streaming URL, append (format=m3u8-aapl) to the URL.

    {streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=m3u8-aapl)

To build an  MPEG DASH streaming URL, append (format=mpd-time-csf) to the URL.

    {streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=mpd-time-csf)


A SAS URL has the following format.

    {blob container name}/{asset name}/{file name}/{SAS signature}

> [!NOTE]
> If you used the portal to create locators before March 2015, locators with a two-year expiration date were created.  
> 
> 

To update an expiration date on a locator, use [REST](https://docs.microsoft.com/rest/api/media/operations/locator#update_a_locator) or [.NET](http://go.microsoft.com/fwlink/?LinkID=533259) APIs. When you update the expiration date of a SAS locator, the URL changes.

### To use the portal to publish an asset
To use the portal to publish an asset, do the following:

1. Select **Settings** > **Assets**.
2. Select the asset that you want to publish.
3. Click the **Publish** button.
4. Select the locator type.
5. Press **Add**.
   
    ![Publish](./media/media-services-portal-vod-get-started/media-services-publish1.png)

The URL is added to the list of **Published URLs**.

## Play content from the portal
The Azure portal provides a content player that you can use to test your video.

Click the desired video and then click the **Play** button.

![Publish](./media/media-services-portal-vod-get-started/media-services-play.png)

Some considerations apply:

* Make sure the video has been published.
* This **Media player** plays from the default streaming endpoint. If you want to play from a non-default streaming endpoint, click to copy the URL and use another player. For example, [Azure Media Services Player](http://amsplayer.azurewebsites.net/azuremediaplayer.html).

## Next steps
Review Media Services learning paths.

[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

