<properties
	pageTitle="Get started with delivering content on demand using .NET SDK"
	description="This tutorial walks you through the steps of implementing an on demand content delivery application with Azure Media Services using .NET."
	services="media-services"
	documentationCenter=""
	authors="Juliako"
	manager="erikre"
	editor=""/>

<tags
	ms.service="media-services"
	ms.workload="media"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="hero-article"
 	ms.date="07/18/2016"
	ms.author="juliako"/>


# Get started with delivering content on demand using .NET SDK


[AZURE.INCLUDE [media-services-selector-get-started](../../includes/media-services-selector-get-started.md)]


>[AZURE.NOTE]
> To complete this tutorial, you need an Azure account. For details, see [Azure Free Trial](/pricing/free-trial/?WT.mc_id=A261C142F). 
 
##Overview 

This tutorial walks you through the steps of implementing a Video-on-Demand (VoD) content delivery application using Azure Media Services (AMS) SDK for .NET.


The tutorial introduces the basic Media Services workflow and the most common programming objects and tasks required for Media Services development. At the completion of the tutorial, you will be able to stream or progressively download a sample media file that you uploaded, encoded, and downloaded.

## What you'll learn

The tutorial show how to accomplish the following tasks:

1.  Create a Media Services account (using the Azure Classic Portal).
2.  Configure streaming endpoint (using the portal).
3.  Create and configure a Visual Studio project.
5.  Connect to the Media Services account.
6.  Create a new asset and upload a video file.
7.  Encode the source file into a set of adaptive bitrate MP4 files.
8.  Publish the asset and get URLs for streaming and progressive download.
9.  Test by playing your content.

## Prerequisites

The following are required to complete the tutorial.

- To complete this tutorial, you need an Azure account. 
	
	If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](/pricing/free-trial/?WT.mc_id=A261C142F). You get credits that can be used to try out paid Azure services. Even after the credits are used up, you can keep the account and use free Azure services and features, such as the Web Apps feature in Azure App Service.
- Operating Systems: Windows 8 or later, Windows 2008 R2, Windows 7.
- .NET Framework 4.0 or later
- Visual Studio 2010 SP1 (Professional, Premium, Ultimate, or Express) or later versions.


##Download sample

