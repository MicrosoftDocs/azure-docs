---
title: Upgrading a basic public IP address to standard SKU - Guidance
description: Overview of upgrade options and guidance for migrating basic public IP to standard public IP for future basic public IP address retirement
ms.service: virtual-network
ms.subservice: ip-services
ms.custom: devx-track-azurecli
ms.topic: overview
author: mbender-ms
ms.author: mbender
ms.date: 08/24/2023
#customer-intent: As an cloud engineer with Basic public IP services, I need guidance and direction on migrating my workloads off basic to Standard SKUs
---

# Upgrading a basic public IP address to Standard SKU - Guidance

>[!Important]
>On September 30, 2025, Basic SKU public IPs will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired/). If you are currently using Basic SKU public IPs, make sure to upgrade to Standard SKU public IPs prior to the retirement date. This article will help guide you through the upgrade process. 

In this article, learn guidance for upgrading your Basic SKU public IPs to Standard SKU. Standard public IPs are recommended for all production instances and provide many [key differences](#basic-sku-vs-standard-sku) to your infrastructure.
## Steps to complete the upgrade 

We recommend the following approach to upgrade to Standard SKU public IP addresses. 

1. Learn about some of the [key differences](#basic-sku-vs-standard-sku) between Basic SKU public IP and Standard SKU public IP. 

2. Identify the Basic SKU public IP to upgrade.

3. Determine if you would need [Zone Redundancy](public-ip-addresses.md#availability-zone). 

    a. If you need a zone redundant public IP address, create a new Standard SKU public IP address using [Portal](create-public-ip-portal.md), [PowerShell](create-public-ip-powershell.md), [CLI](create-public-ip-cli.md), or [ARM template](create-public-ip-template.md).

    b. If you don't need a zone redundant public IP address, use the [following upgrade options](#upgrade-using-portal-powershell-and-azure-cli). 

4. Create a migration plan for planned downtime.

5. Depending on the resource associated with your Basic SKU public IP addresses, perform the upgrade based on the following table:

 | Resource using Basic SKU public IP addresses | Decision path |
  | ------ | ------ |
  | Virtual Machine or Virtual Machine Scale Sets (flex model) | Disassociate IP(s) and utilize the upgrade options detailed after the table. For virtual machines, you can use the [upgrade script](public-ip-upgrade-vm.md). |
  | Load Balancer (Basic SKU) | New LB SKU required. Use the upgrade script [Upgrade Basic Load Balancer to Standard SKU](../../load-balancer/upgrade-basic-standard-with-powershell.md) to upgrade to Standard Load Balancer |
  | VPN Gateway (Basic SKU or VpnGw1-5 SKU using Basic IPs) | No action required for existing VPN gateways that use Basic SKU public IP addresses. For new VPN gateways, we recommend that you use Standard SKU public IP addresses.|
| ExpressRoute Gateway (using Basic IPs) | New ExpressRoute Gateway required. Create a [new ExpressRoute Gateway with a Standard SKU IP](../../expressroute/expressroute-howto-add-gateway-portal-resource-manager.md). |
  | Application Gateway (v1 SKU) | New AppGW SKU required. Use this [migration script to migrate from v1 to v2](../../application-gateway/migrate-v1-v2.md).  |

> [!NOTE]
> If you have a virtual machine scale set (uniform model) with public IP configurations per instance, note these are not Public IP resources and as such cannot be upgraded; a new virtual machine scale set is required.  You can use the SKU property to specify that Standard IP configurations are required for each VMSS instance as shown [here](../../virtual-machine-scale-sets/virtual-machine-scale-sets-networking.md#public-ipv4-per-virtual-machine). 

## Basic SKU vs. Standard SKU 

This section lists out some key differences between these two SKUs.

|""| Standard SKU public IP | Basic SKU public IP |
|---------|---------|---------|
| **Allocation method** | Static. | For IPv4: Dynamic or Static; For IPv6: Dynamic. |
| **Security** | Secure by default model and be closed to inbound traffic when used as a frontend. Allow traffic with [network security group](../network-security-groups-overview.md#network-security-groups) is required (for example, on the NIC of a virtual machine with a Standard SKU public IP attached). | Open by default. Network security groups are recommended but optional for restricting inbound or outbound traffic. |
| **[Availability zones](../../availability-zones/az-overview.md)** | Supported. Standard IPs can be nonzonal, zonal, or zone-redundant. Zone redundant IPs can only be created in [regions where three availability zones](../../availability-zones/az-region.md) are live. IPs created before availability zones aren't zone redundant. | Not supported |
| **[Routing preference](routing-preference-overview.md)** | Supported to enable more granular control of how traffic is routed between Azure and the Internet. | Not supported. |
| **Global tier** | Supported via [cross-region load balancers](../../load-balancer/cross-region-overview.md)| Not supported |
| **[Standard Load Balancer Support](../../load-balancer/skus.md)** | Both IPv4 and IPv6 are supported | Not supported |
| **[NAT Gateway Support](../nat-gateway/nat-overview.md)** | IPv4 is supported | Not supported |
| **[Azure Firewall Support](../nat-gateway/nat-overview.md)** | IPv4 is supported | Not supported |

## Upgrade using Portal, PowerShell, and Azure CLI 

Use the Azure portal, Azure PowerShell, or Azure CLI to help upgrade from Basic to Standard SKU. 

- [Upgrade a public IP address - Azure portal](public-ip-upgrade-portal.md)

- [Upgrade a public IP address - Azure PowerShell](public-ip-upgrade-powershell.md)

- [Upgrade a public IP address - Azure CLI](public-ip-upgrade-cli.md)

## Next steps

For guidance on upgrading Basic Load Balancer to Standard SKUs, see:

> [!div class="nextstepaction"]
> [Upgrading from Basic Load Balancer - Guidance](../../load-balancer/load-balancer-basic-upgrade-guidance.md)
