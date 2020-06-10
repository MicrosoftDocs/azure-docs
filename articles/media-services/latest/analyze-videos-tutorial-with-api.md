---
title: Analyze videos with Media Services v3
titleSuffix: Azure Media Services
description: Learn how to analyze videos using Azure Media Services.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: tutorial
ms.date: 03/26/2020
ms.author: juliako
ms.custom: seodec18

---

# Tutorial: Analyze videos with Media Services v3

> [!NOTE]
> Even though this tutorial uses the [.NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.liveevent?view=azure-dotnet) examples, the general steps are the same for [REST API](https://docs.microsoft.com/rest/api/media/liveevents), [CLI](https://docs.microsoft.com/cli/azure/ams/live-event?view=azure-cli-latest), or other supported [SDKs](media-services-apis-overview.md#sdks).

This tutorial shows you how to analyze videos with Azure Media Services. There are many scenarios in which you might want to gain deep insights into recorded videos or audio content. For example, to achieve higher customer satisfaction, organizations can run speech-to-text processing to convert customer support recordings into a searchable catalog, with indexes and dashboards. Then, they can obtain insights into their business. These insights include a list of common complaints, sources of such complaints, and other useful information.

This tutorial shows you how to:

> [!div class="checklist"]
> * Download the sample app described in the topic.
> * Examine the code that analyzes the specified video.
> * Run the app.
> * Examine the output.
> * Clean up resources.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Compliance, Privacy and Security
 
As an important reminder, you must comply with all applicable laws in your use of Video Indexer, and you may not use Video Indexer or any other Azure service in a manner that violates the rights of others or may be harmful to others. Before uploading any videos, including any biometric data, to the Video Indexer service for processing and storage, You must have all the proper rights, including all appropriate consents, from the individual(s) in the video. To learn about compliance, privacy and security in Video Indexer, the Microsoft [Cognitive Services Terms](https://azure.microsoft.com/support/legal/cognitive-services-compliance-and-privacy/). For Microsoft’s privacy obligations and handling of your data, please review Microsoft’s [Privacy Statement](https://privacy.microsoft.com/PrivacyStatement), the [Online Services Terms](https://www.microsoft.com/licensing/product-licensing/products) (“OST”) and [Data Processing Addendum](https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=67) (“DPA”). Additional privacy information, including on data retention, deletion/destruction, is available in the OST and [here](../video-indexer/faq.md). By using Video Indexer, you agree to be bound by the Cognitive Services Terms, the OST, DPA and the Privacy Statement.

## Prerequisites

- If you don't have Visual Studio installed, get [Visual Studio Community 2017](https://www.visualstudio.com/thank-you-downloading-visual-studio/?sku=Community&rel=15).
- [Create a Media Services account](create-account-cli-how-to.md).<br/>Make sure to remember the values that you used for the resource group name and Media Services account name.
- Follow the steps in [Access Azure Media Services API with the Azure CLI](access-api-cli-how-to.md) and save the credentials. You'll need to use them to access the API.

## Download and configure the sample

Clone a GitHub repository that contains the .NET sample to your machine using the following command:  

 ```bash
 git clone https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials.git
 ```

The sample is located in the [AnalyzeVideos](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/tree/master/AMSV3Tutorials/AnalyzeVideos) folder.

Open [appsettings.json](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/AnalyzeVideos/appsettings.json) in your downloaded project. Replace the values with the credentials you got from [accessing APIs](access-api-cli-how-to.md).

## Examine the code that analyzes the specified video

This section examines functions defined in the [Program.cs](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/AnalyzeVideos/Program.cs) file of the *AnalyzeVideos* project.

The sample completes the following actions:

1. Creates a **Transform** and a **Job** that analyzes your video.
2. Creates an input **Asset** and uploads the video into it. The asset is used as the job's input.
3. Creates an output asset that stores the job's output.
4. Submits the job.
5. Checks the job's status.
6. Downloads the files that resulted from running the job.

> [!NOTE]
> When using a Video or Audio Analyzer presets, use the Azure portal to set your account to have 10 S3 Media Reserved Units. For more information, see [Scale media processing](media-reserved-units-cli-how-to.md).

### Start using Media Services APIs with .NET SDK

To start using Media Services APIs with .NET, you need to create an **AzureMediaServicesClient** object. To create the object, you need to supply credentials needed for the client to connect to Azure using Azure AD. In the code you cloned at the beginning of the article, the **GetCredentialsAsync** function creates the ServiceClientCredentials object based on the credentials supplied in local configuration file. 

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/AnalyzeVideos/Program.cs#CreateMediaServicesClient)]

### Create an input asset and upload a local file into it 

The **CreateInputAsset** function creates a new input [Asset](https://docs.microsoft.com/rest/api/media/assets) and uploads the specified local video file into it. This Asset is used as the input to your encoding Job. In Media Services v3, the input to a Job can either be an Asset, or it can be content that you make available to your Media Services account via HTTPS URLs. To learn how to encode from an HTTPS URL, see [this](job-input-from-http-how-to.md) article.  

In Media Services v3, you use Azure Storage APIs to upload files. The following .NET snippet shows how.

The following function completes these actions:

* Creates an Asset.
* Gets a writable [SAS URL](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1) to the Asset’s [container in storage](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-dotnet#upload-blobs-to-a-container).

    If using asset’s [ListContainerSas](https://docs.microsoft.com/rest/api/media/assets/listcontainersas) function to get SAS URLs, note that the function returns multiple SAS URLs as there are two storage account keys for each storage account. A storage account has two keys because it allows for seamless rotation  of storage account keys (for example, change one while using the other then start using the new key and rotate the other key). The 1st SAS URL represents storage key1 and second one storage key2.
* Uploads the file into the container in storage using the SAS URL.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/AnalyzeVideos/Program.cs#CreateInputAsset)]

### Create an output asset to store the result of the job

The output [Asset](https://docs.microsoft.com/rest/api/media/assets) stores the result of your job. The project defines the **DownloadResults** function that downloads the results from this output asset into the "output" folder, so you can see what you got.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/AnalyzeVideos/Program.cs#CreateOutputAsset)]

### Create a transform and a job that analyzes videos

When encoding or processing content in Media Services, it's a common pattern to set up the encoding settings as a recipe. You would then submit a **Job** to apply that recipe to a video. By submitting new Jobs for each new video, you're applying that recipe to all the videos in your library. A recipe in Media Services is called a **Transform**. For more information, see [Transforms and jobs](transform-concept.md). The sample described in this tutorial defines a recipe that analyzes the specified video.

#### Transform

When creating a new [Transform](https://docs.microsoft.com/rest/api/media/transforms) instance, you need to specify what you want it to produce as an output. **TransformOutput**  is a required parameter. Each **TransformOutput** contains a **Preset**. **Preset** describes step-by-step instructions of video and/or audio processing operations that are to be used to generate the desired **TransformOutput**. In this example, the **VideoAnalyzerPreset** preset is used and the language ("en-US") is passed to its constructor (`new VideoAnalyzerPreset("en-US")`). This preset enables you to extract multiple audio and video insights from a video. You can use the **AudioAnalyzerPreset** preset if you need to extract multiple audio insights from a video.

When creating a **Transform**, check first if one already exists using the **Get** method, as shown in the code that follows. In Media Services v3, **Get** methods on entities return **null** if the entity doesn’t exist (a case-insensitive check on the name).

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/AnalyzeVideos/Program.cs#EnsureTransformExists)]

#### Job

As mentioned above, the [Transform](https://docs.microsoft.com/rest/api/media/transforms) object is the recipe and a [Job](https://docs.microsoft.com/rest/api/media/jobs) is the actual request to Media Services to apply that **Transform** to a given input video or audio content. The **Job** specifies information like the location of the input video and the location for the output. You can specify the location of your video using: HTTPS URLs, SAS URLs, or Assets that are in your Media Service account.

In this example, the job input is a local video.  

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/AnalyzeVideos/Program.cs#SubmitJob)]

### Wait for the job to complete

The job takes some time to complete. When it does, you want to be notified. There are different options to get notified about the [Job](https://docs.microsoft.com/rest/api/media/jobs) completion. The simplest option (that's shown here) is to use polling.

Polling isn't a recommended best practice for production apps because of potential latency. Polling can be throttled if overused on an account. Developers should instead use Event Grid.

Event Grid is designed for high availability, consistent performance, and dynamic scale. With Event Grid, your apps can listen for and react to events from virtually all Azure services, as well as custom sources. Simple, HTTP-based reactive event handling helps you build efficient solutions through intelligent filtering and routing of events. For more information, see [Route events to a custom web endpoint](job-state-events-cli-how-to.md).

The **Job** usually goes through the following states: **Scheduled**, **Queued**, **Processing**, **Finished** (the final state). If the job has come across an error, you get the **Error** state. If the job is in the process of being canceled, you get **Canceling** and then **Canceled** when it's done.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/AnalyzeVideos/Program.cs#WaitForJobToFinish)]

### Job error codes

See [Error codes](https://docs.microsoft.com/rest/api/media/jobs/get#joberrorcode).

### Download the result of the job

The following function downloads the results from the output [Asset](https://docs.microsoft.com/rest/api/media/assets) into the "output" folder so you can examine the results of the job.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/AnalyzeVideos/Program.cs#DownloadResults)]

### Clean up resource in your Media Services account

Generally, you should clean up everything except objects that you're planning to reuse (typically, you'll reuse Transforms and persist StreamingLocators). If you want for your account to be clean after experimenting, delete the resources that you don't plan to reuse. For example, the following code deletes Jobs:

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/AnalyzeVideos/Program.cs#CleanUp)]

## Run the sample app

Press Ctrl+F5 to run the *AnalyzeVideos* app.

When we run the program, the job produces thumbnails for each face that it finds in the video. It also produces the insights.json file.

## Examine the output

The output file of analyzing videos is called insights.json. This file contains insights about your video. You can find description of  elements found in the json file in the [Media intelligence](intelligence-concept.md) article.

## Clean up resources

If you no longer need any of the resources in your resource group, including the Media Services and storage accounts you created for this tutorial, delete the resource group you created earlier.

Execute the following CLI command:

```azurecli
az group delete --name amsResourceGroup
```

## Multithreading

The Azure Media Services v3 SDKs aren't thread-safe. When working with a multi-threaded app, you should generate a new AzureMediaServicesClient object per thread.

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: upload, encode, and stream files](stream-files-tutorial-with-api.md)
