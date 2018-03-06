---
title: Upload, encode, stream using Azure Media Services | Microsoft Docs
description: Follow the steps of this tutorial to upload a file and encode the video with Azure Media Services.
services: media-services
documentationcenter: ''
author: juliako
manager: cflower
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: tutorial
ms.custom: mvc
ms.date: 02/15/2018
ms.author: juliako
---

# Tutorial: Upload, encode, download, and stream videos

This tutorial shows tasks that are common in the following scenarios:

* Delivering adaptive bitrate encoded content in HLS, MPEG DASH, and Smooth Streaming formats so it can be played on a wide variety of browsers and devices.
* Adding subtitles and captions to videos to cater to a broader audience. 
* Delivering offline content for playback on airplanes, trains, and automobiles. 

To accomplish the above scenarios, you need to perform the following tasks, described in this tutorial.

> [!div class="checklist"]
> * Create a new Azure Media Services account
> * Create an input asset based on a local file
> * Create an output asset to store the results of the job
> * Create a transform and a job that encodes the specified file
> * Add subtitles
> * Wait for the job to complete
> * Download the result to your local folder
> * Get the streaming URL
> * Test the stream in Azure Media Player
> * Clean up resources

## Prerequisites

* Setup your development environment.
* Have an mp4 file that you want to upload, encode, and stream.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Download the complete code sample

You can find the complete code sample that is described in this article at [this location](https://github.com/Azure-Samples).<br/> You can either download, build, and run the sample. Or, you can create one from scratch following instructions in this quickstart. 

## Log in to Azure

In this section, we log in to the [Azure portal](http://portal.azure.com) and use the **CloudShell** to execute the account creation script, shown in the next step.

[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

## Create the account

This section shows how to create a Media Services account using CLI 2.0. When creating a Media Services account, you need to supply the ID of an Azure Storage account resource. The specified storage account is attached to your Media Services account. This storage account resource has to be located in the same geographic region as the Media Services account. For more information, see [Storage accounts](storage-account-concept.md).

The account creation script that follows, first, creates the Storage account. Then, it creates the Media Services account.

```azurecli-interactive
az create account 
```

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

``` charp
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

## Add subtitles

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

## Get the streaming URL

Run the code and get the streaming URL from the console.

## Test with Azure Media Player

1. Open a web browser and browse to https://ampdemo.azureedge.net/.
2. In the **URL:** box, paste the value that you got from the step 7.
3. Press **Update Player**.

## Clean up resources

If you're not going to continue to use this app, delete all resources created by this quickstart. 

In the **CloudShell**, that you opened in the first step, execute the following command:

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name myResourceGroup
az group delete --name myResourceGroup
```

## Next steps

Now that you know how to upload, encode, download, and stream your video, see the following article: 

> [!div class="nextstepaction"]
> [Analyze videos](analyze-videos-tutorial.md)
