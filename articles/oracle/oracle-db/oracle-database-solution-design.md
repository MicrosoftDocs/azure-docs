---
title: Solution design for Oracle Database@Azure
author: jjaygbay1
ms.author: jacobjaygbay
description: Learn about topologies and constraints for Oracle Database@Azure. 
ms.topic: conceptual
ms.service: oracle
ms.custom: engagement-fy23
ms.date: 12/6/2023
---

# Solution design for Oracle Database@Azure

This article identifies topologies and constraints for Oracle Database@Azure.

## Supported topologies

The following table describes the network topologies supported by each network features configuration of Oracle Database@Azure.

|Topology |Supported |
| :------------------- |:---------------:|
|Connectivity to BareMetal Infrastructure (BMI) in a local virtual network| Yes |
|Connectivity to BMI in a peered virtual network (Same region)|Yes |
|Connectivity to BMI in a peered VNet\* (Cross region or global peering) with VWAN\*|Yes |
|Connectivity to BM in a peered VNet* (Cross region or global peering)* without VWAN| No|
|On-premises connectivity to Delegated Subnet via Global and Local Expressroute |Yes|
|ExpressRoute (ER) FastPath |No |
|Connectivity from on-premises to BMI in a spoke virtual network over ExpressRoute gateway and VNet peering with gateway transit|Yes |
|On-premises connectivity to Delegated Subnet via VPN GW| Yes |
|Connectivity from on-premises to BMI in a spoke virtual network over VPN gateway and VNet peering with gateway transit| Yes |
|Connectivity over Active/Passive VPN gateways| Yes |
|Connectivity over Active/Active VPN gateways| No |
|Connectivity over Active/Active Zone Redundant gateways| No |
|Transit connectivity via vWAN for Spoke Delegated VNETS| Yes |
|On-premises connectivity to Delegated subnet via vWAN attached SD-WAN| No|
|On-premises connectivity via Secured HUB(Az PowerShell module Firewall NVA) | No|
|Connectivity from UVMs on Oracle Database@Azure nodes to Azure resources|Yes|

You can overcome this limitation by setting Site-to-Site VPN.

## Constraints

The following table describes what’s supported for each network features configuration:

|Features |Basic network features |
| :------------------- | -------------------: |
|Delegated subnet per virtual network |1|
|[Network Security Groups](../virtual-network/network-security-groups-overview.md) on Oracle Database@Azure-delegated subnets|No|
|[User-defined routes (UDRs)](../virtual-network/virtual-networks-udr-overview.md#user-defined) on Oracle Database@Azure-delegated subnets with VWAN|Yes|
[User-defined routes (UDRs)](./virtual-network/virtual-networks-udr-overview.md#user-defined) on Oracle Database@Azure-delegated subnets without VWAN| No|
|Connectivity from BareMetal to [private endpoints](./private-link/private-endpoint-overview.md) in the same virtual network on Azure-delegated subnets|No|
|Connectivity from BareMetal to [private endpoints](./private-link/private-endpoint-overview.md) in a different spoke virtual network connected to vWAN|Yes|
|Load balancers for Oracle Database@Azure traffic|No|
|Dual stack (IPv4 and IPv6) virtual network|IPv4 only supported|

## Next steps

- [Overview - Oracle Database@Azure](database-overview.md)
- [Onboarding with Oracle Database@Azure](onboarding-oracle-database.md)
- [Provision and manage Oracle Database@Azure](provision-oracle-database.md)
- [Oracle Database@Azure support information](oracle-database-support.md)