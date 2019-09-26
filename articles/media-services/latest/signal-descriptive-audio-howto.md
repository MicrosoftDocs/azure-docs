---
title: Upload, encode, and stream with Azure Media Services v3 | Microsoft Docs
description: Follow the steps of this tutorial to upload a file, and encode the video, and stream your content with Media Services v3.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.custom: 
ms.date: 09/25/2019
ms.author: juliako
---

# Signal audio description tracks

A customer could annotate an audio track as audio description in the manifest. To do that, they would add “accessibility” and “role” parameters to the .ism file. Media Services will recognize audio description if an audio track has param “accessibility” with value “description”, and param "role" with value "alternate". If Media Services detects the audio description in the .ism file, the audio description information is passed to the client manifest as `Accessibility="description"` and `Role="alternate"` attributes into the `StreamIndex` element.

If the combination of "accessibility" = "description" and "role" = "alternate" is set in .ism file,  the DASH manifest and Smooth manifest carry values as set in “accessibility” and “role” parameters. It is the customer’s responsibility to set these two values right and to mark an audio track as audio description. Per DASH spec, “accessibility” = “description” and “role” = “alternate” together means an audio track is audio description.

For HLS v7 and above (`format=m3u8-cmaf`), its playlist carries `CHARACTERISTICS="public.accessibility.describes-video"` only when the combination of “accessibility” = “description” and “role” = “alternate” is set in .ism file. 

## Overview of the steps

The steps that are covered in this article are:

1. Upload source file containing primary video and audio (using a local file or specifying an HTTPS URL) into an input asset.
1. Create an output asset where the result of your encoding job will go.
1. Encode the source file using a suitable transform.
1. Upload the additional audio-only MP4 file (AAC codec) containing descriptive audio into the output asset.
1. Edit the .ism file in the output asset blob.
1. Publish the asset by creating a streaming locators.

## Prerequisites

- [Create a Media Services account](create-account-cli-how-to.md).<br/>Make sure to remember the values that you used for the resource group name and Media Services account name.
- Follow the steps in [Access Azure Media Services API with the Azure CLI](access-api-cli-how-to.md) and save the credentials. You will need to use them to access the API.
- Review the [Upload, encode, and stream videos](stream-files-tutorial-with-api.md) tutorial that is referenced a lot in this article.

## Create an input asset and upload a local file into it 

