---
title: What is Azure Content Delivery Network?| Microsoft Docs
description: Learn what Azure Content Delivery Network (CDN) is and how to use it to deliver high-bandwidth content by caching blobs and static content.
services: cdn
documentationcenter: ''
author: dksimpson
manager: akucer
editor: ''

ms.assetid: 866e0c30-1f33-43a5-91f0-d22f033b16c6
ms.service: cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 02/22/2018
ms.author: rli
ms.custom: mvc

---
# What is Azure Content Delivery Network?

A content delivery network (CDN) is a distributed network of servers that can efficiently deliver web content to users. CDNs store cached content on edge servers that are close to end users, to minimize latency. The benefits of using a CDN to cache web site assets include:

* Better performance and improved user experience for end users, especially when using applications in which multiple round-trips are required to load content.
* Large scaling to better handle instantaneous high loads, such as the start of a product launch event.
* Distribution of user requests and serving of content directly from edge servers so that less traffic is sent to the origin server.

Azure Content Delivery Network offers developers a global solution for rapidly delivering high-bandwidth content to users by caching their content at strategically placed physical nodes across the world. To see a list of current CDN node locations, see [Azure CDN POP locations](cdn-pop-locations.md).

To use Azure CDN, you must create at least one CDN profile. A CDN profile is a collection of CDN endpoints; each profile can contain one or more CDN endpoints. Every CDN endpoint in your profile represents a specific configuration of content deliver behavior and access. To organize your CDN endpoints by internet domain, web application, or some other criteria, you can use multiple profiles. Because [Azure CDN pricing](https://azure.microsoft.com/pricing/details/cdn/) is applied at the CDN profile level, you must create multiple CDN profiles if you want to use a mix of pricing tiers.

To use Azure CDN, you must own at lease one Azure subscription. Each Azure subscription has default limits for the following resources:
 - The number of CDN profiles that can be created
 - The number of endpoints that can be created in a CDN profile 
 - The number of custom domains that can be mapped to an endpoint

For more information about CDN subscription limits, see [CDN limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#cdn-limits).


## How it works
![CDN Overview](./media/cdn-overview/cdn-overview.png)

1. A user (Alice) requests a file (also called an asset) by using a URL with a special domain name, such as `<endpointname>.azureedge.net`. 
    
2. The DNS routes the request to the best performing point-of-presence (POP) location, which is usually the POP that is geographically closest to the user.
    
3. If the edge servers in the POP do not have the file in their cache, the edge server requests the file from the origin server. 

    The origin server can be an Azure Web App, Azure Cloud Service, Azure Storage account, or any publicly accessible web server.
   
4. The origin returns the file to the edge server.
    
5. The edge server caches the file and returns the file to the original requestor (Alice). 
 
    The file remains cached on the edge server until the time-to-live (TTL) specified by its HTTP headers expires. If the origin didn't specify a TTL, the default TTL is seven days.
    
6. Additional users can then request the same file by using the same URL that Alice used, and can also be directed to the same POP.
    
7. If the TTL for the file hasn't expired, the edge server returns the file directly from the cache. This process results in a faster, more responsive user experience.

## Azure CDN features
There are three Azure CDN products: **Azure CDN Standard from Akamai**, **Azure CDN Standard from Verizon**, and **Azure CDN Premium from Verizon**. The following table lists the features available with each product.

| **Performance features and optimizations** | Standard Akamai | Standard Verizon | Premium Verizon |
| --- | --- | --- | --- |
| [Dynamic site acceleration](https://docs.microsoft.com/azure/cdn/cdn-dynamic-site-acceleration) | **&#x2713;**  | **&#x2713;** | **&#x2713;** |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Dynamic site acceleration - adaptive image compression](https://docs.microsoft.com/azure/cdn/cdn-dynamic-site-acceleration#adaptive-image-compression-akamai-only) | **&#x2713;**  |  |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Dynamic site acceleration - object prefetch](https://docs.microsoft.com/azure/cdn/cdn-dynamic-site-acceleration#object-prefetch-akamai-only) | **&#x2713;**  |  |  |
| [Video streaming optimization](https://docs.microsoft.com/azure/cdn/cdn-media-streaming-optimization) | **&#x2713;**  | \* |  \* |
| [Large file optimization](https://docs.microsoft.com/azure/cdn/cdn-large-file-optimization) | **&#x2713;**  | \* |  \* |
| [Global server load balancing (GSLB)](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-load-balancing-azure) |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Fast purge](cdn-purge-endpoint.md) |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Asset pre-loading](cdn-preload-endpoint.md) | |**&#x2713;** |**&#x2713;** |
| Cache/header settings (using [caching rules](cdn-caching-rules.md)) |**&#x2713;** |**&#x2713;** | |
| Cache/header settings (using [rules engine](cdn-rules-engine.md)) | | |**&#x2713;** |
| [Query string caching](cdn-query-string.md) |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| IPv4/IPv6 dual-stack |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| [HTTP/2 support](cdn-http2.md) |**&#x2713;** |**&#x2713;** |**&#x2713;** |
||||
 **Security** | 
| HTTPS support with CDN endpoint |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Custom domain HTTPS](cdn-custom-ssl.md) | |**&#x2713;** |**&#x2713;** |
| [Custom domain name support](cdn-map-content-to-custom-domain.md) |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Geo-filtering](cdn-restrict-access-by-country.md) |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Token authentication](cdn-token-auth.md)|  |  |**&#x2713;**| 
| [DDOS protection](https://www.us-cert.gov/ncas/tips/ST04-015) |**&#x2713;** |**&#x2713;** |**&#x2713;** |
||||
| **Analytics and reporting** |
| [Azure diagnostic logs](cdn-azure-diagnostic-logs.md) | **&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Core reports from Verizon](cdn-analyze-usage-patterns.md) | |**&#x2713;** |**&#x2713;** |
| [Custom reports from Verizon](cdn-verizon-custom-reports.md) | |**&#x2713;** |**&#x2713;** |
| [Advanced HTTP reports](cdn-advanced-http-reports.md) | | |**&#x2713;** |
| [Real-time stats](cdn-real-time-stats.md) | | |**&#x2713;** |
| [Edge node performance](cdn-edge-performance.md) | | |**&#x2713;** |
| [Real-time alerts](cdn-real-time-alerts.md) | | |**&#x2713;** |
||||
| **Ease of use** | 
| Easy integration with Azure services such as [Storage](cdn-create-a-storage-account-with-cdn.md), [Cloud Services](cdn-cloud-service-with-cdn.md), [Web Apps](../app-service/app-service-web-tutorial-content-delivery-network.md), and [Media Services](../media-services/media-services-portal-manage-streaming-endpoints.md) |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| Management via [REST API](https://msdn.microsoft.com/library/mt634456.aspx), [.NET](cdn-app-dev-net.md), [Node.js](cdn-app-dev-node.md), or [PowerShell](cdn-manage-powershell.md). |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Customizable, rule-based content delivery engine](cdn-rules-engine.md) | | |**&#x2713;** |
| URL redirect/rewrite  (using [rules engine](cdn-rules-engine.md)) | | |**&#x2713;** |
| Mobile device rules (using [rules engine](cdn-rules-engine.md)) | | |**&#x2713;** |

\* Verizon supports delivering large files and media directly via the general web delivery optimization.


## Next steps
- To get started with CDN, see [Create an Azure CDN profile and endpoint](cdn-create-new-endpoint.md).

- Manage your CDN endpoints through the [Microsoft Azure portal](https://portal.azure.com) or with [PowerShell](cdn-manage-powershell.md).

- Learn how to automate Azure CDN with [.NET](cdn-app-dev-net.md) or [Node.js](cdn-app-dev-node.md).

- To see Azure CDN in action, watch the [Azure CDN videos](https://azure.microsoft.com/resources/videos/index/?services=cdn&sort=newest).

