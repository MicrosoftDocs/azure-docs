---
title: About upgrading circuit bandwidth | Azure ExpressRoute
description: Learn the best practices for upgrading the ExpressRoute circuit bandwidth.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 07/28/2026
ms.author: duau
# Customer intent: As a network administrator, I want to upgrade the bandwidth of my ExpressRoute circuit, so that I can ensure sufficient capacity for my production workloads and maintain optimal connectivity to Microsoft's global network.
---

# About upgrading ExpressRoute circuit bandwidth

ExpressRoute provides a dedicated, private connection to Microsoft's global network. Establish this connectivity through an ExpressRoute partner's network or directly to the Microsoft Enterprise Edge (MSEE) devices. After setting up and testing the physical connection, enable layer-2 and layer-3 connectivity by creating an ExpressRoute circuit and configuring peering.

## <a name="considerations"></a>Capacity considerations

### Insufficient capacity for physical connection

A bandwidth upgrade can fail when the physical port hosting your circuit doesn't have enough remaining capacity. This situation can occur when you upgrade to a higher bandwidth tier, such as 10 Gbps, on a port that can't accommodate the increase.

If your upgrade fails because the port lacks capacity, you need to create a new ExpressRoute circuit on a port with sufficient capacity and then migrate your traffic. For detailed migration steps, see [Migrate to a new ExpressRoute circuit](circuit-migration.md).

After creating the new ExpressRoute circuit, link your existing virtual networks to it. Test and validate the connectivity of the new circuit before deprovisioning the old one. These steps help minimize downtime and disruption to your production workload.

### <a name="bandwidth"></a>Insufficient ExpressRoute partner bandwidth

If you're unable to create a new ExpressRoute circuit due to a capacity error, the ExpressRoute partner doesn't have sufficient capacity at the peering location to connect to Microsoft. Contact your ExpressRoute partner to request additional capacity.

After the new capacity is provisioned, follow the methods in the [Upgrade circuit bandwidth](#upgrade) section to create a new circuit, configure connectivity, and delete the old circuit.

### <a name="bandwidth"></a>Insufficient ExpressRoute Direct bandwidth

If ExpressRoute Direct lacks sufficient capacity, you have two options:

- Delete any unnecessary circuits associated with the ExpressRoute Direct resource.
- Create a new ExpressRoute Direct resource.

For detailed guidance on managing ExpressRoute Direct resources, see [How to configure ExpressRoute Direct](how-to-expressroute-direct-portal.md).

## <a name="upgrade"></a>Upgrade circuit bandwidth

To upgrade circuit bandwidth, ensure that the ExpressRoute Direct or ExpressRoute partner has [sufficient available bandwidth](#considerations) for the upgrade to succeed.

> [!NOTE]
> If your upgrade fails because the current port lacks sufficient capacity, you can't perform an in-place bandwidth upgrade. Instead, you need to create a new circuit and migrate your traffic. For more information, see [Capacity considerations](#considerations).

If capacity is available, upgrade the circuit by using the following methods:

- [Azure portal](expressroute-howto-circuit-portal-resource-manager.md#modify)
- [PowerShell](expressroute-howto-circuit-arm.md#modify)
- [Azure CLI](howto-circuit-cli.md#modify)

## Next steps

- [Create and modify a circuit](expressroute-howto-circuit-portal-resource-manager.md)
- [Create and modify peering configuration](expressroute-howto-routing-portal-resource-manager.md)
- [Link a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md)