The **CreateInputAsset** function creates a new input [Asset](https://docs.microsoft.com/rest/api/media/assets) and uploads the specified local video file into it. This **Asset** is used as the input to your encoding Job. In Media Services v3, the input to a **Job** can either be an **Asset**, or it can be content that you make available to your Media Services account via HTTPS URLs. 

If you want to learn how to encode from a HTTPS URL, see [this article](job-input-from-http-how-to.md) .  

In Media Services v3, you use Azure Storage APIs to upload files. The following .NET snippet shows how.

The following function performs these actions:

* Creates an **Asset** 
* Gets a writable [SAS URL](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1) to the asset’s [container in storage](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-dotnet#upload-blobs-to-a-container)
* Uploads the file into the container in storage using the SAS URL

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#CreateInputAsset)]

## Create an output asset to store the result of a job 

The output [Asset](https://docs.microsoft.com/rest/api/media/assets) stores the result of your encoding job. 

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#CreateOutputAsset)]

## Create a Transform and a Job that encodes the uploaded file

When encoding or processing content in Media Services, it is a common pattern to set up the encoding settings as a recipe. You would then submit a **Job** to apply that recipe to a video. By submitting new jobs for each new video, you are applying that recipe to all the videos in your library. A recipe in Media Services is called as a **Transform**. For more information, see [Transforms and Jobs](transform-concept.md). The sample described in this tutorial defines a recipe that encodes the video in order to stream it to a variety of iOS and Android devices. 

### Transform

When creating a new [Transform](https://docs.microsoft.com/rest/api/media/transforms) instance, you need to specify what you want it to produce as an output. The required parameter is a **TransformOutput** object, as shown in the code below. Each **TransformOutput** contains a **Preset**. **Preset** describes the step-by-step instructions of video and/or audio processing operations that are to be used to generate the desired **TransformOutput**. The sample described in this article uses a built-in Preset called **AdaptiveStreaming**. The Preset encodes the input video into an autogenerated bitrate ladder (bitrate-resolution pairs) based on the input resolution and bitrate, and produces ISO MP4 files with H.264 video and AAC audio corresponding to each bitrate-resolution pair. For information about this Preset, see [autogenerating bitrate ladder](autogen-bitrate-ladder.md).

You can use a built-in EncoderNamedPreset or use custom presets. For more information, see [How to customize encoder presets](customize-encoder-presets-how-to.md).

When creating a [Transform](https://docs.microsoft.com/rest/api/media/transforms), you should first check if one already exists using the **Get** method, as shown in the code that follows.  In Media Services v3, **Get** methods on entities return **null** if the entity doesn’t exist (a case-insensitive check on the name).

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#EnsureTransformExists)]

### Job

As mentioned above, the [Transform](https://docs.microsoft.com/rest/api/media/transforms) object is the recipe and a [Job](https://docs.microsoft.com/rest/api/media/jobs) is the actual request to Media Services to apply that **Transform** to a given input video or audio content. The **Job** specifies information like the location of the input video, and the location for the output.

In this example, the input video has been uploaded from your local machine. If you want to learn how to encode from an HTTPS URL, see [this](job-input-from-http-how-to.md) article.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#SubmitJob)]

## Wait for the job to complete

The job takes some time to complete and when it does you want to be notified. The code sample below shows how to poll the service for the status of the [Job](https://docs.microsoft.com/rest/api/media/jobs). Polling is not a recommended best practice for production applications because of potential latency. Polling can be throttled if overused on an account. Developers should instead use Event Grid.

Event Grid is designed for high availability, consistent performance, and dynamic scale. With Event Grid, your apps can listen for and react to events from virtually all Azure services, as well as custom sources. Simple, HTTP-based reactive event handling helps you build efficient solutions through intelligent filtering and routing of events.  See [Route events to a custom web endpoint](job-state-events-cli-how-to.md).

The **Job** usually goes through the following states: **Scheduled**, **Queued**, **Processing**, **Finished** (the final state). If the job has encountered an error, you get the **Error** state. If the job is in the process of being canceled, you get **Canceling** and **Canceled** when it is done.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#WaitForJobToFinish)]

## Edit the .ism file

When your encoding job is done, the output asset will contain the files generated by the encoding job. Among the files, you will find the .ism file.

1. Download and open the .ism file.
1. Add the audio element:

    ```
    <?xml version="1.0" encoding="utf-8"?>
    <smil xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.w3.org/2001/SMIL20/Language">
      <head>
        <meta name="formats" content="mp4" />
      </head>
      <body>
        <switch>
          <video src="movie_848x480.mp4" systemBitrate="2270000">
            <param name="trackName" value="video" />
          </video>
          <audio src="Eng_194kbps.m4a" systemBitrate="194000" systemLanguage="eng">
            <param name="trackName" value="aac_eng_audio_description" />
            <param name="accessibility" value="description" />
            <param name="role" value="alternate" />
          </audio>
    ...
        </switch>
      </body>
    </smil>
    ```
    
## Get a streaming locator

After the encoding is complete, the next step is to make the video in the output Asset available to clients for playback. You can accomplish this in two steps: first, create a [Streaming Locator](https://docs.microsoft.com/rest/api/media/streaminglocators), and second, build the streaming URLs that clients can use. 

The process of creating a **Streaming Locator** is called publishing. By default, the **Streaming Locator** is valid immediately after you make the API calls, and lasts until it is deleted, unless you configure the optional start and end times. 

When creating a [StreamingLocator](https://docs.microsoft.com/rest/api/media/streaminglocators), you will need to specify the desired **StreamingPolicyName**. In this example, you will be streaming in-the-clear (or non-encrypted content) so the predefined clear streaming policy (**PredefinedStreamingPolicy.ClearStreamingOnly**) is used.

> [!IMPORTANT]
> When using a custom [Streaming Policy](https://docs.microsoft.com/rest/api/media/streamingpolicies), you should design a limited set of such policies for your Media Service account, and re-use them for your StreamingLocators whenever the same encryption options and protocols are needed. Your Media Service account has a quota for the number of Streaming Policy entries. You should not be creating a new Streaming Policy for each Streaming Locator.

The following code assumes that you are calling the function with a unique locatorName.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#CreateStreamingLocator)]

While the sample in this topic discusses streaming, you can use the same call to create a Streaming Locator for delivering video via progressive download.

### Get streaming URLs

Now that the [Streaming Locator](https://docs.microsoft.com/rest/api/media/streaminglocators) has been created, you can get the streaming URLs, as shown in **GetStreamingURLs**. To build a URL, you need to concatenate the [Streaming Endpoint](https://docs.microsoft.com/rest/api/media/streamingendpoints) host name and the **Streaming Locator** path. In this sample, the *default* **Streaming Endpoint** is used. When you first create a Media Service account, this *default* **Streaming Endpoint** will be in a stopped state, so you need to call **Start**.

> [!NOTE]
> In this method, you  need the locatorName that was used when creating the **Streaming Locator** for the output Asset.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#GetStreamingURLs)]

## Next steps

[Analyze videos](analyze-videos-tutorial-with-api.md)
