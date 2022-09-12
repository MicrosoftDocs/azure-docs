---
title: Upgrading from Basic Load Balancer - Guidance
description: Upgrade guidance for migrating basic Load Balancer to standard Load Balancer
author: mbender-ms
ms.service: load-balancer
ms.author: mbender
ms.topic: overview
ms.date: 09/08/2022
---

# Upgrading a basic Load Balancer guidance

On September 30, 2025, Basic Load Balancer will be retired. For more information, see the official announcement. If you use Basic Load Balancer, make sure to upgrade to Standard Load Balancer prior to that date. This article will help guide you with the upgrade. 

## Steps to complete the upgrade 

We recommend the following approach to upgrade to Standard Load Balancer:

1. Learn about some of the [key differences](#basic-load-balancer-sku-vs-standard-load-balancer-sku) between Basic Load Balancer and Standard Load Balancer. 
1. Identify the basic load balancer to upgrade. 
1. Create a migration plan for planned downtime. 
1. Create a new standard load balancer with the basic load balancer configurations or [use automated PowerShell scripts](#upgrade-using-automated-scripts). 
1. Verify your application and workloads are receiving traffic through the standard load balancer. Then delete your basic load balancer resource. 

## Basic Load Balancer SKU vs. Standard Load Balancer SKU 

This section lists out some key differences between these two Load Balancer SKUs. 

| Feature | Standard Load Balancer SKU | Basic Load Balancer SKU |
| ---- | ---- | ---- |
| **Backend type** | IP based, NIC based | NIC based |
| **Protocol** | TCP, UDP | TCP, UDP |
| **[Frontend IP configurations](../azure-resource-manager/management/azure-subscription-service-limits.md#load-balancer)** | Supports up to 600 configurations | Supports up to 200 configurations |
| **[Backend pool size](../azure-resource-manager/management/azure-subscription-service-limits.md#load-balancer)** | Supports up to 1000 instances | Supports up to 300 instances |
| **Backend pool endpoints** | Any virtual machines or virtual machine scale sets in a single virtual network | Virtual machines in a single availability set or virtual machine scale set |
| **[Health probe types](load-balancer-custom-probe-overview.md#probe-types)** | TCP, HTTP, HTTPS | TCP, HTTP |
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
| **Global VNet Peering Support** | Standard ILB is supported via Global VNet Peering | Not supported |
| **[NAT Gateway Support](../virtual-network/nat-gateway/nat-overview.md)** | Both Standard ILB and Standard Public Load Balancer are supported via Nat Gateway | Not supported |
| **[Private Link Support](../private-link/private-link-overview.md)** | Standard ILB is supported via Private Link | Not supported |
| **[Global tier (Preview)](cross-region-overview.md)** | Standard Load Balancer supports the Global tier for Public LBs enabling cross-region load balancing | Not supported |

## Upgrade using automated scripts 

Use these PowerShell scripts to help with upgrading from Basic to Standard SKU. 

- [Upgrading a basic to standard public load balancer](upgrade-basic-standard.md)
- [Upgrade from Basic Internal to Standard Internal](upgrade-basicInternal-standard.md)
- [Upgrade an internal basic load balancer - Outbound connections required](upgrade-internalbasic-to-publicstandard.md)