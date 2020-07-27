---
title: How to create an overlay with Media Encoder Standard
description: Learn how to create an overlay with Media Encoder Standard.
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: how-to
ms.date: 07/27/2020
---

# How to create an overlay with Media Encoder Standard

The Media Encoder Standard allows you to overlay an image onto an existing video. Currently, the following formats are supported: png, jpg, gif, and bmp. The preset defined below is a basic example  of a video overlay.

In addition to defining a preset file, you also have to let Media Services know which file in the asset is the overlay image and which file is the source video onto which you want to overlay the image. The video file has to be the **primary** file.

If you are using .NET, add the following two functions to the .NET example defined in [this](media-services-custom-mes-presets-with-dotnet.md#encoding_with_dotnet) topic. 

The **UploadMediaFilesFromFolder** function uploads files from a folder (for example, BigBuckBunny.mp4 and Image001.png) and sets the mp4 file to be the primary file in the asset. The **EncodeWithOverlay** function uses the custom preset file that was passed to it (for example, the preset that follows) to create the encoding task.

```csharp
static public IAsset UploadMediaFilesFromFolder(string folderPath)
{
    IAsset asset = _context.Assets.CreateFromFolder(folderPath, AssetCreationOptions.None);

    foreach (var af in asset.AssetFiles)
    {
        // The following code assumes 
        // you have an input folder with one MP4 and one overlay image file.
        if (af.Name.Contains(".mp4"))
            af.IsPrimary = true;
        else
            af.IsPrimary = false;

        af.Update();
    }

    return asset;
}

static public IAsset EncodeWithOverlay(IAsset assetSource, string customPresetFileName)
{
    // Declare a new job.
    IJob job = _context.Jobs.Create("Media Encoder Standard Job");
    // Get a media processor reference, and pass to it the name of the 
    // processor to use for the specific task.
    IMediaProcessor processor = GetLatestMediaProcessorByName("Media Encoder Standard");

    // Load the XML (or JSON) from the local file.
    string configuration = File.ReadAllText(customPresetFileName);

    // Create a task
    ITask task = job.Tasks.AddNew("Media Encoder Standard encoding task",
        processor,
        configuration,
        TaskOptions.None);

    // Specify the input assets to be encoded.
    // This asset contains a source file and an overlay file.
    task.InputAssets.Add(assetSource);

    // Add an output asset to contain the results of the job. 
    task.OutputAssets.AddNew("Output asset",
        AssetCreationOptions.None);

    job.StateChanged += new EventHandler<JobStateChangedEventArgs>(JobStateChanged);
    job.Submit();
    job.GetExecutionProgressTask(CancellationToken.None).Wait();

    return job.OutputMediaAssets[0];
}
```

> [!NOTE]
> Current limitations:
>
> The overlay opacity setting is not supported.
>
> Your source video file and the overlay image file have to be in the same asset, and the video file needs to be set as the primary file in this asset.
>
>

### JSON preset

```json
{
  "Version": 1.0,
  "Sources": [
    {
      "Streams": [],
      "Filters": {
        "VideoOverlay": {
          "Position": {
            "X": 100,
            "Y": 100,
            "Width": 100,
            "Height": 50
          },
          "AudioGainLevel": 0.0,
          "MediaParams": [
            {
              "OverlayLoopCount": 1
            },
            {
              "IsOverlay": true,
              "OverlayLoopCount": 1
            }
          ],
          "Source": "Image001.png",
          "Clip": {
            "Duration": "00:00:05"
          },
          "FadeInDuration": {
            "Duration": "00:00:01"
          },
          "FadeOutDuration": {
            "StartTime": "00:00:03",
            "Duration": "00:00:04"
          }
        }
      },
      "Pad": true
    }
  ],
  "Codecs": [
    {
      "KeyFrameInterval": "00:00:02",
      "H264Layers": [
        {
          "Profile": "Auto",
          "Level": "auto",
          "Bitrate": 1045,
          "MaxBitrate": 1045,
          "BufferWindow": "00:00:05",
          "ReferenceFrames": 3,
          "EntropyMode": "Cavlc",
          "AdaptiveBFrame": true,
          "Type": "H264Layer",
          "Width": "640",
          "Height": "360",
          "FrameRate": "0/1"
        }
      ],
      "Type": "H264Video"
    },
    {
      "Type": "CopyAudio"
    }
  ],
  "Outputs": [
    {
      "FileName": "{Basename}{Extension}",
      "Format": {
        "Type": "MP4Format"
      }
    }
  ]
}
```

### XML preset

```xml
<?xml version="1.0" encoding="utf-16"?>
<Preset xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" Version="1.0" xmlns="https://www.windowsazure.com/media/encoding/Preset/2014/03">
  <Sources>
    <Source>
      <Streams />
      <Filters>
        <VideoOverlay>
          <Source>Image001.png</Source>
          <Clip Duration="PT5S" />
          <FadeInDuration Duration="PT1S" />
          <FadeOutDuration StartTime="PT3S" Duration="PT4S" />
          <Position X="100" Y="100" Width="100" Height="50" />
          <Opacity>0</Opacity>
          <AudioGainLevel>0</AudioGainLevel>
          <MediaParams>
            <MediaParam>
              <IsOverlay>false</IsOverlay>
              <OverlayLoopCount>1</OverlayLoopCount>
            </MediaParam>
            <MediaParam>
              <IsOverlay>true</IsOverlay>
              <OverlayLoopCount>1</OverlayLoopCount>
            </MediaParam>
          </MediaParams>
        </VideoOverlay>
      </Filters>
      <Pad>true</Pad>
    </Source>
  </Sources>
  <Encoding>
    <H264Video>
      <KeyFrameInterval>00:00:02</KeyFrameInterval>
      <H264Layers>
        <H264Layer>
          <Bitrate>1045</Bitrate>
          <Width>640</Width>
          <Height>360</Height>
          <FrameRate>0/1</FrameRate>
          <Profile>Auto</Profile>
          <Level>auto</Level>
          <BFrames>0</BFrames>
          <ReferenceFrames>3</ReferenceFrames>
          <Slices>0</Slices>
          <AdaptiveBFrame>true</AdaptiveBFrame>
          <EntropyMode>Cavlc</EntropyMode>
          <BufferWindow>00:00:05</BufferWindow>
          <MaxBitrate>1045</MaxBitrate>
        </H264Layer>
      </H264Layers>
    </H264Video>
    <CopyAudio />
  </Encoding>
  <Outputs>
    <Output FileName="{Basename}{Extension}">
      <MP4Format />
    </Output>
  </Outputs>
</Preset>
```
