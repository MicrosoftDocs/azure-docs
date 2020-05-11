---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Content Key Policies in Media Services - Azure | Microsoft Docs
description: This article gives an explanation of what Content Key Policies are, and how they are used by Azure Media Services.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 07/26/2019
ms.author: juliako
ms.custom: seodec18

---

# Content Key Policies

With Media Services, you can deliver your live and on-demand content encrypted dynamically with Advanced Encryption Standard (AES-128) or any of the three major digital rights management (DRM) systems: Microsoft PlayReady, Google Widevine, and Apple FairPlay. Media Services also provides a service for delivering AES keys and DRM (PlayReady, Widevine, and FairPlay) licenses to authorized clients. 

To specify encryption options on your stream, you need to create a [Streaming Policy](streaming-policy-concept.md) and associate it with your [Streaming Locator](streaming-locators-concept.md). You create the [Content Key Policy](https://docs.microsoft.com/rest/api/media/contentkeypolicies) to configure how the content key (that provides secure access to your [Assets](assets-concept.md)) is delivered to end clients. You need to set the requirements (restrictions) on the Content Key Policy that must be met in order for keys with the specified configuration to be delivered to clients. The content key policy is not needed for clear streaming or downloading. 

Usually, you associate your content key policy with your [Streaming Locator](streaming-locators-concept.md). Alternatively, you can specify the content key policy inside a [Streaming Policy](streaming-policy-concept.md) (when creating a custom streaming policy for advanced scenarios). 

## Best practices and considerations

> [!IMPORTANT]
> Please review the following recommendations.

* You should design a limited set of policies for your Media Service account and reuse them for your streaming locators whenever the same options are needed. For more information, see [Quotas and limits](limits-quotas-constraints.md).
* Content key policies are updatable. It can take up to 15 minutes for the key delivery caches to update and pick up the updated policy. 

   By updating the policy, you are overwriting your existing CDN cache which could cause playback issue for customers that are using cached content.  
* We recommend that you do not create a new content key policy for each asset. The main benefits of sharing the same content key policy between assets that need the same policy options are:
   
   * It is easier to manage a small number of policies.
   * If you need to make updates to the content key policy, the changes go into effect on all new license requests almost right away.
* If you do need to create a new policy, you have to create a new streaming locator for the asset.
* It is recommended to let Media Services autogenerate the content key. 

   Typically, you would use a long-lived key and check for the existence of the content key policy with [Get](https://docs.microsoft.com/rest/api/media/contentkeypolicies/get). To get the key, you need to call a separate action method to get secrets or credentials, see the example that follows.

## Example

To get to the key, use `GetPolicyPropertiesWithSecretsAsync`, as shown in the [Get a signing key from the existing policy](get-content-key-policy-dotnet-howto.md#get-contentkeypolicy-with-secrets) example.

## Filtering, ordering, paging

See [Filtering, ordering, paging of Media Services entities](entities-overview.md).

## Additional notes

* Properties of the Content Key Policies that are of the `Datetime` type are always in UTC format.
* Widevine is a service provided by Google Inc. and subject to the terms of service and Privacy Policy of Google, Inc.

## Next steps

* [Use AES-128 dynamic encryption and the key delivery service](protect-with-aes128.md)
* [Use DRM dynamic encryption and license delivery service](protect-with-drm.md)
* [EncodeHTTPAndPublishAESEncrypted](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/tree/master/NETCore/EncodeHTTPAndPublishAESEncrypted)
