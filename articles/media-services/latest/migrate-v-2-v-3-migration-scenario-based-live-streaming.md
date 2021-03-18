---
title: Media Services live streaming migration guidance
description: This article is gives you live streaming scenario based guidance that will assist you min migrating from Azure Media Services v2 to v3.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.devlang: multiple
ms.topic: conceptual
ms.tgt_pltfrm: multiple
ms.workload: media
ms.date: 1/14/2020
ms.author: inhenkel
---

# Live streaming scenario-based migration guidance

![migration guide logo](./media/migration-guide/azure-media-services-logo-migration-guide.svg)

<hr color="#5ea0ef" size="10">

![migration steps 2](./media/migration-guide/steps-4.svg)

The Azure portal now supports live event set up and management.  You are encouraged to try it out while testing your V2 to V3 migration.

## Test the V3 live event workflow

> [!NOTE]
> Channels and Programs created with v2 (which are mapped to live events and live outputs in v3) be managed with the V3 api. The guidance is to switch over to V3 live events and live outputs at a convenient time when you can stop your existing V2 channel. There is currently no support for seamlessly migrating a continuously running 24x7 live channel to the new V3 live events. So, maintenance downtime needs to be coordinated at the best convenience for your audience and business.

Test the new way of delivering Live events with Media Services before moving your content from V2 to V3. Here are the V3 features to work with and consider for migration.

- Create a new v3 [Live Event](live-events-outputs-concept.md#live-events) for encoding. You can enable [1080P and 720P encoding presets](live-event-types-comparison.md#system-presets).
- Use the [Live Output](live-events-outputs-concept.md#live-outputs) entity instead of Programs
- Create [streaming locators](streaming-locators-concept.md).
- Consider your need for [HLS and DASH](dynamic-packaging-overview.md) live streaming.
- If you require fast-start of live events explore the new [Standby mode](live-events-outputs-concept.md#standby-mode) features.
- If you want to transcribe your live event while it is happening, explore the new [live transcription](live-transcription.md) feature.
- Create 24x7x365 live events in v3 if you need a longer streaming duration.
- Use [Event Grid](monitoring/monitor-events-portal-how-to.md) to monitor your live events.

See Live events concepts, tutorials and how to guides below for specific steps.

## Live events concepts, tutorials and how to guides

### Concepts

- [Live streaming with Azure Media Services v3](live-streaming-overview.md)
- [Live events and live outputs in Media Services](live-events-outputs-concept.md)
- [Verified on-premises live streaming encoders](recommended-on-premises-live-encoders.md)
- [Use time-shifting and Live Outputs to create on-demand video playback](live-event-cloud-dvr.md)
- [Live-transcription (preview)](live-transcription.md)
- [Live Event types comparison](live-event-types-comparison.md)
- [Live event states and billing](live-event-states-billing.md)
- [Live Event low latency settings](live-event-latency.md)
- [Media Services Live Event error codes](live-event-error-codes.md)

### Tutorials and quickstarts

- [Tutorial: Stream live with Media Services](stream-live-tutorial-with-api.md)
- [Create an Azure Media Services live stream with OBS](live-events-obs-quickstart.md)
- [Quickstart: Upload, encode, and stream content with portal](manage-assets-quickstart.md)
- [Quickstart: Create an Azure Media Services live stream with Wirecast](live-events-wirecast-quickstart.md)

## Samples

You can also [compare the V2 and V3 code in the code samples](migrate-v-2-v-3-migration-samples.md).

## Next steps

[!INCLUDE [migration guide next steps](./includes/migration-guide-next-steps.md)]
