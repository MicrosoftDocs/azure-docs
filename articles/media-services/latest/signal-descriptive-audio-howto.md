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

A customer could signal audio description tracks by annotating the audio track in the manifest. For more information, see the [Signaling audio description tracks](dynamic-packaging-overview.md#signaling-audio-description-tracks) concept.

The steps in this how to show how to perform the following workflow: 

1. Create an asset.
1. Upload a source file into the asset.
1. Encode the source file.
1. Upload an audio-only MP4 file (AAC codec) containing descriptive audio into the output asset.
1. Edit the .ism file that was created as a result of encoding.
1. Publish the asset by creating a streaming locator.
1. Play the stream that contains the descriptive audio tracks.

## Prerequisites

- [Create a Media Services account](create-account-cli-how-to.md).
- Follow the steps in [Access Azure Media Services API with the Azure CLI](access-api-cli-how-to.md) and save the credentials. You will need to use them to access the API.
- Review the [Upload, encode, and stream videos](stream-files-tutorial-with-api.md) tutorial.

## Create an input asset and upload a local file into it 

The **CreateInputAsset** function creates a new input [Asset](https://docs.microsoft.com/rest/api/media/assets) and uploads the specified local video file into it. This **Asset** is used as the input to your encoding Job. In Media Services v3, the input to a **Job** can either be an **Asset**, or it can be content that you make available to your Media Services account via HTTPS URLs. 

If you want to learn how to encode from a HTTPS URL, see [this article](job-input-from-http-how-to.md) .  

In Media Services v3, you use Azure Storage APIs to upload files. The following .NET snippet shows how.

The following function performs these actions:

* Creates an **Asset** 
* Gets a writable [SAS URL](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1) to the asset’s [container in storage](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-dotnet#upload-blobs-to-a-container)
* Uploads the file into the container in storage using the SAS URL

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#CreateInputAsset)]

## Create an output asset to store the result of the encoding job

The output [Asset](https://docs.microsoft.com/rest/api/media/assets) stores the result of your encoding job. 

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#CreateOutputAsset)]

## Create a transform and a job that encodes the uploaded file

When encoding or processing content in Media Services, it is a common pattern to set up the encoding settings as a recipe. You would then submit a **Job** to apply that recipe to a video. By submitting new jobs for each new video, you are applying that recipe to all the videos in your library. A recipe in Media Services is called as a **Transform**. For more information, see [Transforms and Jobs](transform-concept.md). The sample described in this tutorial defines a recipe that encodes the video in order to stream it to a variety of iOS and Android devices. 

The following example creates a transform (if one does not exist).

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#EnsureTransformExists)]

The following example submits a job.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#SubmitJob)]

## Wait for the job to complete

The job takes some time to complete and when it does you want to be notified. We recommend using Event Grid to wait for the job to complete.

The job usually goes through the following states: **Scheduled**, **Queued**, **Processing**, **Finished** (the final state). If the job has encountered an error, you get the **Error** state. If the job is in the process of being canceled, you get **Canceling** and **Canceled** when it is done.

For more information, see [Handling Event Grid events](reacting-to-media-services-events.md).

## Upload the audio-only MP4 file

Upload the additional audio-only MP4 file (AAC codec) containing descriptive audio into the output asset.  

```csharp
private static async Task UpoadAudioIntoOutputAsset(
    IAzureMediaServicesClient client,
    string resourceGroupName,
    string accountName,
    string outputAssetName,
    string fileToUpload)
{
    // Use the Assets.Get method to get the existing asset. 
    // In Media Services v3, the Get method on entities returns null 
    // if the entity doesn't exist (a case-insensitive check on the name).

    // Call Media Services API to create an Asset.
    // This method creates a container in storage for the Asset.
    // The files (blobs) associated with the asset will be stored in this container.
    Asset asset = await client.Assets.GetAsync(resourceGroupName, accountName, outputAssetName);
    
    if (asset != null)
    {
      // Use Media Services API to get back a response that contains
      // SAS URL for the Asset container into which to upload blobs.
      // That is where you would specify read-write permissions 
      // and the exparation time for the SAS URL.
      var response = await client.Assets.ListContainerSasAsync(
          resourceGroupName,
          accountName,
          outputAssetName,
          permissions: AssetContainerPermission.ReadWrite,
          expiryTime: DateTime.UtcNow.AddHours(4).ToUniversalTime());

      var sasUri = new Uri(response.AssetContainerSasUrls.First());

      // Use Storage API to get a reference to the Asset container
      // that was created by calling Asset's CreateOrUpdate method.  
      CloudBlobContainer container = new CloudBlobContainer(sasUri);
      var blob = container.GetBlockBlobReference(Path.GetFileName(fileToUpload));

      // Use Strorage API to upload the file into the container in storage.
      await blob.UploadFromFileAsync(fileToUpload);
    }
}
```

## Edit the .ism file

When your encoding job is done, the output asset will contain the files generated by the encoding job. Among the files, you will find the .ism file.

Edit the .ism file by adding the information about the uploaded audio-only MP4 file (AAC codec) containing descriptive audio into the output asset. For example:

```
<?xml version="1.0" encoding="utf-8"?>
<smil xmlns="http://www.w3.org/2001/SMIL20/Language">
  <head>
    <meta name="clientManifestRelativePath" content="ignite.ismc" />
    <meta name="formats" content="mp4-v2" />
  </head>
  <body>
    <switch>
      <audio src="ignite_320x180_AACAudio_380.m4a" systemBitrate="128041" systemLanguage="eng">
        <param name="systemBitrate" value="128041" valuetype="data" />
        <param name="trackID" value="2" valuetype="data" />
        <param name="trackName" value="aac_eng_2_128041_2_1" valuetype="data" />
        <param name="systemLanguage" value="eng" valuetype="data" />
        <param name="accessibility" value="description" />
        <param name="role" value="alternate" />       
      </audio>
      <video src="ignite_1280x720_AACAudio_3550.mp4" systemBitrate="3550351">
        <param name="systemBitrate" value="3550351" valuetype="data" />
        <param name="trackID" value="1" valuetype="data" />
        <param name="trackName" value="video" valuetype="data" />
      </video>
      <video src="ignite_960x540_AACAudio_2218.mp4" systemBitrate="2218278">
        <param name="systemBitrate" value="2218278" valuetype="data" />
        <param name="trackID" value="1" valuetype="data" />
        <param name="trackName" value="video" valuetype="data" />
      </video>
      <video src="ignite_640x360_AACAudio_1153.mp4" systemBitrate="1153568">
        <param name="systemBitrate" value="1153568" valuetype="data" />
        <param name="trackID" value="1" valuetype="data" />
        <param name="trackName" value="video" valuetype="data" />
      </video>
      <video src="ignite_480x270_AACAudio_722.mp4" systemBitrate="722654">
        <param name="systemBitrate" value="722654" valuetype="data" />
        <param name="trackID" value="1" valuetype="data" />
        <param name="trackName" value="video" valuetype="data" />
      </video>
      <video src="ignite_320x180_AACAudio_380.mp4" systemBitrate="380850">
        <param name="systemBitrate" value="380850" valuetype="data" />
        <param name="trackID" value="1" valuetype="data" />
        <param name="trackName" value="video" valuetype="data" />
      </video>
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

## Test with Azure Media Player

To test the stream, this article uses Azure Media Player. 

> [!NOTE]
> If a player is hosted on an https site, make sure to update the URL to "https".

1. Open a web browser and navigate to [https://aka.ms/azuremediaplayer/](https://aka.ms/azuremediaplayer/).
2. In the **URL:** box, paste one of the streaming URL values you got from your application. 
 
     You can paste the URL in HLS, Dash, or Smooth format and Azure Media Player will switch to an appropriate streaming protocol for playback on your device automatically.
3. Press **Update Player**.

Azure Media Player can be used for testing but should not be used in a production environment. 

## Next steps

[Analyze videos](analyze-videos-tutorial-with-api.md)
