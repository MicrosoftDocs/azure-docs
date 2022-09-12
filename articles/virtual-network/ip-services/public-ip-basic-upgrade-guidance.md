---

title: Upgrading a basic Public IP
description: Overview of upgrade options and rationale for migrating basic Public IP to standard Public IP
author: mbender-ms
ms.service: load-balancer
ms.author: mbender
ms.topic: overview
ms.date: 09/08/2022

---

# Upgrading a basic Public IP

On September 30, 2025, Basic public IP addresses will be retired. For more information, see the official announcement. If you use Basic SKU public IP addresses, make sure to upgrade to Standard SKU public IP addresses prior to that date. This article will help guide you with the upgrade. 

## Steps to complete the upgrade 

We recommend the following approach to upgrade to Standard SKU public IP addresses. 

## Basic SKU vs. Standard SKU 

This section lists out some key differences between these two Public IP addresses SKUs.

|""| Standard Public IP SKU | Basic Public IP SKU |
|---------|---------|---------|
| **Idle Timeout** | Have an adjustable inbound originated flow idle timeout of 4-30 minutes, with a default of 4 minutes, and fixed outbound originated flow idle timeout of 4 minutes. | Have an adjustable inbound originated flow idle timeout of 4-30 minutes, with a default of 4 minutes, and fixed outbound originated flow idle timeout of 4 minutes. |
| **Security** | Secure by default model and be closed to inbound traffic when used as a frontend. Allow traffic with [network security group](../network-security-groups-overview.md#network-security-groups) is required (for example, on the NIC of a virtual machine with a Standard SKU Public IP attached). | Open by default. Network security groups are recommended but optional for restricting inbound or outbound traffic. |
| **[Availability zones](../../availability-zones/az-overview.md)** | Supported. Standard IPs can be non-zonal, zonal, or zone-redundant. Zone redundant IPs can only be created in [regions where three availability zones](../../availability-zones/az-region.md) are live. IPs created before zones are live won't be zone redundant. | Not supported |
| **[Routing preference](routing-preference-overview.md)** | Supported to enable more granular control of how traffic is routed between Azure and the Internet. | Not supported. |
| **Global tier** | Supported via [cross-region load balancers](../../load-balancer/cross-region-overview.md)| Not supported |
| **[Standard Load Balancer Support](../../load-balancer/skus.md)** | Both IPv4 and IPv6 are supported | Not supported |
| **[NAT Gateway Support](../nat-gateway/nat-overview.md)** | IPv4 is supported | Not supported |
| **[Azure Firewall Support](../nat-gateway/nat-overview.md)** | IPv4 is supported | Not supported |

## Upgrade using Portal, PowerShell, and Azure CLI 

Use these PowerShell scripts to help with upgrading from Basic to Standard SKU. 

- [Upgrade a public IP address - Azure portal](public-ip-upgrade-portal.md)
- [Upgrade a public IP address - Azure PowerShell](public-ip-upgrade-powershell.md)
- [Upgrade a public IP address - Azure CLI](public-ip-upgrade-cli.md)