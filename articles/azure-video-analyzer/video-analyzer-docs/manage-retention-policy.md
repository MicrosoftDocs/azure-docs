---
title: Manage retention policy with Azure Video Analyzer
description: This topic explains how to manage retention policy with Azure Video Analyzer.
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 09/20/2021

---
# Manage retention policy with Video Analyzer

You can use Azure Video Analyzer for [recording](video-recording.md) live video into the cloud over a period of weeks, months, or years. This recording can either be [continuous](continuous-video-recording.md), or it can be sparse or [event-based](event-based-video-recording-concept.md). In either case, the recordings can span years without any automatic deletion of videos from storage account. However, users have the flexibility to control the retention time period after which the video assets will be deleted automatically.

## Retention policy

Retention period property provides the capability to clean up the videos automatically associated with the Video Analyzer accounts based on the time period configured for a particular video asset or at the pipeline level. It also helps in reducing the number of transactions to storage account & associated storage cost.

* You can specify a retention period for each video by a [Rest API call](/rest/api/videoanalyzer/videos/create-or-update), `retentionPeriod` property of video entity is used to set the retention time period under 'archival' tag of the Json request body as shown below

```
// Video Archival Details
"archival":
{
 // Data Retention (applicable to archives only)
 "retentionPeriod": "P7D",  // ISO8601 duration in days granularity (Min P1D, Max P5Y)
 "location":
  {
  "@type": "#Microsoft.VideoAnalyzer.CustomerStorageLocation",
  "storageAccount": "contosostorage",
  "storageContainer": "asset-0000"
  }
},
```
* The retention period can also be set in the properties of a video sink node when creating a pipeline topology. You will find the `retentionPeriod` property in the VideoCreationProperties section of the video sink node.
Example of `retentionPeriod` property set to seven days in Video Sink node is shown below:

```
"sinks": 
[{
  "@type": "#Microsoft.VideoAnalyzer.VideoSink",
  "name": "{nodeName}",         // Node identifier within the topology
  "videoName": "camera001",     // Video name (new or existing)
  "videoCreationProperties":    // Optional. Ignored if video already exists on append mode.
  {
  "title": "Parking Lot (Camera 1)",
  "description": "Parking lot south entrance",
  "segmentLength": "PT30S",   // Segment length, in 30 seconds increments (PT30S to PT5M)
  "retentionPeriod": "P7D"    // ISO8601 duration in days granularity 
  },
}]
```

## Rules & limitations

* Retention policy takes 24 hrs to go into effect and is not enforced immediately
* In pipeline topology, `retentionPeriod` is part of videoCreationProperties, that means retention period  will only be applied if the new video is being created
* Format: `retentionPeriod` property  takes ISO 8601 timestamp value, which must be in multiple of days. Example acceptable values: P1D, P20D, P1M, P365D, P1Y, P5Y
    * Minimum value could be set to one day (with 1 day granularity) or Maximum to five years
    * `retentionPeriod` property can be set to 'Null' to clear existing retention value

## Next steps

[Playback of recordings](playback-recordings-how-to.md)
