<properties
	pageTitle="Hyperlapse Media Files with Azure Media Hyperlapse"
	description="Azure Media Hyperlapse creates smooth time-lapsed videos from first-person or action-camera content. This topic shows how to use Media Indexer."
	services="media-services"
	documentationCenter=""
	authors="adsolank"
	manager="johndeu"
	editor=""/>

<tags
	ms.service="media-services"
	ms.workload="media"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="10/19/2015"   
	ms.author="adsolank"/>


# Hyperlapse Media Files with Azure Media Hyperlapse

Azure Media Hyperlapse creates smooth time-lapsed videos from first-person or action-camera content.  Related to [Microsoft Research's Hyperlapse Pro and Hyperlapse Mobile](http://aka.ms/hyperlapse), Microsoft Hyperlapse for Azure Media Services utilizes the ultrascale of the Azure Media Services Media Processing platform to horizontally scale out Hyperlapse processing.

>[AZURE.IMPORTANT] Microsoft Hyperlapse is designed to work on first-person content with a moving camera.  The performance and quality of the Azure Media Hyperlapse Media Processor cannot be guaranteed for other types of content.  To learn more about Microsoft Hyperlapse for Azure Media Services and see some example videos, check out the [introductory blog post](http://aka.ms/azurehyperlapseblog) from the public preview.

An Azure Media Hyperlapse job takes as input an MP4, MOV, or WMV asset file along with a configuration file that specifies which frames of video should be time-lapsed and to what speed (e.g. first 10,000 frames at 2x).  The output is a stabilized and time-lapsed rendition of the input video.

For the latest Azure Media Hyperlapse updates, see [Media Services blogs](http://azure.microsoft.com/blog/topics/media-services/).

## Hyperlapse an asset

First you will need to upload your desired input file to Azure Media Services.  To learn more about the concepts involved with uploading and managing content, read the [content management article](media-services-manage-content.md#upload).

### Configuration Preset for Hyperlapse

Once your content is in your Media Services account, you will need to construct your configuration preset.  The following table explains the user-specified fields:

<table border="1">
<tr>
  <th>Field</th>
  <th>Description</th>
</tr>
<tr>
  <td>StartFrame </td>
  <td>The frame upon which the Microsoft Hyperlapse processing should begin.</td>
</tr>
<tr>
  <td>NumFrames</td>
  <td>The number of frames to process with Microsoft Hyperlapse</td>
</tr>
<tr>
  <td>Speed</td>
  <td>The factor with which to speed up the input video.  Must be greater than 1.</td>
</tr>
</table>

The following is an example of a conformant configuration file in XML and JSON:

**XML preset:**

	<?xml version="1.0" encoding="utf-16"?>
	<Preset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" Version="1.0" xmlns="http://www.windowsazure.com/media/encoding/Preset/2014/03">
		<Sources>
			<Source StartFrame="0" NumFrames="10000">
				<InputFiles />
			</Source>
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
				"InputFiles":[],
				"StartFrame":0,
				"NumFrames":2147483647
			}
		],
		"Options": {
			"Speed":1,
			"Stabilize":false
		}
	}

### Microsoft Hyperlapse with the AMS .NET SDK

The following method uploads a media file as an asset and creates a job with the Azure Media Hyperlapse Media Processor.  
>Note: you should already have a CloudMediaContext in scope with the name "context" for this code to work.  To learn more about this, read the [content management article](media-services-manage-content.md).

	static void RunHyperlapseJob(string input, string output, string hyperConfig)
	{
		// create asset with input file
		IAsset asset = context
					   .Assets
					   .CreateFromFile(input, AssetCreationOptions.None);

		// grab instances of Azure Media Hyperlapse MP
		IMediaProcessor mp = context
							 .MediaProcessors
							 .GetLatestMediaProcessorByName("Azure Media Hyperlapse");

		// create Job with two chained tasks: hyperlapse and encoding for streaming
		IJob job = context
				   .Jobs
				   .Create(String.Format("Hyperlapse {0}", input));

		if (!String.IsNullOrEmpty(hyperConfig))
		{
			hyperConfig = File.ReadAllText(hyperConfig);
		}
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
					var progressContext = _context;
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
			}

		DownloadAsset(job.OutputMediaAssets.First(), output);
	}

	static void DownloadAsset(IAsset asset, string outputDirectory)
	{
		foreach (IAssetFile file in asset.AssetFiles)
		{
			file.Download(Path.Combine(outputDirectory, file.Name));
		}
	}


	static bool RunHyperlapseJob(string inputMediaFilePath, string outputFolder, string configurationFile = "")
	{
	    // Create an asset and upload the input media file to storage.
	    IAsset asset = CreateAssetAndUploadSingleFile(inputMediaFilePath,
	        "My Indexing Input Asset",
	        AssetCreationOptions.None);

	    // Declare a new job.
	    IJob job = _context.Jobs.Create("My Indexing Job");

	    // Get a reference to the Azure Media Indexer.
	    string MediaProcessorName = "Azure Media Indexer",
	    IMediaProcessor processor = GetLatestMediaProcessorByName(MediaProcessorName);

	    // Read configuration from file if specified.
	    string configuration = string.IsNullOrEmpty(configurationFile) ? "" : File.ReadAllText(configurationFile);

	    // Create a task with the encoding details, using a string preset.
	    ITask task = job.Tasks.AddNew("My Indexing Task",
	        processor,
	        configuration,
	        TaskOptions.None);

	    // Specify the input asset to be indexed.
	    task.InputAssets.Add(asset);

	    // Add an output asset to contain the results of the job.
	    task.OutputAssets.AddNew("My Indexing Output Asset", AssetCreationOptions.None);

	    // Use the following event handler to check job progress.  
	    job.StateChanged += new EventHandler<JobStateChangedEventArgs>(StateChanged);

	    // Launch the job.
	    job.Submit();

	    // Check job execution and wait for job to finish.
	    Task progressJobTask = job.GetExecutionProgressTask(CancellationToken.None);
	    progressJobTask.Wait();

	    // If job state is Error, the event handling
	    // method for job progress should log errors.  Here we check
	    // for error state and exit if needed.
	    if (job.State == JobState.Error)
	    {
	        Console.WriteLine("Exiting method due to job error.");
	        return false;
	    }

	    // Download the job outputs.
	    DownloadAsset(task.OutputAssets.First(), outputFolder);

	    return true;
	}

	static IAsset CreateAssetAndUploadSingleFile(string filePath, string assetName, AssetCreationOptions options)
	{
	    IAsset asset = _context.Assets.Create(assetName, options);

	    var assetFile = asset.AssetFiles.Create(Path.GetFileName(filePath));
	    assetFile.Upload(filePath);

	    return asset;
	}

	static void DownloadAsset(IAsset asset, string outputDirectory)
	{
	    foreach (IAssetFile file in asset.AssetFiles)
	    {
	        file.Download(Path.Combine(outputDirectory, file.Name));
	    }
	}

	static IMediaProcessor GetLatestMediaProcessorByName(string mediaProcessorName)
	{
	    var processor = _context.MediaProcessors
	    .Where(p => p.Name == mediaProcessorName)
	    .ToList()
	    .OrderBy(p => new Version(p.Version))
	    .LastOrDefault();

	    if (processor == null)
	        throw new ArgumentException(string.Format("Unknown media processor",
	                                                   mediaProcessorName));

	    return processor;
	}

