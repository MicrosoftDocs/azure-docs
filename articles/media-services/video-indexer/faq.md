---
title: Frequently asked questions about Video Indexer - Azure
titlesuffix: Azure Media Services
description: Get answers to frequently asked questions about Video Indexer.
services: media-services
author: Juliako
manager: femila

ms.service: media-services
ms.topic: article
ms.date: 01/09/2019
ms.author: juliako
---

# Frequently asked questions

This article answers frequently asked questions about Video Indexer.

## General questions

### What is Video Indexer?

Video Indexer is an artificial intelligence service that is part of Microsoft Azure Media Services. Video Indexer provides an orchestration of multiple machine learning models that enable you to easily extract deep insight from a video. To provide advanced and accurate insights, Video Indexer makes use of multiple channels of the video: audio, speech, and visual. Video Indexer’s insights may be used in many ways, like improving content discoverability and accessibility, creating new monetization opportunities, or building new experiences that use the insights. Video Indexer provides a web-based interface for testing, configuration, and customization of models in your account. Developers can use a REST-based API to integrate Video Indexer into production system. 

### What can I do with Video Indexer?

Video Indexer can perform the following types of operations on media files:

* Identify and extract speech and identify speakers.
* Identify and extract on-screen text in a video.
* Identify and label objects in a video file.
* Identify brands like Microsoft from audio tracks and on-screen text in a video.
* Detect and recognize faces from a database of celebrities and a user-defined database of faces.
* Extract keywords from video and audio content based on spoken and visual text.
* Extract topics discussed but not necessarily explicitly mentioned in audio and video content based on spoken and visual text.
* Create closed captions or subtitles from the audio track.

For more information, see [Overview](video-indexer-overview.md).

### How do I get started with Video Indexer?

