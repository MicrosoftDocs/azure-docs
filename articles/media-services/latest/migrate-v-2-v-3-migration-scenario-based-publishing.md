---
title: Packaging and delivery migration guidance
description: This article is gives you scenario based guidance for packaging and delivery that will assist you in migrating from Azure Media Services v2 to v3.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: conceptual
ms.workload: media
ms.date: 03/25/2021
ms.author: inhenkel
---

# Packaging and delivery scenario-based migration guidance

![migration guide logo](./media/migration-guide/azure-media-services-logo-migration-guide.svg)

<hr color="#5ea0ef" size="10">

![migration steps 2](./media/migration-guide/steps-4.svg)

This article gives you scenario-based guidance for packaging and delivery that will assist you in migrating from Azure Media Services v2 to v3.

Major changes to the way content is published in v3 API. The new publishing model is simplified and uses fewer entities to create a Streaming Locator. The API reduced down to just two entities vs. the four entities previously required. Content Key Policies and Streaming Locators now replace the need for `ContentKeyAuthoriationPolicy`, `AssetDeliveyPolicy`, `ContentKey`, and `AccessPolicy`.

## Packaging and delivery in v3

1. Create [Content Key Policies](drm-content-key-policy-concept.md).
1. Create [Streaming Locators](stream-streaming-locators-concept.md).
1. Get the [Streaming paths](create-streaming-locator-build-url.md) 
    1. Configure it for a [DASH](encode-dynamic-packaging-concept.md#mpeg-dash-protocol) or [HLS](encode-dynamic-packaging-concept.md#hls-protocol) player.

See publishing concepts, tutorials and how to guides below for specific steps.

## Publishing concepts, tutorials and how to guides

### Concepts

- [Dynamic packaging in Media Services v3](encode-dynamic-packaging-concept.md)
- [Filters](filters-concept.md)
- [Filter your manifests using Dynamic Packager](filters-dynamic-manifest-concept.md)
- [Streaming Endpoints (Origin) in Azure Media Services](stream-streaming-endpoint-concept.md)
- [Stream content with CDN integration](stream-scale-streaming-cdn-concept.md)
- [Streaming Locators](stream-streaming-locators-concept.md)

### How to guides

- [Manage streaming endpoints with Media Services v3](stream-manage-streaming-endpoints-how-to.md)
- [CLI example: Publish an asset](cli-publish-asset.md)
- [Create a streaming locator and build URLs](create-streaming-locator-build-url.md)
- [Download the results of a job](job-download-results-how-to.md)
- [Signal descriptive audio tracks](signal-descriptive-audio-howto.md)
- [Azure Media Player full setup](../azure-media-player/azure-media-player-full-setup.md)
- [How to use the Video.js player with Azure Media Services](player-how-to-video-js-player.md)
- [How to use the Shaka player with Azure Media Services](player-shaka-player-how-to.md)

## Samples

You can also [compare the V2 and V3 code in the code samples](migrate-v-2-v-3-migration-samples.md).
