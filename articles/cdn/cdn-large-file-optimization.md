---
title: Large file download optimization via the Azure Content Delivery Network
description: Optimization of large file downloads explained in depth
services: cdn
documentationcenter: ''
author: smcevoy
manager: erikre
editor: ''

ms.assetid:
ms.service: cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/16/2017
ms.author: v-semcev
---
# Large file download optimization via the Azure Content Delivery Network

File sizes of content delivered over the Internet continue to grow due to enhanced functionality, improved graphics, and rich media content. This growth is driven by many factors: broadband penetration, larger inexpensive storage devices, widespread increase of high-definition video, and Internet-connected devices (IoT). A fast and efficient delivery mechanism for large files is critical to ensure a smooth and enjoyable consumer experience.

Delivery of large files has several challenges. First, the average time to download a large file can be significant because applications might not download all data sequentially. In some cases, applications might download the last part of a file before the first part. When only a small amount of a file is requested or a user pauses a download, the download can fail. The download also might be delayed until after the entire file is retrieved from the origin server by the content delivery network. 

Second, the latency between a user's machine and the file determines the speed at which they can view content. In addition, network congestion and capacity problems also affect throughput. Greater distances between servers and users create additional opportunities for packet loss to occur, which reduces quality. The reduction in quality caused by limited throughput and increased packet loss might increase the wait time for a file download to complete. 

Third, many large files are not delivered in their entirety. Users might cancel a download halfway through or watch only the first few minutes of a long MP4 video. Therefore, many software and media delivery companies want to deliver only the portion of a file that's requested by the user. Because the requested portions are efficiently distributed to the farthest reaches of the Internet, the egress traffic is reduced from the origin server. Efficient distribution reduces the memory and I/O pressure on the origin server. 

The Azure Content Delivery Network from Akamai now offers a feature that delivers large files efficiently to users across the globe at scale. The feature reduces latencies because it reduces the load on the origin servers. This feature is available with the Standard Akamai pricing tier.

## Configure a content delivery network endpoint to optimize delivery of large files

You can configure your content delivery network endpoint to optimize delivery for large files via the Azure portal. You can also use our REST APIs or any of the client SDKs to do this. The following steps show the process via the Azure portal.

1. To add a new endpoint, on the **CDN profile** page, select **+Endpoint**.

    ![New endpoint](./media/cdn-large-file-optimization/01_Adding.png)	
 
2. In the **Optimized for** drop-down list box, select **Large file download**. Click **Add**.

    ![Large file optimization selected](./media/cdn-large-file-optimization/02_Creating.png)


After you create the content delivery network endpoint, it applies the large file optimizations for all files that match certain criteria. The following section describes this process.

## Optimize for delivery of large files with the Azure Content Delivery Network from Akamai

The large file optimization type feature turns on network optimizations and configurations to deliver large files faster and more responsively. General web delivery with Akamai caches files only below 1.8 GB and can tunnel (not cache) files up to 150 GB. Large file optimization caches files up to 150 GB.

Large file optimization is effective when certain conditions are satisfied. Conditions include how the origin server operates and the sizes and types of the files that are requested. Before we get into details on these subjects, you should understand how the optimization works. 

### Object chunking 

The Azure Content Delivery Network from Akamai uses a technique called object chunking. When a large file is requested, the content delivery network retrieves smaller pieces of the file from the origin. After the content delivery network edge/POP server receives a full or byte-range file request, it checks whether the file type is supported for this optimization. It also checks whether the file type meets the file size requirements. If the file size is greater than 10 MB, the content delivery network edge server requests the file from the origin server in chunks of 2 MB. 

After the chunk arrives at the content delivery network edge, it's cached and immediately served to the user. The content delivery network then prefetches the next chunk in parallel. This prefetch ensures that the content stays one chunk ahead of the user, which reduces latency. This process continues until the entire file is downloaded (if requested), all byte ranges are available (if requested), or the client terminates the connection. 