### <a id="output_files"></a>Output files

By default, an indexing job generates the following output files. The files will be stored in the first output asset.


<table border="1">
<tr><th>File name</th><th>Description</th></tr>
<tr><td>InputFileName.aib </td>
<td>Audio indexing blob file.<br/><br/>
Audio Indexing Blob (AIB) file is a binary file that can be searched in Microsoft SQL server using full text search.  The AIB file is more powerful than the simple caption files, because it contains alternatives for each word, allowing a much richer search experience.
<br/>
<br/>
It requires the installation of the Indexer SQL add-on on a machine running Microsoft SQL server 2008 or later. Searching the AIB using Microsoft SQL server full text search provides more accurate search results than searching the closed caption files generated by WAMI. This is because the AIB contains word alternatives which sound similar whereas the closed caption files contain the highest confidence word for each segment of the audio. If searching for spoken words is of upmost importance, then it is recommended to use the AIB In conjunction with Microsoft SQL Server.
<br/><br/>
To download the add-on, click <a href="http://aka.ms/indexersql">Azure Media Indexer SQL Add-on</a>.
<br/><br/>
It is also possible to utilize other search engines such as Apache Lucene/Solr to simply index the video based on the closed caption and keyword XML files, but this will result in less accurate search results.</td></tr>
<tr><td>InputFileName.smi<br/>InputFileName.ttml<br/>InputFileName.vtt</td>
<td>Closed Caption (CC) files in SAMI, TTML, and WebVTT formats.
<br/><br/>
They can be used to make audio and video files accessible to people with hearing disability.
<br/><br/>
Closed Caption files include a tag called <b>Recognizability</b> which scores an indexing job based on how recognizable the speech in the source video is.  You can use the value of <b>Recognizability</b> to screen output files for usability. A low score would mean poor indexing results due to audio quality.</td></tr>
<tr><td>InputFileName.kw.xml
<br/>
InputFileName.info
</td>
<td>Keyword and info files.
<br/><br/>
Keyword file is an XML file that contains keywords extracted from the speech content, with frequency and offset information.
<br/><br/>
Info file is a plain-text file which contains granular information about each term recognized.  The first line is speical and contains the Recognizability score.  Each subsequent line is a tab-separated lits of the following data: start time, end time, word/phrase, confidence.  The times are given in seconds and the confidence is given as a number from 0-1.  <br/><br/>Example line: "1.20 &nbsp;&nbsp;&nbsp;1.45 &nbsp;&nbsp;&nbsp;word &nbsp;&nbsp;&nbsp;0.67"
<br/><br/>
These files can be used for a number of purposes, such as, to perform speech analytics, or exposed to search engines such as Bing, Google or Microsoft SharePoint to make the media files more discoverable, or even used to deliver more relevant ads.</td></tr>
</table>

