---
title: Large File Download Optimization via Azure CDN
description: Optimizing large file downloads deep dive
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
# Large file download optimization via Azure CDN

File sizes of content delivered over the Internet have grown steadily due to enhanced functionality, improved graphics, and rich media content. This growth is driven by many factors:  broadband penetration, larger inexpensive storage devices, proliferation of high-definition video, Internet connected devices (IoT), etc. Providing a fast and efficient delivery mechanism for large files is critical to ensure a smooth and enjoyable consumer experience.

There are several challenges inherent in delivering large files. First, the average time to download a large file can be significant because many applications might not download all data sequentially. In some cases, applications might download the last part of a file before the first. Then when only a small amount of a file is requested, or a user pauses a download, the download can fail. The download also might be delayed until after the entire file is retrieved from the origin by the CDN. 

Second, with so many large files on the Internet, users notice that the latency between their machne and the file determines the speed at which they can view content. In addition, network congestion and capacity problems further impact throughput. These problems, along with the greater distance between server and user, create additional opportunities for packet loss to occur, further reducing quality. The reduction in quality caused by limited throughput and increased packet loss might increase the wait time for a file download to complete. 

Third, many large files are not delivered in their entirety. Users might cancel a download halfway through or watch only the first few minutes of a long MP4 video. Therefore, it's helpful to many software and media delivery companies to deliver only the portion of a file that's requested by the user. Because the requested portions are efficiently distributed to the farthest reaches of the Internet, the egress traffic is reduced from the origin. Therefore, the memory and IO pressure are reduced on the origin server. 

Azure CDN from Akamai now offers a feature to deliver large files efficiently to users across the globe at scale. The feature reduces latencies while it reduces the load on the origin servers. It's available through the Optimized For feature on Azure CDN Endpoint created under an Azure CDN Profile with the Standard Akamai pricing tier.

## Configure a CDN endpoint to optimize delivery of large files

You can configure your CDN endpoint to optimize delivery for large files via the Azure portal.  When you create the endpoint, select the **Large File Download** option under **Optimized For**. You can also use our REST APIs or any of the client SDKs to do this. The screenshots below illustrate the process via the Azure portal.

![New CDN endpoint](./media/cdn-large-file-optimization/01_Adding.png)	
 
*Figure 1: Add a new CDN endpoint from the CDN Profile*
 
![Large File Optimization selected](./media/cdn-large-file-optimization/02_Creating.png)

*Figure 2: Create a CDN endpoint with Large File Download Optimization selected*

After the CDN endpoint is created, it applies the large file optimizations for all files that match certain criteria. The following section describes this process in detail.

## Optimize for delivery of large files with Azure CDN from Akamai

The large file optimization type feature turns on network optimizations and configurations to deliver large files faster and more responsively. General web delivery with Akamai caches files only below 1.8 GB and can tunnel (not cache) files up to 150 GB. Large file optimization caches files up to 150 GB.

Large file optimization is effective when certain conditions are satisfied, such as how the origin server operates and the sizes and types of the files that are requested. Before we get into details on each of these subjects, you should understand how the optimization works. 

### Object chunking 

Azure CDN from Akamai uses a technique called object chunking. When a large file is requested, the CDN retrieves smaller pieces of the file from the origin. After the CDN edge/POP server receives a full or byte range file request, it checks whether the file type is supported for this optimization. It also checks whether the file type meets the file size requirements. If the file size is greater than 10 MB, the CDN edge server requests the file from the origin server in chunks of 2 MB. After the chunk arrives at the CDN edge, it's cached and immediately served to the user. The CDN prefetches the next chunk in parallel. This prefetch ensures that the content stays one chunk ahead of the user, which reduces latency. This process continues until the entire file is downloaded (if requested), all byte ranges are available (if requested), or the client terminates the connection. 

