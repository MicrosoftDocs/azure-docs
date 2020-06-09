---
title: Azure Media Services output metadata schema | Microsoft Docs
description: This article gives an overview of Azure Media Services output metadata schema.
author: Juliako
manager: femila
editor: ''
services: media-services
documentationcenter: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/03/2020
ms.author: juliako

---
# Output metadata

An encoding job is associated with an input asset (or assets) on which you want to perform some encoding tasks. For example, encode an MP4 file to H.264 MP4 adaptive bitrate sets; create a thumbnail; create overlays. Upon completion of a task, an output asset is produced.  The output asset contains video, audio, thumbnails, and other files. The output asset also contains a file with metadata about the output asset. The name of the metadata JSON file has the following format: `<source_file_name>_manifest.json` (for example, `BigBuckBunny_manifest.json`).  

Media Services does not preemptively scan input assets to generate metadata. Input metadata is generated only as an artifact when an input asset is processed in a job. Hence this artifact is written to the output asset. Different tools are used to generate metadata for input assets and output assets. Therefore, the input metadata has a slightly different schema than the output metadata.

This article discusses the elements and types of the JSON schema on which the output metadata (&lt;source_file_name&gt;_manifest.json) is based. <!--For information about the file that contains metadata about the input asset, see [Input metadata](input-metadata-schema.md).  -->

You can find the complete schema code and JSON example at the end of this article.  

## AssetFile

Collection of AssetFile entries for the encoding job.  

