---
title: What is Video Indexer?
titlesuffix: Azure Media Services
description: This topic gives an overview of the Video Indexer service.
services: media-services
author: Juliako
manager: femila

ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 05/15/2019
ms.author: juliako
---

# What is Video Indexer?

Azure Video Indexer is a cloud application built on Azure Media Analytics, Azure Search, Cognitive Services (such as the Face API, Microsoft Translator, the Computer Vision API, and Custom Speech Service). It enables you to extract the insights from your videos using Video Indexer video and audio models described below:
  
## Video insights

- **Face detection**: Detects and groups faces appearing in the video.
- **Celebrity identification**: Video Indexer automatically identifies over 1 million celebrities – such as world leaders, actors, actresses, athletes, researchers, business, and tech leaders across the globe. The data about these celebrities can also be found on various famous websites, for example, IMDB and Wikipedia.
- **Account-based face identification**: Video Indexer trains a model for a specific account. It then recognizes faces in the video based on the trained model. For more information, see [Customize a Person model from the Video Indexer website](customize-person-model-with-website.md) and [Customize a Person model with the Video Indexer API](customize-person-model-with-api.md).
- **Thumbnail extraction for faces** ("best face"): Automatically identifies the best captured face in each group of faces (based on quality, size, and frontal position) and extract it as an image asset.
- **Visual text recognition** (OCR): Extracts text that is visually displayed in the video.
- **Visual content moderation**: Detects adult and/or racy visuals.
- **Labels identification**: Identifies visual objects and actions displayed.
- **Scene segmentation**: determines when a scene changes in video based on visual cues. A scene depicts a single event and it is composed by a series of consecutive shots, which are semantically related. 
- **Shot detection**: determines when a shot changes in video based on visual cues. A shot is a series of frames taken from the same motion-picture camera. For more information, see [Scenes, shots, and keyframes](scenes-shots-keyframes.md).
- **Black frame detection**: Identifies black frames presented in the video.
- **Keyframe extraction**: Detects stable keyframes in a video.
- **Rolling credits**: identify the beginning and end of the rolling credits in the end of TV shows and movies.

## Audio insights

- **Automatic language detection**: Automatically identifies the dominant spoken language. Supported languages include English, Spanish, French, German, Italian, Chinese (Simplified), Japanese, Russian, and Brazilian Portuguese Will fallback to English when the language can't be detected.
- **Audio transcription**: Converts speech to text in 12 languages and allows extensions. Supported languages include English, Spanish, French, German, Italian, Chinese (Simplified), Japanese, Arabic, Russian, Brazilian Portuguese, Hindi, and Korean.
- **Closed captioning**: Creates closed captioning in three formats: VTT, TTML, SRT.
- **Two channel processing**: Auto detects, separate transcript and merges to single timeline.
- **Noise reduction**: Clears up telephony audio or noisy recordings (based on Skype filters).
- **Transcript customization** (CRIS): Trains custom speech to text models to create industry-specific transcripts. For more information, see [Customize a Language model from the Video Indexer website](customize-language-model-with-website.md) and [Customize a Language model with the Video Indexer APIs](customize-language-model-with-api.md).
- **Speaker enumeration**: Maps and understands which speaker spoke which words and when.
- **Speaker statistics**: Provides statistics for speakers speech ratios.
- **Textual content moderation**: Detects explicit text in the audio transcript.
- **Audio effects**: Identifies audio effects such as hand claps, speech, and silence.
- **Emotion detection**: Identifies emotions based on speech (what is being said) and voice tonality (how it is being said).  The emotion could be: joy, sadness, anger, or fear.
- **Translation**: Creates translations of the audio transcript to 54 different languages.

## Audio and video insights (multi channels)

When indexing by one channel partial result for those models will be available

- **Keywords extraction**: Extracts keywords from speech and visual text.
- **Brands extraction**: Extracts brands from speech and visual text.
- **Topic inference**: Makes inference of main topics from transcripts. The 1st-level IPTC taxonomy is included.
- **Artifacts**: Extracts rich set of "next level of details" artifacts for each of the models.
- **Sentiment analysis**: Identifies positive, negative, and neutral sentiments from speech and visual text.
 
Once Video Indexer is done processing and analyzing, you can review, curate, search, and publish the video insights.

Whether your role is a content manager or a developer, the Video Indexer service is able to address your needs. Content managers can use the Video Indexer web portal to consume the service without writing a single line of code, see [Get started with the Video Indexer website](video-indexer-get-started.md). Developers can take advantage of APIs to process content at scale, see [Use Video Indexer REST API](video-indexer-use-apis.md). The service also enables customers to use widgets to publish video streams and extracted insights in their own applications, see [Embed visual widgets in your application](video-indexer-embed-widgets.md).

You can sign up for the service using existing AAD, LinkedIn, Facebook, Google, or MSA account. For more information, see [getting started](video-indexer-get-started.md).

## Scenarios

Below are a few scenarios where Video Indexer can be useful

- Search – Insights extracted from the video can be used to enhance the search experience across a video library. For example, indexing spoken words and faces can enable the search experience of finding moments in a video where a particular person spoke certain words or when two people were seen together. Search based on such insights from videos is applicable to news agencies, educational institutes, broadcasters, entertainment content owners, enterprise LOB apps and in general to any industry that has a video library that users need to search against.
- Content creation – insights extracted from videos and help effectively create content such as trailers, social media content, news clips etc. from existing content in the organization archive 
- Monetization – Video Indexer can help improve the value of videos. As an example, industries that rely on ad revenue (for example, news media, social media, etc.), can deliver more relevant ads by using the extracted insights as additional signals to the ad server (presenting a sports shoe ad is more relevant in the middle of a football match vs. a swimming competition).
- User engagement – Video insights can be used to improve user engagement by positioning the relevant video moments to users. As an example, consider an educational video that explains spheres for the first 30 minutes and pyramids in the next 30 minutes. A student reading about pyramids would benefit more if the video is positioned starting from the 30-minute marker.

## Next steps

You're ready to get started with Video Indexer. For more information, see the following articles:

- [Get started with the Video Indexer website](video-indexer-get-started.md)
- [Process content with Video Indexer REST API](video-indexer-use-apis.md)
- [Embed visual widgets in your application](video-indexer-embed-widgets.md)
