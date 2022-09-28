---

title: Upgrading a basic public IP address to standard SKU - Guidance
description: Overview of upgrade options and guidance for migrating basic public IP to standard public IP for future basic public IP address retirement
author: mbender-ms
ms.service: load-balancer
ms.author: mbender
ms.topic: overview
ms.date: 09/19/2022
#customer-intent: As an cloud engineer with Basic public IP services, I need guidance and direction on migrating my workloads off basic to Standard SKUs
---

# Upgrading a basic public IP address to Standard SKU - Guidance

In this article, we'll discuss guidance for upgrading your Basic SKU public IPs to Standard SKU. Standard public IPs are recommended for all production instances and provide many [key differences](#basic-sku-vs-standard-sku) to your infrastructure.
## Steps to complete the upgrade 

We recommend the following approach to upgrade to Standard SKU public IP addresses. 

1. Learn about some of the [key differences](#basic-sku-vs-standard-sku) between Basic SKU public IP and Standard SKU public IP. 
1. Identify the Basic SKU public IP to upgrade.
1. Determine if you would need [Zone Redundancy](public-ip-addresses.md#availability-zone). 
    1. If you need a zone redundant public IP address, create a new Standard SKU public IP address using [Portal](create-public-ip-portal.md), [PowerShell](create-public-ip-powershell.md), [CLI](create-public-ip-cli.md), or [ARM template](create-public-ip-template.md).
    1. If you do not need a zone redundant public IP address, use the [following upgrade options](#upgrade-using-portal-powershell-and-azure-cli). 
1. Create a migration plan for planned downtime.
1. Depending on the resource associated with your Basic SKU public IP addresses, perform the upgrade based on the following table:

    | Resource using Basic SKU public IP addresses | Decision path |
    | ------ | ------ |
    | Virtual Machine or Virtual Machine Scale Sets | Use the [following upgrade options](#upgrade-using-portal-powershell-and-azure-cli). |
    | Load Balancer (Basic) | Use the [following upgrade options](#upgrade-using-portal-powershell-and-azure-cli).   |
    | VPN Gateway (Basic) | Cannot dissociate and upgrade. Create a [new VPN gateway with a SKU type other than Basic](../../vpn-gateway/tutorial-create-gateway-portal.md). |
    | Application Gateway (v1) | Cannot dissociate and upgrade. Use this [migration script to migrate from v1 to v2](../../application-gateway/migrate-v1-v2.md).  |
1. Verify your application and workloads are receiving traffic through the Standard SKU public IP address. Then delete your Basic SKU public IP address resource. 

## Basic SKU vs. Standard SKU 

This section lists out some key differences between these two SKUs.

|""| Standard SKU public IP | Basic SKU public IP |
|---------|---------|---------|
| **Allocation method** | Static. | For IPv4: Dynamic or Static; For IPv6: Dynamic. |
| **Security** | Secure by default model and be closed to inbound traffic when used as a frontend. Allow traffic with [network security group](../network-security-groups-overview.md#network-security-groups) is required (for example, on the NIC of a virtual machine with a Standard SKU public IP attached). | Open by default. Network security groups are recommended but optional for restricting inbound or outbound traffic. |
| **[Availability zones](../../availability-zones/az-overview.md)** | Supported. Standard IPs can be non-zonal, zonal, or zone-redundant. Zone redundant IPs can only be created in [regions where three availability zones](../../availability-zones/az-region.md) are live. IPs created before zones are live won't be zone redundant. | Not supported |
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
