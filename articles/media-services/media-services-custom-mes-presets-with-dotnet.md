---
title: Customizing Media Encoder Standard presets | Microsoft Docs
description: This topic shows how to perform advanced encoding by customizing Media Encoder Standard task presets. The topic shows how to use Media Services .NET SDK to create an encoding task and job. It also shows how to supply custom presets to the encoding job.
services: media-services
documentationcenter: ''
author: juliako
manager: erikre
editor: ''

ms.assetid: ec95392f-d34a-4c22-a6df-5274eaac445b
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/29/2016
ms.author: juliako

---
# Customizing Media Encoder Standard presets

## Overview

This topic shows how to perform advanced encoding with Media Encoder Standard (MES) using a custom preset. The topic uses .NET to create an encoding task and a job that executes this task.  

In this topic you will see how to customize a preset by taking the [H264 Multiple Bitrate 720p](media-services-mes-preset-H264-Multiple-Bitrate-720p.md) preset and reducing the number of layers. The [Customizing Media Encoder Standard presets](media-services-advanced-encoding-with-mes.md) topic demonstrates custom presets that can be used to perform advanced encoding tasks.

## <a id="customizing_presets"></a> Customizing a MES preset

### Original preset

Save the JSON defined in the [H264 Multiple Bitrate 720p](media-services-mes-preset-H264-Multiple-Bitrate-720p.md) topic in some file with .json extension. For example, **CustomPreset_JSON.json**.

### Customized preset

Open the **CustomPreset_JSON.json** file and remove first three layers from **H264Layers** so your file looks like this.

	
	{  
	  "Version": 1.0,  
	  "Codecs": [  
	    {  
	      "KeyFrameInterval": "00:00:02",  
	      "H264Layers": [  
	        {  
	          "Profile": "Auto",  
	          "Level": "auto",  
	          "Bitrate": 1000,  
	          "MaxBitrate": 1000,  
	          "BufferWindow": "00:00:05",  
	          "Width": 640,  
	          "Height": 360,  
	          "BFrames": 3,  
	          "ReferenceFrames": 3,  
	          "AdaptiveBFrame": true,  
	          "Type": "H264Layer",  
	          "FrameRate": "0/1"  
	        },  
	        {  
	          "Profile": "Auto",  
	          "Level": "auto",  
	          "Bitrate": 650,  
	          "MaxBitrate": 650,  
	          "BufferWindow": "00:00:05",  
	          "Width": 640,  
	          "Height": 360,  
	          "BFrames": 3,  
	          "ReferenceFrames": 3,  
	          "AdaptiveBFrame": true,  
	          "Type": "H264Layer",  
	          "FrameRate": "0/1"  
	        },  
	        {  
	          "Profile": "Auto",  
	          "Level": "auto",  
	          "Bitrate": 400,  
	          "MaxBitrate": 400,  
	          "BufferWindow": "00:00:05",  
	          "Width": 320,  
	          "Height": 180,  
	          "BFrames": 3,  
	          "ReferenceFrames": 3,  
	          "AdaptiveBFrame": true,  
	          "Type": "H264Layer",  
	          "FrameRate": "0/1"  
	        }  
	      ],  
	      "Type": "H264Video"  
	    },  
	    {  
	      "Profile": "AACLC",  
	      "Channels": 2,  
	      "SamplingRate": 48000,  
	      "Bitrate": 128,  
	      "Type": "AACAudio"  
	    }  
	  ],  
	  "Outputs": [  
	    {  
	      "FileName": "{Basename}_{Width}x{Height}_{VideoBitrate}.mp4",  
	      "Format": {  
	        "Type": "MP4Format"  
	      }  
	    }  
	  ]  
	}  
	

## <a id="encoding_with_dotnet"></a>Encoding with Media Services .NET SDK

The following code example uses Media Services .NET SDK to perform the following tasks:

- Create an encoding job.
- Get a reference to the Media Encoder Standard encoder.
- Load the custom JSON preset that you created in the previous section. 
  
		// Load the JSON from the local file.
		string configuration = File.ReadAllText(fileName);  

- Add an encoding task to the job. 
- Specify the input asset to be encoded.
- Create an output asset that will contain the encoded asset.
- Add an event handler to check the job progress.
- Submit the job.
   
        using System;
        using System.Collections.Generic;
        using System.Configuration;
        using System.IO;
        using System.Linq;
        using System.Net;
        using System.Security.Cryptography;
        using System.Text;
        using System.Threading.Tasks;
        using Microsoft.WindowsAzure.MediaServices.Client;
        using Newtonsoft.Json.Linq;
        using System.Threading;
        using Microsoft.WindowsAzure.MediaServices.Client.ContentKeyAuthorization;
        using Microsoft.WindowsAzure.MediaServices.Client.DynamicEncryption;
        using System.Web;
        using System.Globalization;
  
        namespace CustomizeMESPresests
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
  
                private static readonly string _mediaFiles =
                    Path.GetFullPath(@"../..\Media");
  
                private static readonly string _singleMP4File =
                    Path.Combine(_mediaFiles, @"BigBuckBunny.mp4");
  
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

                    // Load the XML (or JSON) from the local file.
                    string configuration = File.ReadAllText("CustomPreset_JSON.json");

                    // Create a task
                    ITask task = job.Tasks.AddNew("Media Encoder Standard encoding task",
                        processor,
                        configuration,
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



## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

## See Also
[Media Services Encoding Overview](media-services-encode-asset.md)

