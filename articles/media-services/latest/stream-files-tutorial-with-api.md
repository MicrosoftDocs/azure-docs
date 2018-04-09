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

# Tutorial: Upload, encode, and stream videos using APIs

This tutorial shows you how to stream video files with Azure Media Services. Most likely, you would want to deliver adaptive bitrate content in HLS, MPEG DASH, or Smooth Streaming formats so it can be played on a wide variety of browsers and devices. For both on-demand and live streaming delivery to various clients (mobile devices, TV, PC, etc.) the video and audio content needs to be encoded and packaged appropriately. 

![Play the video](./media/stream-files-tutorial-with-api/final-video.png)

This tutorial shows you how to:    

> [!div class="checklist"]
> * Create a Media Services account
> * Access the Media Services API
> * Configure the sample app
> * Examine the code
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

For explanations about what each function in the sample does, examine the code and look at the comments in [this source file](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/MediaServicesV3Tutorials/MediaServicesV3Tutorials/UploadEncodeAndStreamFiles/Program.cs).

[!INCLUDE [media-services-cli-create-v3-account-include](../../../includes/media-services-cli-create-v3-account-include.md)]

## Access the Media Services API

To connect to the latest version of Azure Media Services APIs, you use the Azure AD service principal authentication. The following command creates an Azure AD application and attaches a service principal to the account. You are going to use the returned values to configure you .NET app, as shown in the following step.

Before running the script, replace the `amsaccountname` placeholder.  `amsaccountname` is the name of the Azure Media Services account where to attach the service principal.

```azurecli-interactive
az ams sp create --account-name <amsaccountname> --resource-group amsResourcegroup
```

This command will produce a response similar to this:

```json
{
  "AadClientId": "12345678-1234-1234-1234-111111111111",
  "AadEndpoint": "https://login.microsoftonline.com",
  "AadSecret": "22345678-1234-1234-1234-111111111111",
  "AadTenantId": "32345678-1234-1234-1234-111111111111",
  "AccountName": "amsaccountname",
  "ArmAadAudience": "https://management.core.windows.net/",
  "ArmEndpoint": "https://management.azure.com/",
  "Region": "West US",
  "ResourceGroup": "amsResourcegroup",
  "SubscriptionId": "42345678-1234-1234-1234-111111111111"
}
```

## Configure the sample app

To run the app and access the Media Services APIs, you need to specify the correct access values in App.config. 

