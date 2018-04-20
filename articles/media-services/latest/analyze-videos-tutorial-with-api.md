---
title: Analyze videos with Azure Media Services | Microsoft Docs
description: Follow the steps of this tutorial to analyze videos using Azure Media Services.
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: tutorial
ms.custom: mvc
ms.date: 04/09/2018
ms.author: juliako
---

# Tutorial: Analyze videos with Azure Media Services 

This tutorial shows you how to analyze videos with Azure Media Services. There are many scenarios in which you might want to gain valuable insights from recorded videos or audio content. For example, to achieve higher customer satisfaction, organizations can extract speech-to-text and build search indexes and dashboards. Then, they can extract intelligence around common complaints, sources of complaints, and other relevant data. 

This tutorial shows you how to:    

> [!div class="checklist"]
> * Launch Azure Cloud Shell
> * Create a Media Services account
> * Access the Media Services API
> * Configure the sample app
> * Examine the sample code in detail
> * Run the app
> * Examine the output
> * Clean up resources

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

If you do not have Visual Studio installed, you can get [Visual Studio Community 2017](https://www.visualstudio.com/thank-you-downloading-visual-studio/?sku=Community&rel=15).

## Download the sample

Clone a GitHub repository that contains the .NET sample to your machine using the following command:  

 ```bash
 git clone https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials.git
 ```

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

[!INCLUDE [media-services-cli-create-v3-account-include](../../../includes/media-services-cli-create-v3-account-include.md)]

[!INCLUDE [media-services-v3-cli-access-api-include](../../../includes/media-services-v3-cli-access-api-include.md)]

## Examine the sample code in detail

This section examines functions defined in the [Program.cs](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/AnalyzeVideos/Program.cs) file of the *AnalyzeVideos* project.

### Start using Media Services APIs with .NET SDK

To start using Media Services APIs with .NET, you need to create an **AzureMediaServicesClient** object. To create the object, you need to supply credentials needed for the client to connect to Azure using Azure AD. You first need to get a token and then create a **ClientCredential** object from the returned token. In the code you cloned at the beginning of the article, the **ArmClientCredential** object is used to get the token.  

```csharp
private static IAzureMediaServicesClient CreateMediaServicesClient(ConfigWrapper config)
{
    ArmClientCredentials credentials = new ArmClientCredentials(config);

    return new AzureMediaServicesClient(config.ArmEndpoint, credentials)
    {
        SubscriptionId = config.SubscriptionId,
    };
}
```

### Create an output asset to store the result of a job 

The output asset stores the result of a job that analyzes your content. 

```csharp
private static Asset CreateOutputAsset(IAzureMediaServicesClient client, string resourceGroupName, string accountName, string assetName)
{
    Asset input = new Asset();

    return client.Assets.CreateOrUpdate(resourceGroupName, accountName, assetName, input);
}
```

### Create a transform and a job that analyzes videos

When processing content in Media Services, it is a common pattern to set up the processing settings as a recipe. You would then submit a **Job** to apply that recipe to a video. By submitting new jobs for each video, you are applying that recipe to all the videos in your library. A recipe in Media Services is called as a **Transform**. For more information, see [Transforms and jobs](transform-concept.md). In this tutorial, a recipe that analyzes videos is defined. 

#### Transform

When creating a new **Transform** instance, you need to specify what you want it to produce as an output. The required parameter is a **TransformOutput** object, as shown in the code above. Each **TransformOutput** contains a **Preset**. **Preset** describes step-by-step instructions of video and/or audio processing operations that are to be used to generate the desired **TransformOutput**. In this example, the **VideoAnalyzerPreset** preset is used. This preset analyzes videos.  

When creating a **Transform**, you should first check if one already exists using the **Get** method., as shown in the code that follows.  In Media Services v3, **Get** methods on entities return **null** if the entity doesn’t exist.

```csharp
private static Transform EnsureTransformExists(IAzureMediaServicesClient client, string resourceGroupName, string accountName, string transformName, Preset preset)
{
    Transform transform = client.Transforms.Get(resourceGroupName, accountName, transformName);

    if (transform == null)
    {
        TransformOutput[] outputs = new TransformOutput[]
        {
            new TransformOutput(preset),
        };

        transform = new Transform(outputs);

        transform = client.Transforms.CreateOrUpdate(resourceGroupName, accountName, transformName, transform);
    }

    return transform;
}
```

#### Job

As mentioned above, the **Transform** object is the recipe and a **Job** is the actual request to Media Services to apply that **Transform** to a given input video or audio content. The **Job** specifies information like the location of the input video, and the location for the output. You can specify the location of your video using: HTTP(s) URLs, SAS URLs, AWS S3 Token URLs, or a path to files located locally or in Azure Blob storage. The content can also be specified using [Google Cloud Storage signed URLs](https://cloud.google.com/storage/docs/access-control/signed-urls).

In this example, the input video is uploaded from a specified HTTP(s) URL.  

```csharp
private static Job SubmitJob(IAzureMediaServicesClient client, string resourceGroupName, string accountName, string transformName, string jobName, string outputAssetName)
{
    JobInputHttp jobInput =
        new JobInputHttp(files: new[] { "https://nimbuscdn-nimbuspm.streaming.mediaservices.windows.net/2b533311-b215-4409-80af-529c3e853622/Ignite-short.mp4" });

    JobOutput[] jobOutputs =
    {
        new JobOutputAsset(outputAssetName), 
    };

    Job job = client.Jobs.Create(
        resourceGroupName, 
        accountName,
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

### Wait for the job to complete

The job takes some time to complete and when it does you want to be notified. There are different options to get notified about the job completion. The simplest option (that is shown here) is to use polling. 

Polling is not a recommended best practice for production applications because of potential latency. Polling can be throttled if overused on an account. Developers should instead use Event Grid.

Event Grid is designed for high availability, consistent performance, and dynamic scale. With Event Grid, your apps can listen for and react to events from virtually all Azure services, as well as custom sources. Simple, HTTP-based reactive event handling helps you build efficient solutions through intelligent filtering and routing of events.

The **Job** usually goes through the following states: **Scheduled**, **Queued**, **Processing**, **Finished** (the final state). If the job has encountered an error, you get the **Error** state. If the job is in the process of being canceled, you get **Canceling** and **Canceled** when it is done.

```csharp
private static Job WaitForJobToFinish(IAzureMediaServicesClient client, string resourceGroupName, string accountName, string transformName, string jobName)
{
    Job job = null;
    
    while(true)
    {
        job = client.Jobs.Get(resourceGroupName, accountName, transformName, jobName);

        if (job.State == JobState.Finished || job.State == JobState.Error || job.State == JobState.Canceled)
        {
            break;
        }

        Console.WriteLine($"Job is {job.State}.");
        for (int i = 0; i < job.Outputs.Count; i++)
        {
            JobOutput output = job.Outputs[i];
            Console.Write($"\tJobOutput[{i}] is {output.State}.");
            if (output.State == JobState.Processing)
            {
                Console.Write($"  Progress: {output.Progress}");
            }
            Console.WriteLine();
        }
        System.Threading.Thread.Sleep(SleepInterval);
    }

    return job;
}
```

### Download the result of the job

 The following function downloads the results from the output asset into the "output" folder, so you can examine the results of the job. 

```csharp
private static void DownloadResults(IAzureMediaServicesClient client, string resourceGroup, string accountName, string assetName, string resultsFolder)
{
    ListContainerSasInput parameters = new ListContainerSasInput(permissions: AssetContainerPermission.Read, expiryTime: DateTimeOffset.UtcNow.AddHours(1));
    AssetContainerSas assetContainerSas = client.Assets.ListContainerSas(resourceGroup, accountName, assetName, parameters);

    Uri containerSasUrl = new Uri (assetContainerSas.AssetContainerSasUrls.FirstOrDefault());
    CloudBlobContainer container = new CloudBlobContainer(containerSasUrl);

    string directory = Path.Combine(resultsFolder, assetName);
    Directory.CreateDirectory(directory);

    Console.WriteLine("Downloading results of VideoAnalyzerPreset to {0}.", directory);

    foreach (IListBlobItem blobItem in container.ListBlobs(null, true, BlobListingDetails.None))
    {
        if (blobItem is CloudBlockBlob)
        {
            CloudBlockBlob blob = blobItem as CloudBlockBlob;
            string filename = Path.Combine(directory, blob.Name);

            blob.DownloadToFile(filename, FileMode.Create);

            Console.WriteLine("file: {0}", filename);
        }
    }

    Console.WriteLine("Download complete.");
}
```

### Clean up resource in your Media Services account

Generally, you should clean up everything except objects that you are planning to reuse (commonly, you want to reuse a transform). If you want for your account to be clean after experimenting, you should delete the resources that you do not plan to reuse.  For example, the following code deletes jobs.

```csharp
static void CleanUp(IAzureMediaServicesClient client, string resourceGroupName, string accountName, String transformName)
{
    foreach(var job in client.Jobs.List(resourceGroupName, accountName, transformName))
    {
        client.Jobs.Delete(resourceGroupName, accountName, transformName, job.Name);
    }
}
```

## Run the sample app

Press Ctrl+F5 to run the *AnalyzeVideos* application.

When we run the program, the job produces thumbnails for each face that it finds in the video. It also produces the insights.json file.

## Examine the output

The output file of analyzing videos is called insights.json. This file contains insights about your video. You can find details about elements in this file in the [Video Indexer documentation](https://docs.microsoft.com/azure/cognitive-services/video-indexer/video-indexer-output-json) article.

## Clean up resources

If you no longer need any of the resources in your resource group, including the Media Services and storage accounts you created for this tutorial, delete the resource group you created earlier. You can use the **CloudShell** tool.

In the **CloudShell**, execute the following command:

```azurecli-interactive
az group delete --name amsResourceGroup
```

## Multithreading

The Azure Media Services v3 SDKs are not thread-safe. When working with multi-threaded application, you should generate a new  AzureMediaServicesClient object per thread.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: upload, encode, and stream files](stream-files-tutorial-with-api.md)
