---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Overview of Live Video Analytics
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
# Overview of Live Video Analytics

## Live Video Analytics (LVA)

Azure Media Services: Live Video Analytics (code name) is a product that extends our current batch analytics capabilities ([Video Indexer](https://azure.microsoft.com/services/media-services/video-indexer/)) to support ingestion of live video streams, applying analytics, storing, and playback. This platform will connect to a variety of video devices including cell phones, IP cameras, drones, body-worn cameras, as well as previously recorded content. This platform will include edge, hybrid, and cloud topologies, support for 1st and 3rd party AI models and extensibility, and a management layer. Customers will be able to compose their workflow based on their scenarios across various industries like public safety, workplace safety, commercial security, business analytics.

LVA uses a new Media Services entity called **Media Graph** to deploy into different topologies. This entity is described in greater detail in  [Concept: Media Graph](media-graph-concept.md).

### Scenarios

The preview release of LVA will initially support two scenarios:

1. [Cloud ingestion](media-graph-cloud-tutorial.md) - Ingest from an RTSP camera directly into cloud storage
1. [Edge ingestion](edge-setup.md) - Ingest from an RTSP camera via an edge device (on the same network). You can configure ingest to be:
   1. [Ingest only](media-graph-edge-ingestion-tutorial.md) with optional local or cloud archive.
   1. [Ingest with motion detection](media-graph-edge-ingestion-motion-detection-tutorial.md) with optional local or cloud archive.

### Requirements

1. Azure Subscription
1. Camera that supports RTSP protocol (for example, IP surveillance camera)
   1. Cloud ingest requires the camera to have a public IP
   1. Edge ingest requires password-protected camera access
1. Edge ingest requires a Linux-based edge device (or virtualization) on the same network as the camera, with Ubuntu 16.04 LTS or 18.04 LTS.

### Limitations

Below is a list of currently limitations and configurations. For more information, see [Quota and limitations](faqs.md#quota-and-limitations) in the [Live Video Analytics FAQ](faqs.md).

- **Cloud**
  - RTSP source needs to be on a public IP address / not behind a firewall.
  - Currently, maximum of 24-hour archive
  - Max of 50 Media Graphs per Azure Media Services account
  - In this preview, cloud ingestion is only supported in the `eastus` region. Storage and Media Services account should be located in the same region. 
  - In this preview, we do not support security options, although, you can pass the `username` and `password` credentials.
- **Edge**
  - 20 edge modules max
  - One Media Graph per edge module
  - In this preview, there is no way to refresh the SAS URL; continuous archiving will write to this indefinitely (each clip/asset is an individual blob)

### Billing

During the preview, the media graph is not emitting any billing meters. As we reach public preview, we will be announcing the pricing model for both the cloud media graph and the edge.

There may be billing for other resources during preview including storage. For more information, see [Billing and availability](faqs.md#billing-and-availability) in the [Live Video Analytics FAQ](faqs.md).

## See also

- [FAQ: Live Video Analytics](faqs.md)
  
## Next steps

- Review [Concept: Media Graph](media-graph-concept.md) to learn more about the Media Graph entity.
