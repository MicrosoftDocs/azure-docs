---
title: Media streaming optimization with Azure Content Delivery Network
description: Learn about options to optimize streaming media in Azure Content Delivery Network, such as partial cache sharing and cache fill wait time.
services: cdn
author: duongau
manager: kumudd
ms.service: azure-cdn
ms.topic: how-to
ms.date: 03/20/2024
ms.author: duau
---

# Media streaming optimization with Azure Content Delivery Network

Use of high definition video is increasing on the internet, which creates difficulties for efficient delivery of large files. Customers expect smooth playback of video on demand or live video assets on various networks and clients all over the world. A fast and efficient delivery mechanism for media streaming files is critical to ensure a smooth and enjoyable consumer experience.

Live streaming media is especially difficult to deliver because of the large sizes and number of concurrent viewers. Long delays cause users to leave. Because live streams can't be cached ahead of time and large latencies aren't acceptable to viewers, video fragments must be delivered in a timely manner.

The request patterns of streaming also provide some new challenges. When a popular live stream or a new series is released for video on demand, thousands to millions of viewers might request the stream at the same time. In this case, smart request consolidation is vital to not overwhelm the origin servers when the assets aren't cached yet.

<a name='media-streaming-optimizations-for-azure-cdn-from-microsoft'></a>

## Media streaming optimizations for Azure Content Delivery Network from Microsoft

**Azure CDN Standard from Microsoft** endpoints deliver streaming media assets directly by using the general web delivery optimization type.

Media streaming optimization for **Azure CDN Standard from Microsoft** is effective for live or video-on-demand streaming media that uses individual media fragments for delivery. This process is different from a single large asset transferred via progressive download or by using byte-range requests. For information on that style of media delivery, see [Large file download optimization with Azure Content Delivery Network](cdn-large-file-optimization.md).

The general media delivery or video-on-demand media delivery optimization types use Azure Content Delivery Network with back-end optimizations to deliver media assets faster. They also use configurations for media assets based on best practices learned over time.

### Partial cache sharing

Partial cache sharing allows the content delivery network to serve partially cached content to new requests. For example, if the first request to the content delivery network results in a cache miss, the request is sent to the origin. Although this incomplete content is loaded into the content delivery network cache, other requests to the content delivery network can start getting this data.

<a name='media-streaming-optimizations-for-azure-cdn-from-verizon'></a>

<a name='media-streaming-optimizations-for-azure-cdn-from-edgio'></a>

## Media streaming optimizations for Azure Content Delivery Network from Edgio

**Azure CDN Standard from Edgio** and **Azure CDN Premium from Edgio** endpoints deliver streaming media assets directly by using the general web delivery optimization type. A few features on the content delivery network directly help delivering media assets by default.

### Partial cache sharing

Partial cache sharing allows the content delivery network to serve partially cached content to new requests. For example, if the first request to the content delivery network results in a cache miss, the request is sent to the origin. Although this incomplete content is loaded into the content delivery network cache, other requests to the content delivery network can start getting this data.

### Cache fill wait time

The cache fill wait time feature forces the edge server to hold any subsequent requests for the same resource until HTTP response headers arrive from the origin server. If HTTP response headers from the origin arrive before the timer expires, all requests that were put on hold are served out of the growing cache. At the same time, the cache is filled by data from the origin. By default, the cache fill wait time is set to 3,000 milliseconds.
