<properties
	pageTitle="Indexing Media Files with Azure Media Indexer"
	description="Azure Media Indexer enables you to make content of your media files searchable and to generate a full-text transcript for closed captioning and keywords. This topic shows how to use Media Indexer."
	services="media-services"
	documentationCenter=""
	authors="Juliako,johndeu"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="media-services"
	ms.workload="media"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="10/15/2015"   
	ms.author="juliako"/>


# Indexing Media Files with Azure Media Indexer

> [AZURE.SELECTOR]
- [Portal](media-services-manage-content.md#index)
- [.NET](media-services-index-content.md)


Azure Media Indexer enables you to make content of your media files searchable and to generate a full-text transcript for closed captioning and keywords. You can process one media file or multiple media files in a batch.  

>[AZURE.IMPORTANT] When indexing content, make sure to use media files that have very clear speech (without background music, noise, effects, or microphone hiss). Some examples of appropriate content are: recorded meetings, lectures or presentations. The following content might not be suitable for indexing: movies, TV shows, anything with mixed audio and sound effects, poorly recorded content with background noise (hiss).


An indexing job can generate the following outputs:

- Closed caption files in the following formats: **SAMI**, **TTML**, and **WebVTT**.

	Closed caption files include a tag called Recognizability, which scores an indexing job based on how recognizable the speech in the source video is.  You can use the value of Recognizability to screen output files for usability. A low score would mean poor indexing results due to audio quality.
- Keyword file (XML).
- Audio indexing blob file (AIB) for use with SQL server.

	For more information, see [Using AIB Files with Azure Media Indexer and SQL Server](http://azure.microsoft.com/blog/2014/11/03/using-aib-files-with-azure-media-indexer-and-sql-server/).


This topic shows how to create indexing jobs to **Index an asset** and **Index multiple files**.

For the latest Azure Media Indexer updates, see [Media Services blogs](#preset).

## Using configuration and manifest files for indexing tasks

You can specify more details for your indexing tasks by using a task configuration. For example, you can specify which metadata to use for your media file. This metadata is used by the language engine to expand its vocabulary, and greatly improves the speech recognition accuracy.  You are also able to specify your desired output files.

You can also process multiple media files at once by using a manifest file.

For more information, see [Task Preset for Azure Media Indexer](#).

## Index an asset

The following method uploads a media file as an asset and creates a job to index the asset.

Note that if no configuration file is specified, the media file will be indexed with all default settings.

	static bool RunIndexingJob(string inputMediaFilePath, string outputFolder, string configurationFile = "")
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

### <a id="preset"></a> Task Preset for Azure Media Indexer

<table>
	<tr>
		<th>Name</th>
		<th>Require</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>**Input**</td>
		<td>true</td>
		<td><p>Asset file(s) that you want to index.</p><p>Azure Media Indexer supports the following media file formats: MP4, WMV, MP3, M4A, WMA, AAC, WAV.</p><p>You can specify the file name (s) in the **name** or **list** attribute of the **input** element (as shown below).If you do not specify which asset file to index, the primary file is picked. If no primary asset file is set, the first file in the input asset is indexed.</p><p>To explicitly specify the asset file name, do:</p>

			`<input name="TestFile.wmv">`<br /><br />



			<p>You can also index multiple asset files at once (up to 10 files). To do this:</p>
			<ol class="ordered">
				<li><p>Create a text file (manifest file) and give it an .lst extension. </p></li>
				<li><p>Add a list of all the asset file names in your input asset to this manifest file. </p></li>
				<li><p>Add (upload) thanifest file to the asset.  </p></li>
				<li><p>Specify the name of the manifest file in the input’s list attribute.</p>
				`<input list="input.lst">`</li>
			</ol>
			<p>Note: If you add more than 10 files to the manifest file, the indexing job will fail with the 2006 error code. </p>

		</td>
	</tr>
	<tr>
		<td><p><strong>metadata</strong></p></td>
		<td><p>false</p></td>
		<td><p>Metadata for the specified asset file(s).</p>
			`<metadata key="..." value="..."` <br /><br />
			<p>You can supply <strong>value</strong>s for predefined <strong>key</strong>s. Currently the following keys are supported:</p><p>**“title” and “description”** -  used for vocabulary adaptation to tweak the language model for your job and improve speech recognition accuracy.</p>

			`<metadata key="title" value="[Title of the media file]" />`<br />
			`<metadata key="description" value="[Description of the media file] />"` <br /> <br />

		</td>
	</tr>
	<tr>
		<td>
			<p><strong>features</strong></p>
			<p>Added in version 1.2. Currently, the only supported feature is speech recognition ("ASR").</p>
		</td>
		<td><p>False</p></td>
		<td><p>The Speech Recognition feature has the following settings keys:</p>
		<table>
			<tr>
				<th><p>Key</p></th>
				<th><p>Description</p></th>
				<th><p>Example value</p></th>
			</tr>
			<tr>
				<td><p>Language</p></td>
				<td><p>The natural language to be recognized in the multimedia file.</p></td>
				<td><p>English, Spanish</p></td>
			</tr>
			<tr>
				<td><p>CaptionFormats</p></td>
				<td><p>a semicolon-separated list of the desired output caption formats (if any)</p></td>
				<td><p>ttml;sami;webvtt</p></td>
			</tr>
			<tr>
				<td><p>GenerateAIB</p></td>
				<td><p>A boolean flag specifying whether or not an AIB file is required (for use with SQL Server and the customer Indexer IFilter).  For more information, see <a href="http://azure.microsoft.com/blog/2014/11/03/using-aib-files-with-azure-media-indexer-and-sql-server/">Using AIB Files with Azure Media Indexer and SQL Server</a>.</p></td>
				<td><p>True; False</p></td>
			</tr>
			<tr>
				<td><p>GenerateKeywords</p></td>
				<td><p>A boolean flag specifying whether or not a keyword XML file is required.</p></td>
				<td><p>True; False. </p></td>
			</tr>
			<tr>
				<td><p>ForceFullCaption</p></td>
				<td><p>A boolean flag specifying whether or not to force full captions (regardless of confidence level).  </p>
				<p>Default is false, in which case words and phrases which have a less than 50% confidence level are omitted from the final caption outputs and replaced by ellipses ("...").  The ellipses are useful for caption quality control and auditing.</p></td>
				<td><p>True; False. </p></td>
			</tr>
		</table>
		</td>
	</tr>
</table>

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
