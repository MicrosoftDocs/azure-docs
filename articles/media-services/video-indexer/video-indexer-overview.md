---
title: What is Azure Media Services Video Indexer?
titleSuffix: Azure Media Services
description: This topic gives an overview of the Azure Media Services Video Indexer service.
services: media-services
author: Juliako
manager: femila

ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 09/23/2019
ms.author: juliako
---

# What is Video Indexer?

Video Indexer (VI) is the Azure Media Services AI solution and part of the Microsoft Cognitive Services brand. Video Indexer provides ability to extract deep insights (with no need for data analysis or coding skills) using machine learning models based on multiple channels (voice, vocals, visual). You can further customize and train the models. The service enables deep search, reduces operational costs, enables new monetization opportunities, new user experiences on large archives of videos (with low entry barriers). 

To start extracting insights with Video Indexer, you need to create an account and upload videos. When you upload your videos to Video Indexer, it analyses both visuals and audio by running different AI models. As Video Indexer analyzes your video, the insights that are extracted by the models.

The following diagram is an illustration and not a technical explanation of how Video Indexer works in the backend.

![Flow diagram](./media/video-indexer-overview/model-chart.png)

## What can I do with Video Indexer?

Video Indexer's insights can be applied to many scenarios, among them are:

* *Deep search* - use the insights extracted from the video to enhance the search experience across a video library. For example, indexing spoken words and faces can enable the search experience of finding moments in a video where a person spoke certain words or when two people were seen together. Search based on such insights from videos is applicable to news agencies, educational institutes, broadcasters, entertainment content owners, enterprise LOB apps and in general to any industry that has a video library that users need to search against.
* *Content creation*: create trailers, highlight reels, social media content or news clips based on the insights Video Indexer extracts from your content. Keyframes, scenes markers, and timestamps for the people and label appearances make the creation process much smoother and easier, and allows you to get right to the interesting parts of the video you need for the content you are creating.
* *Accessibility*: whether you want to make your content available for people with disabilities or if you want your content to be distributed to different regions using different languages, you can use the transcription and  translation provided by video indexer in multiple languages.
* *Monetization*: Video Indexer can help increase the value of videos. As an example, industries that rely on ad revenue (for example, news media, social media, etc.), can deliver relevant ads by using the extracted insights as additional signals to the ad server.
* *Content moderation*: use textual and visual content moderation models to keep your users safe from inappropriate content and validate that the content you publish matches your organization’s values. You can automatically block certain videos or alert your users regarding the content. 
* *Recommendations*: Video insights can be used to improve user engagement by highlighting the relevant video moments to users. By tagging each video with additional metadata, you can recommend users the most relevant videos and highlight the part of the video that will match their needs. 

## Features

Following is the list of insights you can retrieve from your videos using Video Indexer video and audio models:

### Video insights

