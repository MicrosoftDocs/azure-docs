---
title: Upload, encode, and stream using Azure Media Services | Microsoft Docs
description: Follow the steps of this tutorial to upload a file, and encode the video, and stream your content with Azure Media Services.
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

# Tutorial: Upload, encode, and stream videos using APIs

This tutorial shows you how to stream video files with Azure Media Services. You would want to deliver adaptive bitrate content in Apple's HLS, MPEG DASH, or Smooth Streaming formats so it can be played on a wide variety of browsers and devices. For both on-demand and live streaming delivery to various clients (mobile devices, TV, PC, etc.) the video and audio content needs to be encoded and packaged appropriately. 

![Play the video](./media/stream-files-tutorial-with-api/final-video.png)

This tutorial shows you how to:    

> [!div class="checklist"]
> * Launch Azure Cloud Shell
> * Create a Media Services account
> * Access the Media Services API
> * Configure the sample app
> * Examine the code in detail
> * Run the app
> * Test the streaming URL
> * Clean up resources

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

If you do not have Visual Studio installed, you can get [Visual Studio Community 2017](https://www.visualstudio.com/thank-you-downloading-visual-studio/?sku=Community&rel=15).

## Download the sample

Clone a GitHub repository that contains the streaming .NET sample to your machine using the following command:  

 ```bash
 git clone https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials.git
 ```

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

[!INCLUDE [media-services-cli-create-v3-account-include](../../../includes/media-services-cli-create-v3-account-include.md)]

[!INCLUDE [media-services-v3-cli-access-api-include](../../../includes/media-services-v3-cli-access-api-include.md)]

## Examine the code

This section examines functions defined in the [Program.cs](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs) file of the *UploadEncodeAndStreamFiles* project.

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

### Create an input asset and upload a local file into it 

The **CreateInputAsset** function creates an input asset and uploads the specified local video file into it. This asset is used as the input to your encoding job. In Media Services v3, the job input can be created from HTTP(s) URLs, SAS URLs, AWS S3 Token URLs, or paths to files located in Azure Blob storage. If you want to learn how to create a job input from an HTTP(s) URL, see [this](job-input-from-http-how-to.md) article.  

In Media Services v3, the Storage APIs are used to upload files. The following .NET snippet shows how to use the Storage APIs with Media Services to upload your input files. You can also ingest remotely hosted content over HTTP(s), for more information, [Ingest from HTTP(s)](job-input-from-http-how-to.md). 

The following function performs these actions:

* Creates the Asset 
* Gets a writable [SAS URL](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1) to the Asset’s [container in storage](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-dotnet?tabs=windows#upload-blobs-to-the-container)
* Uploads the file into the container in storage using the SAS URL

```csharp
private static Asset CreateInputAsset(IAzureMediaServicesClient client, string resourceGroupName, string accountName, string assetName, string fileToUpload)
{
    Asset asset = client.Assets.CreateOrUpdate(resourceGroupName, accountName, assetName, new Asset());

    var response = client.Assets.ListContainerSas(resourceGroupName, accountName, assetName, new ListContainerSasInput()
    {
        Permissions = AssetContainerPermission.ReadWrite,
        ExpiryTime = DateTimeOffset.Now.AddHours(4)
    });

    var sasUri = new Uri(response.AssetContainerSasUrls.First());
    CloudBlobContainer container = new CloudBlobContainer(sasUri);
    var blob = container.GetBlockBlobReference(Path.GetFileName(fileToUpload));
    blob.UploadFromFile(fileToUpload);

    return asset;
}
```

### Create an output asset to store the result of a job 

The output asset stores the result of your encoding job. The project defines the **DownloadResults** function that downloads the results from this output asset into the "output" folder, so you can see what you got.

```csharp
private static Asset CreateOutputAsset(IAzureMediaServicesClient client, string resourceGroupName, string accountName, string assetName)
{
    Asset input = new Asset();

    return client.Assets.CreateOrUpdate(resourceGroupName, accountName, assetName, input);
}
```

### Create a transform and a job that encodes the uploaded file

When encoding or processing content in Media Services, it is a common pattern to set up the encoding settings as a recipe. You would then submit a **Job** to apply that recipe to a video. By submitting new jobs for each video, you are applying that recipe to all the videos in your library. A recipe in Media Services is called as a **Transform**. For more information, see [Transforms and jobs](transform-concept.md). The sample described in this tutorial defines a recipe that encodes the video in order to stream it to a variety of iOS and Android devices. 

#### Transform

When creating a new **Transform** instance, you need to specify what you want it to produce as an output. The required parameter is a **TransformOutput** object, as shown in the code above. Each **TransformOutput** contains a **Preset**. **Preset** describes step-by-step instructions of video and/or audio processing operations that are to be used to generate the desired **TransformOutput**. The sample described in this article, uses a built-in Preset called **AdaptiveStreaming**. The Preset auto-generates a bitrate ladder (bitrate-resolution pairs) based on the input resolution and bitrate, and produces ISO MP4 files with H.264 video and AAC audio corresponding to each bitrate-resolution pair. For information about, see [auto-generating bitrate ladder](autogen-bitrate-ladder.md).

You can use other built-in EncoderNamedPreset or use custom presets. 

When creating a **Transform**, you should first check if one already exists using the **Get** method, as shown in the code that follows.  In Media Services v3, **Get** methods on entities return **null** if the entity doesn’t exist.

```csharp
private static Transform EnsureTransformExists(IAzureMediaServicesClient client, string resourceGroupName, string accountName, string transformName)
{
    Transform transform = client.Transforms.Get(resourceGroupName, accountName, transformName);

    if (transform == null)
    {
        TransformOutput[] outputs = new TransformOutput[]
        {
            new TransformOutput
            {
                Preset = new BuiltInStandardEncoderPreset()
                {
                    PresetName = EncoderNamedPreset.AdaptiveStreaming
                }
            }
        };

        transform = new Transform(outputs);

        transform = client.Transforms.CreateOrUpdate(resourceGroupName, accountName, transformName, transform);
    }

    return transform;
}
```

#### Job

As mentioned above, the **Transform** object is the recipe and a **Job** is the actual request to Media Services to apply that **Transform** to a given input video or audio content. The **Job** specifies information like the location of the input video, and the location for the output. You can specify the location of your video using: HTTP(s) URLs, SAS URLs, S3 URLs, or a path to files located locally or in Azure Blob storage. The content can also be specified using [Google Cloud Storage signed URLs](https://cloud.google.com/storage/docs/access-control/signed-urls).

In this example, the input video is uploaded from your local machine. If you want to learn how to create a job input from an HTTP(s) URL, see [this](job-input-from-http-how-to.md) article.  

```csharp
private static Job SubmitJob(IAzureMediaServicesClient client, string resourceGroupName, string accountName, string transformName, string jobName, JobInput jobInput, string outputAssetName)
{
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

Polling is not a recommended best practice for production applications because of potential latency. Polling can be throttled if overused on an account. Developers should instead use Event Grid.

Event Grid is designed for high availability, consistent performance, and dynamic scale. With Event Grid, your apps can listen for and react to events from virtually all Azure services, as well as custom sources. Simple, HTTP-based reactive event handling helps you build efficient solutions through intelligent filtering and routing of events.

The **Job** usually goes through the following states: **Scheduled**, **Queued**, **Processing**, **Finished** (the final state). If the job has encountered an error, you get the **Error** state. If the job is in the process of being canceled, you get **Canceling** and **Canceled** when it is done.

```csharp
private static Job WaitForJobToFinish(IAzureMediaServicesClient client, string resourceGroupName, string accountName, string transformName, string jobName)
{
    Job job = null;
    while (true)
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

### Get streaming locator

In Media Services, a locator provides an entry point to access the files contained in an Asset. It also defines duration that a client has access to a given asset. One of the arguments that you need to pass is a **StreamingPolicyName**. In this example, you are streaming non-encrypted content, so the predefined clear streaming policy name can be passed.

```csharp
private static StreamingLocator CreateStreamingLocator(IAzureMediaServicesClient client,
                                                        string resourceGroup,
                                                        string accountName,
                                                        string assetName,
                                                        string locatorName)
{
    StreamingLocator locator =
        client.StreamingLocators.Create(resourceGroup,
        accountName,
        locatorName,
        new StreamingLocator()
        {
            AssetName = assetName,
            StreamingPolicyName = PredefinedClearStreamingOnly,
        });

    return locator;
}
```

### Get streaming URLs

Now that the streaming locator has been created, you can get the streaming URLs, as shown in **GetStreamingURLs**. To build a URL, you need to concatenate the streaming endpoint's host name and the streaming locator path. In this sample, the *default* streaming endpoint is used. By default, a streaming endpoint is in the stopped state, so you need to call **Start**. 

```csharp
static IList<string> GetStreamingURLs(
    IAzureMediaServicesClient client,
    string resourceGroupName,
    string accountName,
    String locatorName)
{
    IList<string> streamingURLs = new List<string>();

    string streamingUrlPrefx = "";

    StreamingEndpoint streamingEndpoint = client.StreamingEndpoints.Get(resourceGroupName, accountName, "default");

    if (streamingEndpoint != null)
    {
        streamingUrlPrefx = streamingEndpoint.HostName;

        if (streamingEndpoint.ResourceState != StreamingEndpointResourceState.Running)
            client.StreamingEndpoints.Start(resourceGroupName, accountName, "default");
    }

    foreach (var path in client.StreamingLocators.ListPaths(resourceGroupName, accountName, locatorName).StreamingPaths)
    {
        streamingURLs.Add("http://" + streamingUrlPrefx + path.Paths[0].ToString());
    }

    return streamingURLs;
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

1. Press Ctrl+F5 to run the *EncodeAndStreamFiles* application.
2. Copy one of the streaming URLs from the console.

This example displays URLs that can be used to play back the video using different protocols:

![Output](./media/stream-files-tutorial-with-api/output.png)

## Test the streaming URL

To test the stream, this article uses Azure Media Player. 

1. Open a web browser and navigate to [https://aka.ms/azuremediaplayer/](https://aka.ms/azuremediaplayer/).
2. In the **URL:** box, paste one of the streaming URL values you got when you ran the application. 
3. Press **Update Player**.

Azure Media Player can be used for testing but should not be used in a production environment. 

## Clean up resources

If you no longer need any of the resources in your resource group, including the Media Services and storage accounts you created for this tutorial, delete the resource group you created earlier. You can use the **CloudShell** tool.

In the **CloudShell**, execute the following command:

```azurecli-interactive
az group delete --name amsResourceGroup
```

## Multithreading

The Azure Media Services v3 SDKs are not thread-safe. When working with multi-threaded application, you should generate a new  AzureMediaServicesClient object per thread.

## Next steps

Now that you know how to upload, encode, download, and stream your video, see the following article: 

> [!div class="nextstepaction"]
> [Analyze videos](analyze-videos-tutorial-with-api.md)
