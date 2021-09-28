---
title: Azure Media Services v3 input metadata schema 
description: This article gives an overview of Azure Media Services v3 input metadata schema.
author: IngridAtMicrosoft
manager: femila
editor: ''
services: media-services
documentationcenter: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 08/31/2020
ms.author: inhenkel

---
# Input metadata

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

An encoding job is associated with an input asset (or assets) on which you want to perform some encoding tasks.  Upon completion of a task, an output asset is produced. The output asset contains video, audio, thumbnails, manifest, and other files. 

The output asset also contains a file with metadata about the input asset. The name of the metadata JSON file has a random ID, do not use it to identify the input asset that output asset belongs to. To identify the input asset it belongs to, use the `Uri` field (for more information, see [Other child elements](#other-child-elements)).  

Media Services does not preemptively scan input assets to generate metadata. Input metadata is generated only as an artifact when an input asset is processed in a Job. Hence this artifact is written to the output asset. Different tools are used to generate metadata for input assets and output assets. Therefore, the input metadata has a slightly different schema than the output metadata.

This article discusses the elements and types of the JSON schema on which the input metada (&lt;asset_id&gt;_metadata.json ) is based. For information about the file that contains metadata about the output asset, see [Output metadata](output-metadata-schema.md).  

You can find the JSON schema example at the end of this article.  

## AssetFile  

Contains a collection of AssetFile elements for the encoding job.  

> [!NOTE]
> The following four child elements must appear in a sequence.

| Name  | Description |
| --- | --- | 
| **VideoTracks**|Each physical asset file can contain zero or more videos tracks interleaved into an appropriate container format. For more information, see [VideoTracks](#videotracks). |
| **AudioTracks**|Each physical asset file can contain zero or more audio tracks interleaved into an appropriate container format. For more information, see [AudioTracks](#audiotracks) |
| **Metadata**  |Asset file’s metadata represented as key\value strings. <br />For example: `<Metadata key="language" value="eng" />` |

### Other child elements

| Name | Description |
| --- | --- |
| **Name**<br />Required |Asset file name. <br /><br />Example: `"Name": "Ignite-short.mp4"` |
| **Uri**<br />Required |The URL where the input asset is located. To identify the input asset the output asset belongs to, use the `Uri` field instead of ID.|
| **Size**<br />Required |Size of the asset file in bytes.  <br /><br />Example: `"Size": 75739259`|
| **Duration**<br />Required |Content play back duration. <br /><br />Example: `"Duration": "PT1M10.304S"`. |
| **NumberOfStreams**<br />Required |Number of streams in the asset file.  <br /><br />Example: `"NumberOfStreams": 2`|
| **FormatNames**<br />Required |Format names.  <br /><br />Example: `"FormatNames": "mov,mp4,m4a,3gp,3g2,mj2"`|
| **FormatVerboseName**<br /> Required |Format verbose names. <br /><br />Example: `"FormatVerboseName": "QuickTime / MOV"` |
| **StartTime** |Content start time.  <br /><br />Example: `"StartTime": "PT0S"` |
| **OverallBitRate** |Average bitrate of the asset file in bits per second.  <br /><br />Example: `"OverallBitRate": 8618539`|

## VideoTracks

| Name | Description |
| --- | --- |
| **FourCC**<br />Required |Video codec FourCC code that is reported by ffmpeg.<br /><br />Example: `"FourCC": "avc1" | "hev1" | "hvc1"` |
| **Profile** |Video track's profile. <br /><br />Example: `"Profile": "Main"`|
| **Level** |Video track's level. <br /><br />Example: `"Level": "3.2"`|
| **PixelFormat** |Video track's pixel format. <br /><br />Example: `"PixelFormat": "yuv420p"`|
| **Width**<br />Required |Encoded video width in pixels. <br /><br />Example: `"Width": "1280"`|
| **Height**<br />Required |Encoded video height in pixels.<br /><br />Example: `"Height": "720"` |
| **DisplayAspectRatioNumerator**<br />Required |Video display aspect ratio numerator.<br /><br />Example: `"DisplayAspectRatioNumerator": 16.0` |
| **DisplayAspectRatioDenominator**<br />Required |Video display aspect ratio denominator. <br /><br />Example: `"DisplayAspectRatioDenominator": 9.0`|
| **SampleAspectRatioNumerator** |Video sample aspect ratio numerator. <br /><br />Example: `"SampleAspectRatioNumerator": 1.0`|
| **SampleAspectRatioDenominator**|Example: `"SampleAspectRatioDenominator": 1.0`|
| **FrameRate**<br />Required |Measured video frame rate in .3f format. <br /><br />Example: `"FrameRate": 29.970`|
| **Bitrate** |Average video bit rate in bits per second, as calculated from the asset file. Only the elementary stream payload is counted, and the packaging overhead is not included. <br /><br />Example: `"Bitrate": 8421583`|
| **HasBFrames** |Video track number of B frames. <br /><br />Example: `"HasBFrames": 2`|
| **Metadata** |Generic key/value strings that can be used to hold a variety of information. <br />See the full example at the end of the article. |
| **Id**<br />Required |Zero-based index of this audio or video track.<br /><br /> This **Id** is not necessarily the TrackID as used in an MP4 file. <br /><br />Example: `"Id": 2`|
| **Codec** |Video track codec string. <br /><br />Example: `"Codec": "h264 | hev1"`|
| **CodecLongName** |Audio or video track codec long name. <br /><br />Example: `"CodecLongName": "H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10"`|
| **Codec** |Video track codec string. <br /><br />Example: `"Codec": "h264 | hev1"`|
| **TimeBase**<br />Required |Time base.<br /><br />Example: `"TimeBase": "1/30000"`|
| **NumberOfFrames** |Number of frames (present for video tracks). <br /><br />Example: `"NumberOfFrames": 2107`|
| **StartTime** |Track start time.<br /><br />Example: `"StartTime": "PT0.033S"` |
| **Duration** |Track duration. <br /><br />Example: `"Duration": "PT1M10.304S"`|

## AudioTracks

| Name  | Description |
| --- | --- | 
| **SampleFormat** |Sample format. <br /><br />Example: `"SampleFormat": "fltp"`|
| **ChannelLayout** |Channel layout. <br /><br />Example: `"ChannelLayout": "stereo"`|
| **Channels**<br />Required |Number (0 or more) of audio channels. <br /><br />Example: `"Channels": 2`|
| **SamplingRate**<br />Required |Audio sampling rate in samples/sec or Hz. <br /><br />Example: `"SamplingRate": 48000`|
| **Bitrate** |Average audio bit rate in bits per second, as calculated from the asset file. Only the elementary stream payload is counted, and the packaging overhead is not included in this count. <br /><br />Example: `"Bitrate": 192080`|
| **Metadata** |Generic key/value strings that can be used to hold a variety of information.  <br />See the full example at the end of the article. |
| **Id**<br />Required |Zero-based index of this audio or video track.<br /><br /> This is not necessarily that the TrackID as used in an MP4 file. <br /><br />Example: `"Id": 1`|
| **Codec** |Video track codec string. <br /><br />Example: `"Codec": "aac"`|
| **CodecLongName** |Audio or video track codec long name. <br /><br />Example: `"CodecLongName": "AAC (Advanced Audio Coding)"`|
| **TimeBase**<br />Required |Time base.<br /><br />Example: `"TimeBase": "1/48000"` |
| **NumberOfFrames** |Number of frames (present for video tracks). <br /><br />Example: `"NumberOfFrames": 3294`|
| **StartTime** |Track start time. For more information, see [ISO8601](https://www.iso.org/iso-8601-date-and-time-format.html). <br /><br />Example: `"StartTime": "PT0S"` |
| **Duration** |Track duration. <br /><br />Example: `"Duration": "PT1M10.272S"` |

## Metadata

| Name | Description |
| --- | --- |
| **key**<br />Required |The key in the key/value pair. |
| **value**<br /> Required |The value in the key/value pair. |

## Schema example

```json
{
  "AssetFile": [
    {
      "VideoTracks": [
        {
          "FourCC": "avc1",
          "Profile": "Main",
          "Level": "3.2",
          "PixelFormat": "yuv420p",
          "Width": "1280",
          "Height": "720",
          "DisplayAspectRatioNumerator": 16.0,
          "DisplayAspectRatioDenominator": 9.0,
          "SampleAspectRatioNumerator": 1.0,
          "SampleAspectRatioNumeratorSpecified": true,
          "SampleAspectRatioDenominator": 1.0,
          "SampleAspectRatioDenominatorSpecified": true,
          "FrameRate": 29.970,
          "Bitrate": 8421583,
          "BitrateSpecified": true,
          "HasBFrames": 2,
          "HasBFramesSpecified": true,
          "Disposition": {
            "Default": 1
          },
          "Metadata": [
            {
              "key": "creation_time",
              "value": "2018-02-21T21:42:08.000000Z"
            },
            {
              "key": "language",
              "value": "eng"
            },
            {
              "key": "handler_name",
              "value": "Video Media Handler"
            },
            {
              "key": "encoder",
              "value": "AVC Coding"
            }
          ],
          "Id": 2,
          "Codec": "h264",
          "CodecLongName": "H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10",
          "TimeBase": "1/30000",
          "NumberOfFrames": 2107,
          "NumberOfFramesSpecified": true,
          "StartTime": "PT0.033S",
          "Duration": "PT1M10.304S"
        }
      ],
      "AudioTracks": [
        {
          "SampleFormat": "fltp",
          "ChannelLayout": "stereo",
          "Channels": 2,
          "SamplingRate": 48000,
          "Bitrate": 192080,
          "BitrateSpecified": true,
          "BitsPerSampleSpecified": true,
          "Disposition": {
            "Default": 1
          },
          "Metadata": [
            {
              "key": "creation_time",
              "value": "2018-02-21T21:42:08.000000Z"
            },
            {
              "key": "language",
              "value": "eng"
            },
            {
              "key": "handler_name",
              "value": "Sound Media Handler"
            }
          ],
          "Id": 1,
          "Codec": "aac",
          "CodecLongName": "AAC (Advanced Audio Coding)",
          "TimeBase": "1/48000",
          "NumberOfFrames": 3294,
          "NumberOfFramesSpecified": true,
          "StartTime": "PT0S",
          "Duration": "PT1M10.272S"
        }
      ],
      "Metadata": [
        {
          "key": "major_brand",
          "value": "mp42"
        },
        {
          "key": "minor_version",
          "value": "19529854"
        },
        {
          "key": "compatible_brands",
          "value": "mp42isom"
        },
        {
          "key": "creation_time",
          "value": "2018-02-21T21:42:08.000000Z"
        }
      ],
      "Name": "Ignite-short.mp4",
      "Uri": "https://amsstorageacct.blob.core.windows.net/asset-00000000-0000-0000-000000000000/ignite.mp4",
      "Size": 75739259,
      "Duration": "PT1M10.304S",
      "NumberOfStreams": 2,
      "FormatNames": "mov,mp4,m4a,3gp,3g2,mj2",
      "FormatVerboseName": "QuickTime / MOV",
      "StartTime": "PT0S",
      "OverallBitRate": 8618539,
      "OverallBitRateSpecified": true
    }
  ]
}
```

## Next steps

[Output metadata](output-metadata-schema.md)
