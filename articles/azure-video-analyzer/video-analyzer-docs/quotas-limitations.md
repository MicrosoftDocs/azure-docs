---
title: Quotas and limitations 
description: This article describes Azure Video Analyzer quotas and limitations.
ms.service: azure-video-analyzer
ms.topic: conceptual
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---
# Video Analyzer quotas and limitations

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

This article describes Azure Video Analyzer quotas and limitations.

## Quotas and limitations - Edge module

This section enumerates the quotas and limitations of the Video Analyzer edge module.

### Maximum period of disconnected use

The edge module can sustain temporary loss of internet connectivity. If the module remains disconnected for more than 36 hours, it will deactivate any live pipelines that were running. All further direct method calls will be blocked.

To restore the edge module to an operational state, you will have to re-establish the internet connectivity so that the module is able to successfully communicate with the Azure Video Analyzer account.

### Maximum number of live pipelines

At most 1000 live pipelines per module (created via `livePipelineSet`) are supported.

### Maximum number of pipeline topologies

At most 50 pipeline topologies per module (created via `pipelineTopologySet`) are supported.

### Limitations on pipeline topologies

Following are the limitations on how different nodes can be connected together in a pipeline topology.

* RTSP source
   * Only one RTSP source is allowed per pipeline topology.
* Motion detection processor
   * Must be immediately downstream from RTSP source.
   * Cannot be used downstream from an HTTP or a gRPC extension processor.
* Signal gate processor
   * Must be immediately downstream from RTSP source.
   * Cannot be used upstream from an HTTP or a gRPC extension processor.
* Object tracker processor
   * Must be immediately downstream from an HTTP or a gRPC extension processor. The extension processor should not be applying an AI model on every frame of the live video.
* Line crossing processor
   * Must be immediately downstream from an object tracker processor.
* Video sink 
   * Must be immediately downstream from RTSP source or signal gate processor.
* File sink
   * Must be immediately downstream from signal gate processor.
   * Cannot be immediately downstream from an HTTP or a gRPC extension processor or motion detection processor.
* IoT Hub Sink
   * Cannot be immediately downstream from an IoT Hub Source.

