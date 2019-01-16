---
title: Frequently asked questions about Video Indexer - Azure
titlesuffix: Azure Media Services
description: Get answers to frequently asked questions about Video Indexer.
services: media-services
author: Juliako
manager: femila

ms.service: media-services
ms.topic: article
ms.date: 12/19/2018
ms.author: juliako
---
# Frequently Asked Questions

This article answers frequently asked questions about Video Indexer.

## General Questions

### What is Video Indexer?

Video Indexer is a metadata extraction service for audio and video media files from Azure Media Services. It uses a rich set of machine learning algorithms to make it easy to classify, analyze, and gain insights into video and audio content using [pre-defined models](video-indexer-overview.md). You can use these insights in many ways like improving content discoverability and accessibility, creating new monetization opportunities, or building new experiences that leverage the insights.

Video Indexer provides a web-based interface for testing, configuration and customization, and a REST-based API for developers to integrate into production system.

### What can I do with Video Indexer?

Video Indexer can perform the following types of operations on media files:

* Identify and extract speech and identify speakers.
* Identify and extract on-screen text in a video.
* Identify and label objects in a video file.
* Identify brands like Microsoft from audio tracks and on-screen text in a video.
* Detect and recognize faces from a database of celebrities and a user-defined database of faces.
* Extract keywords from audio and video content based on spoken and visual text.
* Extract topics discussed but not necessarily explicitly mentioned in audio and video content based on spoken and visual text.
* Create closed captions or subtitles from the audio track.

For more information, see [Overview](video-indexer-overview.md).

### How do I get started with Video Indexer?

Video Indexer is free to try. The free trial provides you with 600 minutes in the web-based interface, and 2,400 minutes via the API.

To index videos and audio flies at scale, you can connect Video Indexer to a paid Microsoft Azure subscription. You can find more information on pricing on the [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/video-indexer/) page.

You can find more information on getting started in [Get started](video-indexer-get-started.md).

### Do I need coding skills to use Video Indexer?

You can integrate the Video Indexer APIs into your pipeline, or you can use the Video Indexer Portal and not need to write any code at all. 

### Do I need machine learning skills to use Video Indexer?

No, you can extract insights from your video and audio content completely without any machine learning skills or knowledge on algorithms. 

### What media formats does Video Indexer support?

Video Indexer supports most common media formats. Refer to the Azure Media Encoder standard formats list for more details.

### How to do I upload a media into Video Indexer?

In the Video Indexer web-based portal, you can upload a media file using the file upload dialog, or by pointing to a URL that directly specifies the file. For example, `http://contoso.cloudapp.net/videos/example.mp4`. A link to a page containing a video player like `http://contoso.cloudapp.net/videos` will not work. The Video Indexer API requires you to specify the input file via a URL or a byte array. Note that uploads via a URL are limited to 10 GB, but do not have a time duration limit. For more information, please see this [how-to guide](upload-index-videos.md).

### How long does it take Visual Indexer to extract insights from media?

The amount of time it takes to index a video or audio file, both using the Video Indexer API and the Video Indexer web-based interface, depends on multiple parameters such as the file length and quality, the number of insights found in the file, the number of compute unites available, and whether the streaming end point is enabled or not. For most content types, assuming that 10 S3 RUs are enabled, we predict that indexing will take from 1/3 to ½ of the length of the video.  However, we recommend that you run a few test files with your own content and take an average to get a better idea. 

### In which Azure regions is Video indexer available?

