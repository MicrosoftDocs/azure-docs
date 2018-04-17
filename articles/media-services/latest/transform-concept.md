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

# Transforms and jobs

## Overview 

The latest version of the Azure Media Services REST API (v3) introduces a new templated encoding and video AI workflow resource called a **Transform**. **Transforms** can be used to configure common tasks for encoding or video AI extraction. Each **Transform** provides a simple workflow of tasks to be processed on your video or audio files. 

Jobs can now be submitted directly to a Transform with an input content located at: a HTTP(s) URL, SAS URL, S3 URL, or a path to files located in Azure Blob storage. The content can also be specified using [Google Cloud Storage signed URLs](https://cloud.google.com/storage/docs/access-control/signed-urls).

Notifications have also been enhanced to integrate directly with the Azure Event Grid notification system. Customers can easily subscribe to events on several resources in Azure Media Services, such as Job states and encoding progress. Since the new API is driven by Azure Resource Manager, customers can now use Resource Manager templates to create and deploy Transforms. 

Role-based access control can also be set at the resource level in the v3 API, allowing customers to lock down access to specific resources like Transforms.

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
