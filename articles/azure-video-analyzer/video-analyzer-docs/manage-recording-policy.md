---
title: Manage recording policy with Azure Video Analyzer
description: This topic explains how to manage recording policy with Azure Video Analyzer.
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 09/20/2021

---
# Manage recording policy with Video Analyzer

You can use Azure Video Analyzer for [recording](video-recording.md) live video into the cloud over a period of weeks, months, or years. This recording can either be [continuous](continuous-video-recording.md), or it can be sparse or [event-based](event-based-video-recording-concept.md). In either case, the recordings can span years without any cleanup. However, users have the flexibility to control the retention time period after which the video assets will be deleted automatically.

## Retention Policy

Retention period property provides the capability to clean up the videos automatically associated with the Video Analyzer accounts based on the time period configured for a particular video asset or at pipeline level. It also helps in reducing the number of transactions to storage account & associated storage cost.

* You can specify a retention period for each video by a Rest API call https://docs.microsoft.com/en-us/rest/api/videoanalyzer/videos/create-or-update, `retentionPeriod` property of video entity is used to set the retention time period under 'archival' tag of the Json request body as shown below
```
    // Video Archival Details
    "archival":
    {
      // Data Retention (applicable to archives only)
      "retentionPeriod": "P7D",  // ISO8601 duration in days granularity (Min P1D, Max P5Y)
 
      // PLACEHOLDER
      "location":
      {
        "@type": "#Microsoft.VideoAnalyzer.CustomerStorageLocation",
        "storageAccount": "contosostorage",
        "storageContainer": "asset-0000"

      }
    },
```
* It could also be set by Video Sink node while creating pipeline topology, you will find `retentionPeriod` property part of VideoCreationProperties of sink node. Once set it will be applied to all videos created using this pipeline topology.
Example of `retentionPeriod` property set to 7 days in Video Sink node is shown below:

```
"sinks": [
{
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

## Rules & Limitations

* Retention policy takes 24 hrs to take into effect & is not enforced immediately
* In pipeline topology, `retentionPeriod` is part of videoCreationProperties, that means it will only be applied if the video is being created & will be ignored if the video already exists
* Format: `retentionPeriod` property  takes ISO 8601 timestamp value, which must be in multiple of days. Example acceptable values: P1D, P20D, P1M, P365D, P1Y, P5Y
* Minimum, Maximum value could be set to 1 day (with 1 day granularity) or to max 5 years
* `retentionPeriod` property can be set to 'Null' to clear existing retention value

## Next steps

[Playback of recordings](playback-recordings-how-to.md)