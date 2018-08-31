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

## Transform definition

The following table shows Transform's properties and gives their definitions.

|Name|Type|Description|
|---|---|---|
|Id|string|Fully qualified resource ID for the resource.|
|name|string|The name of the resource.|
|properties.created |string|The UTC date and time when the Transform was created, in 'YYYY-MM-DDThh:mm:ssZ' format.|
|properties.description |string|An optional verbose description of the Transform.|
|properties.lastModified |string|The UTC date and time when the Transform was last updated, in 'YYYY-MM-DDThh:mm:ssZ' format.|
|properties.outputs |TransformOutput[]|An array of one or more TransformOutputs that the Transform should generate.|
|type|string|The type of the resource.|

For the full definition, see [Transforms](https://docs.microsoft.com/rest/api/media/transforms).

## Job definition

The following table shows Job's properties and gives their definitions.

|Name|Type|Description|
|---|---|---|
|Id|string|Fully qualified resource ID for the resource.|
|name|string|The name of the resource.|
|properties.created |string|The UTC date and time when the Transform was created, in 'YYYY-MM-DDThh:mm:ssZ' format.|
|properties.description |string|An optional verbose description of the Job.|
|properties.lastModified |string|The UTC date and time when the Transform was last updated, in 'YYYY-MM-DDThh:mm:ssZ' format.|
|properties.outputs |JobOutput[]:JobOutputAsset[] |The outputs for the Job.|
|properties.priority |Priority |Priority with which the job should be processed. Higher priority jobs are processed before lower priority jobs. If not set, the default is normal.
|properties.state |JobState |The current state of the job.
|type|string|The type of the resource.|

For the full definition, see [Jobs](https://docs.microsoft.com/rest/api/media/jobs).

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
