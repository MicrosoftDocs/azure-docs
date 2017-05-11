---
title: Optimize content delivery for your scenario
description: Learn how to apply optimization for CDN
services: cdn
documentationcenter: ''
author: zhangmanling
manager: erikre
editor: ''

ms.assetid: b1ae8377-f6fd-450a-9e91-021cffb72487
ms.service: cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/08/2017
ms.author: mazha

---

# Optimize content delivery for your scenario

When delivering content to a large global audience, it is critical to ensure optimized delivery of your content.  Azure CDN can optimize the delivery experience based on the type of content you have, whether it is a website, a video, a live stream, or a large file for download. Optimization will be applied by default to the scenario you specified in the "optimized for" option when you create a CDN endpoint.

**You can optimize the CDN endpoint to one of the following scenarios**. Scroll down this article to understand how we optimize the delivery.

*	General web delivery
*	General media streaming
*	Video on demand media streaming
*	Large file download

Optimization is targeted to improve content delivery performance. It includes caching, object chunking, origin failure retry policy, etc, depending on the specific scenario. Media streaming, for example, is time sensitive in that packets arriving late on the client can cause degraded viewing experience, such as frequent buffering of video content. The optimization, reduces the latency for delivery of media content to provide smooth streaming experience for end users. For large files, object chunking is critical. Files are requested in smaller chunks from origin to ensure smooth download. We apply these enhancements based on the experience with many customers and we will continue adding additional policies or settings to improve content delivery performance.

> [!NOTE]
> Depending on the optimization CDN providers support and how they apply enhancement in different scenarios, "optimized for" options can vary based on the provider you select. We highly recommend you to test the performance between different providers to select your optimal provider for your delivery. Currently Azure CDN from Akamai supports general web delivery, general media streaming, video on demand media streaming and large file download. Azure CDN from Verizon supports general web delivery. You can use general web delivery for video on demand and large file download.
> 
> 

##Tell us the scenario you need the endpoint to optimize for

When creating a new CDN endpoint, select from the drop down that best matches the scenario or the type of content that you use the endpoint to deliver. "General web delivery" is the default selection. 

![cdn optimized for endpoint creation][cdn-optimized-for-endpoint-creation]

You can update the optimization option for any existing endpoint. This change will not impact CDN delivery.
![cdn optimized for endpoint update][cdn-optimized-for-endpoint-update]


##1. Optimized for: General Web delivery

General web delivery is the most common option. It is targeted to optimize for general web content, such as website, web application, or optimize for file and video download.
 
A typical website usually contains both static and dynamic content. Static content includes images, style sheets that can be cached and delivered to different users. Dynamic content is dynamic generated content that is personalized to individual user. These contents shall not be cached, such as user credentials. General web delivery can optimize your entire website. It serves cached static content from CDN POPs and pulls from origin for dynamic content.

**Caching**: CDN will by default honor origin caching policy by looking at the "cache-control" header in the response header. If no policy is present, files will be cached by default for 7 days. Ensure to set up caching policy correctly on the origin for static and dynamic content for CDN to apply the policy correctly. 

> [!NOTE]
> This optimization is available for both Azure CDN from Akamai and Verizon. If you use Azure CDN from Akamai, you shall use this optimization when the average file size is smaller than 10MB (Use "optimized for: large file download" when average file size is larger than 10MB). If you use Azure CDN from Verizon, you can use this optimization to delivery all file size.
> 
> 

##2. Optimized for: General media streaming

General media streaming shall be selected if you need to use the endpoint for both live streaming and video on demand streaming. 

This is a common scenario for Azure media service customers. when you use Azure media services, you will get one streaming endpoint that can be used for both live and on demand streaming. With this design customer doesn't need to switch to use another endpoint when they switch from live to on demand streaming. General media streaming optimization is designed to support this type of scenario.

**Caching**: For all streaming content (see streaming format identification below), different caching rules will apply based on the response codes: 1) responses of 200, 203, 300, 301, 302 and 410 are cached for 365 day. 2) responses of 204, 305, 404 and 405 are cached for 1 second. Caching these negative responses for a short period of time is to prevent overload on the origin. 3) the rest of the responses will not be cached. For all non-streaming content, CDN will by default honor origin caching policy by looking at the "cache-control" header in the response header. If no policy is present, files will be cached by default for 7 days.
 
