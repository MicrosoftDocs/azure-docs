---
title: How to generate thumbnails using Media Encoder Standard with .NET
description: This topic shows how to use .NET to encode an asset and generate thumbnails at the same time using Media Encoder Standard.
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.assetid: b8dab73a-1d91-4b6d-9741-a92ad39fc3f7
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/18/2019
ms.author: juliako

---
# How to generate thumbnails using Media Encoder Standard with .NET 

You can use Media Encoder Standard to generate one or more thumbnails from your input video in [JPEG](https://en.wikipedia.org/wiki/JPEG), [PNG](https://en.wikipedia.org/wiki/Portable_Network_Graphics), or [BMP](https://en.wikipedia.org/wiki/BMP_file_format) image file formats. You can submit Tasks that produce only images, or you can combine thumbnail generation with encoding. This article provides a few sample XML and JSON thumbnail presets for such scenarios. At the end of the article, there is a [sample code](#code_sample) that shows how to use the Media Services .NET SDK to accomplish the encoding task.

For more details on the elements that are used in sample presets, you should review [Media Encoder Standard schema](media-services-mes-schema.md).

Make sure to review the [Considerations](media-services-dotnet-generate-thumbnail-with-mes.md#considerations) section.
	
## Example of a "single PNG file" preset

The following JSON and XML preset can be used to produce a single output PNG file from the first few seconds of the input video, where the encoder makes a best-effort attempt at finding an “interesting” frame. Note that the output image dimensions have been set to 100%, meaning these match the dimensions of the input video. Note also how the “Format” setting in "Outputs" is required to match the use of "PngLayers" in the “Codecs” section. 

### JSON preset

```json
	{
	  "Version": 1.0,
	  "Codecs": [
	    {
	      "PngLayers": [
	        {
	          "Type": "PngLayer",
	          "Width": "100%",
	          "Height": "100%"
	        }
	      ],
	      "Start": "{Best}",
	      "Type": "PngImage"
	    }
	  ],
	  "Outputs": [
	    {
	      "FileName": "{Basename}_{Index}{Extension}",
	      "Format": {
	        "Type": "PngFormat"
	      }
	    }
	  ]
	}
```
	
### XML preset

```xml
	<?xml version="1.0" encoding="utf-16"?>
	<Preset xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" Version="1.0" xmlns="https://www.windowsazure.com/media/encoding/Preset/2014/03">
	  <Encoding>
	    <PngImage Start="{Best}">
	      <PngLayers>
	        <PngLayer>
	          <Width>100%</Width>
	          <Height>100%</Height>
	        </PngLayer>
	      </PngLayers>
	    </PngImage>
	  </Encoding>
	  <Outputs>
	    <Output FileName="{Basename}_{Index}{Extension}">
	      <PngFormat />
	    </Output>
	  </Outputs>
	</Preset>
```

## Example of a "series of JPEG images" preset

The following JSON and XML preset can be used to produce a set of 10 images at timestamps of 5%, 15%, …, 95% of the input timeline, where the image size is specified to be one quarter that of the input video.

### JSON preset

```json
	{
	  "Version": 1.0,
	  "Codecs": [
	    {
	      "JpgLayers": [
	        {
	          "Quality": 90,
	          "Type": "JpgLayer",
	          "Width": "25%",
	          "Height": "25%"
	        }
	      ],
	      "Start": "5%",
	      "Step": "10%",
	      "Range": "96%",
	      "Type": "JpgImage"
	    }
	  ],
	  "Outputs": [
	    {
	      "FileName": "{Basename}_{Index}{Extension}",
	      "Format": {
	        "Type": "JpgFormat"
	      }
	    }
	  ]
	}
```

### XML preset
	
```xml
	<?xml version="1.0" encoding="utf-16"?>
	<Preset xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" Version="1.0" xmlns="https://www.windowsazure.com/media/encoding/Preset/2014/03">
	  <Encoding>
	    <JpgImage Start="5%" Step="10%" Range="96%">
	      <JpgLayers>
	        <JpgLayer>
	          <Width>25%</Width>
	          <Height>25%</Height>
	          <Quality>90</Quality>
	        </JpgLayer>
	      </JpgLayers>
	    </JpgImage>
	  </Encoding>
	  <Outputs>
	    <Output FileName="{Basename}_{Index}{Extension}">
	      <JpgFormat />
	    </Output>
	  </Outputs>
	</Preset>
```

## Example of a "one image at a specific timestamp" preset

The following JSON and XML preset can be used to produce a single JPEG image at the 30-second mark of the input video. This preset expects the input video to be more than 30 seconds in duration (else the job fails).

### JSON preset

```json
	{
	  "Version": 1.0,
	  "Codecs": [
	    {
	      "JpgLayers": [
	        {
	          "Quality": 90,
	          "Type": "JpgLayer",
	          "Width": "25%",
	          "Height": "25%"
	        }
	      ],
	      "Start": "00:00:30",
	      "Step": "1",
	      "Range": "1",
	      "Type": "JpgImage"
	    }
	  ],
	  "Outputs": [
	    {
	      "FileName": "{Basename}_{Index}{Extension}",
	      "Format": {
	        "Type": "JpgFormat"
	      }
	    }
	  ]
	}
```

### XML preset
```xml
	<?xml version="1.0" encoding="utf-16"?>
	<Preset xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" Version="1.0" xmlns="https://www.windowsazure.com/media/encoding/Preset/2014/03">
	  <Encoding>
	    <JpgImage Start="00:00:30" Step="00:00:01" Range="00:00:01">
	      <JpgLayers>
	        <JpgLayer>
	          <Width>25%</Width>
	          <Height>25%</Height>
	          <Quality>90</Quality>
	        </JpgLayer>
	      </JpgLayers>
	    </JpgImage>
	  </Encoding>
	  <Outputs>
	    <Output FileName="{Basename}_{Index}{Extension}">
	      <JpgFormat />
	    </Output>
	  </Outputs>
	</Preset>
```

## Example of a "thumbnails at different resolutions" preset

The following preset can be used to generate thumbnails at different resolutions in one task. In the example, at positions 5%, 15%, …, 95% of the input timeline, the encoder generates two images – one at 100% of the input video resolution and the other at 50%.

Note the use of {Resolution} macro in the FileName; it indicates to the encoder to use the width and height that you specified in the Encoding section of the preset while generating the file name of the output images. This also helps you distinguish between the different images easily

### JSON preset

```json
	{
	  "Version": 1.0,
	  "Codecs": [
	    {
	      "JpgLayers": [
		{
		  "Quality": 90,
		  "Type": "JpgLayer",
		  "Width": "100%",
		  "Height": "100%"
		},
		{
		  "Quality": 90,
		  "Type": "JpgLayer",
		  "Width": "50%",
		  "Height": "50%"
		}

	      ],
	      "Start": "5%",
	      "Step": "10%",
	      "Range": "96%",
	      "Type": "JpgImage"
	    }
	  ],
	  "Outputs": [
	    {
	      "FileName": "{Basename}_{Resolution}_{Index}{Extension}",
	      "Format": {
		"Type": "JpgFormat"
	      }
	    }
	  ]
	}
```

### XML preset
```xml
	<?xml version="1.0" encoding="utf-8"?>
	<Preset xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" Version="1.0" xmlns="https://www.windowsazure.com/media/encoding/Preset/2014/03">
	<Encoding>
	<JpgImage Start="5%" Step="10%" Range="96%"><JpgImage Start="00:00:01" Step="00:00:15">
	  <JpgLayers>
	   <JpgLayer>
	    <Width>100%</Width>
	    <Height>100%</Height>
	    <Quality>90</Quality>
	   </JpgLayer>
	   <JpgLayer>
	    <Width>50%</Width>
	    <Height>50%</Height>
	    <Quality>90</Quality>
	   </JpgLayer>
	  </JpgLayers>
	</JpgImage>
	</Encoding>
	<Outputs>
	  <Output FileName="{Basename}_{Resolution}_{Index}{Extension}">
	    <JpgFormat/>
	  </Output>
	</Outputs>
	</Preset>
```

## Example of generating a thumbnail while encoding

While all of the above examples have discussed how you can submit an encoding task that only produces images, you can also combine video/audio encoding with thumbnail generation. The following JSON and XML preset tell **Media Encoder Standard** to generate a thumbnail during encoding.

### <a id="json"></a>JSON preset
For information about schema, see [this](https://msdn.microsoft.com/library/mt269962.aspx) article.

```json
	{
	  "Version": 1.0,
	  "Codecs": [
	    {
	      "KeyFrameInterval": "00:00:02",
	      "SceneChangeDetection": "true",
	      "H264Layers": [
	        {
	          "Profile": "Auto",
	          "Level": "auto",
	          "Bitrate": 4500,
	          "MaxBitrate": 4500,
	          "BufferWindow": "00:00:05",
	          "Width": 1280,
	          "Height": 720,
	          "ReferenceFrames": 3,
	          "EntropyMode": "Cabac",
	          "AdaptiveBFrame": true,
	          "Type": "H264Layer",
	          "FrameRate": "0/1"
	
	        }
	      ],
	      "Type": "H264Video"
	    },
	    {
	      "JpgLayers": [
	        {
	          "Quality": 90,
	          "Type": "JpgLayer",
	          "Width": "100%",
	          "Height": "100%"
	        }
	      ],
	      "Start": "{Best}",
	      "Type": "JpgImage"
	    },
	    {
	      "Channels": 2,
	      "SamplingRate": 48000,
	      "Bitrate": 128,
	      "Type": "AACAudio"
	    }
	  ],
	  "Outputs": [
	    {
	      "FileName": "{Basename}_{Index}{Extension}",
	      "Format": {
	        "Type": "JpgFormat"
	      }
	    },
	    {
	      "FileName": "{Basename}_{Resolution}_{VideoBitrate}.mp4",
	      "Format": {
	        "Type": "MP4Format"
	      }
	    }
	  ]
	}
```

### <a id="xml"></a>XML preset
For information about schema, see [this](https://msdn.microsoft.com/library/mt269962.aspx) article.

```csharp
	<?xml version="1.0" encoding="utf-16"?>
	<Preset xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" Version="1.0" xmlns="https://www.windowsazure.com/media/encoding/Preset/2014/03">
	  <Encoding>
	    <H264Video>
	      <KeyFrameInterval>00:00:02</KeyFrameInterval>
	      <SceneChangeDetection>true</SceneChangeDetection>
	      <H264Layers>
	        <H264Layer>
	          <Bitrate>4500</Bitrate>
	          <Width>1280</Width>
	          <Height>720</Height>
	          <FrameRate>0/1</FrameRate>
	          <Profile>Auto</Profile>
	          <Level>auto</Level>
	          <BFrames>3</BFrames>
	          <ReferenceFrames>3</ReferenceFrames>
	          <Slices>0</Slices>
	          <AdaptiveBFrame>true</AdaptiveBFrame>
	          <EntropyMode>Cabac</EntropyMode>
	          <BufferWindow>00:00:05</BufferWindow>
	          <MaxBitrate>4500</MaxBitrate>
	        </H264Layer>
	      </H264Layers>
	    </H264Video>
	    <AACAudio>
	      <Profile>AACLC</Profile>
	      <Channels>2</Channels>
	      <SamplingRate>48000</SamplingRate>
	      <Bitrate>128</Bitrate>
	    </AACAudio>
	    <JpgImage Start="{Best}">
	      <JpgLayers>
	        <JpgLayer>
	          <Width>100%</Width>
	          <Height>100%/Height>
	          <Quality>90</Quality>
	        </JpgLayer>
	      </JpgLayers>
	    </JpgImage>
	  </Encoding>
	  <Outputs>
	    <Output FileName="{Basename}_{Resolution}_{VideoBitrate}.mp4">
	      <MP4Format />
	    </Output>
	    <Output FileName="{Basename}_{Index}{Extension}">
	      <JpgFormat />
	    </Output>
	  </Outputs>
	</Preset>	
```

## <a id="code_sample"></a>Encode video and generate thumbnail with .NET

The following code example uses Media Services .NET SDK to perform the following tasks:

* Create an encoding job.
* Get a reference to the Media Encoder Standard encoder.
* Load the preset [XML](media-services-dotnet-generate-thumbnail-with-mes.md#xml) or [JSON](media-services-dotnet-generate-thumbnail-with-mes.md#json) that contain the encoding preset as well as information needed to generate thumbnails. You can save this  [XML](media-services-dotnet-generate-thumbnail-with-mes.md#xml) or [JSON](media-services-dotnet-generate-thumbnail-with-mes.md#json) in a file and use the following code to load the file.
  
        // Load the XML (or JSON) from the local file.
        string configuration = File.ReadAllText(fileName);  
* Add a single encoding task to the job. 
* Specify the input asset to be encoded.
* Create an output asset that contains the encoded asset.
* Add an event handler to check the job progress.
* Submit the job.

See the [Media Services development with .NET](media-services-dotnet-how-to-use.md) article for directions on how to set up your dev environment.

```csharp
using System;
using System.Configuration;
using System.IO;
using System.Linq;
using Microsoft.WindowsAzure.MediaServices.Client;
using System.Threading;

namespace EncodeAndGenerateThumbnails
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

        private static CloudMediaContext _context = null;

        private static readonly string _mediaFiles =
        Path.GetFullPath(@"../..\Media");

        private static readonly string _singleMP4File =
            Path.Combine(_mediaFiles, @"BigBuckBunny.mp4");

        static void Main(string[] args)
        {
            AzureAdTokenCredentials tokenCredentials =
                new AzureAdTokenCredentials(_AADTenantDomain,
                    new AzureAdClientSymmetricKey(_AMSClientId, _AMSClientSecret),
                    AzureEnvironments.AzureCloudEnvironment);

            var tokenProvider = new AzureAdTokenProvider(tokenCredentials);

            _context = new CloudMediaContext(new Uri(_RESTAPIEndpoint), tokenProvider);

            // Get an uploaded asset.
            var asset = _context.Assets.FirstOrDefault();

            // Encode and generate the thumbnails.
            EncodeToAdaptiveBitrateMP4Set(asset);

            Console.ReadLine();
        }

        static public IAsset EncodeToAdaptiveBitrateMP4Set(IAsset asset)
        {
            // Declare a new job.
            IJob job = _context.Jobs.Create("Media Encoder Standard Thumbnail Job");
            // Get a media processor reference, and pass to it the name of the 
            // processor to use for the specific task.
            IMediaProcessor processor = GetLatestMediaProcessorByName("Media Encoder Standard");

            // Load the XML (or JSON) from the local file.
            string configuration = File.ReadAllText("ThumbnailPreset_JSON.json");

            // Create a task
            ITask task = job.Tasks.AddNew("Media Encoder Standard Thumbnail task",
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
```

## Considerations
The following considerations apply:

* The use of explicit timestamps for Start/Step/Range assumes that the input source is at least 1 minute long.
* Jpg/Png/BmpImage elements have Start, Step, and Range string attributes – these can be interpreted as:
  
  * Frame Number if they are non-negative integers, for example "Start": "120",
  * Relative to source duration if expressed as %-suffixed, for example "Start": "15%", OR
  * Timestamp if expressed as HH:MM:SS… format. For example "Start" : "00:01:00"
    
    You can mix and match notations as you please.
    
    Additionally, Start also supports a special Macro:{Best}, which attempts to determine the first “interesting” frame of the content 
    NOTE: (Step and Range are ignored when Start is set to {Best})
  * Defaults: Start:{Best}
* Output format needs to be explicitly provided for each Image format: Jpg/Png/BmpFormat. When present, MES matches JpgVideo to JpgFormat and so on. OutputFormat introduces a new image-codec specific Macro: {Index}, which needs to be present (once and only once) for image output formats.

## Next steps

You can check the [job progress](media-services-check-job-progress.md) while the encoding job is pending.

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

## See Also
[Media Services Encoding Overview](media-services-encode-asset.md)

