---
title: Customize a Person model in Video Indexer - Azure  
titleSuffix: Azure Media Services
description: This article gives an overview of what is a Person model in Video Indexer and how to customize it. 
services: media-services
author: anikaz
manager: johndeu
 
ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 05/15/2019
ms.author: anzaman
---

# Customize a Person model in Video Indexer

Video Indexer supports celebrity recognition in your videos. The celebrity recognition feature covers approximately one million faces based on commonly requested data source such as IMDB, Wikipedia, and top LinkedIn influencers. Faces that are not recognized by Video Indexer are still detected but are left unnamed. Customers can build custom Person models and enable Video Indexer to recognize faces that are not recognized by default. Customers can build these Person models by pairing a person's name with image files of the person's face.  

If your account caters to different use-cases, you can benefit from being able to create multiple Person models per account. For example, if the content in your account is meant to be sorted into different channels, you might want to create a separate Person model for each channel. 

> [!NOTE]
> Each Person model supports up to 1 million people and each account has a limit of 50 Person models. 

Once a model is created, you can use it by providing the model ID of a specific Person model when uploading/indexing or reindexing a video. Training a new face for a video, updates the specific custom model that the video was associated with. 

If you do not need the multiple Person model support, do not assign a Person model ID to your video when uploading/indexing or reindexing. In this case, Video Indexer will use the default Person model in your account. 

You can use the Video Indexer website to edit faces that were detected in a video and to manage multiple custom Person models in your account, as described in the [Customize a Person model using a website](customize-person-model-with-website.md) topic. You can also use the API, as described in [Customize a Person model using APIs](customize-person-model-with-api.md).
