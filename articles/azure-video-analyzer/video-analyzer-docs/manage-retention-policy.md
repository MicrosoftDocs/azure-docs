---
title: Manage retention policy 
description: This topic explains how to manage retention policy with Azure Video Analyzer.
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---
# Manage retention policy with Video Analyzer

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

You can use Azure Video Analyzer to archive content for long durations of time, spanning from few seconds to years’ worth of video content from a single source. You can explicitly control the retention policy of your content, which ensures that older content gets periodically trimmed. You can apply different policies to different archives - for example, you can retain the most recent 3 days of recordings from a parking lot camera, and the most recent 30 days of recordings from the camera behind the cashier's desk.

## Retention period

For each [video resource](terminology.md#video) in your Video Analyzer account, you can optionally apply a retention policy. When you specify a retention period (as described below), the service periodically trims content that is older than that period. If you don't specify a policy, content is stored indefinitely.

The retention period is typically set in the properties of a video sink node when creating a pipeline topology. You will find the `retentionPeriod` property in the `videoCreationProperties` section. As the name suggests, the property is used when a live pipeline is activated using this topology, and a new video resource is created. These creation properties are not used if the video resource already exists (such as when a pipeline is reactivated). Below is an example of how a 3-day retention policy could be applied to all parking lot cameras.

```
{
  "@type": "#Microsoft.VideoAnalyzer.VideoSink",
  "name": "{nodeName}",         
  "videoName": "{nameForVideoResource}",
  "videoCreationProperties":
  {
    "title": "{titleForVideo}",
    "description": "{descriptionForVideo}",
    "segmentLength": "PT30S",
    "retentionPeriod": "P3D"
  },
}
```

You can also set or update the `retentionPeriod` property of a video resource, using Azure portal, or via the [REST API](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/videoanalyzer/resource-manager/Microsoft.Media/preview/2021-11-01-preview/Videos.json). Below is an example of setting a 3-day retention policy.

```
"archival":
{
   "retentionPeriod": "P3D",
},
```

## Rules and limitations

* Retention policy may take up to 24 hours to go into effect
* Format: `retentionPeriod` property  takes ISO 8601 duration value, which must be in multiple of days. Example acceptable values: P1D, P20D, P1M, P365D, P1Y, P5Y
    * Minimum value is P1D, and maximum is P5Y
    * When set to null, the retention policy is cleared, and the video content is stored indefinitely
* When retention policy is used, you will incur additional Azure storage transaction costs as the service locates and deletes blobs

## Next steps

[Recorded and live videos](viewing-videos-how-to.md)
