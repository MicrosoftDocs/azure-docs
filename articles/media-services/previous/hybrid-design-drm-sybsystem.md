---
title: Hybrid design of DRM subsystem(s) using Azure Media Services | Microsoft Docs
description: This topic discusses hybrid design of DRM subsystem(s) using Azure Media Services.
services: media-services
documentationcenter: ''
author: willzhan
manager: femila
editor: ''

ms.assetid: 18213fc1-74f5-4074-a32b-02846fe90601
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/14/2019
ms.author: willzhan
ms.reviewer: juliako

---
# Hybrid design of DRM subsystems 

This topic discusses hybrid design of DRM subsystem(s) using Azure Media Services.

## Overview

Azure Media Services provides support for the following three DRM system:

* PlayReady
* Widevine (Modular)
* FairPlay

The DRM support includes DRM encryption (dynamic encryption) and license delivery, with Azure Media Player supporting all 3 DRMs as a browser player SDK.

For a detailed treatment of DRM/CENC subsystem design and implementation, please see the document titled [CENC with Multi-DRM and Access Control](media-services-cenc-with-multidrm-access-control.md).

Although we offer complete support for three DRM systems, sometimes customers need to use various parts of their own infrastructure/subsystems in addition to Azure Media Services to build a hybrid DRM subsystem.

Below are some common questions asked by customers:

* "Can I use my own DRM license servers?" (In this case, customers have invested in DRM license server farm with embedded business logic).
* "Can I use only your DRM license delivery in Azure Media Services without hosting content in AMS?"

## Modularity of the AMS DRM platform

As part of a comprehensive cloud video platform, Azure Media Services DRM has a design with flexibility and modularity in mind. You can use Azure Media Services with any of the following different combinations described in the table below (an explanation of the notation used in the table follows). 

|**Content hosting & origin**|**Content encryption**|**DRM license delivery**|
|---|---|---|
|AMS|AMS|AMS|
|AMS|AMS|Third-party|
|AMS|Third-party|AMS|
|AMS|Third-party|Third-party|
|Third-party|Third-party|AMS|

### Content hosting & origin

* AMS: video asset is hosted in AMS and streaming is through AMS streaming endpoints (but not necessarily dynamic packaging).
* Third-party: video is hosted and delivered on a third-party streaming platform outside of AMS.

### Content encryption

* AMS: content encryption is performed dynamically/on-demand by AMS dynamic encryption.
* Third-party: content encryption is performed outside of AMS using a pre-processing workflow.

### DRM license delivery

* AMS: DRM license is delivered by AMS license delivery service.
* Third-party: DRM license is delivered by a third-party DRM license server outside of AMS.

## Configure based on your hybrid scenario

### Content key

Through configuration of a content key, you can control the following attributes of both AMS dynamic encryption and AMS license delivery service:

* The content key used for dynamic DRM encryption.
* DRM license content to be delivered by license delivery services: rights, content key and restrictions.
* Type of **content key authorization policy restriction**: open, IP, or token restriction.
* If **token** type of **content key authorization policy restriction is used**, the **content key authorization policy restriction** must be met before a license is issued.

### Asset delivery policy

Through configuration of an asset delivery policy, you can control the following attributes used by AMS dynamic packager and dynamic encryption of an AMS streaming endpoint:

* Streaming protocol and DRM encryption combination, such as DASH under CENC (PlayReady and Widevine), smooth streaming under PlayReady, HLS under Widevine or PlayReady.
* The default/embedded license delivery URLs for each of the involved DRMs.
* Whether license acquisition URLs (LA_URLs) in DASH MPD or HLS playlist contain query string of key ID (KID) for Widevine and FairPlay, respectively.

## Scenarios and samples

Based on the explanations in the previous section, the following five hybrid scenarios use respective **Content key**-**Asset delivery policy** configuration combinations (the samples mentioned in the last column follow the table):

|**Content hosting & origin**|**DRM encryption**|**DRM license delivery**|**Configure content key**|**Configure asset delivery policy**|**Sample**|
|---|---|---|---|---|---|
|AMS|AMS|AMS|Yes|Yes|Sample 1|
|AMS|AMS|Third-party|Yes|Yes|Sample 2|
|AMS|Third-party|AMS|Yes|No|Sample 3|
|AMS|Third-party|Outside|No|No|Sample 4|
|Third-party|Third-party|AMS|Yes|No|	

In the samples, PlayReady protection works for both DASH and smooth streaming. The video URLs below are smooth streaming URLs. To get the corresponding DASH URLs, just append "(format=mpd-time-csf)". You could use the [azure media test player](https://aka.ms/amtest) to test in a browser. It allows you to configure which streaming protocol to use, under which tech. IE11 and Microsoft Edge on Windows 10 support PlayReady through EME. For more information, see [details about the test tool](https://blogs.msdn.microsoft.com/playready4/2016/02/28/azure-media-test-tool/).

### Sample 1

* Source (base) URL: `https://willzhanmswest.streaming.mediaservices.windows.net/1efbd6bb-1e66-4e53-88c3-f7e5657a9bbd/RussianWaltz.ism/manifest` 
* PlayReady LA_URL (DASH & smooth): `https://willzhanmswest.keydelivery.mediaservices.windows.net/PlayReady/` 
* Widevine LA_URL (DASH): `https://willzhanmswest.keydelivery.mediaservices.windows.net/Widevine/?kid=78de73ae-6d0f-470a-8f13-5c91f7c4` 
* FairPlay LA_URL (HLS): `https://willzhanmswest.keydelivery.mediaservices.windows.net/FairPlay/?kid=ba7e8fb0-ee22-4291-9654-6222ac611bd8` 

### Sample 2

* Source (base) URL: https://willzhanmswest.streaming.mediaservices.windows.net/1a670626-4515-49ee-9e7f-cd50853e41d8/Microsoft_HoloLens_TransformYourWorld_816p23.ism/Manifest 
* PlayReady LA_URL (DASH & smooth): `http://willzhan12.cloudapp.net/PlayReady/RightsManager.asmx` 

### Sample 3

* Source URL: https://willzhanmswest.streaming.mediaservices.windows.net/8d078cf8-d621-406c-84ca-88e6b9454acc/20150807-bridges-2500.ism/manifest 
* PlayReady LA_URL (DASH & smooth): `https://willzhanmswest.keydelivery.mediaservices.windows.net/PlayReady/` 

### Sample 4

* Source URL: https://willzhanmswest.streaming.mediaservices.windows.net/7c085a59-ae9a-411e-842c-ef10f96c3f89/20150807-bridges-2500.ism/manifest 
* PlayReady LA_URL (DASH & smooth): `https://willzhan12.cloudapp.net/playready/rightsmanager.asmx` 

## Additional notes

* Widevine is a service provided by Google Inc. and subject to the terms of service and Privacy Policy of Google, Inc.

## Summary

In summary, Azure Media Services DRM components are flexible, you can use them in a hybrid scenario by properly configuring content key and asset delivery policy, as described in this topic.

## Next steps
View Media Services learning paths.

[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

