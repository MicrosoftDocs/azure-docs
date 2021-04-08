---
title: Azure Video Analyzer quotas and limitations - Azure
description: This article describes Azure Video Analyzer quotas and limitations.
ms.service: azure-video-analyzer
ms.topic: conceptual
ms.date: 03/26/2021 
 
---
# Quotas and limitations

This article describes Azure Video Analyzer quotas and limitations.

## Quotas and limitations - Edge module

This section enumerates the quotas and limitations of the Azure Video Analyzer on IoT Edge module.

### Maximum period of disconnected use

The edge module can sustain temporary loss of internet connectivity. If the module remains disconnected for more than 36 hours, it will deactivate any live pipelines that were running. All further direct method calls will be blocked.

To resume the edge module to an operational state, you will have to restore the internet connectivity so that the module is able to successfully communicate with the Azure Video Analyzer account.

### Maximum number of live pipelines

At most 1000 live pipelines per module (created via livePipelineSet) are supported.

### Maximum number of pipeline topologies

At most 50 pipeline topologies per module (created via pipelineTopologySet) are supported.

### Limitations on pipeline topologies at preview

With the preview release, there are limitations on different nodes can be connected together in a pipeline topology.

* RTSP source
   * Only one RTSP source is allowed per pipeline topology.
* Motion detection processor
   * Must be immediately downstream from RTSP source.
   * Cannot be used downstream of an HTTP or a gRPC extension processor.
* Signal gate processor
   * Must be immediately downstream from RTSP source.
* Video sink 
   * Must be immediately downstream from RTSP source or signal gate processor.
* File sink
   * Must be immediately downstream from signal gate processor.
   * Cannot be immediately downstream of an HTTP or a gRPC extension processor or motion detection processor.
* IoT Hub Sink
   * Cannot be immediately downstream of an IoT Hub Source.

### Supported cameras
You can only use IP Cameras that support RTSP protocol. You can find IP cameras that support RTSP on the [ONVIF conformant products](https://www.onvif.org/conformant-products) page. Look for devices that conform with profiles G, S, or T.

Further, you should configure these cameras to use H.264 video and AAC audio. Other codecs are currently not supported.

### Support for video AI
The extension nodes (HTTP or gRPC extension processors) only support sending of image/video frame data with an external AI module. Thus, running inferencing on audio data is not supported. As a result, processor nodes in pipeline topologies that have an RTSP source node as one of the `inputs` also make use of an `outputSelectors` property to ensure that only video is passed into the processor. See [this]()<!-- https://github.com/Azure/video-analyzer/blob/master/topologies/live/evr-grpcExtension-assets/2.0/topology.json --> topology as an example.

## Quotas and limitations - Service

This section enumerates the quotas and limitations of the Azure Video Analyzer service.

### Limitations on service operations at preview

At the time of the preview release, the Azure Video Analyzer service does not support the following:

* The ability to migrate the account from one subscription to another without an interruption.
* The ability to use more than one Storage account with the account.

### Limits on Client API calls
Following limits apply to the Client APIs at preview release:

* Up to 50 requests within 10 seconds
* Up to 600 requests per hour

## Next steps

[Overview](overview.md)
