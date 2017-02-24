---
title: Use Azure Media Encoder Standard to auto-generate a bitrate ladder | Microsoft Docs
description: This topic shows how to use Media Encoder Standard (MES) to auto-generate a bitrate ladder based on the input resolution and bitrate. The input resolution and bitrate will never be exceeded. For example, if the input is 720p at 3Mbps, output will remain 720p at best, and will start at rates lower than 3Mbps.
services: media-services
documentationcenter: ''
author: juliako
manager: erikre
editor: ''

ms.assetid: 63ed95da-1b82-44b0-b8ff-eebd535bc5c7
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/29/2016
ms.author: juliako

---
#  Use Azure Media Standard to auto-generate a bitrate ladder

## Overview

This topic shows how to use Media Encoder Standard (MES) to auto-generate a bitrate ladder (bitrate-resolution pairs) based on the input resolution and bitrate. The auto-generated preset will never exceed the input resolution and bitrate. For example, if the input is 720p at 3Mbps, output will remain 720p at best, and will start at rates lower than 3Mbps.

To use this feature, you need to specify the **Adaptive Streaming** preset when creating an encoding task. When using the **Adaptive Streaming** preset, the MES encoder will intelligently cap a bitrate ladder. However, you will not be able to control the encoding costs, since the service determines how many layers to use and at what resolution. You can see examples of output XMLs produced by MES as a result of encoding with the **Adaptive Streaming** preset at the [end](#output) of this topic.

## <a id="encoding_with_dotnet"></a>Encoding with Media Services .NET SDK

The following code example uses Media Services .NET SDK to perform the following tasks:

- Create an encoding job.
- Get a reference to the Media Encoder Standard encoder.
- Add an encoding task to the job and specify to use the **Adaptive Streaming** preset. 
- Create an output asset that will contain the encoded asset.
- Add an event handler to check the job progress.
- Submit the job.

		using System;
		using System.Configuration;
		using System.IO;
		using System.Linq;
		using Microsoft.WindowsAzure.MediaServices.Client;
		using System.Threading;

		namespace AdaptiveStreamingMESPresest
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
			    // Used the chached credentials to create CloudMediaContext.
			    _context = new CloudMediaContext(_cachedCredentials);

			    // Get an uploaded asset.
			    var asset = _context.Assets.FirstOrDefault();

			    // Encode and generate the output using custom presets.
			    EncodeToAdaptiveBitrateMP4Set(asset);

			    Console.ReadLine();
			}

			static public IAsset EncodeToAdaptiveBitrateMP4Set(IAsset asset)
			{
			    // Declare a new job.
			    IJob job = _context.Jobs.Create("Media Encoder Standard Job");

			    // Get a media processor reference, and pass to it the name of the 
			    // processor to use for the specific task.
			    IMediaProcessor processor = GetLatestMediaProcessorByName("Media Encoder Standard");

			    // Create a task
			    ITask task = job.Tasks.AddNew("Media Encoder Standard encoding task",
				processor,
				"Adaptive Streaming",
				TaskOptions.None);

			    // Specify the input asset to be encoded.
			    task.InputAssets.Add(asset);
			    // Add an output asset to contain the results of the job. 
			    // This output is specified as AssetCreationOptions.None, which 
			    // means the output asset is not encrypted. 
			    task.OutputAssets.AddNew("Output asset",
				AssetCreationOptions.None);

			    job.StateChanged += new EventHandler<JobStateChangedEventArgs>(JobStateChanged);
			    job.Submit();
			    job.GetExecutionProgressTask(CancellationToken.None).Wait();

			    return job.OutputMediaAssets[0];
			}
			private static void JobStateChanged(object sender, JobStateChangedEventArgs e)
			{
			    Console.WriteLine("Job state changed event:");
			    Console.WriteLine("  Previous state: " + e.PreviousState);
			    Console.WriteLine("  Current state: " + e.CurrentState);
			    switch (e.CurrentState)
			    {
				case JobState.Finished:
				    Console.WriteLine();
				    Console.WriteLine("Job is finished. Please wait while local tasks or downloads complete...");
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
				    break;
				default:
				    break;
			    }
			}
			private static IMediaProcessor GetLatestMediaProcessorByName(string mediaProcessorName)
			{
			    var processor = _context.MediaProcessors.Where(p => p.Name == mediaProcessorName).
			    ToList().OrderBy(p => new Version(p.Version)).LastOrDefault();

			    if (processor == null)
				throw new ArgumentException(string.Format("Unknown media processor", mediaProcessorName));

			    return processor;
			}

		    }

		}

