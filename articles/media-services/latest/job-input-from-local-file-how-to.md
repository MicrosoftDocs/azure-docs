---
title: Create an Azure Media Services Job input from a local file | Microsoft Docs
description: This topic shows how to create a job input from a local file.
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

# Create a job input from a local file

In Media Services v3, when you submit Jobs to process your videos, you have to tell Media Services where to find the input video. The input video can be stored as a Media Service Asset, in which case you create an input asset based on a file (stored locally or in Azure Blob storage). You can also specify an HTTPS URL (for example, a SAS URL) as a job input.

This topic shows how to create a job input from a local file. For a full example, see this [github sample](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/MediaServicesV3Tutorials/MediaServicesV3Tutorials/UploadEncodeAndStreamFiles/Program.cs).

```csharp
private static Job SubmitJob(IAzureMediaServicesClient client, string transformName, string jobName, string outputAssetName)
{
    string inputAssetName = Guid.NewGuid().ToString() + "-input";
    JobInput jobInput = new JobInputAsset(assetName: inputAssetName);

    CreateInputAsset(client, inputAssetName, "ignite.mp4")

    JobOutput[] jobOutputs =
    {
        new JobOutputAsset(outputAssetName),
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

private static Asset CreateInputAsset(IAzureMediaServicesClient client, string assetName, string fileToUpload)
{
    Asset asset = client.Assets.CreateOrUpdate(assetName, new Asset());

    ListContainerSasInput sasInput = new ListContainerSasInput()
    {
        Permissions = AssetContainerPermission.ReadWrite,
        ExpiryTime = DateTimeOffset.Now.AddHours(1)
    };

    var response = client.Assets.ListContainerSasAsync(assetName, sasInput).Result;

    string uploadSasUrl = response.AssetContainerSasUrls.First();

    string filename = Path.GetFileName(fileToUpload);
    var sasUri = new Uri(uploadSasUrl);
    CloudBlobContainer container = new CloudBlobContainer(sasUri);
    var blob = container.GetBlockBlobReference(filename);
    blob.UploadFromFile(fileToUpload);

    return asset;
}
```

## Next steps

[Create a job input from an HTTP(s) URL](job-input-from-http-how-to.md).
