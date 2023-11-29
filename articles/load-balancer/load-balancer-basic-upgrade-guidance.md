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
1. Perform migration with [automated PowerShell scripts](#upgrade-using-automated-scripts-recommended) for your scenario or create a new Standard Load Balancer with the Basic Load Balancer configurations.
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

## Upgrade using automated scripts (recommended)

Use these PowerShell scripts to help with upgrading from Basic to Standard SKU:

- [Upgrading a basic to standard public load balancer with PowerShell](./upgrade-basic-standard-with-powershell.md)

## Upgrade manually

> [!NOTE]
> Although manually upgrading your Basic Load Balancer to a Standard Load Balancer using the Portal is an option, we recommend using the [**automated script option**](./upgrade-basic-standard-with-powershell.md) above, due to the number of steps and complexity of the migration. The automation ensures a consistent migration and minimizes downtime to load balanced applications. 

When manually migrating from a Basic to Standard SKU Load Balancer, there are a couple key considerations to keep in mind:

- It is not possible to mix Basic and Standard SKU IPs or Load Balancers. All Public IPs associated with a Load Balancer and its backend pool members must match.
- Public IP allocation method must be set to 'static' when a Public IP is disassociated from a Load Balancer or Virtual Machine, or the allocated IP will be lost. 
- Standard SKU public IP addresses are secure by default, requiring that a Network Security Group explicitly allow traffic to any public IPs
- Standard SKU Load Balancers block outbound access by default. To enable outbound access, a public load balancer needs an outbound rule for backend members. For private load balancers, either configure a NAT Gateway on the backend pool members' subnet or add instance-level public IP addresses to each backend member. 

Suggested order of operations for manually upgrading a Basic Load Balancer in common virtual machine and virtual machine scale set configurations using the Portal:

1. Change all Public IPs associated with the Basic Load Balancer and backend Virtual Machines to 'static' allocation
1. For private Load Balancers, record the private IP addresses allocated to the frontend IP configurations
1. Record the backend pool membership of the Basic Load Balancer
1. Record the load balancing rules, NAT rules and health probe configuration of the Basic Load Balancer
1. Create a new Standard SKU Load Balancer, matching the public or private configuration of the Basic Load Balancer. Name the frontend IP configuration something temporary. For public load balancers, use a new Public IP address for the frontend configuration. For guidance, see [Create a Public Load Balancer in the Portal](./quickstart-load-balancer-standard-public-portal.md) or [Create an Internal Load Balancer in the Portal](./quickstart-load-balancer-standard-internal-portal.md)
1. Duplicate the Basic SKU Load Balancer configuration for the following:
    1. Backend pool names
    1. Backend pool membership (virtual machines and virtual machine scale sets)
    1. Health probes
    1. Load balancing rules - use the temporary frontend configuration
    1. NAT rules - use the temporary frontend configuration
1. For public load balancers, if you do not have one already, [create a new Network Security Group](../virtual-network/tutorial-filter-network-traffic.md) with allow rules for the traffic coming through the Load Balancer rules
1. For Virtual Machine Scale Set backends, remove the Load Balancer association in the Networking settings and [update the instances](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-policy.md#performing-manual-upgrades) 
1. Delete the Basic Load Balancer 
   > [!NOTE]
   > For Virtual Machine Scale Set backends, you will need to remove the load balancer association in the Networking settings. Once removed, you will also need to [**update the instances**](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-policy.md#performing-manual-upgrades) 
1. [Upgrade all Public IPs](../virtual-network/ip-services/public-ip-upgrade-portal.md) previously associated with the Basic Load Balancer and backend Virtual Machines to Standard SKU. For Virtual Machine Scale Sets, remove any instance-level public IP configuration, update the instances, then add a new one with Standard SKU and update the instances again. 
1. Recreate the frontend configurations from the Basic Load Balancer on the newly created Standard Load Balancer, using the same public or private IP addresses as on the Basic Load Balancer
1. Update the load balancing and NAT rules to use the appropriate frontend configurations
1. For public Load Balancers, [create one or more outbound rules](./outbound-rules.md) to enable internet access for backend pools
1. Remove the temporary frontend configuration
1. Test that inbound and outbound traffic flow through the new Standard Load Balancer as expected 

## Next Steps

For guidance on upgrading basic Public IP addresses to Standard SKUs, see:

> [!div class="nextstepaction"]
> [Upgrading a Basic Public IP to Standard Public IP - Guidance](../virtual-network/ip-services/public-ip-basic-upgrade-guidance.md)
