---
title: 'About upgrading circuit bandwidth| Azure ExpressRoute'
description: In this article, learn the best practices for upgrading the ExpressRoute circuit bandwidth
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: conceptual
ms.date: 10/16/2023
ms.author: duau
---

# About upgrading ExpressRoute circuit bandwidth

ExpressRoute is a dedicated and private connection to Microsoft's global network. Connectivity is facilitated through an ExpressRoute partner's network, or a direct connection to the Microsoft Enterprise Edge (MSEE) devices. Once physical connectivity has been configured and tested, you can enable layer-2 and layer-3 connectivity by creating an ExpressRoute circuit and configuring peering.

## <a name="considerations"></a>Capacity considerations

### Insufficient capacity for physical connection

An ExpressRoute circuit is created on a physical connection between Microsoft and a ExpressRoute Partner. The physical connection has a fixed capacity. If you're unable to increase your circuit size that means that the underlying physical connection for your existing circuit doesn’t have capacity for the upgrade. You need to create a new circuit if you want to change the circuit size. For more information, see [Migrate to a new ExpressRoute circuit](circuit-migration.md).

After you've successfully created the new ExpressRoute circuit, you should link your existing virtual networks to this circuit. You can then test and validate the connectivity of the new ExpressRoute circuit before you deprovision the old circuit. These recommended migration steps minimize down time and disruption to your production work load.

### <a name="bandwidth"></a>Insufficient ExpressRoute partner bandwidth

If you're unable to create a new ExpressRoute circuit because of a capacity error. It means this ExpressRoute partner doesn’t have capacity to connect to Microsoft at this peering location. Contact your ExpressRoute partner to request for more capacity.

Once the new capacity gets provisioned, you can use the methods contained in the [Upgrade circuit bandwidth](#upgrade) section to create a new circuit, configure connectivity, and delete the old circuit.

### <a name="bandwidth"></a>Insufficient ExpressRoute Direct bandwidth

If the ExpressRoute Direct doesn't have sufficient capacity, you have two options. You can either delete circuits that are associated to the ExpressRoute Direct resource that you no longer need, or create a new ExpressRoute Direct resource. For guidance on managing the ExpressRoute Direct resource, refer to [How to configure ExpressRoute Direct](how-to-expressroute-direct-portal.md).

## <a name="upgrade"></a>Upgrade circuit bandwidth

To upgrade circuit bandwidth, the ExpressRoute Direct, or ExpressRoute partner needs to have [sufficient available bandwidth](#considerations) for the upgrade to succeed.

If capacity is available, you can upgrade the circuit using the following methods:

* [Azure portal](expressroute-howto-circuit-portal-resource-manager.md#modify)
* [PowerShell](expressroute-howto-circuit-arm.md#modify)
* [Azure CLI](howto-circuit-cli.md#modify)

## Next steps

* [Create and modify a circuit](expressroute-howto-circuit-portal-resource-manager.md)
* [Create and modify peering configuration](expressroute-howto-routing-portal-resource-manager.md)
* [Link a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md)