You can see which Azure regions Video Indexer is available on the [regions](https://azure.microsoft.com/global-infrastructure/services/?products=cognitive-services&regions=all) page.

### What is the SLA for Video Indexer?

The Free trial for Video Indexer has no SLA. Azure Media Service’s SLA covers Video Indexer.

You can find the information on the [SLA](https://azure.microsoft.com/support/legal/sla/media-services/v1_0/) page.

## Billing Questions

### How much does Video Indexer cost?

Video Indexer uses a simple pay for what you use pricing model based on the input duration of content. Additional charges may apply for encoding, streaming, storage, network usage, and media reserved units. For current pricing, refer to the [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/video-indexer/) page.

### Does Video Indexer offer a free trial?

Yes, Video Indexer offers a free trial that is hosted in the East US Azure region and gives full service and API functionality. There is a quota of 10 hours worth of videos for website users and 40 hours for API users. 

## Security Questions

### Are audio and video files indexed by Video Indexer stored?

Yes, unless you delete the file from Video Indexer either using the Video Indexer website or API, your video and audio files will be stored. For the free trial, the video and audio files that you index will be stored in the Azure region East US. Otherwise, your video and audio files will be stored in the storage account of your Azure subscription.

### Can I delete my files that are stored in Video Indexer Portal?

Yes, you can always delete your video and audio files as well as their insights from Video Indexer. Once you delete the files, it is permanently gone from Video Indexer and wherever Video Indexer stored the file (Azure region East US for trial accounts and the storage account of your Azure subscription otherwise).

### Who has access to my audio and video files and that have been indexed and/or stored by Video Indexer?

Yes, you can always delete your video and audio files as well as their insights from Video Indexer. Once you delete the files, it is permanently gone from Video Indexer and wherever Video Indexer stored the file (Azure region East US for trial accounts and the storage account of your Azure subscription otherwise).

### Can I control user access to my Video Indexer Account?

Yes, you select who is invited to the account.

### Who has access to the insights that were extracted from my audio and video files by Video Indexer?

Your videos that have public as its privacy setting can be accessed by anyone who has the link to your video and its insights. Your videos that have private as its privacy setting can only be accessed by users that were invited to the account of the video.

### Do I still own my content that have been indexed and stored by Video Indexer?

Yes, per the [Azure Online Services Terms](http://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=31), you own your content.

### Is the content indexed by Video Indexer kept within the Azure region where I am using Video Indexer?

Yes, the content and its insights will be kept within the Azure region unless you have a manual configuration in your Azure subscription that uses multiple Azure regions. 

### What is the Privacy policy for Video Indexer?

Video Indexer is covered by the [Microsoft Privacy Statement](https://privacy.microsoft.com/privacystatement).

## API Questions

### What are the differences in capability on the Video Indexer website versus the Video Indexer API?

With the [Video Indexer](https://www.videoindexer.com) website, you can search your video library, analyze insights, customize models, configure your account, and edit your videos with ease. With the robust [Video Indexer REST API](https://api-portal.videoindexer.ai/), you can integrate with any infrastructure, or embed widgets directly in your own website or application.

### What APIs does Video Indexer offer?

You can find information on using the Video Indexer APIs on the [Video Indexer Developer Portal](https://api-portal.videoindexer.ai/)

### How do I get started with Video Indexer's API?

Follow [Tutorial: get started with the Video Indexer API](video-indexer-use-apis.md).

### What is an access token?

The Video Indexer API contains an Authorization API and an Operations API. The Authorizations API contains calls that give you access token. Each call to the Operations API should be associated with an access token, matching the authorization scope of the call.

### What is the difference between Account access token, User access token, and Video access token?

These represent the authorization scope of a call.

* User level - user level access tokens let you perform operations on the user level. For example, get associated accounts.
* Account level – account level access tokens let you perform operations on the account level or the video level. For example, Upload video, list all videos, get video insights, etc.
* Video level – video level access tokens let you perform operations on a specific video. For example, get video insights, download captions, get widgets, etc.

You can control whether these tokens are read-only or they allow editing by specifying allowEdit=true/false.

### Why do I need access tokens when using the Video Indexer APIs?

Access tokens are needed to use the Video Indexer APIs for security purposes. This ensures that any calls are coming from you or those who have access permissions to your account. 

### How often do I need to get a new access token? When do access tokens expire?

Access tokens expire every hour, so you need to generate a new access token every hour. 

## Next steps

[Overview](video-indexer-overview.md)
