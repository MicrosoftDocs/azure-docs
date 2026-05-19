---
title: Comparison Between Azure Front Door and Azure Content Delivery Network
description: This article provides a comparison between the Azure Front Door service tiers and Azure Content Delivery Network service tiers.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 05/04/2026
---

# Comparison between Azure Front Door and Azure Content Delivery Network

Azure Front Door and Azure Content Delivery Network are Azure services that offer global content delivery with intelligent routing and caching capabilities at the application layer.

Both services can help you optimize and accelerate your applications by providing a globally distributed network of points of presence (PoPs) close to your users. Both services also offer features to help you secure your applications from malicious attacks and to help you monitor your applications' health and performance.

:::image type="content" source="./media/front-door-cdn-comparison/architecture.png" alt-text="Diagram of Azure Front Door architecture.":::

## Important information about service tiers

Here's a timeline for changes to the service tiers and actions that you need to take:

- As of August 15, 2025, Azure Front Door (classic) and Azure CDN from Microsoft (classic) no longer support new domain onboarding or profile creation. To create new domains or profiles, migrate to [Azure Front Door Standard or Premium](/azure/frontdoor/tier-migration). [Learn more](https://azure.microsoft.com/updates?id=498522).

- As of August 15, 2025, Azure Front Door (classic) and Azure CDN from Microsoft (classic) [no longer support managed certificates](/azure/security/fundamentals/managed-tls-changes). To avoid service disruption, you need to either switch to bring your own certificate (BYOC) or migrate to [Azure Front Door Standard or Premium](/azure/frontdoor/tier-migration) by August 15, 2025. Existing managed certificates that were automatically renewed before August 15, 2025, remain valid until April 14, 2026. [Learn more](https://azure.microsoft.com/updates?id=498522).

- Azure Front Door (classic) is retiring on March 31, 2027. To avoid service disruption, ⁠[migrate to Azure Front Door Standard or Premium](/azure/frontdoor/tier-migration). ⁠[Learn more](https://azure.microsoft.com/updates?id=azure-front-door-classic-will-be-retired-on-31-march-2027).

- Azure CDN Standard from Microsoft (classic) is retiring on September 30, 2027. To avoid service disruption, ⁠[migrate to Azure Front Door Standard or Premium](/azure/cdn/migrate-tier). ⁠[Learn more](https://azure.microsoft.com/updates?id=Azure-CDN-Standard-from-Microsoft-classic-will-be-retired-on-30-September-2027).

To switch between tiers:

- From Azure Front Door (classic) to the Standard or Premium tier: use the [migration capability](migrate-tier.md).
- From Azure CDN Standard from Microsoft (classic) to the Azure Front Door Standard or Premium tier: use the [migration capability](../cdn/migrate-tier.md).
- From Azure Front Door Standard to Premium: use the [upgrade capability](tier-upgrade.md).
- From Azure Front Door Premium to Standard: No seamless downgrade tool exists. You can re-create the profile instead.

## Service comparison

The following table provides a comparison between the Azure Front Door and Azure Content Delivery Network services.

| Features and optimizations | Front Door Standard | Front Door Premium | Front Door (classic) | CDN Standard from Microsoft (classic) |
| --- | --- | --- | --- | --- |
| **Delivery and acceleration** | | | | |
| Static file delivery | &check; | &check; | &check; | &check; |
| Dynamic site delivery | &check; | &check; | &check; | |
| WebSockets | Preview | Preview | | |
| **Domains and certificates** | | | | |
| Custom domains | &check; (DNS TXT record-based domain validation) | &check; (DNS TXT record-based domain validation) | &check; (CNAME-based validation) | &check; (CNAME-based validation) |
| Prevalidated domain integration with Azure platform as a service | &check; | &check; | | |
| HTTPS support | &check; | &check; | &check; | &check; |
| Custom domain HTTPS | &check; | &check; | &check; | &check; |
| Bring your own certificate | &check; | &check; | &check; | &check; |
| Supported TLS versions | TLS 1.3, TLS 1.2 | TLS 1.3, TLS 1.2 | TLS 1.3, TLS 1.2 | TLS 1.3, TLS 1.2 |
| **Caching** | | | | |
| Query string caching | &check; | &check; | &check; | &check; |
| Cache management (purge, rules, and compression) | &check; | &check; | &check; | &check; |
| Cache behavior settings | &check; (using standard rules engine) | &check; (using standard rules engine) | &check; (using standard rules engine) | &check; (using standard rules engine) |
| **Routing** | | | | |
| Origin load balancing | &check; | &check; | &check; | &check; |
| Path-based routing | &check; | &check; | &check; | &check; |
| Rules engine | &check; | &check; | &check; | &check; |
| Server variable | &check; | &check; | | |
| Regular expression in rules engine | &check; | &check; | | |
| URL redirect/rewrite | &check; | &check; | &check; | &check; |
| IPv4/IPv6 dual stack | &check; | &check; | &check; | &check; |
| HTTP/2 support | &check; | &check; | &check; | &check; |
| Routing preference unmetered | Not required, because data transfer from the Azure origin to Azure Front Door is free and the path is directly connected | Not required, because data transfer from the Azure origin to Azure Front Door is free and the path is directly connected | Not required, because data transfer from the Azure origin to Azure Front Door is free and the path is directly connected | Not required, because data transfer from the Azure origin to Content Delivery Network is free and the path is directly connected |
| Origin port | All TCP ports | All TCP ports | All TCP ports | All TCP ports |
| Customizable, rules-based content delivery engine | &check; | &check; | &check; | &check; (using standard rules engine) |
| Mobile device rules | &check; | &check; | &check; | &check; (using standard rules engine) |
| **Security** | | | | |
| Custom web application firewall (WAF) rules | &check; | &check; | &check; | |
| Microsoft-managed rule set | | &check; | &check; (only default rule set 1.1 or earlier) | |
| Bot protection | | &check; | &check; (only bot manager rule set 1.0) | |
| Private Link connection to origin | | &check; | | |
| Geo-filtering | &check; | &check; | &check; | &check; |
| DDoS protection | &check; | &check; | &check; | &check; |
| Domain fronting block | &check; | &check; | &check; | &check; |
| Managed identities for origin authentication | Preview | Preview | | |
| **Analytics and reporting** | | | | |
| Monitoring metrics | &check; (more metrics than classic) | &check; (more metrics than classic) | &check; | &check; |
| Advanced analytics/built-in reports | &check; | &check; (includes WAF report) | | |
| Raw logs: access logs and WAF logs | &check; | &check; | &check; | &check; |
| Health probe log | &check; | &check; | | |
| **Ease of use** | | | | |
| Integration with Azure services, such as Azure Storage and Web Apps | &check; | &check; | &check; | &check; |
| Management via REST API, .NET, D3.js, or PowerShell | &check; | &check; | &check; | &check; |
| Compression MIME types | Configurable | Configurable | Configurable | Configurable |
| Compression encodings | gzip, Brotli | gzip, Brotli | gzip, Brotli | gzip, Brotli |
| Azure Policy integration | &check; | &check; | &check; | |
| Azure Advisor integration | &check; | &check; | | &check; |
| Managed identities with Azure Key Vault | &check; | &check; | | |
| **Pricing** | [Azure Front Door pricing](https://azure.microsoft.com/pricing/details/frontdoor/) | [Azure Front Door pricing](https://azure.microsoft.com/pricing/details/frontdoor/) | [Azure Front Door pricing](https://azure.microsoft.com/pricing/details/frontdoor/) | [Content Delivery Network pricing](https://azure.microsoft.com/pricing/details/cdn/) |
| Simplified pricing | &check; | &check; | | &check; |

## Services on a retirement path

The following table lists services that are on a retirement path, frequently asked questions regarding retirement, and migration guidance.

| Details | Front Door (classic) | CDN Standard from Microsoft (classic) |
| --- | --- | --- |
| Retirement date | March 31, 2027 | September 30, 2027 |
| Cutoff date for creating new resources | March 31, 2025 | August 15, 2025 |
| Documentation | [Azure update](https://azure.microsoft.com/updates/azure-front-door-classic-will-be-retired-on-31-march-2027/), [FAQ](classic-retirement-faq.md) | [Azure update](https://azure.microsoft.com/updates/v2/Azure-CDN-Standard-from-Microsoft-classic-will-be-retired-on-30-September-2027), [FAQ](../cdn/classic-cdn-retirement-faq.md) |
| Migration | [Considerations](tier-migration.md), [step-by-step instructions](migrate-tier.md) | [Considerations](../cdn/tier-migration.md), [step-by-step instructions](../cdn/migrate-tier.md) |

As of August 15, 2025, Azure-managed certificates are no longer supported on Azure Front Door (classic) and CDN Standard from Microsoft (classic). Existing managed certificates remain valid until April 14, 2026. [Learn more](https://azure.microsoft.com/updates?id=498522).

## Related content

- [Create an Azure Front Door profile](create-front-door-portal.md)
- [Azure Front Door routing architecture](front-door-routing-architecture.md)
- [Best practices for Azure Front Door](best-practices.md)
