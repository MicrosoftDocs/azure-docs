---
title: Configure your account for offline streaming of Widevine protected content - Azure
description: This topic shows how to configure your Azure Media Services account for offline streaming of Widevine protected content.
services: media-services
keywords: DASH, DRM, Widevine Offline Mode, ExoPlayer, Android
documentationcenter: ''
author: willzhan
manager: steveng
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/16/2019
ms.author: willzhan
ms.reviewer: dwgeo

---
# Offline Widevine streaming for Android  

> [!div class="op_single_selector" title1="Select the version of Media Services that you are using:"]
> * [Version 3](../latest/offline-widevine-for-android.md)
> * [Version 2](offline-widevine-for-android.md)

> [!NOTE]
> No new features or functionality are being added to Media Services v2. <br/>Check out the latest version, [Media Services v3](https://docs.microsoft.com/azure/media-services/latest/). Also, see [migration guidance from v2 to v3](../latest/migrate-from-v2-to-v3.md)

In addition to protecting content for online streaming, media content subscription and rental services offer downloadable content that works when you are not connected to the internet. You might need to download content onto your phone or tablet for playback in airplane mode when flying disconnected from the network. Additional scenarios, in which you might want to download content:

- Some content providers may disallow DRM license delivery beyond a country/region's border. If a user wants to watch content while traveling abroad, offline download is needed.
- In some countries/regions, Internet availability and/or bandwidth is limited. Users may choose to download content to be able to watch it in high enough resolution for satisfactory viewing experience.

This article discusses how to implement offline mode playback for DASH content protected by Widevine on Android devices. Offline DRM allows you to provide subscription, rental, and purchase models for your content, enabling customers of your services to easily take content with them when disconnected from the internet.

For building the Android player apps, we outline three options:

> [!div class="checklist"]
> * Build a player using the Java API of ExoPlayer SDK
> * Build a player using Xamarin binding of ExoPlayer SDK
> * Build a player using Encrypted Media Extension (EME) and Media Source Extension (MSE) in Chrome mobile browser v62 or later

The article also answers some common questions related to offline streaming of Widevine protected content.

## Requirements 

Before implementing offline DRM for Widevine on Android devices, you should first:

- Become familiar with the concepts introduced for online content protection using Widevine DRM. This is covered in detail in the following documents/samples:
    - [Use Azure Media Services to deliver DRM licenses or AES keys](media-services-deliver-keys-and-licenses.md)
    - [CENC with Multi-DRM and Access Control: A Reference Design and Implementation on Azure and Azure Media Services](media-services-cenc-with-multidrm-access-control.md)
    - [Using PlayReady and/or Widevine Dynamic Common Encryption with .NET](https://azure.microsoft.com/resources/samples/media-services-dotnet-dynamic-encryption-with-drm/)
    - [Use Azure Media Services to deliver PlayReady and/or Widevine licenses with .NET](https://azure.microsoft.com/resources/samples/media-services-dotnet-deliver-playready-widevine-licenses/)
- Become familiar with the Google ExoPlayer SDK for Android, an open-source video player SDK capable of supporting offline Widevine DRM playback. 
    - [ExoPlayer SDK](https://github.com/google/ExoPlayer)
    - [ExoPlayer Developer Guide](https://google.github.io/ExoPlayer/guide.html)
    - [EoPlayer Developer Blog](https://medium.com/google-exoplayer)

## Content protection configuration in Azure Media Services

When you configure Widevine protection of an asset in Media Services, you need to create ContentKeyAuthorizationPolicyOption which specified the following three things:

1. DRM system (Widevine)
2. ContentKeyAuthorizationPolicyRestriction specifying how content key delivery is authorized in license delivery service (Open or token authorization)
3. DRM (Widevine) license template

To enable **offline** mode for Widevine licenses, you need to configure [Widevine license template](media-services-widevine-license-template-overview.md). In the **policy_overrides** object, set the **can_persist** property to **true** (default is false). 

The following code sample uses .NET to enable **offline** mode for Widevine licenses. The code is based on the [
Using PlayReady and/or Widevine Dynamic Common Encryption with .NET](https://github.com/Azure-Samples/media-services-dotnet-dynamic-encryption-with-drm) sample. 

```
private static string ConfigureWidevineLicenseTemplateOffline(Uri keyDeliveryUrl)
{
    var template = new WidevineMessage
    {
        allowed_track_types = AllowedTrackTypes.SD_HD,
        content_key_specs = new[]
        {
            new ContentKeySpecs
            {
                required_output_protection = new RequiredOutputProtection { hdcp = Hdcp.HDCP_NONE},
                security_level = 1,
                track_type = "SD"
            }
        },
        policy_overrides = new
        {
            can_play = true,
            can_persist = true,
            //can_renew = true,                        		//if you set can_renew = false, you do not need renewal_server_url
            //renewal_server_url = keyDeliveryUrl.ToString(),	//not mandatory, renewal_server_url is needed only if license_duration_seconds is set
            can_renew = false,
            //rental_duration_seconds = 1209600,
            //playback_duration_seconds = 1209600,
            //license_duration_seconds = 1209600
        }
        };

    string configuration = Newtonsoft.Json.JsonConvert.SerializeObject(template);
    return configuration;
}
```

## Configuring the Android player for offline playback

The easiest way to develop a native player app for Android devices is to use the [Google ExoPlayer SDK](https://github.com/google/ExoPlayer), an open-source video player SDK. ExoPlayer supports features not currently supported by Android’s native MediaPlayer API, including MPEG-DASH and Microsoft Smooth Streaming delivery protocols.

ExoPlayer version 2.6 and higher includes many classes that support offline Widevine DRM playback. In particular, the OfflineLicenseHelper class provides utility functions to facilitate the use of the DefaultDrmSessionManager for downloading, renewing, and releasing offline licenses. The classes provided in the SDK folder "library/core/src/main/java/com/google/android/exoplayer2/offline/" support offline video content downloading.

The following list of classes facilitate offline mode in the ExoPlayer SDK for Android:

- library/core/src/main/java/com/google/android/exoplayer2/drm/OfflineLicenseHelper.java  
- library/core/src/main/java/com/google/android/exoplayer2/drm/DefaultDrmSession.java
- library/core/src/main/java/com/google/android/exoplayer2/drm/DefaultDrmSessionManager.java
- library/core/src/main/java/com/google/android/exoplayer2/drm/DrmSession.java
- library/core/src/main/java/com/google/android/exoplayer2/drm/ErrorStateDrmSession.java
- library/core/src/main/java/com/google/android/exoplayer2/drm/ExoMediaDrm.java
- library/core/src/main/java/com/google/android/exoplayer2/offline/SegmentDownloader.java
- library/core/src/main/java/com/google/android/exoplayer2/offline/DownloaderConstructorHelper.java 
- library/core/src/main/java/com/google/android/exoplayer2/offline/Downloader.java
- library/dash/src/main/java/com/google/android/exoplayer2/source/dash/offline/DashDownloader.java 

Developers should reference the [ExoPlayer Developer Guide](https://google.github.io/ExoPlayer/guide.html) and the corresponding [Developer Blog](https://medium.com/google-exoplayer) during development of an application. Google has not released a fully documented reference implementation or sample code for the ExoPlayer app supporting Widevine offline at this time, so the information is limited to the developers guide and blog. 

### Working with older Android devices

For some older Android devices, you must set values for the following **policy_overrides** properties (defined in [Widevine license template](media-services-widevine-license-template-overview.md): **rental_duration_seconds**, **playback_duration_seconds**, and **license_duration_seconds**. Alternatively, you can set them to zero, which means infinite/unlimited duration.  

The values must be set to avoid an integer overflow bug. For more explanation about the issue, see https://github.com/google/ExoPlayer/issues/3150 and https://github.com/google/ExoPlayer/issues/3112. <br/>If you do not set the values explicitly, very large values for  **PlaybackDurationRemaining** and **LicenseDurationRemaining** will be assigned, (for example, 9223372036854775807, which is the maximum positive value for a 64-bit integer). As a result, the Widevine license appears expired and hence the decryption will not happen. 

This issue does not occur on Android 5.0 Lollipop or later since Android 5.0 is the first Android version, which has been designed to fully support ARMv8 ([Advanced RISC Machine](https://en.wikipedia.org/wiki/ARM_architecture)) and 64-bit platforms, while Android 4.4 KitKat was originally designed to support  ARMv7 and 32-bit platforms as with other older Android versions.

## Using Xamarin to build an Android playback app

You can find Xamarin bindings for ExoPlayer using the following links:

- [Xamarin bindings library for the Google ExoPlayer library](https://github.com/martijn00/ExoPlayerXamarin)
- [Xamarin bindings for ExoPlayer NuGet](https://www.nuget.org/packages/Xam.Plugins.Android.ExoPlayer/)

Also, see the following thread: [Xamarin binding](https://github.com/martijn00/ExoPlayerXamarin/pull/57). 

## Chrome player apps for Android

Starting with the release of [Chrome for Android v. 62](https://developers.google.com/web/updates/2017/09/chrome-62-media-updates), persistent license in EME is supported. [Widevine L1](https://developers.google.com/web/updates/2017/09/chrome-62-media-updates#widevine_l1) is now also supported in Chrome for Android. This allows you to create offline playback applications in Chrome if your end users have this (or higher) version of Chrome. 

In addition, Google has produced a Progressive Web App (PWA) sample and open-sourced it: 

- [Source code](https://github.com/GoogleChromeLabs/sample-media-pwa)
- [Google hosted version](https://biograf-155113.appspot.com/ttt/episode-2/) (only works in Chrome v 62 and higher on Android devices)

If you upgrade your mobile Chrome browser to v62 (or higher) on an Android phone and test the above hosted sample app, you will see that both online streaming and offline playback work.

The above open-source PWA app is authored in Node.js. If you want to host your own version on an Ubuntu server, keep in mind the following common encountered issues that can prevent playback:

1. CORS issue: The sample video in the sample app is hosted in https://storage.googleapis.com/biograf-video-files/videos/. Google has set up CORS for all their test samples hosted in Google Cloud Storage bucket. They are served with CORS headers, specifying explicitly the CORS entry: https://biograf-155113.appspot.com (the domain in which google hosts their sample) preventing access by any other sites. If you try, you will see the following HTTP error: Failed to load https://storage.googleapis.com/biograf-video-files/videos/poly-sizzle-2015/mp4/dash.mpd: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'https:\//13.85.80.81:8080' is therefore not allowed access. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
2. Certificate issue: Starting from Chrome v 58, EME for Widevine requires HTTPS. Therefore, you need to host the sample app over HTTPS with an X509 certificate. A usual test certificate does not work due to the following requirements: You need to obtain a certificate meeting the following minimum requirements:
    - Chrome and Firefox require SAN-Subject Alternative Name setting to exist in the certificate
    - The certificate must have trusted CA and a self-signed development certificate does not work
    - The certificate must have a CN matching the DNS name of the web server or gateway

## Frequently asked questions

### Question

How can I deliver persistent licenses (offline-enabled) for some clients/users and non-persistent licenses (offline-disabled) for others? Do I have to duplicate the content and use separate content key?

### Answer
You do not need to duplicate the content. You can simply use a single copy of the content and a single ContentKeyAuthorizationPolicy, but two separate ContentKeyAuthorizationPolicyOption’s:

1. IContentKeyAuthorizationPolicyOption 1: uses persistent license, and ContentKeyAuthorizationPolicyRestriction 1 which contains a claim such as license_type = “Persistent”
2. IContentKeyAuthorizationPolicyOption 2: uses non-persistent license, and ContentKeyAuthorizationPolicyRestriction 2 which contains a claim such as license_type = “Nonpersistent”

This way, when a license request comes in from the client app, from license request there is no difference. However, for different end user/device, the STS should have the business logic to issue different JWT tokens containing different claims (one of the above two license_type’s). The claims value in the JWT token will be used to decide by license service to issue what type of
license: persistent or non-persistent.

This means the Secure Token Service (STS) needs to have the business logic and client/device info to add corresponding claim value into a token.

### Question

For Widevine security levels, in Google’s [Widevine DRM Architecture Overview doc](https://storage.googleapis.com/wvdocs/Widevine_DRM_Architecture_Overview.pdf) documentation,
it defines three different security levels. However, in [Azure Media Services documentation on Widevine license template](https://docs.microsoft.com/azure/media-services/media-services-widevine-license-template-overview),
five different security levels are outlined. What is the relationship or mapping between the two different sets of security levels?

### Answer

In Google’s [Widevine DRM Architecture Overview](https://storage.googleapis.com/wvdocs/Widevine_DRM_Architecture_Overview.pdf),
it defines the following three security levels:

1.  Security Level 1: All content processing, cryptography, and control are performed within the Trusted Execution Environment (TEE). In some implementation models, security processing may be performed in different chips.
2.  Security Level 2: Performs cryptography (but not video processing) within the TEE: decrypted buffers are returned to the application domain and processed through separate video hardware or software. At level 2, however, cryptographic information is still processed only within the TEE.
3.  Security Level 3 Does not have a TEE on the device. Appropriate measures may be taken to protect the cryptographic information and decrypted content on host operating system. A Level 3 implementation may also include a hardware cryptographic engine, but that only enhances performance, not security.

At the same time, in [Azure Media Services documentation on Widevine license template](https://docs.microsoft.com/azure/media-services/media-services-widevine-license-template-overview), the security_level property of content_key_specs can have the following five different values (client robustness requirements for playback):

1.  Software-based whitebox crypto is required.
2.  Software crypto and an obfuscated decoder is required.
3.  The key material and crypto operations must be performed within a hardware backed TEE.
4.  The crypto and decoding of content must be performed within a hardware backed TEE.
5.  The crypto, decoding, and all handling of the media (compressed and uncompressed) must be handled within a hardware backed TEE.

Both security levels are defined by Google Widevine. The difference is in its usage level: architecture level or API level. The five security levels are used in the Widevine API. The content_key_specs object, which
contains security_level is deserialized and passed to the Widevine global delivery service by Azure Media Services Widevine license service. The table below shows the mapping between the two sets of security levels.

| **Security Levels Defined in Widevine Architecture** |**Security Levels Used in Widevine API**|
|---|---| 
| **Security Level 1**: All content processing, cryptography, and control are performed within the Trusted Execution Environment (TEE). In some implementation models, security processing may be performed in different chips.|**security_level=5**: The crypto, decoding, and all handling of the media (compressed and uncompressed) must be handled within a hardware backed TEE.<br/><br/>**security_level=4**: The crypto and decoding of content must be performed within a hardware backed TEE.|
**Security Level 2**: Performs cryptography (but not video processing) within the TEE: decrypted buffers are returned to the application domain and processed through separate video hardware or software. At level 2, however, cryptographic information is still processed only within the TEE.| **security_level=3**: The key material and crypto operations must be performed within a hardware backed TEE. |
| **Security Level 3**: Does not have a TEE on the device. Appropriate measures may be taken to protect the cryptographic information and decrypted content on host operating system. A Level 3 implementation may also include a hardware cryptographic engine, but that only enhances performance, not security. | **security_level=2**: Software crypto and an obfuscated decoder is required.<br/><br/>**security_level=1**: Software-based whitebox crypto is required.|

### Question

Why does content download take so long?

### Answer

There are two ways to improve download speed:

1.  Enable CDN so that end users are more likely to hit CDN instead of origin/streaming endpoint for content download. If user hits streaming endpoint, each HLS segment or DASH fragment is dynamically packaged and encrypted. Even though this latency is in millisecond scale for each segment/fragment, when you have an hour long video, the accumulated latency can be large causing longer download.
2.  Provide end users the option to selectively download video quality layers and audio tracks instead of all contents. For offline mode, there is no point to download all of the quality layers. There are two ways to achieve this:
    1.  Client controlled: either player app auto selects or user selects video  quality layer and audio tracks to download;
    2.  Service controlled: one can use Dynamic Manifest feature in Azure Media Services to create a (global) filter, which limits HLS playlist or DASH MPD to a single video quality layer and selected audio tracks. Then the download URL presented to end users will include this filter.

## Summary

This article discussed how to implement offline mode playback for DASH content protected by Widevine on Android devices.  It also answered some common questions related to offline streaming of Widevine protected content.
