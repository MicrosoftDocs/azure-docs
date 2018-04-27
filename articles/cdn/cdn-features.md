---
title: Azure Content Delivery Network (CDN) product features | Microsoft Docs
description: Learn about the features that each Azure Content Delivery Network (CDN) product supports.
services: cdn
documentationcenter: ''
author: dksimpson
manager: akucer
editor: ''

ms.assetid: 
ms.service: cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 03/23/2018
ms.author: rli
ms.custom: mvc

---
# Azure CDN product features

There are three Azure Content Delivery Network (CDN) products: **Azure CDN Standard from Akamai**, **Azure CDN Standard from Verizon**, and **Azure CDN Premium from Verizon**. The following table compares the features available with each product.

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
 **Security** | **Standard Akamai** | **Standard Verizon** | **Premium Verizon** | 
| HTTPS support with CDN endpoint |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Custom domain HTTPS](cdn-custom-ssl.md) | |**&#x2713;** |**&#x2713;** |
| [Custom domain name support](cdn-map-content-to-custom-domain.md) |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Geo-filtering](cdn-restrict-access-by-country.md) |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Token authentication](cdn-token-auth.md)|  |  |**&#x2713;**| 
| [DDOS protection](https://www.us-cert.gov/ncas/tips/ST04-015) |**&#x2713;** |**&#x2713;** |**&#x2713;** |
||||
| **Analytics and reporting** | **Standard Akamai** | **Standard Verizon** | **Premium Verizon** | 
| [Azure diagnostic logs](cdn-azure-diagnostic-logs.md) | **&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Core reports from Verizon](cdn-analyze-usage-patterns.md) | |**&#x2713;** |**&#x2713;** |
| [Custom reports from Verizon](cdn-verizon-custom-reports.md) | |**&#x2713;** |**&#x2713;** |
| [Advanced HTTP reports](cdn-advanced-http-reports.md) | | |**&#x2713;** |
| [Real-time stats](cdn-real-time-stats.md) | | |**&#x2713;** |
| [Edge node performance](cdn-edge-performance.md) | | |**&#x2713;** |
| [Real-time alerts](cdn-real-time-alerts.md) | | |**&#x2713;** |
||||
| **Ease of use** | **Standard Akamai** | **Standard Verizon** | **Premium Verizon** | 
| Easy integration with Azure services such as [Storage](cdn-create-a-storage-account-with-cdn.md), [Cloud Services](cdn-cloud-service-with-cdn.md), [Web Apps](../app-service/app-service-web-tutorial-content-delivery-network.md), and [Media Services](../media-services/previous/media-services-portal-manage-streaming-endpoints.md) |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| Management via [REST API](https://msdn.microsoft.com/library/mt634456.aspx), [.NET](cdn-app-dev-net.md), [Node.js](cdn-app-dev-node.md), or [PowerShell](cdn-manage-powershell.md) |**&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Customizable, rule-based content delivery engine](cdn-rules-engine.md) | | |**&#x2713;** |
| URL redirect/rewrite  (using [rules engine](cdn-rules-engine.md)) | | |**&#x2713;** |
| Mobile device rules (using [rules engine](cdn-rules-engine.md)) | | |**&#x2713;** |

\* Verizon supports delivering large files and media directly via the general web delivery optimization.