If not all input media files are indexed successfully, the indexing job will fail with error code 4000. For more information, see [Error codes](#error_codes).

## Index multiple files

The following method uploads multiple media files as an asset, and creates a job to index all these files in a batch.

A manifest file with the .lst extension is created and uploading into the asset. The manifest file contains the list of all the asset files. For more information, see [Task Preset for Azure Media Indexer](https://msdn.microsoft.com/library/azure/dn783454.aspx).

	static bool RunBatchIndexingJob(string[] inputMediaFiles, string outputFolder)
	{
	    // Create an asset and upload to storage.
	    IAsset asset = CreateAssetAndUploadMultipleFiles(inputMediaFiles,
	        "My Indexing Input Asset - Batch Mode",
	        AssetCreationOptions.None);

	    // Create a manifest file that contains all the asset file names and upload to storage.
	    string manifestFile = "input.lst";            
	    File.WriteAllLines(manifestFile, asset.AssetFiles.Select(f => f.Name).ToArray());
	    var assetFile = asset.AssetFiles.Create(Path.GetFileName(manifestFile));
	    assetFile.Upload(manifestFile);

	    // Declare a new job.
	    IJob job = _context.Jobs.Create("My Indexing Job - Batch Mode");

	    // Get a reference to the Azure Media Indexer.
	    string MediaProcessorName = "Azure Media Indexer";
	    IMediaProcessor processor = GetLatestMediaProcessorByName(MediaProcessorName);

	    // Read configuration.
	    string configuration = File.ReadAllText("batch.config");

	    // Create a task with the encoding details, using a string preset.
	    ITask task = job.Tasks.AddNew("My Indexing Task - Batch Mode",
	        processor,
	        configuration,
	        TaskOptions.None);

	    // Specify the input asset to be indexed.
	    task.InputAssets.Add(asset);

	    // Add an output asset to contain the results of the job.
	    task.OutputAssets.AddNew("My Indexing Output Asset - Batch Mode", AssetCreationOptions.None);

	    // Use the following event handler to check job progress.  
	    job.StateChanged += new EventHandler<JobStateChangedEventArgs>(StateChanged);

	    // Launch the job.
	    job.Submit();

	    // Check job execution and wait for job to finish.
	    Task progressJobTask = job.GetExecutionProgressTask(CancellationToken.None);
	    progressJobTask.Wait();

	    // If job state is Error, the event handling
	    // method for job progress should log errors.  Here we check
	    // for error state and exit if needed.
	    if (job.State == JobState.Error)
	    {
	        Console.WriteLine("Exiting method due to job error.");
	        return false;
	    }

	    // Download the job outputs.
	    DownloadAsset(task.OutputAssets.First(), outputFolder);

	    return true;
	}

	private static IAsset CreateAssetAndUploadMultipleFiles(string[] filePaths, string assetName, AssetCreationOptions options)
	{
	    IAsset asset = _context.Assets.Create(assetName, options);

	    foreach (string filePath in filePaths)
	    {
	        var assetFile = asset.AssetFiles.Create(Path.GetFileName(filePath));
	        assetFile.Upload(filePath);
	    }

	    return asset;
	}


### Output files

When there is more than one input media file, Indexer will generate a manifest file for the job outputs, named ‘JobResult.txt’. For each input media file, the resulting AIB, SAMI, TTML, WebVTT, and keyword files, are sequentially numbered, as listed below.

For descriptions of output files, see [Output files](#output_files).


<table border="1">
<tr><th>File name</th><th>Description</th></tr>
<tr><td>JobResult.txt</td>
<td>Output manifest
<br/><br/>Below is the format of output manifest file (JobResult.txt).
<br/><br/>

<table border="1">
<tr><th>InputFile</th><th>Alias</th><th>MediaLength</th><th>Error</th></tr>
<tr><td>a.mp4</td><td>Media_1</td><td>300</td><td>0</td></tr>
<tr><td>b.mp4</td><td>Media_2</td><td>0</td><td>3000</td></tr>
<tr><td>c.mp4</td><td>Media_3</td><td>600</td><td>0</td></tr>
</table><br/>
Each row represents one input media file:
<br/><br/>
InputFile: asset file name or URL of the input media file.
<br/><br/>
Alias: correspondent output file name.
<br/><br/>
MediaLength: length of the input media file, in seconds. Can be 0 is error happened to this input.
<br/><br/>
Error: indicates whether this media file is indexed successfully. 0 for succeeded, otherwise failed. Please refer to  <a href="#error_codes">Error Codes</a> for concrete errors.
</td></tr>
<tr><td>Media_1.aib </td>
<td>File #0 - Audio indexing blob file.</td></tr>
<tr><td>Media_1.smi<br/>Media_1.ttml</td>
<td>File #0 - Closed Caption (CC) files in SAMI, TTML, and WebVTT formats.</td></tr>
<tr><td>Media_1.kw.xml</td>
<td>File #0 - Keyword file.</td></tr>
<tr><td>Media_2.aib </td>
<td>File #1 - Audio indexing blob file.</td></tr>
</table>

If not all input media files are indexed successfully, the indexing job will fail with error code 4000. For more information, see [Error codes](#error_codes).

### Partially Succeeded Job

If not all input media files are indexed successfully, the indexing job will fail with error code 4000. For more information, see [Error codes](#error_codes).


The same outputs (as succeeded jobs) are generated. You can refer to the output manifest file to find out which input files are failed, according to the Error column values. For input files that failed, the resulting AIB, SAMI, TTML, WebVTT and keyword files will NOT be generated.


### <a id="error_codes"></a>Error codes


<table border="1">
<tr><th>Code</th><th>Name</th><th>Possible reasons</th></tr>
<tr><td>2000</td><td>Invalid configuration</td><td>Invalid configuration</td></tr>
<tr><td>2001</td><td>Invalid input assets</td><td>Missing input assets or empty asset.</td></tr>
<tr><td>2002</td><td>Invalid manifest</td><td>Manifest is empty or manifest contains invalid items.</td></tr>
<tr><td>2003</td><td>Failed to download media file</td><td>Invalid URL in manifest file.</td></tr>
<tr><td>2004</td><td>Unsupported protocol</td><td>Protocol of media URL is not supported.</td></tr>
<tr><td>2005</td><td>Unsupported file type</td><td>Input media file type is not supported.</td></tr>
<tr><td>2006</td><td>Too many input files</td><td>There are more than 10 files in the input manifest. </td></tr>
<tr><td>3000</td><td>Failed to decode media file</td>
<td>Unsupported media codec.
<br/>or<br/>
Corrupted media file.
<br/>or<br/>
No audio stream in input media.</td></tr>
<tr><td>4000</td><td>Batch indexing partially succeeded</td><td>Some of the input media files are failed to be indexed. For more information, see <a href="output_files">Output files</a>.</td></tr>
<tr><td>other</td><td>Internal errors</td><td>Please contact support team.</td></tr>
</table>


##<a id="supported_languages"></a>Supported Languages

Currently, the English and Spanish languages are supported. For more information, see [Azure Media Indexer Spanish](http://azure.microsoft.com/blog/2015/04/13/azure-media-indexer-spanish-v1-2/).


##Media Services learning paths

You can view AMS learning paths here:

- [AMS Live Streaming Workflow](http://azure.microsoft.com/documentation/learning-paths/media-services-streaming-live/)
- [AMS on Demand Streaming Workflow](http://azure.microsoft.com/documentation/learning-paths/media-services-streaming-on-demand/)


##Related links

[Using AIB Files with Azure Media Indexer and SQL Server](http://azure.microsoft.com/blog/2014/11/03/using-aib-files-with-azure-media-indexer-and-sql-server/)

<!-- Anchors. -->

<!-- Images. -->

<!-- URLs. -->
