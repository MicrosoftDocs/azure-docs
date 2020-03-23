---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Stream content with CDN integration
titleSuffix: Azure Media Services
description: Learn about streaming content with CDN integration, as well as prefetching and Origin-Assist CDN-Prefetch.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''
ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 02/13/2020
ms.author: juliako
---

# Stream content with CDN integration

Azure Content Delivery Network (CDN) offers developers a global solution for rapidly delivering high-bandwidth content to users by caching their content at strategically placed physical nodes across the world.  

CDN caches content streamed from a Media Services [Streaming Endpoint (origin)](streaming-endpoint-concept.md) per codec, per streaming protocol, per bitrate, per container format, and per encryption/DRM. For each combination of codec-streaming protocol-container format-bitrate-encryption, there will be a separate CDN cache.

The popular content will be served directly from the CDN cache as long as the video fragment is cached. Live content is likely to be cached because you typically have many people watching the exact same thing. On-demand content can be a bit trickier because you could have some content that's popular and some that isn't. If you have millions of video assets where none of them are popular (only one or two viewers a week) but you have thousands of people watching all different videos, the CDN becomes much less effective.

You also need to consider how adaptive streaming works. Each individual video fragment is cached as its own entity. For example, imagine the first time a certain video is watched. If the viewer skips around watching only a few seconds here and there, only the video fragments associated with what the person watched get cached in CDN. With adaptive streaming, you typically have 5 to 7 different bitrates of video. If one person is watching one bitrate and another person is watching a different bitrate, then they're each cached separately in the CDN. Even if two people are watching the same bitrate, they could be streaming over different protocols. Each protocol (HLS, MPEG-DASH, Smooth Streaming) is cached separately. So each bitrate and protocol are cached separately and only those video fragments that have been requested are cached.

When deciding whether or not to enable CDN on the Media Services [streaming endpoint](streaming-endpoint-concept.md), consider the number of anticipated viewers. CDN helps only if you're expecting many viewers for your content. If the max concurrency of viewers is lower than 500, it's recommended to disable CDN since CDN scales best with concurrency.

