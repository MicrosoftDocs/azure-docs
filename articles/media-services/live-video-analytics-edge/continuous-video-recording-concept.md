---
title: Continuous video recording - Azure
description: Continuous video recording (CVR) refers to the process of continuously recording the video from a video source. This topic discusses what CVR is.
ms.topic: conceptual
ms.date: 04/27/2020

---
# Continuous video recording  

## Suggested pre-reading  

* [Media Graph concept](media-graph-concept.md)
* [Video Recording concept](video-recording-concept.md)

## Overview

Continuous video recording (CVR) refers to the process of continuously recording the video from a video source. Live Video Analytics on IoT Edge supports recording video continuously, on a 24x7 basis, from a CCTV camera via a Media Graph consisting of an RTSP Source and an Asset Sink. The diagram below shows a graphical representation of the topology of such a media graph. An example JSON description of a CVR Media Graph topology can be found [here](https://github.com/Azure/live-video-analytics/tree/master/MediaGraph/topologies/cvr-asset).

![Continuous video recording](./media/continuous-video-recording/continuous-video-recording-overview.png)

The Media Graph depicted above can be run on an Edge device, with the asset sink recording video to an Azure Media Services [Asset](terminology.md#asset). The video will be recorded for as long as the Media Graph stays is in the running state. Since video is being recorded as a Media Services asset, it can be played back using Media Services. See [Playback of recorded content](video-playback-concept.md) for more details.

## Resilient recording

Live Video Analytics on IoT Edge supports operating under less-than-perfect network conditions, where the Edge device may occasionally lose connectivity with the cloud or experience a drop in available bandwidth. To account for this, the video from the source is recorded locally into a cache and is automatically synced with the asset on a periodic basis. 

## Segmented recording  

As discussed above, the asset Sink component will record video to a local cache, and periodically upload the video to the cloud. Since there is a cost associated with operations on your Storage account, this property will help you control that cost. For example, if you increase the upload period from 30 seconds to 5 minutes, then the number of storage transactions will drop by a factor of 10 (5*60/30).

<!--
> [!NOTE]
> See media playback for the effect this has on playback.
>-->
<!--
## See also

* [Event-based video recording](event-based-video-recording-concept.md)
* [Playback of recorded content](video-playback-concept.md)
-->
## Next steps

[Tutorial: continuous video recording](continuous-video-recording-tutorial.md)
