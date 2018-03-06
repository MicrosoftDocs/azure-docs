---
title: Stream a file - .NET | Microsoft Docs
description: Follow the steps of this quickstart to create a new Azure Media Services account, encode a file, and stream it to Azure Media Player.
services: media-services
documentationcenter: ''
author: juliako
manager: cflower
editor: ''
keywords: azure media services, stream

ms.service: media-services
ms.workload: 
ms.topic: quickstart
ms.custom: mvc
ms.date: 02/15/2018
ms.author: juliako
---

# Quickstart: Stream a file - .NET

> [!NOTE]
> The latest version of Azure Media Services (2018-03-30) is in preview. This version is also called v3.

Content creators want to reach larger audiences on today’s most popular mobile devices and browsers. To achieve that, the video needs to be encoded and packaged appropriately for delivery to various clients (for example, TV, PC, and mobile devices). As a developer, you can use Media Services [REST API](https://docs.microsoft.com/rest/api/media/) or client libraries that allow you to interact with the REST API, to easily create, manage, and maintain custom media workflows. 

This quickstart examines and explains the code that uses .NET client library to perform most common Media Services tasks related to streaming your files: 

1. Create the **AzureMediaServicesClient** object to access Media Services operations.
2. Create a job to encode a file hosted on an HTTPS URI.
3. Poll for encoding status. 
4. Get the streaming URL for the encoded video.

When you run the application discussed in this article, it prints out streaming URLs that you can use to stream your video with Azure Media Player. 

![Play the video](./media/stream-files-dotnet-quickstart/final-video.png)

## Prerequisites

Create an account, as described in [Create a Media Services account](create-account-cli-quickstart.md).

## Clone the sample application

First, let's clone the "Stream a file" app from GitHub.  In this sample, we used Visual Studio 2017.

1. Open a git terminal window, such as git bash, and `CD` to a working directory.  
2. Run the following command to clone the sample repository. 

    ```bash
    git clone https://github.com/Azure-Samples/media-services-v3-dotnet-stream-files-basic-app.git
    ```
3. Open the solution file in Visual Studio. 
4. To run the app and acess the Media Services APIs, you need to specify the correct values in App.config. 
    
    To get the values, see (create-account-cli-quickstart.md#access_api).

## Examine the downloaded code

Let's review what's happening in the app that you cloned. Open the Program.cs file and you'll find the lines of code explained in this section.  

### Create **AzureMediaServicesClient**

To program against the Media Services API using .NET, you need to create an **AzureMediaServicesClient** object. To create this object, you need to supply credentials needed for the client to connect to Azure. As you can see in the code that you cloned, we set all the connection parameters in the app.config file. To get the values, see [Create an Azure Media Services account](create-account-cli-quickstart.md).

```csharp
ArmClientCredentials credentials = new ArmClientCredentials(config);

return new AzureMediaServicesClient(config.ArmEndpoint, credentials)
{
    SubscriptionId = config.SubscriptionId,
    ResourceGroupName = config.ResourceGroup,
    AccountName = config.AccountName
};
```     

### Create a Job to encode a file hosted on an HTTPS URI

When encoding or processing content in Media Services, it is a common pattern to set up the encoding settings as a recipe that repeated jobs can be submitted to and achieve the same result. An example of that would be encoding the video to deliver to an iPhone at a specific quality and bitrate. A recipe in Media Services is called as a **Transform**. For more information, see [Transforms and jobs](transform-concept.md). 

When creating a **Transform** instance, you need to specify what you want for the transform's output to contain. You must set what preset you want to use. A preset describes the Media Processor operation that will be used to generate the output. In this case, AdaptiveStreaming is used. This preset auto-generates a bitrate ladder (bitrate-resolution pairs) based on the input resolution and bitrate. The auto-generated preset will never exceed the input resolution and bitrate. For example, if the input is 720p at 3 Mbps, output will remain 720p at best, and will start at rates lower than 3 Mbps. The output will have video and audio in separate files, which is optimal for adaptive streaming.

```csharp
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
```

When creating the transform, you need to specify a name. If you want to use the same transform in the future, you can find it by this name. Otherwise you can delete it once you are done.  

```csharp
Transform transform = new Transform(output, location: location);
transform = client.Transforms.CreateOrUpdate("BuiltInStandardEncoderPreset", transform);
```

As mentioned above, the **Transform** object is the recipe, and the **Job** is the actual definition of the work that will be done with that Transform. The job points to the "instance" information for the recipe. The job specifies information like the location of the input video and the location for the output. In this case, the input video is coming from the specified HTTPS URL. You can also specify an Azure Blob SAS URL, or S3 tokenized URL. Media Services also allows you to ingest from any existing content in Azure Storage or directly from your machine using the Storage APIs and an Asset. For more information, see [Tutorial: upload, encode, stream files](stream-files-tutorial.md).

The following function creates and submits a job that encodes a file that is based on an HTTPS URL. 

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
```

### Poll for encoding status. 

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

### Get the streaming URLs

The following code shows how to get the streaming URLs for both DASH and HLS. You also get a URL that you can use for progressive download of your video. 

```csharp
String GetDASHStreamingURL()
{

}

String GetHLSStreamingURL()
{

}

String GetProgressiveDownloadURL()
{

}
```


## Run the app and get the streaming URLs

Run the app, copy one of the URLs you want to test.  

*Add screenshot of the console with URLs.*

## Test with Azure Media Player

1. Open a web browser and browse to https://ampdemo.azureedge.net/.
2. In the **URL:** box, paste the Streaming URL value you got when you ran the application.  
3. Press **Update Player**.

## Next steps

Now that you've learned how to upload a file based on the specified HTTPS URL, encode it, and stream it, let us show you what else you can do with Media Services:

> [!div class="nextstepaction"]
> [Tutorial: upload, encode, and stream files](stream-files-tutorial.md)
