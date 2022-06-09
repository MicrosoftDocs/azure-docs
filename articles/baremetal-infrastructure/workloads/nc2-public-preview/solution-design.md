---
title: Solution design
description:  
ms.topic: conceptual
ms.subservice:  
ms.date: 07/01/2022
---

# Solution design

## Supported topologies

The following table describes the network topologies supported by each network features configuration of Azure NetApp Files.

|Topologies	|Standard network features	|Basic network features |
| :------------------- | -------------------: |:---------------:|
|Connectivity to BM in a local VNet|Yes |Yes |
|Connectivity to BM in a peered VNet (Same region)|Yes |Yes |
|Connectivity to BM in a peered VNet (Cross region or global peering) |No |No |
|Connectivity to a BM over ExpressRoute gateway |Yes |Yes
|ExpressRoute (ER) FastPath |Yes |No |
|Connectivity from on-premises to a BM in a spoke VNet over ExpressRoute gateway and VNet peering with gateway transit|Yes | Yes |
|Connectivity from on-premises to a BM in a spoke VNet over VPN gateway|Yes | Yes |
|Connectivity from on-premises to a BM in a spoke VNet over VPN gateway and VNet peering with gateway transit|Yes | Yes |
|Connectivity over Active/Passive VPN gateways|Yes | Yes |
|Connectivity over Active/Active VPN gateways|Yes | No |
|Connectivity over Active/Active Zone Redundant gateways|No | No |
|Connectivity over Virtual WAN (VWAN)|No | No |

## Constraints

The following table describes what’s supported for each network features configuration:

|Features |Standard network features |Basic network features |
| :------------------- | -------------------: |:---------------:|
|Example|Example|Example|

## Next steps

Learn more about Nutanix:

> [!div class="nextstepaction"]
> [About the Public Preview](about-the-public-preview.md)
