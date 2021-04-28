---
title: Content protection migration guidance
description: This article gives your content protection scenario-based guidance that will assist you in your  migrating from Azure Media Services v2 to v3.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: conceptual
ms.workload: media
ms.date: 04/05/2021
ms.author: inhenkel
---

# Content protection scenario-based migration guidance

![migration guide logo](./media/migration-guide/azure-media-services-logo-migration-guide.svg)

<hr color="#5ea0ef" size="10">

![migration steps 2](./media/migration-guide/steps-4.svg)

This article provides you with details and guidance on the migration of content protection use cases from the v2 API to the new Azure Media Services v3 API.

## Protect content in v3 API

Use the support for [Multi-key](architecture-design-multi-drm-system.md) features in the new v3 API.

See content protection concepts, tutorials and how to guides at the end of this article for specific steps.

> [!NOTE]
> The rest of this article discusses how you can migrate your v2 content protection to v3 with .NET.  If you need instructions or sample code for a different language or method, please create a GitHub issue for this page.

## v3 visibility of v2 Assets, StreamingLocators, and properties

In the v2 API, `Assets`, `StreamingLocators`, and `ContentKeys` were used to protect your streaming content. When migrating to the v3 API, your v2 API `Assets`, `StreamingLocators`, and `ContentKeys` are all exposed automatically in the v3 API and all of the data on them is available for you to access.

However, you cannot *update* any properties on v2 entities through the v3 API that were created in v2.

If you need to update, change or alter content stored on v2 entities, update them with the v2 API or create new v3 API entities to migrate them.

## Asset identifier differences

To migrate, you'll need to access properties or content keys from your v2 Assets.  It's important to understand that the v2 API uses the `AssetId` as the primary identification key but the new v3 API uses the *Azure Resource Management name* of the entity as the primary identifier.  (The v2 `Asset.Name` property is not used as a unique identifier.) With the v3 API, your v2 Asset name now appears as the `Asset.Description`.

For example, if you previously had a v2 Asset with the ID of `nb:cid:UUID:8cb39104-122c-496e-9ac5-7f9e2c2547b8`, the identifier is now at the end of the GUID `8cb39104-122c-496e-9ac5-7f9e2c2547b8`. You'll see this when listing your v2 assets through the v3 API.

Any Assets that were created and published using the v2 API will have both a `ContentKeyPolicy` and a `ContentKey` in the v3 API instead of a default content key policy on the `StreamingPolicy`.

For more information, see the [Content key policy](./drm-content-key-policy-concept.md) documentation and the [Streaming Policy](./stream-streaming-policy-concept.md) documentation.

## Use Azure Media Services Explorer (AMSE) v2 and AMSE v3 tools side by side

Use the [v2 Azure Media Services Explorer tool](https://github.com/Azure/Azure-Media-Services-Explorer/releases/tag/v4.3.15.0) along with the [v3 Azure Media Services Explorer tool](https://github.com/Azure/Azure-Media-Services-Explorer) to compare the data side by side for an Asset created and published via v2 APIs. The properties should all be visible, but in different locations.

## Use the .NET content protection migration sample

You can find a code sample to compare the differences in Asset identifiers using the [v2tov3MigrationSample](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/ContentProtection/v2tov3Migration) under ContentProtection in the Media Services code samples.

## List the Streaming Locators

You can query the `StreamingLocators` associated with the Assets created in the v2 API using the new v3 method [ListStreamingLocators](/rest/api/media/assets/liststreaminglocators) on the Asset entity.  Also reference the .NET client SDK version of [ListStreamingLocatorsAsync](/dotnet/api/microsoft.azure.management.media.assetsoperationsextensions.liststreaminglocatorsasync?preserve-view=true&view=azure-dotnet)

The results of the `ListStreamingLocators` method will provide you the `Name` and `StreamingLocatorId` of the locator along with the `StreamingPolicyName`.

## Find the content keys

To find the `ContentKeys` used with your `StreamingLocators`, you can call the [StreamingLocator.ListContentKeysAsync](/dotnet/api/microsoft.azure.management.media.streaminglocatorsoperationsextensions.listcontentkeysasync?preserve-view=true&view=azure-dotnet) method.  

For more information on content protection in the v3 API, see the article [Protect your content with Media Services dynamic encryption.](./drm-content-protection-concept.md)

## Change the v2 ContentKeyPolicy keeping the same ContentKey

You should first unpublish (remove all Streaming Locators) on the Asset via the v2 SDK. Here's how:

1. Delete the locator.
1. Unlink the `ContentKeyAuthorizationPolicy`.
1. Unlink the `AssetDeliveryPolicy`.
1. Unlink the `ContentKey`.
1. Delete the `ContentKey`.
1. Create a new `StreamingLocator` in v3 using a v3 `StreamingPolicy` and `ContentKeyPolicy`, specifying the specific content key identifier and key value needed.

> [!NOTE]
> It is possible to delete the v2 locator using the v3 API, but this won't remove the content key or the content key policy if they were created in the v2 API.

## Content protection concepts, tutorials and how to guides

### Concepts

- [Protect your content with Media Services dynamic encryption](drm-content-protection-concept.md)
- [Design of a multi-DRM content protection system with access control](architecture-design-multi-drm-system.md)
- [Media Services v3 with PlayReady license template](drm-playready-license-template-concept.md)
- [Media Services v3 with Widevine license template overview](drm-widevine-license-template-concept.md)
- [Apple FairPlay license requirements and configuration](drm-fairplay-license-overview.md)
- [Streaming Policies](stream-streaming-policy-concept.md)
- [Content Key Policies](drm-content-key-policy-concept.md)

### Tutorials

[Quickstart: Use portal to encrypt content](drm-encrypt-content-how-to.md)

### How to guides

- [Get a signing key from the existing policy](drm-get-content-key-policy-dotnet-how-to.md)
- [Offline FairPlay Streaming for iOS with Media Services v3](drm-offline-fairplay-for-ios-concept.md)
- [Offline Widevine streaming for Android with Media Services v3](drm-offline-widevine-for-android.md)
- [Offline PlayReady Streaming for Windows 10 with Media Services v3](drm-offline-playready-streaming-for-windows-10.md)

## Samples

- [v2tov3MigrationSample](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/ContentProtection/v2tov3Migration)
- You can also [compare the V2 and V3 code in the code samples](migrate-v-2-v-3-migration-samples.md).

## Tools

- [v3 Azure Media Services Explorer tool](https://github.com/Azure/Azure-Media-Services-Explorer)
- [v2 Azure Media Services Explorer tool](https://github.com/Azure/Azure-Media-Services-Explorer/releases/tag/v4.3.15.0)