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
ms.date: 04/07/2020
ms.author: juliako
---

# Media Services v3 frequently asked questions

This article gives answers to Azure Media Services (AMS) v3 frequently asked questions.

## General

### What Azure roles can perform actions on Azure Media Services resources? 

See [Role-based access control (RBAC) for Media Services accounts](rbac-overview.md).

### How do you stream to Apple iOS devices?

Make sure you have "(format=m3u8-aapl)" at the end of your path (after the "/manifest" portion of the URL) to tell the streaming origin server to return back HLS content for consumption on Apple iOS native devices (for details, see [delivering content](dynamic-packaging-overview.md)).

### How do I configure Media Reserved Units?

For the Audio Analysis and Video Analysis Jobs that are triggered by Media Services v3 or Video Indexer, it is highly recommended to provision your account with 10 S3 MRUs. If you need more than 10 S3 MRUs, open a support ticket using the [Azure portal](https://portal.azure.com/).

For details, see [Scale media processing with CLI](media-reserved-units-cli-how-to.md).

### What is the recommended method to process videos?

Use [Transforms](https://docs.microsoft.com/rest/api/media/transforms) to configure common tasks for encoding or analyzing videos. Each **Transform** describes a recipe, or a workflow of tasks for processing your video or audio files. A [Job](https://docs.microsoft.com/rest/api/media/jobs) is the actual request to Media Services to apply the **Transform** to a given input video or audio content. Once the Transform has been created, you can submit jobs using Media Services APIs, or any of the published SDKs. For more information, see [Transforms and Jobs](transforms-jobs-concept.md).

### I uploaded, encoded, and published a video. What would be the reason the video does not play when I try to stream it?

One of the most common reasons is you do not have the streaming endpoint from which you are trying to play back in the Running state.

### How does pagination work?

When using pagination, you should always use the next link to enumerate the collection and not depend on a particular page size. For details and examples, see [Filtering, ordering, paging](entities-overview.md).

### What features are not yet available in Azure Media Services v3?

For details, see [feature gaps with respect to v2 APIs](media-services-v2-vs-v3.md#feature-gaps-with-respect-to-v2-apis).

### What is the process of moving a Media Services account between subscriptions?  

For details, see [Moving a Media Services account between subscriptions](media-services-account-concept.md).

## Live streaming 

### How to stop the live stream after the broadcast is done?

You can approach it from a client side or a server side.

#### Client side

Your web application should prompt the user if they want to end the broadcast if they are closing the browser. This is a browser event that your web application can handle.

#### Server side

You can monitor live events by subscribing to Event Grid events. For more information, see the [eventgrid event schema](media-services-event-schemas.md#live-event-types).

* You can either [subscribe](reacting-to-media-services-events.md) to the stream level [Microsoft.Media.LiveEventEncoderDisconnected](media-services-event-schemas.md#liveeventencoderdisconnected) and monitor that no reconnections come in for a while to stop and delete your live event.
* Or, you can [subscribe](reacting-to-media-services-events.md) to the track level [heartbeat](media-services-event-schemas.md#liveeventingestheartbeat) events. If all tracks have incoming bitrate dropping to 0; or the last timestamp is no longer increasing, then you can also safely shut down the live event. The heartbeat events come in at every 20 seconds for every track so it could be a little bit verbose.

###  How to insert breaks/videos and image slates during live stream?

Media Services v3 live encoding does not yet support inserting video or image slates during live stream. 

You can use a [live on-premises encoder](recommended-on-premises-live-encoders.md) to switch the source video. Many apps provide ability to switch sources, including Telestream Wirecast, Switcher Studio (on iOS), OBS Studio (free app), and many more.

## Content protection

### Should I use an AES-128 clear key encryption or a DRM system?

Customers often wonder whether they should use AES encryption or a DRM system. The primary difference between the two systems is that with AES encryption the content key is transmitted to the client over TLS so that the key is encrypted in transit but without any additional encryption ("in the clear"). As a result, the key used to decrypt the content is accessible to the client player and can be viewed in a network trace on the client in plain text. An AES-128 clear key encryption is suitable for use cases where the viewer is a trusted party (for example, encrypting corporate videos distributed within a company to be viewed by employees).

DRM systems like PlayReady, Widevine, and FairPlay all provide an additional level of encryption on the key used to decrypt the content compared to an AES-128 clear key. The content key is encrypted to a key protected by the DRM runtime in additional to any transport level encryption provided by TLS. Additionally, decryption is handled in a secure environment at the operating system level, where it's more difficult for a malicious user to attack. DRM is recommended for use cases where the viewer might not be a trusted party and you require the highest level of security.

### How to show a video only to users who have a specific permission, without using Azure AD?

You don't have to use any specific token provider (such as Azure AD). You can create your own [JWT](https://jwt.io/) provider (so-called STS, Secure Token Service), using asymmetric key encryption. In your custom STS, you can add claims based on your business logic.

Make sure the issuer, audience and claims all match up exactly between what is in JWT and the ContentKeyPolicyRestriction used in ContentKeyPolicy.

For more information, see [Protect your content by using Media Services dynamic encryption](content-protection-overview.md).

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

> [!NOTE]
> Widevine is a service provided by Google Inc. and subject to the terms of service and Privacy Policy of Google, Inc.

## Media Services v2 vs v3 

### Can I use the Azure portal to manage v3 resources?

Currently, you can use the [Azure portal](https://portal.azure.com/) to:

* manage Media Services v3 [Live Events](live-events-outputs-concept.md), 
* view (not manage) v3 [Assets](assets-concept.md), 
* [get info about accessing APIs](access-api-portal.md). 

For all other management tasks (for example, [Transforms and Jobs](transforms-jobs-concept.md) and [Content protection](content-protection-overview.md)), use the [REST API](https://docs.microsoft.com/rest/api/media/), [CLI](https://aka.ms/ams-v3-cli-ref), or one of the supported [SDKs](media-services-apis-overview.md#sdks).

### Is there an AssetFile concept in v3?

The AssetFiles were removed from the AMS API in order to separate Media Services from Storage SDK dependency. Now Storage, not Media Services, keeps the information that belongs in Storage. 

For more information, see [Migrate to Media Services v3](media-services-v2-vs-v3.md).

### Where did client-side storage encryption go?

It is now recommended to use the server-side storage encryption (which is on by default). For more information, see [Azure Storage Service Encryption for Data at Rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption).

## Offline streaming

### FairPlay Streaming for iOS

The following frequently asked questions provide assistance with troubleshooting offline FairPlay streaming for iOS:

#### Why does only audio play but not video during offline mode?

This behavior seems to be by design of the sample app. When an alternate audio track is present (which is the case for HLS) during offline mode, both iOS 10 and iOS 11 default to the alternate audio track. To compensate this behavior for FPS offline mode, remove the alternate audio track from the stream. To do this on Media Services, add the dynamic manifest filter "audio-only=false." In other words, an HLS URL ends with .ism/manifest(format=m3u8-aapl,audio-only=false). 

#### Why does it still play audio only without video during offline mode after I add audio-only=false?

Depending on the content delivery network (CDN) cache key design, the content might be cached. Purge the cache.

#### Is FPS offline mode also supported on iOS 11 in addition to iOS 10?

Yes. FPS offline mode is supported for iOS 10 and iOS 11.

#### Why can't I find the document "Offline Playback with FairPlay Streaming and HTTP Live Streaming" in the FPS Server SDK?

Since FPS Server SDK version 4, this document was merged into the "FairPlay Streaming Programming Guide."

#### What is the downloaded/offline file structure on iOS devices?

The downloaded file structure on an iOS device looks like the following screenshot. The `_keys` folder stores downloaded FPS licenses, with one store file for each license service host. The `.movpkg` folder stores audio and video content. The first folder with a name that ends with a dash followed by a numeric contains video content. The numeric value is the PeakBandwidth of the video renditions. The second folder with a name that ends with a dash followed by 0 contains audio content. The third folder named "Data" contains the master playlist of the FPS content. Finally, boot.xml provides a complete description of the `.movpkg` folder content. 

![Offline FairPlay iOS sample app file structure](media/offline-fairplay-for-ios/offline-fairplay-file-structure.png)

A sample boot.xml file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<HLSMoviePackage xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" xmlns="http://apple.com/IMG/Schemas/HLSMoviePackage" xsi:schemaLocation="http://apple.com/IMG/Schemas/HLSMoviePackage /System/Library/Schemas/HLSMoviePackage.xsd">
  <Version>1.0</Version>
  <HLSMoviePackageType>PersistedStore</HLSMoviePackageType>
  <Streams>
    <Stream ID="1-4DTFY3A3VDRCNZ53YZ3RJ2NPG2AJHNBD-0" Path="1-4DTFY3A3VDRCNZ53YZ3RJ2NPG2AJHNBD-0" NetworkURL="https://willzhanmswest.streaming.mediaservices.windows.net/e7c76dbb-8e38-44b3-be8c-5c78890c4bb4/MicrosoftElite01.ism/QualityLevels(127000)/Manifest(aac_eng_2_127,format=m3u8-aapl)">
      <Complete>YES</Complete>
    </Stream>
    <Stream ID="0-HC6H5GWC5IU62P4VHE7NWNGO2SZGPKUJ-310656" Path="0-HC6H5GWC5IU62P4VHE7NWNGO2SZGPKUJ-310656" NetworkURL="https://willzhanmswest.streaming.mediaservices.windows.net/e7c76dbb-8e38-44b3-be8c-5c78890c4bb4/MicrosoftElite01.ism/QualityLevels(161000)/Manifest(video,format=m3u8-aapl)">
      <Complete>YES</Complete>
    </Stream>
  </Streams>
  <MasterPlaylist>
    <NetworkURL>https://willzhanmswest.streaming.mediaservices.windows.net/e7c76dbb-8e38-44b3-be8c-5c78890c4bb4/MicrosoftElite01.ism/manifest(format=m3u8-aapl,audio-only=false)</NetworkURL>
  </MasterPlaylist>
  <DataItems Directory="Data">
    <DataItem>
      <ID>CB50F631-8227-477A-BCEC-365BBF12BCC0</ID>
      <Category>Playlist</Category>
      <Name>master.m3u8</Name>
      <DataPath>Playlist-master.m3u8-CB50F631-8227-477A-BCEC-365BBF12BCC0.data</DataPath>
      <Role>Master</Role>
    </DataItem>
  </DataItems>
</HLSMoviePackage>
```

### Widevine streaming for Android

#### How can I deliver persistent licenses (offline-enabled) for some clients/users and non-persistent licenses (offline-disabled) for others? Do I have to duplicate the content and use separate content key?

Since Media Services v3 allows an Asset to have multiple StreamingLocators. You can have

* One ContentKeyPolicy with license_type = "persistent", ContentKeyPolicyRestriction with claim on "persistent", and its StreamingLocator;
* Another ContentKeyPolicy with license_type="nonpersistent", ContentKeyPolicyRestriction with claim on "nonpersistent", and its StreamingLocator.
* The two StreamingLocators have different ContentKey.

Depending on business logic of custom STS, different claims are issued in the JWT token. With the token, only the corresponding license can be obtained and only the corresponding URL can be played.

#### What is the mapping between the Widevine and Media Services DRM security levels?

Google's "Widevine DRM Architecture Overview" defines three different security levels. However, in [Azure Media Services documentation on Widevine license template](widevine-license-template-overview.md),
five different security levels are outlined. This section explains how the security levels map.

The Google's "Widevine DRM Architecture Review" doc defines the following three security levels:

* Security Level 1: All content processing, cryptography, and control are performed within the Trusted Execution Environment (TEE). In some implementation models, security processing may be performed in different chips.
* Security Level 2: Performs cryptography (but not video processing) within the TEE: decrypted buffers are returned to the application domain and processed through separate video hardware or software. At level 2, however, cryptographic information is still processed only within the TEE.
* Security Level 3 Does not have a TEE on the device. Appropriate measures may be taken to protect the cryptographic information and decrypted content on host operating system. A Level 3 implementation may also include a hardware cryptographic engine, but that only enhances performance, not security.

At the same time, in [Azure Media Services documentation on Widevine license template](widevine-license-template-overview.md), the security_level property of content_key_specs can have the following five different values (client robustness requirements for playback):

* Software-based white-box crypto is required.
* Software crypto and an obfuscated decoder is required.
* The key material and crypto operations must be performed within a hardware backed TEE.
* The crypto and decoding of content must be performed within a hardware backed TEE.
* The crypto, decoding, and all handling of the media (compressed and uncompressed) must be handled within a hardware backed TEE.

Both security levels are defined by Google Widevine. The difference is in its usage level: architecture level or API level. The five security levels are used in the Widevine API. The content_key_specs object, which
contains security_level is deserialized and passed to the Widevine global delivery service by Azure Media Services Widevine license service. The table below shows the mapping between the two sets of security levels.

| **Security Levels Defined in Widevine Architecture** |**Security Levels Used in Widevine API**|
|---|---| 
| **Security Level 1**: All content processing, cryptography, and control are performed within the Trusted Execution Environment (TEE). In some implementation models, security processing may be performed in different chips.|**security_level=5**: The crypto, decoding, and all handling of the media (compressed and uncompressed) must be handled within a hardware backed TEE.<br/><br/>**security_level=4**: The crypto and decoding of content must be performed within a hardware backed TEE.|
**Security Level 2**: Performs cryptography (but not video processing) within the TEE: decrypted buffers are returned to the application domain and processed through separate video hardware or software. At level 2, however, cryptographic information is still processed only within the TEE.| **security_level=3**: The key material and crypto operations must be performed within a hardware backed TEE. |
| **Security Level 3**: Does not have a TEE on the device. Appropriate measures may be taken to protect the cryptographic information and decrypted content on host operating system. A Level 3 implementation may also include a hardware cryptographic engine, but that only enhances performance, not security. | **security_level=2**: Software crypto and an obfuscated decoder are required.<br/><br/>**security_level=1**: Software-based white-box crypto is required.|

#### Why does content download take so long?

There are two ways to improve download speed:

* Enable CDN so that end users are more likely to hit CDN instead of origin/streaming endpoint for content download. If user hits streaming endpoint, each HLS segment or DASH fragment is dynamically packaged and encrypted. Even though this latency is in millisecond scale for each segment/fragment, when you have an hour long video, the accumulated latency can be large causing longer download.
* Provide end users the option to selectively download video quality layers and audio tracks instead of all contents. For offline mode, there is no point to download all of the quality layers. There are two ways to achieve this:

   * Client controlled: either player app auto selects or user selects video  quality layer and audio tracks to download;
   * Service controlled: one can use Dynamic Manifest feature in Azure Media Services to create a (global) filter, which limits HLS playlist or DASH MPD to a single video quality layer and selected audio tracks. Then the download URL presented to end users will include this filter.

## Next steps

[Media Services v3 overview](media-services-overview.md)
