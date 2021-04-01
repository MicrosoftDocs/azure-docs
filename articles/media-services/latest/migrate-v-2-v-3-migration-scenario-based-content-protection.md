---
title: Content protection migration guidance
description: This article gives your content protection scenario-based guidance that will assist you in your  migrating from Azure Media Services v2 to v3.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: conceptual
ms.workload: media
ms.date: 03/26/2021
ms.author: inhenkel
---

# Content protection scenario-based migration guidance

![migration guide logo](./media/migration-guide/azure-media-services-logo-migration-guide.svg)

<hr color="#5ea0ef" size="10">

![migration steps 2](./media/migration-guide/steps-4.svg)

This article provides you with details and guidance on the migration of content protection use cases from the v2 API to the new Azure Media Services v3 API.

## Protect content in v3 API

Use the support for [Multi-key](architecture-design-multi-drm-system.md) features in the new v3 API.

See content protection concepts, tutorials and how to guides below for specific steps.

## Visibility of v2 Assets, StreamingLocators, and properties in the v3 API for content protection scenarios

During migration to the v3 API, you will find that you need to access some properties or content keys from your v2 Assets. One key difference is that the v2 API would use the **AssetId** as the primary identification key and the new v3 API uses the Azure Resource Management name of the entity as the primary identifier.  The v2 **Asset.Name** property is not typically used as a unique identifier, so when migrating to v3 you will find that your v2 Asset names now appear in the **Asset.Description** field.

For example, if you previously had a v2 Asset with the ID of **"nb:cid:UUID:8cb39104-122c-496e-9ac5-7f9e2c2547b8"**, then you will find when listing the old v2 assets through the v3 API, the name will now be the GUID part at the end (in this case, **"8cb39104-122c-496e-9ac5-7f9e2c2547b8"**.)

You can query the **StreamingLocators** associated with the Assets created in the v2 API using the new v3 method [ListStreamingLocators](https://docs.microsoft.com/rest/api/media/assets/liststreaminglocators) on the Asset entity.  Also reference the .NET client SDK version of [ListStreamingLocatorsAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.assetsoperationsextensions.liststreaminglocatorsasync?view=azure-dotnet&preserve-view=true)

The results of the **ListStreamingLocators** method will provide you the **Name** and **StreamingLocatorId** of the locator along with the **StreamingPolicyName**.

To find the **ContentKeys** used in your **StreamingLocators** for content protection, you can call the [StreamingLocator.ListContentKeysAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.streaminglocatorsoperationsextensions.listcontentkeysasync?view=azure-dotnet&preserve-view=true) method.  

Any **Assets** that were created and published using the v2 API will have both a [Content Key Policy](https://docs.microsoft.com/azure/media-services/latest/drm-content-key-policy-concept) and a Content Key defined on them in the v3 API, instead of using a default content key policy on the [Streaming Policy](https://docs.microsoft.com/azure/media-services/latest/streaming-policy-concept).

For more information on content protection in the v3 API, see the article [Protect your content with Media Services dynamic encryption.](https://docs.microsoft.com/azure/media-services/latest/drm-content-protection-concept)

## How to list your v2 Assets and content protection settings using the v3 API

In the v2 API, you would commonly use **Assets**, **StreamingLocators**, and **ContentKeys** to protect your streaming content.
When migrating to the v3 API, your v2 API Assets, StreamingLocators, and ContentKeys are all exposed automatically in the v3 API and all of the data on them is available for you to access.

## Can I update v2 properties using the v3 API?

No, you cannot update any properties on v2 entities through the v3 API that were created using StreamingLocators, StreamingPolicies, Content Key Policies, and Content Keys in v2.
If you need to update, change or alter content stored on v2 entities, you will need to update it via the v2 API or create new v3 API entities to migrate them forward.

## How do I change the ContentKeyPolicy used for a v2 Asset that is published and keep the same content key?

In this situation, you should first unpublish (remove all Streaming Locators) on the Asset via the v2 SDK (delete the locator, unlink the Content Key Authorization Policy, unlink the Asset Delivery Policy, unlink the Content Key, delete the Content Key) then create a new **[StreamingLocator](https://docs.microsoft.com/azure/media-services/latest/streaming-locators-concept)** in v3 using a v3 [StreamingPolicy](https://docs.microsoft.com/azure/media-services/latest/streaming-policy-concept) and [ContentKeyPolicy](https://docs.microsoft.com/azure/media-services/latest/drm-content-key-policy-concept).

You would need to specify the specific content key identifier and key value needed when you are creating the **[StreamingLocator](https://docs.microsoft.com/azure/media-services/latest/streaming-locators-concept)**.

Note that it is possible to delete the v2 locator using the v3 API, but this will not remove the content key or the content key policy used if they were created in the v2 API.  

## Using AMSE v2 and AMSE v3 side by side

When migrating your content from v2 to v3, it is advised to install the [v2 Azure Media Services Explorer tool](https://github.com/Azure/Azure-Media-Services-Explorer/releases/tag/v4.3.15.0) along with the [v3 Azure Media Services Explorer tool](https://github.com/Azure/Azure-Media-Services-Explorer) to help compare the data that they show side by side for an Asset that is created and published via v2 APIs. The properties should all be visible, but in slightly different locations now.  


## Content protection concepts, tutorials and how to guides

### Concepts

- [Protect your content with Media Services dynamic encryption](drm-content-protection-concept.md)
- [Design of a multi-DRM content protection system with access control](architecture-design-multi-drm-system.md)
- [Media Services v3 with PlayReady license template](drm-playready-license-template-concept.md)
- [Media Services v3 with Widevine license template overview](drm-widevine-license-template-concept.md)
- [Apple FairPlay license requirements and configuration](drm-fairplay-license-overview.md)
- [Streaming Policies](streaming-policy-concept.md)
- [Content Key Policies](drm-content-key-policy-concept.md)

### Tutorials

[Quickstart: Use portal to encrypt content](drm-encrypt-content-how-to.md)

### How to guides

- [Get a signing key from the existing policy](drm-get-content-key-policy-dotnet-how-to.md)
- [Offline FairPlay Streaming for iOS with Media Services v3](drm-offline-fairplay-for-ios-concept.md)
- [Offline Widevine streaming for Android with Media Services v3](drm-offline-widevine-for-android.md)
- [Offline PlayReady Streaming for Windows 10 with Media Services v3](drm-offline-playready-streaming-for-windows-10.md)

## Samples

You can also [compare the V2 and V3 code in the code samples](migrate-v-2-v-3-migration-samples.md).

## Tools

- [v3 Azure Media Services Explorer tool](https://github.com/Azure/Azure-Media-Services-Explorer)
- [v2 Azure Media Services Explorer tool](https://github.com/Azure/Azure-Media-Services-Explorer/releases/tag/v4.3.15.0)
