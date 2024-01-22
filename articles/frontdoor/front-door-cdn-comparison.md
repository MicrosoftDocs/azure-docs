---
title: Comparison between Azure Front Door and Azure CDN services
description: This article provides a comparison between the different Azure Front Door tiers and Azure CDN services.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: article
ms.workload: infrastructure-services
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
| Static file delivery | Yes | Yes | Yes | Yes | Yes | Yes |
| Dynamic site delivery | Yes | Yes | Yes | No | Yes | Yes |
| **Domains and Certs** | | | | | | |
| Custom domains | Yes - DNS TXT record based domain validation | Yes - DNS TXT record based domain validation | Yes - CNAME based validation | Yes - CNAME based validation | Yes - CNAME based validation | Yes - CNAME based validation |
| HTTPS support | Yes | Yes | Yes | Yes | Yes | Yes |
| Custom domain HTTPS | Yes | Yes | Yes | Yes | Yes | Yes |
| Bring your own certificate | Yes | Yes | Yes | Yes | Yes | Yes |
| Supported TLS Versions | TLS1.2, TLS1.0 | TLS1.2, TLS1.0 | TLS1.2, TLS1.0 | TLS 1.2, TLS 1.0/1.1 | TLS 1.2, TLS 1.3 | TLS 1.2, TLS 1.3 |
| **Caching** | | | | | | |
| Query string caching | Yes | Yes | Yes | Yes | Yes | Yes |
| Cache manage (purge, rules, and compression) | Yes | Yes | Yes | Yes | Yes | Yes |
| Fast purge | No | No | No | No | Yes | Yes |
| Asset pre-loading | No | No | No | No | Yes | Yes |
| Cache behavior settings | Yes using Standard rules engine | Yes using Standard rules engine | Yes using Standard rules engine | Yes using Standard rules engine | Yes | Yes |
| **Routing** | | | | | | |
| Origin load balancing | Yes | Yes | Yes | Yes | Yes | Yes |
| Path based routing | Yes | Yes | Yes | Yes | Yes | Yes |
| Rules engine | Yes | Yes | Yes | Yes | Yes | Yes |
| Server variable | Yes | Yes | No | No | No | No |
| Regular expression in rules engine | Yes | Yes | No | No | No | Yes |
| URL redirect/rewrite | Yes | Yes | Yes | Yes | No | Yes |
| IPv4/IPv6 dual-stack | Yes | Yes | Yes | Yes | Yes | Yes |
| HTTP/2 support | Yes | Yes | Yes | Yes | Yes | Yes |
| Routing preference unmetered | Not required as Data transfer from Azure origin to AFD is free and path is directly connected | Not required as Data transfer from Azure origin to AFD is free and path is directly connected | Not required as Data transfer from Azure origin to AFD is free and path is directly connected | Not required as Data transfer from Azure origin to CDN is free and path is directly connected | Yes | Yes |
| Origin Port | All TCP ports | All TCP ports | All TCP ports | All TCP ports | All TCP ports | All TCP ports |
| Customizable, rules based content delivery engine | Yes | Yes | Yes | Yes using Standard rules engine | No | Yes using Premium rules engine |
| Mobile device rules | Yes | Yes | Yes | Yes using Standard rules engine | No | Yes using Premium rules engine |
| **Security** | | | | | | |
| Custom Web Application Firewall (WAF) rules | Yes | Yes | Yes | No | No | No |
| Microsoft managed rule set | No | Yes | Yes - Only default rule set 1.1 or below | No | No | No |
| Bot protection | No | Yes | Yes - Only bot manager rule set 1.0 | No | No | No |
| Private link connection to origin | No | Yes | No | No | No | No |
| Geo-filtering | Yes | Yes | Yes | Yes | Yes | Yes |
| Token authentication | No | No | No | No | No | Yes |
| DDOS protection | Yes | Yes | Yes | Yes | Yes | Yes |
| **Analytics and reporting** | | | | | | |
| Monitoring Metrics | Yes (more metrics than Classic) | Yes (more metrics than Classic) | Yes | Yes | Yes | Yes |
| Advanced analytics/built-in reports | Yes | Yes - includes WAF report | No | No | No | Yes |
| Raw logs - access logs and WAF logs | Yes | Yes | Yes | Yes | Yes | Yes |
| Health probe log | Yes | Yes | No | No | No | No |
| **Ease of use** | | | | | | |
| Easy integration with Azure services, such as Storage and Web Apps | Yes | Yes | Yes | Yes | Yes | Yes |
| Management via REST API, .NET, Node.js, or PowerShell | Yes | Yes | Yes | Yes | Yes | Yes |
| Compression MIME types | Configurable | Configurable | Configurable | Configurable | Configurable | Configurable |
| Compression encodings | gzip, brotli | gzip, brotli | gzip, brotli | gzip, brotli | gzip, deflate, bzip2 | gzip, deflate, bzip2, brotli |
| Azure Policy integration | No | No | Yes | No | No | No |
| Azure Advisory integration | Yes | Yes | No | No | Yes | Yes |
| Managed Identities with Azure Key Vault | Yes | Yes | No | No | No | No |
| **Pricing** | | | | | | |
| Simplified pricing | Yes | Yes | No | Yes | Yes | Yes |

## Next steps

* Learn how to [create an Azure Front Door](create-front-door-portal.md).
* Learn how about the [Azure Front Door architecture](front-door-routing-architecture.md). 
