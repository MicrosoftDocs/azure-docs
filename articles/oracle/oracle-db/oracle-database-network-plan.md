---
title: Network planning for Oracle Database@Azure
description: Learn about network planning for Oracle Database@Azure. 
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: conceptual
ms.service: oracle-on-azure
ms.custom: engagement-fy23
ms.date: 12/12/2023
---

# Network planning for Oracle Database@Azure

In this article, learn about network topologies and constraints in Oracle Database@Azure.

After you purchase an offer through Azure Marketplace and provision the Oracle Exadata infrastructure, the next step is to create your virtual machine cluster to host your instance of Oracle Exadata Database@Azure. The Oracle database clusters are connected to your Azure virtual network via a virtual network interface card (virtual NIC) from your delegated subnet (delegated to `Oracle.Database/networkAttachment`).  

## Supported topologies

The following table describes the network topologies that are supported by each configuration of network features for Oracle Database@Azure:

|Topology |Supported |
| :------------------- |:---------------:|
|Connectivity to an Oracle database cluster in a local virtual network| Yes |
|Connectivity to an Oracle database cluster in a peered virtual network (in the same region)|Yes |
|Connectivity to an Oracle database cluster in a spoke virtual network in a different region with a virtual wide area network (virtual WAN) |Yes |
|Connectivity to an Oracle database cluster in a peered virtual network (cross-region or global peering) without a virtual WAN\* | No|
|On-premises connectivity to an Oracle database cluster via global and local Azure ExpressRoute |Yes|
|Azure ExpressRoute FastPath |No |
|Connectivity from on-premises to an Oracle database cluster in a spoke virtual network over an ExpressRoute gateway and virtual network peering with a gateway transit|Yes |
|On-premises connectivity to a delegated subnet via a virtual private network (VPN) gateway | Yes |
|Connectivity from on-premises to an Oracle database in a spoke virtual network over a VPN gateway and virtual network peering with gateway transit| Yes |
|Connectivity over active/passive VPN gateways| Yes |
|Connectivity over active/active VPN gateways| No |
|Connectivity over active/active zone-redundant gateways| No |
|Transit connectivity via a virtual WAN for an Oracle database cluster provisioned in a spoke virtual network| Yes |
|On-premises connectivity to an Oracle database cluster via a virtual WAN and attached software-defined wide area network (SD-WAN)|No|
|On-premises connectivity via a secured hub (a firewall network virtual appliance) |Yes|
|Connectivity from an Oracle database cluster on Oracle Database@Azure nodes to Azure resources|Yes|

\* You can overcome this limitation by using a site-to-site VPN.

## Constraints

The following table describes required configurations of supported network features:

|Features |Basic network features |
| :------------------- | -------------------: |
|Delegated subnet per virtual network |1|
|[Network security groups](../../virtual-network/network-security-groups-overview.md) on Oracle Database@Azure delegated subnets|No|
|[User-defined routes (UDRs)](../../virtual-network/virtual-networks-udr-overview.md#user-defined) on Oracle Database@Azure delegated subnets|Yes|
|Connectivity from an Oracle database cluster to a [private endpoint](../../private-link/private-endpoint-overview.md) in the same virtual network on Azure-delegated subnets|No|
|Connectivity from an Oracle database cluster to a [private endpoint](../../private-link/private-endpoint-overview.md) in a different spoke virtual network connected to a virtual WAN|Yes|
|Load balancers for Oracle database cluster traffic|No|
|Dual stack (IPv4 and IPv6) virtual network|Only IPv4 is supported|

> [!NOTE]
> If you want to configure a route table (UDR route) to control the routing of packets through a network virtual appliance or firewall destined to an Oracle Database@Azure instance from a source in the same VNet or a peered VNet, the UDR prefix must be more specific or equal to the delegated subnet size of the Oracle Database@Azure instance. If the UDR prefix is less specific than the delegated subnet size, it isn't effective. 
> 
> For example, if your delegated subnet is `x.x.x.x/24`, you must configure your UDR to `x.x.x.x/24` (equal) or `x.x.x.x/32` (more specific). If you configure the UDR route to be `x.x.x.x/16`, undefined behaviors such as asymmetric routing can cause a network drop at the firewall. 

## Related content

* [Overview of Oracle Database@Azure](database-overview.md)
* [Onboard Oracle Database@Azure](onboard-oracle-database.md)
* [Provision and manage Oracle Database@Azure](provision-oracle-database.md)
* [Support for Oracle Database@Azure](oracle-database-support.md)
* [Groups and roles for Oracle Database@Azure](oracle-database-groups-roles.md)
