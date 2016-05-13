<properties
	pageTitle="Detect Motions with Azure Media Analytics"
	description="The Azure Media Motion Detector media processor (MP) enables you to efficiently identify sections of interest within an otherwise long and uneventful video."
	services="media-services"
	documentationCenter=""
	authors="juliako"
	manager="erikre"
	editor=""/>

<tags
	ms.service="media-services"
	ms.workload="media"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="04/14/2016"   
	ms.author="milanga;juliako;"/>
 
# Detect Motions with Azure Media Analytics

##Overview

The **Azure Media Motion Detector** media processor (MP) enables you to efficiently identify sections of interest within an otherwise long and uneventful video. Motion detection can be used on static camera footage to identify sections of the video where motion occurs. It generates a JSON file containing a metadata with timestamps and the bounding region where the event occurred.

Targeted towards security video feeds, this technology is able to categorize motion into relevant events and false positives such as shadows and lighting changes. This allows you to generate security alerts from camera feeds without being spammed with endless irrelevant events, while being able to extract moments of interest from extremely long surveillance videos.

The **Azure Media Motion Detector** MP is currently in Preview.

This topic gives details about  **Azure Media Motion Detector** and shows how to use it with Media Services SDK for .NET

##Motion Detector input files

Video files. Currently, the following formats are supported: MP4, MOV, and WMV.

##Motion Detector output files

A motion detection job will return a JSON file in the output asset which describes the motion alerts, and their categories, within the video. The file will contain information about the time and duration of motion detected in the video.

Currently, motion detection supports only the generic motion category, which is referred to as ***type 2*** in the output.

X and Y coordinates and sizes will be listed using a normalized float between 0.0 and 1.0. Multiply this by the video height and width resolution to get the bounding box for the region of detected motion.

Each output is split into fragments and subdivided into intervals to define the data within the video. Fragment lengths do not need to be equal, and may span long lengths when there is no motion at all detected.

The Motion Detector API provides indicators once there are objects in motion in a fixed background video (e.g. a surveillance video). The Motion Detector is trained to reduce false alarms, such as lighting and shadow changes. Current limitations of the algorithms include night vision videos, semi-transparent objects, and small objects.

###<a id="output_elements"></a>Elements of the output JSON file

The following table describes elements of the output JSON file.

Element|Description
---|---
Version|This refers to the version of the Video API.
Timescale|"Ticks" per second of the video.
Offset|The time offset for timestamps in "ticks". In version 1.0 of Video APIs, this will always be 0. In future scenarios we support, this value may change.
Framerate|Frames per second of the video.
Width, Height|Refers to the width and height of the video in pixels.
Start|The start timestamp in "ticks".
Duration|The length of the event, in "ticks".
Interval|The interval of each entry in the event, in "ticks".
Events|Each event fragment contains the motion detected within that time duration.
Type|In the current version, this is always ‘2’ for generic motion. This label gives Video APIs the flexibility to categorize motion in future versions.
RegionID|As explained above, this will always be 0 in this version. This label gives Video API the flexibility to find motion in various regions in future versions.
Regions|Refers to the area in your video where you care about motion. In the current version of Video APIs, you cannot specify a region, instead the whole surface of the video will be the area of motion that will be detected.<br/>-ID represents the region area – in this version there is only one, ID 0. <br/>-Rectangle represents the shape of the region you care about for motion. In this version, it is always a rectangle. <br/>-The region has dimensions in X, Y, Width, and Height. The X and Y coordinates represent the upper left hand XY coordinates of the region in a normalized scale of 0.0 to 1.0. The width and height represent the size of the region in a normalized scale of 0.0 to 1.0. In the current version, X, Y, Width, and Height are always fixed at 0, 0 and 1, 1.<br/>-Fragments The metadata is chunked up into different segments called fragments. Each fragment contains a start, duration, interval number, and event(s). A fragment with no events means that no motion was detected during that start time and duration.
Brackets []|Each bracket represents one interval in the event. Empty brackets for that interval means that no motion was detected.
 

##Task configuration (preset)

When creating a task with **Azure Media Motion Detector**, you must specify a configuration preset. Currently, you cannot set any options in the Azure Media Motion Detector configuration preset. The following is the minimum configuration preset that you must provide. 

	{"version":"1.0"}

##Sample videos and Motion Detector outputs

###Example with actual motion

[Example with actual motion](http://ampdemo.azureedge.net/azuremediaplayer.html?url=https%3A%2F%2Freferencestream-samplestream.streaming.mediaservices.windows.net%2Fd54876c6-89a5-41de-b1f4-f45b6e10a94f%2FGarage.ism%2Fmanifest)

###JSON output

	 {
	 "version": "1.0",
	 "timescale": 60000,
	 "offset": 0,
	 "framerate": 30,
	 "width": 1920,
	 "height": 1080,
	 "regions": [
	   {
	     "id": 0,
	     "type": "rectangle",
	     "x": 0,
	     "y": 0,
	     "width": 1,
	     "height": 1
	   }
	 ],
	 "fragments": [
	   {
	     "start": 0,
	     "duration": 68510
	   },
	   {
	     "start": 68510,
	     "duration": 969999,
	     "interval": 969999,
	     "events": [
	       [
	         {
	           "type": 2,
	           "regionId": 0
	         }
	       ]
	     ]
	   },
	   {
	     "start": 1038509,
	     "duration": 41489
	   }
	 ]
	}

###Example with false positives

[Example with false positives (light changes):](http://ampdemo.azureedge.net/azuremediaplayer.html?url=https%3A%2F%2Freferencestream-samplestream.streaming.mediaservices.windows.net%2Ffdc6656b-1c10-4f3f-aa7c-07ba073c1615%2FLivingRoomLight.ism%2Fmanifest&tech=flash)

###JSON output

	{
	    "version": "1.0",
	    "timescale": 30000,
	    "offset": 0,
	    "framerate": 29.97,
	    "width": 1920,
	    "height": 1080,
	    "regions": [
	    {
	        "id": 0,
	        "type": "rectangle",
	        "x": 0,
	        "y": 0,
	        "width": 1,
	        "height": 1
	    }
	    ],
	    "fragments": [
	    {
	        "start": 0,
	        "duration": 320320
	    }
	    ]
	}


##Limitations

- The supported input video formats include MP4, MOV, and WMV.
- Motion Detection is optimized for stationary background videos. The algorithm focuses on reducing false alarms, such as lighting changes, and shadows.
- Some motion may not be detected due to technical challenges; e.g. night vision videos, semi-transparent objects, and small objects.


## Sample code

The following program shows how to:

1. Create an asset and upload a media file into the asset.
1. Creates a job with a video motion detection task based on a configuration file that contains the following json preset. 
					
		{
		    "version": "1.0"
		}

1. Downloads the output JSON files. 
		 
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
		            // Used the cached credentials to create CloudMediaContext.
		            _context = new CloudMediaContext(_cachedCredentials);
		
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
		            task.OutputAssets.AddNew("My Video Motion Detectoion Output Asset", AssetCreationOptions.None);
		
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


##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

##Related links

[Azure Media Services Analytics Overview](media-services-analytics-overview.md)

[Azure Media Analytics demos](http://azuremedialabs.azurewebsites.net/demos/Analytics.html)
