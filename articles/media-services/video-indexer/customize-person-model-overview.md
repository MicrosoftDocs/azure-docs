---
title: Customize a Person model in Video Indexer - Azure  
titlesuffix: Azure Media Services
description: This article gives an overview of what is a Person model in Video Indexer and how to customize it. 
services: media-services
author: anikaz
manager: johndeu

ms.service: media-services
ms.topic: article
ms.date: 12/05/2018
ms.author: anzaman
---

# Customize a Person model in Video Indexer


Video Indexer supports face detection and celebrity recognition for video content. The celebrity recognition feature covers approximately 1,000,000 faces based on commonly requested data source such as IMDB, Wikipedia, and top LinkedIn influencers. Faces that are not recognized by the celebrity recognition feature are detected; however, they are left unnamed. After you upload your video to Video Indexer and get results back, you can go back and name the faces that were not recognized. Once you label a face with a name, the face and name get added to your account's Person model. Video Indexer will then recognize this face in your future videos and past videos.

You can use the Video Indexer website or API to edit faces that were detected in a video in your account, as described in the following topics:

- [Customize Person model using APIs](customize-person-model-with-api.md)
- [Customize Person model using the website](customize-person-model-with-website.md)
