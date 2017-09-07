---
title: Azure Standard Load Balancer overview | Microsoft Docs
description: Overview of Azure Standard Load Balancer features
services: load-balancer
documentationcenter: na
author: kumudd
manager: timlt
editor: ''

ms.assetid: 
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2017
ms.author: kumud
---

# Azure Standard Load Balancer overview (Public Preview)
 
The Standard Load Balancer in Azure includes the following capabilities:
- use any VM in a Load Balancer pool.  Mix and match VMs, virtual machine scale sets, with or without Availability Sets.
- 50 times larger pool scale. using Standard Load Balancers, you can load balance across 5,0001 VM instances, including 1,000 instance virtual machine scale sets (single zone or zone spanning).
-  Use Availability Zones and Load Balancer to define frontends as zonal or zone-resilient and balance within zones or across zones based while still enjoying low latency and high throughput.
- New diagnostics and monitoring capabilities including health status, traffic counters, and data plane availability measurements.
- Mandatory NSG for all NICs associated with Load Balancer endpoints and Internet Load Balancer Public IP.
- Ability to turn off outbound SNAT.

[!Note]
>The SKU Property value is assigned as **Basic** to any Load Balancer that was created using earlier APIs.

The Load Balancer versions are not interchangeable, meaning, you cannot convert a Basic Load balancer to a Standard Load Balancer or vice versa.

The Standard Load Balancer requires the following:
- an NSG must be applied to unblock connections on a configured Load Balancer rule. 
 
- Outbound originated connectivity (SNAT) is enabled by default.  Customer can define a Load Balancer resource property to disable outbound originated connections. 
 
- Default SNAT is not required.  VM’s in internal Load Balancer pool do not get outbound connectivity unless Internet Load Balancer Public IP is assigned, or, they are also in public Load Balancer pool.  The rule has have a property to decide whether Load Balancer can provide SNAT from a given frontend. When NAT service arrives, customers are able to define more flexible and sophisticated outbound behaviors.


**Basic vs. StandardLoad Balancer service limits**


|Limit    |Load Balancer Type      |Value    |
|---------|---------|---------|
|defaultMaxLoadBalancersPerSubscription     | Basic        |  100       |
|defaultMaxLoadBalancersStandardPerSubscription     | Standard        |         |
|defaultMaxInboundNatOrLbRulesPerLoadBalancer     | Basic        |   150      |
|defaultMaxInboundNatOrLbRulesStandardPerLoadBalancer     | Standard        |         |
|defaultMaxFrontendIpsPerLoadBalancer    |     Basic    |  10       |
|defaultMaxFrontendIpsStandardPerLoadBalancer    | Standard        |         |
|defaultMaxInboundRulesPerNic     | Basic        |  |
|defaultMaxInboundRulesStandardPerNic   | Standard        |         |
|defaultMaxOutboundNatRulesPerLoadBalancer  |     Basic/Standard    | Do not use  |
|maxAllowedAvailabilitySetsStandardPerLoadBalancer    | Standard        |  150       |
|maxAllowedLoadBalancersPerSubscription     | Basic        | 1000     |
|maxAllowedLoadBalancersStandardPerSubscription    | Standard        |         |
|maxAllowedInboundNatOrLbRulesPerLoadBalancer  |     Basic    |       |
|maxAllowedInboundNatOrLbRulesStandardPerLoadBalancer | Standard        |         |
|maxAllowedFrontendIpsPerLoadBalancer | Basic        |600  |
|maxAllowedFrontendIpsStandardPerLoadBalancer | Standard        |         |
|maxAllowedInboundRulesPerNic|     Basic    | 500  |
|maxAllowedInboundRulesStandardPerNic|    Standard    |  |
|maxAllowedOutboundNatRulesPerLoadBalancer|     Basic/Standard    | Do not use  |


**Basic vs Standard Load Balancer interaction with Availability Zones**

TBD

## Next steps

- Create an [Internet-facing load balancer](load-balancer-get-started-internet-portal.md)

- Learn about some of the other key [networking capabilities](../networking/networking-overview.md) of Azure

