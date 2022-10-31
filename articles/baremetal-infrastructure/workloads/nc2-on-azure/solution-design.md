---
title: Solution design
description: Learn about topologies and constraints for NC2 on Azure. 
ms.topic: conceptual
ms.subservice:  baremetal-nutanix
ms.date: 07/01/2022
---

# Solution design

This article identifies topologies and constraints for NC2 on Azure.

## Supported topologies

The following table describes the network topologies supported by each network features configuration of NC2 on Azure.

|Topology |Basic network features |
| :------------------- |:---------------:|
|Connectivity to BareMetal (BM) in a local VNet| Yes |
|Connectivity to BM in a peered VNet (Same region)|Yes |
|Connectivity to BM in a peered VNet (Cross region or global peering)|No |
|Connectivity to a BM over ExpressRoute gateway |Yes|
|ExpressRoute (ER) FastPath |No |
|Connectivity from on-premises to a BM in a spoke VNet over ExpressRoute gateway and VNet peering with gateway transit|Yes |
|Connectivity from on-premises to a BM in a spoke VNet over VPN gateway| Yes |
|Connectivity from on-premises to a BM in a spoke VNet over VPN gateway and VNet peering with gateway transit| Yes |
|Connectivity over Active/Passive VPN gateways| Yes |
|Connectivity over Active/Active VPN gateways| No |
|Connectivity over Active/Active Zone Redundant gateways| No |
|Connectivity over Virtual WAN (VWAN)| No |

## Constraints

The following table describes what’s supported for each network features configuration:

|Features |Basic network features |
| :------------------- | -------------------: |
|Delegated subnet per VNet |1|
|[Network Security Groups](../../../virtual-network/network-security-groups-overview.md) on NC2 on Azure-delegated subnets|No|
|[User-defined routes (UDRs)](../../../virtual-network/virtual-networks-udr-overview.md#user-defined) on NC2 on Azure-delegated subnets|No|
|Connectivity to [private endpoints](../../../private-link/private-endpoint-overview.md)|No|
|Load balancers for NC2 on Azure traffic|No|
|Dual stack (IPv4 and IPv6) virtual network|IPv4 only supported|

## Next steps

Learn more:

> [!div class="nextstepaction"]
> [Architecture](architecture.md)