* **Face detection**: Detects and groups faces appearing in the video.
* **Celebrity identification**: Video Indexer automatically identifies over 1 million celebrities – such as world leaders, actors, actresses, athletes, researchers, business, and tech leaders across the globe. The data about these celebrities can also be found on various famous websites, for example, IMDB and Wikipedia.
* **Account-based face identification**: Video Indexer trains a model for a specific account. It then recognizes faces in the video based on the trained model. For more information, see [Customize a Person model from the Video Indexer website](customize-person-model-with-website.md) and [Customize a Person model with the Video Indexer API](customize-person-model-with-api.md).
* **Thumbnail extraction for faces** ("best face"): Automatically identifies the best captured face in each group of faces (based on quality, size, and frontal position) and extract it as an image asset.
* **Visual text recognition** (OCR): Extracts text that is visually displayed in the video.
* **Visual content moderation**: Detects adult and/or racy visuals.
* **Labels identification**: Identifies visual objects and actions displayed.
* **Scene segmentation**: determines when a scene changes in video based on visual cues. A scene depicts a single event and it is composed by a series of consecutive shots, which are semantically related.
* **Shot detection**: determines when a shot changes in video based on visual cues. A shot is a series of frames taken from the same motion-picture camera. For more information, see Scenes, shots, and keyframes.
* **Black frame detection**: Identifies black frames presented in the video.
* **Keyframe extraction**: Detects stable keyframes in a video.
* **Rolling credits**: identify the beginning and end of the rolling credits in the end of TV shows and movies.
* **Animated characters detection** (preview): detection, grouping, and recognition of characters in animated content via integration with [Cognitive Services custom vision](https://azure.microsoft.com/services/cognitive-services/custom-vision-service/). For more information, see [Animated character detection](animated-characters-recognition.md).
* **Editorial shot type detection**: tagging shots based on their type (such as wide shot, medium shot, close up, extreme close up, two shot, multiple people, outdoor and indoor, etc.). For more information, see [Editorial shot type detection](scenes-shots-keyframes.md#editorial-shot-type-detection).

### Audio insights

* **Automatic language detection**: Automatically identifies the dominant spoken language. Supported languages include English, Spanish, French, German, Italian, Chinese (Simplified), Japanese, Russian, and Brazilian Portuguese. If the language cannot be identified with confidence, Video Indexer assumes the spoken language is English. For more information, see [Language identification model](language-identification-model.md).
* **Multi-language speech identification and transcription** (preview): Automatically identifies the spoken language in different segments from audio, sending each segment of the media file to be transcribed and combine the transcription back to one unified transcription. For more information, see [Automatically identify and transcribe multi-language content](multi-language-identification-transcription.md).
* **Audio transcription**: Converts speech to text in 12 languages and allows extensions. Supported languages include English, Spanish, French, German, Italian, Chinese (Simplified), Japanese, Arabic, Russian, Brazilian Portuguese, Hindi, and Korean.
* **Closed captioning**: Creates closed captioning in three formats: VTT, TTML, SRT.
* **Two channel processing**: Auto detects, separate transcript and merges to single timeline.
* **Noise reduction**: Clears up telephony audio or noisy recordings (based on Skype filters).
* **Transcript customization** (CRIS): Trains custom speech to text models to create industry-specific transcripts. For more information, see [Customize a Language model from the Video Indexer website](customize-language-model-with-website.md) and [Customize a Language model with the Video Indexer APIs](customize-language-model-with-api.md).
* **Speaker enumeration**: Maps and understands which speaker spoke which words and when.
* **Speaker statistics**: Provides statistics for speakers' speech ratios.
* **Textual content moderation**: Detects explicit text in the audio transcript.
* **Audio effects**: Identifies audio effects such as hand claps, speech, and silence.
* **Emotion detection**: Identifies emotions based on speech (what is being said) and voice tonality (how it is being said). The emotion could be joy, sadness, anger, or fear.
* **Translation**: Creates translations of the audio transcript to 54 different languages.

### Audio and video insights (multi channels)

When indexing by one channel partial result for those models will be available

* **Keywords extraction**: Extracts keywords from speech and visual text.
* **Named entities extraction**: Extracts brands, locations, and people from speech and visual text via natural language processing (NLP).
* **Topic inference**: Makes inference of main topics from transcripts. The 1st-level IPTC taxonomy is included.
* **Artifacts**: Extracts rich set of "next level of details" artifacts for each of the models.
* **Sentiment analysis**: Identifies positive, negative, and neutral sentiments from speech and visual text.

## How can I get started with Video Indexer?

You can access Video Indexer capabilities using three different ways: 

* Video Indexer portal - an easy to use solution that allows you to evaluate the product, manage the account and customize models. 

    For more information about the portal, see [Get started with the Video Indexer website](video-indexer-get-started.md).  
* API integration - all of Video Indexer’s capabilities are available through a REST API to allow you to integrate the solution into your applications and infrastructure. 

    To get started as a developer, see [Use Video Indexer REST API](video-indexer-use-apis.md). 
* Emendable widget - allows you to embed the video indexer insights, player, and editor experiences into your application. 

    For more information, see [Embed visual widgets in your application](video-indexer-embed-widgets.md). 

If you are using the website, the insights are added as metadata and visible in the portal. If you are using APIs, the insights are available as a JSON file. 

## Next steps

You're ready to get started with Video Indexer. For more information, see the following articles:

- [Get started with the Video Indexer website](video-indexer-get-started.md)
- [Process content with Video Indexer REST API](video-indexer-use-apis.md)
- [Embed visual widgets in your application](video-indexer-embed-widgets.md)