This topic discusses enabling [CDN integration](#enable-azure-cdn-integration). It also explains prefetching (active caching) and the [Origin-Assist CDN-Prefetch](#origin-assist-cdn-prefetch) concept.

## Considerations

* The [streaming endpoint](streaming-endpoint-concept.md) `hostname` and the streaming URL remain the same whether or not you enable CDN.
* If you need the ability to test your content with or without CDN, create another streaming endpoint that isn't CDN enabled.

## Enable Azure CDN integration

> [!IMPORTANT]
> You can't enable CDN for trial or student Azure accounts.
>
> CDN integration is enabled in all the Azure data centers except Federal Government and China regions.

After a streaming endpoint is provisioned with CDN enabled, there's a defined wait time on Media Services before DNS update is done to map the streaming endpoint to CDN endpoint.

If you later want to disable/enable the CDN, your streaming endpoint must be in the **stopped** state. It could take up to two hours for the Azure CDN integration to get enabled and for the changes to be active across all the CDN POPs. However, you can start your streaming endpoint and stream without interruptions from the streaming endpoint. Once the integration is complete, the stream is delivered from the CDN. During the provisioning period, your streaming endpoint will be in the **starting** state and you might observe degraded performance.

When the Standard streaming endpoint is created, it's configured by default with Standard Verizon. You can configure Premium Verizon or Standard Akamai providers using REST APIs.

Azure Media Services integration with Azure CDN is implemented on **Azure CDN from Verizon** for standard streaming endpoints. Premium streaming endpoints can be configured using all **Azure CDN pricing tiers and providers**.

> [!NOTE]
> For details about Azure CDN, see the [CDN overview](../../cdn/cdn-overview.md).

## Determine if a DNS change was made

You can determine if DNS change was made on a streaming endpoint (the traffic is being directed to the Azure CDN) by using <https://www.digwebinterface.com>. If you see azureedge.net domain names in the results, the traffic is now being pointed to the CDN.

## Origin-Assist CDN-Prefetch

CDN caching is a reactive process. If CDN can predict what the next object will be requested, CDN can proactively request and cache the next object. With this process, you can achieve a cache-hit for all (or most) of the objects, which improves performance.

The concept of prefetching strives to position objects at the "edge of the internet" in anticipation that these will be requested by the player imminently, thereby reducing the time to deliver that object to the player.

To achieve this goal, a streaming endpoint (origin) and CDN need to work hand-in-hand in a couple ways:

- The Media Services origin needs to have the "intelligence" (Origin-Assist) to inform CDN the next object to prefetch.
- CDN does the prefetch and caching (CDN-prefetch part). CDN also needs to have the "intelligence" to inform the origin whether it's a prefetch or a regular fetch, handle the 404 responses, and a way to avoid endless prefetch loop.

### Benefits

The benefits of the *Origin-Assist CDN-Prefetch* feature includes:

- Prefetch improves video playback quality by pre-positioning anticipated video segments at the edge during playback, reducing latency to the viewer, and improving video segment download times. This results in faster video start-up time and lower rebuffering occurrences.
- This concept is applicable to general CDN-origin scenario and isn't limited to media.
- Akamai has added this feature to [Akamai Cloud Embed (ACE)](https://learn.akamai.com/en-us/products/media_delivery/cloud_embed.html).

> [!NOTE]
> This feature is not yet applicable to the Akamai CDN integrated with Media Services streaming endpoint. However, it's available for Media Services customers that have a pre-existing Akamai contract and require custom integration between Akamai CDN and the Media Services origin.

### How it works

CDN support for the `Origin-Assist CDN-Prefetch` headers (for both live and video on-demand streaming) is available to customers who have direct contract with Akamai CDN. The feature involves the following HTTP header exchanges between Akamai CDN and the Media Services origin:

|HTTP header|Values|Sender|Receiver|Purpose|
| ---- | ---- | ---- | ---- | ----- |
|`CDN-Origin-Assist-Prefetch-Enabled` | 1 (default) or 0 |CDN|Origin|To indicate CDN is prefetch enabled.|
|`CDN-Origin-Assist-Prefetch-Path`| Example: <br/>Fragments(video=1400000000,format=mpd-time-cmaf)|Origin|CDN|To provide prefetch path to CDN.|
|`CDN-Origin-Assist-Prefetch-Request`|1 (prefetch request) or 0 (regular request)|CDN|Origin|To indicate the request from CDN is a prefetch.|

To see part of the header exchange in action, you can try the following steps:

1. Use Postman or cURL to issue a request to the Media Services origin for an audio or video segment or fragment. Make sure to add the header `CDN-Origin-Assist-Prefetch-Enabled: 1` in the request.
2. In the response, you should see the header `CDN-Origin-Assist-Prefetch-Path` with a relative path as its value.

### Supported streaming protocols

The `Origin-Assist CDN-Prefetch` feature supports the following streaming protocols for live and on-demand streaming:

* HLS v3
* HLS v4
* HLS CMAF
* DASH (CSF)
* DASH (CMAF)
* Smooth streaming

### FAQs

* What if a prefetch path URL is invalid so that CDN prefetch gets a 404?

    CDN will only cache a 404 response for 10 seconds (or other configured value).

* Suppose you have an on-demand video. If CDN-prefetch is enabled, does this feature imply that once a client requests the first video segment, prefetch will start a loop to prefetch all subsequent video segments at the same bitrate?

    No, CDN-prefetch is done only after a client-initiated request/response. CDN-prefetch is never triggered by a prefetch, to avoid a prefetch loop.

* Is Origin-Assist CDN-Prefetch feature always on? How can it be turned on/off?

    This feature is off by default. Customers need to turn it on via Akamai API.

* For live streaming, what would happen to Origin-Assist if the next segment or fragment isn't yet available?

    In this case, the Media Services origin won't provide `CDN-Origin-Assist-Prefetch-Path` header and CDN-prefetch will not occur.

* How does `Origin-Assist CDN-Prefetch` work with dynamic manifest filters?

    This feature works independently of manifest filter. When the next fragment is out of a filter window, its URL will still be located by looking into the raw client manifest and then returned as CDN prefetch response header. So CDN will get the URL of a fragment that's filtered out from DASH/HLS/Smooth manifest. However, the player will never make a GET request to CDN to fetch that fragment, because that fragment isn't included in the DASH/HLS/Smooth manifest held by the player (the player doesn't know that fragment's existence).

* Can DASH MPD/HLS playlist/Smooth manifest be prefetched?

    No, DASH MPD, HLS master playlist, HLS variant playlist, or smooth manifest URL isn't added to the prefetch header.

* Are prefetch URLs relative or absolute?

    While Akamai CDN allows both, the Media Services origin only provides relative URLs for prefetch path because there's no apparent benefit in using absolute URLs.

* Does this feature work with DRM-protected contents?

    Yes, since this feature works at the HTTP level, it doesn't decode or parse any segment/fragment. It doesn't care whether the content is encrypted or not.

* Does this feature work with Server Side Ad Insertion (SSAI)?
    
    It does for original/main content (the original video content before ad insertion) works, since SSAI doesn't change the timestamp of the source content from the Media Services origin. Whether this feature works with ad contents depends on whether ad origin supports Origin-Assist. For example, if ad contents are also hosted in Azure Media Services (same or separate origin), ad contents will also be prefetched.

* Does this feature work with UHD/HEVC contents?

    Yes.

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## Next steps

* Make sure to review the [Streaming Endpoint (origin)](streaming-endpoint-concept.md) document.
* The sample [in this repository](https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts/blob/master/AMSV3Quickstarts/EncodeAndStreamFiles/Program.cs) shows how to start the default streaming endpoint with .NET.
