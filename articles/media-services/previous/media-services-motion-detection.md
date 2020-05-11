---
title: Detect Motions with Azure Media Analytics | Microsoft Docs
description: The Azure Media Motion Detector media processor (MP) enables you to efficiently identify sections of interest within an otherwise long and uneventful video.
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 03/19/2019
ms.author: juliako
ms.reviewer: milanga

---
# Detect Motions with Azure Media Analytics

> [!NOTE]
> The **Azure Media Motion Detector** media processor will be retired. For the retirement date, see the [legacy components](legacy-components.md) topic.
 
## Overview

The **Azure Media Motion Detector** media processor (MP) enables you to efficiently identify sections of interest within an otherwise long and uneventful video. Motion detection can be used on static camera footage to identify sections of the video where motion occurs. It generates a JSON file containing a metadata with timestamps and the bounding region where the event occurred.

Targeted towards security video feeds, this technology is able to categorize motion into relevant events and false positives such as shadows and lighting changes. This allows you to generate security alerts from camera feeds without being spammed with endless irrelevant events, while being able to extract moments of interest from long surveillance videos.

The **Azure Media Motion Detector** MP is currently in Preview.

This article gives details about  **Azure Media Motion Detector** and shows how to use it with Media Services SDK for .NET

## Motion Detector input files
Video files. Currently, the following formats are supported: MP4, MOV, and WMV.

## Task configuration (preset)
When creating a task with **Azure Media Motion Detector**, you must specify a configuration preset. 

### Parameters
You can use the following parameters:

| Name | Options | Description | Default |
| --- | --- | --- | --- |
| sensitivityLevel |String:'low', 'medium', 'high' |Sets the sensitivity level at which motions are reported. Adjust this to adjust number of false positives. |'medium' |
| frameSamplingValue |Positive integer |Sets the frequency at which algorithm runs. 1 equals every frame, 2 means every second frame, and so on. |1 |
| detectLightChange |Boolean:'true', 'false' |Sets whether light changes are reported in the results |'False' |
| mergeTimeThreshold |Xs-time: Hh:mm:ss<br/>Example: 00:00:03 |Specifies the time window between motion events where 2 events are be combined and reported as 1. |00:00:00 |
| detectionZones |An array of detection zones:<br/>- Detection Zone is an array of 3 or more points<br/>- Point is an x and y coordinate from 0 to 1. |Describes the list of polygonal detection zones to be used.<br/>Results are reported with the zones as an ID, with the first one being 'id':0 |Single zone, which covers the entire frame. |

### JSON example

```json
    {
      "version": "1.0",
      "options": {
        "sensitivityLevel": "medium",
        "frameSamplingValue": 1,
        "detectLightChange": "False",
        "mergeTimeThreshold":
        "00:00:02",
        "detectionZones": [
          [
            {"x": 0, "y": 0},
            {"x": 0.5, "y": 0},
            {"x": 0, "y": 1}
           ],
          [
            {"x": 0.3, "y": 0.3},
            {"x": 0.55, "y": 0.3},
            {"x": 0.8, "y": 0.3},
            {"x": 0.8, "y": 0.55},
            {"x": 0.8, "y": 0.8},
            {"x": 0.55, "y": 0.8},
            {"x": 0.3, "y": 0.8},
            {"x": 0.3, "y": 0.55}
          ]
        ]
      }
    }
```

## Motion Detector output files
A motion detection job returns a JSON file in the output asset, which describes the motion alerts, and their categories, within the video. The file contains information about the time and duration of motion detected in the video.

The Motion Detector API provides indicators once there are objects in motion in a fixed background video (for example, a surveillance video). The Motion Detector is trained to reduce false alarms, such as lighting and shadow changes. Current limitations of the algorithms include night vision videos, semi-transparent objects, and small objects.

### <a id="output_elements"></a>Elements of the output JSON file
> [!NOTE]
> In the latest release, the Output JSON format has changed and may represent a breaking change for some customers.
> 
> 

