---
title: Use Azure Media Encoder Standard to auto-generate a bitrate ladder | Microsoft Docs
description: This topic shows how to use Media Encoder Standard (MES) to auto-generate a bitrate ladder based on the input resolution and bitrate. The input resolution and bitrate will never be exceeded. For example, if the input is 720p at 3Mbps, output will remain 720p at best, and will start at rates lower than 3Mbps.
services: media-services
documentationcenter: ''
author: juliako
manager: erikre
editor: ''

ms.assetid: 63ed95da-1b82-44b0-b8ff-eebd535bc5c7
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/06/2017
ms.author: juliako

---
#  Use Azure Media Encoder Standard to auto-generate a bitrate ladder

## Overview

This topic shows how to use Media Encoder Standard (MES) to auto-generate a bitrate ladder (bitrate-resolution pairs) based on the input resolution and bitrate. The auto-generated preset will never exceed the input resolution and bitrate. For example, if the input is 720p at 3Mbps, output will remain 720p at best, and will start at rates lower than 3Mbps.

To use this feature, you need to specify the **Adaptive Streaming** preset when creating an encoding task. When using the **Adaptive Streaming** preset, the MES encoder will intelligently cap a bitrate ladder. However, you will not be able to control the encoding costs, since the service determines how many layers to use and at what resolution. You can see examples of output layers produced by MES as a result of encoding with the **Adaptive Streaming** preset at the [end](#output) of this topic.

>[!NOTE]
> This preset should be used only when the intent is to produce a streamable output Asset. In particular, the output Asset will contain MP4 files where audio and video are not interleaved. If you need the output to contain MP4 files which have video and audio interleaved (for example, for use as a progressive download file), use one of the presets listed [in this section](media-services-mes-presets-overview.md).

## <a id="encoding_with_dotnet"></a>Encoding with Media Services .NET SDK

The following code example uses Media Services .NET SDK to perform the following tasks:

- Create an encoding job.
- Get a reference to the Media Encoder Standard encoder.
- Add an encoding task to the job and specify to use the **Adaptive Streaming** preset. 
- Create an output asset that will contain the encoded asset.
- Add an event handler to check the job progress.
- Submit the job.

		using System;
		using System.Configuration;
		using System.IO;
		using System.Linq;
		using Microsoft.WindowsAzure.MediaServices.Client;
		using System.Threading;

		namespace AdaptiveStreamingMESPresest
		{
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
			    // Create and cache the Media Services credentials in a static class variable.
			    _cachedCredentials = new MediaServicesCredentials(
					    _mediaServicesAccountName,
					    _mediaServicesAccountKey);
			    // Used the chached credentials to create CloudMediaContext.
			    _context = new CloudMediaContext(_cachedCredentials);

			    // Get an uploaded asset.
			    var asset = _context.Assets.FirstOrDefault();

			    // Encode and generate the output using the "Adaptive Streaming" preset.
			    EncodeToAdaptiveBitrateMP4Set(asset);

			    Console.ReadLine();
			}

			static public IAsset EncodeToAdaptiveBitrateMP4Set(IAsset asset)
			{
			    // Declare a new job.
			    IJob job = _context.Jobs.Create("Media Encoder Standard Job");

			    // Get a media processor reference, and pass to it the name of the 
			    // processor to use for the specific task.
			    IMediaProcessor processor = GetLatestMediaProcessorByName("Media Encoder Standard");

			    // Create a task
			    ITask task = job.Tasks.AddNew("Media Encoder Standard encoding task",
				processor,
				"Adaptive Streaming",
				TaskOptions.None);

			    // Specify the input asset to be encoded.
			    task.InputAssets.Add(asset);
			    // Add an output asset to contain the results of the job. 
			    // This output is specified as AssetCreationOptions.None, which 
			    // means the output asset is not encrypted. 
			    task.OutputAssets.AddNew("Output asset",
				AssetCreationOptions.None);

			    job.StateChanged += new EventHandler<JobStateChangedEventArgs>(JobStateChanged);
			    job.Submit();
			    job.GetExecutionProgressTask(CancellationToken.None).Wait();

			    return job.OutputMediaAssets[0];
			}
			private static void JobStateChanged(object sender, JobStateChangedEventArgs e)
			{
			    Console.WriteLine("Job state changed event:");
			    Console.WriteLine("  Previous state: " + e.PreviousState);
			    Console.WriteLine("  Current state: " + e.CurrentState);
			    switch (e.CurrentState)
			    {
				case JobState.Finished:
				    Console.WriteLine();
				    Console.WriteLine("Job is finished. Please wait while local tasks or downloads complete...");
				    break;
				case JobState.Canceling:
				case JobState.Queued:
				case JobState.Scheduled:
				case JobState.Processing:
				    Console.WriteLine("Please wait...\n");
				    break;
				case JobState.Canceled:
				case JobState.Error:

				    // Cast sender as a job.
				    IJob job = (IJob)sender;

				    // Display or log error details as needed.
				    break;
				default:
				    break;
			    }
			}
			private static IMediaProcessor GetLatestMediaProcessorByName(string mediaProcessorName)
			{
			    var processor = _context.MediaProcessors.Where(p => p.Name == mediaProcessorName).
			    ToList().OrderBy(p => new Version(p.Version)).LastOrDefault();

			    if (processor == null)
				throw new ArgumentException(string.Format("Unknown media processor", mediaProcessorName));

			    return processor;
			}

		    }

		}

## <a id="output"></a>Output

This section shows three examples of output layers produced by MES as a result of encoding with the **Adaptive Streaming** preset. 

### Example 1
Source with height "1080" and framerate "29.970" procuces 6 video layers:

|Layer|Height|Width|Bitrate(kbps)|
|---|---|---|---|
|1|1080|1920|6780|
|2|720|1280|3520|
|3|540|960|2210|
|4|360|640|1150|
|5|270|480|720|
|6|180|320|380|

### Example 2
Source with height "720" and framerate "23.970" procuces 5 video layers:

|Layer|Height|Width|Bitrate(kbps)|
|---|---|---|---|
|1|720|1280|2940|
|2|540|960|1850|
|3|360|640|960|
|4|270|480|600|
|5|180|320|320|

### Example 3
Source with height "360" and framerate "29.970" procuces 3 video layers:

|Layer|Height|Width|Bitrate(kbps)|
|---|---|---|---|
|1|360|640|700|
|2|270|480|440|
|3|180|320|230|
## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

## See Also
[Media Services Encoding Overview](media-services-encode-asset.md)

