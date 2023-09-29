---
title: Upgrading from basic Load Balancer - Guidance
description: Upgrade guidance for migrating basic Load Balancer to standard Load Balancer.
author: mbender-ms
ms.service: load-balancer
ms.author: mbender
ms.topic: conceptual
ms.date: 09/27/2023
ms.custom: template-concept
#customer-intent: As an cloud engineer with basic Load Balancer services, I need guidance and direction on migrating my workloads off basic to standard SKUs
---

# Upgrading from basic Load Balancer - Guidance

>[!Important]
>On September 30, 2025, Basic Load Balancer will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer/). If you are currently using Basic Load Balancer, make sure to upgrade to Standard Load Balancer prior to the retirement date. This article will help guide you through the upgrade process. 

In this article, we discuss guidance for upgrading your Basic Load Balancer instances to Standard Load Balancer. Standard Load Balancer is recommended for all production instances and provides many [key differences](#basic-load-balancer-sku-vs-standard-load-balancer-sku) to your infrastructure.

## Steps to complete the upgrade

We recommend the following approach for upgrading to Standard Load Balancer:

1. Learn about some of the [key differences](#basic-load-balancer-sku-vs-standard-load-balancer-sku) between Basic Load Balancer and Standard Load Balancer. 
1. Identify the Basic Load Balancer to upgrade. 
1. Create a migration plan for planned downtime. 
1. Perform migration with [automated PowerShell scripts](#upgrade-using-automated-scripts) for your scenario or create a new Standard Load Balancer with the Basic Load Balancer configurations.
1. Verify your application and workloads are receiving traffic through the Standard Load Balancer. Then delete your Basic Load Balancer resource. 

## Basic Load Balancer SKU vs. standard Load Balancer SKU 

This section lists out some key differences between these two Load Balancer SKUs. 

| Feature | Standard Load Balancer SKU | Basic Load Balancer SKU |
| ---- | ---- | ---- |
| **Backend type** | IP based, NIC based | NIC based |
| **Protocol** | TCP, UDP | TCP, UDP |
| **Backend pool endpoints** | Any virtual machines or virtual machine scale sets in a single virtual network | Virtual machines in a single availability set or virtual machine scale set |
| **[Health probe protocol](load-balancer-custom-probe-overview.md#probe-protocol)** | TCP, HTTP, HTTPS | TCP, HTTP |
| **[Health probe down behavior](load-balancer-custom-probe-overview.md#probe-down-behavior)** | TCP connections stay alive on an instance probe down and on all probes down | TCP connections stay alive on an instance probe down. All TCP connections end when all probes are down |
| **Availability zones** | Zone-redundant and zonal frontends for inbound and outbound traffic | Not available |
| **Diagnostics** | [Azure Monitor multi-dimensional metrics](load-balancer-standard-diagnostics.md) | Not supported |
| **HA Ports** | [Available for Internal Load Balancer](load-balancer-ha-ports-overview.md) | Not available |
| **Secure by default** | Closed to inbound flows unless allowed by a network security group. Internal traffic from the virtual network to the internal load balancer is allowed. | Open by default. Network security group optional. |
| **Outbound Rules** | [Declarative outbound NAT configuration](load-balancer-outbound-connections.md#outboundrules) | Not available |
| **TCP Reset on Idle** | Available on any rule | Not available |
| **[Multiple front ends](load-balancer-multivip-overview.md)** | Inbound and [outbound](load-balancer-outbound-connections.md) | Inbound only |
| **Management Operations** | Most operations < 30 seconds | Most operations 60-90+ seconds |
| **SLA** | [99.99%](https://azure.microsoft.com/support/legal/sla/load-balancer/v1_0/) | Not available |
| **Global Virtual Network Peering Support** | Standard ILB is supported via Global Virtual Network Peering | Not supported |
| **[NAT Gateway Support](../virtual-network/nat-gateway/nat-overview.md)** | Both Standard ILB and Standard Public Load Balancer are supported via Nat Gateway | Not supported |
| **[Private Link Support](../private-link/private-link-overview.md)** | Standard ILB is supported via Private Link | Not supported |
| **[Global tier (Preview)](cross-region-overview.md)** | Standard Load Balancer supports the Global tier for Public LBs enabling cross-region load balancing | Not supported |

For information on limits, see [Load Balancer limits](../azure-resource-manager/management/azure-subscription-service-limits.md#load-balancer).

## Upgrade using automated scripts 

Use these PowerShell scripts to help with upgrading from Basic to Standard SKU:

- [Upgrading a basic to standard public load balancer](upgrade-basic-standard.md)
- [Upgrade from Basic Internal to Standard Internal](upgrade-basicInternal-standard.md)
- [Upgrade an internal basic load balancer - Outbound connections required](upgrade-internalbasic-to-publicstandard.md)
- [Upgrade a basic load balancer used with Virtual Machine Scale Sets](./upgrade-basic-standard-virtual-machine-scale-sets.md)

## Next Steps

For guidance on upgrading basic Public IP addresses to Standard SKUs, see:

> [!div class="nextstepaction"]
> [Upgrading a Basic Public IP to Standard Public IP - Guidance](../virtual-network/ip-services/public-ip-basic-upgrade-guidance.md)