1. Open Visual Studio.
2. Browse to the solution that you cloned.
3. In the Solution Explorer, unfold the *UploadEncodeAndStreamFiles* project.
4. Set this project as the start up project.
5. Open App.config.
6. Replace settings values with the values that you got in the [previous](#create-an-azure-ad-application-and-service-principal) step.

```xml
  <appSettings>
    <add key="SubscriptionId" value ="42345678-1234-1234-1234-111111111111" />
    <add key="Region" value ="West US" />      
    <add key="ResourceGroup" value ="amsResourcegroup" />
    <add key="AccountName" value ="amsaccountname" />
    <add key="AadTenantId" value ="32345678-1234-1234-1234-111111111111" />
    <add key="AadClientId" value ="12345678-1234-1234-1234-111111111111" />
    <add key="AadSecret" value ="22345678-1234-1234-1234-111111111111" />
    <add key="ArmAadAudience" value ="https://management.core.windows.net/" />
    <add key="AadEndpoint" value ="https://login.microsoftonline.com" />
    <add key="ArmEndpoint" value ="https://management.azure.com/" />
  </appSettings>
```    

7. Press Ctrl+Shift+B to build the solution.

## Examine the code

### Start using Media Services APIs with .NET SDK

To start using Media Services APIs with .NET, you need to create an **AzureMediaServicesClient** object. To create the object, you need to supply credentials needed for the client to connect to Azure using Azure AD. You first need to get a token and then create a ClientCredential object from the returned token. In the code you cloned at the beginning of the article, the **ArmClientCredential** object is used to get the token.  

In Program.cs, you can find the **CreateMediaServicesClient** method that creates the **AzureMediaServicesClient** object.  

```csharp
private static IAzureMediaServicesClient CreateMediaServicesClient(ConfigWrapper config)
{
    ArmClientCredentials credentials = new ArmClientCredentials(config);

    return new AzureMediaServicesClient(config.ArmEndpoint, credentials)
    {
        SubscriptionId = config.SubscriptionId,
        ResourceGroupName = config.ResourceGroup,
        AccountName = config.AccountName
    };
}
```

### Create an input asset and upload a local file into it 

In Program.cs, find the **CreateInputAsset** function. It shows how to create an input asset and upload a local video file into it. The input asset can be created from HTTP(s) URLs, SAS URLs, AWS S3 Token URLs, or paths to files located in Azure Blob storage. If you want to learn how to create a job input from an HTTP(s) URL, see [this](job-input-from-http-how-to.md) topic.  

The following function performs these actions:

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

### Create an output asset to store the result of a job 

The output asset stores the result of your encoding job. Later, we show how to download the results from this output asset into the "output" folder, so you can see what you got.

```csharp
private static Asset CreateOutputAsset(IAzureMediaServicesClient client, string assetName)
{
    return client.Assets.CreateOrUpdate(assetName, new Asset());
}
```

### Create a transform and a job that encodes the uploaded file

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

When creating a new **Transform** instance, you need to specify what you want it to produce as an output. The required parameter is a **TransformOutput** object, as shown in the code above. Each **TransformOutput** contains a **Preset**. **Preset** describes step-by-step instructions of video and/or audio processing operations that are to be used to generate the desired **TransformOutput**. In this example, we use a built-in Preset called AdaptiveStreaming. This Preset auto-generates a bitrate ladder (bitrate-resolution pairs) based on the input resolution and bitrate, and produces ISO MP4 files with H.264 video and AAC audio corresponding to each bitrate-resolution pair. The output files never exceed the input resolution and bitrate. For example, if the input is 720p at 3 Mbps, output remains 720p at best, and will start at rates lower than 3 Mbps. For information about auto-generated bitrate ladder, see [Use Azure Media Services built-in standard encoder to auto-generate a bitrate ladder](autogen-bitrate-ladder.md).

#### Job

As mentioned above, the **Transform** object is the recipe and a **Job** is the actual request to Media Services to apply that **Transform** to a given input video or audio content. The Job specifies information like the location of the input video, and the location for the output. In this example, the input video is uploaded from your local machine. You can also specify an Azure Blob SAS URL, or S3 tokenized URL. Media Services also allows you to ingest from any existing content in Azure Storage.

```csharp
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

### Wait for the job to complete

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

## Run the sample app

1. Press Ctrl+F5 to run the *EncodeAndStreamFiles* application.
2. Copy the streaming URL from the console.

In this example, we are displaying a URL that can be used to playback the video using the Apple's **HLS** protocol:

![Output](./media/stream-files-tutorial-with-api/output.png)

To build the URL, you need to concatenate the streaming endpoint's host name and the streaming locator path. You can examine how it is done in the sample's [source code](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/MediaServicesV3Tutorials/MediaServicesV3Tutorials/UploadEncodeAndStreamFiles/Program.cs).

## Test the streaming URL

In this tutorial we are using Azure Media Player to test the streaming URL.

1. Open a web browser and navigate to https://ampdemo.azureedge.net/.
2. In the **URL:** box, paste the streaming URL value you got when you ran the application.  
3. Press **Update Player**.

## Clean up resources

If you no longer need any of the resources in your resource group, including the Media Services and storage accounts you created for this tutorial, delete the resource group. You can use the **CloudShell** tool.

In the **CloudShell**, execute the following command:

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

Now that you know how to upload, encode, download, and stream your video, see the following article: 

> [!div class="nextstepaction"]
> [Analyze videos](analyze-videos-tutorial.md)
