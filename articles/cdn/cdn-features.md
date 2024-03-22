---
title: Compare Azure Content Delivery Network product features
description: Learn about the features that each Azure Content Delivery Network product supports.
services: cdn
author: duongau
ms.service: azure-cdn
ms.topic: overview
ms.date: 03/20/2024
ms.author: duau
ms.custom: mvc
---

# What are the comparisons between Azure Content Delivery Network product features?

Azure Content Delivery Network includes three products:

- **Azure CDN Standard from Microsoft**
- **Azure CDN Standard from Edgio (formerly Verizon)**
- **Azure CDN Premium from Edgio (formerly Verizon)**.

The following table compares the features available with each product.

| **Performance features and optimizations** | **Standard Microsoft** | **Standard Edgio** | **Premium Edgio** |
| --- | --- | --- | --- |
| [Dynamic site acceleration](./cdn-dynamic-site-acceleration.md)  | Offered via [Azure Front Door](../frontdoor/front-door-overview.md) | **&#x2713;** | **&#x2713;** |
| [General web delivery optimization](./cdn-optimization-overview.md#general-web-delivery)  | **&#x2713;** | **&#x2713;** |  **&#x2713;** |
| [Video streaming optimization](./cdn-media-streaming-optimization.md)  | via General Web Delivery | via General Web Delivery |  via General Web Delivery |
| [Large file optimization](./cdn-large-file-optimization.md)  | via General Web Delivery | via General Web Delivery |  via General Web Delivery |
| Origin Port |All TCP ports |All TCP ports |All TCP ports |
| [Global server load balancing (GSLB)](../traffic-manager/traffic-manager-load-balancing-azure.md)  | **&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Fast purge](cdn-purge-endpoint.md)  | **&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Asset pre-loading](cdn-preload-endpoint.md)  |  |**&#x2713;** |**&#x2713;** |
| Cache/header settings (using [caching rules](cdn-caching-rules.md))  |**&#x2713;** using [Standard rules engine](cdn-standard-rules-engine.md)  |**&#x2713;** | |
| Customizable, rules based content delivery engine |**&#x2713;** using [Standard rules engine](cdn-standard-rules-engine.md)  | |**&#x2713;** using [rules engine](./cdn-verizon-premium-rules-engine.md) |
| Cache/header settings  |**&#x2713;** using [Standard rules engine](cdn-standard-rules-engine.md) | |**&#x2713;** using [Premium rules engine](./cdn-verizon-premium-rules-engine.md) |
| URL redirect/rewrite |**&#x2713;** using [Standard rules engine](cdn-standard-rules-engine.md)  | |**&#x2713;** using [Premium rules engine](./cdn-verizon-premium-rules-engine.md) |
| Mobile device rules  |**&#x2713;** using [Standard rules engine](cdn-standard-rules-engine.md) | |**&#x2713;** using [Premium rules engine](./cdn-verizon-premium-rules-engine.md) |
| [Query string caching](cdn-query-string.md)  | **&#x2713;** |**&#x2713;** |**&#x2713;** |
| Internet Protocol version 4 (IPv4)/Internet Protocol version 6 (IPv6) dual-stack | **&#x2713;** |**&#x2713;** |**&#x2713;** |
| [HTTP/2 support](cdn-http2.md)  | **&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Routing preference unmetered](../virtual-network/ip-services/routing-preference-unmetered.md)  | |**&#x2713;** |**&#x2713;** |
||||
 **Security** | **Standard Microsoft** | **Standard Edgio** | **Premium Edgio** |
| HTTPS support with content delivery network endpoint | **&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Custom domain HTTPS](cdn-custom-ssl.md)  | **&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Custom domain name support](cdn-map-content-to-custom-domain.md)  | **&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Geo-filtering](cdn-restrict-access-by-country-region.md)  | **&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Token authentication](cdn-token-auth.md)  |  |  |**&#x2713;**|
| [DDoS Protection](https://www.cisa.gov/news-events/news/understanding-denial-service-attacks)  | **&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Bring your own certificate](cdn-custom-ssl.md?tabs=option-2-enable-https-with-your-own-certificate#tlsssl-certificates) |**&#x2713;** | **&#x2713;** | **&#x2713;** |
| Supported TLS Versions | TLS 1.2, TLS 1.0/1.1 - [Configurable](/rest/api/cdn/custom-domains/enable-custom-https#usermanagedhttpsparameters) | TLS 1.2, TLS 1.3 | TLS 1.2, TLS 1.3 |
||||
| **Analytics and reporting** | **Standard Microsoft** | **Standard Edgio** | **Premium Edgio** |
| [Azure diagnostic logs](cdn-azure-diagnostic-logs.md)  | **&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Core reports from Edgio](cdn-analyze-usage-patterns.md)  |  |**&#x2713;** |**&#x2713;** |
| [Custom reports from Edgio](cdn-verizon-custom-reports.md)  |  |**&#x2713;** |**&#x2713;** |
| [Advanced HTTP reports](cdn-advanced-http-reports.md)  |  | |**&#x2713;** |
| [Real-time stats](cdn-real-time-stats.md)  |  | |**&#x2713;** |
| [Edge node performance](cdn-edge-performance.md)  |  | |**&#x2713;** |
| [Real-time alerts](cdn-real-time-alerts.md)  |  | |**&#x2713;** |
||||
| **Ease of use** | **Standard Microsoft** | **Standard Edgio** | **Premium Edgio** |
| Easy integration with Azure services, such as [Storage](cdn-create-a-storage-account-with-cdn.md), [Web Apps](cdn-add-to-web-app.md), and [Media Services](/azure/media-services/previous/media-services-portal-manage-streaming-endpoints)  | **&#x2713;** |**&#x2713;** |**&#x2713;** |
| Management via [REST API](/rest/api/cdn/), [.NET](cdn-app-dev-net.md), [Node.js](cdn-app-dev-node.md), or [PowerShell](cdn-manage-powershell.md)  | **&#x2713;** |**&#x2713;** |**&#x2713;** |
| [Compression MIME types](./cdn-improve-performance.md)  |Configurable |Configurable  |Configurable  |
| Compression encodings  |gzip, brotli |gzip, deflate, bzip2, brotli  |gzip, deflate, bzip2, brotli  |

## Migration

For information about migrating an **Azure CDN Standard from Edgio** profile to **Azure CDN Premium from Edgio**, see [Migrate an Azure Content Delivery Network profile from Standard Edgio to Premium Edgio](cdn-migrate.md).

> [!NOTE]
> There is an upgrade path from Standard Edgio to Premium Edgio, there is no conversion mechanism between other products at this time.

## Next steps

- Learn more about [Azure Content Delivery Network](cdn-overview.md).
