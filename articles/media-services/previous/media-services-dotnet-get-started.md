---
title: Get started with delivering content on demand using .NET | Microsoft Docs
description: This tutorial walks you through the steps of implementing an on demand content delivery application with Azure Media Services using .NET.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''
ms.assetid: 388b8928-9aa9-46b1-b60a-a918da75bd7b
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 03/18/2019
ms.author: juliako

---

# Get started with delivering content on demand using .NET SDK  

[!INCLUDE [media-services-selector-get-started](../../../includes/media-services-selector-get-started.md)]

This tutorial walks you through the steps of implementing a basic Video-on-Demand (VoD) content delivery service with Azure Media Services (AMS) application using the Azure Media Services .NET SDK.

## Prerequisites

The following are required to complete the tutorial:

* An Azure account. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/).
* A Media Services account. To create a Media Services account, see [How to Create a Media Services Account](media-services-portal-create-account.md).
* .NET Framework 4.0 or later.
* Visual Studio.

This tutorial includes the following tasks:

1. Start streaming endpoint (using the Azure portal).
2. Create and configure a Visual Studio project.
3. Connect to the Media Services account.
2. Upload a video file.
3. Encode the source file into a set of adaptive bitrate MP4 files.
4. Publish the asset and get streaming and progressive download URLs.  
5. Play your content.

## Overview
This tutorial walks you through the steps of implementing a Video-on-Demand (VoD) content delivery application using Azure Media Services (AMS) SDK for .NET.

The tutorial introduces the basic Media Services workflow and the most common programming objects and tasks required for Media Services development. At the completion of the tutorial, you will be able to stream or progressively download a sample media file that you uploaded, encoded, and downloaded.

### AMS model

The following image shows some of the most commonly used objects when developing VoD applications against the Media Services OData model.

Click the image to view it full size.  

<a href="./media/media-services-dotnet-get-started/media-services-overview-object-model.png" target="_blank"><img src="./media/media-services-dotnet-get-started/media-services-overview-object-model-small.png"></a> 

