<properties
	pageTitle="Hyperlapse Media Files with Azure Media Hyperlapse"
	description="Azure Media Hyperlapse creates smooth time-lapsed videos from first-person or action-camera content. This topic shows how to use Media Indexer."
	services="media-services"
	documentationCenter=""
	authors="asolanki"
	manager="johndeu"
	editor=""/>

<tags
	ms.service="media-services"
	ms.workload="media"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="06/22/2016"  
	ms.author="adsolank"/>


# Hyperlapse Media Files with Azure Media Hyperlapse

Azure Media Hyperlapse is a Media Processor (MP) that creates smooth time-lapsed videos from first-person or action-camera content.  The cloud-based sibling to [Microsoft Research's desktop Hyperlapse Pro and phone-based Hyperlapse Mobile](http://aka.ms/hyperlapse), Microsoft Hyperlapse for Azure Media Services utilizes the massive scale of the Azure Media Services Media Processing platform to horizontally scale and parallelize bulk Hyperlapse processing.

>[AZURE.IMPORTANT]Microsoft Hyperlapse is designed to work best on first-person content with a moving camera.  Although still-camera footage can still work, the performance and quality of the Azure Media Hyperlapse Media Processor cannot be guaranteed for other types of content.  To learn more about Microsoft Hyperlapse for Azure Media Services and see some example videos, check out the [introductory blog post](http://aka.ms/azurehyperlapseblog) from the public preview.

An Azure Media Hyperlapse job takes as input an MP4, MOV, or WMV asset file along with a configuration file that specifies which frames of video should be time-lapsed and to what speed (e.g. first 10,000 frames at 2x).  The output is a stabilized and time-lapsed rendition of the input video.

For the latest Azure Media Hyperlapse updates, see [Media Services blogs](https://azure.microsoft.com/blog/topics/media-services/).

## Hyperlapse an asset

First you will need to upload your desired input file to Azure Media Services.  To learn more about the concepts involved with uploading and managing content, read the [content management article](media-services-manage-content.md#upload).

###  <a id="configuration"></a>Configuration Preset for Hyperlapse

Once your content is in your Media Services account, you will need to construct your configuration preset.  The following table explains the user-specified fields:

 Field | Description
-------|-------------
StartFrame|The frame upon which the Microsoft Hyperlapse processing should begin.
NumFrames|The number of frames to process
Speed|The factor with which to speed up the input video.

The following is an example of a conformant configuration file in XML and JSON:

**XML preset:**

	<?xml version="1.0" encoding="utf-16"?>
	<Preset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" Version="1.0" xmlns="http://www.windowsazure.com/media/encoding/Preset/2014/03">
		<Sources>
			<Source StartFrame="0" NumFrames="10000" />
		</Sources>
		<Options>
			<Speed>12</Speed>
		</Options>
	</Preset>

**JSON preset:**

	{
		"Version":1.0,
		"Sources": [
			{
				"StartFrame":0,
				"NumFrames":2147483647
			}
		],
		"Options": {
			"Speed":1,
			"Stabilize":false
		}
	}

###  <a id="sample_code"></a> Microsoft Hyperlapse with the AMS .NET SDK

The following method uploads a media file as an asset and creates a job with the Azure Media Hyperlapse Media Processor.  

> [AZURE.NOTE] You should already have a CloudMediaContext in scope with the name "context" for this code to work.  To learn more about this, read the [content management article](media-services-manage-content.md).

> [AZURE.NOTE] The string argument "hyperConfig" is expected to be a conformant configuration preset in either JSON or XML as described above.

	static bool RunHyperlapseJob(string input, string output, string hyperConfig)
	{
		// create asset with input file
		IAsset asset = context
					   .Assets
					   .CreateAssetAndUploadSingleFile(input, "My Hyperlapse Input", AssetCreationOptions.None);

		// grab instances of Azure Media Hyperlapse MP
		IMediaProcessor mp = context
							 .MediaProcessors
							 .GetLatestMediaProcessorByName("Azure Media Hyperlapse");

		// create Job with Hyperlapse task
		IJob job = context
				   .Jobs
				   .Create(String.Format("Hyperlapse {0}", input));

		if (String.IsNullOrEmpty(hyperConfig))
		{
			// config cannot be empty
			return false;
		}

		hyperConfig = File.ReadAllText(hyperConfig);

		ITask hyperlapseTask = job.Tasks.AddNew("Hyperlapse task",
												mp,
												hyperConfig,
												TaskOptions.None);
		hyperlapseTask.InputAssets.Add(asset);
		hyperlapseTask.OutputAssets.AddNew("Hyperlapse output",
											AssetCreationOptions.None);


		job.Submit();

		// Create progress printing and querying tasks
			Task progressPrintTask = new Task(() =>
			{

				IJob jobQuery = null;
				do
				{
					var progressContext = context;
					jobQuery = progressContext.Jobs
											  .Where(j => j.Id == job.Id)
											  .First();
					Console.WriteLine(string.Format("{0}\t{1}\t{2}",
									  DateTime.Now,
									  jobQuery.State,
									  jobQuery.Tasks[0].Progress));
					Thread.Sleep(10000);
				}
				while (jobQuery.State != JobState.Finished &&
					   jobQuery.State != JobState.Error &&
					   jobQuery.State != JobState.Canceled);
			});
			progressPrintTask.Start();

			Task progressJobTask = job.GetExecutionProgressTask(
												 CancellationToken.None);
			progressJobTask.Wait();

			// If job state is Error, the event handling
			// method for job progress should log errors.  Here we check
			// for error state and exit if needed.
			if (job.State == JobState.Error)
			{
				ErrorDetail error = job.Tasks.First().ErrorDetails.First();
				Console.WriteLine(string.Format("Error: {0}. {1}",
												error.Code,
												error.Message));  
				return false;                  
			}

		DownloadAsset(job.OutputMediaAssets.First(), output);
		return true;
	}

	static void DownloadAsset(IAsset asset, string outputDirectory)
	{
		foreach (IAssetFile file in asset.AssetFiles)
		{
			file.Download(Path.Combine(outputDirectory, file.Name));
		}
	}


	static IAsset CreateAssetAndUploadSingleFile(string filePath, string assetName, AssetCreationOptions options)
	{
	    IAsset asset = context.Assets.Create(assetName, options);

	    var assetFile = asset.AssetFiles.Create(Path.GetFileName(filePath));
	    assetFile.Upload(filePath);

	    return asset;
	}

	static IMediaProcessor GetLatestMediaProcessorByName(string mediaProcessorName)
	{
	    var processor = context.MediaProcessors
	    .Where(p => p.Name == mediaProcessorName)
	    .ToList()
	    .OrderBy(p => new Version(p.Version))
	    .LastOrDefault();

	    if (processor == null)
	        throw new ArgumentException(string.Format("Unknown media processor",
	                                                   mediaProcessorName));

	    return processor;
	}

### <a id="file_types"></a>Supported File types

- MP4
- MOV
- WMV



##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]


##Related links

[Azure Media Services Analytics Overview](media-services-analytics-overview.md)

[Azure Media Analytics demos](http://azuremedialabs.azurewebsites.net/demos/Analytics.html)
