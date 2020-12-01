---
title: 'About upgrading circuit bandwidth| Azure ExpressRoute'
description: In this article, learn the best practices for upgrading the ExpressRoute circuit bandwidth
services: expressroute
author: duongau

ms.service: expressroute
ms.topic: conceptual
ms.date: 07/07/2020
ms.author: duau


---
# About upgrading ExpressRoute circuit bandwidth

ExpressRoute enables dedicated and private connectivity to Microsoft's global network. Connectivity is facilitated by an ExpressRoute partner's network, or a direct connection to the Microsoft Enterprise Edge (MSEE) devices. Once physical connectivity has been configured and tested, you can enable layer-2 and layer-3 connectivity by creating an ExpressRoute circuit and configuring peering.

## <a name="upgrade"></a>Upgrade circuit bandwidth

In order to upgrade circuit bandwidth, the ExpressRoute Direct or ExpressRoute partner needs to have [sufficient available bandwidth](#considerations) for the upgrade to succeed.

If capacity is available, you can upgrade the circuit using the following methods:

* [Azure portal](expressroute-howto-circuit-portal-resource-manager.md#modify)
* [PowerShell](expressroute-howto-circuit-arm.md#modify)
* [Azure CLI](howto-circuit-cli.md#modify)

## <a name="considerations"></a>Capacity considerations

### <a name="bandwidth"></a>Insufficient ExpressRoute partner bandwidth

If the ExpressRoute partner does not have sufficient capacity, you need to create a new circuit, configured to the desired bandwidth. In order to maintain connectivity, do not delete the old circuit until the newly created circuit is provisioned, peering has been configured, and (regarding private peering) the connection object to the ExpressRoute virtual network gateway has been provisioned.

If your ExpressRoute partner does not have sufficient available capacity, you need to request additional capacity at the desired peering location. Once the new capacity is provisioned, you can use the steps contained in the articles in the [Upgrade circuit bandwidth](#upgrade) section to create a new circuit, configure connectivity, and delete the old circuit.


### <a name="bandwidth"></a>Insufficient ExpressRoute Direct bandwidth

If the ExpressRoute Direct does not have sufficient capacity, you can either delete circuits associated to the ExpressRoute Direct resource that are no longer needed, or create a new ExpressRoute Direct resource. For guidance managing the ExpressRoute Direct resource, refer to [How to configure ExpressRoute Direct](how-to-expressroute-direct-portal.md).

## Next steps

* [Create and modify a circuit](expressroute-howto-circuit-portal-resource-manager.md)
* [Create and modify peering configuration](expressroute-howto-routing-portal-resource-manager.md)
* [Link a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md)