You can view the whole model [here](https://media.windows.net/API/$metadata?api-version=2.15).  

## Start streaming endpoints using the Azure portal

When working with Azure Media Services one of the most common scenarios is delivering video via adaptive bitrate streaming. Media Services provides dynamic packaging, which allows you to deliver your adaptive bitrate MP4 encoded content in streaming formats supported by Media Services (MPEG DASH, HLS, Smooth Streaming) just-in-time, without you having to store pre-packaged versions of each of these streaming formats.

>[!NOTE]
>When your AMS account is created a **default** streaming endpoint is added to your account in the **Stopped** state. To start streaming your content and take advantage of dynamic packaging and dynamic encryption, the streaming endpoint from which you want to stream content has to be in the **Running** state.

To start the streaming endpoint, do the following:

1. Log in at the [Azure portal](https://portal.azure.com/).
2. In the Settings window, click Streaming endpoints.
3. Click the default streaming endpoint.

	The DEFAULT STREAMING ENDPOINT DETAILS window appears.

4. Click the Start icon.
5. Click the Save button to save your changes.

## Create and configure a Visual Studio project

1. Set up your development environment and populate the app.config file with connection information, as described in [Media Services development with .NET](media-services-dotnet-how-to-use.md). 
2. Create a new folder (folder can be anywhere on your local drive) and copy an .mp4 file that you want to encode and stream or progressively download. In this example, the "C:\VideoFiles" path is used.

## Connect to the Media Services account

When using Media Services with .NET, you must use the **CloudMediaContext** class for most Media Services programming tasks: connecting to Media Services account; creating, updating, accessing, and deleting the following objects: assets, asset files, jobs, access policies, locators, etc.

Overwrite the default Program class with the following code: The code demonstrates how to read the connection values from the App.config file and how to create the **CloudMediaContext** object in order to connect to Media Services. For more information, see [connecting to the Media Services API](media-services-use-aad-auth-to-access-ams-api.md).

Make sure to update the file name and path to where you have your media file.

The **Main** function calls methods that will be defined further in this section.

> [!NOTE]
> You will be getting compilation errors until you add definitions for all the functions that are defined later in this article.

```csharp
	class Program
	{
	    // Read values from the App.config file.
        private static readonly string _AADTenantDomain =
            ConfigurationManager.AppSettings["AMSAADTenantDomain"];
        private static readonly string _RESTAPIEndpoint =
            ConfigurationManager.AppSettings["AMSRESTAPIEndpoint"];
        private static readonly string _AMSClientId =
            ConfigurationManager.AppSettings["AMSClientId"];
        private static readonly string _AMSClientSecret =
            ConfigurationManager.AppSettings["AMSClientSecret"];

	    private static CloudMediaContext _context = null;

	    static void Main(string[] args)
	    {
        try
        {
            AzureAdTokenCredentials tokenCredentials = 
                new AzureAdTokenCredentials(_AADTenantDomain,
                    new AzureAdClientSymmetricKey(_AMSClientId, _AMSClientSecret),
                    AzureEnvironments.AzureCloudEnvironment);

            var tokenProvider = new AzureAdTokenProvider(tokenCredentials);

            _context = new CloudMediaContext(new Uri(_RESTAPIEndpoint), tokenProvider);

            // Add calls to methods defined in this section.
            // Make sure to update the file name and path to where you have your media file.
            IAsset inputAsset =
            UploadFile(@"C:\VideoFiles\BigBuckBunny.mp4", AssetCreationOptions.None);

            IAsset encodedAsset =
            EncodeToAdaptiveBitrateMP4s(inputAsset, AssetCreationOptions.None);

            PublishAssetGetURLs(encodedAsset);
        }
        catch (Exception exception)
        {
            // Parse the XML error message in the Media Services response and create a new
            // exception with its content.
            exception = MediaServicesExceptionParser.Parse(exception);

            Console.Error.WriteLine(exception.Message);
        }
        finally
        {
            Console.ReadLine();
        }
	    }
```

## Create a new asset and upload a video file

In Media Services, you upload (or ingest) your digital files into an asset. The **Asset** entity can contain video, audio, images, thumbnail collections, text tracks, and closed caption files (and the metadata about these files.)  Once the files are uploaded, your content is stored securely in the cloud for further processing and streaming. The files in the asset are called **Asset Files**.

The **UploadFile** method defined below calls **CreateFromFile** (defined in .NET SDK Extensions). **CreateFromFile** creates a new asset into which the specified source file is uploaded.

The **CreateFromFile** method takes **AssetCreationOptions**, which lets you specify one of the following asset creation options:

* **None** - No encryption is used. This is the default value. Note that when using this option, your content is not protected in transit or at rest in storage.
  If you plan to deliver an MP4 using progressive download, use this option.
* **StorageEncrypted** - Use this option to encrypt your clear content locally using Advanced Encryption Standard (AES)-256 bit encryption, which then uploads it to Azure Storage where it is stored encrypted at rest. Assets protected with Storage Encryption are automatically unencrypted and placed in an encrypted file system prior to encoding, and optionally re-encrypted prior to uploading back as a new output asset. The primary use case for Storage Encryption is when you want to secure your high-quality input media files with strong encryption at rest on disk.
* **CommonEncryptionProtected** - Use this option if you are uploading content that has already been encrypted and protected with Common Encryption or PlayReady DRM (for example, Smooth Streaming protected with PlayReady DRM).
* **EnvelopeEncryptionProtected** – Use this option if you are uploading HLS encrypted with AES. Note that the files must have been encoded and encrypted by Transform Manager.

The **CreateFromFile** method also lets you specify a callback in order to report the upload progress of the file.

In the following example, we specify **None** for the asset options.

Add the following method to the Program class.

```csharp
    static public IAsset UploadFile(string fileName, AssetCreationOptions options)
    {
        IAsset inputAsset = _context.Assets.CreateFromFile(
            fileName,
            options,
            (af, p) =>
            {
                Console.WriteLine("Uploading '{0}' - Progress: {1:0.##}%", af.Name, p.Progress);
            });

        Console.WriteLine("Asset {0} created.", inputAsset.Id);

        return inputAsset;
    }
```

## Encode the source file into a set of adaptive bitrate MP4 files
After ingesting assets into Media Services, media can be encoded, transmuxed, watermarked, and so on, before it is delivered to clients. These activities are scheduled and run against multiple background role instances to ensure high performance and availability. These activities are called Jobs, and each Job is composed of atomic Tasks that do the actual work on the Asset file.

As was mentioned earlier, when working with Azure Media Services, one of the most common scenarios is delivering adaptive bitrate streaming to your clients. Media Services can dynamically package a set of adaptive bitrate MP4 files into one of the following formats: HTTP Live Streaming (HLS), Smooth Streaming, and MPEG DASH.

To take advantage of dynamic packaging, you need to encode or transcode your mezzanine (source) file into a set of adaptive bitrate MP4 files or adaptive bitrate Smooth Streaming files.  

The following code shows how to submit an encoding job. The job contains one task that specifies to transcode the mezzanine file into a set of adaptive bitrate MP4s using **Media Encoder Standard**. The code submits the job and waits until it is completed.

Once the job is completed, you would be able to stream your asset or progressively download MP4 files that were created as a result of transcoding.

Add the following method to the Program class.

```csharp
    static public IAsset EncodeToAdaptiveBitrateMP4s(IAsset asset, AssetCreationOptions options)
    {

        // Prepare a job with a single task to transcode the specified asset
        // into a multi-bitrate asset.

        IJob job = _context.Jobs.CreateWithSingleTask(
            "Media Encoder Standard",
            "Adaptive Streaming",
            asset,
            "Adaptive Bitrate MP4",
            options);

        Console.WriteLine("Submitting transcoding job...");


        // Submit the job and wait until it is completed.
        job.Submit();

        job = job.StartExecutionProgressTask(
            j =>
            {
                Console.WriteLine("Job state: {0}", j.State);
                Console.WriteLine("Job progress: {0:0.##}%", j.GetOverallProgress());
            },
            CancellationToken.None).Result;

        Console.WriteLine("Transcoding job finished.");

        IAsset outputAsset = job.OutputMediaAssets[0];

        return outputAsset;
    }
```

## Publish the asset and get URLs for streaming and progressive download

To stream or download an asset, you first need to "publish" it by creating a locator. Locators provide access to files contained in the asset. Media Services supports two types of locators: OnDemandOrigin locators, used to stream media (for example, MPEG DASH, HLS, or Smooth Streaming) and Access Signature (SAS) locators, used to download media files.

### Some details about URL formats

After you create the locators, you can build the URLs that would be used to stream or download your files. The sample in this tutorial outputs URLs that you can paste in appropriate browsers. This section just gives short examples of what different formats look like.

#### A streaming URL for MPEG DASH has the following format:

{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest**(format=mpd-time-csf)**

#### A streaming URL for HLS has the following format:

{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest**(format=m3u8-aapl)**

#### A streaming URL for Smooth Streaming has the following format:

{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest


#### A SAS URL used to download files has the following format:

{blob container name}/{asset name}/{file name}/{SAS signature}

Media Services .NET SDK extensions provide convenient helper methods that return formatted URLs for the published asset.

The following code uses .NET SDK Extensions to create locators and to get streaming and progressive download URLs. The code also shows how to download files to a local folder.

Add the following method to the Program class.

```csharp
    static public void PublishAssetGetURLs(IAsset asset)
    {
        // Publish the output asset by creating an Origin locator for adaptive streaming,
        // and a SAS locator for progressive download.

        _context.Locators.Create(
            LocatorType.OnDemandOrigin,
            asset,
            AccessPermissions.Read,
            TimeSpan.FromDays(30));

        _context.Locators.Create(
            LocatorType.Sas,
            asset,
            AccessPermissions.Read,
            TimeSpan.FromDays(30));


        IEnumerable<IAssetFile> mp4AssetFiles = asset
                .AssetFiles
                .ToList()
                .Where(af => af.Name.EndsWith(".mp4", StringComparison.OrdinalIgnoreCase));

        // Get the Smooth Streaming, HLS and MPEG-DASH URLs for adaptive streaming,
        // and the Progressive Download URL.
        Uri smoothStreamingUri = asset.GetSmoothStreamingUri();
        Uri hlsUri = asset.GetHlsUri();
        Uri mpegDashUri = asset.GetMpegDashUri();

        // Get the URls for progressive download for each MP4 file that was generated as a result
        // of encoding.
        List<Uri> mp4ProgressiveDownloadUris = mp4AssetFiles.Select(af => af.GetSasUri()).ToList();


        // Display  the streaming URLs.
        Console.WriteLine("Use the following URLs for adaptive streaming: ");
        Console.WriteLine(smoothStreamingUri);
        Console.WriteLine(hlsUri);
        Console.WriteLine(mpegDashUri);
        Console.WriteLine();

        // Display the URLs for progressive download.
        Console.WriteLine("Use the following URLs for progressive download.");
        mp4ProgressiveDownloadUris.ForEach(uri => Console.WriteLine(uri + "\n"));
        Console.WriteLine();

        // Download the output asset to a local folder.
        string outputFolder = "job-output";
        if (!Directory.Exists(outputFolder))
        {
            Directory.CreateDirectory(outputFolder);
        }

        Console.WriteLine();
        Console.WriteLine("Downloading output asset files to a local folder...");
        asset.DownloadToFolder(
            outputFolder,
            (af, p) =>
            {
                Console.WriteLine("Downloading '{0}' - Progress: {1:0.##}%", af.Name, p.Progress);
            });

        Console.WriteLine("Output asset files available at '{0}'.", Path.GetFullPath(outputFolder));
    }
```

## Test by playing your content

Once you run the program defined in the previous section, the URLs similar to the following will be displayed in the console window.

Adaptive streaming URLs:

Smooth Streaming

    http://amstestaccount001.streaming.mediaservices.windows.net/ebf733c4-3e2e-4a68-b67b-cc5159d1d7f2/BigBuckBunny.ism/manifest

HLS

    http://amstestaccount001.streaming.mediaservices.windows.net/ebf733c4-3e2e-4a68-b67b-cc5159d1d7f2/BigBuckBunny.ism/manifest(format=m3u8-aapl)

MPEG DASH

    http://amstestaccount001.streaming.mediaservices.windows.net/ebf733c4-3e2e-4a68-b67b-cc5159d1d7f2/BigBuckBunny.ism/manifest(format=mpd-time-csf)

Progressive download URLs (audio and video).

    https://storagetestaccount001.blob.core.windows.net/asset-38058602-a4b8-4b33-b9f0-6880dc1490ea/BigBuckBunny_H264_650kbps_AAC_und_ch2_96kbps.mp4?sv=2012-02-12&sr=c&si=166d5154-b801-410b-a226-ee2f8eac1929&sig=P2iNZJAvAWpp%2Bj9yV6TQjoz5DIIaj7ve8ARynmEM6Xk%3D&se=2015-02-14T01:13:05Z

    https://storagetestaccount001.blob.core.windows.net/asset-38058602-a4b8-4b33-b9f0-6880dc1490ea/BigBuckBunny_H264_400kbps_AAC_und_ch2_96kbps.mp4?sv=2012-02-12&sr=c&si=166d5154-b801-410b-a226-ee2f8eac1929&sig=P2iNZJAvAWpp%2Bj9yV6TQjoz5DIIaj7ve8ARynmEM6Xk%3D&se=2015-02-14T01:13:05Z

    https://storagetestaccount001.blob.core.windows.net/asset-38058602-a4b8-4b33-b9f0-6880dc1490ea/BigBuckBunny_H264_3400kbps_AAC_und_ch2_96kbps.mp4?sv=2012-02-12&sr=c&si=166d5154-b801-410b-a226-ee2f8eac1929&sig=P2iNZJAvAWpp%2Bj9yV6TQjoz5DIIaj7ve8ARynmEM6Xk%3D&se=2015-02-14T01:13:05Z

    https://storagetestaccount001.blob.core.windows.net/asset-38058602-a4b8-4b33-b9f0-6880dc1490ea/BigBuckBunny_H264_2250kbps_AAC_und_ch2_96kbps.mp4?sv=2012-02-12&sr=c&si=166d5154-b801-410b-a226-ee2f8eac1929&sig=P2iNZJAvAWpp%2Bj9yV6TQjoz5DIIaj7ve8ARynmEM6Xk%3D&se=2015-02-14T01:13:05Z

    https://storagetestaccount001.blob.core.windows.net/asset-38058602-a4b8-4b33-b9f0-6880dc1490ea/BigBuckBunny_H264_1500kbps_AAC_und_ch2_96kbps.mp4?sv=2012-02-12&sr=c&si=166d5154-b801-410b-a226-ee2f8eac1929&sig=P2iNZJAvAWpp%2Bj9yV6TQjoz5DIIaj7ve8ARynmEM6Xk%3D&se=2015-02-14T01:13:05Z

    https://storagetestaccount001.blob.core.windows.net/asset-38058602-a4b8-4b33-b9f0-6880dc1490ea/BigBuckBunny_H264_1000kbps_AAC_und_ch2_96kbps.mp4?sv=2012-02-12&sr=c&si=166d5154-b801-410b-a226-ee2f8eac1929&sig=P2iNZJAvAWpp%2Bj9yV6TQjoz5DIIaj7ve8ARynmEM6Xk%3D&se=2015-02-14T01:13:05Z

    https://storagetestaccount001.blob.core.windows.net/asset-38058602-a4b8-4b33-b9f0-6880dc1490ea/BigBuckBunny_AAC_und_ch2_96kbps.mp4?sv=2012-02-12&sr=c&si=166d5154-b801-410b-a226-ee2f8eac1929&sig=P2iNZJAvAWpp%2Bj9yV6TQjoz5DIIaj7ve8ARynmEM6Xk%3D&se=2015-02-14T01:13:05Z

    https://storagetestaccount001.blob.core.windows.net/asset-38058602-a4b8-4b33-b9f0-6880dc1490ea/BigBuckBunny_AAC_und_ch2_56kbps.mp4?sv=2012-02-12&sr=c&si=166d5154-b801-410b-a226-ee2f8eac1929&sig=P2iNZJAvAWpp%2Bj9yV6TQjoz5DIIaj7ve8ARynmEM6Xk%3D&se=2015-02-14T01:13:05Z


To stream your video, paste your URL in the URL textbox in the [Azure Media Services Player](https://aka.ms/azuremediaplayer).

To test progressive download, paste a URL into a browser (for example, Internet Explorer, Chrome, or Safari).

For more information, see the following topics:

- [Playing your content with existing players](media-services-playback-content-with-existing-players.md)
- [Develop video player applications](media-services-develop-video-players.md)
- [Embedding an MPEG-DASH Adaptive Streaming Video in an HTML5 Application with DASH.js](media-services-embed-mpeg-dash-in-html5.md)

## Download sample
The following code sample contains the code that you created in this tutorial: [sample](https://azure.microsoft.com/documentation/samples/media-services-dotnet-on-demand-encoding-with-media-encoder-standard/).

## Next Steps

[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]



<!-- Anchors. -->


<!-- URLs. -->
[Web Platform Installer]: https://go.microsoft.com/fwlink/?linkid=255386
[Portal]: https://portal.azure.com/
