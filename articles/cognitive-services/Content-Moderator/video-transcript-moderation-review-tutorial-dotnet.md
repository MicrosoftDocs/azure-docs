---
title: "Tutorial: Moderate videos and transcripts in .NET - Content Moderator"
titlesuffix: Azure Cognitive Services
description: This tutorial helps you understand how to build a complete video and transcript moderation solution with machine-assisted moderation and human-in-the-loop review creation.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: tutorial
ms.date: 07/03/2019
ms.author: pafarley

---

# Tutorial: Video and transcript moderation

In this tutorial, you will learn how to build a complete video and transcript moderation solution with machine-assisted moderation and human-in-the-loop review creation.

This tutorial shows you how to:

> [!div class="checklist"]
> - Compress the input video(s) for faster processing
> - Moderate the video to get shots and frames with insights
> - Use the frame timestamps to create thumbnails (images)
> - Submit timestamps and thumbnails to create video reviews
> - Convert the video speech to text (transcript) with the Media Indexer API
> - Moderate the transcript with the text moderation service
> - Add the moderated transcript to the video review

## Prerequisites

- Sign up for the [Content Moderator Review tool](https://contentmoderator.cognitive.microsoft.com/) web site and create custom tags. See [Use tags](Review-Tool-User-Guide/tags.md) if you need help with this step.

    ![screenshot of Video moderation custom tags](images/video-tutorial-custom-tags.png)
- To run the sample application, you need an Azure account, an Azure Media Services resource, an Azure Content Moderator resource, and Azure Active Directory credentials. For instructions on how to get these resources, see the [Video Moderation API](video-moderation-api.md) guide.
- Download the [Video review console application](https://github.com/MicrosoftContentModerator/VideoReviewConsoleApp) From GitHub.

## Enter credentials

Edit the `App.config` file and add the Active Directory tenant name, service endpoints, and subscription keys indicated by `#####`. You need the following information:

|Key|Description|
|-|-|
|`AzureMediaServiceRestApiEndpoint`|Endpoint for the Azure Media Services (AMS) API|
|`ClientSecret`|Subscription key for Azure Media Services|
|`ClientId`|Client ID for Azure Media Services|
|`AzureAdTenantName`|Active Directory tenant name representing your organization|
|`ContentModeratorReviewApiSubscriptionKey`|Subscription key for the Content Moderator review API|
|`ContentModeratorApiEndpoint`|Endpoint for the Content Moderator API|
|`ContentModeratorTeamId`|Content moderator team ID|

## Examine the main code

The class `Program` in `Program.cs` is the main entry point to the video moderation application.

### Methods of Program class

|Method|Description|
|-|-|
|`Main`|Parses command line, gathers user input, and starts processing.|
|`ProcessVideo`|Compresses, uploads, moderates, and creates video reviews.|
|`CreateVideoStreamingRequest`|Creates a stream to upload a video|
|`GetUserInputs`|Gathers user input; used when no command-line options are present|
|`Initialize`|Initializes objects needed for the moderation process|

### The Main method

`Main()` is where execution starts, so it's the place to start understanding the video moderation process.

[!code-csharp[Main](~/VideoReviewConsoleApp/Microsoft.ContentModerator.AMSComponent/AMSComponentClient/Program.cs?range=20-24,42-52,54-74)]

`Main()` handles the following command-line arguments:

- The path to a directory containing MPEG-4 video files to be submitted for moderation. All `*.mp4` files in this directory and its subdirectories are submitted for moderation.
- Optionally, a Boolean (true/false) flag indicating whether text transcripts should be generated for the purpose of moderating audio.

If no command-line arguments are present, `Main()` calls `GetUserInputs()`. This method prompts the user to enter the path to a single video file and to specify whether a text transcript should be generated.

> [!NOTE]
> The console application uses the [Azure Media Indexer API](https://docs.microsoft.com/azure/media-services/media-services-process-content-with-indexer2) to generate transcripts from the uploaded video's audio track. The results are provided in WebVTT format. For more information on this format, see [Web Video Text Tracks Format](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API).

### Initialize and ProcessVideo methods

Regardless of whether the program's options came from the command line or from interactive user input, `Main()` next calls `Initialize()` to create the following instances:

|Class|Description|
|-|-|
|`AMSComponent`|Compresses video files before submitting them for moderation.|
|`AMSconfigurations`|Interface to the application's configuration data, found in `App.config`.|
|`VideoModerator`| Uploading, encoding, encryption, and moderation using AMS SDK|
|`VideoReviewApi`|Manages video reviews in the Content Moderator service|

These classes (aside from `AMSConfigurations`, which is straightforward) are covered in more detail in upcoming sections of this tutorial.

Finally, the video files are processed one at a time by calling `ProcessVideo()` for each.

[!code-csharp[ProcessVideo](~/VideoReviewConsoleApp/Microsoft.ContentModerator.AMSComponent/AMSComponentClient/Program.cs?range=76-118)]

The `ProcessVideo()` method is fairly straightforward. It performs the following operations in the order:

- Compresses the video
- Uploads the video to an Azure Media Services asset
- Creates an AMS job to moderate the video
- Creates a video review in Content Moderator

The following sections consider in more detail some of the individual processes invoked by `ProcessVideo()`. 

## Compress the video

To minimize network traffic, the application converts video files to H.264 (MPEG-4 AVC) format and scales them to a maximum width of 640 pixels. The H.264 codec is recommended due to its high efficiency (compression rate). The compression is done using the free `ffmpeg` command-line tool, which is included in the `Lib` folder of the Visual Studio solution. The input files may be of any format supported by `ffmpeg`, including most commonly used video file formats and codecs.

> [!NOTE]
> When you start the program using command-line options, you specify a directory containing the video files to be submitted for moderation. All files in this directory having the `.mp4` filename extension are processed. To process other filename extensions, update the `Main()` method in `Program.cs` to include the desired extensions.

The code that compresses a single video file is the `AmsComponent` class in `AMSComponent.cs`. The method responsible for this functionality is `CompressVideo()`, shown here.

[!code-csharp[CompressVideo](~/VideoReviewConsoleApp/Microsoft.ContentModerator.AMSComponent/AMSComponentClient/AMSComponent.cs?range=31-59)]

The code performs the following steps:

- Checks to make sure the configuration in `App.config` contains all necessary data
- Checks to make sure the `ffmpeg` binary is present
- Builds the output filename by appending `_c.mp4` to the base name of the file (such as `Example.mp4` -> `Example_c.mp4`)
- Builds a command-line string to perform the conversion
- Starts an `ffmpeg` process using the command line
- Waits for the video to be processed

> [!NOTE]
> If you know your videos are already compressed using H.264 and have appropriate dimensions, you can rewrite `CompressVideo()` to skip the compression.

The method returns the filename of the compressed output file.

## Upload and moderate the video

The video must be stored in Azure Media Services before it can be processed by the Content Moderation service. The `Program` class in `Program.cs` has a short method `CreateVideoStreamingRequest()` that returns an object representing the streaming request used to upload the video.

[!code-csharp[CreateVideoStreamingRequest](~/VideoReviewConsoleApp/Microsoft.ContentModerator.AMSComponent/AMSComponentClient/Program.cs?range=120-133)]

The resulting `UploadVideoStreamRequest` object is defined in `UploadVideoStreamRequest.cs` (and its parent, `UploadVideoRequest`, in `UploadVideoRequest.cs`). These classes aren't shown here; they're short and serve only to hold the compressed video data and information about it. Another data-only class, `UploadAssetResult` (`UploadAssetResult.cs`) is used to hold the results of the upload process. Now it's possible to understand these lines in `ProcessVideo()`:

[!code-csharp[ProcessVideoSnippet](~/VideoReviewConsoleApp/Microsoft.ContentModerator.AMSComponent/AMSComponentClient/Program.cs?range=91-104)]

These lines perform the following tasks:

- Create a `UploadVideoStreamRequest` to upload the compressed video
- Set the request's `GenerateVTT` flag if the user has requested a text transcript
- Calls `CreateAzureMediaServicesJobToModerateVideo()` to perform the upload and receive the result

## Examine video moderation code

The method `CreateAzureMediaServicesJobToModerateVideo()` is in `VideoModerator.cs`, which contains the bulk of the code that interacts with Azure Media Services. The method's source code is shown in the following extract.

[!code-csharp[CreateAzureMediaServicesJobToModerateVideo](~/VideoReviewConsoleApp/Microsoft.ContentModerator.AMSComponent/AMSComponentClient/VideoModerator.cs?range=230-283)]

This code performs the following tasks:

- Creates an AMS job for the processing to be done
- Adds tasks for encoding the video file, moderating it, and generating a text transcript
- Submits the job, uploading the file and beginning processing
- Retrieves the moderation results, the text transcript (if requested), and other information

## Sample video moderation output

The result of the video moderation job (See [video moderation quickstart](video-moderation-api.md) is a JSON data structure containing the moderation results. These results include a breakdown of the fragments (shots) within the video, each containing events (clips) with key frames that have been flagged for review. Each key frame is scored by the likelihood that it contains adult or racy content. The following example shows a JSON response:

```json
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

A transcription of the audio from the video is also produced when the `GenerateVTT` flag is set.

> [!NOTE]
> The console application uses the [Azure Media Indexer API](https://docs.microsoft.com/azure/media-services/media-services-process-content-with-indexer2) to generate transcripts from the uploaded video's audio track. The results are provided in WebVTT format. For more information on this format, see [Web Video Text Tracks Format](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API).

## Create a human review

The moderation process returns a list of key frames from the video, along with a transcript of its audio tracks. The next step is to create a review in the Content Moderator review tool for human moderators. Going back to the `ProcessVideo()` method in `Program.cs`, you see the call to the `CreateVideoReviewInContentModerator()` method. This method is in the `videoReviewApi` class, which is in `VideoReviewAPI.cs`, and is shown here.

[!code-csharp[CreateVideoReviewInContentModerator](~/VideoReviewConsoleApp/Microsoft.ContentModerator.AMSComponent/AMSComponentClient/VideoReviewAPI.cs?range=42-69)]

`CreateVideoReviewInContentModerator()` calls several other methods to perform the following tasks:

> [!NOTE]
> The console application uses the [FFmpeg](https://ffmpeg.org/) library for generating thumbnails. These thumbnails (images) correspond to the frame timestamps in the video moderation output.

|Task|Methods|File|
|-|-|-|
|Extract the key frames from the video and creates thumbnail images of them|`CreateVideoFrames()`<br>`GenerateFrameImages()`|`FrameGeneratorServices.cs`|
|Scan the text transcript, if available, to locate adult or racy audio|`GenerateTextScreenProfanity()`| `VideoReviewAPI.cs`|
|Prepare and submits a video review request for human inspection|`CreateReviewRequestObject()`<br> `ExecuteCreateReviewApi()`<br>`CreateAndPublishReviewInContentModerator()`|`VideoReviewAPI.cs`|

The following screen shows the results of the previous steps.

![Video review default view](images/video-tutorial-default-view.PNG)

## Process the transcript

Until now, the code presented in this tutorial has focused on the visual content. Review of speech content is a separate and optional process that, as mentioned, uses a transcript generated from the audio. It's time now to take a look at how text transcripts are created and used in the review process. The task of generating the transcript falls to the [Azure Media Indexer](https://docs.microsoft.com/azure/media-services/media-services-index-content) service.

The application performs the following tasks:

|Task|Methods|File|
|-|-|-|
|Determine whether text transcripts are to be generated|`Main()`<br>`GetUserInputs()`|`Program.cs`|
|If so, submit a transcription job as part of moderation|`ConfigureTranscriptTask()`|`VideoModerator.cs`|
|Get a local copy of the transcript|`GenerateTranscript()`|`VideoModerator.cs`|
|Flag frames of the video that contain inappropriate audio|`GenerateTextScreenProfanity()`<br>`TextScreen()`|`VideoReviewAPI.cs`|
|Add the results to the review|`UploadScreenTextResult()`<br>`ExecuteAddTranscriptSupportFile()`|`VideoReviewAPI.cs`|

### Task configuration

Let's jump right into submitting the transcription job. `CreateAzureMediaServicesJobToModerateVideo()` (already described) calls `ConfigureTranscriptTask()`.

[!code-csharp[ConfigureTranscriptTask](~/VideoReviewConsoleApp/Microsoft.ContentModerator.AMSComponent/AMSComponentClient/VideoModerator.cs?range=295-304)]

The configuration for the transcript task is read from the file `MediaIndexerConfig.json` in the solution's `Lib` folder. AMS assets are created for the configuration file and for the output of the transcription process. When the AMS job runs, this task creates a text transcript from the video file's audio track.

> [!NOTE]
> The sample application recognizes speech in US English only.

### Transcript generation

The transcript is published as an AMS asset. To scan the transcript for objectionable content, the application downloads the asset from Azure Media Services. `CreateAzureMediaServicesJobToModerateVideo()` calls `GenerateTranscript()`, shown here, to retrieve the file.

[!code-csharp[GenerateTranscript](~/VideoReviewConsoleApp/Microsoft.ContentModerator.AMSComponent/AMSComponentClient/VideoModerator.cs?range=351-370)]

After some necessary AMS setup, the actual download is performed by calling `DownloadAssetToLocal()`, a generic function that copies an AMS asset to a local file.

## Moderate the transcript

With the transcript close at hand, it is scanned and used in the review. Creating the review is the purview of `CreateVideoReviewInContentModerator()`, that calls `GenerateTextScreenProfanity()` to do the job. In turn, this method calls `TextScreen()`, that contains most of the functionality.

`TextScreen()` performs the following tasks:

- Parse the transcript for time tamps and captions
- Submit each caption for text moderation
- Flag any frames that may have objectionable speech content

Let's examine each these tasks in more detail:

### Initialize the code

First, initialize all variables and collections.

[!code-csharp[TextScreen](~/VideoReviewConsoleApp/Microsoft.ContentModerator.AMSComponent/AMSComponentClient/VideoReviewAPI.cs?range=515-527)]

### Parse the transcript for captions

Next, parse the VTT formatted transcript for captions and timestamps. The review tool displays these captions in the Transcript Tab on the video review screen. The timestamps are used to sync the captions with the corresponding video frames.

[!code-csharp[TextScreen2](~/VideoReviewConsoleApp/Microsoft.ContentModerator.AMSComponent/AMSComponentClient/VideoReviewAPI.cs?range=528-567)]

### Moderate captions with the text moderation service

Next, we scan the parsed text captions with Content Moderator's text API.

> [!NOTE]
> Your Content Moderator service key has a requests per second (RPS)
> rate limit. If you exceed the limit, the SDK throws an exception with a 429 error code.
>
> A free tier key has a one RPS rate limit.

[!code-csharp[TextScreen3](~/VideoReviewConsoleApp/Microsoft.ContentModerator.AMSComponent/AMSComponentClient/VideoReviewAPI.cs?range=568-653)]

### Text moderation breakdown

`TextScreen()` is a substantial method, so let's break it down.

1. First, the method reads the transcript file line by line. It ignores blank lines and lines containing a `NOTE` with a confidence score. It extracts the time stamps and text items from the *cues* in the file. A cue represents text from the audio track and includes start and end times. A cue begins with the time stamp line with the string `-->`. It is followed by one or more lines of text.

1. Instances of `CaptionScreentextResult` (defined in `TranscriptProfanity.cs`) are used to hold the information parsed from each cue.  When a new time stamp line is detected, or a maximum text length of 1024 characters is reached, a new `CaptionScreentextResult` is added to the `csrList`. 

1. The method next submits each cue to the Text Moderation API. It calls both `ContentModeratorClient.TextModeration.DetectLanguageAsync()` and `ContentModeratorClient.TextModeration.ScreenTextWithHttpMessagesAsync()`, which are defined in the `Microsoft.Azure.CognitiveServices.ContentModerator` assembly. To avoid being rate-limited, the method pauses for a second before submitting each cue.

1. After receiving results from the Text Moderation service, the method then analyzes them to see whether they meet confidence thresholds. These values are established in `App.config` as `OffensiveTextThreshold`, `RacyTextThreshold`, and `AdultTextThreshold`. Finally, the objectionable terms themselves are also stored. All frames within the cue's time range are flagged as containing offensive, racy, and/or adult text.

1. `TextScreen()` returns a `TranscriptScreenTextResult` instance that contains the text moderation result from the video as a whole. This object includes flags and scores for the various types of objectionable content, along with a list of all objectionable terms. The caller, `CreateVideoReviewInContentModerator()`, calls `UploadScreenTextResult()` to attach this information to the review so it is available to human reviewers.

The following screen shows the result of the transcript generation and moderation steps.

![Video moderation transcript view](images/video-tutorial-transcript-view.PNG)

## Program output

The following command-line output from the program shows the various tasks as they are completed. Additionally, the moderation result (in JSON format) and the speech transcript are available in the same directory as the original video files.

```console
Microsoft.ContentModerator.AMSComponentClient
Enter the fully qualified local path for Uploading the video :
"Your File Name.MP4"
Generate Video Transcript? [y/n] : y

Video compression process started...
Video compression process completed...

Video moderation process started...
Video moderation process completed...

Video review process started...
Video Frames Creation inprogress...
Frames(83) created successfully.
Review Created Successfully and the review Id 201801va8ec2108d6e043229ba7a9e6373edec5
Video review successfully completed...

Total Elapsed Time: 00:05:56.8420355
```

## Next steps

In this tutorial, you set up an application that moderates video content&mdash;including transcript content&mdash;and creates reviews in the Review tool. Next, learn more about the details of video moderation.

> [!div class="nextstepaction"]
> [Video moderation](./video-moderation-human-review.md)