## <a id="output"></a>Output XMLs

This section shows three examples of output XMLs produced by MES as a result of encoding with the **Adaptive Streaming** preset. For more information about MES schema, see [this](media-services-mes-schema.md) topic.

### Source with Height="1080" and Framerate="29.970" 
	
	<?xml version="1.0" encoding="utf-8"?>
	<AssetFiles xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/windowsazure/mediaservices/2013/05/mediaencoder/metadata">
	  <AssetFile Name="AMS_Platform_Promo_1920x1080_6780.mp4" Size="117036387" Duration="PT2M59.246S">
	    <Sources>
	      <Source Name="AMS_Platform_Promo_1920x1080_6780.mp4" />
	    </Sources>
	    <VideoTracks>
	      <VideoTrack Id="1" FourCC="avc1" Profile="High" Level="4.1" Width="1920" Height="1080" DisplayAspectRatioNumerator="16" DisplayAspectRatioDenominator="9" Framerate="29.970" TargetFramerate="0" Bitrate="5221" TargetBitrate="0" />
	    </VideoTracks>
	  </AssetFile>
	  <AssetFile Name="AMS_Platform_Promo_1280x720_3520.mp4" Size="61880376" Duration="PT2M59.246S">
	    <Sources>
	      <Source Name="AMS_Platform_Promo_1280x720_3520.mp4" />
	    </Sources>
	    <VideoTracks>
	      <VideoTrack Id="1" FourCC="avc1" Profile="High" Level="3.2" Width="1280" Height="720" DisplayAspectRatioNumerator="16" DisplayAspectRatioDenominator="9" Framerate="29.970" TargetFramerate="0" Bitrate="2759" TargetBitrate="0" />
	    </VideoTracks>
	  </AssetFile>
	  <AssetFile Name="AMS_Platform_Promo_960x540_2210.mp4" Size="38870473" Duration="PT2M59.246S">
	    <Sources>
	      <Source Name="AMS_Platform_Promo_960x540_2210.mp4" />
	    </Sources>
	    <VideoTracks>
	      <VideoTrack Id="1" FourCC="avc1" Profile="High" Level="3.1" Width="960" Height="540" DisplayAspectRatioNumerator="16" DisplayAspectRatioDenominator="9" Framerate="29.970" TargetFramerate="0" Bitrate="1732" TargetBitrate="0" />
	    </VideoTracks>
	  </AssetFile>
	  <AssetFile Name="AMS_Platform_Promo_640x360_1150.mp4" Size="20913994" Duration="PT2M59.246S">
	    <Sources>
	      <Source Name="AMS_Platform_Promo_640x360_1150.mp4" />
	    </Sources>
	    <VideoTracks>
	      <VideoTrack Id="1" FourCC="avc1" Profile="High" Level="3.0" Width="640" Height="360" DisplayAspectRatioNumerator="16" DisplayAspectRatioDenominator="9" Framerate="29.970" TargetFramerate="0" Bitrate="930" TargetBitrate="0" />
	    </VideoTracks>
	  </AssetFile>
	  <AssetFile Name="AMS_Platform_Promo_480x270_720.mp4" Size="13431254" Duration="PT2M59.246S">
	    <Sources>
	      <Source Name="AMS_Platform_Promo_480x270_720.mp4" />
	    </Sources>
	    <VideoTracks>
	      <VideoTrack Id="1" FourCC="avc1" Profile="High" Level="2.1" Width="480" Height="270" DisplayAspectRatioNumerator="16" DisplayAspectRatioDenominator="9" Framerate="29.970" TargetFramerate="0" Bitrate="596" TargetBitrate="0" />
	    </VideoTracks>
	  </AssetFile>
	  <AssetFile Name="AMS_Platform_Promo_320x180_380.mp4" Size="7361873" Duration="PT2M59.246S">
	    <Sources>
	      <Source Name="AMS_Platform_Promo_320x180_380.mp4" />
	    </Sources>
	    <VideoTracks>
	      <VideoTrack Id="1" FourCC="avc1" Profile="High" Level="1.3" Width="320" Height="180" DisplayAspectRatioNumerator="16" DisplayAspectRatioDenominator="9" Framerate="29.970" TargetFramerate="0" Bitrate="326" TargetBitrate="0" />
	    </VideoTracks>
	  </AssetFile>
	  <AssetFile Name="AMS_Platform_Promo_AACAudio_128_Audio1.mp4" Size="2902955" Duration="PT2M59.286S">
	    <Sources>
	      <Source Name="AMS_Platform_Promo_AACAudio_128_Audio1.mp4" />
	    </Sources>
	    <AudioTracks>
	      <AudioTrack Id="1" Codec="aac" Language="eng" Channels="2" SamplingRate="48000" Bitrate="127" BitsPerSample="0" />
	    </AudioTracks>
	  </AssetFile>
	</AssetFiles>

