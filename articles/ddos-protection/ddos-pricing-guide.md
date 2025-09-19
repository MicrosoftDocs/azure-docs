---
title: Compare pricing between Azure DDoS Protection tiers
description: Learn about Azure DDoS Protection pricing and compare pricing between Azure DDoS Protection tiers.
services: ddos-protection
author: AbdullahBell
ms.service: azure-ddos-protection
ms.topic: concept-article
ms.date: 07/28/2025
ms.author: abell
# Customer intent: As a cloud architect, I want to compare the pricing of Azure DDoS Protection tiers, so that I can choose the most cost-effective solution for protecting my virtual network and public IP addresses.
---


# Compare pricing between Azure DDoS Protection tiers

Azure DDoS Protection has two tiers: Network Protection and IP Protection. The Network Protection tier is available for resources deployed in virtual networks that are enabled for DDoS Protection. The IP Protection tier is available for public IP addresses that are enabled for DDoS Protection. We recommend a cost analysis to understand the pricing differences between the tiers. In this article, we show you how to evaluate cost for your environment and provide detailed scenarios to help you make informed protection decisions.

## Cost assessment

Network Protection cost begins once the DDoS protection plan is created. IP Protection cost begins once the Public IP address is configured with IP Protection, and its associated virtual network isn't protected by a DDoS protection plan. 
For more information, see [Azure DDoS Protection Pricing](https://azure.microsoft.com/pricing/details/ddos-protection/).

When IP Protection is enabled for a public IP resource and a DDoS protection plan is created and enabled on its virtual network, customers are billed for the lower *per Public IP resource* rate. In this case, we'll automatically start billing for Network Protection. 

> [!NOTE]
> For current pricing information according to your region, see the [Pricing page](https://azure.microsoft.com/pricing/details/ddos-protection/). The scenarios below demonstrate comparative cost analysis patterns without specific pricing amounts.

## Example scenarios

This section provides example scenarios to illustrate cost differences between Network Protection and IP Protection. The scenarios are designed to help you understand how to evaluate costs based on your specific environment and requirements.

### Scenario 1: Small application with 10 Public IP addresses

In this example, we compare the cost of Network Protection and IP Protection for a virtual network with 10 Public IP addresses. 

#### Network Protection

With Network Protection, you create one plan that covers all subscriptions under the tenant. This shared protection model means you pay a single monthly Network Protection plan fee that covers up to 100 IP addresses across all subscriptions within your Azure Active Directory tenant, regardless of how those IPs are distributed among different subscriptions. 

Let's assume you have only one subscription in your tenant. If you create a Network Protection plan, the plan includes protection for 100 IP addresses. The subscription is billed for the Network Protection plan, which covers up to 100 resources. 

#### IP Protection 

In this same scenario with 10 Public IP addresses, if you enable IP Protection for each Public IP address, you're billed per protected IP resource.

Under this scenario, its more cost effective to enable IP Protection for each Public IP address.

**Cost comparison analysis:**

- Network Protection: Fixed monthly cost for up to 100 IP addresses.
- IP Protection: Per-IP monthly cost × 10 resources.
- Result: IP Protection provides cost savings for smaller deployments.

### Scenario 2: Enterprise multi-subscription environment

This scenario illustrates cost benefits for large organizations with multiple subscriptions sharing a DDoS protection plan.

An enterprise has three subscriptions with 48 public IPs across three subscriptions.
- Subscription A: 25 public IPs (production workloads)
- Subscription B: 15 public IPs (staging environment)  
- Subscription C: 8 public IPs (development environment)

#### Multiple subscriptions with Network Protection

The cost efficiency becomes apparent when you consider the effective per-IP cost: instead of paying individually for each of the 48 public IPs, the enterprise pays one fixed monthly fee that could protect up to 100 IPs. This shared plan coverage significantly reduces the effective per-IP cost compared to individual IP Protection, making Network Protection an economical choice for organizations with multiple subscriptions and substantial public IP requirements. The protection seamlessly extends across subscription boundaries, simplifying both management and billing while providing comprehensive coverage for the entire tenant's public facing resources.

#### Multiple subscriptions with IP Protection

If using IP Protection for the same 48 public IPs, the cost structure changes significantly. Under this model, each public IP address requires individual protection billing, resulting in a per-IP monthly rate multiplied by 48 resources across all subscriptions. This means the enterprise would pay separately for protection on each of the 25 production IPs, 15 staging IPs, and 8 development IPs, with costs accumulating linearly across all subscription boundaries.

IP Protection follows a linear cost scaling model where expenses increase proportionally with each protected IP address. For the 48 public IPs in this enterprise scenario, this means paying individual protection fees for each resource across all subscriptions, resulting in substantially higher total costs compared to the shared Network Protection plan.

### Scenario 3: Application Gateway with WAF integration

This scenario demonstrates the value-added benefits of Network Protection when using Azure Application Gateway with Web Application Firewall (WAF), highlighting how DDoS Protection can provide extra cost savings beyond basic attack mitigation.

#### Without DDoS Network Protection

When deploying Application Gateway with WAF functionality without DDoS Network Protection, organizations pay the standard WAF pricing rates for their Application Gateway v2 instances. Under this configuration, the total monthly cost consists solely of the Application Gateway WAF fees, which include both the gateway compute costs and the premium WAF feature charges that provide web application security capabilities.

#### With DDoS Network Protection  

When DDoS Network Protection is enabled on the virtual network containing the Application Gateway, the cost structure becomes more favorable due to the WAF discount benefit. The monthly expenses include the Network Protection plan fee, but the Application Gateway is automatically charged at the Standard v2 rate rather than the higher WAF rate. This reduced pricing occurs because the WAF discount benefit is automatically applied when Application Gateway with WAF is deployed in a DDoS Network Protection-enabled virtual network. The total monthly cost therefore becomes the Network Protection plan fee plus the reduced Application Gateway fees.

To learn more about Application Gateway WAF pricing, see [Application Gateway pricing](https://azure.microsoft.com/pricing/details/application-gateway/).


## Value-added benefits

Network Protection provides extra value beyond IP Protection that should be considered in total cost of ownership calculations. To learn more about the value-added benefits of Network Protection, see [DDoS Protection tier comparison](ddos-protection-sku-comparison.md).

## Cost optimization principles

For comprehensive cost optimization guidance, see [DDoS Protection cost optimization principles](ddos-optimization-guide.md).

## Next steps

- Configure [DDoS Protection diagnostic logs](ddos-diagnostic-alert-templates.md) to monitor and analyze DDoS attack patterns.
- Learn more about [DDoS Protection reference architectures](ddos-protection-reference-architectures.md)
- Get started with [Network Protection](manage-ddos-protection.md) or [IP Protection](manage-ddos-ip-protection-portal.md) configuration.
