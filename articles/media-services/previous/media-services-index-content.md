---
title: Indexing Media Files with Azure Media Indexer
description: Azure Media Indexer enables you to make content of your media files searchable and to generate a full-text transcript for closed captioning and keywords. This topic shows how to use Media Indexer.
services: media-services
documentationcenter: ''
author: Asolanki
manager: femila
editor: ''

ms.assetid: 827a56b2-58a5-4044-8d5c-3e5356488271
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 09/22/2019
ms.author: juliako
ms.reviewer: johndeu

---
# Indexing Media Files with Azure Media Indexer

> [!NOTE]
> The [Azure Media Indexer](media-services-index-content.md) media processor will be retired. For the retirement dates, see this [legacy components](legacy-components.md) topic. [Azure Media Services Video Indexer](https://docs.microsoft.com/azure/media-services/video-indexer/) replaces this legacy media processor. For more information, see [Migrate from Azure Media Indexer and Azure Media Indexer 2 to Azure Media Services Video Indexer](migrate-indexer-v1-v2.md).

Azure Media Indexer enables you to make content of your media files searchable and to generate a full-text transcript for closed captioning and keywords. You can process one media file or multiple media files in a batch.  

When indexing content, make sure to use media files that have clear speech (without background music, noise, effects, or microphone hiss). Some examples of appropriate content are: recorded meetings, lectures, or presentations. The following content might not be suitable for indexing: movies, TV shows, anything with mixed audio and sound effects, poorly recorded content with background noise (hiss).

An indexing job can generate the following outputs:

* Closed caption files in the following formats: **TTML**, and **WebVTT**.
  
    Closed caption files include a tag called Recognizability, which scores an indexing job based on how recognizable the speech in the source video is.  You can use the value of Recognizability to screen output files for usability. A low score would mean poor indexing results due to audio quality.
* Keyword file (XML).

This article shows how to create indexing jobs to **Index an asset** and **Index multiple files**.

## Using configuration and manifest files for indexing tasks
You can specify more details for your indexing tasks by using a task configuration. For example, you can specify which metadata to use for your media file. This metadata is used by the language engine to expand its vocabulary, and greatly improves the speech recognition accuracy.  You are also able to specify your desired output files.

You can also process multiple media files at once by using a manifest file.

For more information, see [Task Preset for Azure Media Indexer](https://msdn.microsoft.com/library/dn783454.aspx).

## Index an asset
The following method uploads a media file as an asset and creates a job to index the asset.

If no configuration file is specified, the media file is indexed with all default settings.

```csharp
    static bool RunIndexingJob(string inputMediaFilePath, string outputFolder, string configurationFile = "")
    {
        // Create an asset and upload the input media file to storage.
        IAsset asset = CreateAssetAndUploadSingleFile(inputMediaFilePath,
            "My Indexing Input Asset",
            AssetCreationOptions.None);

        // Declare a new job.
        IJob job = _context.Jobs.Create("My Indexing Job");

        // Get a reference to the Azure Media Indexer.
        string MediaProcessorName = "Azure Media Indexer";
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
```

<!-- __ -->
### <a id="output_files"></a>Output files
By default, an indexing job generates the following output files. The files are stored in the first output asset.

When there is more than one input media file, Indexer generates a manifest file for the job outputs, named ‘JobResult.txt’. For each input media file, the resulting TTML, WebVTT, and keyword files are sequentially numbered and named using the "Alias."

| File name | Description |
| --- | --- |
| **InputFileName.ttml**<br/>**InputFileName.vtt** |Closed Caption (CC) files in TTML and WebVTT formats.<br/><br/>They can be used to make audio and video files accessible to people with hearing disability.<br/><br/>Closed Caption files include a tag called <b>Recognizability</b> which scores an indexing job based on how recognizable the speech in the source video is.  You can use the value of <b>Recognizability</b> to screen output files for usability. A low score would mean poor indexing results due to audio quality. |
| **InputFileName.kw.xml<br/>InputFileName.info** |Keyword and info files. <br/><br/>Keyword file is an XML file that contains keywords extracted from the speech content, with frequency and offset information. <br/><br/>Info file is a plain-text file that contains granular information about each term recognized. The first line is special and contains the Recognizability score. Each subsequent line is a tab-separated list of the following data: start time, end time, word/phrase, confidence. The times are given in seconds and the confidence is given as a number from 0-1. <br/><br/>Example line: "1.20    1.45    word    0.67" <br/><br/>These files can be used for a number of purposes, such as, to perform speech analytics, or exposed to search engines such as Bing, Google or Microsoft SharePoint to make the media files more discoverable, or even used to deliver more relevant ads. |
| **JobResult.txt** |Output manifest, present only when indexing multiple files, containing the following information:<br/><br/><table border="1"><tr><th>InputFile</th><th>Alias</th><th>MediaLength</th><th>Error</th></tr><tr><td>a.mp4</td><td>Media_1</td><td>300</td><td>0</td></tr><tr><td>b.mp4</td><td>Media_2</td><td>0</td><td>3000</td></tr><tr><td>c.mp4</td><td>Media_3</td><td>600</td><td>0</td></tr></table><br/> |

If not all input media files are indexed successfully, the indexing job fails with error code 4000. For more information, see [Error codes](#error_codes).

## Index multiple files
The following method uploads multiple media files as an asset, and creates a job to index all these files in a batch.

A manifest file with the ".lst" extension is created and uploading into the asset. The manifest file contains the list of all the asset files. For more information, see [Task Preset for Azure Media Indexer](https://msdn.microsoft.com/library/dn783454.aspx).

```csharp
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
```

### Partially Succeeded Job
If not all input media files are indexed successfully, the indexing job will fail with error code 4000. For more information, see [Error codes](#error_codes).

The same outputs (as succeeded jobs) are generated. You can refer to the output manifest file to find out which input files are failed, according to the Error column values. For input files that failed, the resulting TTML, WebVTT, and keyword files will NOT be generated.

### <a id="preset"></a> Task Preset for Azure Media Indexer
The processing from Azure Media Indexer can be customized by providing an optional task preset alongside the task.  The following describes the format of this configuration xml.

| Name | Require | Description |
| --- | --- | --- |
| **input** |false |Asset file(s) that you want to index.</p><p>Azure Media Indexer supports the following media file formats: MP4, WMV, MP3, M4A, WMA, AAC, WAV.</p><p>You can specify the file name (s) in the **name** or **list** attribute of the **input** element (as shown below).If you do not specify which asset file to index, the primary file is picked. If no primary asset file is set, the first file in the input asset is indexed.</p><p>To explicitly specify the asset file name, do:<br/>`<input name="TestFile.wmv">`<br/><br/>You can also index multiple asset files at once (up to 10 files). To do this:<br/><br/><ol class="ordered"><li><p>Create a text file (manifest file) and give it an .lst extension. </p></li><li><p>Add a list of all the asset file names in your input asset to this manifest file. </p></li><li><p>Add (upload) the manifest file to the asset.  </p></li><li><p>Specify the name of the manifest file in the input’s list attribute.<br/>`<input list="input.lst">`</li></ol><br/><br/>Note: If you add more than 10 files to the manifest file, the indexing job will fail with the 2006 error code. |
| **metadata** |false |Metadata for the specified asset file(s) used for Vocabulary Adaptation.  Useful to prepare Indexer to recognize non-standard vocabulary words such as proper nouns.<br/>`<metadata key="..." value="..."/>` <br/><br/>You can supply **values** for predefined **keys**. Currently the following keys are supported:<br/><br/>“title” and “description” - used for vocabulary adaptation to tweak the language model for your job and improve speech recognition accuracy.  The values seed Internet searches to find contextually relevant text documents, using the contents to augment the internal dictionary for the duration of your Indexing task.<br/>`<metadata key="title" value="[Title of the media file]" />`<br/>`<metadata key="description" value="[Description of the media file] />"` |
| **features** <br/><br/> Added in version 1.2. Currently, the only supported feature is speech recognition ("ASR"). |false |The Speech Recognition feature has the following settings keys:<table><tr><th><p>Key</p></th>        <th><p>Description</p></th><th><p>Example value</p></th></tr><tr><td><p>Language</p></td><td><p>The natural language to be recognized in the multimedia file.</p></td><td><p>English, Spanish</p></td></tr><tr><td><p>CaptionFormats</p></td><td><p>a semicolon-separated list of the desired output caption formats (if any)</p></td><td><p>ttml;webvtt</p></td></tr><tr><td><p></p></td><td><p> </p></td><td><p>True; False</p></td></tr><tr><td><p>GenerateKeywords</p></td><td><p>A boolean flag specifying whether or not a keyword XML file is required.</p></td><td><p>True; False. </p></td></tr><tr><td><p>ForceFullCaption</p></td><td><p>A boolean flag specifying whether or not to force full captions (regardless of confidence level).  </p><p>Default is false, in which case words and phrases which have a less than 50% confidence level are omitted from the final caption outputs and replaced by ellipses ("...").  The ellipses are useful for caption quality control and auditing.</p></td><td><p>True; False. </p></td></tr></table> |

### <a id="error_codes"></a>Error codes
In the case of an error, Azure Media Indexer should report back one of the following error codes:

| Code | Name | Possible Reasons |
| --- | --- | --- |
| 2000 |Invalid configuration |Invalid configuration |
| 2001 |Invalid input assets |Missing input assets or empty asset. |
| 2002 |Invalid manifest |Manifest is empty or manifest contains invalid items. |
| 2003 |Failed to download media file |Invalid URL in manifest file. |
| 2004 |Unsupported protocol |Protocol of media URL is not supported. |
| 2005 |Unsupported file type |Input media file type is not supported. |
| 2006 |Too many input files |There are more than 10 files in the input manifest. |
| 3000 |Failed to decode media file |Unsupported media codec <br/>or<br/> Corrupted media file <br/>or<br/> No audio stream in input media. |
| 4000 |Batch indexing partially succeeded |Some of the input media files are failed to be indexed. For more information, see <a href="#output_files">Output files</a>. |
| other |Internal errors |Please contact support team. indexer@microsoft.com |

## <a id="supported_languages"></a>Supported Languages
Currently, the English and Spanish languages are supported.  

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

## Related links
[Azure Media Services Analytics Overview](media-services-analytics-overview.md)

[Indexing Media Files with Azure Media Indexer 2 Preview](media-services-process-content-with-indexer2.md)

