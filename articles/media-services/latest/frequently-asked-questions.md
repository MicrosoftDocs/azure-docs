---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Azure Media Services v3 frequently asked questions| Microsoft Docs
description: This article gives answers to frequently asked questions about Azure Media Services v3.
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

This article gives answers to frequently asked questions about Azure Media Services v3.

## General

### What Azure roles can perform actions on Azure Media Services resources? 

See [Role-based access control (RBAC) for Media Services accounts](rbac-overview.md).

### How do I stream to Apple iOS devices?

Make sure you have **(format=m3u8-aapl)** at the end of your path (after the **/manifest** portion of the URL) to tell the streaming origin server to return HTTP Live Streaming (HLS) content for consumption on Apple iOS native devices. For details, see [Delivering content](dynamic-packaging-overview.md).

### How do I configure Media Reserved Units?

For the Audio Analysis and Video Analysis jobs that are triggered by Media Services v3 or Video Indexer, we recommend that you provision your account with 10 S3 Media Reserved Units (MRUs). If you need more than 10 S3 MRUs, open a support ticket by using the [Azure portal](https://portal.azure.com/).

For details, see [Scale media processing](media-reserved-units-cli-how-to.md).

### What is the recommended method to process videos?

Use [Transforms](https://docs.microsoft.com/rest/api/media/transforms) to configure common tasks for encoding or analyzing videos. Each Transform describes a recipe, or a workflow of tasks for processing your video or audio files. A [Job](https://docs.microsoft.com/rest/api/media/jobs) is the actual request to Media Services to apply the Transform to an input video or audio content. After the Transform has been created, you can submit Jobs by using Media Services APIs or any of the published SDKs. For more information, see [Transforms and Jobs](transforms-jobs-concept.md).

### I uploaded, encoded, and published a video. Why won't the video play when I try to stream it?

One of the most common reasons is that you don't have the streaming endpoint from which you're trying to play back in the Running state.

### How does pagination work?

When you're using pagination, you should always use the next link to enumerate the collection and not depend on a particular page size. For details and examples, see [Filtering, ordering, paging](entities-overview.md).

### What features are not yet available in Azure Media Services v3?

For details, see [Feature gaps with respect to v2 APIs](media-services-v2-vs-v3.md#feature-gaps-with-respect-to-v2-apis).

### What is the process of moving a Media Services account between subscriptions?  

For details, see [Moving a Media Services account between subscriptions](media-services-account-concept.md).

## Live streaming 

### How do I stop the live stream after the broadcast is done?

You can approach it from the client side or the server side.

#### Client side

Your web application should prompt the user if they want to end the broadcast as they're closing the browser. This is a browser event that your web application can handle.

#### Server side

You can monitor live events by subscribing to Azure Event Grid events. For more information, see the [EventGrid event schema](media-services-event-schemas.md#live-event-types).

You can either:

* [Subscribe](reacting-to-media-services-events.md) to the stream-level [Microsoft.Media.LiveEventEncoderDisconnected](media-services-event-schemas.md#liveeventencoderdisconnected) events and monitor that no reconnections come in for a while to stop and delete your live event.
* [Subscribe](reacting-to-media-services-events.md) to the track-level [heartbeat](media-services-event-schemas.md#liveeventingestheartbeat) events. If all tracks have an incoming bitrate dropping to 0 or the last time stamp is no longer increasing, you can safely shut down the live event. The heartbeat events come in at every 20 seconds for every track, so it might be a bit verbose.

###  How do I insert breaks/videos and image slates during a live stream?

Media Services v3 live encoding does not yet support inserting video or image slates during live stream. 

You can use a [live on-premises encoder](recommended-on-premises-live-encoders.md) to switch the source video. Many apps provide to ability to switch sources, including Telestream Wirecast, Switcher Studio (on iOS), and OBS Studio (free app).

## Content protection

### Should I use AES-128 clear key encryption or a DRM system?

Customers often wonder whether they should use AES encryption or a DRM system. The main difference between the two systems is that with AES encryption, the content key is transmitted to the client over TLS so that the key is encrypted in transit but without any additional encryption ("in the clear"). As a result, the key that's used to decrypt the content is accessible to the client player and can be viewed in a network trace on the client in plain text. AES-128 clear key encryption is suitable for use cases where the viewer is a trusted party (for example, encrypting corporate videos distributed within a company to be viewed by employees).

DRM systems like PlayReady, Widevine, and FairPlay all provide an additional level of encryption on the key that's used to decrypt the content, compared to an AES-128 clear key. The content key is encrypted to a key protected by the DRM runtime in addition to any transport-level encryption provided by TLS. Additionally, decryption is handled in a secure environment at the operating system level, where it's more difficult for a malicious user to attack. We recommend DRM for use cases where the viewer might not be a trusted party and you need the highest level of security.

### How do I show a video to only users who have a specific permission, without using Azure AD?

You don't have to use any specific token provider such as Azure Active Directory (Azure AD). You can create your own [JWT](https://jwt.io/) provider (so-called Secure Token Service, or STS) by using asymmetric key encryption. In your custom STS, you can add claims based on your business logic.

Make sure that the issuer, audience, and claims all match up exactly between what's in JWT and the `ContentKeyPolicyRestriction` value used in `ContentKeyPolicy`.

For more information, see [Protect your content by using Media Services dynamic encryption](content-protection-overview.md).

### How and where did I get a JWT token before using it to request a license or key?

For production, you need to have Secure Token Service (that is, a web service), which issues a JWT token upon an HTTPS request. For test, you can use the code shown in the `GetTokenAsync` method defined in [Program.cs](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/EncryptWithDRM/Program.cs).

The player makes a request, after a user is authenticated, to STS for such a token and assigns it as the value of the token. You can use the [Azure Media Player API](https://amp.azure.net/libs/amp/latest/docs/).

For an example of running STS with either a symmetric key or an asymmetric key, see the [JWT tool](https://aka.ms/jwt). For an example of a player based on Azure Media Player using such a JWT token, see the [Azure media test tool](https://aka.ms/amtest). (Expand the **player_settings** link to see the token input.)

### How do I authorize requests to stream videos with AES encryption?

The correct approach is to use Secure Token Service. In STS, depending on the user profile, add different claims (such as "Premium User," "Basic User," "Free Trial User"). With different claims in a JWT, the user can see different contents. For different contents or assets, `ContentKeyPolicyRestriction` will have the corresponding `RequiredClaims` value.

Use Azure Media Services APIs for configuring license/key delivery and encrypting your assets (as shown in [this sample](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/EncryptWithAES/Program.cs)).

For more information, see:

- [Content protection overview](content-protection-overview.md)
- [Design of a multi-DRM content protection system with access control](design-multi-drm-system-with-access-control.md)

### Should I use HTTP or HTTPS?
The ASP.NET MVC player application must support the following:

* User authentication through Azure AD, which is under HTTPS.
* JWT exchange between the client and Azure AD, which is under HTTPS.
* DRM license acquisition by the client, which must be under HTTPS if license delivery is provided by Media Services. The PlayReady product suite doesn't mandate HTTPS for license delivery. If your PlayReady license server is outside Media Services, you can use either HTTP or HTTPS.

The ASP.NET player application uses HTTPS as a best practice, so Media Player is on a page under HTTPS. However, HTTP is preferred for streaming, so you need to consider these issues with mixed content:

* The browser doesn't allow mixed content. But plug-ins like Silverlight and the OSMF plug-in for Smooth and DASH do allow it. Mixed content is a security concern because of the threat of the ability to inject malicious JavaScript, which can put customer data at risk. Browsers block this capability by default. The only way to work around it is on the server (origin) side by allowing all domains (regardless of HTTPS or HTTP). This is probably not a good idea either.
* Avoid mixed content. Both the player application and Media Player should use HTTP or HTTPS. When you're playing mixed content, the SilverlightSS tech requires clearing a mixed-content warning. The FlashSS tech handles mixed content without a mixed-content warning.
* If your streaming endpoint was created before August 2014, it won't support HTTPS. In this case, create and use a new streaming endpoint for HTTPS.

### What about live streaming?

You can use exactly the same design and implementation to help protect live streaming in Media Services by treating the asset associated with a program as a VOD asset. To provide a multi-DRM protection of the live content, apply the same setup/processing to the asset as if it were a VOD asset before you associate the asset with the live output.

### What about license servers outside Media Services?

Often, customers have invested in a license server farm either in their own datacenter or in one hosted by DRM service providers. With Media Services content protection, you can operate in hybrid mode. Content can be hosted and dynamically protected in Media Services, while DRM licenses are delivered by servers outside Media Services. In this case, consider the following changes:

* STS needs to issue tokens that are acceptable and can be verified by the license server farm. For example, the Widevine license servers provided by Axinom require a specific JWT that contains an entitlement message. You need to have an STS to issue such a JWT. 
* You no longer need to configure license delivery service in Media Services. You need to provide the license acquisition URLs (for PlayReady, Widevine, and FairPlay) when you configure `ContentKeyPolicy`.

> [!NOTE]
> Widevine is a service provided by Google and subject to the terms of service and privacy policy of Google.

## Media Services v2 vs. v3 

### Can I use the Azure portal to manage v3 resources?

Currently, you can use the [Azure portal](https://portal.azure.com/) to:

* Manage [Live Events](live-events-outputs-concept.md) in Media Services v3. 
* View (not manage) v3 [assets](assets-concept.md). 
* [Get info about accessing APIs](access-api-portal.md). 

For all other management tasks (for example, [Transforms and Jobs](transforms-jobs-concept.md) and [content protection](content-protection-overview.md)), use the [REST API](https://docs.microsoft.com/rest/api/media/), the [Azure CLI](https://aka.ms/ams-v3-cli-ref), or one of the supported [SDKs](media-services-apis-overview.md#sdks).

### Is there an AssetFile concept in v3?

The `AssetFile` concept was removed from the Media Services API to separate Media Services from Storage SDK dependency. Now Azure Storage, not Media Services, keeps the information that belongs in the Storage SDK. 

For more information, see [Migrate to Media Services v3](media-services-v2-vs-v3.md).

### Where did client-side storage encryption go?

We now recommend that you use server-side storage encryption (which is on by default). For more information, see [Azure Storage Service Encryption for data at rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption).

## Offline streaming

### FairPlay Streaming for iOS

The following frequently asked questions provide assistance with troubleshooting offline FairPlay streaming for iOS.

#### Why does only audio play but not video during offline mode?

This behavior seems to be by design of the sample app. When an alternate audio track is present (which is the case for HLS) during offline mode, both iOS 10 and iOS 11 default to the alternate audio track. To compensate this behavior for FPS offline mode, remove the alternate audio track from the stream. To do this on Media Services, add the dynamic manifest filter **audio-only=false**. In other words, an HLS URL ends with **.ism/manifest(format=m3u8-aapl,audio-only=false)**. 

#### Why does it still play audio only without video during offline mode after I add audio-only=false?

Depending on the cache key design for the content delivery network, the content might be cached. Purge the cache.

#### Is FPS offline mode supported on iOS 11 in addition to iOS 10?

Yes. FPS offline mode is supported for iOS 10 and iOS 11.

#### Why can't I find the document "Offline Playback with FairPlay Streaming and HTTP Live Streaming" in the FPS Server SDK?

Since FPS Server SDK version 4, this document was merged into the "FairPlay Streaming Programming Guide."

#### What is the downloaded/offline file structure on iOS devices?

The downloaded file structure on an iOS device looks like the following screenshot. The `_keys` folder stores downloaded FPS licenses, with one store file for each license service host. The `.movpkg` folder stores audio and video content. 

The first folder with a name that ends with a dash followed by a number contains video content. The numeric value is the peak bandwidth of the video renditions. The second folder with a name that ends with a dash followed by 0 contains audio content. The third folder named `Data` contains the master playlist of the FPS content. Finally, boot.xml provides a complete description of the `.movpkg` folder content. 

![Offline file structure for the FairPlay iOS sample app](media/offline-fairplay-for-ios/offline-fairplay-file-structure.png)

Here's a sample boot.xml file:

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

#### How can I deliver persistent licenses (offline enabled) for some clients/users and non-persistent licenses (offline disabled) for others? Do I have to duplicate the content and use separate content keys?

Because Media Services v3 allows an asset to have multiple `StreamingLocator` instances, you can have:

* One `ContentKeyPolicy` instance with `license_type = "persistent"`, `ContentKeyPolicyRestriction` with claim on `"persistent"`, and its `StreamingLocator`.
* Another `ContentKeyPolicy` instance with `license_type="nonpersistent"`, `ContentKeyPolicyRestriction` with claim on `"nonpersistent`", and its `StreamingLocator`.
* Two `StreamingLocator` instances that have different `ContentKey` values.

Depending on business logic of custom STS, different claims are issued in the JWT token. With the token, only the corresponding license can be obtained and only the corresponding URL can be played.

#### What is the mapping between the Widevine and Media Services DRM security levels?

Google's "Widevine DRM Architecture Overview" defines three security levels. However, the [Azure Media Services documentation on the Widevine license template](widevine-license-template-overview.md) outlines
five security levels (client robustness requirements for playback). This section explains how the security levels map.

Both sets of security levels are defined by Google Widevine. The difference is in usage level: architecture or API. The five security levels are used in the Widevine API. The `content_key_specs` object, which
contains `security_level`, is deserialized and passed to the Widevine global delivery service by the Azure Media Services Widevine license service. The following table shows the mapping between the two sets of security levels.

| **Security levels defined in Widevine architecture** |**Security levels used in Widevine API**|
|---|---| 
| **Security Level 1**: All content processing, cryptography, and control are performed within the Trusted Execution Environment (TEE). In some implementation models, security processing might be performed in different chips.|**security_level=5**: The crypto, decoding, and all handling of the media (compressed and uncompressed) must be handled within a hardware-backed TEE.<br/><br/>**security_level=4**: The crypto and decoding of content must be performed within a hardware-backed TEE.|
**Security Level 2**: Cryptography (but not video processing) is performed within the TEE. Decrypted buffers are returned to the application domain and processed through separate video hardware or software. At Level 2, however, cryptographic information is still processed only within the TEE.| **security_level=3**: The key material and crypto operations must be performed within a hardware-backed TEE. |
| **Security Level 3**: There's no TEE on the device. Appropriate measures can be taken to protect the cryptographic information and decrypted content on host operating system. A Level 3 implementation might also include a hardware cryptographic engine, but that enhances only performance, not security. | **security_level=2**: Software crypto and an obfuscated decoder are required.<br/><br/>**security_level=1**: Software-based white-box crypto is required.|

#### Why does content download take so long?

There are two ways to improve download speed:

* Enable a content delivery network so that users are more likely to hit that instead of the origin/streaming endpoint for content download. If a user hits a streaming endpoint, each HLS segment or DASH fragment is dynamically packaged and encrypted. Even though this latency is in millisecond scale for each segment or fragment, when you have an hour-long video, the accumulated latency can be large and cause a longer download.
* Give users the option to selectively download video quality layers and audio tracks instead of all contents. For offline mode, there's no point in downloading all of the quality layers. There are two ways to achieve this:

  * Client controlled: The player app automatically selects, or the user selects, the video quality layer and the audio tracks to download.
  * Service controlled: You can use the Dynamic Manifest feature in Azure Media Services to create a (global) filter, which limits HLS playlist or DASH MPD to a single video quality layer and selected audio tracks. Then the download URL presented to users will include this filter.

## Next steps

[Media Services v3 overview](media-services-overview.md)