### Supported cameras
You can only use IP Cameras that support RTSP protocol. You can find IP cameras that support RTSP on the [ONVIF conformant products](https://www.onvif.org/conformant-products) page. Look for devices that conform with profiles G, S, or T.

You should configure these cameras to use H.264 video and AAC audio. Other codecs are currently not supported.

Video Analyzer only supports RTSP with [interleaved RTP streams](https://datatracker.ietf.org/doc/html/rfc2326#section-10.12). In this mode, RTP traffic is tunneled through the RTSP TCP connection. RTP traffic over UDP is not supported. 

### Support for video AI
The HTTP or gRPC extension processors only support sending of image/video frame data with an external AI module. Thus, running inferencing on audio data is not supported. As a result, processor nodes in pipeline topologies that have an RTSP source node as one of the `inputs` also make use of an `outputSelectors` property to ensure that only video is passed into the processor. See this [topology](https://github.com/Azure/video-analyzer/blob/main/pipelines/live/topologies/evr-grpcExtension-video-sink/topology.json) as an example.

## Quotas and limitations - cloud pipelines

This section enumerates the quotas and limitations of Video Analyzer cloud pipelines. 

### Maximum number of pipeline topologies 

At most 5 pipeline topologies per Video Analyzer account are supported. 

### Limits on concurrent activation of live pipelines 

At most 10 live pipelines can be activated over a time window of 5 minutes, and at most 10 such pipelines can be in an `Activating` state at any given time.

These limits do not apply to pipeline jobs.  

### Maximum live pipelines per topology	 

At most 50 live pipelines per topology are supported.  

### Concurrent low latency streaming sessions  

For each active live pipeline, there can be at most one client application viewing the [low latency stream](viewing-videos-how-to.md#low-latency-streaming). If another client attempts to connect, the request will be refused.  

### Limitations on designing pipeline topologies 

Following are the different nodes that can be connected together in a pipeline topology and their limitations: 

* RTSP source
   * Only one RTSP source is allowed per pipeline topology.
* Video source
   * Only one video source is allowed per pipeline topology.
   * Can only be used in pipeline topologies of the [batch kind](pipeline.md#batch-pipeline). It can only accept a video resource of type `archive`. 
* Encoder processor 
   * Only one encoder processor is allowed per pipeline topology.
   * Can only be used in pipeline topologies of the [batch kind](pipeline.md#batch-pipeline), and it must be immediately upstream of the video video sink node in such topologies.
   * It only supports encoding video with H.264 codec and audio with AAC codec.
   * Allows user to specify encoding properties when converting the recorded video into the desired format for downstream processing. Two types: (a) System Preset
     (b) Custom Preset. The allowed configurations for each preset are listed in the table below: 
     
     | Configuration       | System Preset        | Custom Preset |
     | -----------         | -----------          |----------- |
     | Video encoder bitrate kbps      | same as source      | 200 to 16,000 kbps |
     | Frame rate       | same as source      | 0 to 300 |
     | Height    | same as source        | 1 to 4320 |
     | Width    | same as source       | 1 to 8192 |
     | Mode   | Pad        | Pad, PreserveAspectRatio, Stretch |     
     | Audio encoder bitrate kbps  | same as source        | Allowed values: 96, 112, 128, 160, 192, 224, 256 |
     
* Video sink 
   *  Only one video sink is allowed per pipeline topology.
   *  Must be immediately downstream from RTSP source or encoder processor node. 
   *  When used in a pipeline topology of batch kind, it will produce an MP4 file as an output.

### Support for batch video export 

* Segment selection 
   * The time sequence, that is the start and end timestamp of the portion of the archived video to be exported, should be specified in UTC time. 
   * The maximum span of the time sequence (end timestamp - start timestamp) must be less than or equal to 24 hours. 

### Supported cameras

You can only use IP Cameras that support RTSP protocol. You can find IP cameras that support RTSP on the [ONVIF conformant products](https://www.onvif.org/conformant-products) page. Look for devices that conform with profiles G, S, or T. 

You should configure these cameras to use H.264 video and AAC audio. Other codecs are currently not supported. Video encoding bitrate must be between 500 and 3000 Kbps. If true ingestion bitrate is above this threshold, ingestion will be disconnected and reconnected with exponential backoff.

Video Analyzer only supports RTSP with [interleaved RTP streams](https://datatracker.ietf.org/doc/html/rfc2326#section-10.12). In this mode, RTP traffic is tunneled through the RTSP TCP connection. RTP traffic over UDP is not supported. 

### Support for video AI 

Analysis of live or recorded video is currently not supported.

## Quotas and limitations - Service

This section enumerates the quotas and limitations of the Video Analyzer account.

### Limitations on service operations at preview

At the time of the preview release, the Video Analyzer service does not support the following:

* The ability to migrate the account from one subscription to another without an interruption.
* The ability to use more than one Storage account with the account.
* The ability to use a Storage account in a different region than the Video Analyzer account.

### Limits on video resources
At the time of the preview release, each Video Analyzer account can have at most 10,000 video resources. If you have a business need for a higher limit, open a support ticket in the Azure portal.

### Limits on access policies
At the time of the preview release, each Video Analyzer account can have at most 20 access policies.

### Limits on registered edge modules
At the time of the preview release, each Video Analyzer account can have at most 1,000 edge modules registered with it. If you have a business need for a higher limit, open a support ticket in the Azure portal.

### Limits on Client API calls
Following limits apply to the Client APIs at preview release:

* Up to 50 requests within 10 seconds
* Up to 600 requests per hour

## Limitations - Video Analyzer player widgets

At the time of the preview release, playback on iOS devices is not supported.

## Next steps

[Overview](overview.md)
