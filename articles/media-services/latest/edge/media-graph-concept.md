---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Media Graph concept - Azure
titleSuffix: Azure Media Services
description:  
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 02/10/2020
ms.author: juliako

---

# Media Graph concept

Azure Media Services v3 is introducing a new entity called **Media Graph** (*MediaGraph* in API). This Media Graph entity represents a logical graph defining media sources, processors, and sinks, along with data interconnections between them for high-scale IP video ingest on the edge or in the cloud.

A Media Graph is also a blueprint for processing a live stream of video in the cloud or on the edge and running it through a graph of "processors" that can extract information using machine learning models. Processors can extract information from the video and audio and supply it to downstream "sinks".

You can see the definition of the new **MediaGraph** type in this [Open API specification](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/mediaservices/resource-manager/Microsoft.Media/preview/2019-09-01-preview/MediaGraphs.json).

With this release, the following graph topologies are supported:

- In the cloud - enables you to ingest from RTSP source, archive to storage, and playback (on-demand and live).
- At the Edge - enables you to ingest from RTSP source, detect motion, archive video clips, and playback (on-demand and live).

Review [FAQ: Live Video Analytics](faqs.md) for detailed information about what is supported in this release.

## Media Graph in the Cloud

In the cloud, you can create a Media Graph with RTSP source and an asset sink. This enables you to ingest a video from an RTSP source (for example, IP camera) and archive it as a Media Services asset. The existing Media Services APIs can be used to stream the asset using HLS or DASH format.

> [!NOTE] 
> In the current release, there are no processors supported in the cloud; they will be added later in the preview.

For more information, see the [Tutorial: Manage Media Graphs in the Cloud for RTSP ingest](media-graph-cloud-tutorial.md) tutorial.

## Media Graph on the Edge

You can use the Media Services on IoT Edge module to create a Media Graph with RTSP source, motion detector processor, and an asset sink. This enables you to ingest a video from an RTSP source (for example, IP camera), analyze it using motion detection, start recording the video upon receiving a motion detection event and stop recording later (based on some business logic). The recorded video can be played back using existing Media Services APIs.

For more information, see the [How-to: Initial setup for Media Graph on IoT Edge](edge-setup.md) tutorial.

## Terminology

- **Source** - Your _Real Time Streaming Protocol_ (RTSP) source.
- **Processor** - Media Services motion detection processor.
    
    > [!NOTE] 
    > Right now, the motion detection processor is only available on the edge module.
- **Sink nodes** - A `MediaGraphAssetSink` entity that is mapped to an asset into which the stream is being archived.

## Supported computer architectures

### Edge

Supported operated systems for Media Graph on IoT Edge:

- Ubuntu Linux 16.04 or 18.04
- x64 and AMD64 only

### Limitations

Below is a list of currently limitations and configurations. For more information, see [Quota and limitations](faqs.md#quota-and-limitations) in the [Media Graph FAQ](faqs.md).

- Cloud
  - RTSP source needs to be on a public IP address / not behind a firewall.
  - Current maximum of 24 hr archive
  - Max of 50 Media Graphs per Azure Media Services account
  - In this preview, cloud ingestion is only supported in the `eastus` region. Storage and Media Services account can be located in any region.
  - In this preview, we do not support security options, although, you can pass the `username` and `password` credentials.
- Edge
  - 20 edge modules max
  - 1 Media Graph per edge module
  - In this preview, there is no way to refresh the SAS URL; continuous archiving will write to this indefinitely (each clip/asset is an individual blob)

### Billing

During the preview, the media graph is not emitting any billing meters. As we reach public preview, we will be announcing the pricing model for both the cloud media graph and the edge.

There may be billing for other resources during preview including storage. For more information, see [Billing and availability](faqs.md#billing-and-availability) in the [Media Graph FAQ](faqs.md).

## See also

- [IoT Edge documentation](https://docs.microsoft.com/azure/iot-edge/)
- [FAQ: Live Video Analytics](faqs.md)

## Next steps

- To set up **Cloud ingest**, follow [Tutorial: Manage Media Graphs in the Cloud for an RTSP ingest](media-graph-cloud-tutorial.md)
- To set up **Edge ingest**, follow [How-to: Initial setup for Live Video Analytics on IoT Edge](edge-setup.md)
