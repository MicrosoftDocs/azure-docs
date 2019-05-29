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
ms.date: 05/22/2019
ms.author: juliako
ms.custom: seodec18

---

# Content Key Policies

With Media Services, you can deliver your live and on-demand content encrypted dynamically with Advanced Encryption Standard (AES-128) or any of the three major digital rights management (DRM) systems: Microsoft PlayReady, Google Widevine, and Apple FairPlay. Media Services also provides a service for delivering AES keys and DRM (PlayReady, Widevine, and FairPlay) licenses to authorized clients.

To specify encryption options on your stream, you need to create a [Streaming Policy](streaming-policy-concept.md) and associate it with your [Streaming Locator](streaming-locators-concept.md). You need to create a [Content Key Policy](https://docs.microsoft.com/rest/api/media/contentkeypolicies) to configure how the content key (that provides secure access to your [Assets](assets-concept.md)) is delivered to end clients. The **Content Key Policy** is also associated with your **Streaming Locator**. You need to set the requirements (restrictions) on the Content Key Policy that must be met in order for keys with the specified configuration to be delivered to clients. 

It is recommended to let Media Services to autogenerate content keys. Typically, you would use a long lived key and check for the policies existence with **Get**. To get the key, you need to call a separate action method to get secrets or credentials, see the example that follows.

**Content Key Policies** are updatable. For example, you might want to update the policy if you need to do a key rotation. You can update the primary verification key and the list of alternate verification keys in the existing policy. It can take up to 15 minutes for the Key Delivery caches to update and pick up the updated policy. 

> [!IMPORTANT]
> * Properties of **Content Key Policies** that are of the Datetime type are always in UTC format.
> * You should design a limited set of policies for your Media Service account and re-use them for your Streaming Locators whenever the same options are needed. For more information, see [Quotas and limitations](limits-quotas-constraints.md).

## Example

To get to the key, use **GetPolicyPropertiesWithSecretsAsync**, as shown in the example below.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithDRM/Program.cs#GetOrCreateContentKeyPolicy)]

## Filtering, ordering, paging

See [Filtering, ordering, paging of Media Services entities](entities-overview.md).

## Next steps

* [Use AES-128 dynamic encryption and the key delivery service](protect-with-aes128.md)
* [Use DRM dynamic encryption and license delivery service](protect-with-drm.md)
* [EncodeHTTPAndPublishAESEncrypted](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/tree/master/NETCore/EncodeHTTPAndPublishAESEncrypted)
