---
title: Upgrade from Basic Load Balancer
description: Learn how to migrate from Basic Load Balancer to Standard Load Balancer, including planning, scripts, manual steps, and outbound connectivity considerations.
ms.service: azure-load-balancer
ms.author: mbender
ms.topic: concept-article
ms.date: 09/02/2026
# Customer intent: As an cloud engineer with Basic Load Balancer services, I need guidance and direction on migrating my workloads off Basic to Standard SKUs
---

# Upgrade from Basic Load Balancer to Standard Load Balancer

> [!IMPORTANT]
> On September 30, 2025, Microsoft retired Basic Load Balancer. For more information, see the [official announcement](https://azure.microsoft.com/updates/azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer/). If you're currently using Basic Load Balancer, upgrade to Standard Load Balancer as soon as possible. This article helps guide you through the upgrade process. 

This article provides guidance for upgrading Basic Load Balancer instances to Standard Load Balancer. Use Standard Load Balancer for production workloads. Review the [key differences between the SKUs](#basic-load-balancer-sku-vs-standard-load-balancer-sku) before you upgrade.

## Steps to upgrade Basic Load Balancer to Standard Load Balancer

We recommend the following approach for upgrading to Standard Load Balancer:

1. Learn about some of the [key differences](#basic-load-balancer-sku-vs-standard-load-balancer-sku) between Basic Load Balancer and Standard Load Balancer. 
1. Identify the Basic Load Balancer to upgrade. 
1. Create a migration plan for planned downtime. 
1. [Choose a migration method](#choose-a-migration-method) for your scenario.
1. Verify your application and workloads are receiving traffic through the Standard Load Balancer. Then delete your Basic Load Balancer resource. 

> [!IMPORTANT]
> Migration requires downtime and is one-way. Schedule a maintenance window, validate your scenario before migration, and resolve reported blockers. If the PowerShell migration fails, correct the issue and retry from the saved state instead of attempting to restore the Basic Load Balancer.

## Basic Load Balancer SKU vs. Standard Load Balancer SKU 

Before you plan your migration, review the full comparison of Basic and Standard Load Balancer features, including backend types, health probe behavior, availability zones, and SLA, in the [Load Balancer SKU comparison](skus.md#skus). Understanding these differences helps you plan for any configuration changes your workloads need after the upgrade.

For information on limits, see [Load Balancer limits](../azure-resource-manager/management/azure-subscription-service-limits.md#load-balancer).

## Choose a migration method

- **PowerShell module (recommended)**: Use the [`AzureBasicLoadBalancerUpgrade` module](./upgrade-basic-standard-with-powershell.md) when your scenario is supported. Run its validation command and resolve reported blockers before migration.
- **Azure portal manual rebuild**: Follow the [manual migration steps](#upgrade-manually) when the PowerShell module doesn't support your scenario or when you need direct control over recreating the configuration. The portal steps are a manual rebuild, not a separate in-place upgrade.

Related Basic public IP addresses might also require an upgrade. For guidance, see [Upgrade a Basic public IP address to Standard SKU](../virtual-network/ip-services/public-ip-basic-upgrade-guidance.md).

## Upgrade manually

> [!NOTE]
> Use the [PowerShell module](./upgrade-basic-standard-with-powershell.md) for supported scenarios because it reduces the number and complexity of manual steps.

> [!WARNING]
> Before manually upgrading a Basic Load Balancer, make sure that all Public IPs associated with both the Load Balancer and its backend Virtual Machines are set to 'static'. If you disassociate a Public IP or remove all backend VMs before changing the IP allocation to static, the IP address may be lost.

When manually migrating from a Basic to Standard SKU Load Balancer, there are a couple key considerations to keep in mind:

- It isn't possible to mix Basic and Standard SKU IPs or Load Balancers. All Public IPs associated with a Load Balancer and its backend pool members must match.
- You must set the Public IP allocation method to **static** when you disassociate a Public IP from a Load Balancer or Virtual Machine, or you lose the allocated IP. 
- Standard SKU public IP addresses are secure by default, requiring that a Network Security Group explicitly allow traffic to any public IPs
- Standard SKU Load Balancers block outbound access by default. To enable outbound access, a public load balancer needs an outbound rule for backend members. For private load balancers, either configure a NAT Gateway on the backend pool members' subnet or add instance-level public IP addresses to each backend member.

The following list suggests the order of operations for manually upgrading a Basic Load Balancer in common virtual machine and virtual machine scale set configurations by using the Azure portal:

### Prepare the Basic Load Balancer configuration

1. Change all Public IPs associated with the Basic Load Balancer and backend Virtual Machines to 'static' allocation
1. For private Load Balancers, record the private IP addresses allocated to the frontend IP configurations
1. Record the backend pool membership of the Basic Load Balancer
1. Record the load balancing rules, NAT rules, and health probe configuration of the Basic Load Balancer

### Recreate and validate the Standard Load Balancer configuration

1. Create a new Standard SKU Load Balancer, matching the public or private configuration of the Basic Load Balancer. Name the frontend IP configuration something temporary. For public load balancers, use a new Public IP address for the frontend configuration. For guidance, see [Create a Public Load Balancer in the Portal](./quickstart-load-balancer-standard-public-portal.md) or [Create an Internal Load Balancer in the Portal](./quickstart-load-balancer-standard-internal-portal.md)
1. Duplicate the Basic SKU Load Balancer configuration for the following:
    1. Backend pool names
    1. Backend pool membership (virtual machines and virtual machine scale sets)
    1. Health probes
    1. Load balancing rules - use the temporary frontend configuration
    1. NAT rules - use the temporary frontend configuration
1. For public load balancers, if you don't have one already, [create a new Network Security Group](../virtual-network/tutorial-filter-network-traffic.md) with allow rules for the traffic coming through the Load Balancer rules
1. Confirm that the Standard Load Balancer contains the expected temporary frontend, backend pools, probes, and rules. Resolve any configuration errors before continuing.

   > [!IMPORTANT]
   > This checkpoint validates the recreated configuration, not live application traffic. Basic and Standard SKU resources can't be mixed, so complete live traffic validation after cutover. Keep the recorded Basic Load Balancer configuration and don't delete the Basic resource if the Standard configuration doesn't validate.

### Cut over to Standard Load Balancer

1. For Virtual Machine Scale Set backends, remove the Load Balancer association in the Networking settings and [update the instances](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-perform-manual-upgrades)
1. Delete the Basic Load Balancer
   > [!NOTE]
   > For Virtual Machine Scale Set backends, you'll need to remove the load balancer association in the Networking settings. Once removed, you'll also need to [**update the instances**](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-perform-manual-upgrades) 
1. [Upgrade all Public IPs](../virtual-network/ip-services/public-ip-basic-upgrade-guidance.md) previously associated with the Basic Load Balancer and backend Virtual Machines to Standard SKU. For Virtual Machine Scale Sets, remove any instance-level public IP configuration, update the instances, then add a new one with Standard SKU and update the instances again.
1. Recreate the frontend configurations from the Basic Load Balancer on the newly created Standard Load Balancer, using the same public or private IP addresses as on the Basic Load Balancer
1. Update the load balancing and NAT rules to use the appropriate frontend configurations
1. For public Load Balancers, [create one or more outbound rules](./outbound-rules.md) to enable internet access for backend pools

### Verify traffic and clean up

1. Test that inbound and outbound traffic flow through the new Standard Load Balancer as expected.
1. Remove the temporary frontend configuration.

## FAQ

### Does the Basic Load Balancer retirement impact Cloud Services Extended Support (CSES) deployments?
No, this retirement doesn't impact your existing or new deployments on CSES. This condition means that you can still create and use Basic Load Balancers for CSES deployments. However, use Standard SKU on Azure Resource Manager (ARM) native resources (those that don't depend on CSES) when possible, because Standard has more advantages than Basic.

### What happens to my Basic Load Balancer resource after retirement?
Basic Load Balancers remain operational after September 30, 2025, giving you more time to transition to Standard SKU. If you continue using Basic Load Balancers after the retirement date, you accept the risks and acknowledge that the service is unsupported and not covered by SLA guarantees.

## Next Steps

For guidance on upgrading Basic Public IP addresses to Standard SKUs, see:

> [!div class="nextstepaction"]
> [Upgrading a Basic Public IP to Standard Public IP - Guidance](../virtual-network/ip-services/public-ip-basic-upgrade-guidance.md)
