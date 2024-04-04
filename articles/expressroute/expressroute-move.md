---
title: 'ExpressRoute: Move circuits from classic to Azure Resource Manager'
description: Learn about what happens when you move an Azure ExpressRoute circuit from the classic to the Azure Resource Manager deployment model.
services: expressroute
author: duongau

ms.service: expressroute
ms.custom: devx-track-arm-template
ms.topic: how-to
ms.date: 06/30/2023
ms.author: duau
---

# Moving ExpressRoute circuits from the classic to the Resource Manager deployment model

This article provides an overview of what happens when you move an Azure ExpressRoute circuit from the classic to the Azure Resource Manager deployment model.

You can use a single ExpressRoute circuit to connect virtual networks that are deployed both in the classic and the Resource Manager deployment models.

![An ExpressRoute circuit that links to virtual networks across both deployment models](./media/expressroute-move/expressroute-move-1.png)

## ExpressRoute circuits that are created in the classic deployment model

ExpressRoute circuits created in the classic deployment model need to migrate to the Resource Manager deployment model first. Only then can enable connectivity to both the classic and the Resource Manager deployment models. Connectivity isn't lost or disrupted when a connection is being moved. All circuit-to-virtual network links in the classic deployment model within the same subscription and cross-subscription are preserved.

After the move has successfully completed, the ExpressRoute circuit will behave exactly like an ExpressRoute circuit that was created in the Resource Manager deployment model. You can now create connections to virtual networks in the Resource Manager deployment model.

Once you've moved the ExpressRoute circuit to the Resources Manager deployment model, you can only manage it in Resource Manager deployment model. Operations for managing peerings, updating circuit properties, and deleting circuits is only available through the Resource Manager deployment model.

You don't have to involve your connectivity provider to move your circuit to the Resource Manager deployment model.

## ExpressRoute circuits that are created in the Resource Manager deployment model

You can enable ExpressRoute circuits that are created in the Resource Manager deployment model to be accessible from both deployment models. Any ExpressRoute circuit in your subscription can be configured to have access from both deployment models.

* ExpressRoute circuits that were created in the Resource Manager deployment model don't have access to the classic deployment model by default.
* ExpressRoute circuits that have been moved from the classic deployment model to the Resource Manager deployment model are accessible from both deployment models by default.
* An ExpressRoute circuit always has access to the Resource Manager deployment model, whether it was created in the Resource Manager or classic deployment model. You can create connections to virtual networks by following instructions on [how to link virtual networks](expressroute-howto-linkvnet-arm.md).
* Access to the classic deployment model is controlled by the **allowClassicOperations** parameter in the ExpressRoute circuit.

> [!IMPORTANT]
> All quotas that are documented on the [service limits](../azure-resource-manager/management/azure-subscription-service-limits.md) page apply. As an example, a standard circuit can have at most 10 virtual network links/connections across both the classic and the Resource Manager deployment models.
> 

## Controlling access to the classic deployment model

You can enable an ExpressRoute circuit to link to virtual networks in both deployment models. To do so, set the **allowClassicOperations** parameter on the ExpressRoute circuit.

Setting **allowClassicOperations** to TRUE enables you to link virtual networks from both deployment models to the ExpressRoute circuit. 
* To link virtual networks in the classic deployment model, see [how to link virtual networks for classic deployment model](expressroute-howto-linkvnet-classic.md).
* To link virtual networks in the Resource Manager deployment model, see [how to link virtual networks in the Resource Manager deployment model](expressroute-howto-linkvnet-arm.md).

Setting **allowClassicOperations** to FALSE blocks access to the circuit from the classic deployment model. However, all virtual networks linked in the classic deployment model are still preserved. The ExpressRoute circuit isn't visible in the classic deployment model.

## Supported operations in the classic deployment model

The following classic operations are supported on an ExpressRoute circuit when **allowClassicOperations** is set to TRUE:

* Get ExpressRoute circuit information
* Create/update/get/delete virtual network links to classic virtual networks
* Create/update/get/delete virtual network link authorizations for cross-subscription connectivity

However, when **allowClassicOperations** is set to TRUE, you can't execute the following classic operations:

* Create/update/get/delete Border Gateway Protocol (BGP) peerings for Azure private, Azure public, and Microsoft peerings
* Delete ExpressRoute circuits

## Communication between the classic and the Resource Manager deployment models

The ExpressRoute circuit acts like a bridge between the classic and the Resource Manager deployment models. Traffic between virtual networks for both deployment models can pass through the ExpressRoute circuit if both virtual networks are linked to the same circuit.

Aggregate throughput is limited by the throughput capacity of the virtual network gateway. Traffic doesn't enter the connectivity provider's networks or your networks in such cases. Traffic flow between the virtual networks is fully contained within the Microsoft network.

## Access to Azure public and Microsoft peering resources

You can continue to access resources that are typically accessible through Azure public peering and Microsoft peering without any disruption.  

## What's supported

This section describes what's supported for ExpressRoute circuits:

* You can use a single ExpressRoute circuit to access virtual networks that are deployed in the classic and the Resource Manager deployment models.
* You can move an ExpressRoute circuit from the classic to the Resource Manager deployment model. Once moved, the ExpressRoute circuit continues to operate like any other ExpressRoute circuit that is created in the Resource Manager deployment model.
* You can move only the ExpressRoute circuit. Circuit links, virtual networks, and VPN gateways can't be moved through this operation.
* After an ExpressRoute circuit has been moved to the Resource Manager deployment model, you can manage the life cycle of the ExpressRoute circuit only by using the Resource Manager deployment model. You can run operations like adding/updating/deleting peerings, updating circuit properties (such as bandwidth, SKU, and billing type), and deleting circuits only in the Resource Manager deployment model.
* The ExpressRoute circuit acts like a bridge between the classic and the Resource Manager deployment models. Traffic between virtual machines in classic virtual networks and virtual machines in Resource Manager virtual networks can communicate through ExpressRoute if both virtual networks are linked to the same ExpressRoute circuit.
* Cross-subscription connectivity is supported in both the classic and the Resource Manager deployment models.
* After you move an ExpressRoute circuit from the classic model to the Azure Resource Manager model, you can [migrate the virtual networks linked to the ExpressRoute circuit](expressroute-migration-classic-resource-manager.md).

## What's not supported

This section describes what's not supported for ExpressRoute circuits:

* Managing the life cycle of an ExpressRoute circuit from the classic deployment model.
* Azure role-based access control (Azure RBAC) support for the classic deployment model. You can't run Azure RBAC controls to a circuit in the classic deployment model. Any administrator/coadministrator of the subscription can link or unlink virtual networks to the circuit.

## Configuration

Follow the instructions that are described in [Move an ExpressRoute circuit from the classic to the Resource Manager deployment model](expressroute-howto-move-arm.md).

## Next steps

* [Migrate the virtual networks linked to the ExpressRoute circuit from the classic model to the Azure Resource Manager model](expressroute-migration-classic-resource-manager.md)
* For workflow information, see [ExpressRoute circuit provisioning workflows and circuit states](expressroute-workflows.md).
* To configure your ExpressRoute connection:
  
  * [Create an ExpressRoute circuit](expressroute-howto-circuit-arm.md)
  * [Configure routing](expressroute-howto-routing-arm.md)
  * [Link a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)
