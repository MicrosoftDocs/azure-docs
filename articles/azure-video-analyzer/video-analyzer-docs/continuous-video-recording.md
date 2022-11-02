---
title: Continuous video recording from the edge 
description: Continuous video recording (CVR) refers to the process of continuously recording from a live video source. This topic discusses what CVR is and how to use it with Azure Video Analyzer.
ms.service: azure-video-analyzer
ms.topic: conceptual
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---

# Continuous video recording    

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

Continuous video recording (CVR) refers to the process of continuously recording the video from a video source. Azure Video Analyzer supports recording video continuously, on a 24x7 basis, from a CCTV camera via a video processing [pipeline topology](pipeline.md) consisting of an RTSP source node and a video sink node. The diagram below shows a graphical representation of such a pipeline. The JSON representation of the topology can be found in this [document](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/cvr-video-sink/topology.json). You can use such a topology to create arbitrarily long recordings (years worth of content). The timestamps for the recordings are stored in UTC.  

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/continuous-video-recording/continuous-video-recording-overview.svg" alt-text="Continuous video recording":::

An instance of the pipeline topology depicted above can be run on an edge device in the Video Analyzer service, with the video sink recording to a [video resource](terminology.md#video). The video will be recorded for as long as the pipeline stays in the activated state. Recorded video can be played back using the streaming capabilities of Video Analyzer. See [Recorded and live videos](viewing-videos-how-to.md) for more details.

## Suggested pre-reading  

It is recommended to read the following articles before proceeding.

* [Pipeline topology concept](pipeline.md)
* [Video recording concept](video-recording.md) 
 
## Resilient recording

Video Analyzer edge module supports operating under conditions where the edge device may occasionally lose connectivity with the cloud or experience a drop in available bandwidth. To account for this, the video from the source is recorded locally into a cache and is automatically synced with the video resource on a periodic basis. If you examine the [pipeline topology](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/cvr-video-sink/topology.json), you will see it has the following properties defined:

```
"segmentLength": "PT30S",
"localMediaCacheMaximumSizeMiB": "2048",
"localMediaCachePath": "/var/lib/videoanalyzer/tmp/",
```

The latter two properties are relevant to resilient recording (both are also required properties for a video sink node). The `localMediaCachePath` property tells the video sink to use that folder path to cache media data before uploading to the cloud. You can see [this](../../iot-edge/how-to-access-host-storage-from-module.md) article to understand how the edge module can make use of your device's local storage. The `localMediaCacheMaximumSizeMiB` property defines how much disk space the video sink can use as a cache (1 MiB = 1024 * 1024 bytes). 

If your edge module loses connectivity for a long time and the content stored in the cache folder reaches the `localMediaCacheMaximumSizeMiB` value, the video sink will start discarding data from the cache, starting from the oldest data. For example, if the device lost connectivity at 10AM and the cache hits the maximum limit at 6PM, then the video sink starts to delete data recorded at 10AM. 

When network connectivity is restored, the video sink will begin uploading from the cache, again starting from the oldest data. In the above example, suppose 5 minutes worth of video had to be discarded from cache by the time connectivity was restored (say at 6:02PM), then the video sink will start uploading from the 10:05AM mark.

Gaps in recordings can also occur, for example, if you restart pipelines for whatever reason. You can also stop a pipeline and restart at a later time - as long as the camera settings do not change, you can continue to record to the same Video Analyzer video resource.

## Segmented recording  

The `segmentLength` property, shown above, will help you control the write transactions cost associated with writing data to your storage account where the video resource is being recorded. For example, if you increase the value from 30 seconds to 5 minutes, then the number of storage transactions will drop by a factor of 10 (5*60/30).

The `segmentLength` property ensures that video is written to the storage account at most once per `segmentLength` seconds. This property has a minimum value of 30 seconds (also the default), and can be increased by 30-second increments to a maximum of 5 minutes.

This property applies to both the Video Analyzer edge module and the Video Analyzer service. See the [Recorded and live videos](viewing-videos-how-to.md) article for the effect that `segmentLength` has on playback.

## See also

* [Event-based video recording](event-based-video-recording-concept.md) 
* [Recorded and live videos](viewing-videos-how-to.md) 

## Next steps

[Tutorial: continuous video recording](edge/use-continuous-video-recording.md) 
