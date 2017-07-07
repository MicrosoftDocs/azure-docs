---
title: Protect your content with Azure Media Services | Microsoft Docs
description: This articles give an overview of content protection with Media Services.
services: media-services
documentationcenter: ''
author: Juliako
manager: erikre
editor: ''

ms.assetid: 81bc00e1-dcda-4d69-b9ab-8768b793422b
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/29/2017
ms.author: juliako

---
# Protecting content overview
Microsoft Azure Media Services enables you to secure your media from the time it leaves your computer through storage, processing, and delivery. Media Services allows you to deliver your live and on-demand content encrypted dynamically with Advanced Encryption Standard (AES) (using 128-bit encryption keys) or any of the major DRMs: Microsoft PlayReady, Google Widevine, and Apple FairPlay. Media Services also provides a service for delivering AES keys and DRM (PlayReady, Widevine, and FairPlay) licenses to authorized clients. 

The following image demonstrates the content protection workflows that AMS supports. 

![Protect with PlayReady](./media/media-services-content-protection-overview/media-services-content-protection-with-multi-drm.png)

>[!NOTE]
>When your AMS account is created a **default** streaming endpoint is added to your account in the **Stopped** state. To start streaming your content and take advantage of dynamic packaging and dynamic encryption, the streaming endpoint from which you want to stream content has to be in the **Running** state. 

This topic explains [concepts and terminology](media-services-content-protection-overview.md) relevant to understanding content protection with AMS. The topic also contains [links](media-services-content-protection-overview.md#common-scenarios) to topics that show how to achieve content protection tasks. 

## Dynamic encryption
Microsoft Azure Media Services enables you to deliver your content encrypted  dynamically with AES clear key or DRM encryption: Microsoft PlayReady, Google Widevine, and Apple FairPlay.

Currently, you can encrypt the following streaming formats: HLS, MPEG DASH, and Smooth Streaming. You cannot encrypt progressive downloads.

If you want for Media Services to encrypt an asset, you need to associate an encryption key (CommonEncryption or EnvelopeEncryption) with your asset and also configure authorization policies for the key.

You also need to configure the asset's delivery policy. If you want to stream a storage encrypted asset, make sure to specify how you want to deliver it by configuring asset delivery policy.

When a stream is requested by a player, Media Services uses the specified key to dynamically encrypt your content using AES clear key or DRM encryption. To decrypt the stream, the player will request the key from the key delivery service. To decide whether or not the user is authorized to get the key, the service evaluates the authorization policies that you specified for the key.


## Storage encryption
Use storage encryption to encrypt your clear content locally using AES 256 bit encryption and then upload it to Azure Storage where it is stored encrypted at rest. Assets protected with storage encryption are automatically unencrypted and placed in an encrypted file system prior to encoding, and optionally re-encrypted prior to uploading back as a new output asset. The primary use case for storage encryption is when you want to secure your high quality input media files with strong encryption at rest on disk.

In order to deliver a storage encrypted asset, you must configure the asset’s delivery policy so Media Services knows how you want to deliver your content. Before your asset can be streamed, the streaming server removes the storage encryption and streams your content using the specified delivery policy (for example, AES, common encryption, or no encryption).

## Common encryption (CENC)
Common encryption is used when encrypting your content with PlayReady or/and Widewine.

## Using cbcs-aapl encryption
Cbcs-aapl is used when encrypting your content with FairPlay.

## Envelope encryption
Use this option if you want to protect your content with AES-128 clear key. If you want a more secure option, choose one of the DRMs listed in this topic. 

## Licenses and keys delivery service
Media Services provides a service for delivering DRM (PlayReady, Widevine, FairPlay) licenses and AES clear keys to authorized clients. You can use [the Azure portal](media-services-portal-protect-content.md), REST API, or Media Services SDK for .NET to configure authorization and authentication policies for your licenses and keys.

## Token restriction
The content key authorization policy could have one or more authorization restrictions: open or token restriction. The token restricted policy must be accompanied by a token issued by a Secure Token Service (STS). Media Services supports tokens in the Simple Web Tokens (SWT) format and JSON Web Token (JWT) format. Media Services does not provide Secure Token Services. You can create a custom STS or leverage Microsoft Azure ACS to issue tokens. The STS must be configured to create a token signed with the specified key and issue claims that you specified in the token restriction configuration. The Media Services key delivery service will return the requested key (or license) to the client if the token is valid and the claims in the token match those configured for the key (or license).

When configuring the token restricted policy, you must specify the primary verification key, issuer and audience parameters. The primary verification key contains the key that the token was signed with, issuer is the secure token service that issues the token. The audience (sometimes called scope) describes the intent of the token or the resource the token authorizes access to. The Media Services key delivery service validates that these values in the token match the values in the template.

## Streaming URLs
If your asset was encrypted with more than one DRM, you should use an encryption tag in the streaming URL: (format='m3u8-aapl', encryption='xxx').

The following considerations apply:

* Only zero or one encryption type can be specified.
* Encryption type doesn't have to be specified in the url if only one encryption was applied to the asset.
* Encryption type is case insensitive.
* The following encryption types can be specified:  
  * **cenc**:  Common encryption (Playready or Widevine)
  * **cbcs-aapl**: Fairplay
  * **cbc**: AES envelope encryption.

## Common scenarios
The following topics demonstrate how to protect content in storage, deliver dynamically encrypted streaming media, use AMS key/license delivery service

* [Protect with AES](media-services-protect-with-aes128.md) 
* [Protect with PlayReady and/or Widevine ](media-services-protect-with-drm.md)
* [Stream your HLS content Protected with Apple FairPlay and/or PlayReady](media-services-protect-hls-with-fairplay.md)

### Additional scenarios
* [How to integrate Azure PlayReady License service with your own encryptor/streaming server](http://mingfeiy.com/integrate-azure-playready-license-service-encryptorstreaming-server).
* [Using castLabs to deliver DRM licenses to Azure Media Services](media-services-castlabs-integration.md)

>[!NOTE]
>A scenario in which you use an external DRM server(technology) and stream from AMS is currently not supported.


## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

## Related Links
[Announcing PlayReady as a service and AES dynamic encryption with Azure Media Services](http://mingfeiy.com/playready)

[Azure Media Services PlayReady license delivery pricing explained](http://mingfeiy.com/playready-pricing-explained-in-azure-media-services)

[How to debug for AES encrypted stream in Azure Media Services](http://mingfeiy.com/debug-aes-encrypted-stream-azure-media-services)

[JWT token authenitcation](http://www.gtrifonov.com/2015/01/03/jwt-token-authentication-in-azure-media-services-and-dynamic-encryption/)

[Integrate Azure Media Services OWIN MVC based app with Azure Active Directory and restrict content key delivery based on JWT claims](http://www.gtrifonov.com/2015/01/24/mvc-owin-azure-media-services-ad-integration/).

[Use Azure ACS to issue tokens](http://mingfeiy.com/acs-with-key-services).

[content-protection]: ./media/media-services-content-protection-overview/media-services-content-protection.png
