---
title: Compare pricing between Azure DDoS Protection tiers
description: Learn about Azure DDoS Protection pricing and compare pricing between Azure DDoS Protection tiers.
services: ddos-protection
author: AbdullahBell
ms.service: ddos-protection
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 07/19/2023
ms.author: abell
---


# Compare pricing between Azure DDoS Protection tiers

Azure DDoS Protection has two tiers: Network Protection and IP Protection. The Network Protection tier is available for resources deployed in virtual networks that are enabled for DDoS Protection. The IP Protection tier is available for public IP addresses that are enabled for DDoS Protection. When switching between tiers we recommend you do a cost analysis to understand the pricing differences between the tiers. In this article we show you how to evaluate cost that you can apply your environment.



## Cost assessment



In scenarios where both IP Protection and a DDoS Protection plan is enabled customers are billed for the lower *per Public IP resource* rate. In this case, we'll automatically start billing for Network Protection. To learn more about the pricing scenarios, see the [pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=ddos-protection).

Network Protection cost begins once the DDoS protection plan is created. IP Protection cost begins once the Public IP address is configured with IP Protection, and its associated virtual network isn't protected by a DDoS protection plan. 
For more information, see [Azure DDoS Protection Pricing](https://azure.microsoft.com/pricing/details/ddos-protection/).


## Example scenarios

For this section we will use the following pricing information:

|  Network Protection | IP Protection | 
|---|---|  
| $29.5 per resource.  | $199 per resource.  |

> [!NOTE]
> Prices shown in this article are examples and are for illustration purposes only. For pricing information according to your region, see the [Pricing page](https://azure.microsoft.com/pricing/details/ddos-protection/)

### Scenario: A virtual network with 15 Public IP addresses

In this example, we'll compare the cost of Network Protection and IP Protection for a virtual network with 15 Public IP addresses. 

#### Network Protection

Let's assume you have only 1 subscription in your tenant. If you create a Network Protection plan, the plan includes protection for 100 IP address. That subscription will be billed for $2944 USD per month (29.5 USD x 100 resources).

#### IP Protection 

Let's take this same scenario and assume you have 15 Public IP addresses. If you enable IP Protection for each Public IP address, you will be billed for $2985 USD per month (199 USD x 15 resources).

Under this scenario it's more cost effective to enable Network Protection for the virtual network. For environments with less than 15 Public IP addresses, it's more cost effective to enable IP Protection for each Public IP address. 

> [!NOTE]
> Network Protection includes valued-added benefits such as DDoS Rapid Protection, WAF Discount, and Cost Protection. For more information, see [Azure DDoS Protection SKU Comparison](ddos-protection-sku-comparison.md).