The following table describes elements of the output JSON file.

| Element | Description |
| --- | --- |
| version |This refers to the version of the Video API. The current version is 2. |
| timescale |"Ticks" per second of the video. |
| offset |The time offset for timestamps in "ticks." In version 1.0 of Video APIs, this will always be 0. In future scenarios we support, this value may change. |
| framerate |Frames per second of the video. |
| width, height |Refers to the width and height of the video in pixels. |
| start |The start timestamp in "ticks". |
| duration |The length of the event, in "ticks". |
| interval |The interval of each entry in the event, in "ticks". |
| events |Each event fragment contains the motion detected within that time duration. |
| type |In the current version, this is always ‘2’ for generic motion. This label gives Video APIs the flexibility to categorize motion in future versions. |
| regionId |As explained above, this will always be 0 in this version. This label gives Video API the flexibility to find motion in various regions in future versions. |
| regions |Refers to the area in your video where you care about motion. <br/><br/>-"id" represents the region area – in this version there is only one, ID 0. <br/>-"type" represents the shape of the region you care about for motion. Currently, "rectangle" and "polygon" are supported.<br/> If you specified "rectangle", the region has dimensions in X, Y, Width, and Height. The X and Y coordinates represent the upper left-hand XY coordinates of the region in a normalized scale of 0.0 to 1.0. The width and height represent the size of the region in a normalized scale of 0.0 to 1.0. In the current version, X, Y, Width, and Height are always fixed at 0, 0 and 1, 1. <br/>If you specified "polygon", the region has dimensions in points. <br/> |
| fragments |The metadata is chunked up into different segments called fragments. Each fragment contains a start, duration, interval number, and event(s). A fragment with no events means that no motion was detected during that start time and duration. |
| brackets [] |Each bracket represents one interval in the event. Empty brackets for that interval means that no motion was detected. |
| locations |This new entry under events lists the location where the motion occurred. This is more specific than the detection zones. |

The following JSON example shows the output:

```json
    {
      "version": 2,
      "timescale": 23976,
      "offset": 0,
      "framerate": 24,
      "width": 1280,
      "height": 720,
      "regions": [
        {
          "id": 0,
          "type": "polygon",
          "points": [{'x': 0, 'y': 0},
            {'x': 0.5, 'y': 0},
            {'x': 0, 'y': 1}]
        }
      ],
      "fragments": [
        {
          "start": 0,
          "duration": 226765
        },
        {
          "start": 226765,
          "duration": 47952,
          "interval": 999,
          "events": [
            [
              {
                "type": 2,
                "typeName": "motion",
                "locations": [
                  {
                    "x": 0.004184,
                    "y": 0.007463,
                    "width": 0.991667,
                    "height": 0.985185
                  }
                ],
                "regionId": 0
              }
            ],
```

## Limitations
* The supported input video formats include MP4, MOV, and WMV.
* Motion Detection is optimized for stationary background videos. The algorithm focuses on reducing false alarms, such as lighting changes, and shadows.
* Some motion may not be detected due to technical challenges; for example, night vision videos, semi-transparent objects, and small objects.

## .NET sample code

The following program shows how to:

1. Create an asset and upload a media file into the asset.
2. Create a job with a video motion detection task based on a configuration file that contains the following json preset: 
   
    ```json
            {
            "Version": "1.0",
            "Options": {
                "SensitivityLevel": "medium",
                "FrameSamplingValue": 1,
                "DetectLightChange": "False",
                "MergeTimeThreshold":
                "00:00:02",
                "DetectionZones": [
                [
                    {"x": 0, "y": 0},
                    {"x": 0.5, "y": 0},
                    {"x": 0, "y": 1}
                ],
                [
                    {"x": 0.3, "y": 0.3},
                    {"x": 0.55, "y": 0.3},
                    {"x": 0.8, "y": 0.3},
                    {"x": 0.8, "y": 0.55},
                    {"x": 0.8, "y": 0.8},
                    {"x": 0.55, "y": 0.8},
                    {"x": 0.3, "y": 0.8},
                    {"x": 0.3, "y": 0.55}
                ]
                ]
            }
            }
    ```

