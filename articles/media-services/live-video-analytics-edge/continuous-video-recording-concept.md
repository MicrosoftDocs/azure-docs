---
title: Continuous video recording - Azure
description: Continuous video recording (CVR) refers to the process of continuously recording the video from a video source. This topic discusses what CVR is.
ms.topic: conceptual
ms.date: 04/27/2020

---
# Continuous video recording  

## Suggested pre-reading  

* [Media graph concept](media-graph-concept.md)
* [Video recording concept](video-recording-concept.md)

## Overview

Continuous video recording (CVR) refers to the process of continuously recording the video from a video source. Live Video Analytics on IoT Edge supports recording video continuously, on a 24x7 basis, from a CCTV camera via a [media graph](media-graph-concept.md) consisting of an RTSP source node and an asset sink node. The diagram below shows a graphical representation of such a media graph. The JSON representation of the [graph topology](media-graph-concept.md?branch=release-preview-media-services-lva#media-graph-topologies-and-instances) of such a media graph can be found [here](https://github.com/Azure/live-video-analytics/tree/master/MediaGraph/topologies/cvr-asset).

![Continuous video recording](./media/continuous-video-recording/continuous-video-recording-overview.png)

The media graph depicted above can be run on an edge device, with the asset sink recording video to an Azure Media Services [asset](terminology.md#asset). The video will be recorded for as long as the media graph stays in the activated state. Since video is being recorded as an asset, it can be played back using the existing streaming capabilities of Media Services. See [Playback of recorded content](video-playback-concept.md) for more details.

## Resilient recording

Live Video Analytics on IoT Edge supports operating under less-than-perfect network conditions, where the edge device may occasionally lose connectivity with the cloud or experience a drop in available bandwidth. To account for this, the video from the source is recorded locally into a cache and is automatically synced with the asset on a periodic basis. If you examine the [graph topology JSON](https://github.com/Azure/live-video-analytics/tree/master/MediaGraph/topologies/cvr-asset/topology.json), you will see it has the following properties defined:

```
    "segmentLength": "PT30S",
    "localMediaCacheMaximumSizeMiB": "2048",
    "localMediaCachePath": "/var/lib/azuremediaservices/tmp/",
```
The latter two properties are relevant to resilient recording (both are also required properties for an asset sink node). The localMediaCachePath property tells the asset sink to use that folder path to cache media data before uploading to the asset. You can see [this](https://docs.microsoft.com/azure/iot-edge/how-to-access-host-storage-from-module) article to understand how the edge module can make use of your device's local storage. The localMediaCacheMaximumSizeMiB property defines how much disk space the asset sink can use as a cache (1 MiB = 1024 * 1024 bytes). 

If your edge module loses connectivity for a very long time and the content stored in the cache folder reaches the localMediaCacheMaximumSizeMiB value, the asset sink will start discarding data from the cache, starting from the oldest data. For example, if the device lost connectivity at 10AM and the cache hits the maximum limit at 6PM, then the asset sink starts to delete data recorded at 10AM. 

When network connectivity is restored, the asset sink will begin uploading from the cache, again starting from the oldest data. In the above example, suppose 5 minutes worth of video had to be discarded from cache by the time connectivity was restored (say at 6:02PM), then the asset sink will start uploading from the 10:05AM mark.

If you later examine the asset using [these](playback-recordings-how-to.md) APIs, you will see that there is a gap in the asset from approximately 10AM to 10:05AM.

## Segmented recording  

As discussed above, the asset sink node will record video to a local cache, and periodically upload the video to the cloud. The segmentLength property (shown in the above section) will help you control the write transactions cost associated with writing data to your storage account where the asset is being recorded. For example, if you increase the upload period from 30 seconds to 5 minutes, then the number of storage transactions will drop by a factor of 10 (5*60/30).

The segmentLength property ensures that the edge module will upload video at most once per segmentLength seconds. This property has a minimum value of 30 seconds (also the default), and can be increased by 30 second increments to a maximum of 5 minutes.

>[!NOTE]
>See [this](playback-recordings-how-to.md) article for the effect that segmentLength has on playback.


## See also

* [Event-based video recording](event-based-video-recording-concept.md)
* [Playback of recorded content](video-playback-concept.md)


## Next steps

[Tutorial: continuous video recording](continuous-video-recording-tutorial.md)
