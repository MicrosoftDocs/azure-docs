---
title: Comparison between Azure Front Door and Azure CDN services
description: This article provides a comparison between the different Azure Front Door tiers and Azure CDN services.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: article
ms.date: 10/13/2023
ms.author: duau
---

# Comparison between Azure Front Door and Azure CDN services

Azure Front Door and Azure CDN are both Azure services that offer global content delivery with intelligent routing and caching capabilities at the application layer. Both services can be used to optimize and accelerate your applications by providing a globally distributed network of points of presence (POP) close to your users. Both services also offer a variety of features to help you secure your applications from malicious attacks and to help you monitor your application's health and performance.

:::image type="content" source="./media/front-door-cdn-comparison/architecture.png" alt-text="Diagram of Azure Front Door architecture.":::

> [!NOTE]
> To switch between tiers, you will need to recreate the Azure Front Door profile. You can use the [**migration capability**](migrate-tier.md) to move your existing Azure Front Door profile to the new tier. For more information about upgrading from Standard to Premium, see [**upgrade capability**](tier-upgrade.md).
> 

## Service comparison

The following table provides a comparison between Azure Front Door and Azure CDN services.

| Features and optimizations | Front Door Standard | Front Door Premium | Front Door Classic | Azure CDN Standard Microsoft | Azure CDN Standard Edgio | Azure CDN Premium Edgio |
| --- | --- | --- | --- | --- | --- | --- |
| **Delivery and acceleration** | | | | | | |
| Static file delivery | &check; | &check; | &check; | &check; | &check; | &check; |
| Dynamic site delivery | &check; | &check; | &check; |  | &check; | &check; |
| **Domains and Certs** | | | | | | |
| Custom domains | &check; - DNS TXT record based domain validation | &check; - DNS TXT record based domain validation | &check; - CNAME based validation | &check; - CNAME based validation | &check; - CNAME based validation | &check; - CNAME based validation |
| Prevalidated domain integration with Azure PaaS Service | &check; | &check; |  |  |  |  |
| HTTPS support | &check; | &check; | &check; | &check; | &check; | &check; |
| Custom domain HTTPS | &check; | &check; | &check; | &check; | &check; | &check; |
| Bring your own certificate | &check; | &check; | &check; | &check; | &check; | &check; |
| Supported TLS Versions | TLS1.3, TLS1.2, TLS1.0 | TLS1.3 TLS1.2, TLS1.0 | TLS1.3, TLS1.2, TLS1.0 | TLS1.3, TLS 1.2, TLS 1.0/1.1 | TLS 1.2, TLS 1.3 | TLS 1.2, TLS 1.3 |
| **Caching** | | | | | | |
| Query string caching | &check; | &check; | &check; | &check; | &check; | &check; |
| Cache manage (purge, rules, and compression) | &check; | &check; | &check; | &check; | &check; | &check; |
| Fast purge |  |  |  |  | &check; | &check; |
| Asset pre-loading |  |  |  |  | &check; | &check; |
| Cache behavior settings | &check; - using standard rules engine | &check; - using standard rules engine | &check; - using standard rules engine | &check; - using standard rules engine | &check; | &check; |
| **Routing** | | | | | | |
| Origin load balancing | &check; | &check; | &check; | &check; | &check; | &check; |
| Path based routing | &check; | &check; | &check; | &check; | &check; | &check; |
| Rules engine | &check; | &check; | &check; | &check; | &check; | &check; |
| Server variable | &check; | &check; |  |  |  |  |
| Regular expression in rules engine | &check; | &check; |  |  |  | &check; |
| URL redirect/rewrite | &check; | &check; | &check; | &check; |  | &check; |
| IPv4/IPv6 dual-stack | &check; | &check; | &check; | &check; | &check; | &check; |
| HTTP/2 support | &check; | &check; | &check; | &check; | &check; | &check; |
| Routing preference unmetered | Not required as Data transfer from Azure origin to AFD is free and path is directly connected | Not required as Data transfer from Azure origin to AFD is free and path is directly connected | Not required as Data transfer from Azure origin to AFD is free and path is directly connected | Not required as Data transfer from Azure origin to CDN is free and path is directly connected | &check; | &check; |
| Origin Port | All TCP ports | All TCP ports | All TCP ports | All TCP ports | All TCP ports | All TCP ports |
| Customizable, rules based content delivery engine | &check; | &check; | &check; | &check; using Standard rules engine |  | &check; using Premium rules engine |
| Mobile device rules | &check; | &check; | &check; | &check; using Standard rules engine |  | &check; using Premium rules engine |
| **Security** | | | | | | |
| Custom Web Application Firewall (WAF) rules | &check; | &check; | &check; |  |  |  |
| Microsoft managed rule set |  | &check; | &check; - Only default rule set 1.1 or below |  |  |  |
| Bot protection |  | &check; | &check; - Only bot manager rule set 1.0 |  |  |  |
| Private link connection to origin |  | &check; |  |  |  |  |
| Geo-filtering | &check; | &check; | &check; | &check; | &check; | &check; |
| Token authentication |  |  |  |  |  | &check; |
| DDOS protection | &check; | &check; | &check; | &check; | &check; | &check; |
| DDOS protection | &check; | &check; | &check; | &check; | &check; | &check; |
| Domain Fronting Block | &check; | &check; | &check; | &check; | &check; | &check; |
| **Analytics and reporting** | | | | | | |
| Monitoring Metrics | &check; (more metrics than Classic) | &check; (more metrics than Classic) | &check; | &check; | &check; | &check; |
| Advanced analytics/built-in reports | &check; | &check; - includes WAF report |  |  |  | &check; |
| Raw logs - access logs and WAF logs | &check; | &check; | &check; | &check; | &check; | &check; |
| Health probe log | &check; | &check; |  |  |  |  |
| **Ease of use** | | | | | | |
| Easy integration with Azure services, such as Storage and Web Apps | &check; | &check; | &check; | &check; | &check; | &check; |
| Management via REST API, .NET, de.js, or PowerShell | &check; | &check; | &check; | &check; | &check; | &check; |
| Compression MIME types | Configurable | Configurable | Configurable | Configurable | Configurable | Configurable |
| Compression encodings | gzip, brotli | gzip, brotli | gzip, brotli | gzip, brotli | gzip, deflate, bzip2 | gzip, deflate, bzip2, brotli |
| Azure Policy integration |  |  | &check; |  |  |  |
| Azure Advisory integration | &check; | &check; |  | &check; | &check; | &check; |
| Managed Identities with Azure Key Vault | &check; | &check; |  |  |  |  |
| **Pricing** | | | | | | |
| Simplified pricing | &check; | &check; |  | &check; | &check; | &check; |

## Next steps

* Learn how to [create an Azure Front Door](create-front-door-portal.md).
* Learn how about the [Azure Front Door architecture](front-door-routing-architecture.md). 
