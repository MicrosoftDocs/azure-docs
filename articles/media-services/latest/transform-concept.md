---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Transforms and Jobs in Azure Media Services | Microsoft Docs
description: When using Media Services, you need to create a Transform to describe the rules or specifications for processing your videos. This article gives an overview of what Transform is and how to use it. 
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 03/19/2018
ms.author: juliako
---

# Transforms and Jobs

## Overview 

The latest version of the Azure Media Services REST API (v3) introduces a new templated workflow resource for encoding and/or analyzing videos, called a **Transform**. **Transforms** can be used to configure common tasks for encoding or analying videos. Each **Transform** describes a simple workflow of tasks for processing your video or audio files. 

The **Transform** object is the recipe and a **Job** is the actual request to Azure Media Services to apply that **Transform** to a given input video or audio content. The **Job** specifies information like the location of the input video, and the location for the output. You can specify the location of your video using: HTTP(s) URLs, SAS URLs, or a path to files located locally or in Azure Blob storage. You can have up to 100 Transforms in your Azure Media Services account, and submit Jobs under those Transforms. You can then subscribe to events such as Job state changes, using Notifications, which integrate directly with the Azure Event Grid notification system. 

Since this API is driven by Azure Resource Manager, you can use Resource Manager templates to create and deploy Transforms in your Media Services account. Role-based access control can also be set at the resource level in this API, allowing you to lock down access to specific resources like Transforms.

## Typical workflow and example

1. Create a Transform 
2. Submit Jobs under that Transform 
3. List Transforms 
4. Delete a Transform, if you are not planning to use this "recipe" in the future. 

Suppose you wanted to extract the first frame of all your videos as a thumbnail image – the steps you would take are: 

1. Define the rule for processing – for example, use the first frame of the video as the thumbnail 
2. Then, for each video you have as input to the service, you would tell the service: 
    1. Where to find that video, and 
    2. Where to write the output – for example, the thumbnail image 

## Next steps

> [!div class="nextstepaction"]
> [Stream video files](stream-files-dotnet-quickstart.md)
