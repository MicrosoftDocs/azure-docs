---
title: 'About upgrading circuit bandwidth| Azure ExpressRoute'
description: In this article, learn the best practices for upgrading the ExpressRoute circuit bandwidth
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 01/31/2025
ms.author: duau
---

# About upgrading ExpressRoute circuit bandwidth

ExpressRoute provides a dedicated, private connection to Microsoft's global network. You can establish this connectivity through an ExpressRoute partner's network or directly to the Microsoft Enterprise Edge (MSEE) devices. After setting up and testing the physical connection, you can enable layer-2 and layer-3 connectivity by creating an ExpressRoute circuit and configuring peering.

## <a name="considerations"></a>Capacity considerations

### Insufficient capacity for physical connection

If you're unable to increase your circuit size, it means the underlying physical connection for your existing circuit lacks the capacity for the upgrade. In this case, you need to create a new circuit. For more information, see [Migrate to a new ExpressRoute circuit](circuit-migration.md).

After creating the new ExpressRoute circuit, link your existing virtual networks to it. Test and validate the connectivity of the new circuit before deprovisioning the old one. These steps help minimize downtime and disruption to your production workload.

### <a name="bandwidth"></a>Insufficient ExpressRoute partner bandwidth

If you're unable to create a new ExpressRoute circuit due to a capacity error, it means the ExpressRoute partner doesn’t have sufficient capacity at the peering location to connect to Microsoft. Contact your ExpressRoute partner to request additional capacity.

Once the new capacity is provisioned, you can follow the methods in the [Upgrade circuit bandwidth](#upgrade) section to create a new circuit, configure connectivity, and delete the old circuit.

### <a name="bandwidth"></a>Insufficient ExpressRoute Direct bandwidth

If ExpressRoute Direct lacks sufficient capacity, you have two options: 

- Delete any unnecessary circuits associated with the ExpressRoute Direct resource.
- Create a new ExpressRoute Direct resource.

For detailed guidance on managing ExpressRoute Direct resources, see [How to configure ExpressRoute Direct](how-to-expressroute-direct-portal.md).

## <a name="upgrade"></a>Upgrade circuit bandwidth

To upgrade circuit bandwidth, ensure that the ExpressRoute Direct or ExpressRoute partner has [sufficient available bandwidth](#considerations) for the upgrade to succeed.

If capacity is available, you can upgrade the circuit using the following methods:

* [Azure portal](expressroute-howto-circuit-portal-resource-manager.md#modify)
* [PowerShell](expressroute-howto-circuit-arm.md#modify)
* [Azure CLI](howto-circuit-cli.md#modify)

## Next steps

* [Create and modify a circuit](expressroute-howto-circuit-portal-resource-manager.md)
* [Create and modify peering configuration](expressroute-howto-routing-portal-resource-manager.md)
* [Link a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md)