| Name | Description |
| --- | --- |
| **Sources** |Collection of input/source media files, that was processed in order to produce this AssetFile.<br />Example: `"Sources": [{"Name": "Ignite-short_1280x720_AACAudio_3551.mp4"}]`|
| **VideoTracks**|Each physical AssetFile can contain in it zero or more videos tracks interleaved into an appropriate container format. <br />See [VideoTracks](#videotracks). |
| **AudioTracks**|Each physical AssetFile can contain in it zero or more audio tracks interleaved into an appropriate container format. This is the collection of all those audio tracks.<br /> For more information, see [AudioTracks](#audiotracks). |
| **Name**<br />Required |The media asset file name. <br /><br />Example: `"Name": "Ignite-short_1280x720_AACAudio_3551.mp4"`|
| **Size**<br />Required |Size of the asset file in bytes. <br /><br />Example: `"Size": 32414631`|
| **Duration**<br />Required |Content play back duration. For more information, see the [ISO8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. <br /><br />Example: `"Duration": "PT1M10.315S"`|

## VideoTracks 

Each physical AssetFile can contain in it zero or more videos tracks interleaved into an appropriate container format. The **VideoTracks** element represents a collection of all the video tracks.  

| Name | Description |
| --- | --- |
| **Id**<br /> Required |Zero-based index of this video track. **Note:**  This **Id** is not necessarily the TrackID as used in an MP4 file. <br /><br />Example: `"Id": 1`|
| **FourCC**<br />Required | Video codec FourCC code that is reported by ffmpeg.  <br /><br />Example: `"FourCC": "avc1"`|
| **Profile** |H264 profile (only applicable to H264 codec).  <br /><br />Example: `"Profile": "High"` |
| **Level** |H264 level (only applicable to H264 codec).  <br /><br />Example: `"Level": "3.2"`|
| **Width**<br />Required |Encoded video width in pixels.  <br /><br />Example: `"Width": "1280"`|
| **Height**<br />Required |Encoded video height in pixels.  <br /><br />Example: `"Height": "720"`|
| **DisplayAspectRatioNumerator**<br />Required|Video display aspect ratio numerator.  <br /><br />Example: `"DisplayAspectRatioNumerator": 16.0`|
| **DisplayAspectRatioDenominator**<br />Required |Video display aspect ratio denominator.  <br /><br />Example: `"DisplayAspectRatioDenominator": 9.0`|
| **Framerate**<br />Required |Measured video frame rate in .3f format.  <br /><br />Example: `"Framerate": 29.970`|
| **Bitrate**<br />Required |Average video bit rate in bits per second, as calculated from the AssetFile. Counts only the elementary stream payload, and does not include the packaging overhead.  <br /><br />Example: `"Bitrate": 3551567`|
| **TargetBitrate**<br />Required |Target average bitrate for this video track, as requested via the encoding preset, in bits per second. <br /><br />Example: `"TargetBitrate": 3520000` |

## AudioTracks 

Each physical AssetFile can contain in it zero or more audio tracks interleaved into an appropriate container format. The **AudioTracks** element represents a collection of all those audio tracks.  

| Name  | Description |
| --- | --- |
| **Id**<br />Required  |Zero-based index of this audio track. **Note:**  This is not necessarily the TrackID as used in an MP4 file.  <br /><br />Example: `"Id": 2`|
| **Codec**  |Audio track codec string.  <br /><br />Example: `"Codec": "aac"`|
| **Language**|Example: `"Language": "eng"`|
| **Channels**<br />Required|Number of audio channels.  <br /><br />Example: `"Channels": 2`|
| **SamplingRate**<br />Required |Audio sampling rate in samples/sec or Hz.  <br /><br />Example: `"SamplingRate": 48000`|
| **Bitrate**<br />Required |Average audio bit rate in bits per second, as calculated from the AssetFile. Counts only the elementary stream payload, and does not include the packaging overhead.  <br /><br />Example: `"Bitrate": 128041`|

## JSON schema example

```json
{
  "AssetFile": [
    {
      "Sources": [
        {
          "Name": "Ignite-short_1280x720_AACAudio_3551.mp4"
        }
      ],
      "VideoTracks": [
        {
          "Id": 1,
          "FourCC": "avc1",
          "Profile": "High",
          "Level": "3.2",
          "Width": "1280",
          "Height": "720",
          "DisplayAspectRatioNumerator": 16.0,
          "DisplayAspectRatioDenominator": 9.0,
          "Framerate": 29.970,
          "Bitrate": 3551567,
          "TargetBitrate": 3520000
        }
      ],
      "AudioTracks": [
        {
          "Id": 2,
          "Codec": "aac",
          "Language": "eng",
          "Channels": 2,
          "SamplingRate": 48000,
          "Bitrate": 128041
        }
      ],
      "Name": "Ignite-short_1280x720_AACAudio_3551.mp4",
      "Size": 32414631,
      "Duration": "PT1M10.315S"
    },
    {
      "Sources": [
        {
          "Name": "Ignite-short_960x540_AACAudio_2216.mp4"
        }
      ],
      "VideoTracks": [
        {
          "Id": 1,
          "FourCC": "avc1",
          "Profile": "High",
          "Level": "3.1",
          "Width": "960",
          "Height": "540",
          "DisplayAspectRatioNumerator": 16.0,
          "DisplayAspectRatioDenominator": 9.0,
          "Framerate": 29.970,
          "Bitrate": 2216326,
          "TargetBitrate": 2210000
        }
      ],
      "AudioTracks": [
        {
          "Id": 2,
          "Codec": "aac",
          "Language": "eng",
          "Channels": 2,
          "SamplingRate": 48000,
          "Bitrate": 128041
        }
      ],
      "Name": "Ignite-short_960x540_AACAudio_2216.mp4",
      "Size": 20680897,
      "Duration": "PT1M10.315S"
    },
    {
      "Sources": [
        {
          "Name": "Ignite-short_640x360_AACAudio_1150.mp4"
        }
      ],
      "VideoTracks": [
        {
          "Id": 1,
          "FourCC": "avc1",
          "Profile": "High",
          "Level": "3.0",
          "Width": "640",
          "Height": "360",
          "DisplayAspectRatioNumerator": 16.0,
          "DisplayAspectRatioDenominator": 9.0,
          "Framerate": 29.970,
          "Bitrate": 1150440,
          "TargetBitrate": 1150000
        }
      ],
      "AudioTracks": [
        {
          "Id": 2,
          "Codec": "aac",
          "Language": "eng",
          "Channels": 2,
          "SamplingRate": 48000,
          "Bitrate": 128041
        }
      ],
      "Name": "Ignite-short_640x360_AACAudio_1150.mp4",
      "Size": 11313920,
      "Duration": "PT1M10.315S"
    },
    {
      "Sources": [
        {
          "Name": "Ignite-short_480x270_AACAudio_722.mp4"
        }
      ],
      "VideoTracks": [
        {
          "Id": 1,
          "FourCC": "avc1",
          "Profile": "High",
          "Level": "2.1",
          "Width": "480",
          "Height": "270",
          "DisplayAspectRatioNumerator": 16.0,
          "DisplayAspectRatioDenominator": 9.0,
          "Framerate": 29.970,
          "Bitrate": 722682,
          "TargetBitrate": 720000
        }
      ],
      "AudioTracks": [
        {
          "Id": 2,
          "Codec": "aac",
          "Language": "eng",
          "Channels": 2,
          "SamplingRate": 48000,
          "Bitrate": 128041
        }
      ],
      "Name": "Ignite-short_480x270_AACAudio_722.mp4",
      "Size": 7554708,
      "Duration": "PT1M10.315S"
    },
    {
      "Sources": [
        {
          "Name": "Ignite-short_320x180_AACAudio_380.mp4"
        }
      ],
      "VideoTracks": [
        {
          "Id": 1,
          "FourCC": "avc1",
          "Profile": "High",
          "Level": "1.3",
          "Width": "320",
          "Height": "180",
          "DisplayAspectRatioNumerator": 16.0,
          "DisplayAspectRatioDenominator": 9.0,
          "Framerate": 29.970,
          "Bitrate": 380655,
          "TargetBitrate": 380000
        }
      ],
      "AudioTracks": [
        {
          "Id": 2,
          "Codec": "aac",
          "Language": "eng",
          "Channels": 2,
          "SamplingRate": 48000,
          "Bitrate": 128041
        }`
      ],
      "Name": "Ignite-short_320x180_AACAudio_380.mp4",
      "Size": 4548932,
      "Duration": "PT1M10.315S"
    }
  ]
}
```

## Next steps

[Create a job input from an HTTPS URL](job-input-from-http-how-to.md)