For more information on the byte range request, see [RFC 7233](https://tools.ietf.org/html/rfc7233).

The CDN caches any chunks as they are received, and doesn’t require the entire file to be cached on the CDN cache. Subsequent requests for the file or byte ranges are served from the CDN cache. Prefetch is used to request chunks from the origin if not all chunks are cached on the CDN. This optimization relies on the ability of the origin server to support byte range requests. _If the origin server doesn't support byte range requests, this optimization will not be effective._ 

### Caching
Large file optimization uses different default caching-expiration times than general web delivery. It differentiates between positive caching and negative caching based on HTTP response codes. If the origin specifies a time by using an expiration time via a Cache-Control or Expires header in the response, the CDN accepts that value. When the origin doesn’t specify and the file matches the type and size conditions for this optimization type, the CDN uses the default values for large file optimization. Otherwise, the CDN uses defaults for general web delivery.


|    | General web | Large file optimization 
--- | --- | --- 
Caching: Positive <br> HTTP 200, 203, 300, <br> 301, 302, and 410 | 7 days |1 day  
Caching: Negative <br> HTTP 204, 305, 404, <br> and 405 | none | 1 second 

### Deal with origin failure

The origin read-timeout length increases from 2 seconds for general web delivery to 2 minutes for the large file optimization type. This increase accounts for the larger file sizes to avoid a premature timeout connection.

As with general web delivery, when a connection times out, we retry a certain number of times before a 504 Gateway Time-out error is sent to the client. 

### Conditions for large file optimization

The following table lists the set of criteria to be satisfied for large file optimization:

Condition | Values 
--- | --- 
Supported file types | 3g2, 3gp, asf, avi, bz2, dmg, exe, f4v, flv, <br> gz, hdp, iso, jxr, m4v, mkv, mov, mp4, <br> mpeg, mpg, mts, pkg, qt, rm, swf, tar, <br> tgz, wdp, webm, webp, wma, wmv, zip  
Minimum file size | 10 MB 
Maximum file size | 150 GB 
Origin server characteristics | Must support byte range requests 

## Optimize for delivery of large files with Azure CDN from Verizon

Azure CDN from Verizon can deliver large files without a cap on file size, and has various features that make delivery of large files faster turned on by default.

### Complete Cache Fill

Azure CDN from Verizon has a default feature called Complete Cache Fill in which the CDN pulls a file into cache when the initial request is abandoned or lost. 

This feature is most useful for large assets where users will not typically download them from start to finish (for example, progressive download videos). As a result, this feature is enabled by default with Azure CDN from Verizon. This default behavior forces the edge server to initiate a background fetch of the asset from the origin server. After which, the asset is in the edge server's local cache. After the full object is in cache, the edge can fulfill byte-range requests to the CDN for the cached object.

The default Complete Cache Fill behavior can be disabled through Rules Engine in the Verizon Premium tier.

### Peer Cache Fill Hotfiling

This is a default feature of Azure CDN from Verizon, in which a sophisticated proprietary algorithm might leverage additional edge caching servers based on metrics such as bandwidth and aggregate requests to fulfill client requests for large, highly popular objects. This prevents a situation in which large numbers of extra requests would be sent to a customer’s origin server. 

### Conditions for large file optimization

The optimization features for Verizon are turned on by default, and there are no limits on maximum file size. 

## Additional considerations

There are a few additional aspects to be considered while using this optimization type.
 
### Azure CDN from Akamai

- The chunking process results in additional requests to the origin server, but the overall volume of data delivered from the origin will be considerably smaller since chunking results in better caching characteristics at the CDN.
- There will also be an added benefit of reduced memory and IO pressure at the origin because of delivering smaller pieces of the file. 
- For the chunks that are cached at the CDN, there will not be additional requests to the origin until the content expires from the cache or it is evicted from the cache due to other reasons. 
- The user can make range requests to the CDN and they will just be treated like any normal file. Optimization will only apply if it is a valid file type and the byte range is between 10MB and 150GB.If your average file size requested is smaller than 10 MB, you might want to use general web delivery instead.

### Azure CDN from Verizon

The general web delivery optimization can deliver large files.