3. Download the output JSON files. 

#### Create and configure a Visual Studio project

Set up your development environment and populate the app.config file with connection information, as described in [Media Services development with .NET](media-services-dotnet-how-to-use.md). 

#### Example

```csharp

using System;
using System.Configuration;
using System.IO;
using System.Linq;
using Microsoft.WindowsAzure.MediaServices.Client;
using System.Threading;
using System.Threading.Tasks;

namespace VideoMotionDetection
{
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

        // Field for service context.
        private static CloudMediaContext _context = null;

        static void Main(string[] args)
        {
            AzureAdTokenCredentials tokenCredentials =
                new AzureAdTokenCredentials(_AADTenantDomain,
                    new AzureAdClientSymmetricKey(_AMSClientId, _AMSClientSecret),
                    AzureEnvironments.AzureCloudEnvironment);

            var tokenProvider = new AzureAdTokenProvider(tokenCredentials);

            _context = new CloudMediaContext(new Uri(_RESTAPIEndpoint), tokenProvider);

            // Run the VideoMotionDetection job.
            var asset = RunVideoMotionDetectionJob(@"C:\supportFiles\VideoMotionDetection\BigBuckBunny.mp4",
                                        @"C:\supportFiles\VideoMotionDetection\config.json");

            // Download the job output asset.
            DownloadAsset(asset, @"C:\supportFiles\VideoMotionDetection\Output");
        }

        static IAsset RunVideoMotionDetectionJob(string inputMediaFilePath, string configurationFile)
        {
            // Create an asset and upload the input media file to storage.
            IAsset asset = CreateAssetAndUploadSingleFile(inputMediaFilePath,
                "My Video Motion Detection Input Asset",
                AssetCreationOptions.None);

            // Declare a new job.
            IJob job = _context.Jobs.Create("My Video Motion Detection Job");

            // Get a reference to Azure Media Motion Detector.
            string MediaProcessorName = "Azure Media Motion Detector";

            var processor = GetLatestMediaProcessorByName(MediaProcessorName);

            // Read configuration from the specified file.
            string configuration = File.ReadAllText(configurationFile);

            // Create a task with the encoding details, using a string preset.
            ITask task = job.Tasks.AddNew("My Video Motion Detection Task",
                processor,
                configuration,
                TaskOptions.None);

            // Specify the input asset.
            task.InputAssets.Add(asset);

            // Add an output asset to contain the results of the job.
            task.OutputAssets.AddNew("My Video Motion Detection Output Asset", AssetCreationOptions.None);

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
                ErrorDetail error = job.Tasks.First().ErrorDetails.First();
                Console.WriteLine(string.Format("Error: {0}. {1}",
                                                error.Code,
                                                error.Message));
                return null;
            }

            return job.OutputMediaAssets[0];
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

        static private void StateChanged(object sender, JobStateChangedEventArgs e)
        {
            Console.WriteLine("Job state changed event:");
            Console.WriteLine("  Previous state: " + e.PreviousState);
            Console.WriteLine("  Current state: " + e.CurrentState);

            switch (e.CurrentState)
            {
                case JobState.Finished:
                    Console.WriteLine();
                    Console.WriteLine("Job is finished.");
                    Console.WriteLine();
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
                    // LogJobStop(job.Id);
                    break;
                default:
                    break;
            }
        }
    }
}
```

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

## Related links
[Azure Media Services Motion Detector blog](https://azure.microsoft.com/blog/motion-detector-update/)

[Azure Media Services Analytics Overview](media-services-analytics-overview.md)

[Azure Media Analytics demos](https://azuremedialabs.azurewebsites.net/demos/Analytics.html)

