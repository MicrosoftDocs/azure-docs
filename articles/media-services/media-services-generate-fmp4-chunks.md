---
title: Create an Azure Media Services encoding task that generates fMP4 chunks | Microsoft Docs
description: This topic shows how to create an encoding task that generates fMP4 chunks. When this task is used with the Media Encoder Standard or Media Encoder Premium Workflow encoder, the output asset will contain fMP4 chunks instead of ISO MP4 files.
services: media-services
documentationcenter: ''
author: juliako
manager: erikre
editor: ''

ms.assetid: b7029ac5-eadd-4a2f-8111-1fc460828981
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/29/2016
ms.author: juliako

---
#  Create an encoding task that generates fMP4 chunks

## Overview

This topic shows how to create an encoding task that generates fragmented MP4 (fMP4) chunks instead of ISO MP4 files. To generate fMP4 chunks, use the **Media Encoder Standard** or **Media Encoder Premium Workflow** encoder to create an encoding task and also specify **AssetFormatOption.AdaptiveStreaming** option, as shown in this code snippet:  
	
	task.OutputAssets.AddNew(@"Output Asset containing fMP4 chunks", 
			options: AssetCreationOptions.None, 
			formatOption: AssetFormatOption.AdaptiveStreaming);


## <a id="encoding_with_dotnet"></a>Encoding with Media Services .NET SDK

The following code example uses Media Services .NET SDK to perform the following tasks:

- Create an encoding job.
- Get a reference to the **Media Encoder Standard** encoder.
- Add an encoding task to the job and specify to use the **Adaptive Streaming** preset. 
- Create an output asset that will contain fMP4 chunks and an .ism file.
- Add an event handler to check the job progress.
- Submit the job.

		using System;
		using System.Configuration;
		using System.IO;
		using System.Linq;
		using Microsoft.WindowsAzure.MediaServices.Client;
		using System.Threading;

		namespace AdaptiveStreaming
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
			    // It is also specified to use AssetFormatOption.AdaptiveStreaming, 
			    // which means the output asset will contain fMP4 chunks.

			    task.OutputAssets.AddNew(@"Output Asset containing fMP4 chunks",
				    options: AssetCreationOptions.None,
				    formatOption: AssetFormatOption.AdaptiveStreaming);

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

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

## See Also
[Media Services Encoding Overview](media-services-encode-asset.md)

