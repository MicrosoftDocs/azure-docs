---
title: Create an Azure Media Services Job input from an HTTP(s) URL | Microsoft Docs
description: This topic shows how to create a job input from an HTTP(s) URL.
services: media-services
documentationcenter: ''
author: Juliako
manager: cflower
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 03/19/2018
ms.author: juliako
---

# Create a job input from an HTTP(s) URL

In Media Services v3, when you submit Jobs to process your videos, you have to tell Media Services where to find the input video. The input video can be stored as a Media Service Asset, in which case you create an input asset based on a file (stored locally or in Azure Blob storage). You can also specify an HTTPS URL (for example, a SAS URL) as a job input.

This topic shows how to create a job with an HTTPS URL input. For a full example, see this [github sample](https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts/blob/master/MediaServicesV3Quickstarts/MediaServicesV3Quickstarts/EncodeAndStreamFiles/Program.cs).

```csharp
private static Job SubmitJob(IAzureMediaServicesClient client, string transformName, string jobName)
{
    Asset outputAsset = client.Assets.CreateOrUpdate(Guid.NewGuid().ToString() + "-output", new Asset());

    JobInputHttp jobInput = 
        new JobInputHttp(files: new[] { "https://nimbuscdn-nimbuspm.streaming.mediaservices.windows.net/2b533311-b215-4409-80af-529c3e853622/Ignite-short.mp4" });

    JobOutput[] jobOutputs =
    {
        new JobOutputAsset(outputAsset.Name),
    };

    Job job = client.Jobs.CreateOrUpdate(
        transformName,
        jobName,
        new Job
        {
            Input = jobInput,
            Outputs = jobOutputs,
        });

    return job;
}
```

## Next steps

[Create a job input from a local file](job-input-from-local-file-how-to.md).
