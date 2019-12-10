---
title: Redact faces with Azure Media Analytics | Microsoft Docs
description: Azure Media Redactor is an Azure Media Analytics media processor that offers scalable face redaction in the cloud. This article demonstrates how to redact faces with Azure media analytics.
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
ms.date: 03/18/2019
ms.author: juliako

---
# Redact faces with Azure Media Analytics 
## Overview
**Azure Media Redactor** is an [Azure Media Analytics](media-services-analytics-overview.md) media processor (MP) that offers scalable face redaction in the cloud. Face redaction enables you to modify your video in order to blur faces of selected individuals. You may want to use the face redaction service in public safety and news media scenarios. A few minutes of footage that contains multiple faces can take hours to redact manually, but with this service the face redaction process will require just a few simple steps. For  more information, see [this](https://azure.microsoft.com/blog/azure-media-redactor/) blog.

This article gives details about **Azure Media Redactor** and shows how to use it with Media Services SDK for .NET.

## Face redaction modes
Facial redaction works by detecting faces in every frame of video and tracking the face object both forwards and backwards in time, so that the same individual can be blurred from other angles as well. The automated redaction process is complex and does not always produce 100% of desired output, for this reason Media Analytics provides you with a couple of ways to modify the final output.

In addition to a fully automatic mode, there is a two-pass workflow, which allows the selection/de-selection of found faces via a list of IDs. Also, to make arbitrary per frame adjustments the MP uses a metadata file in JSON format. This workflow is split into **Analyze** and **Redact** modes. You can combine the two modes in a single pass that runs both tasks in one job; this mode is called **Combined**.

### Combined mode
This produces a redacted mp4 automatically without any manual input.

| Stage | File Name | Notes |
| --- | --- | --- |
| Input asset |foo.bar |Video in WMV, MOV, or MP4 format |
| Input config |Job configuration preset |{'version':'1.0', 'options': {'mode':'combined'}} |
| Output asset |foo_redacted.mp4 |Video with blurring applied |

#### Input example:
[view this video](https://ampdemo.azureedge.net/?url=https%3A%2F%2Freferencestream-samplestream.streaming.mediaservices.windows.net%2Fed99001d-72ee-4f91-9fc0-cd530d0adbbc%2FDancing.mp4)

#### Output example:
[view this video](https://ampdemo.azureedge.net/?url=https%3A%2F%2Freferencestream-samplestream.streaming.mediaservices.windows.net%2Fc6608001-e5da-429b-9ec8-d69d8f3bfc79%2Fdance_redacted.mp4)

### Analyze mode
The **analyze** pass of the two-pass workflow takes a video input and produces a JSON file of face locations, and jpg images of each detected face.

| Stage | File Name | Notes |
| --- | --- | --- |
| Input asset |foo.bar |Video in WMV, MPV, or MP4 format |
| Input config |Job configuration preset |{'version':'1.0', 'options': {'mode':'analyze'}} |
| Output asset |foo_annotations.json |Annotation data of face locations in JSON format. This can be edited by the user to modify the blurring bounding boxes. See sample below. |
| Output asset |foo_thumb%06d.jpg [foo_thumb000001.jpg, foo_thumb000002.jpg] |A cropped jpg of each detected face, where the number indicates the labelId of the face |

#### Output example:

```json
	{
	  "version": 1,
	  "timescale": 24000,
	  "offset": 0,
	  "framerate": 23.976,
	  "width": 1280,
	  "height": 720,
	  "fragments": [
	    {
	      "start": 0,
	      "duration": 48048,
	      "interval": 1001,
	      "events": [
	        [],
	        [],
	        [],
	        [],
	        [],
	        [],
	        [],
	        [],
	        [],
	        [],
	        [],
	        [],
	        [],
	        [
	          {
	            "index": 13,
	            "id": 1138,
	            "x": 0.29537,
	            "y": -0.18987,
	            "width": 0.36239,
	            "height": 0.80335
	          },
	          {
	            "index": 13,
	            "id": 2028,
	            "x": 0.60427,
	            "y": 0.16098,
	            "width": 0.26958,
	            "height": 0.57943
	          }
	        ],

    … truncated
```

### Redact mode
The second pass of the workflow takes a larger number of inputs that must be combined into a single asset.

This includes a list of IDs to blur, the original video, and the annotations JSON. This mode uses the annotations to apply blurring on the input video.

The output from the Analyze pass does not include the original video. The video needs to be uploaded into the input asset for the Redact mode task and selected as the primary file.

| Stage | File Name | Notes |
| --- | --- | --- |
| Input asset |foo.bar |Video in WMV, MPV, or MP4 format. Same video as in step 1. |
| Input asset |foo_annotations.json |annotations metadata file from phase one, with optional modifications. |
| Input asset |foo_IDList.txt (Optional) |Optional new line separated list of face IDs to redact. If left blank, this blurs all faces. |
| Input config |Job configuration preset |{'version':'1.0', 'options': {'mode':'redact'}} |
| Output asset |foo_redacted.mp4 |Video with blurring applied based on annotations |

#### Example output
This is the output from an IDList with one ID selected.

[view this video](https://ampdemo.azureedge.net/?url=https%3A%2F%2Freferencestream-samplestream.streaming.mediaservices.windows.net%2Fad6e24a2-4f9c-46ee-9fa7-bf05e20d19ac%2Fdance_redacted1.mp4)

Example foo_IDList.txt
 
     1
     2
     3

## Blur types

In the **Combined** or **Redact** mode, there are 5 different blur modes you can choose from via the JSON input configuration: **Low**, **Med**, **High**, **Box**, and **Black**. By default **Med** is used.

You can find samples of the blur types below.

### Example JSON:

```json
	{'version':'1.0', 'options': {'Mode': 'Combined', 'BlurType': 'High'}}
```

#### Low

![Low](./media/media-services-face-redaction/blur1.png)
 
#### Med

![Med](./media/media-services-face-redaction/blur2.png)

#### High

![High](./media/media-services-face-redaction/blur3.png)

#### Box

![Box](./media/media-services-face-redaction/blur4.png)

#### Black

![Black](./media/media-services-face-redaction/blur5.png)

## Elements of the output JSON file

The Redaction MP provides high precision face location detection and tracking that can detect up to 64 human faces in a video frame. Frontal faces provide the best results, while side faces and small faces (less than or equal to 24x24 pixels) are challenging.

[!INCLUDE [media-services-analytics-output-json](../../../includes/media-services-analytics-output-json.md)]

## .NET sample code

The following program shows how to:

1. Create an asset and upload a media file into the asset.
2. Create a job with a face redaction task based on a configuration file that contains the following json preset: 

    ```json
            {
                'version':'1.0',
                'options': {
                    'mode':'combined'
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

namespace FaceRedaction
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

            // Run the FaceRedaction job.
            var asset = RunFaceRedactionJob(@"C:\supportFiles\FaceRedaction\SomeFootage.mp4",
                        @"C:\supportFiles\FaceRedaction\config.json");

            // Download the job output asset.
            DownloadAsset(asset, @"C:\supportFiles\FaceRedaction\Output");
        }

        static IAsset RunFaceRedactionJob(string inputMediaFilePath, string configurationFile)
        {
            // Create an asset and upload the input media file to storage.
            IAsset asset = CreateAssetAndUploadSingleFile(inputMediaFilePath,
            "My Face Redaction Input Asset",
            AssetCreationOptions.None);

            // Declare a new job.
            IJob job = _context.Jobs.Create("My Face Redaction Job");

            // Get a reference to Azure Media Redactor.
            string MediaProcessorName = "Azure Media Redactor";

            var processor = GetLatestMediaProcessorByName(MediaProcessorName);

            // Read configuration from the specified file.
            string configuration = File.ReadAllText(configurationFile);

            // Create a task with the encoding details, using a string preset.
            ITask task = job.Tasks.AddNew("My Face Redaction Task",
            processor,
            configuration,
            TaskOptions.None);

            // Specify the input asset.
            task.InputAssets.Add(asset);

            // Add an output asset to contain the results of the job.
            task.OutputAssets.AddNew("My Face Redaction Output Asset", AssetCreationOptions.None);

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

## Next steps

[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

## Related links
[Azure Media Services Analytics Overview](media-services-analytics-overview.md)

[Azure Media Analytics demos](https://azuremedialabs.azurewebsites.net/demos/Analytics.html)

