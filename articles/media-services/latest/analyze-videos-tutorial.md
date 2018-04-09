---
title: Analyze videos with Azure Media Services and Video Indexer | Microsoft Docs
description: Follow the steps of this tutorial to analyze videos using Azure Video Indexer.
services: media-services
documentationcenter: ''
author: Juliako
manager: cflower
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: tutorial
ms.custom: mvc
ms.date: 03/19/2018
ms.author: juliako
---

# Tutorial: Analyze videos with Azure Media Services and Video Indexer 

> [!NOTE]
> The latest version of Azure Media Services (2018-03-30) is in preview. This version is also called v3.

This tutorial shows you how to analyze video files. Some scenarios where you might want to do it:

* Analyze audio from call centers. Embedded in the audio data is a large amount of customer information that can be analyzed to achieve higher customer satisfaction. Organizations can extract speech-to-text and build search indexes and dashboards. Then they can extract intelligence around common complaints, sources of complaints, and other relevant data.
* Analyze surveillance video. Manually reviewing surveillance video is time intensive and prone to human error. You can utilize services such as motion detection and face detection to make the process of reviewing, managing, and creating derivatives easier.

This tutorial examines a .NET code sample that is located on GitHub, so you are first offered to clone the sample repository. 

The article explains the following tasks that are part of the code sample:  

> [!div class="checklist"]
> * Create an input asset based on a local file
> * Create an output asset to store the results of the job
> * Create a transform and a job that encodes the specified file
> * Wait for the job to complete
> * Download the result to your local folder

## Prerequisites

+ An active [GitHub](https://github.com) account. 
+ Visual Studio. The example described in this quickstart uses Visual Studio 2017. 

    If you do not have Visual Studio installed, you can get [Visual Studio Community 2017, Visual Studio Professional 2017, or Visual Studio Enterprise 2017](https://www.visualstudio.com/downloads/).
+ An Azure Media Services account. See the steps described in [Create a Media Services account](create-account-cli-quickstart.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Clone the sample application

First, let's clone the [StreamAndEncodeFiles](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials) app from GitHub. Visual Studio 2017 was used to create the sample.

1. Open a git terminal window, such as git bash, and `CD` to a working directory.  
2. Run the following command to clone the sample repository. 

    ```bash
    git clone https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts.git
    ```
3. Open the solution file in Visual Studio. 

    The project that is discussed in this article is called **EncodeAndStreamFiles**.
4. Build the solution. 
4. To run the app and access the Media Services APIs, you need to specify the correct values in App.config. 
    
    To get the values, see [Accessing APIs](access-api-cli-how-to.md).

## Create an input asset based on a local file

In this example, you are creating an input asset based on a local video file. If you want to see how to encode a file based on an HTTPS URL, see [Stream a file](stream-files-dotnet-quickstart.md).

The following function performs the following actions:

-	Creates the Asset
-	Gets a SAS URL
-	Uploads the file to Blob storage using the SAS URL

```csharp
private static Asset CreateInputAsset(IAzureMediaServicesClient client, string assetName, string fileToUpload)
{
    Asset asset = client.Assets.CreateOrUpdate(assetName, new Asset());

    var sasUrls = client.Assets.ListContainerSas(assetName, new ListContainerSasInput
    {
        Permissions = AssetContainerPermission.ReadWrite,
        ExpiryTime = DateTimeOffset.Now.AddHours(1)
    });

    var sasUri = new Uri(response.AssetContainerSasUrls.First());
    var container = new CloudBlobContainer(sasUri);
    var blob = container.GetBlockBlobReference(Path.GetFileName(fileToUpload));
    blob.UploadFromFile(fileToUpload);

    return asset;
}
```

## Create an output asset to store the results of the job


```csharp
private static Asset CreateOutputAsset(IAzureMediaServicesClient client, string assetName)
{
    return client.Assets.CreateOrUpdate(assetName, new Asset());
}
```

## Create a transform

For more information, see [Transforms and jobs](transform-concept.md).

## Create and submit a job that encodes the specified file

```csharp
private static Job SubmitJob(IAzureMediaServicesClient client, string transformName, string jobName)
{
    Asset outputAsset = client.Assets.CreateOrUpdate(Guid.NewGuid().ToString() + "-output", new Asset());

    JobInputHttp jobInput = new JobInputHttp(files: new[] { "https://nimbuscdn-nimbuspm.streaming.mediaservices.windows.net/2b533311-b215-4409-80af-529c3e853622/Ignite-short.mp4" });

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


## Wait for the job to complete

```csharp
private static Job WaitForJobToFinish(IAzureMediaServicesClient client, string transformName, string jobName)
{
    double TimeoutSeconds = 10 * 60;
    int SleepInterval = 15 * 1000;

    Job job = null;
    bool exit = false;
    DateTime timeout = DateTime.Now.AddSeconds(TimeoutSeconds);

    do
    {
        job = client.Jobs.Get(transformName, jobName);

        if (job.State == JobState.Finished || job.State == JobState.Error || job.State == JobState.Canceled)
        {
            exit = true;
        }
        else if (DateTime.Now >= timeout)
        {
            Console.WriteLine($"Job {job.Name} timed out.");
        }
        else
        {
            System.Threading.Thread.Sleep(SleepInterval);
        }

        Console.WriteLine("Job state: {0}", job.State);
    }
    while (!exit);

    return job;
}
```

## Download the result to your local folder

``` csharp
private static void DownloadResults(IAzureMediaServicesClient client, string assetName, string resultsFolder)
{
    ListContainerSasInput parameters = new ListContainerSasInput(permissions: AssetContainerPermission.Read, expiryTime: DateTimeOffset.UtcNow.AddHours(1));
    AssetContainerSas assetContainerSas = client.Assets.ListContainerSas(assetName, parameters);

    Uri containerSasUrl = new Uri (assetContainerSas.AssetContainerSasUrls.FirstOrDefault());
    CloudBlobContainer container = new CloudBlobContainer(containerSasUrl);

    string directory = Path.Combine(resultsFolder, assetName);
    Directory.CreateDirectory(directory);

    Console.WriteLine("Downloading results to {0}.", directory);

    foreach (IListBlobItem blobItem in container.ListBlobs(null, true, BlobListingDetails.None))
    {
        if (blobItem is CloudBlockBlob)
        {
            CloudBlockBlob blob = blobItem as CloudBlockBlob;
            string filename = Path.Combine(directory, blob.Name);

            blob.DownloadToFile(filename, FileMode.Create);
        }
    }

    Console.WriteLine("Download complete.");
}
```

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: upload, encode, and stream files](stream-files-tutorial-with-api.md)