Get and run a sample from [here](https://azure.microsoft.com/documentation/samples/media-services-dotnet-on-demand-encoding-with-media-encoder-standard/).

##Create a Media Services account using the portal

1. In the Azure Classic Portal, click **New**, click **Media Service**, and then click **Quick Create**.

	![Media Services Quick Create](./media/media-services-dotnet-get-started/wams-QuickCreate.png)

2. In **NAME**, enter the name of the new account. A Media Services account name is all lower-case numbers or letters with no spaces, and is 3 - 24 characters in length.

3. In **REGION**, select the geographic region that will be used to store the metadata records for your Media Services account. Only the available Media Services regions appear in the drop-down list.

4. In **STORAGE ACCOUNT**, select a storage account to provide blob storage of the media content from your Media Services account. You can select an existing storage account in the same geographic region as your Media Services account, or you can create a new storage account. A new storage account is created in the same region.

5. If you created a new storage account, in **NEW STORAGE ACCOUNT NAME**, enter a name for the storage account. The rules for storage account names are the same as for Media Services accounts.

6. Click **Quick Create** at the bottom of the form.

You can monitor the status of the process in the message area at the bottom of the window.

Once your account is successfully created, the status changes to **Active**.

At the bottom of the page, the **MANAGE KEYS** button appears. When you click this button, a dialog with the Media Services account name and the primary and secondary keys is displayed. You will need the account name and the primary key information to programmatically access the Media Services account.

![Media Services Page](./media/media-services-dotnet-get-started/wams-mediaservices-page.png)

When you double-click on the account name, the **Quickstart** page is displayed by default. This page enables you to do some management tasks that are also available on other pages of the portal. For example, you can upload a video file from this page or do it from the CONTENT page.

##Configure streaming endpoint using the portal

When working with Azure Media Services, one of the most common scenarios is delivering adaptive bitrate streaming to your clients. With adaptive bitrate streaming, the client can switch to a higher or lower bitrate stream as the video is displayed based on the current network bandwidth, CPU utilization, and other factors. Media Services supports the following adaptive bitrate streaming technologies: HTTP Live Streaming (HLS), Smooth Streaming, MPEG DASH, and HDS (for Adobe PrimeTime/Access licensees only).

Media Services provides dynamic packaging which allows you to deliver your adaptive bitrate MP4 or Smooth Streaming encoded content in streaming formats supported by Media Services (MPEG DASH, HLS, Smooth Streaming, HDS) without you having to re-package into these streaming formats.

To take advantage of dynamic packaging, you need to do the following:

- Encode or transcode your mezzanine (source) file into a set of adaptive bitrate MP4 files or adaptive bitrate Smooth Streaming files (the encoding steps are demonstrated later in this tutorial),
- Get at least one streaming unit for the **streaming endpoint** from which you plan to delivery your content.

With dynamic packaging, you only need to store and pay for the files in single storage format, and Media Services will build and serve the appropriate response based on requests from a client.

To change the number of streaming reserved units, do the following:

1. In the [portal](https://manage.windowsazure.com/), click **Media Services**. Then, click the name of the media service.

2. Select the STREAMING ENDPOINTS page. Then, click on the streaming endpoint that you want to modify.

3. To specify the number of streaming units, click the SCALE tab, and then move the **reserved capacity** slider.

	![Scale page](./media/media-services-dotnet-get-started/media-services-origin-scale.png)

4. Press **SAVE** to save your changes.

The allocation of any new units takes around 20 minutes to complete.

>[AZURE.NOTE] Currently, going from any positive value of streaming units back to none can disable streaming for up to an hour.
>
> The highest number of units specified for the 24-hour period is used in calculating the cost. For information about pricing details, see [Media Services pricing details](http://go.microsoft.com/fwlink/?LinkId=275107).



##Create and configure a Visual Studio project

1. Create a new C# Console Application in Visual Studio 2013, Visual Studio 2012, or Visual Studio 2010 SP1. Enter the **Name**, **Location**, and **Solution name**, and then click **OK**.

2. Use the  [windowsazure.mediaservices.extensions](https://www.nuget.org/packages/windowsazure.mediaservices.extensions) Nuget package to install **Azure Media Services .NET SDK Extensions**.  The Media Services .NET SDK Extensions is a set of extension methods and helper functions that will simplify your code and make it easier to develop with Media Services. Installing this package, also installs **Media Services .NET SDK** and adds all other required dependencies.

3. Add a reference to System.Configuration assembly. This assembly contains the **System.Configuration.ConfigurationManager** class that is used to access configuration files, for example, App.config.

4. Open the App.config file (add the file to your project if it was not added by default) and add an *appSettings* section to the file. Set the values for your Azure Media Services account name and account key, as shown in the following example. To obtain the account name and key information, open the Azure Classic Portal, select your media services account, and then click the **MANAGE KEYS** button.

		<configuration>
		...
		  <appSettings>
		    <add key="MediaServicesAccountName" value="Media-Services-Account-Name" />
		    <add key="MediaServicesAccountKey" value="Media-Services-Account-Key" />
		  </appSettings>
		  
		</configuration>

5. Overwrite the existing **using** statements at the beginning of the Program.cs file with the following code.

		using System;
		using System.Collections.Generic;
		using System.Linq;
		using System.Text;
		using System.Threading.Tasks;
		using System.Configuration;
		using System.Threading;
		using System.IO;
		using Microsoft.WindowsAzure.MediaServices.Client;
		

6. Create a new folder under the projects directory and copy an .mp4 or .wmv file that you want to encode and stream or progressively download. In this example, the "C:\VideoFiles" path is used.

##Connect to the Media Services account

When using Media Services with .NET, you must use the **CloudMediaContext** class for most Media Services programming tasks: connecting to Media Services account; creating, updating, accessing, and deleting the following objects: assets, asset files, jobs, access policies, locators, etc.

Overwrite the default Program class with the following code. The code demonstrates how to read the connection values from the App.config file and how to create the **CloudMediaContext** object in order to connect to Media Services. For more information about connecting to Media Services, see [Connecting to Media Services with the Media Services SDK for .NET](http://msdn.microsoft.com/library/azure/jj129571.aspx).

The **Main** function calls methods that will be defined further in this section.

    class Program
    {
        // Read values from the App.config file.
        private static readonly string _mediaServicesAccountName =
            ConfigurationManager.AppSettings["MediaServicesAccountName"];
        private static readonly string _mediaServicesAccountKey =
            ConfigurationManager.AppSettings["MediaServicesAccountKey"];

        // Field for service context.
        private static CloudMediaContext _context = null;
        private static MediaServicesCredentials _cachedCredentials = null;

        static void Main(string[] args)
        {
            try
            {
                // Create and cache the Media Services credentials in a static class variable.
                _cachedCredentials = new MediaServicesCredentials(
                                _mediaServicesAccountName,
                                _mediaServicesAccountKey);
                // Used the chached credentials to create CloudMediaContext.
                _context = new CloudMediaContext(_cachedCredentials);

                // Add calls to methods defined in this section.

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

##Create a new asset and upload a video file

In Media Services, you upload (or ingest) your digital files into an asset. The **Asset** entity can contain video, audio, images, thumbnail collections, text tracks, and closed caption files (and the metadata about these files.)  Once the files are uploaded, your content is stored securely in the cloud for further processing and streaming. The files in the asset are called **Asset Files**.

The **UploadFile** method defined below calls **CreateFromFile** (defined in .NET SDK Extensions). **CreateFromFile** creates a new asset into which the specified source file is uploaded.

The **CreateFromFile** method takes **AssetCreationOptions** which lets you specify one of the following asset creation options:

- **None** - No encryption is used. This is the default value. Note that when using this option, your content is not protected in transit or at rest in storage.
If you plan to deliver an MP4 using progressive download, use this option.
- **StorageEncrypted** - Use this option to encrypt your clear content locally using Advanced Encryption Standard (AES)-256 bit encryption, which then uploads it to Azure Storage where it is stored encrypted at rest. Assets protected with Storage Encryption are automatically unencrypted and placed in an encrypted file system prior to encoding, and optionally re-encrypted prior to uploading back as a new output asset. The primary use case for Storage Encryption is when you want to secure your high-quality input media files with strong encryption at rest on disk.
- **CommonEncryptionProtected** - Use this option if you are uploading content that has already been encrypted and protected with Common Encryption or PlayReady DRM (for example, Smooth Streaming protected with PlayReady DRM).
- **EnvelopeEncryptionProtected** – Use this option if you are uploading HLS encrypted with AES. Note that the files must have been encoded and encrypted by Transform Manager.

The **CreateFromFile** method also lets you specify a callback in order to report the upload progress of the file.

In the following example, we specify **None** for the asset options.

Add the following method to the Program class.

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


##Encode the source file into a set of adaptive bitrate MP4 files

After ingesting assets into Media Services, media can be encoded, transmuxed, watermarked, and so on, before it is delivered to clients. These activities are scheduled and run against multiple background role instances to ensure high performance and availability. These activities are called Jobs, and each Job is comprised of atomic Tasks that do the actual work on the Asset file.

As was mentioned earlier, when working with Azure Media Services, one of the most common scenarios is delivering adaptive bitrate streaming to your clients. Media Services can dynamically package a set of adaptive bitrate MP4 files into one of the following formats: HTTP Live Streaming (HLS), Smooth Streaming, MPEG DASH, and HDS (for Adobe PrimeTime/Access licensees only).

To take advantage of dynamic packaging, you need to do the following:

- Encode or transcode your mezzanine (source) file into a set of adaptive bitrate MP4 files or adaptive bitrate Smooth Streaming files.  
- Get at least one streaming unit for the streaming endpoint from which you plan to delivery your content.

The following code shows how to submit an encoding job. The job contains one task that specifies to transcode the mezzanine file into a set of adaptive bitrate MP4s using **Media Encoder Standard**. The code submits the job and waits until it is completed.

Once the job is completed, you would be able to stream your asset or progressively download MP4 files that were created as a result of transcoding.
Note that you do not need to have more than 0 streaming units in order to progressively download MP4 files.

Add the following method to the Program class.

	static public IAsset EncodeToAdaptiveBitrateMP4s(IAsset asset, AssetCreationOptions options)
	{
	
	    // Prepare a job with a single task to transcode the specified asset
	    // into a multi-bitrate asset.
	
	    IJob job = _context.Jobs.CreateWithSingleTask(
	        "Media Encoder Standard",
	        "H264 Multiple Bitrate 720p",
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

##Publish the asset and get URLs for streaming and progressive download

To stream or download an asset, you first need to "publish" it by creating a locator. Locators provide access to files contained in the asset. Media Services supports two types of locators: OnDemandOrigin locators, used to stream media (for example, MPEG DASH, HLS, or Smooth Streaming) and Access Signature (SAS) locators, used to download media files.

After you create the locators, you can build the URLs that are used to stream or download your files.


A streaming URL for Smooth Streaming has the following format:

	 {streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest

A streaming URL for HLS has the following format:

	 {streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=m3u8-aapl)

A streaming URL for MPEG DASH has the following format:

	{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=mpd-time-csf)

A SAS URL used to download files has the following format:

	{blob container name}/{asset name}/{file name}/{SAS signature}

Media Services .NET SDK extensions provide convenient helper methods that return formatted URLs for the published asset.

The following code uses .NET SDK Extensions to create locators and to get streaming and progressive download URLs. The code also shows how to download files to a local folder.

Add the following method to the Program class.

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

##Test by playing your content  

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


To stream you video, use [Azure Media Services Player](http://amsplayer.azurewebsites.net/azuremediaplayer.html).

To test progressive download, paste a URL into a browser (for example, Internet Explorer, Chrome, or Safari).


##Next Steps: Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]


### Looking for something else?

If this topic didn't contain what you were expecting, is missing something, or in some other way didn't meet your needs, please provide us with you feedback using the Disqus thread below.


<!-- Anchors. -->


<!-- URLs. -->
  [Web Platform Installer]: http://go.microsoft.com/fwlink/?linkid=255386
  [Portal]: http://manage.windowsazure.com/
