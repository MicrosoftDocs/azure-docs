---
title: Encode an asset with Media Encoder Standard using .NET | Microsoft Docs
description: This topic shows how to use .NET to encode an asset using Media Encoder Strandard.
services: media-services
documentationcenter: ''
author: juliako
manager: erikre
editor: ''

ms.assetid: 03431b64-5518-478a-a1c2-1de345999274
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/21/2017
ms.author: juliako;anilmur

---
# Encode an asset with Media Encoder Standard using .NET
Encoding jobs are one of the most common processing operations in Media Services. You create encoding jobs to convert media files from one encoding to another. When you encode, you can use the Media Services built-in Media Encoder. You can also use an encoder provided by a Media Services partner; third party encoders are available through the Azure Marketplace. 

This topic shows how to use .NET to encode your assets with Media Encoder Standard (MES). Media Encoder Standard is configured using one of the encoder presets described [here](http://go.microsoft.com/fwlink/?linkid=618336&clcid=0x409).

It is recommended to always encode your mezzanine files into an adaptive bitrate MP4 set and then convert the set to the desired format using the [Dynamic Packaging](media-services-dynamic-packaging-overview.md). 

If your output asset is storage encrypted, you must configure asset delivery policy. For more information see [Configuring asset delivery policy](media-services-dotnet-configure-asset-delivery-policy.md).

> [!NOTE]
> MES produces an output file with a name that contains the first 32 characters of the input file name. The name is based on what is specified in the preset file. For example, "FileName": "{Basename}_{Index}{Extension}". {Basename} is replaced by the first 32 characters of the input file name.
> 
> 

### MES Formats
[Formats and codecs](media-services-media-encoder-standard-formats.md)

### MES Presets
Media Encoder Standard is configured using one of the encoder presets described [here](http://go.microsoft.com/fwlink/?linkid=618336&clcid=0x409).

### Input and output metadata
When you encode an input asset (or assets) using MES, you get an output asset at the successful completion of that encode task. The output asset contains video, audio, thumbnails, manifest, etc. based on the encoding preset you use.

The output asset also contains a file with metadata about the input asset. The name of the metadata XML file has the following format: <asset_id>_metadata.xml (for example, 41114ad3-eb5e-4c57-8d92-5354e2b7d4a4_metadata.xml), where <asset_id> is the AssetId value of the input asset. The schema of this input metadata XML is described [here](media-services-input-metadata-schema.md).

The output asset also contains a file with metadata about the output asset. The name of the metadata XML file has the following format: <source_file_name>_manifest.xml (for example, BigBuckBunny_manifest.xml). The schema of this output metadata XML is described [here](media-services-output-metadata-schema.md).

If you want to examine either of the two metadata files, you can create a SAS locator and download the file to your local computer. You can find an example on how to create a SAS locator and download a file Using the Media Services .NET SDK Extensions.

## Download sample
You can get and run a sample that shows how to encode with MES from [here](https://azure.microsoft.com/documentation/samples/media-services-dotnet-on-demand-encoding-with-media-encoder-standard/).

## Example
The following code example uses Media Services .NET SDK to perform the following tasks:

* Create an encoding job.
* Get a reference to the Media Encoder Standard encoder.
* Specify to use the [Adaptive Streaming](media-services-autogen-bitrate-ladder-with-mes.md) preset. 
* Add a single encoding task to the job. 
* Specify the input asset to be encoded.
* Create an output asset that will contain the encoded asset.
* Add an event handler to check the job progress.
* Submit the job.
  
        static public IAsset EncodeToAdaptiveBitrateMP4Set(IAsset asset)
        {
            // Declare a new job.
            IJob job = _context.Jobs.Create("Media Encoder Standard Job");
            // Get a media processor reference, and pass to it the name of the 
            // processor to use for the specific task.
            IMediaProcessor processor = GetLatestMediaProcessorByName("Media Encoder Standard");

            // Create a task with the encoding details, using a string preset.
            // In this case "Adaptive Streaming" preset is used.
            ITask task = job.Tasks.AddNew("My encoding task",
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


## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

## See Also
[How to generate thumbnail using Media Encoder Standard with .NET](media-services-dotnet-generate-thumbnail-with-mes.md)
[Media Services Encoding Overview](media-services-encode-asset.md)

