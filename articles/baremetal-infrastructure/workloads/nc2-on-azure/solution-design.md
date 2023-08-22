---
title: Solution design
author: jjaygbay1
ms.author: jacobjaygbay
description: Learn about topologies and constraints for NC2 on Azure. 
ms.topic: conceptual
ms.subservice: baremetal-nutanix
ms.custom: engagement-fy23
ms.date: 04/01/2023
---

# Solution design

This article identifies topologies and constraints for NC2 on Azure.

## Supported topologies

The following table describes the network topologies supported by each network features configuration of NC2 on Azure.

|Topology |Supported |
| :------------------- |:---------------:|
|Connectivity to BareMetal (BM) in a local VNet| Yes |
|Connectivity to BM in a peered VNet (Same region)|Yes |
|Connectivity to BM in a peered VNet\* (Cross region or global peering)\*|No |
|On-premises connectivity to Delegated Subnet via Global and Local Expressroute |Yes|
|ExpressRoute (ER) FastPath |No |
|Connectivity from on-premises to a BM in a spoke VNet over ExpressRoute gateway and VNet peering with gateway transit|Yes |
|On-premises connectivity to Delegated Subnet via VPN GW| Yes |
|Connectivity from on-premises to a BM in a spoke VNet over VPN gateway and VNet peering with gateway transit| Yes |
|Connectivity over Active/Passive VPN gateways| Yes |
|Connectivity over Active/Active VPN gateways| No |
|Connectivity over Active/Active Zone Redundant gateways| No |
|Transit connectivity via vWAN for Spoke Delegated VNETS| Yes |
|On-premises connectivity to Delegated subnet via vWAN attached SD-WAN| No|
|On-premises connectivity via Secured HUB(Az Firewall NVA) | No|
|Connectivity from UVMs on NC2 nodes to Azure resources|Yes|

\* You can overcome this limitation by setting Site-to-Site VPN.

## Constraints

The following table describes what’s supported for each network features configuration:

|Features |Basic network features |
| :------------------- | -------------------: |
|Delegated subnet per VNet |1|
|[Network Security Groups](../../../virtual-network/network-security-groups-overview.md) on NC2 on Azure-delegated subnets|No|
|[User-defined routes (UDRs)](../../../virtual-network/virtual-networks-udr-overview.md#user-defined) on NC2 on Azure-delegated subnets|No|
|Connectivity from BareMetal to [private endpoints](../../../private-link/private-endpoint-overview.md) in the same Vnet on Azure-delegated subnets|No|
|Connectivity from BareMetal to [private endpoints](../../../private-link/private-endpoint-overview.md) in a different spoke Vnet connected to vWAN|Yes|
|Load balancers for NC2 on Azure traffic|No|
|Dual stack (IPv4 and IPv6) virtual network|IPv4 only supported|

## Next steps

Learn more:

> [!div class="nextstepaction"]
> [Architecture](architecture.md)
