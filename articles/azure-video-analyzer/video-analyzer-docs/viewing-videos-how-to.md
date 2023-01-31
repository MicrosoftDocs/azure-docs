---
title: Viewing of videos
description: You can use Azure Video Analyzer for continuous video recording, whereby you can record video into the cloud for weeks or months. You can also limit your recording to clips that are of interest, via event-based recording. In addition, when using Video Analyzer service to capture videos from cameras, you can stream the video as it is being captured. This article talks about how to view such videos.
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---
# Viewing of videos

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

## Suggested pre-reading

* [Video Analyzer video resource](terminology.md#video)
* [Continuous video recording](continuous-video-recording.md)
* [Event-based video recording](event-based-video-recording-concept.md)

## Background  

You can create [video resources](terminology.md#video) in your Azure Video Analyzer account by either recording from an RTSP camera, or exporting a portion of such a recording. If you are building a [VMS](terminology.md#vms) using Video Analyzer APIs, then this article will help you understand how you can view videos. After reading this article, you should proceed to review the article on [access policies](access-policies.md) and on the [Video Analyzer player widget](player-widget.md). 

If you are evaluating the capabilities of Video Analyzer, then you can go through [Quickstart: Detect motion in a (simulated) live video, record the video to the Video Analyzer account](edge/detect-motion-record-video-clips-cloud.md) or [Tutorial: Continuous video recording and playback](edge/use-continuous-video-recording.md). Make use of the Azure portal to view the videos.
<!-- TODO - add a section here about 1P/3P SaaS and how to use widgets to allow end users to view videos without talking to ARM APIs -->

## Creating videos

Following are some of the ways to create videos using the Video Analyzer edge module:

* Record [continuously](continuous-video-recording.md) (CVR) from an RTSP camera, for weeks or months or more.
* Only record portions that are of interest, via [event-based video recording](event-based-video-recording-concept.md) (EVR). 
 
You can also use the Video Analyzer service to create videos using CVR. You can also use the service to create a video by exporting a portion of a video recording - such videos will contain a downloadable file (in MP4 file format).

## Accessing videos

You can query the ARM API [`Videos`](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/videoanalyzer/resource-manager/Microsoft.Media/preview/2021-11-01-preview/Videos.json) to view the properties of the video resource. Video Analyzer also enables you to build applications where end users can browse and view videos without going through ARM. As shown in the article on [public endpoints](access-public-endpoints-networking.md), you have access to so-called Client APIs through which you can query for the properties of videos. These APIs are exposed through a client API endpoint, which you can find in the Overview section of the Video Analyzer blade in Azure portal, or via the ARM API [`VideoAnalyzers`](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/videoanalyzer/resource-manager/Microsoft.Media/preview/2021-11-01-preview/VideoAnalyzers.json). You can control access to this endpoint via [access policies](access-policies.md), and the [article on the Video Analyzer player widget](player-widget.md) shows you how.

## Determining that a video recording is ready for viewing

If your video resource represents the recording from an RTSP camera, you can [stream that content](terminology.md#streaming) either after the recording is complete, or while the recording is ongoing. This is indicated via the `canStream` flag that will be set to `true` for the video resource. Note that such videos will have `type` set to `archive`, and the URL for playback or streaming is returned in `archiveBaseUrl`. 

When you export a portion of a video recording to an MP4 file, the resulting video resource will have `type` set to `file` - and it will be available for playback or download once the video exporting job completes. The URL for playback or download of such files is returned in `downloadUrl`.
   > [!NOTE]
   > The above URLs require a [bearer token](./access-policies.md#creating-a-token). See the [Video Analyzer player widget](player-widget.md) documentation for more details.

## Recording and playback latencies

When using Video Analyzer edge module to record to a video resource, you will specify a [`segmentLength` property](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/videoanalyzer/data-plane/VideoAnalyzer.Edge/preview/1.1.0/AzureVideoAnalyzer.json) in your pipeline topology which tells the module to aggregate a minimum duration of video (in seconds) before it is written to the cloud. For example, if `segmentLength` is set to 300, then the module will accumulate 5 minutes worth of video before uploading one 5 minutes “chunk”, then go into accumulation mode for the next 5 minutes, and upload again. Increasing the `segmentLength` has the benefit of lowering your Azure Storage transaction costs, as the number of reads and writes will be no more frequent than once every `segmentLength` seconds. If you are using Video Analyzer service, the pipeline topology has the same [`segmentLength` property](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/videoanalyzer/resource-manager/Microsoft.Media/preview/2021-11-01-preview/PipelineTopologies.json).

Consequently, streaming of the video from your Video Analyzer account will be delayed by at least that much time. 

Another factor that determines end-to-end latency (the delay between the time an event occurs in front of the camera, to the time it is viewed on a playback device) is the group-of-pictures [GOP](https://en.wikipedia.org/wiki/Group_of_pictures) duration. As [reducing the delay of live streams by using 3 simple techniques](https://medium.com/vrt-digital-studio/reducing-the-delay-of-live-streams-by-using-3-simple-techniques-e8e028b0a641) explains, the longer the GOP duration, the longer the latency. It is common to have IP cameras used in surveillance and security scenarios configured to use GOPs longer than 30 seconds. This has a large impact on the overall latency.

## Low latency streaming

When using the Video Analyzer service to capture and record videos from RTSP cameras, you can view the video with latencies of around 2 seconds using [low latency streaming](terminology.md#low-latency-streaming). The service makes available a websocket tunnel through which an RTSP-capable player such as the [Video Analyzer player widget](player-widget.md) can receive video using [RTSP protocol](https://datatracker.ietf.org/doc/html/rfc7826.html). Note that overall latency is dependent on the network bandwidth between the camera and cloud, as well as between the cloud and the playback device, as well as the processing power of the playback device. The URL for low latency streaming is returned in `rtspTunnelUrl`.

   > [!NOTE]
   > The above URL requires a [bearer token](./access-policies.md#creating-a-token). See the [Video Analyzer player widget](player-widget.md) documentation for more details.

## Video Analyzer player widget
Video Analyzer provides you with the necessary capabilities to deliver streams via HLS or MPEG-DASH or RTSP protocols to playback devices (clients). You would use the [Video Analyzer player widget](player-widget.md) to obtain the relevant URLs and the content authorization token, and use these in client apps to play back the video and inference metadata.

You can install the Video Analyzer player widget to view videos. The widget can be installed using `npm` or `yarn` and this will allow you to include it in your own client-side application. Run one of the following commands to include the widget in your own application:

NPM:
```
npm install –-save @azure/video-analyzer-widgets
```
YARN:
```
yarn add @azure/video-analyzer-widgets 
```
Alternatively you can embed an existing pre-build script by adding type="module" to the script element referencing the pre-build location using the following example:

```
<script async type="module" src="https://unpkg.com/@azure/video-analyzer-widgets"></script> 
``` 

## Viewing video with inference results
When recording video using the Video Analyzer edge module, if your [pipeline](pipeline.md) is using AI to generate inference results, you can record these results along with the video. When viewing the video, the Video Analyzer player widget can overlay the results on the video. See [this tutorial](edge/record-stream-inference-data-with-video.md) for more details.

## Next steps

* [Understand access policies](access-policies.md)
* [Use the Video Analyzer player widget](player-widget.md)
* [Continuous video recording on the edge](edge/use-continuous-video-recording.md)
* [Continuous video recording in the cloud](cloud/get-started-livepipelines-portal.md)
