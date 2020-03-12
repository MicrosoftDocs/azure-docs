---
title: Use Azure Media Content Moderator to detect possible adult and racy content | Microsoft Docs
description: Azure Media Content Moderator media processor helps detect potential adult and racy content in videos.
services: media-services
documentationcenter: ''
author: sanjeev3
manager: mikemcca
editor: ''

ms.assetid: a245529f-3150-4afc-93ec-e40d8a6b761d
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 03/14/2019
ms.author: sajagtap

---
# Use Azure Media Content Moderator to detect possible adult and racy content 

> [!NOTE]
> The **Azure Media Content Moderator** media processor will be retired. For the retirement date, see the [legacy components](legacy-components.md) topic.

## Overview
The **Azure Media Content Moderator** media processor (MP) enables you to use machine-assisted moderation for your videos. For example, you might want to detect possible adult and racy content in videos and review the flagged content by your human moderation teams.

The **Azure Media Content Moderator** MP is currently in Preview.

This article gives details about  **Azure Media Content Moderator** and shows how to use it with Media Services SDK for .NET.

## Content Moderator input files
Video files. Currently, the following formats are supported: MP4, MOV, and WMV.

## Content Moderator output files
The moderated output in the JSON format includes auto-detected shots and keyframes. The keyframes are returned with confidence scores for possible adult or racy content. They also include a boolean flag indicating whether a review is recommended. The review recommendation flag is assigned values based on the internal thresholds for adult and racy scores.

## Elements of the output JSON file

The job produces a JSON output file that contains metadata about detected shots and keyframes and whether they contain adult or racy content.

The output JSON includes the following elements:

### Root JSON elements

| Element | Description |
| --- | --- |
| version |The version of Content Moderator. |
| timescale |"Ticks" per second of the video. |
| offset |The time offset for timestamps. In version 1.0 of Video APIs, this value  will always be 0. This value may change in the future. |
| framerate |Frames per second of the video. |
| width |The width of the output video frame, in pixels.|
| height |The height of the output video frame, in pixels.|
| totalDuration |The duration of the input video, in "ticks." |
| [fragments](#fragments-json-elements) |The metadata is chunked up into different segments called fragments. Each fragment is an auto-detected shot with a start, duration, interval number, and event(s). |

### Fragments JSON elements

|Element|Description|
|---|---|
| start |The start time of the first event in "ticks." |
| duration |The length of the fragment, in “ticks.” |
| interval |The interval of each event entry within the fragment, in “ticks.” |
| [events](#events-json-elements) |Each event represents a clip and each clip contains keyframes detected and tracked within that time duration. It is an array of events. The outer array represents one interval of time. The inner array consists of 0 or more events that happened at that point in time.|

### Events JSON elements

|Element|Description|
|---|---|
| reviewRecommended | `true` or `false` depending on whether the **adultScore** or **racyScore** exceed the internal thresholds. |
| adultScore | Confidence score for possible adult content, on a scale of 0.00 to 0.99. |
| racyScore | Confidence score for possible racy content, on a scale of 0.00 to 0.99. |
| index | index of the frame on a scale from the first frame index to the last frame index. |
| timestamp | The location of the frame in "ticks." |
| shotIndex | The index of the parent shot. |


## Content Moderation quickstart and sample output

### Task configuration (preset)
When creating a task with **Azure Media Content Moderator**, you must specify a configuration preset. The following configuration preset is just for content moderation.

    {
      "version":"2.0"
    }

### .NET code sample

The following .NET code sample uses the Media Services .NET SDK to run a Content Moderator job. It takes a media services Asset as the input that contains the video to be moderated.
See the [Content Moderator video quickstart](../../cognitive-services/Content-Moderator/video-moderation-api.md) for the full source code and the Visual Studio project.


```csharp
	/// <summary>
    /// Run the Content Moderator job on the designated Asset from local file or blob storage
    /// </summary>
    /// <param name="asset"></param>
    static void RunContentModeratorJob(IAsset asset)
    {
    	// Grab the presets
        string configuration = File.ReadAllText(CONTENT_MODERATOR_PRESET_FILE);

        // grab instance of Azure Media Content Moderator MP
        IMediaProcessor mp = _context.MediaProcessors.GetLatestMediaProcessorByName(MEDIA_PROCESSOR);

        // create Job with Content Moderator task
        IJob job = _context.Jobs.Create(String.Format("Content Moderator {0}",
                asset.AssetFiles.First() + "_" + Guid.NewGuid()));

        ITask contentModeratorTask = job.Tasks.AddNew("Adult and racy classifier task",
        		mp, configuration,
                TaskOptions.None);
        contentModeratorTask.InputAssets.Add(asset);
        contentModeratorTask.OutputAssets.AddNew("Adult and racy classifier output",
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
                    Console.WriteLine(string.Format("{0}\t{1}",
                    DateTime.Now,
                    jobQuery.State));
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

        DownloadAsset(job.OutputMediaAssets.First(), OUTPUT_FOLDER);
	}

For the full source code and the Visual Studio project, check out the [Content Moderator video quickstart](../../cognitive-services/Content-Moderator/video-moderation-api.md).

### JSON output

The following example of a Content Moderator JSON output was truncated.

> [!NOTE]
> Location of a keyframe in seconds = timestamp/timescale

    {
    "version": 2,
    "timescale": 90000,
    "offset": 0,
    "framerate": 50,
    "width": 1280,
    "height": 720,
    "totalDuration": 18696321,
    "fragments": [
    {
      "start": 0,
      "duration": 18000
    },
    {
      "start": 18000,
      "duration": 3600,
      "interval": 3600,
      "events": [
        [
          {
            "reviewRecommended": false,
            "adultScore": 0.00001,
            "racyScore": 0.03077,
            "index": 5,
            "timestamp": 18000,
            "shotIndex": 0
          }
        ]
      ]
    },
    {
      "start": 18386372,
      "duration": 119149,
      "interval": 119149,
      "events": [
        [
          {
            "reviewRecommended": true,
            "adultScore": 0.00000,
            "racyScore": 0.91902,
            "index": 5085,
            "timestamp": 18386372,
            "shotIndex": 62
          }
        ]
      ]
    }
    ]
    }
```

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

## Related links
[Azure Media Services Analytics Overview](media-services-analytics-overview.md)

[Azure Media Analytics demos](https://azuremedialabs.azurewebsites.net/demos/Analytics.html)

## Next steps

Learn more about Content Moderator's [video moderation and review solution](../../cognitive-services/Content-Moderator/video-moderation-human-review.md).

Get the full source code and the Visual Studio project from the [video moderation quickstart](../../cognitive-services/Content-Moderator/video-moderation-api.md). 

Learn how to generate [video reviews](../../cognitive-services/Content-Moderator/video-reviews-quickstart-dotnet.md) from your moderated output, and [moderate transcripts](../../cognitive-services/Content-Moderator/video-transcript-reviews-quickstart-dotnet.md) in .NET.

Check out the detailed .NET [video moderation and review tutorial](../../cognitive-services/Content-Moderator/video-transcript-moderation-review-tutorial-dotnet.md). 
