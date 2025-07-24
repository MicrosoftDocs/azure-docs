---
title: Compare pricing between Azure DDoS Protection tiers
description: Learn about Azure DDoS Protection pricing and compare pricing between Azure DDoS Protection tiers.
services: ddos-protection
author: AbdullahBell
ms.service: azure-ddos-protection
ms.topic: concept-article
ms.date: 07/24/2025
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


### Scenario 1: Small application with 10 Public IP addresses

In this example, we compare the cost of Network Protection and IP Protection for a virtual network with 10 Public IP addresses. 

#### Network Protection

Let's assume you have only one subscription in your tenant. If you create a Network Protection plan, the plan includes protection for 100 IP addresses. The subscription is billed for the Network Protection plan, which covers up to 100 resources. 

#### IP Protection 

In this same scenario with 10 Public IP addresses, if you enable IP Protection for each Public IP address, you're billed per protected IP resource.

Under this scenario, it's more cost effective to enable IP Protection for each Public IP address. For environments with more than 15 Public IP addresses, it's more cost effective to create a Network Protection plan. 

**Cost comparison analysis:**
- Network Protection: Fixed monthly cost for up to 100 IP addresses
- IP Protection: Per-IP monthly cost × 10 resources  
- **Result: IP Protection provides cost savings for smaller deployments**

### Scenario 2: Enterprise multi-subscription environment

This scenario illustrates cost benefits for large organizations with multiple subscriptions sharing a DDoS protection plan.

#### Multiple subscriptions with Network Protection

An enterprise has 3 subscriptions with the following public IP distribution:
- Subscription A: 25 public IPs (production workloads)
- Subscription B: 15 public IPs (staging environment)  
- Subscription C: 8 public IPs (development environment)
- **Total: 48 public IPs across 3 subscriptions**

With Network Protection, you create one plan that covers all subscriptions under the tenant:
- Cost: Single monthly Network Protection plan fee (covers up to 100 IPs across all subscriptions)
- Effective per-IP cost: Significantly lower due to shared plan coverage

#### Multiple subscriptions with IP Protection

If using IP Protection for the same 48 public IPs:
- Cost: Per-IP monthly rate × 48 resources across all subscriptions

**Cost comparison analysis:**
- Network Protection: Single plan fee regardless of IP count (up to 100)
- IP Protection: Linear cost scaling with each protected IP
- **Result: Network Protection provides substantial savings for enterprise environments with many IPs**

### Scenario 3: Application Gateway with WAF integration

This scenario demonstrates the value-added benefits of Network Protection when using Azure Application Gateway with WAF.

#### Without DDoS Network Protection
- Application Gateway WAF v2: Standard WAF pricing rates apply
- Total monthly cost: Application Gateway WAF fees

#### With DDoS Network Protection  
- Network Protection plan: Monthly plan fee
- Application Gateway Standard v2 (WAF discount applied): Reduced pricing due to WAF discount benefit
- Total monthly cost: Network Protection plan + reduced Application Gateway fees

**WAF discount benefit: Significant monthly savings on Application Gateway costs when DDoS Network Protection is enabled**

### Scenario 4: Seasonal workloads with variable IP requirements

This scenario shows cost implications for applications with fluctuating public IP requirements.

Consider an e-commerce platform that scales during peak seasons:

#### Regular operations (9 months)
- 8 public IPs needed
- IP Protection cost: Per-IP rate × 8 resources × 9 months

#### Peak season (3 months) 
- 25 public IPs needed during holiday season
- Two options:
  1. **IP Protection**: Per-IP rate × 25 resources × 3 months
  2. **Temporary Network Protection**: Monthly plan rate × 3 months

**Annual cost comparison analysis:**
- IP Protection only: Higher total cost due to linear scaling during peak periods
- IP Protection + seasonal Network Protection: Optimized cost through strategic switching
- **Result: Hybrid approach provides cost savings for seasonal traffic patterns**

To calculate your unique pricing scenarios, see the [pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=ddos-protection).

> [!NOTE]
> Network Protection includes valued-added benefits such as DDoS Rapid Protection, WAF Discount, and Cost Protection. For more information, see [Azure DDoS Protection SKU Comparison](ddos-protection-sku-comparison.md).

## Value-added benefits analysis

Network Protection provides additional value beyond basic DDoS mitigation that should be considered in total cost of ownership calculations:

### Cost Protection Guarantee
Network Protection includes a cost protection guarantee that provides service credits for additional Azure costs incurred during a documented DDoS attack. This includes:
- Data transfer costs from scale-out operations
- Additional compute costs for auto-scaling responses
- Other documented Azure service costs directly attributable to DDoS attacks

### DDoS Rapid Response (DRR)
Network Protection customers have access to the DDoS Rapid Response team during active attacks, providing:
- Real-time expert analysis and guidance
- Custom mitigation recommendations  
- Post-attack analysis and recommendations
- Value: Equivalent to premium support services for incident response

### WAF Discount Benefits
When Application Gateway with WAF is deployed in a DDoS Network Protection-enabled virtual network:
- Application Gateway is charged at the Standard (non-WAF) rate
- Provides monthly savings per Application Gateway instance
- Applies to both Application Gateway v1 and v2 SKUs

## Cost optimization strategies

For comprehensive cost optimization guidance, see [DDoS Protection cost optimization principles](ddos-optimization-guide.md).

## Regional pricing considerations

DDoS Protection pricing may vary by Azure region. Key considerations:

- Review the [official pricing page](https://azure.microsoft.com/pricing/details/ddos-protection/) for your specific region


## Next steps

- Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=ddos-protection) to estimate costs for your specific environment
- Learn more about [DDoS Protection reference architectures](ddos-protection-reference-architectures.md)
- Review [DDoS Protection cost optimization principles](ddos-optimization-guide.md) for detailed cost management strategies
- Compare [DDoS Protection SKU features](ddos-protection-sku-comparison.md) to understand value-added benefits
- Get started with [Network Protection](manage-ddos-protection.md) or [IP Protection](manage-ddos-ip-protection-portal.md) configuration
