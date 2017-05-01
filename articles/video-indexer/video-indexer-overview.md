---
title: Azure Video Indexer overview | Microsoft Docs
description: This topic gives an overview of the Video Indexer service.
services: cognitive services
documentationcenter: ''
author: juliako
manager: erikre

ms.service: video-indexer
ms.topic: article
ms.date: 05/01/2017
ms.author: juliako;

---
# Video Indexer (preview)

Video Indexer is an Azure service that processes and extracts the following insights from video files that were uploaded into Video Indexer gallery:

- **Face detection and identification**: finds, identifies, and tracks human faces within a video. 
- **OCR (optical character recognition)**: extracts text content from videos and generates searchable digital text.
- **Transcript**: converts audio to text based on specified language.
- **Differentiation of speakers**: maps and understands each speaker and identifies when each speaker is present in the video.  
- **Voice/sound detection**: separates background noise/voice activity from silence. 
- **Sentiment analysis**: performs analysis based on multiple emotional attributes. Currently, Positive, Neutral, Negative options are supported. 

Once Video Indexer is done processing and analyzing, you can review, curate, and publish cognitive insights.

For more information, see the [Video Indexer announcement](https://aka.ms/videoindexerblog) blog.

Whether your role is a content manager or a developer, the Video Indexer service is able to address your needs. Content managers can use the Video Indexer web portal to consume the service without writing a single line of code, see [Get started using the Video Indexer portal](video-indexer-get-started.md). Developers can take advantage of APIs to process content at scale, see [Use Video Indexer REST API](video-indexer-use-apis.md). The service also enables customers to use widgets to publish video streams and extracted insights in their own applications, see [Embed visual widgets in your application](video-indexer-embed-widgets.md).

You can sign up for the service using existing AAD, LinkedIn, Facebook, Google, or MSA account. For more information, see the [getting started](video-indexer-get-started.md) topic.

## Scenarios

Below are a few scenarios where Video Indexer can be very useful

* Deep Search – Metadata extracted from the video can be used to enhance the search experience across a video library. For example, indexing spoken words and faces can enable the search experience of finding points in a video where a particular person spoke certain words or when two people were seen together. Deep Search use case is applicable to news agencies, educational institutes, broadcasters, entertainment content owners, enterprise LOB apps and in general to any industry that has a video library that users need to search against.

* Targeted Advertising – For industries that rely on ad revenue (for example, news media, social media, etc.), the quality of the ads that are presented in the middle of a video can be improved by using the extracted metadata as additional signals to the ad server. As an example, presenting a sports shoe ad is more relevant in the middle of a sports event vs. a political debate.

* Video Recommendation – Extracted metadata from media can be used to improve the video recommendation models, to create a more sticky experience for consumers. This use case applies to educational organizations, news media, broadcast media, entertainment content providers and in general anyone who is in the business of content distribution with video as an element.

* Content Analytics – With the advancements in machine learning, many content distributors are investing in analytics to better understand content consumption patterns from their users. By using the metadata extracted from videos, additional insights can be gained in to user behavior and those insights can be used to power prediction models that help shape business decisions.

* Hyper Personalization – For customers in the business of providing a video subscription service to their consumers, information about spoken words and faces, combined with user preferences can help provide a more personalized experience. As an example, if a user is family man and pauses a movie, a screen could be presented that provides some information about the actors, along with other movies of that actor in the family genre (vs. action genre).

* Accessibility

## Next steps

You are ready to get started with Video Indexer. For more information, see the following articles:

- [Get started with the Video Indexer portal](video-indexer-get-started.md)
- [Process content with Video Indexer REST API](video-indexer-use-apis.md)
- [Embed visual widgets in your application](video-indexer-embed-widgets.md)

For more information, see the [Video Indexer announcement](https://aka.ms/videoindexerblog) blog.