### Source with Height="720" Framerate="23.976"
	
	<?xml version="1.0" encoding="utf-8"?>
	<AssetFiles xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/windowsazure/mediaservices/2013/05/mediaencoder/metadata">
	  <AssetFile Name="Future_of_Work_March2015_1280x720_2940.mp4" Size="135033677" Duration="PT6M27.513S">
	    <Sources>
	      <Source Name="Future_of_Work_March2015_1280x720_2940.mp4" />
	    </Sources>
	    <VideoTracks>
	      <VideoTrack Id="1" FourCC="avc1" Profile="High" Level="3.1" Width="1280" Height="720" DisplayAspectRatioNumerator="16" DisplayAspectRatioDenominator="9" Framerate="23.976" TargetFramerate="0" Bitrate="2785" TargetBitrate="0" />
	    </VideoTracks>
	  </AssetFile>
	  <AssetFile Name="Future_of_Work_March2015_960x540_1850.mp4" Size="84115219" Duration="PT6M27.513S">
	    <Sources>
	      <Source Name="Future_of_Work_March2015_960x540_1850.mp4" />
	    </Sources>
	    <VideoTracks>
	      <VideoTrack Id="1" FourCC="avc1" Profile="High" Level="3.1" Width="960" Height="540" DisplayAspectRatioNumerator="16" DisplayAspectRatioDenominator="9" Framerate="23.976" TargetFramerate="0" Bitrate="1734" TargetBitrate="0" />
	    </VideoTracks>
	  </AssetFile>
	  <AssetFile Name="Future_of_Work_March2015_640x360_960.mp4" Size="43508051" Duration="PT6M27.513S">
	    <Sources>
	      <Source Name="Future_of_Work_March2015_640x360_960.mp4" />
	    </Sources>
	    <VideoTracks>
	      <VideoTrack Id="1" FourCC="avc1" Profile="High" Level="3.0" Width="640" Height="360" DisplayAspectRatioNumerator="16" DisplayAspectRatioDenominator="9" Framerate="23.976" TargetFramerate="0" Bitrate="895" TargetBitrate="0" />
	    </VideoTracks>
	  </AssetFile>
	  <AssetFile Name="Future_of_Work_March2015_480x270_600.mp4" Size="27204529" Duration="PT6M27.513S">
	    <Sources>
	      <Source Name="Future_of_Work_March2015_480x270_600.mp4" />
	    </Sources>
	    <VideoTracks>
	      <VideoTrack Id="1" FourCC="avc1" Profile="High" Level="2.1" Width="480" Height="270" DisplayAspectRatioNumerator="16" DisplayAspectRatioDenominator="9" Framerate="23.976" TargetFramerate="0" Bitrate="559" TargetBitrate="0" />
	    </VideoTracks>
	  </AssetFile>
	  <AssetFile Name="Future_of_Work_March2015_320x180_320.mp4" Size="14579939" Duration="PT6M27.513S">
	    <Sources>
	      <Source Name="Future_of_Work_March2015_320x180_320.mp4" />
	    </Sources>
	    <VideoTracks>
	      <VideoTrack Id="1" FourCC="avc1" Profile="High" Level="1.3" Width="320" Height="180" DisplayAspectRatioNumerator="16" DisplayAspectRatioDenominator="9" Framerate="23.976" TargetFramerate="0" Bitrate="298" TargetBitrate="0" />
	    </VideoTracks>
	  </AssetFile>
	  <AssetFile Name="Future_of_Work_March2015_AACAudio_128_Audio1.mp4" Size="6274492" Duration="PT6M27.563S">
	    <Sources>
	      <Source Name="Future_of_Work_March2015_AACAudio_128_Audio1.mp4" />
	    </Sources>
	    <AudioTracks>
	      <AudioTrack Id="1" Codec="aac" Language="eng" Channels="2" SamplingRate="48000" Bitrate="127" BitsPerSample="0" />
	    </AudioTracks>
	  </AssetFile>
	</AssetFiles>

