---
title: Stream video files - .NET | Microsoft Docs
description: Follow the steps of this quickstart to create a new Azure Media Services account, encode a file, and stream it to Azure Media Player.
services: media-services
documentationcenter: ''
author: juliako
manager: cflower
editor: ''
keywords: azure media services, stream

ms.service: media-services
ms.workload: media
ms.topic: quickstart
ms.custom: mvc
ms.date: 03/13/2018
ms.author: juliako
---

# Quickstart: Stream video files - .NET

> [!NOTE]
> The latest version of Azure Media Services (2018-03-30) is in preview. This version is also called v3.

This quickstart shows you how to stream video files. Most likely, you would want to deliver adaptive bitrate content in HLS, MPEG DASH, and Smooth Streaming formats so it can be played on a wide variety of browsers and devices. For both on-demand and live streaming delivery to various clients (mobile devices, TV, PC, etc.) the video and audio content needs to be encoded and packaged appropriately.

This tutorial examines a .NET code sample that is located on GitHub, so you are first offered to clone the sample repository. 

The article explains the following tasks that are part of the code sample:  

1. Create the **AzureMediaServicesClient** object to access Media Services operations.
2. Create a job to encode a file hosted on an HTTPS URI.
3. Poll for encoding status. 
4. Get the URL that players on mobile devices and browsers can use to stream the encoded video.

When you run the application discussed in this article, it prints out streaming URLs that you can use to stream your video with a media player. The quickstart shows how to do it with Azure Media Player. 

![Play the video](./media/stream-files-dotnet-quickstart/final-video.png)

## Prerequisites

+ An active [GitHub](https://github.com) account. 
+ Visual Studio. The example described in this quickstart uses Visual Studio 2017. 

    If you do not have Visual Studio installed, you can get [Visual Studio Community 2017, Visual Studio Professional 2017, or Visual Studio Enterprise 2017](https://www.visualstudio.com/downloads/).
+ An Azure Media Services account. See the steps described in [Create a Media Services account](create-account-cli-quickstart.md).

## Clone the sample application

First, let's clone the [StreamAndEncodeFiles](https://github.com/azure-samples/media-services-v3-dotnet-quickstarts) app from GitHub. Visual Studio 2017 was used to create the sample.

1. Open a git terminal window, such as git bash, and `CD` to a working directory.  
2. Run the following command to clone the sample repository. 

    ```bash
    git clone https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts.git
    ```
3. Open the solution file in Visual Studio. 

    The project that is discussed in this article is called **EncodeAndStreamFiles**.
4. Build the solution. 
4. To run the app and access the Media Services APIs, you need to specify the correct values in App.config. 
    
    To get the values, see (create-account-cli-quickstart.md#access_api).

## Examine the downloaded code

Let's review what's happening in the app that you cloned. Open the Program.cs file and you'll find the lines of code explained in this section.  

### Create **AzureMediaServicesClient**

To program against the Media Services API using .NET, you need to create an **AzureMediaServicesClient** object. To create the object, you need to supply credentials needed for the client to connect to Azure using Azure AD. You first need to get a token and then create a ClientCredential object from the returned token. In the code you cloned at the beginning of the article, the **ArmClientCredential** object is used to get the token.  

In the example, we set all the connection parameters in the app.config file. To get the values, see [Create an Azure Media Services account](create-account-cli-quickstart.md).

```csharp
ArmClientCredentials credentials = new ArmClientCredentials(config);

return new AzureMediaServicesClient(config.ArmEndpoint, credentials)
{
    SubscriptionId = config.SubscriptionId,
    ResourceGroupName = config.ResourceGroup,
    AccountName = config.AccountName
};
```     

### Create a job to encode a file hosted on an HTTPS URI

When encoding or processing content in Media Services, it is a common pattern to set up the encoding settings as a recipe. You would then submit a job to apply that recipe to a video. By submitting new jobs for each video, you are applying that recipe to all the videos in your library. One example of a recipe would be to encode the video in order to stream it to a variety of iOS and Android devices. A recipe in Media Services is called as a **Transform**. For more information, see [Transforms and jobs](transform-concept.md). 

#### Transform

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

When creating a new **Transform** instance, you need to specify what you want it to produce as an output. The required parameter is a **TransformOutput** object, as shown in the code above. This objects requires for you to specify a **Preset**. **Preset** is step-by-step instructions in a recipe - the set of video and/or audio processing operations that are to be used to generate the desired **TransformOutput**. Each TransformOutput contains a Preset. In this example, we use a built-in Preset called AdaptiveStreaming. This Preset auto-generates a bitrate ladder (bitrate-resolution pairs) based on the input resolution and bitrate, and produces ISO MP4 files with H.264 video and AAC audio corresponding to each bitrate-resolution pair. The output files never exceed the input resolution and bitrate. For example, if the input is 720p at 3 Mbps, output remains 720p at best, and will start at rates lower than 3 Mbps. For information about auto-generated bitrate ladder, see [Use Azure Media Services built-in standard encoder to auto-generate a bitrate ladder](autogen-bitrate-ladder.md).

#### Job

As mentioned above, the **Transform** object is the recipe, and a **Job** is the actual request to Media Services to apply that Transform to a given input video or audio content. The Job specifies information like the location of the input video, and the location for the output. In this example, the input video is coming from the specified HTTPS URL. You can also specify an Azure Blob SAS URL, or S3 tokenized URL. Media Services also allows you to ingest from any existing content in Azure Storage or directly from your machine using the Storage APIs and an Asset. For more information, see [Tutorial: upload, encode, stream files](stream-files-tutorial.md).

The following function creates and submits a Job that encodes a file that is based on an HTTPS URL. For examples that show other ways to specify the job input, see the [Upload, encode, and stream videos](stream-files-tutorial.md) tutorial.

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

Run the app that you cloned, copy one of the URLs you want to test.  

## Test with Azure Media Player

1. Open a web browser and browse to https://ampdemo.azureedge.net/.
2. In the **URL:** box, paste the Streaming URL value you got when you ran the application.  
3. Press **Update Player**.

## Next steps

Now that you've learned how to upload a file based on the specified HTTPS URL, encode it, and stream it, let us show you what else you can do with Media Services:

> [!div class="nextstepaction"]
> [Tutorial: upload, encode, and stream files](stream-files-tutorial.md)
