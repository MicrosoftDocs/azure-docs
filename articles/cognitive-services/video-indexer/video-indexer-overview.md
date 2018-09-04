---
title: Azure Video Indexer overview | Microsoft Docs
description: This topic gives an overview of the Video Indexer service.
services: cognitive services
documentationcenter: ''
author: juliako
manager: erikre

ms.service: cognitive-services
ms.component: video-indexer
ms.topic: overview
ms.date: 09/04/2018
ms.author: nolachar

---
# What is Microsoft Azure Video Indexer?

Microsoft Azure Video Indexer is a cloud application built using Azure artificial intelligence technologies. Video Indexer is comprised of models that enable Video Indexer to perform tasks described below: 

- **Automatic language detection**:	Automatically identifies the dominant spoken language. 
- **Audio transcription**: Converts speech to text in 10 languages and allow extensions.
- **Closed captioning**: Creates closed captioning in three formats: vtt, ttml, srt.
- **Two channel processing**: Auto detects, separate transcript and merges to single timeline.
- **Noise reduction**:	Clears up telephony audio or noisy recordings (based on Skype filters).
- **Transcript customization (CRIS)**: Trains and executes extended custom speech to text models to create industry-specific transcripts.
- **Speaker enumeration**:	Maps and understands which speaker spoke which words and when.
- **Speaker statistics**: Provides Statistics for speakers speech ratios.
- **Visual text recognition (OCR)**: Extracts text that is visually displayed in the video.
- **Keyframe extraction**: Detects stable keyframes in a video.
- **Sentiment analysis**: Identifies positive, negative, and neutral sentiments from Speech and visual text.
- **Visual content moderation**: Detects adult and/or racy visuals.
- **Keywords extraction**: Extracts keywords from speech and  visual text.
- **Labels identification**: Identifies visual objects and actions displayed.
- **Brands extraction**: Extracts brands from  speech and visual text.
- **Face detection**: Detects and groups faces appearing in the video.
- **Thumbnail extraction for faces ("best face")**:	Automatically identifies the best captured face in each group of faces (based on quality, size, and frontal position) and extract it as an image asset.
- **Celebrity identification**: Recognizes celebrities in the video based on a database of 1M celebrities, sourced from IMDB, Wikipedia, and top Linkedin influencers.
- **Custom face identification**: Recognizes faces in the video based on a custom model trained for the specific account.
- **Textual content moderation**: Detects explicit text in the audio transcript.
- **Shot detection**: Determines when a scene changes in the video.
- **Black frame detection**: Identifies black frames presented in the video.
- **Audio effects**: Identifies audio effects such as hand claps, speech, and silence.
- **Article inferencing**: Makes inference of the main topics from speech and visual text, based on several sources including IPTC taxonomy.
- **Emotion detection**: Identifies emotion moment based on speech and audio cues. The emotion could be: joy, sadness, anger, or fear.
- **Artifacts**: Extracts rich set of "next level of details" artifacts for each of the models.
- **Translation**: Creates translations of the audio transcript to 54 different languages.

Once Video Indexer is done processing and analyzing, you can review, curate, search, and publish the video insights.

Whether your role is a content manager or a developer, the Video Indexer service is able to address your needs. Content managers can use the Video Indexer web portal to consume the service without writing a single line of code, see [Get started using the Video Indexer portal](video-indexer-get-started.md). Developers can take advantage of APIs to process content at scale, see [Use Video Indexer REST API](video-indexer-use-apis.md). The service also enables customers to use widgets to publish video streams and extracted insights in their own applications, see [Embed visual widgets in your application](video-indexer-embed-widgets.md).

You can sign up for the service using existing AAD, LinkedIn, Facebook, Google, or MSA account. For more information, see [getting started](video-indexer-get-started.md).

## Scenarios

Below are a few scenarios where Video Indexer can be useful

- Search – Insights extracted from the video can be used to enhance the search experience across a video library. For example, indexing spoken words and faces can enable the search experience of finding moments in a video where a particular person spoke certain words or when two people were seen together. Search based on such insights from videos is applicable to news agencies, educational institutes, broadcasters, entertainment content owners, enterprise LOB apps and in general to any industry that has a video library that users need to search against.

- Monetization – Video Indexer can help improve the value of videos. As an example, industries that rely on ad revenue (for example, news media, social media, etc.), can deliver more relevant ads by using the extracted insights as additional signals to the ad server (presenting a sports shoe ad is more relevant in the middle of a football match vs. a swimming competition).

- User engagement – Video insights can be used to improve user engagement by positioning the relevant video moments to users. As an example, consider an educational video that explains spheres for the first 30 minutes and pyramids in the next 30 minutes. A student reading about pyramids would benefit more if the video is positioned starting from the 30-minute marker.

For more information, see this [blog](http://aka.ms/videoindexerblog).

## Next steps

You're ready to get started with Video Indexer. For more information, see the following articles:

- [Get started with the Video Indexer portal](video-indexer-get-started.md)
- [Process content with Video Indexer REST API](video-indexer-use-apis.md)
- [Embed visual widgets in your application](video-indexer-embed-widgets.md)
