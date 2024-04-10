---
title: Network planning for Oracle Database@Azure
author: jjaygbay1
ms.author: jacobjaygbay
description: Learn about topologies and constraints for Oracle Database@Azure. 
ms.topic: conceptual
ms.service: virtual-machines
ms.subservice: oracle
ms.custom: engagement-fy23
ms.date: 12/12/2023
---

# Network planning for Oracle Database@Azure

In this article, you learn about the topologies and constraints for Oracle Database@Azure. After you purchase the offer through Azure Marketplace and provision the Exadata infrastructure, you'll then need to create your virtual machine cluster that will host your Oracle Exadata Database. These Oracle database clusters are connected to your Azure virtual network via a virtual NIC from your delegated subnet (delegated to ``Oracle.Database/networkAttachement``).  

## Supported topologies

The following table describes the network topologies supported by each network features configuration of Oracle Database@Azure.

|Topology |Supported |
| :------------------- |:---------------:|
|Connectivity to Oracle database cluster in a local virtual network| Yes |
|Connectivity to Oracle database cluster in a peered virtual network (Same region)|Yes |
|Connectivity to Oracle database cluster in a spoke VNet in a different region with VWAN |Yes |
|Connectivity to Oracle database cluster in a peered virtual network* (Cross region or global peering)* without VWAN| No|
|On-premises connectivity to Oracle database cluster via Global and Local Expressroute |Yes|
|ExpressRoute (ER) FastPath |No |
|Connectivity from on-premises to Oracle database cluster in a spoke virtual network over ExpressRoute gateway and virtual network peering with gateway transit|Yes |
|On-premises connectivity to Delegated Subnet via VPN GW| Yes |
|Connectivity from on-premises to Oracle database in a spoke virtual network over VPN gateway and virtual network peering with gateway transit| Yes |
|Connectivity over Active/Passive VPN gateways| Yes |
|Connectivity over Active/Active VPN gateways| No |
|Connectivity over Active/Active Zone Redundant gateways| No |
|Transit connectivity via vWAN for Oracle database cluster provisioned in spoke virtual networks| Yes |
|On-premises connectivity to Oracle database cluster via vWAN attached SD-WAN| No|
|On-premises connectivity via Secured HUB (Firewall NVA) | No|
|Connectivity from Oracle database cluster on Oracle Database@Azure nodes to Azure resources|Yes|

* You can overcome this limitation by setting Site-to-Site VPN.

## Constraints

The following table describes the configuration of supported network features:

|Features |Basic network features |
| :------------------- | -------------------: |
|Delegated subnet per virtual network |1|
|[Network Security Groups](../../virtual-network/network-security-groups-overview.md) on Oracle Database@Azure-delegated subnets|No|
|[User-defined routes (UDRs)](../../virtual-network/virtual-networks-udr-overview.md#user-defined) on Oracle Database@Azure-delegated subnets|Yes|
|Connectivity from Oracle database cluster to [private endpoints](../../private-link/private-endpoint-overview.md) in the same virtual network on Azure-delegated subnets|No|
|Connectivity from Oracle database cluster to [private endpoints](../../private-link/private-endpoint-overview.md) in a different spoke virtual network connected to vWAN|Yes|
|Load balancers for Oracle database cluster traffic|No|
|Dual stack (IPv4 and IPv6) virtual network|IPv4 only supported.|

## Next steps

- [Overview - Oracle Database@Azure](database-overview.md)
- [Onboard with Oracle Database@Azure](onboard-oracle-database.md)
- [Provision and manage Oracle Database@Azure](provision-oracle-database.md)
- [Oracle Database@Azure support information](oracle-database-support.md)
- [Groups and roles for Oracle Database@Azure](oracle-database-groups-roles.md)
