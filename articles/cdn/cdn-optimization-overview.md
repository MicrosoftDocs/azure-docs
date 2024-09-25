---
title: Optimize Azure Content Delivery Network for the type of content delivery
description: Learn how Azure Content Delivery Network can optimize delivery based on type of content. Optimization best practices improve performance and origin offload.
services: cdn
author: duongau
ms.service: azure-cdn
ms.topic: how-to
ms.date: 03/20/2024
ms.author: duau
---

# Optimize Azure Content Delivery Network for the type of content delivery

When you deliver content to a large global audience, it's critical to ensure the optimized delivery of your content. [Azure Content Delivery Network](cdn-overview.md) can optimize the delivery experience based on the type of content you have. The content can be a website, a live stream, a video, or a large file for download. When you create a content delivery network endpoint, you specify a scenario in the **Optimized for** option. Your choice determines which optimization is applied to the content delivered from the content delivery network endpoint.

Optimization choices are designed to use best-practice behaviors to improve content delivery performance and better origin offload. Your scenario choices affect performance by modifying configurations for partial caching, object chunking, and the origin failure retry policy.

This article provides an overview of various optimization features and when you should use them. For more information on features and limitations, see the respective articles on each individual optimization type.

> [!NOTE]
> When you create a content delivery network endpoint, the **Optimized for** options can vary based on the type of profile the endpoint is created in. Azure Content Delivery Network providers apply enhancement in different ways, depending on the scenario.

## Provider options

**Azure CDN Standard from Microsoft** profiles supports the following optimizations:

- [General web delivery](#general-web-delivery). This optimization is also used for media streaming and large file download.

> [!NOTE]
> Dynamic site acceleration from Microsoft is offered via [Azure Front Door](../frontdoor/front-door-overview.md).

**Azure CDN Standard from Edgio** and **Azure CDN Premium from Edgio** profiles support the following optimizations:

- [General web delivery](#general-web-delivery). This optimization is also used for media streaming and large file download.

- [Dynamic site acceleration](#dynamic-site-acceleration)

## Optimization for specific scenarios

You can optimize the content delivery network endpoint for one of these scenarios.

### General web delivery

General web delivery is the most common optimization option. It's designed for general web content optimization, such as webpages and web applications. This optimization also can be used for file and video downloads.

A typical website contains static and dynamic content. Static content includes images, JavaScript libraries, and style sheets that can be cached and delivered to different users. Dynamic content is personalized for an individual user, such as news items that are tailored to a user profile. Dynamic content, such as shopping cart contents, isn't cached because it's unique to each user. General web delivery can optimize your entire website.

### General media streaming

If you need to use the endpoint for live streaming and video-on-demand streaming, select the general media streaming optimization type.

Media streaming is time-sensitive, because packets that arrive late on the client, such as frequent buffering of video content, can cause a degraded viewing experience. Media streaming optimization reduces the latency of media content delivery and provides a smooth streaming experience for users.

This scenario is common for Azure media service customers. When you use Azure Media Services, you get a single streaming endpoint that can be used for both live and on-demand streaming. With this scenario, customers don't need to switch to another endpoint when they change from live to on-demand streaming. General media streaming optimization supports this type of scenario.

For **Azure CDN Standard from Microsoft**, **Azure CDN Standard from Edgio**, and **Azure CDN Premium from Edgio**, use the general web delivery optimization type to deliver general streaming media content.

For more information about media streaming optimization, see [Media streaming optimization](cdn-media-streaming-optimization.md).

### Video-on-demand media streaming

Video-on-demand media streaming optimization improves video-on-demand streaming content. If you use an endpoint for video-on-demand streaming, use this option.

For **Azure CDN Standard from Microsoft**, **Azure CDN Standard from Edgio**, and **Azure CDN Premium from Edgio** profiles, use the general web delivery optimization type to deliver video-on-demand streaming media content.

For more information about media streaming optimization, see [Media streaming optimization](cdn-media-streaming-optimization.md).

> [!NOTE]
> If the content delivery network endpoint primarily serves video-on-demand content, use this optimization type. The major difference between this optimization type and the general media streaming optimization type is the connection retry time-out. The time-out is much shorter to work with live streaming scenarios.
>

### Large file download

For **Azure CDN Standard from Microsoft**, **Azure CDN Standard from Edgio**, and **Azure CDN Premium from Edgio** profiles, use the general web delivery optimization type to deliver large file download content. There's no limitation on file download size.

For more information about large file optimization, see [Large file optimization](cdn-large-file-optimization.md).

### Dynamic site acceleration

Dynamic site acceleration (DSA) is available for **Azure CDN Standard from Edgio**, and **Azure CDN Premium from Edgio** profiles. This optimization involves an extra fee to use; for more information, see [Content Delivery Network pricing](https://azure.microsoft.com/pricing/details/cdn/).

> [!NOTE]
> Dynamic site acceleration from Microsoft is offered via [Azure Front Door](../frontdoor/front-door-overview.md) which is a global [anycast](https://en.wikipedia.org/wiki/Anycast) service using Microsoft's private global network to deliver your app workloads.

DSA includes various techniques that benefit the latency and performance of dynamic content. Techniques include route and network optimization, TCP optimization, and more.

You can use this optimization to accelerate a web app that includes numerous responses that aren't cacheable. Examples are search results, checkout transactions, or real-time data. You can continue to use core Azure Content Delivery Network caching capabilities for static data.

For more information about dynamic site acceleration, see [Dynamic site acceleration](cdn-dynamic-site-acceleration.md).
