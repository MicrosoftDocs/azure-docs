<properties
	pageTitle="Use Azure Media Analytics to convert text content in video files into digital text | Microsoft Azure"
	description="Azure Media Analytics OCR (optical character recognition) enables you to convert text content in video files into editable, searchable digital text.  This allows you to automate the extraction of meaningful metadata from the video signal of your media."
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
	ms.date="06/27/2016"   
	ms.author="juliako"/>
 
#Use Azure Media Analytics to convert text content in video files into digital text 

##Overview

If you need to extract text content from your video files and generate an editable, searchable digital text, you should use Azure Media Analytics OCR (optical character recognition). This Azure Media Processor detects text content in you video files and generates text files for your use. OCR enables you to automate the extraction of meaningful metadata from the video signal of your media.

When used in conjunction with a search engine, you can easily index your media by text, and enhance the discoverability of your content. This is extremely useful in highly textual video, like a video recording or screen-capture of a slideshow presentation.The Azure OCR Media Processor is optimized for digital text.

The **Azure Media OCR** media processor is currently in Preview.

This topic gives details about  **Azure Media OCR** and shows how to use it with Media Services SDK for .NET. For additional information and examples, see [this blog](https://azure.microsoft.com/blog/announcing-video-ocr-public-preview-new-config/).

##OCR input files

Video files. Currently, the following formats are supported: MP4, MOV, and WMV.

##Task configuration 

Task configuration (preset). When creating a task with **Azure Media OCR**, you must specify a configuration preset using JSON  or XML. 

###Attribute descriptions

Attribute name|Description
---|---
Language|(optional) describes the language of text for which to look. One of the following: AutoDetect (default), Arabic, ChineseSimplified, ChineseTraditional, Czech Danish, Dutch, English, Finnish, French, German,  Greek, Hungarian, Italian, Japanese, Korean, Norwegian, Polish, Portuguese, Romanian, Russian, SerbianCyrillic, SerbianLatin, Slovak, Spanish, Swedish, Turkish.
TextOrientation|(optional) describes the orientation of text for which to look.  "Left" means that the top of all letters are pointed towards the left.  Default text (like that which can be found in a book) can be called "Up" oriented.  One of the following: AutoDetect (default), Up, Right, Down, Left.
TimeInterval|(optional) describes the sampling rate.  Default is every 1/2 second.<br/>JSON format – HH:mm:ss.SSS (default 00:00:00.500)<br/>XML format – W3C XSD duration primitive (default PT0.5)
DetectRegions|(optional) An array of DetectRegion objects specifying regions within the video frame in which to detect text.<br/>A DetectRegion object is made of the following four integer values:<br/>Left – pixels from the left-margin<br/>Top – pixels from the top-margin<br/>Width – width of the region in pixels<br/>Height – height of the region in pixels

####JSON preset example
	 	
	{
	    'Version':'1.0', 
	    'Options': 
	    {
	    'Language':'English', 
	        'TimeInterval':'00:00:01.5',
	        'DetectRegions': 
	         [
	            {'Left':'1','Top':'1','Width':'1','Height':'1'},
	            {'Left':'2','Top':'2','Width':'2','Height':'2'}
	         ],
	        'TextOrientation':'Up'
	    }
	}

####XML preset example

	<?xml version=""1.0"" encoding=""utf-16""?>
	<VideoOcrPreset xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/2001/XMLSchema"" Version=""1.0"" xmlns=""http://www.windowsazure.com/media/encoding/Preset/2014/03"">
	  <Options>
	     <Language>English</Language>
	     <TimeInterval>PT1.5S</TimeInterval>
	     <DetectRegions>
	         <DetectRegion>
	               <Left>1</Left>
	               <Top>1</Top>
	               <Width>1</Width>
	               <Height>1</Height>
	        </DetectRegion>
	   </DetectRegions>
	   <TextOrientation>Up</TextOrientation>
	  </Options>
	</VideoOcrPreset>

##OCR output files

The output of the OCR media processor is a JSON file.

###Elements of the output JSON file

The Video OCR output provides time-segmented data on the characters found in your video.  You can use attributes such as language or orientation to hone-in on exactly the words that you are interested in analyzing. 

The output contains the following attributes:

Element|Description
---|---
Timescale|"ticks" per second of the video
Offset|time offset for timestamps. In version 1.0 of Video APIs, this will always be 0.
Framerate|Frames per second of the video
width|width of the video in pixels
height|height of the video in pixels
Fragments|array of time-based chunks of video into which the metadata is chunked
start|start time of a fragment in "ticks"
duration|length of a fragment in "ticks"
interval|interval of each event within the given fragment
events|array containing regions
region|object representing detected words or phrases
language|language of the text detected within a region
orientation|orientation of the text detected within a region
lines|array of lines of text detected within a region
text|the actual text

###JSON output example

The following output example contains the general video information and several video fragments. In every video fragment, it contains every region which is detected by OCR MP with the language and the its text orientation. The region also contains every word line in this region with the line’s text, the line’s position, and every word information (word content, position and confidence) in this line. The following is an example, and I put some comments inline.

	{
		"version": 1, 
		"timescale": 90000, 
		"offset": 0, 
		"framerate": 30, 
		"width": 640, 
		"height": 480,  // general video information
		"fragments": [
		    {
		        "start": 0, 
		        "duration": 180000, 
		        "interval": 90000,  // the time information about this fragment
		        "events": [
		            [
		               { 
		                    "region": { // the detected region array in this fragment 
		                        "language": "English",  // region language
		                        "orientation": "Up",  // text orientation
		                        "lines": [  // line information array in this region, including the text and the position
		                            {
		                                "text": "One Two", 
		                                "left": 10, 
		                                "top": 10, 
		                                "right": 210, 
		                                "bottom": 110, 
		                                "word": [  // word information array in this line
		                                    {
		                                        "text": "One", 
		                                        "left": 10, 
		                                        "top": 10, 
		                                        "right": 110, 
		                                        "bottom": 110, 
		                                        "confidence": 900
		                                    }, 
		                                    {
		                                        "text": "Two", 
		                                        "left": 110, 
		                                        "top": 10, 
		                                        "right": 210, 
		                                        "bottom": 110, 
		                                        "confidence": 910
		                                    }
		                                ]
		                            }
		                        ]
		                    }
		                }
		            ]
		        ]
		    }
		]
	}

## Sample code

The following program shows how to:

1. Create an asset and upload a media file into the asset.
1. Creates a job with a OCR configuration/preset file.
1. Downloads the output JSON files. 
		 
        using System;
		using System.Configuration;
		using System.IO;
		using System.Linq;
		using Microsoft.WindowsAzure.MediaServices.Client;
		using System.Threading;
		using System.Threading.Tasks;
		
		namespace OCR
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
		
		            // Run the OCR job.
		            var asset = RunOCRJob(@"C:\supportFiles\OCR\presentation.mp4",
		                                        @"C:\supportFiles\OCR\config.json");
		
		            // Download the job output asset.
		            DownloadAsset(asset, @"C:\supportFiles\OCR\Output");
		        }
		
		        static IAsset RunOCRJob(string inputMediaFilePath, string configurationFile)
		        {
		            // Create an asset and upload the input media file to storage.
		            IAsset asset = CreateAssetAndUploadSingleFile(inputMediaFilePath,
		                "My OCR Input Asset",
		                AssetCreationOptions.None);
		
		            // Declare a new job.
		            IJob job = _context.Jobs.Create("My OCR Job");
		
		            // Get a reference to Azure Media OCR.
		            string MediaProcessorName = "Azure Media OCR";
		
		            var processor = GetLatestMediaProcessorByName(MediaProcessorName);
		
		            // Read configuration from the specified file.
		            string configuration = File.ReadAllText(configurationFile);
		
		            // Create a task with the encoding details, using a string preset.
		            ITask task = job.Tasks.AddNew("My OCR Task",
		                processor,
		                configuration,
		                TaskOptions.None);
		
		            // Specify the input asset.
		            task.InputAssets.Add(asset);
		
		            // Add an output asset to contain the results of the job.
		            task.OutputAssets.AddNew("My OCR Output Asset", AssetCreationOptions.None);
		
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
