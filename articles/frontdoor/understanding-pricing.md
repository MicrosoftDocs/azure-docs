---
title: Compare pricing between Azure Front Door tiers
description: This article describes the billing model for Azure Front Door and compares the pricing for the Standard, Premium and (classic) tiers.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 05/30/2023
ms.author: duau
---

# Compare pricing between Azure Front Door tiers

> [!NOTE]
> Prices shown in this article are examples and are for illustration purposes only. For pricing information according to your region, see the [Pricing page](https://azure.microsoft.com/pricing/details/frontdoor/)

Azure Front Door has three tiers: Standard, Premium, and (classic). This article describes the billing model for Azure Front Door and compares the pricing for the Standard, Premium and (classic) tiers. When migrating from Azure Front Door (classic) to Standard or Premium, we recommend you do a cost analysis to understand the pricing differences between the tiers. We show you how to evaluate cost that you can apply your environment.

## Pricing model comparison

| Pricing dimensions | Standard | Premium | Classic |
|--|--|--|--|
| Base fees (per month) | $35 | $330 | N/A |
| Outbound data transfer from edge location to client (per GB) | Varies by 8 zones | Same as standard | - Varies by 5 zones </br>- Higher unit rates when compared to Standard/Premium |
| Outbound data transfer from edge to the origin (per GB) | Varies by 8 zones | Same as standard | Free |
| Incoming requests from client to Front Door’s edge location (per 10,000 requests) | Varies by 8 zones | - Varies by 8 zones </br>- Higher unit rate than Standard | Free |
| First 5 routing rules (per hour) | Free | Free | $0.03 |
| Per additional routing rule (per hour) | Free | Free | $0.012 |
| Inbound data transfer (per GB) | Free | Free | $0.01 |
| Web Application Firewall custom rules | Free | Free | - $5/month/policy </br>- $1/month & $0.06 per million requests </br></br>For more information, see [Azure Web Application Firewall pricing](https://azure.microsoft.com/pricing/details/web-application-firewall/) |
| Web Application Firewall managed rules | Not supported | Free | - $5/month/policy </br>- $20/month + $1 per million requests </br></br>For more information, see [Azure Web Application Firewall pricing](https://azure.microsoft.com/pricing/details/web-application-firewall/) |
| Data transfer from an origin in Azure data center to Front Door's edge location | Free | Free | See [Bandwidth pricing](https://azure.microsoft.com/pricing/details/bandwidth/) |
| Private link to origin | Not supported | Free | Not supported |
| First 100 custom domains per month | Free | Free | Free |
| Per additional custom domain (per month) | Free | Free | $5 |

## Cost assessment

> [!NOTE]
> Azure Front Door Standard and Premium has a lower total cost of ownership than Azure Front Door (classic). If you have a request heavy workload, it's recommended to estimate the impact of the request meter of the new tiers. If you have multiple instance of Azure Front Door, it's recommended to estimate the impact of the base fee of the new tiers.

The following are general guidance for getting the right metrics to estimate the cost of the new tiers.

1. Pull the invoice for the Azure Front Door (classic) profile to get the monthly charges.

1. Compute the Azure Front Door Standard/Premium pricing using the following table:

    | Azure Front Door Standard/Premium meter | How to calculate from Azure Front Door (classic) metrics |
    |--|--|
    | Base fee | - If you need managed WAF rules, bot protection, or Private Link: **$330/month** </br> - If you only need custom WAF rules: **$35/month** |
    | Requests | **For Standard:** </br>1. Go to your Azure Front Door (classic) profile, select **Metrics** from under *Monitor* in the left side menu pane. </br>2. Select the **Request Count** from the *Metrics* drop-down menu. </br> 3. To view regional metrics, you can apply a split to the data by selecting **Client Country** or **Client Region**. </br> 4. If you select *Client Country*, you need to map them to the corresponding Azure Front Door pricing zone. </br> :::image type="content" source="./media/understanding-pricing/request-count.png" alt-text="Screenshot of the request count metric for Front Door (classic)." lightbox="./media/understanding-pricing/request-count.png"::: </br> **For Premium:** </br>You can look at the **Request Count** and the **WAF Request Count** metric in the Azure Front Door (classic) profile. </br> :::image type="content" source="./media/understanding-pricing/waf-request-count.png" alt-text="Screenshot of the Web Application Firewall request count metric for Front Door (classic)." lightbox="./media/understanding-pricing/waf-request-count.png"::: |
    | Egress from Azure Front Door edge to client | You can obtain this data from your Azure Front Door (classic) invoice or from the **Billable Response Size** metric in the Azure Front Door (classic) profile. To get a more accurate estimation, apply split by *Client Count* or *Client Region*.</br> :::image type="content" source="./media/understanding-pricing/billable-response-size.png" alt-text="Screenshot of the billable response size metric for Front Door (classic)." lightbox="./media/understanding-pricing/billable-response-size.png"::: |
    | Ingress from Azure Front Door edge to origin | You can obtain this data from your Azure Front Door (classic) invoice. Refer to the quantities for Data transfer from client to edge location as an estimation. |

1. Go to the [pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=frontdoor-standard-premium).

1. Select the appropriate Azure Front Door tier and zone.

1. Calculate the total cost for the Azure Front Door Standard/Premium profile from the metrics you obtained in the previous step.

## Example scenarios

Azure Front Door Standard/Premium cost less than Azure Front Door (classic) in the first three scenarios. However, in scenario 4 and 5 there are situations where Azure Front Door Standard/Premium can incur higher charges than Azure Front Door (classic). In these scenarios, you can use the cost assessment to estimate the cost of the new tiers.

### Scenario 1: A static website with custom WAF rules

* 10 routing rules and 10 WAF custom rules are configured.
* 20 TB of outbound data transfer.
* 200 million requests from client to Azure Front Door edge. (Including 100 million custom WAF requests).
* 100 GB outbound data transfer (cache hit ratio = 95%)
* Traffic originates from North America and Europe.

| Cost dimensions | Azure Front Door (classic) | Azure Front Door Standard |
|--|--|--|
| Base fee | $0 | $35 |
| Egress from Azure Front Door edge to client | $3,200 = (10 TB * $0.17/GB) + (10 TB * $0.15/GB) | $1,490 = (10 TB * $0.083/GB) + (10 GB * $0.066/GB) |
| Egress from Azure Front Door edge to origin | $0 | $2 = 100 GB * $0.02/GB | 
| Ingress from client to Azure Front Door edge | $1 = 100 GB * $0.01/GB | $0 |
| Ingress from origin to Azure Front Door edge | $78.30 = (0.1 TB * $0/GB) + (0.9 TB * $0.087/GB) | $) |
| Requests | $0 | $180 = 200M requests * $0.009/10k requests) |
| Routing rules | $153.15 = (($0.03 * 5 rules) + ($0.012 * 5 rules)) * 730 hours | $0 |
| WAF policy | $5 =  $1 * 1 policy/month | $0 |
| WAF custom rules | $10 = $1 = * 10 rules/month | $0 |
| WAF custom rules requests processed |  $60 = 100 million requests * $0.60/1 million requests | $0 |
| Total | $3,507.50 | $1,727 |

Azure Front Door Standard is ~45% cheaper than Azure Front Door (classic) for static websites with custom WAF rules because of the lower egress cost and the free routing rules.

### Scenario 2: A static website with managed WAF rules

* 30 routing rules and 1 WAF managed rule set are configured.
* 20 TB of outbound data transfer.
* 200 million requests from client to Azure Front Door edge (Including 100 million managed WAF requests).
* Cache hit ration = 95%.
* Traffic originates from Asia Pacific (including Japan).

| Cost dimensions | Azure Front Door (classic) | Azure Front Door Premium |
|--|--|--|
| Base fee | $0 | $330 |
| Egress from Azure Front Door edge to client | $4,700 = (10 TB * $ 0.25/GB) + (10 TB * $ 0.22/GB) | $2,130 = (10 TB * $ 0.115/GB) + 10 TB * ($ 0.098/GB)  |
| Egress from Azure Front Door edge to origin | $0 | $2 = 100 GB * $0.02/GB | 
| Ingress from client to Azure Front Door edge | $1 = 100 GB * $0.01/GB | $0 |
| Ingress from origin to Azure Front Door edge | $108 = (0.1 TB * $ 0/GB) + (0.9 TB * $ 0.12/GB) | $0 |
| Requests | $0 | $300 = 200M requests * $0.015/10K requests |
| Routing rules | $328.5 = (($0.03 * 5 rules) + ($.012 * 25 rules)) * 730 hrs  | $0 |
| WAF policy | $5 = $1 * 1 policy/month  | $0 |
| WAF managed/default rule set | $20 = $20 * 1 rule set/month | $0 |
| WAF managed/ defaults rule set requests processed | $100 = 100 million requests * $1/1 million requests |
| Total | $5,263.50 | $2,762 |

Azure Front Door Premium is ~45% cheaper than Azure Front Door (classic) for static websites with managed WAF rules because of the lower egress cost and the free routing rules.

### Scenario 3: File downloads

* Two routing rules are configured.
* 150 TB of outbound data transfer.
* 1.5 million requests from client to Azure Front Door edge (cache hit ration = 95%)
* Traffic originates from India.

| Cost dimensions | Azure Front Door (classic) | Azure Front Door Standard |
|--|--|--|
| Base fee | $0 | $35 |
| Egress from Azure Front Door edge to client | $39,500 = (10 TB * $ 0.34/GB) + (40 TB * $ 0.29/GB) + (100 TB * $ 0.245/GB) | $12,790 = (10 TB * $ 0.109/GB) + (40 TB * $ 0.085/GB) + (100 TB * $ 0.083/GB) |
| Egress from Azure Front Door edge to origin | $0 | $0.72= 4.5GB * $0.16/GB | 
| Ingress from client to Azure Front Door edge | $0.05 = 4.5GB * $0.01  | $0 |
| Ingress from origin to Azure Front Door edge | $900 = 0.1 TB * $ 0/GB + 7.5TB * $ 0.12/GB | $0 |
| Requests | $0 | $1.62 = 1.5 million requests * $0.0108 per 10,000 requests |
| Routing rules | $$43.8 = ($0.03 * 2 rules) * 730 hrs  | $0 |
| Total | $40,444 | $12,827.34 |

Azure Front Door Standard is ~68% cheaper than Azure Front Door (classic) for file downloads because of the lower egress cost.

### Scenario 4: Request heavy scenario with WAF protection

* 150 routing rules are configured to origins in different countries.
* 20 TB of outbound data transfer.
* 10 TB of inbound data transfer.
* 5 billion requests from client to Azure Front Door edge.
* 2.4 billion WAF requests (1.2 billion managed WAF rule requests and 1.2 billion custom WAF rule requests).
* Traffic originates from North America

| Cost dimensions | Azure Front Door (classic) | Azure Front Door Premium |
|--|--|--|
| Base fee | $0 | $330 = $330 * 1 profile |
| Egress from Azure Front Door edge to client | $3,200 = (10 TB * $0.17/GB) + (10 TB * $0.15/GB) | $1,490 = (10 TB * $0.083/GB) + (10 TB * $0.066/GB) |
| Egress from Azure Front Door edge to origin | $0 | $200 = 10 TB * $0.02/GB  | 
| Ingress from client to Azure Front Door edge | $100 = 10 TB * $.01/GB   | $0 |
| Ingress from origin to Azure Front Door edge | $1,692 = (0.1 TB * $ 0/GB) + (9.9 TB * $ 0.087/GB) + (10 TB * $ 0.083/GB) | $0 |
| Requests | $0 | $6,748 |
| Routing rules | $1380 = (($0.03 * 5 rules) + ($0.012 * 145 rules)) * 730 hrs   | $0 |
| WAF policy | $5 = $5 * 1 policy/month| $0 |
| WAF custom rules | $1 = $1 * 1 rule/month | $0 |
| WAF custom rule request processed | $720 = 1.2 billion requests * $0.60 per million requests | $0 |
| WAF managed/default rule set | $20 = $20 * 1 rule set/month | $0 |
| WAF managed/ defaults rule set requests processed | $1200 = 1.2 billion requests * $1 per million requests | $0 |
| Total | $8,318 | $8,768 |

In this comparison, Azure Front Door Premium is ~5% more expensive than Azure Front Door (classic) because of the higher request cost and the base fee. You're paying less for outbound data transfer and don't have to pay for each routing rule, WAF rules and data transfer from the origin to the edge separately. If the cost increase is significant, reach out to your Microsoft sales representative to discuss options.

### Scenario 5: Social media application with multiple Front Door (classic) profiles with WAF protection

* The application is designed in a micro-services architecture with static and dynamic traffic. Each micro service component is deployed in a separate Azure Front Door (classic) profile. In total, there are 80 Azure Front Door (classic) profiles (30 dev/test, 50 production).
* In each profile, there are 10 routing rules configured to route traffic to different backends based on the path.
* There are two WAF policies with two rule sets to protect the application from top CVE attacks.
* 50 million requests per month.
* 50 TB of outbound data transfer from Azure Front Door edge to client.
* 1 TB of outbound data transfer from Azure Front Door edge to origin (20 million requests get blocked by WAF).
* Traffic mostly originates from North America.

| Cost dimensions | Azure Front Door (classic) | Azure Front Door Premium |
|--|--|--|
| Base fee | $0 | $26,400 = $330 x 80 profiles |
| Egress from Azure Front Door edge to client | $7,700 = (10 TB * $0.17/GB) + (40 TB * $0.15/GB) | $3,470 = (10 TB * $0.083/GB) + (40 TB * $0.066/GB) |
| Egress from Azure Front Door edge to origin | $0 | $200 = 10 TB * $0.02/GB  | 
| Ingress from client to Azure Front Door edge | $10 = 1 TB * $.01/GB | $0 |
| Ingress from origin to Azure Front Door edge | $2106.30 = (0.1 TB * $0/GB) + (9.9 TB * $0.087/GB) + (15 TB * $0.083/GB) | $0 |
| Requests | $0 | $75 = 50 million requests * $0.15 per 10,000 requests |
| Routing rules | $7665 = (($0.03 * 5 rules) + ($0.012 * 5 rules)) * 730 hrs * 80 instances | $0 |
| WAF policy | $10 = $5 * 2 policy/month | $0 |
| WAF managed/default rule set | $40 = $20 * 2 rule set/month | $0 |
| WAF managed/ defaults rule set requests processed | $20 = 20 million requests * $1 per million requests | $0 |
| Total | $17,551 .30| $29,945 |

In this comparison, Azure Front Door Premium is 1.7x more expensive than Azure Front Door (classic) because of the higher base fee for each profile. The outbound data transfer is 45% less for Azure Front Door Premium compared to Azure Front Door (classic). With Premium tier, you don't have to pay for route rules which account for $7,700 of the total cost. 

#### Suggestion to reduce cost

* Check if all 80 instances of Azure Front Door (classic) are required. Remove unnecessary resources, such as temporary testing environments.
* Migrate your most important Front Door (classic) profiles to Azure Front Door Standard/Premium based on the necessity of features available in the upgrade tier.
* You can manually create Azure Front Door Premium profiles with multiple endpoints to reflect each Azure Front Door (classic) profile.

The following table shows the cost breakdown for migrating 60 Azure Front Door (classic) profiles to four Azure Front Door Premium profiles with 15 endpoints each. The overall cost saving is about 27% less for Azure Front Door Premium compared to Azure Front Door (classic).

| Cost dimensions | Azure Front Door (classic) | Azure Front Door Premium |
|--|--|--|
| Configuration | 60 profiles | 30 production microservices, 300 routing rules (30 endpoints * 10 routing rules) </br> - 2 profiles with 15 endpoints and 150 routing rules per profile </br>30 dev/testing microservices, 300 routing rules (30 endpoints * 10 routing rules)</br> - 2 profiles with 15 endpoints and 150 routing rules per profile |
| Base fee | $0 | $1320 = $330 * 4 profiles |
| Egress from Azure Front Door edge to client | $7,700 = (10 TB * $0.17/GB) + (40 TB * $0.15/GB) | $3,470 = (10 TB * $0.083/GB) + (40 TB * $0.066/GB) |
| Egress from Azure Front Door edge to origin | $0 | $20 = 1 TB * $0.02/GB  | 
| Ingress from client to Azure Front Door edge | $10 = 1 TB * $.01/GB | $0 |
| Ingress from origin to Azure Front Door edge | $2106.30 = (0.1 TB * $0/GB) + (9.9 TB * $0.087/GB) + (15 TB * $0.083/GB) | $0 |
| Requests | $0 | $75 = 50 million requests * $0.15 per 10,000 requests |
| Routing rules | $7665 = (($0.03 * 5 rules) + ($0.012 * 5 rules)) * 730 hrs * 80 instances | $0 |
| WAF policy | $10 = $5 * 2 policy/month | $0 |
| WAF managed/default rule set | $40 = $20 * 2 rule set/month | $0 |
| WAF managed/ defaults rule set requests processed | $20 = 20 million requests * $1 per million requests | $0 |
| Total | $17,551.30 | $4,885 |

## Next steps

* Learn about how [settings are mapped](tier-mapping.md) from Azure Front Door (classic) to Azure Front Door Standard/Premium.
* Learn about [Azure Front Door (classic) tier migration](tier-migration.md).
* Learn how to [migrate from Azure Front Door (classic) to Azure Front Door Standard/Premium](migrate-tier.md).