### Source with Height="360" and Framerate="29.970" 

	<?xml version="1.0" encoding="utf-8"?>
	<AssetFiles xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/windowsazure/mediaservices/2013/05/mediaencoder/metadata">
	  <AssetFile Name="Running Man episode 309_640x360_700.mp4" Size="401364318" Duration="PT1H17M22.939S">
	    <Sources>
	      <Source Name="Running Man episode 309_640x360_700.mp4" />
	    </Sources>
	    <VideoTracks>
	      <VideoTrack Id="1" FourCC="avc1" Profile="High" Level="3.0" Width="640" Height="360" DisplayAspectRatioNumerator="16" DisplayAspectRatioDenominator="9" Framerate="29.970" TargetFramerate="0" Bitrate="688" TargetBitrate="0" />
	    </VideoTracks>
	  </AssetFile>
	  <AssetFile Name="Running Man episode 309_480x270_440.mp4" Size="254630247" Duration="PT1H17M22.939S">
	    <Sources>
	      <Source Name="Running Man episode 309_480x270_440.mp4" />
	    </Sources>
	    <VideoTracks>
	      <VideoTrack Id="1" FourCC="avc1" Profile="High" Level="2.1" Width="480" Height="270" DisplayAspectRatioNumerator="16" DisplayAspectRatioDenominator="9" Framerate="29.970" TargetFramerate="0" Bitrate="436" TargetBitrate="0" />
	    </VideoTracks>
	  </AssetFile>
	  <AssetFile Name="Running Man episode 309_320x180_230.mp4" Size="134026340" Duration="PT1H17M22.939S">
	    <Sources>
	      <Source Name="Running Man episode 309_320x180_230.mp4" />
	    </Sources>
	    <VideoTracks>
	      <VideoTrack Id="1" FourCC="avc1" Profile="High" Level="1.3" Width="320" Height="180" DisplayAspectRatioNumerator="16" DisplayAspectRatioDenominator="9" Framerate="29.970" TargetFramerate="0" Bitrate="228" TargetBitrate="0" />
	    </VideoTracks>
	  </AssetFile>
	  <AssetFile Name="Running Man episode 309_AACAudio_128_Audio1.mp4" Size="75159887" Duration="PT1H17M22.987S">
	    <Sources>
	      <Source Name="Running Man episode 309_AACAudio_128_Audio1.mp4" />
	    </Sources>
	    <AudioTracks>
	      <AudioTrack Id="1" Codec="aac" Language="und" Channels="2" SamplingRate="48000" Bitrate="128" BitsPerSample="0" />
	    </AudioTracks>
	  </AssetFile>
	</AssetFiles>

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

## See Also
[Media Services Encoding Overview](media-services-encode-asset.md)

