---
title: Azure Video Indexer overview | Microsoft Docs
description: This topic gives an overview of the Video Indexer service.
services: cognitive services
documentationcenter: ''
author: juliako
manager: erikre

ms.service: video-indexer
ms.topic: article
ms.date: 05/07/2017
ms.author: juliako;

---
# Video Indexer (preview)

Video Indexer is a cloud service that enables you to extract the following insights from your videos using artificial intelligence technologies:

- **Audio Transcription**: Video Indexer has speech-to-text functionality, which enables customers to get a transcript of the spoken words. Supported languages include English, Spanish, French, German, Italian, Chinese (Simplified), Portuguese (Brazilian), Japanese and Russian (with many more to come in the future). 
- **Face tracking and identification**: Face technologies enable detection of faces in a video. The detected faces are matched against a celebrity database to evaluate which celebrities are present in the video. Customers can also label faces that do not match a celebrity. Video Indexer builds a face model based on those labels and can recognize those faces in videos submitted in the future.
- **Speaker indexing**: Video Indexer has the ability to map and understand which speaker spoke which words and when.
- **Visual text recognition**: With this technology, Video Indexer service extracts text that is displayed in the videos.  
- **Voice activity detection**: This enables Video Indexer to separate background noise and voice activity. 
- **Scene detection**: Video Indexer has the ability to perform visual analysis on the video to determine when a scene changes in a video.
- **Keyframe extraction**: Video Indexer automatically detects keyframes in a video. 
- **Sentiment analysis**: Video Indexer performs sentiment analysis on the text extracted using speech-to-text and optical character recognition, and provide that information in the form of positive, negative of neutral sentiments, along with timecodes.
- **Translation**: Video Indexer has the ability to translate the audio transcript from one language to another. The following languages are supported: English, Spanish, French, German, Italian, Chinese-Simplified, Portuguese-Brazilian, Japanese, and Russian. Once translated, the user can even get captioning in the video player in other languages.
- **Visual content moderation**: This technology enables detection of adult and/or racy material present in the video and can be used for content filtering. 
- **Keywords extraction**: Video Indexer extracts keywords based on the transcript of the spoken words and text recognized by visual text recognizer.
- **Annotation**: Video Indexer annotates the video based on a pre-defined model of 2000 objects.

Once Video Indexer is done processing and analyzing, you can review, curate, and publish the video insights.

Whether your role is a content manager or a developer, the Video Indexer service is able to address your needs. Content managers can use the Video Indexer web portal to consume the service without writing a single line of code, see [Get started using the Video Indexer portal](video-indexer-get-started.md). Developers can take advantage of APIs to process content at scale, see [Use Video Indexer REST API](video-indexer-use-apis.md). The service also enables customers to use widgets to publish video streams and extracted insights in their own applications, see [Embed visual widgets in your application](video-indexer-embed-widgets.md).

You can sign up for the service using existing AAD, LinkedIn, Facebook, Google, or MSA account. For more information, see the [getting started](video-indexer-get-started.md) topic.

## Scenarios

Below are a few scenarios where Video Indexer can be very useful

* Search – Insights extracted from the video can be used to enhance the search experience across a video library. For example, indexing spoken words and faces can enable the search experience of finding moments in a video where a particular person spoke certain words or when two people were seen together. Search based on such insights from videos is applicable to news agencies, educational institutes, broadcasters, entertainment content owners, enterprise LOB apps and in general to any industry that has a video library that users need to search against.

* Monetization – Video Indexer can help improve the value of videos. As an example, industries that rely on ad revenue (for example, news media, social media, etc.), can deliver more relevant ads by using the extracted insights as additional signals to the ad server (presenting a sports shoe ad is more relevant in the middle of a football match vs. a swimming competition).

* User engagement – Video insights can be used to improve user engagement by positioning the relevant video moments to users. As an example, consider an educational video that explains spheres for the first 30 minutes and pyramids in the next 30 minutes. A student reading about pyramids would benefit more if the video is positioned starting from the 30-minute marker.

For more information, see [this blog](http://aka.ms/videoindexerblog).

## Next steps

You are ready to get started with Video Indexer. For more information, see the following articles:

- [Get started with the Video Indexer portal](video-indexer-get-started.md)
- [Process content with Video Indexer REST API](video-indexer-use-apis.md)
- [Embed visual widgets in your application](video-indexer-embed-widgets.md)

 
