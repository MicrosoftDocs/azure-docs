---
title: Compare pricing between Azure Front Door tiers
description: This article describes the billing model for Azure Front Door and compares the pricing for the Standard, Premium and (classic) tiers.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 05/26/2023
ms.author: duau
---

# Compare pricing between Azure Front Door tiers

Azure Front Door has three tiers: Standard, Premium, and (classic). This article describes the billing model for Azure Front Door and compares the pricing for the Standard, Premium and (classic) tiers. When migrating from Azure Front Door (classic) to Standard or Premium, we recommend you do a cost analysis to understand the pricing differences between the tiers. We'll show you how to evaluate the cost impact that you can apply your environment.

## Pricing model comparison

| Pricing dimensions | Standard | Premium | Classic |
|--|--|--|--|
| Base fees (per month) | $35 | $330 | N/A |
| Outbound data transfer from edge location to client (per GB) | Varies by 8 zones | Same as standard | - Varies by 5 zones </br>- Higher unit rates when compared to Standard/Premium |
| Outbound data transfer from edge to the origin (per GB) | Varies by 8 zones | Same as standard | Free |
| Incoming requests from client to Front Door’s edge location (per 10,000 requests) | Varies by 8 zones | - Varies by 8 zones </br>- Higher unit rate than Standard | Free |
| Routing rules (per hour) | Free | Free | $0.01 |
| Per additional routing rule (per hour) | Free | Free | $0.01 |
| Inbound data transfer (per GB) | Free | Free | $0.01 |
| Web Application Firewall custom rules | Free | Free | - $5/month/policy </br>- $1/month & $0.06 per million requests </br></br>For more information, see [Azure Web Application Firewall pricing](https://azure.microsoft.com/pricing/details/web-application-firewall/) |
| Web Application Firewall managed rules | Free | Free | - $5/month/policy </br>- $20/month +$1/million requests </br></br>For more information, see [Azure Web Application Firewall pricing](https://azure.microsoft.com/pricing/details/web-application-firewall/) |
| Data transfer from an origin in Azure data center to Front Door's edge location | Free | Free | See [Bandwidth pricing](https://azure.microsoft.com/pricing/details/bandwidth/) |
| Private link to origin | Not supported | Free | Not supported |


## Cost impact assessment

> [!NOTE]
> Azure Front Door Standard and Premium has a lower total cost of ownership than Azure Front Door (classic). If you have a request heavy workload, it's recommended to estimate the impact of the request meter of the new tiers. If you have multiple instance of Azure Front Door, it's recommended to estimate the impact of the base fee of the new tiers.

The following are general guidance for getting the right metrics to estimate the cost impact of the new tiers.

1. Pull the invoice for the Azure Front Door (classic) profile to get the monthly charges.
1. Compute the Azure Front Door Standard/Premium pricing using the following table.

| 
