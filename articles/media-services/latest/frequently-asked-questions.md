---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Azure Media Services v3 frequently asked questions| Microsoft Docs
description: This article gives answers to Azure Media Services v3 frequently asked questions.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 06/21/2019
ms.author: juliako
---

# Media Services v3 frequently asked questions

This article gives answers to Azure Media Services (AMS) v3 frequently asked questions.

## General

### What Azure roles can perform actions on Azure Media Services resources? 

See [Role-based access control (RBAC) for Media Services accounts](rbac-overview.md).

### How do I configure Media Reserved Units?

For the Audio Analysis and Video Analysis Jobs that are triggered by Media Services v3 or Video Indexer, it is highly recommended to provision your account with 10 S3 MRUs. If you need more than 10 S3 MRUs, open a support ticket using the [Azure portal](https://portal.azure.com/).

For details, see [Scale media processing with CLI](media-reserved-units-cli-how-to.md).

### What is the recommended method to process videos?

Use [Transforms](https://docs.microsoft.com/rest/api/media/transforms) to configure common tasks for encoding or analyzing videos. Each **Transform** describes a recipe, or a workflow of tasks for processing your video or audio files. A [Job](https://docs.microsoft.com/rest/api/media/jobs) is the actual request to Media Services to apply the **Transform** to a given input video or audio content. Once the Transform has been created, you can submit jobs using Media Services APIs, or any of the published SDKs. For more information, see [Transforms and Jobs](transforms-jobs-concept.md).

### How does pagination work?

When using pagination, you should always use the next link to enumerate the collection and not depend on a particular page size. For details and examples, see [Filtering, ordering, paging](entities-overview.md).

### What features are not yet available in Azure Media Services v3?

For details, see [feature gaps with respect to v2 APIs](migrate-from-v2-to-v3.md#feature-gaps-with-respect-to-v2-apis).

### What is the process of moving a Media Services account between subscriptions?  

For details, see [Moving a Media Services account between subscriptions](media-services-account-concept.md).

## Live streaming 

###  How to insert breaks/videos and image slates during live stream?

Media Services v3 live encoding does not yet support inserting video or image slates during live stream. 

You can use a [live on-premises encoder](recommended-on-premises-live-encoders.md) to switch the source video. Many apps provide ability to switch sources, including Telestream Wirecast, Switcher Studio (on iOS), OBS Studio (free app), and many more.

## Content protection

### Should I use an AES-128 clear key encryption or a DRM system?

Customers often wonder whether they should use AES encryption or a DRM system. The primary difference between the two systems is that with AES encryption the content key is transmitted to the client over TLS so that the key is encrypted in transit but without any additional encryption ("in the clear"). As a result, the key used to decrypt the content is accessible to the client player and can be viewed in a network trace on the client in plain text. An AES-128 clear key encryption is suitable for use cases where the viewer is a trusted party (for example, encrypting corporate videos distributed within a company to be viewed by employees).

DRM systems like PlayReady, Widevine, and FairPlay all provide an additional level of encryption on the key used to decrypt the content compared to an AES-128 clear key. The content key is encrypted to a key protected by the DRM runtime in additional to any transport level encryption provided by TLS. Additionally, decryption is handled in a secure environment at the operating system level, where it's more difficult for a malicious user to attack. DRM is recommended for use cases where the viewer might not be a trusted party and you require the highest level of security.

### How and where to get JWT token before using it to request license or key?

1. For production, you need to have a Secure Token Services (STS) (web service) which issues JWT token upon an HTTPS request. For test, you could use the code shown in **GetTokenAsync** method defined in [Program.cs](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/EncryptWithDRM/Program.cs).
2. Player will need to make a request, after a user is authenticated, to the STS for such a token and assign it as the value of the token. You can use the [Azure Media Player API](https://amp.azure.net/libs/amp/latest/docs/).

* For an example of running STS, with either symmetric and asymmetric key, please see [https://aka.ms/jwt](https://aka.ms/jwt). 
* For an example of a player based on Azure Media Player using such JWT token, see [https://aka.ms/amtest](https://aka.ms/amtest) (expand "player_settings" link to see the token input).

### How do you authorize requests to stream videos with AES encryption?

The correct approach is to leverage STS (Secure Token Service):

In STS, depending on user profile, add different claims (such as "Premium User", "Basic User", "Free Trial User"). With different claims in a JWT, the user can see different contents. Of course, for different content/asset, the ContentKeyPolicyRestriction will have the corresponding RequiredClaims.

Use Azure Media Services APIs for configuring license/key delivery and encrypting your assets (as shown in [this sample](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/EncryptWithAES/Program.cs)).

For more information, see:

- [Content protection overview](content-protection-overview.md)
- [Design of a multi-DRM content protection system with access control](design-multi-drm-system-with-access-control.md)

### HTTP or HTTPS?
The ASP.NET MVC player application must support the following:

* User authentication through Azure AD, which is under HTTPS.
* JWT exchange between the client and Azure AD, which is under HTTPS.
* DRM license acquisition by the client, which must be under HTTPS if license delivery is provided by Media Services. The PlayReady product suite doesn't mandate HTTPS for license delivery. If your PlayReady license server is outside Media Services, you can use either HTTP or HTTPS.

The ASP.NET player application uses HTTPS as a best practice, so Media Player is on a page under HTTPS. However, HTTP is preferred for streaming, so you need to consider the issue of mixed content.

* The browser doesn't allow mixed content. But plug-ins like Silverlight and the OSMF plug-in for smooth and DASH do allow it. Mixed content is a security concern because of the threat of the ability to inject malicious JavaScript, which can cause customer data to be at risk. Browsers block this capability by default. The only way to work around it is on the server (origin) side by allowing all domains (regardless of HTTPS or HTTP). This is probably not a good idea either.
* Avoid mixed content. Both the player application and Media Player should use HTTP or HTTPS. When playing mixed content, the silverlightSS tech requires clearing a mixed-content warning. The flashSS tech handles mixed content without a mixed-content warning.
* If your streaming endpoint was created before August 2014, it won't support HTTPS. In this case, create and use a new streaming endpoint for HTTPS.

### What about live streaming?

You can use exactly the same design and implementation to protect live streaming in Media Services by treating the asset associated with a program as a VOD asset. To provide a multi-DRM protection of the live content, apply the same setup/processing to the Asset as if it were a VOD asset before you associate the Asset with the Live Output.

### What about license servers outside Media Services?

Often, customers invested in a license server farm either in their own data center or one hosted by DRM service providers. With Media Services content protection, you can operate in hybrid mode. Contents can be hosted and dynamically protected in Media Services, while DRM licenses are delivered by servers outside Media Services. In this case, consider the following changes:

* STS needs to issue tokens that are acceptable and can be verified by the license server farm. For example, the Widevine license servers provided by Axinom require a specific JWT that contains an entitlement message. Therefore, you need to have an STS to issue such a JWT. 
* You no longer need to configure license delivery service in Media Services. You need to provide the license acquisition URLs (for PlayReady, Widevine, and FairPlay) when you configure ContentKeyPolicies.

## Media Services v2 vs v3 

### Can I use the Azure portal to manage v3 resources?

Currently, you cannot use the Azure portal to manage v3 resources. Use the [REST API](https://aka.ms/ams-v3-rest-ref), [CLI](https://aka.ms/ams-v3-cli-ref), or one of the supported [SDKs](media-services-apis-overview.md#sdks).

### Is there an AssetFile concept in v3?

The AssetFiles were removed from the AMS API in order to separate Media Services from Storage SDK dependency. Now Storage, not Media Services, keeps the information that belongs in Storage. 

For more information, see [Migrate to Media Services v3](migrate-from-v2-to-v3.md).

### Where did client-side storage encryption go?

It is now recommended to use the server-side storage encryption (which is on by default). For more information, see [Azure Storage Service Encryption for Data at Rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption).

## Next steps

[Media Services v3 overview](media-services-overview.md)
