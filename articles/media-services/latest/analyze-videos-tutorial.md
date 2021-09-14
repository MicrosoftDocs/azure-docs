---
title: Analyze videos with Media Services v3
description: Learn how to analyze videos using Azure Media Services.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services 
ms.topic: tutorial
ms.date: 07/26/2021
ms.author: inhenkel
---

# Tutorial: Analyze videos with Media Services v3

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

This tutorial shows you how to analyze videos with Azure Media Services. There are many scenarios in which you might want to gain deep insights into recorded videos or audio content. For example, to achieve higher customer satisfaction, organizations can run speech-to-text processing to convert customer support recordings into a searchable catalog, with indexes and dashboards.

This tutorial shows you how to:

> [!div class="checklist"]
> * Download the sample app described in the topic.
> * Examine the code that analyzes the specified video.
> * Run the app.
> * Examine the output.
> * Clean up resources.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Compliance, Privacy, and Security
 
As an important reminder, you must comply with all applicable laws in your use of Azure Video Analyzer for Media (formerly Video Indexer). You must not use Video Analyzer for Media or any other Azure service in a manner that violates the rights of others. Before uploading any videos, including any biometric data, to the Video Analyzer for Media service for processing and storage, you must have all the proper rights, including all appropriate consents, from the individuals in the video. To learn about compliance, privacy and security in Video Analyzer for Media, the Azure [Cognitive Services Terms](https://azure.microsoft.com/support/legal/cognitive-services-compliance-and-privacy/). For Microsoft’s privacy obligations and handling of your data, review Microsoft’s [Privacy Statement](https://privacy.microsoft.com/PrivacyStatement), the [Online Services Terms](https://www.microsoft.com/licensing/product-licensing/products) (OST) and [Data Processing Addendum](https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=67) (“DPA”). More privacy information, including on data retention, deletion/destruction, is available in the OST and [here](../../azure-video-analyzer/video-analyzer-for-media-docs/faq.md). By using Video Analyzer for Media, you agree to be bound by the Cognitive Services Terms, the OST, DPA, and the Privacy Statement.

## Prerequisites

- Install [Visual Studio Code for Windows/macOS/Linux](https://code.visualstudio.com/) or [Visual Studio 2019 for Windows or Mac](https://visualstudio.microsoft.com/).
- Install [.NET 5.0 SDK](https://dotnet.microsoft.com/download)
- [Create a Media Services account](./account-create-how-to.md). Be sure to copy the **API Access** details in JSON format or store the values needed to connect to the Media Services account in the *.env* file format used in this sample.
- Follow the steps in [Access the Azure Media Services API with the Azure CLI](./access-api-howto.md) and save the credentials. You'll need to use them to access the API in this sample, or enter them into the *.env* file format.

## Download and configure the sample

Clone a GitHub repository that contains the .NET sample to your machine using the following command:  

 ```bash
 git clone https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials.git
 ```

The sample is located in the [AnalyzeVideos](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/tree/main/AMSV3Tutorials/AnalyzeVideos) folder.

[!INCLUDE [appsettings or .env file](./includes/note-appsettings-or-env-file.md)]

## Examine the code that analyzes the specified video

This section examines functions defined in the [Program.cs](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/main/AMSV3Tutorials/AnalyzeVideos/Program.cs) file of the *AnalyzeVideos* project.

The sample completes the following actions:

1. Creates a **Transform** and a **Job** that analyzes your video.
2. Creates an input **Asset** and uploads the video into it. The asset is used as the job's input.
3. Creates an output asset that stores the job's output.
4. Submits the job.
5. Checks the job's status.
6. Downloads the files that resulted from running the job.

### Start using Media Services APIs with the .NET SDK

To start using Media Services APIs with .NET, you need to create an `AzureMediaServicesClient` object. To create the object, you need to supply credentials for the client to connect to Azure by using Azure Active Directory. Another option is to use interactive authentication, which is implemented in `GetCredentialsInteractiveAuthAsync`.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/Common_Utils/Authentication.cs#CreateMediaServicesClientAsync)]

In the code that you cloned at the beginning of the article, the `GetCredentialsAsync` function creates the `ServiceClientCredentials` object based on the credentials supplied in the local configuration file (*appsettings.json*) or through the *.env* environment variables file in the root of the repository.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/Common_Utils/Authentication.cs#GetCredentialsAsync)]

In the case of interactive authentication, the `GetCredentialsInteractiveAuthAsync` function creates the `ServiceClientCredentials` object based on an interactive authentication and the connection parameters supplied in the local configuration file (*appsettings.json*) or through the *.env* environment variables file in the root of the repository. In that case, AADCLIENTID and AADSECRET are not needed in the configuration or environment variables file.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/Common_Utils/Authentication.cs#GetCredentialsInteractiveAuthAsync)]

### Create an input asset and upload a local file into it 

The **CreateInputAsset** function creates a new input [Asset](/rest/api/media/assets) and uploads the specified local video file into it. This Asset is used as the input to your encoding Job. In Media Services v3, the input to a Job can either be an Asset, or it can be content that you make available to your Media Services account via HTTPS URLs. To learn how to encode from an HTTPS URL, see [this](job-input-from-http-how-to.md) article.  

In Media Services v3, you use Azure Storage APIs to upload files. The following .NET snippet shows how.

The following function completes these actions:

* Creates an Asset.
* Gets a writable [SAS URL](../../storage/common/storage-sas-overview.md) to the Asset’s [container in storage](../../storage/blobs/storage-quickstart-blobs-dotnet.md#upload-blobs-to-a-container).

    If using asset’s [ListContainerSas](/rest/api/media/assets/listcontainersas) function to get SAS URLs, note that the function returns multiple SAS URLs as there are two storage account keys for each storage account. A storage account has two keys because it allows for seamless rotation  of storage account keys (for example, change one while using the other then start using the new key and rotate the other key). The 1st SAS URL represents storage key1 and second one storage key2.
* Uploads the file into the container in storage using the SAS URL.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/AnalyzeVideos/Program.cs#CreateInputAsset)]

### Create an output asset to store the result of the job

The output [Asset](/rest/api/media/assets) stores the result of your job. The project defines the **DownloadResults** function that downloads the results from this output asset into the "output" folder, so you can see what you got.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/AnalyzeVideos/Program.cs#CreateOutputAsset)]

### Create a transform and a job that analyzes videos

When encoding or processing content in Media Services, it's a common pattern to set up the encoding settings as a recipe. You would then submit a **Job** to apply that recipe to a video. By submitting new Jobs for each new video, you're applying that recipe to all the videos in your library. A recipe in Media Services is called a **Transform**. For more information, see [Transforms and jobs](./transform-jobs-concept.md). The sample described in this tutorial defines a recipe that analyzes the specified video.

#### Transform

When creating a new [Transform](/rest/api/media/transforms) instance, you need to specify what you want it to produce as an output. **TransformOutput**  is a required parameter. Each **TransformOutput** contains a **Preset**. **Preset** describes step-by-step instructions of video and/or audio processing operations that are to be used to generate the desired **TransformOutput**. In this example, the **VideoAnalyzerPreset** preset is used and the language ("en-US") is passed to its constructor (`new VideoAnalyzerPreset("en-US")`). This preset enables you to extract multiple audio and video insights from a video. You can use the **AudioAnalyzerPreset** preset if you need to extract multiple audio insights from a video.

When creating a **Transform**, check first if one already exists using the **Get** method, as shown in the code that follows. In Media Services v3, **Get** methods on entities return **null** if the entity doesn’t exist (a case-insensitive check on the name).

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/AnalyzeVideos/Program.cs#EnsureTransformExists)]

#### Job

As mentioned above, the [Transform](/rest/api/media/transforms) object is the recipe and a [Job](/rest/api/media/jobs) is the actual request to Media Services to apply that **Transform** to a given input video or audio content. The **Job** specifies information like the location of the input video and the location for the output. You can specify the location of your video using: HTTPS URLs, SAS URLs, or Assets that are in your Media Service account.

In this example, the job input is a local video.  

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/AnalyzeVideos/Program.cs#SubmitJob)]

### Wait for the job to complete

The job takes some time to complete. When it does, you want to be notified. There are different options to get notified about the [Job](/rest/api/media/jobs) completion. The simplest option (that's shown here) is to use polling.

Polling isn't a recommended best practice for production apps because of potential latency. Polling can be throttled if overused on an account. Developers should instead use Event Grid.

Event Grid is designed for high availability, consistent performance, and dynamic scale. With Event Grid, your apps can listen for and react to events from virtually all Azure services, as well as custom sources. Simple, HTTP-based reactive event handling helps you build efficient solutions through intelligent filtering and routing of events. For more information, see [Route events to a custom web endpoint](monitoring/job-state-events-cli-how-to.md).

The **Job** usually goes through the following states: **Scheduled**, **Queued**, **Processing**, **Finished** (the final state). If the job has come across an error, you get the **Error** state. If the job is in the process of being canceled, you get **Canceling** and then **Canceled** when it's done.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/AnalyzeVideos/Program.cs#WaitForJobToFinish)]

### Job error codes

See [Error codes](/rest/api/media/jobs/get#joberrorcode).

### Download the result of the job

The following function downloads the results from the output [Asset](/rest/api/media/assets) into the "output" folder so you can examine the results of the job.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/AnalyzeVideos/Program.cs#DownloadResults)]

### Clean up resources in your Media Services account

[!INCLUDE [clean-up-warning](includes/clean-up-warning.md)]

Generally, you should clean up everything except objects that you're planning to reuse (typically, you'll reuse Transforms and persist StreamingLocators). If you want for your account to be clean after experimenting, delete the resources that you don't plan to reuse. For example, the following code deletes the job and output asset:

### Delete resources with code

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/AnalyzeVideos/Program.cs#CleanUp)]

You can also use the CLI.

[!INCLUDE [clean-up-resources-cli](includes/clean-up-resources-cli.md)]

## Run the sample app

Press Ctrl+F5 to run the *AnalyzeVideos* app.

When we run the program, the job produces thumbnails for each face that it finds in the video. It also produces the insights.json file.

## Examine the output

The output file of analyzing videos is called insights.json. This file contains insights about your video. You can find description of  elements found in the json file in the [Media intelligence](./analyze-video-audio-files-concept.md) article.

## Multithreading

> [!WARNING]
> The Azure Media Services v3 SDKs aren't thread-safe. When working with a multi-threaded app, you should generate a new AzureMediaServicesClient object per thread.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: upload, encode, and stream files](stream-files-tutorial-with-api.md)
