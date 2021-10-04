---
title: Viewing of videos - Azure Video Analyzer
description: You can use Azure Video Analyzer for continuous video recording, whereby you can record video into the cloud for weeks or months. You can also limit your recording to clips that are of interest, via event-based recording. In addition, when using Video Analyzer service to capture videos from cameras, you can stream the video as it is being captured. This article talks about how to view such videos.
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 09/30/2021

---
# Viewing of videos

## Pre-read  

* [Continuous video recording](continuous-video-recording.md)
* [Event-based video recording](event-based-video-recording-concept.md)

## Background  

You can use the Azure Video Analyzer edge module for [continuous video recording](continuous-video-recording.md) (CVR), whereby you can record video into the cloud for weeks or months. You can also limit your recording to clips that are of interest, via [event-based video recording](event-based-video-recording-concept.md) (EVR). In both cases, if your [pipeline](pipeline.md) is using AI to generate inference results, you can [record these results along with the video](record-stream-inference-data-with-video.md). You can also use the Video Analyzer service for CVR, or to export a portion of a video recording to a standalone video file (in MP4 file format).

If you are evaluating the capabilities of Video Analyzer edge module, then you should go through the [tutorial on CVR](edge/use-continuous-video-recording.md), or the [tutorial on playing back video with inference metadata](record-stream-inference-data-with-video.md) where you would play back the recordings using Azure portal. If you are evaluating the use of Video Analyzer service for CVR, then you should review the quickstart here <!-- TODO : link to cloud CVR quickstart -->. For video exporting, you can review the tutorial here <!-- TODO : link to exporting tutorial -->. 

If you are building an application or service using Video Analyzer APIs, then you should review the following to understand how you can view videos, in addition to reviewing the article on [access policies](access-policies.md) and on the [Video Analyzer player widget](player-widget.md).

<!-- TODO - add a section here about 1P/3P SaaS and how to use widgets to allow end users to view videos without talking to ARM APIs -->

## Determining that a video recording is ready for playback

Your Video Analyzer account is linked to an Azure Storage account, and when you record video to the cloud, the content is written to a [video resource](terminology.md#video). You can query the ARM API [`Videos`](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/videoanalyzer/resource-manager/Microsoft.Media/preview/2021-11-01-preview/Videos.json) to view the properties of the resource. You can [stream that content](terminology.md#streaming) either after the recording is complete, or while the recording is ongoing. This is indicated via the `canStream` flag that will be set to `true` for the video resource. Note that such videos will have `type` set to `archive`, and the URL for playback or streaming is returned in `archiveBaseUrl`. When you export a portion of a video recording to an MP4 file, the resulting video will have `type` set to `file` - and it will be available for playback or download once the video exporting job completes. The URL for playback or download of such files is returned in `downloadUrl`.

## Recording and playback latencies

When using Video Analyzer edge module to record to a video resource, you will specify a [`segmentLength` property](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/videoanalyzer/data-plane/VideoAnalyzer.Edge/preview/1.0.0/AzureVideoAnalyzer.json) in your pipeline topology which tells the module to aggregate a minimum duration of video (in seconds) before it is written to the cloud. For example, if `segmentLength` is set to 300, then the module will accumulate 5 minutes worth of video before uploading one 5 minutes “chunk”, then go into accumulation mode for the next 5 minutes, and upload again. Increasing the `segmentLength` has the benefit of lowering your Azure Storage transaction costs, as the number of reads and writes will be no more frequent than once every `segmentLength` seconds. If you are using Video Analyzer service, the pipeline topology has the same [`segmentLength` property](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/videoanalyzer/resource-manager/Microsoft.Media/preview/2021-11-01-preview/PipelineTopologies.json).

Consequently, streaming of the video from your Video Analyzer account will be delayed by at least that much time. 

Another factor that determines playback latency (the delay between the time an event occurs in front of the camera, to the time it can be viewed on a playback device) is the group-of-pictures [GOP](https://en.wikipedia.org/wiki/Group_of_pictures) duration. As [reducing the delay of live streams by using 3 simple techniques](https://medium.com/vrt-digital-studio/reducing-the-delay-of-live-streams-by-using-3-simple-techniques-e8e028b0a641) explains, longer the GOP duration, longer the latency. It’s common to have IP cameras used in surveillance and security scenarios configured to use GOPs longer than 30 seconds. This has a large impact on the overall latency.

## Low latency streaming

When using the Video Analyzer service to capture and record videos from the cameras, you can view the video with latencies under 2 seconds using [low latency streaming](terminology.md#low-latency-streaming). The service makes available a websocket tunnel through which an RTSP-capable player such as the [Video Analyzer player widget](player-widget.md) can receive video using [RTSP protocol](https://datatracker.ietf.org/doc/html/rfc7826.html). Note that overall latency is dependent on the network bandwidth between the camera and cloud, as well as between the cloud and the playback device, as well as the processing power of the playback device. The URL for low latency streaming is returned in `rtspTunnelUrl`.


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

## Next steps

* [Use the Video Analyzer player widget](player-widget.md)
* [Continuous video recording on the edge](edge/use-continuous-video-recording.md)
<!--TODO: link to cloud quickstart -->
