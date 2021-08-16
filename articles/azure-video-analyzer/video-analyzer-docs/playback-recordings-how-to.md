---
title: Playback of video recordings - Azure Video Analyzer
description: You can use Azure Video Analyzer for continuous video recording, whereby you can record video into the cloud for weeks or months. You can also limit your recording to clips that are of interest, via event-based recording. This article talks about how to playback such recordings.
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 06/01/2021

---
# Playback of video recordings 

## Pre-read  

* [Continuous video recording](continuous-video-recording.md)
* [Event-based video recording](event-based-video-recording-concept.md)

## Background  

You can use Azure Video Analyzer for [continuous video recording](continuous-video-recording.md) (CVR), whereby you can record video into the cloud for weeks or months. You can also limit your recording to clips that are of interest, via [event-based video recording](event-based-video-recording-concept.md) (EVR). In both cases, if your [pipeline](pipeline.md) is using AI to generate inference results, you should be [recording these results along with the video](record-stream-inference-data-with-video.md). 

If you are evaluating the capabilities of Video Analyzer, then you should go through the [tutorial on CVR](use-continuous-video-recording.md), or the [tutorial on playing back video with inference metadata](record-stream-inference-data-with-video.md) where you would play back the recordings using Azure portal.

If you are building an application or service using Video Analyzer APIs, then you should review the following to understand how you can play back recordings, in addition to reviewing the article on [access policies](access-policies.md) and on the [Video Analyzer player widget](player-widget.md).

<!-- TODO - add a section here about 1P/3P SaaS and how to use widgets to allow end users to view videos without talking to ARM APIs -->

## Determining that a video recording is ready for playback

Your Video Analyzer account is linked to an Azure Storage account, and when you record video to the cloud, the content is written to a [video resource](terminology.md#video). You can [stream that content](terminology.md#streaming) either after the recording is complete, or while the recording is ongoing. This is indicated via the `canStream` [flag](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/videoanalyzer/resource-manager/Microsoft.Media/preview/2021-05-01-preview/Videos.json) that will be set to `true` for the video resource. 

## Video Analyzer player widget
Video Analyzer provides you with the necessary capabilities to deliver streams via HLS or MPEG-DASH protocols to playback devices (clients). You would use the Video Analyzer player widget  to obtain the streaming URL and the playback authorization token, and use these in client apps to play back the video and inference metadata.

You can install the Video Analyzer player widget to playback video recordings. The widget can be installed using `npm` or `yarn` and this will allow you to include it in your own client-side application. Run one of the following commands to include the widget in your own application:

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

## Recording and playback latencies

When using Video Analyzer to record to a video resource, you will specify a [`segmentLength` property](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/videoanalyzer/data-plane/VideoAnalyzer.Edge/preview/1.0.0/AzureVideoAnalyzer.json) which tells the module to aggregate a minimum duration of video (in seconds) before it is written to the cloud. For example, if `segmentLength` is set to 300, then the module will accumulate 5 minutes worth of video before uploading one 5 minutes “chunk”, then go into accumulation mode for the next 5 minutes, and upload again. Increasing the `segmentLength` has the benefit of lowering your Azure Storage transaction costs, as the number of reads and writes will be no more frequent than once every `segmentLength` seconds.

Consequently, streaming of the video from your Video Analyzer account will be delayed by at least that much time. 

Another factor that determines playback latency (the delay between the time an event occurs in front of the camera, to the time it can be viewed on a playback device) is the group-of-pictures [GOP](https://en.wikipedia.org/wiki/Group_of_pictures) duration. As [reducing the delay of live streams by using 3 simple techniques](https://medium.com/vrt-digital-studio/reducing-the-delay-of-live-streams-by-using-3-simple-techniques-e8e028b0a641) explains, longer the GOP duration, longer the latency. It’s common to have IP cameras used in surveillance and security scenarios configured to use GOPs longer than 30 seconds. This has a large impact on the overall latency.

## Next steps

[Continuous video recording tutorial](use-continuous-video-recording.md)
