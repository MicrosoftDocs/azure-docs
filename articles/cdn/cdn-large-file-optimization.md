---
title: Large file download optimization with Azure Content Delivery Network
description: Learn how large file downloads can be optimized in Azure Content Delivery Network. This article includes several scenarios.
services: cdn
author: duongau
manager: kumudd
ms.service: azure-cdn
ms.topic: how-to
ms.date: 03/20/2024
ms.author: duau
---

# Large file download optimization with Azure Content Delivery Network

File sizes of content delivered over the internet continue to grow due to enhanced functionality, improved graphics, and rich media content. This growth gets driven by many factors: broadband penetration, larger inexpensive storage devices, widespread increase of high definition video, and internet-connected devices (IoT). A fast and efficient delivery mechanism for large files is critical to ensure a smooth and enjoyable consumer experience.

Delivery of large files has several challenges. First, the average time to download a large file can be significant because applications might not download all data sequentially. In some cases, applications might download the last part of a file before the first part. When only a small amount of a file is requested or a user pauses a download, the download can fail. The download also might be delayed until after the content delivery network retrieves the entire file from the origin server.

Second, the latency between a user's machine and the file determines the speed at which they can view content. In addition, network congestion and capacity problems also affect throughput. Greater distances between servers and users create more opportunities for packet loss to occur, which reduces quality. The reduction in quality caused by limited throughput and increased packet loss might increase the wait time for a file download to finish.

Third, many large files aren't delivered in their entirety. Users might cancel a download halfway through or watch only the first few minutes of a long MP4 video. Therefore, software and media delivery companies want to deliver only the portion of a file that's requested. Efficient distribution of the requested portions reduces the egress traffic from the origin server. Efficient distribution also reduces the memory and I/O pressure on the origin server.

<a name='optimize-for-delivery-of-large-files-with-azure-cdn-from-microsoft'></a>

## Optimize for delivery of large files with Azure Content Delivery Network from Microsoft

**Azure CDN Standard from Microsoft** endpoints deliver large files without a cap on file size. Extra features are turned on by default to make delivery of large files faster.

### Object chunking

**Azure CDN Standard from Microsoft** uses a technique called object chunking. When a large file is requested, the content delivery network retrieves smaller pieces of the file from the origin. After the content delivery network POP server receives a full or byte-ranges file request, the content delivery network edge server requests the file from the origin in chunks of 8 MB.

After the chunk arrives at the content delivery network edge, it's cached and immediately served to the user. The content delivery network then prefetches the next chunk in parallel. This prefetch ensures that the content stays one chunk ahead of the user, which reduces latency. This process continues until the entire file gets downloaded (if requested), all byte ranges are available (if requested), or the client terminates the connection.

For more information on the byte-range request, see [RFC 7233](https://tools.ietf.org/html/rfc7233).

The content delivery network caches any chunks as they're received. The entire file doesn't need to be cached on the content delivery network cache. Subsequent requests for the file or byte ranges are served from the content delivery network cache. If not all the chunks are cached on the content delivery network, prefetch is used to request chunks from the origin. This optimization relies on the ability of the origin server to support byte-range requests. If the origin server doesn't support byte-range requests, requests to download data greater than 8-MB size fails.

### Conditions for large file optimization

There are no limits on maximum file size.

### Chunked Transfer Encoding Support

Microsoft content delivery network supports transfer encoding responses, but only up to a maximum content size limit of 8 MB. In the case of chunked transfer encoded responses exceeding 8 MB, the Microsoft content delivery network will only cache and serve the initial 8 MB of content.

<a name='optimize-for-delivery-of-large-files-with-azure-cdn-from-verizon'></a>

<a name='optimize-for-delivery-of-large-files-with-azure-cdn-from-edgio'></a>

## Optimize for delivery of large files with Azure Content Delivery Network from Edgio

**Azure CDN Standard from Edgio** and **Azure CDN Premium from Edgio** endpoints deliver large files without a cap on file size. More features are turned on by default to make delivery of large files faster.

### Complete cache fill

The defaults complete cache fill feature enables the content delivery network to pull a file into the cache when an initial request is abandoned or lost.

Complete cache fill is most useful for large assets. Typically, users don't download them from start to finish. They use progressive download. The default behavior forces the edge server to initiate a background fetch of the asset from the origin server. Afterward, the asset is in the edge server's local cache. After the full object is in the cache, the edge server fulfills byte-range requests to the content delivery network for the cached object.

The default behavior can be disabled through the rules engine in **Azure CDN Premium from Edgio**.

### Peer cache fill hot-filing

The default peer cache fills hot-filing feature uses a sophisticated proprietary algorithm. It uses extra edge caching servers based on bandwidth and aggregate requests metrics to fulfill client requests for large, highly popular objects. This feature prevents a situation in which large numbers of extra requests are sent to a user's origin server.

### Conditions for large file optimization

Large file optimization features for **Azure CDN Standard from Edgio** and **Azure CDN Premium from Edgio** are turned on by default when you use the general web delivery optimization type. There are no limits on maximum file size.

## Other considerations

Consider the following aspects for this optimization type:

- The chunking process generates more requests to the origin server. However, the overall volume of data delivered from the origin is smaller. Chunking results in better caching characteristics at the content delivery network.

- Memory and I/O pressure are reduced at the origin because smaller pieces of the file are delivered.

- For chunks cached at the content delivery network, there are no other requests to the origin until the content expires or it's evicted from the cache.

- Users can make range requests to the content delivery network, which are treated like any normal file. Optimization applies only if it's a valid file type and the byte range is between 10 MB and 150 GB. If the average file size requested is smaller than 10 MB, use general web delivery instead.
