---
title: Comparison between Azure Front Door and Azure CDN services
description: This article provides a comparison between the different Azure Front Door tiers and Azure CDN services.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 1/27/2025
ms.author: duau
---

# Comparison between Azure Front Door and Azure CDN services

Azure Front Door and Azure CDN are both Azure services that offer global content delivery with intelligent routing and caching capabilities at the application layer. Both services can be used to optimize and accelerate your applications by providing a globally distributed network of points of presence (POP) close to your users. Both services also offer various features to help you secure your applications from malicious attacks and to help you monitor your application's health and performance.

:::image type="content" source="./media/front-door-cdn-comparison/architecture.png" alt-text="Diagram of Azure Front Door architecture.":::

> [!NOTE]
> To switch between tiers, you will need to recreate the Azure Front Door profile. You can use the [**migration capability**](migrate-tier.md) to move your existing Azure Front Door profile to the new tier. For more information about upgrading from Standard to Premium, see [**upgrade capability**](tier-upgrade.md).
>

[!INCLUDE [Azure Front Door (classic) retirement notice](../../includes/front-door-classic-retirement.md)]

[!INCLUDE [Azure CDN from Microsoft (classic) retirement notice](../../includes/cdn-classic-retirement.md)]

## Service comparison

The following table provides a comparison between Azure Front Door and Azure CDN services.

| Features and optimizations | Front Door Standard | Front Door Premium | Front Door (classic) | CDN Standard from Microsoft (classic) |
| --- | --- | --- | --- | --- |
| **Delivery and acceleration** | | | | |
| Static file delivery | &check; | &check; | &check; | &check; |
| Dynamic site delivery | &check; | &check; | &check; |  |
| **Domains and Certs** | | | | |
| Custom domains | &check; - DNS TXT record based domain validation | &check; - DNS TXT record based domain validation | &check; - CNAME based validation | &check; - CNAME based validation |
| Prevalidated domain integration with Azure PaaS Service | &check; | &check; |  |  |
| HTTPS support | &check; | &check; | &check; | &check; |
| Custom domain HTTPS | &check; | &check; | &check; | &check; |
| Bring your own certificate | &check; | &check; | &check; | &check; |
| Supported TLS Versions | TLS1.3, TLS1.2, TLS1.0 | TLS1.3 TLS1.2, TLS1.0 | TLS1.3, TLS1.2, TLS1.0 | TLS1.3, TLS 1.2, TLS 1.0/1.1 |
| **Caching** | | | | |
| Query string caching | &check; | &check; | &check; | &check; |
| Cache management (purge, rules, and compression) | &check; | &check; | &check; | &check; |
| Fast purge |  |  |  |  |
| Asset preloading |  |  |  |  |
| Cache behavior settings | &check; - using standard rules engine | &check; - using standard rules engine | &check; - using standard rules engine | &check; - using standard rules engine |
| **Routing** | | | | |
| Origin load balancing | &check; | &check; | &check; | &check; |
| Path based routing | &check; | &check; | &check; | &check; |
| Rules engine | &check; | &check; | &check; | &check; |
| Server variable | &check; | &check; |  |  |
| Regular expression in rules engine | &check; | &check; |  |  |
| URL redirect/rewrite | &check; | &check; | &check; | &check; |
| IPv4/IPv6 dual-stack | &check; | &check; | &check; | &check; |
| HTTP/2 support | &check; | &check; | &check; | &check; |
| Routing preference unmetered | Not required as Data transfer from Azure origin to AFD is free and path is directly connected | Not required as Data transfer from Azure origin to AFD is free and path is directly connected | Not required as Data transfer from Azure origin to AFD is free and path is directly connected | Not required as Data transfer from Azure origin to CDN is free and path is directly connected |
| Origin Port | All TCP ports | All TCP ports | All TCP ports | All TCP ports |
| Customizable, rules based content delivery engine | &check; | &check; | &check; | &check; using Standard rules engine |
| Mobile device rules | &check; | &check; | &check; | &check; using Standard rules engine |
| **Security** | | | | |
| Custom Web Application Firewall (WAF) rules | &check; | &check; | &check; |  |
| Microsoft managed rule set |  | &check; | &check; - Only default rule set 1.1 or less |  |
| Bot protection |  | &check; | &check; - Only bot manager rule set 1.0 |  |
| Private link connection to origin |  | &check; |  |  |
| Geo-filtering | &check; | &check; | &check; | &check; |
| Token authentication |  |  |  |  |
| DDOS protection | &check; | &check; | &check; | &check; |
| Domain Fronting Block | &check; | &check; | &check; | &check; |
| **Analytics and reporting** | | | | |
| Monitoring Metrics | &check; (more metrics than Classic) | &check; (more metrics than Classic) | &check; | &check; |
| Advanced analytics/built-in reports | &check; | &check; - includes WAF report |  |  |
| Raw logs - access logs and WAF logs | &check; | &check; | &check; | &check; |
| Health probe log | &check; | &check; |  |  |
| **Ease of use** | | | | |
| Easy integration with Azure services, such as Storage and Web Apps | &check; | &check; | &check; | &check; |
| Management via REST API, .NET, de.js, or PowerShell | &check; | &check; | &check; | &check; |
| Compression MIME types | Configurable | Configurable | Configurable | Configurable |
| Compression encodings | gzip, brotli | gzip, brotli | gzip, brotli | gzip, brotli |
| Azure Policy integration | &check; | &check; | &check; |  |
| Azure Advisory integration | &check; | &check; |  | &check; |
| Managed Identities with Azure Key Vault | &check; | &check; |  |  |
| **Pricing** | [Azure Front Door pricing](https://azure.microsoft.com/pricing/details/frontdoor/) | | | [Azure CDN pricing](https://azure.microsoft.com/pricing/details/cdn/) |
| Simplified pricing | &check; | &check; |  | &check; |

## Services on retirement path
The following table lists services that are on retirement path, frequently asked questions regarding retirement, and migration guidance.

| Details | Front Door (classic) | CDN Standard from Microsoft (classic) | CDN Standard from Akamai | CDN Standard/Premium from Edgio |
| --- | --- | --- | --- | --- |
| Retirement Date | March 31, 2027 | September 30, 2027 | December 31, 2023 | January 15, 2025 |
| Date until new resources can be created | March 31, 2025 | September 30, 2025 | Service retired | Service retired |
| Documentation | [Azure update](https://azure.microsoft.com/updates/azure-front-door-classic-will-be-retired-on-31-march-2027/), [FAQ](classic-retirement-faq.md) | [Azure update](https://azure.microsoft.com/updates/v2/Azure-CDN-Standard-from-Microsoft-classic-will-be-retired-on-30-September-2027), [FAQ](../cdn/classic-cdn-retirement-faq.md) | [FAQ](../cdn/akamai-retirement-faq.md)|[FAQ](../cdn/edgio-retirement-faq.md) |
| Migration | [Considerations](tier-migration.md), [Step-by-step instructions](migrate-tier.md) | [Considerations](../cdn/tier-migration.md), [Step-by-step instructions](../cdn/migrate-tier.md) | Service retired | Service retired |

## Next steps

* Learn how to [create an Azure Front Door](create-front-door-portal.md).
* Learn how about the [Azure Front Door architecture](front-door-routing-architecture.md). 
