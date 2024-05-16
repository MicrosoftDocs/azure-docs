---
title: Compare the pricing of Azure CDN Standard Microsoft and Azure Front Door
description: This article compares the pricing of Azure CDN Standard Microsoft (classic) and Azure Front Door.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 05/11/2024
ms.author: duau
ms.reviewer: harishk
---

# Compare the pricing of Azure CDN Standard Microsoft and Azure Front Door

> [!NOTE]
> The prices presented in this article serves as examples and are intended solely for illustration purposes only. For region-specific pricing information, see the pricing pages of [Azure Front Door](https://azure.microsoft.com/pricing/details/frontdoor/) and [Azure CDN](https://azure.microsoft.com/pricing/details/cdn).

This article provides a comparative analysis of the pricing structure for Azure CDN Standard Microsoft (classic) and Azure Front Door. We recommend conducting a cost analysis before migrating from Azure CDN Standard Microsoft (classic) to Azure Front Door to understand the pricing differences between the tiers.

## Pricing model comparison

| Pricing Dimensions | Azure CDN Standard from Microsoft (Classic) | Azure Front Door Standard | Azure Front Door Premium |
|--|--|--|--|
| Monthly base fees | Not applicable | $35 | $330 |
| Outbound data transfer (Edge location to client, per GB) | Varies (5 Zones) | Varies (8 Zones) | Identical to Azure Front Door Standard |
| Outbound data transfer (Edge to Origin, per GB) | Free | Varies (8 Zones) | Identical to Azure Front Door Standard |
| Incoming requests (Client to Front Door’s Edge location, per 10,000 requests) | Free | Varies (8 Zones) | Varies (8 Zones, higher unit rate than standard) |
| Rules Engine - Rules | First five rules free, additional rules at $1 per rule per month | Free | Free |
| Rules Engine – Requests processed | $0.60 per million requests | Free | Free |
| Data transfer (Origin in Azure data center to Front Door's edge location) | Free | Free | Free |
| Web Application Firewall custom rules | $5/Month/Policy, $1/Month & $0.06 per million requests (For more information, see [Azure Web Application Firewall pricing](https://azure.microsoft.com/pricing/details/web-application-firewall/)) | Free | Free |
| Web Application Firewall managed rules | $5/Month/Policy, $20/Month + $1 per Million Requests (For more information, see [Azure Web Application Firewall pricing](https://azure.microsoft.com/pricing/details/web-application-firewall/)) | Not supported | Free |
| Private Link to origin | Not supported | Not supported | Free |

## Cost assessment

> [!NOTE]
> For workloads with a high volume of requests, we recommend estimating the impact of the request meter for the new tiers. If you're operating multiple Azure CDN instances, it would be beneficial to assess the impact of the base fee associated with the new tiers.

The following steps provide are general guide for obtaining the necessary metrics to estimate cost for the new tiers:

1. Retrieve the invoice fro the Azure CDN Standard Microsoft (classic) profile to get the monthly charges.

1. Calculate the Azure Front Door pricing using the following table:

    | Azure Front Door meter | Method to calculate from Azure CDN Standard Microsoft (classic) metrics |
    |--|--|
    | Base fee | - If managed WAF rules, bot protection, or Private Link are required: **$330/month** </br> - If only custom WAF rules are needed: **$35/month** |
    | Requests | <ol><li>Navigate to your Azure CDN Standard Microsoft (classic) profile, select **Metrics** from under *Monitor* in the left side menu pane.</li><li>Select the **Request Count** from the *Metrics* drop-down menu.</li><li>To view regional metrics, you can apply a split to the data by selecting **Client Country** or **Client Region**.</li><li>If you select *Client Country*, you need to map them to the corresponding Azure Front Door pricing zone.</li></ol> |
    | Egress from Azure Front Door edge to client | This data can be obtained from your Azure CDN Standard Microsoft (classic) invoice or from the **Response Size** metric in the Azure CDN Standard Microsoft (classic) profile. For a more accurate estimation, apply split by *Client Count* or *Client Region*. |
    | Ingress from Azure Front Door edge to origin | This information isn't readily available, but the amount is negligible for caching traffic with high cache hit ratio, such as 95%. |

1. Visit the [pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=frontdoor-standard-premium).

1. Select the appropriate Azure Front Door tier and zone.

1. Compute the total cost for the Azure Front Door profile using the metrics obtained in the previous step.

## Example scenarios

### Scenario 1: A static website with small traffic volume

* 5 TB of outbound data transfer.
* 100 million client-to-edge requests.
* 2.5-GB outbound data transfer from edge to origin (assuming cache hit ratio of 95%)
* Traffic primarily originating from North America.

| Cost factors | Azure CDN Standard Microsoft (classic) | Azure Front Door Standard |
|--|--|--|
| Base fee | $0 | $35 |
| Egress from Azure Front Door edge to client | $405 (calculated as 5 TB * $0.081/GB) | $415 (calculated as 5 TB * $0.083/GB) |
| Egress from Azure Front Door edge to origin | $0 | $0.05 (calculated as 2.5 GB * $0.02/GB) | 
| Requests | $0 | $90 (calcluated as 100M requests * $0.009/10k requests) |
| Total | $405 | $540.05 |

In this scenario, Azure Front Door Standard is approximately 33% more expensive than Azure CDN Standard from Microsoft (classic) due to extra charges associated with the base fee and requests meter.

### Scenario 2: A static website with medium traffic volume

* 50 TB of outbound data transfer.
* 500 million client-to-edge requests.
* 12.5-GB outbound data transfer from edge to origin (assuming cache hit ratio of 95%)
* Traffic primarily originating from North America.

| Cost factors | Azure CDN Standard Microsoft (classic) | Azure Front Door Standard |
|--|--|--|
| Base fee | $0 | $35 |
| Egress from Azure Front Door edge to client | $3,810  (calculated as (10 TB * $0.081/GB) + (40 TB * $0.075/GB)) | $3,470 (calculated as (10 TB * $0.083/GB) + (40 TB * $0.066/GB)) |
| Egress from Azure Front Door edge to origin | $0 | $0.25 (calculated as 12.5 GB * $0.02/GB) | 
| Requests | $0 | $450 (calculated as 500M requests * $0.009/10k requests) |
| Total | $3,810 | $3,955.25 |

In this comparison, Azure Front Door Standard is approximately 4% more expensive than Azure CDN Standard from Microsoft (classic). However, the cost is relatively similar because the reduced egress rate for Azure Front Door Standard (10-50 TB) offsets the extra charges from base fee and requests meter.

### Scenario 3: File downloads - Large volume traffic

* 150 TB of outbound data transfer.
* 1.5 million requests from client to Azure Front Door edge (assuming cache hit ration of 95%)
* Traffic primarily originating from North America.

| Cost factors | Azure CDN Standard Microsoft (classic) | Azure Front Door Standard |
|--|--|--|
| Base fee | $0 | $35 |
| Egress from Azure Front Door edge to client | $9,410 (calculated as (10 TB * $ 0.081/GB) + (40 TB * $ 0.075/GB) + (100 TB * $ 0.056/GB)) | $9,170 (calculated as (10 TB * $ 0.083/GB) + (40 TB * $ 0.066/GB) + (100 TB * $ 0.057/GB)) |
| Egress from Azure Front Door edge to origin | $0 | $0.8 (calculated as 40 GB * $0.02/GB) | 
| Requests | $0 | $1.35 (calculated as 500M requests * $0.009/10k requests) |
| Total | $9,410 | $9,207.15 |

In comparison, Azure CDN Standard from Microsoft (classic) is 2% more expensive than Azure Front Door Standard. This is because of the lower egress rate for Azure Front Door Standard for the 10-50 TB.

### Scenario 4: A static website with medium traffic volume and rules engine enabled

* 50 TB of outbound data transfer.
* 500 million requests from client to edge.
* 12.5-GB outbound data transfer from edge to origin (assuming cache hit ratio of 95%).
* 10 rules enabled in rules engine, processing 500 million requests.
* Traffic primarily originating from North America.

| Cost factors | Azure CDN Standard Microsoft (classic) | Azure Front Door Standard |
|--|--|--|
| Base fee | $0 | $35 |
| Egress from Azure Front Door edge to client | $3,810 (calculated as (10 TB * $0.081/GB) + (40 TB * $0.075/GB)) | $3,470 (calculated as (10 TB * $0.083/GB) + (40 TB * $0.066/GB)) |
| Egress from Azure Front Door edge to origin | $0 | $0.25 (calculated as 12.5 GB * $0.02/GB) | 
| Requests | $0 | $450 (calculated as 500M requests * $0.009/10k requests) |
| Rules engine - Rules | $5 (calculated as first five rules free + 5 rules * $1) | $0 | 
| Rules engine - Requests processed	 | $300 (calculated as 500M * $0.60/M requests)	| $0 | 
| Total | $4,115| $3,955.25 |

In this comparison, Azure CDN Standard from Microsoft (classic) is 4% more expensive than Azure Front Door Standard. This is because of the complimentary rules engine and the reduced egress rate for Azure Front Door Standard for the 10-50 TB range.

## Recommendations to reduce cost while migrating to Azure Front Door

* We advise against migrating nonessential CDN profiles, such as temporary testing environments to Azure Front Door. Instead you can manually recreate them as an endpoint under the Azure Front Door profile after migration.
* Migrate your most important Azure Front Door (classic) profiles to Azure Front Door based on the necessity of features available in the upgrade tier.

## Next steps

* Learn about how [settings are mapped](front-door-cdn-comparison.md) from Azure CDN Standard from Microsoft (classic) to Azure Front Door.