Streaming format identification:

*	**HLS** Manifest: m3u8 m3u m3ub key; Segments: ts aac
*	**HDS** Manifest: f4m f4x drmmeta bootstrap; Fragments: f4f, Seg-Frag URL structure
*	**DASH** Manifest: mpd; Segments: dash dash divx ismv m4s m4v mp4 mp4v sidx webm mp4a m4a isma
*	**Smooth** Manifest: /manifest/; Fragments: /QualityLevels/Fragments/

**Object chunking**: Object chunking will apply for VOD streaming content that is larger than 10MB. This content will be fetched from the origin in smaller chunks of 2MB and served to end users. In addition, CDN will prefetch at least 1 chunk ahead of the current chunk to ensure smooth streaming experience. 

> [!NOTE]
> This optimization is currently only available for Azure CDN from Akamai.
> 
> 

#3. Optimized for: Video on demand media streaming

Video on demand media streaming is targeted to optimize video on demand (VOD) streaming specifically. When you use the endpoint specifically for on demand streaming, you shall use this option.

**Caching**: For all streaming content (see streaming format identification below), different caching rules will apply based on the response codes: 1) responses of 200, 203, 300, 301, 302 and 410 are cached for 365 day. 2) responses of 204, 305, 404 and 405 are cached for 1 second. Caching these negative responses for a short period of time is to prevent overload on the origin. 3) the rest of the responses will not be cached. For all non-streaming content, CDN will by default honor origin caching policy by looking at the "cache-control" header in the response header. If no policy is present, files will be cached by default for 7 days.
 
Streaming format identification:

*	**HLS** Manifest: m3u8 m3u m3ub key; Segments: ts aac
*	**HDS** Manifest: f4m f4x drmmeta bootstrap; Fragments: f4f, Seg-Frag URL structure
*	**DASH** Manifest: mpd; Segments: dash dash divx ismv m4s m4v mp4 mp4v sidx webm mp4a m4a isma
*	**Smooth** Manifest: /manifest/; Fragments: /QualityLevels/Fragments/

**Object chunking**: Object chunking will apply for VOD streaming content that is larger than 10MB. This content will be fetched from the origin in smaller chunks of 2MB and served to end users. In addition, CDN will prefetch at least 1 chunk ahead of the current chunk to ensure smooth streaming experience. 

> [!NOTE]
> This optimization is currently only available for Azure CDN from Akamai. For Azure CDN from Verizon, you can use general web delivery which is optimized for video on demand delivery.
> 
> 

##4. Optimized for: Large file download

Large file download is optimized to deliver content that is larger than 10MB when you use Azure CDN from Akamai. As mentioned above, you shall use general web delivery when your average file size is smaller than 10MB for Akamai profile. In the case where your average file size is larger than 10MB, such as firmware or software update scenarios, we recommend you to create a separate endpoint to deliver these large files and use this optimization. 

**Caching**: Different caching rules will apply based on the response codes: 1) responses of 200, 203, 300, 301, 302 and 410 are cached for 1 day. 2) responses of 204, 305, 404 and 405 are cached for 1 second. Caching these negative responses for a short period of time is to prevent overload on the origin. 3) the rest of the responses are not cached.

**Object chunking**: For large file download, when a request comes in for a large file, say 10MB, of the following types, this file is fetched from origin in smaller chunks of 2MB and served to end users. In addition, CDN will prefetch at least 1 chunk ahead of the current chunk to ensure smooth download. 

File extensions with object chunking enabled: 3g2 3gp asf avi bz2 dmg exe f4v flv gz hdp iso jxr m4v mkv mov mov mp4 mpeg mpg mts pkg qt rm swf tar tgz wdp webm webp wma wmv zip
> 

> [!NOTE]
> This optimization is currently only available for Azure CDN from Akamai. For Azure CDN from Verizon, you can use general web delivery which is optimized for both small and large file delivery.
>
>

[cdn-optimized-for-endpoint-creation]: ./media/cdn-optimize-content-delivery/cdn-optimized-for-endpoint-creation.png 


[cdn-optimized-for-endpoint-update]: ./media/cdn-optimize-content-delivery/cdn-optimized-for-endpoint-update.png