Video Indexer includes a free trial offering that provides you with 600 minutes in the web-based interface and 2,400 minutes via the API. You can [login to the Video Indexer web-based interface](https://www.videoindexer.ai/) and try it for yourself using any web identity and without having to set up an Azure Subscription. 

To index videos and audio flies at scale, you can connect Video Indexer to a paid Microsoft Azure subscription. You can find more information on pricing on the [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/video-indexer/) page.

You can find more information on getting started in [Get started](video-indexer-get-started.md).

### Do I need coding skills to use Video Indexer?

You can use the Video Indexer web-based interface to evaluate, configure, and manage your account with **no coding required**.  When you are ready to develop more complex applications, you can use the [Video Indexer API](https://api-portal.videoindexer.ai/) to integrate Video Indexer into your own applications, web sites, or [custom workflows using serverless technologies like Azure Logic Apps](https://azure.microsoft.com/blog/logic-apps-flow-connectors-will-make-automating-video-indexer-simpler-than-ever/) or Azure Functions.

### Do I need machine learning skills to use Video Indexer?

No, Video Indexer provides the integration of multiple machine learning models into one pipeline. Indexing a video or audio file via Video Indexer retrieves a full set of insights extracted on one shared timeline without any machine learning skills or knowledge on algorithms needed on the customer's part.

### What media formats does Video Indexer support?

Video Indexer supports most common media formats. Refer to the [Azure Media Encoder standard formats](https://docs.microsoft.com/azure/media-services/latest/media-encoder-standard-formats) list for more details.

### How to do I upload a media into Video Indexer?

In the Video Indexer web-based portal, you can upload a media file using the file upload dialog or by pointing to a URL that directly hosts the source file (see [example](https://nimbuscdn-nimbuspm.streaming.mediaservices.windows.net/2b533311-b215-4409-80af-529c3e853622/Ignite-short.mp4)). Any URL that hosts the media content using an iFrame or embed code will not work (see [example](https://www.videoindexer.ai/accounts/7e1282e8-083c-46ab-8c20-84cae3dc289d/videos/5cfa29e152/?t=4.11)). The Video Indexer API requires you to specify the input file via a URL or a byte array. Uploads via a URL using the API are limited to 10 GB, but do not have a time duration limit. For more information, please see this [how-to guide](https://docs.microsoft.com/azure/media-services/video-indexer/upload-index-videos).

### How long does it take Video Indexer to extract insights from media?

The amount of time it takes to index a video or audio file, both using the Video Indexer API and the Video Indexer web-based interface, depends on multiple parameters such as the file length and quality, the number of insights found in the file, the number of [reserved units](https://docs.microsoft.com/azure/media-services/previous/media-services-scale-media-processing-overview) available, and whether the [streaming endpoint](https://docs.microsoft.com/azure/media-services/previous/media-services-streaming-endpoints-overview) is enabled or not. For most content types, assuming that 10 reserved units of type S3 are enabled, we predict that indexing takes from 1/3 to ½ of the duration of the audio or video file (for example, a 10-minute source video takes 3.5 to 5 minutes). However, we recommend that you run a few test files with your own content and take an average to get a better idea.

### Can I create customized workflows to automate processes with Video Indexer?

Yes, you can integrate Video Indexer into serverless technologies like Logic Apps, Flow, and [Azure Functions](https://azure.microsoft.com/services/functions/). You can find more details on the [Logic App](https://azure.microsoft.com/services/logic-apps/) and [Flow](https://flow.microsoft.com/en-us/) connectors for Video Indexer [here](https://azure.microsoft.com/blog/logic-apps-flow-connectors-will-make-automating-video-indexer-simpler-than-ever/). 

### In which Azure regions is Video indexer available?

You can see which Azure regions Video Indexer is available on the [regions](https://azure.microsoft.com/global-infrastructure/services/?products=cognitive-services&regions=all) page.

### What is the SLA for Video Indexer?

Azure Media Service’s SLA covers Video Indexer and can be found on the [SLA](https://azure.microsoft.com/support/legal/sla/media-services/v1_2/) page. The SLA only applies to Video Indexer paid accounts and does not apply to the free trial.

## Privacy Questions

### Are video and audio files indexed by Video Indexer stored?

Yes, unless you delete the file from Video Indexer, either using the Video Indexer website or API, your video and audio files are stored. For the free trial, the video and audio files that you index are stored in the Azure region East US. Otherwise, your video and audio files are stored in the storage account of your Azure subscription.

### Can I delete my files that are stored in Video Indexer Portal?

Yes, you can always delete your video and audio files as well as any metadata and insights extracted from them by Video Indexer. Once you delete a file from Video Indexer, the file and its metadata and insights are permanently removed from Video Indexer. However, if you have implemented your own backup solution in Azure storage, the file remains in your Azure storage.

### Can I control user access to my Video Indexer account?

Yes, only account admins can invite and uninvite people to their accounts, as well as assign who has editing privileges and who has read-only access.

### Who has access to my video and audio files that have been indexed and/or stored by Video Indexer and the metadata and insights that were extracted?

Your video or audio content that have public as its privacy setting can be accessed by anyone who has the link to your video or audio content and its insights. Your video or audio content that have private as its privacy setting can only be accessed by users that were invited to the account of the video or audio content. The privacy setting of your content also applies to the metadata and insights that Video Indexer extracts. You assign the privacy setting when you upload your video or audio file. You can also change the privacy setting after indexing.

### What access does Microsoft have to my video or audio files that have been indexed and/or stored by Video Indexer and the metadata and insights that were extracted?

Per the [Azure Online Services Terms](http://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=31) (OST), you completely own your content, and Microsoft will only access your content and the metadata and insights that Video Indexer extracts from your content according to the OST and the Microsoft Privacy Statement.

### Is the content indexed by Video Indexer kept within the Azure region where I am using Video Indexer?

Yes, the content and its insights are kept within the Azure region unless you have a manual configuration in your Azure subscription that uses multiple Azure regions. 

### What is the Privacy policy for Video Indexer?

Video Indexer is covered by the [Microsoft Privacy Statement](https://privacy.microsoft.com/privacystatement). The privacy statement explains the personal data Microsoft processes, how Microsoft processes it, and for what purposes Microsoft processes it. To learn more about privacy, visit the [Microsoft Trust Center](https://www.microsoft.com/trustcenter).

### What certifications does Video Indexer have?

Video Indexer currently has the SOC certification. To review Video Indexer's certification, please refer to the [Microsoft Trust Center](https://www.microsoft.com/trustcenter/compliance/complianceofferings?product=Azure).

## API Questions

### What APIs does Video Indexer offer?

Video Indexer's APIs allows for indexing, extracting metadata, asset management, translation, embedding, customization of models and more. To find more detailed information on using the Video Indexer API, refer to the [Video Indexer Developer Portal](https://api-portal.videoindexer.ai/).

### What client SDKs does Video Indexer offer?

There are currently no client SDKs offered. The Video Indexer team is working on the SDKs and plans to deliver them soon.

### How do I get started with Video Indexer's API?

Follow [Tutorial: get started with the Video Indexer API](video-indexer-use-apis.md).

### What is the difference between the Video Indexer API and the Azure Media Service v3 API?

Currently there are some overlaps in features offered by the Video Indexer API and the Azure Media Service v3 API. You can find more information on how to compare both services [here](compare-video-indexer-with-media-services-presets.md).

### What is an API access token and why do I need it?

The Video Indexer API contains an Authorization API and an Operations API. The Authorizations API contains calls that give you access token. Each call to the Operations API should be associated with an access token, matching the authorization scope of the call.

Access tokens are needed to use the Video Indexer APIs for security purposes. This ensures that any calls are coming from you or those who have access permissions to your account. 

### What is the difference between Account access token, User access token, and Video access token?

* Account level – account level access tokens let you perform operations on the account level or the video level. For example, upload a video, list all videos, get video insights.
* User level - user level access tokens let you perform operations on the user level. For example, get associated accounts.
* Video level – video level access tokens let you perform operations on a specific video. For example, get video insights, download captions, get widgets, etc.

### How often do I need to get a new access token? When do access tokens expire?

Access tokens expire every hour, so you need to generate a new access token every hour. 

## Billing questions

### How much does Video Indexer cost?

Video Indexer uses a simple pay-as-you-go pricing model based on the duration of the content input that you index. Additional charges may apply for encoding, streaming, storage, network usage, and media reserved units. For more information, see the [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/video-indexer/) page.

### Does Video Indexer offer a free trial?

Yes, Video Indexer offers a free trial that gives full service and API functionality. There is a quota of 600 minutes worth of videos for web-based interface users and 2,400 minutes for API users. 

## Next steps

[Overview](video-indexer-overview.md)
