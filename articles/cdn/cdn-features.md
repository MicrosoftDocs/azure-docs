---
title: Compare Azure Content Delivery Network (CDN) product features | Microsoft Docs
description: Learn about the features that each Azure Content Delivery Network (CDN) product supports.
services: cdn
documentationcenter: ''
author: mdgattuso
manager: danielgi
editor: mdgattuso

ms.assetid: 
ms.service: azure-cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 06/05/2019
ms.author: magattus
ms.custom: mvc

---

# Compare Azure CDN product features

Azure Content Delivery Network (CDN) includes four products: **Azure CDN Standard from Microsoft**, **Azure CDN Standard from Akamai**, **Azure CDN Standard from Verizon**, and **Azure CDN Premium from Verizon**. 
For information about migrating an **Azure CDN Standard from Verizon** profile to **Azure CDN Premium from Verizon**, see [Migrate an Azure CDN profile from Standard Verizon to Premium Verizon](cdn-migrate.md).

The following table compares the features available with each product.

| **Performance features and optimizations** | **Standard Microsoft** | **Standard Akamai** | **Standard Verizon** | **Premium Verizon** |
| --- | --- | --- | --- | --- |
| [Dynamic site acceleration](https://docs.microsoft.com/azure/cdn/cdn-dynamic-site-acceleration)  | Offered via [Azure Front Door Service](https://docs.microsoft.com/azure/frontdoor/front-door-overview) | **&#x2713;**  | **&#x2713;** | **&#x2713;** |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Dynamic site acceleration - adaptive image compression](https://docs.microsoft.com/azure/cdn/cdn-dynamic-site-acceleration#adaptive-image-compression-azure-cdn-from-akamai-only)  |  | **&#x2713;**  |  |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Dynamic site acceleration - object prefetch](https://docs.microsoft.com/azure/cdn/cdn-dynamic-site-acceleration#object-prefetch-azure-cdn-from-akamai-only)  |  | **&#x2713;**  |  |  |
| [General web delivery optimization](https://docs.microsoft.com/azure/cdn/cdn-optimization-overview#general-web-delivery)  | **&#x2713;** | **&#x2713;**, Select this optimization type if your average file size is smaller than 10 MB  | **&#x2713;** |  **&#x2713;** |
| [Video streaming optimization](https://docs.microsoft.com/azure/cdn/cdn-media-streaming-optimization)  | via General Web Delivery | **&#x2713;**  | via General Web Delivery |  via General Web Delivery |
| [Large file optimization](https://docs.microsoft.com/azure/cdn/cdn-large-file-optimization)  | via General Web Delivery | **&#x2713;**, Select this optimization type if your average file size is larger than 10 MB   | via General Web Delivery |  via General Web Delivery |
| Change optimization type | |**&#x2713;** | | |
| Origin Port |All TCP ports |[Allowed origin ports](https://docs.microsoft.com/previous-versions/azure/mt757337(v%3Dazure.100)#allowed-origin-ports) |All TCP ports |All TCP ports |
| [Global server load balancing (GSLB)](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-load-balancing-azure)  | **&#x2713;** |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Fast purge](cdn-purge-endpoint.md)  | **&#x2713;** |**&#x2713;**, Purge all and Wildcard purge are not supported by Azure CDN from Akamai currently |**&#x2713;** |**&#x2713;** |
| [Asset pre-loading](cdn-preload-endpoint.md)  |  | |**&#x2713;** |**&#x2713;** |
| Cache/header settings (using [caching rules](cdn-caching-rules.md))  |  |**&#x2713;** |**&#x2713;** | |
| Customizable, rules based content delivery engine (using [rules engine](cdn-rules-engine.md))  |  | | |**&#x2713;** |
| Cache/header settings (using [rules engine](cdn-rules-engine.md))  |  | | |**&#x2713;** |
| URL redirect/rewrite (using [rules engine](cdn-rules-engine.md))  |  | | |**&#x2713;** |
| Mobile device rules (using [rules engine](cdn-rules-engine.md))  |  | | |**&#x2713;** |
| [Query string caching](cdn-query-string.md)  | **&#x2713;** |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| IPv4/IPv6 dual-stack | **&#x2713;** |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| [HTTP/2 support](cdn-http2.md)  | **&#x2713;** |**&#x2713;** |**&#x2713;** |**&#x2713;** |
||||
 **Security** | **Standard Microsoft** | **Standard Akamai** | **Standard Verizon** | **Premium Verizon** | 
| HTTPS support with CDN endpoint | **&#x2713;** |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Custom domain HTTPS](cdn-custom-ssl.md)  | **&#x2713;** | **&#x2713;**, Requires direct CNAME to enable |**&#x2713;** |**&#x2713;** |
| [Custom domain name support](cdn-map-content-to-custom-domain.md)  | **&#x2713;** |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Geo-filtering](cdn-restrict-access-by-country.md)  | **&#x2713;** |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Token authentication](cdn-token-auth.md)  |  |  |  |**&#x2713;**| 
| [DDOS protection](https://www.us-cert.gov/ncas/tips/ST04-015)  | **&#x2713;** |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Bring your own certificate](cdn-custom-ssl.md?tabs=option-2-enable-https-with-your-own-certificate#ssl-certificates) |**&#x2713;** |  | **&#x2713;** | **&#x2713;** |
||||
| **Analytics and reporting** | **Standard Microsoft** | **Standard Akamai** | **Standard Verizon** | **Premium Verizon** | 
| [Azure diagnostic logs](cdn-azure-diagnostic-logs.md)  | **&#x2713;** | **&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Core reports from Verizon](cdn-analyze-usage-patterns.md)  |  | |**&#x2713;** |**&#x2713;** |
| [Custom reports from Verizon](cdn-verizon-custom-reports.md)  |  | |**&#x2713;** |**&#x2713;** |
| [Advanced HTTP reports](cdn-advanced-http-reports.md)  |  | | |**&#x2713;** |
| [Real-time stats](cdn-real-time-stats.md)  |  | | |**&#x2713;** |
| [Edge node performance](cdn-edge-performance.md)  |  | | |**&#x2713;** |
| [Real-time alerts](cdn-real-time-alerts.md)  |  | | |**&#x2713;** |
||||
| **Ease of use** | **Standard Microsoft** | **Standard Akamai** | **Standard Verizon** | **Premium Verizon** | 
| Easy integration with Azure services, such as [Storage](cdn-create-a-storage-account-with-cdn.md), [Web Apps](cdn-add-to-web-app.md), and [Media Services](../media-services/media-services-portal-manage-streaming-endpoints.md)  | **&#x2713;** |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| Management via [REST API](/rest/api/cdn/), [.NET](cdn-app-dev-net.md), [Node.js](cdn-app-dev-node.md), or [PowerShell](cdn-manage-powershell.md)  | **&#x2713;** |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Compression MIME types](https://docs.microsoft.com/azure/cdn/cdn-improve-performance)  |Default only |Configurable |Configurable  |Configurable  |
| Compression encodings  |gzip, brotli |gzip |gzip, deflate, bzip2, brotili  |gzip, deflate, bzip2, brotili  |






