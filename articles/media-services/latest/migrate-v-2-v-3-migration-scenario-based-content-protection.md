---
title: Content protection migration guidance
description: This article is gives you content protection scenario based guidance that will assist you min migrating from Azure Media Services v2 to v3.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: conceptual
ms.workload: media
ms.date: 03/25/2021
ms.author: inhenkel
---

# Content protection scenario-based migration guidance

![migration guide logo](./media/migration-guide/azure-media-services-logo-migration-guide.svg)

<hr color="#5ea0ef" size="10">

![migration steps 2](./media/migration-guide/steps-4.svg)

This article is gives you content protection scenario based guidance that will assist you min migrating from Azure Media Services v2 to v3.

## Protect content in v3 API

Use the support for [Multi-key](design-multi-drm-system-with-access-control.md) features in the new v3 API.

See content protection concepts, tutorials and how to guides below for specific steps.

## Content protection concepts, tutorials and how to guides

### Concepts

- [Protect your content with Media Services dynamic encryption](content-protection-overview.md)
- [Design of a multi-DRM content protection system with access control](design-multi-drm-system-with-access-control.md)
- [Media Services v3 with PlayReady license template](playready-license-template-overview.md)
- [Media Services v3 with Widevine license template overview](widevine-license-template-overview.md)
- [Apple FairPlay license requirements and configuration](fairplay-license-overview.md)
- [Streaming Policies](streaming-policy-concept.md)
- [Content Key Policies](content-key-policy-concept.md)

### Tutorials

[Quickstart: Use portal to encrypt content](encrypt-content-quickstart.md)

### How to guides

- [Get a signing key from the existing policy](get-content-key-policy-dotnet-howto.md)
- [Offline FairPlay Streaming for iOS with Media Services v3](offline-fairplay-for-ios.md)
- [Offline Widevine streaming for Android with Media Services v3](offline-widevine-for-android.md)
- [Offline PlayReady Streaming for Windows 10 with Media Services v3](offline-plaready-streaming-for-windows-10.md)

## Samples

You can also [compare the V2 and V3 code in the code samples](migrate-v-2-v-3-migration-samples.md).