For more information on the byte-range request, see [RFC 7233](https://tools.ietf.org/html/rfc7233).

The content delivery network caches any chunks as they're received and doesn’t require the entire file to be cached on the content delivery network cache. Subsequent requests for the file or byte ranges are served from the content delivery network cache. If not all the chunks are cached on the content delivery network, prefetch is used to request chunks from the origin. This optimization relies on the ability of the origin server to support byte-range requests. _If the origin server doesn't support byte-range requests, this optimization will not be effective._ 

### Caching
Large file optimization uses different default caching-expiration times from general web delivery. It differentiates between positive caching and negative caching based on HTTP response codes. If the origin server specifies an expiration time via a cache-control or expires header in the response, the content delivery network honors that value. When the origin doesn’t specify and the file matches the type and size conditions for this optimization type, the content delivery network uses the default values for large file optimization. Otherwise, the content delivery network uses defaults for general web delivery.


|    | General web | Large file optimization 
--- | --- | --- 
Caching: Positive <br> HTTP 200, 203, 300, <br> 301, 302, and 410 | 7 days |1 day  
Caching: Negative <br> HTTP 204, 305, 404, <br> and 405 | none | 1 second 

### Deal with origin failure

The origin read-timeout length increases from two seconds for general web delivery to two minutes for the large file optimization type. This increase accounts for the larger file sizes to avoid a premature timeout connection.

When a connection times out, the content delivery network retries a number of times before it sends a "504 - Gateway Timeout" error to the client. 

### Conditions for large file optimization

The following table lists the set of criteria to be satisfied for large file optimization:

Condition | Values 
--- | --- 
Supported file types | 3g2, 3gp, asf, avi, bz2, dmg, exe, f4v, flv, <br> gz, hdp, iso, jxr, m4v, mkv, mov, mp4, <br> mpeg, mpg, mts, pkg, qt, rm, swf, tar, <br> tgz, wdp, webm, webp, wma, wmv, zip  
Minimum file size | 10 MB 
Maximum file size | 150 GB 
Origin server characteristics | Must support byte-range requests 

## Optimize for delivery of large files with the Azure Content Delivery Network from Verizon

The Azure Content Delivery Network from Verizon can deliver large files without a cap on file size. Additional features are turned on by default to make delivery of large files faster.

### Complete cache fill

This default feature enables the content delivery network to pull a file into the cache when an initial request is abandoned or lost. 

This feature is most useful for large assets. Typically, users don't download them from start to finish. They use progressive download. The default behavior forces the edge server to initiate a background fetch of the asset from the origin server. Afterwards, the asset is in the edge server's local cache. After the full object is in the cache, the edge server can fulfill byte-range requests to the content delivery network for the cached object.

The default behavior can be disabled through the Rules Engine in the Verizon Premium tier.

### Peer cache fill hot-filing

This default feature uses a sophisticated proprietary algorithm. It uses additional edge caching servers based on bandwidth and aggregate requests metrics to fulfill client requests for large, highly popular objects. This feature prevents a situation in which large numbers of extra requests are sent to a user's origin server. 

### Conditions for large file optimization

The optimization features for Verizon are turned on by default. There are no limits on maximum file size. 

## Additional considerations

Some additional aspects should be considered for this optimization type.
 
### Azure Content Delivery Network from Akamai

- The chunking process generates additional requests to the origin server. However, the overall volume of data delivered from the origin is much smaller. Chunking results in better caching characteristics at the content delivery network.
- Memory and I/O pressure are reduced at the origin because smaller pieces of the file are delivered. 
- For chunks that are cached at the content delivery network, there are no additional requests to the origin until the content expires or it's evicted from the cache. 
- Users can make range requests to the content delivery network, and they're treated like any normal file. Optimization applies only if it's a valid file type and the byte range is between 10 MB and 150 GB. If the average file size requested is smaller than 10 MB, you might want to use general web delivery instead.

### Azure Content Delivery Network from Verizon

The general web delivery optimization type can deliver large files.
