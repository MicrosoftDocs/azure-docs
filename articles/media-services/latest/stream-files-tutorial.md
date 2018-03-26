---
title: Upload, encode, and stream using Azure Media Services | Microsoft Docs
description: Follow the steps of this tutorial to upload a file and encode the video with Azure Media Services.
services: media-services
documentationcenter: ''
author: Juliako
manager: cflower
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: tutorial
ms.custom: mvc
ms.date: 03/26/2018
ms.author: juliako
---

# Tutorial: Upload, encode, and stream videos

This tutorial shows you how to stream video files with Azure Media Services. Most likely, you would want to deliver adaptive bitrate content in HLS, MPEG DASH, or Smooth Streaming formats so it can be played on a wide variety of browsers and devices. For both on-demand and live streaming delivery to various clients (mobile devices, TV, PC, etc.) the video and audio content needs to be encoded and packaged appropriately. 

In this tutorial, you are first offered to clone a GitHub repository that contains the **UploadEncodeAndStreamFiles** project. The project contains .NET code that this article examines in detail. 

This tutorial shows you how to:    

> [!div class="checklist"]
> * Configure your app so it can access Media Services APIs
> * Create an input asset and upload a local file into it 
> * Create an output asset to store the result of the encoding job 
> * Create a transform and a job that encodes the uploaded file
> * Wait for the job to complete
> * Download the result to your local folder
> * Get the streaming URLs
> * Test the encoded video in Azure Media Player
> * Clean up resources

![Play the video](./media/stream-files-dotnet-tutorials/final-video.png)

## Prerequisites

+ An active [GitHub](https://github.com) account. 
+ Visual Studio. The example described in this quickstart uses Visual Studio 2017. 

    If you do not have Visual Studio installed, you can get [Visual Studio Community 2017, Visual Studio Professional 2017, or Visual Studio Enterprise 2017](https://www.visualstudio.com/downloads/).
+ An Azure Media Services account. See the steps described in [Create a Media Services account](create-account-cli-quickstart.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Clone the sample repo

First, let's clone the [media-services-v3-dotnet-tutorials](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials) repo from GitHub. Visual Studio 2017 was used to create samples in the solution.

1. Open a git terminal window, such as git bash, and `CD` to a working directory.  
2. Run the following command to clone the sample repository. 

    ```bash
    git clone https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials.git
    ```
3. Open the solution file in Visual Studio. 
4. Right-click the **UploadEncodeAndStreamFiles** project and select **Set as StartUp project**.
5. Build the solution. 
6. Open the Program.cs file.
 
## Configure your app so it can access Media Services APIs

To run the app and access the Media Services APIs, you need to specify the correct values in App.config. 
    
To get the values, see [Accessing APIs](access-api-cli-how-to.md).

## Create an input asset and upload a local file into it 

In Program.cs, find the **CreateInputAsset** function. It shows how to create an input asset and upload a local video file into it. The input asset can be created from HTTP(s) URLs, SAS URLs, AWS S3 Token URLs, or paths to files located in Azure Blob storage. If you want to see how to upload and encode a file based on an HTTPS URL, see the [Stream a file](stream-files-dotnet-quickstart.md) quickstart.

The function performs the following actions:

-	Creates the Asset
-	Gets a SAS URL
-	Uploads the file to Blob storage using the SAS URL

```csharp
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

## Create an output asset to store the result of a job 

The output asset stores the result of your encoding job. Later, we show how to download the results from this output asset into the "output" folder, so you can see what you got.

``` charp
private static Asset CreateOutputAsset(IAzureMediaServicesClient client, string assetName)
{
    return client.Assets.CreateOrUpdate(assetName, new Asset());
}
```

## Create a transform and a job that encodes the uploaded file

When encoding or processing content in Media Services, it is a common pattern to set up the encoding settings as a recipe. You would then submit a job to apply that recipe to a video. By submitting new jobs for each video, you are applying that recipe to all the videos in your library. One example of a recipe would be to encode the video in order to stream it to a variety of iOS and Android devices. A recipe in Media Services is called as a **Transform**. For more information, see [Transforms and jobs](transform-concept.md). 

### Transform

When creating a **Transform**, you should first check if one already exists, as shown in the code that follows. 

```csharp
Transform transform = client.Transforms.Get(transformName);

if (transform == null)
{
    var output = new[]
    {
        new TransformOutput
        {
                OnError = OnErrorType.ContinueJob,
                RelativePriority = Priority.Normal,
                Preset = new BuiltInStandardEncoderPreset()
                {
                    PresetName = EncoderNamedPreset.AdaptiveStreaming
                }
        }
    };

    transform = new Transform(output, location: location);
    transform = client.Transforms.CreateOrUpdate(transformName, transform);
}
```

When creating a new **Transform** instance, you need to specify what you want it to produce as an output. The required parameter is a **TransformOutput** object, as shown in the code above. Each **TransformOutput** contains a **Preset**. **Preset** describes step-by-step instructions of video and/or audio processing operations that are to be used to generate the desired **TransformOutput**. In this example, we use a built-in Preset called AdaptiveStreaming. This Preset auto-generates a bitrate ladder (bitrate-resolution pairs) based on the input resolution and bitrate, and produces ISO MP4 files with H.264 video and AAC audio corresponding to each bitrate-resolution pair. The output files never exceed the input resolution and bitrate. For example, if the input is 720p at 3 Mbps, output remains 720p at best, and will start at rates lower than 3 Mbps. For information about auto-generated bitrate ladder, see [Use Azure Media Services built-in standard encoder to auto-generate a bitrate ladder](autogen-bitrate-ladder.md).

### Job

As mentioned above, the **Transform** object is the recipe and a **Job** is the actual request to Media Services to apply that **Transform** to a given input video or audio content. The Job specifies information like the location of the input video, and the location for the output. In this example, the input video is uploaded from your local machine. You can also specify an Azure Blob SAS URL, or S3 tokenized URL. Media Services also allows you to ingest from any existing content in Azure Storage.

```
private static Job SubmitJob(IAzureMediaServicesClient client, string transformName, string jobName, JobInput jobInput, string outputAssetName)
{
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
```

## Wait for the job to complete

The job takes some time to complete and when it does you want to be notified. There are different options to get notified about the job completion. The simplest option (that is shown here) is to use polling. 

> [!Note]
> Polling is not a recommended best practice for production applications. Developers should instead use Event Grid, as shown in [Tutorial: upload, encode, and stream files](stream-files-tutorial.md).

The **Job** usually goes through the following states: **Scheduled**, **Queued**, **Processing**, **Finished** (the final state). If the job has encountered an error, you will get the **Error** state. If the job is in the process of being canceled, you will get **Canceling** and **Canceled** when it is done.

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

## Download the results to your local folder

Download the results to the "output" folder, so you can see what you got once the encoding is done.

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

## Run the app and get the streaming URLs

Run the app that you cloned, copy one of the URLs you want to test.  

## Test with Azure Media Player

1. Open a web browser and browse to https://ampdemo.azureedge.net/.
2. In the **URL:** box, paste the Streaming URL value you got when you ran the application.
3. Press **Update Player**.

## Clean up resources

If you no longer need any of the resources in your resource group, including the Media Services account you created for this Quickstart, delete the resource group. You can use the **CloudShell** tool.

In the **CloudShell**, execute the following command:

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

Now that you know how to upload, encode, download, and stream your video, see the following article: 

> [!div class="nextstepaction"]
> [Analyze videos](analyze-videos-tutorial.md)
