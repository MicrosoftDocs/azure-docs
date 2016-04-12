<properties
   pageTitle="Moving ExpressRoute circuits from Classic to Resource Manager | Microsoft Azure"
   description="This page provides an overview of what you need to know about bridging classic and Resource Manager deployment models."
   documentationCenter="na"
   services="expressroute"
   authors="ganesr"
   manager="carmonm"
   editor=""/>
<tags
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="04/01/2016"
   ms.author="ganesr"/>

# Moving ExpressRoute circuits from Classic to Resource Manager deployment model

This article provides an overview of what it means to move an ExpressRoute circuit from the classic to Resource Manager deployment model. 

[AZURE.INCLUDE [vpn-gateway-sm-rm](../../includes/vpn-gateway-sm-rm-include.md)]

A single ExpressRoute circuit can be used to connect to virtual networks (VNets) deployed both in the classic and  Resource Manager deployment models. An ExpressRoute circuit, irrespective of how it is created can now link to virtual networks across both deployment models.

![](./media/expressroute-move/expressroute-move-1.png)

## ExpressRoute circuits created in the Classic deployment model

ExpressRoute circuits created in the classic deployment model will have to be moved to the Resource Manager deployment model first to enable connectivity to both classic and Resource Manager deployment models. There will be no connectivity loss or disruption when a connection is being moved. All circuit-vnet links in the classic deployment model (within the same subscription and cross-subscription) will be preserved. Once the move is completed successfully, the ExpressRoute circuit will look, perform and feel exactly like an ExpressRoute circuit created in the resource manager deployment model. You will now be able to create connections to virtual networks in the Resource Manager deployment model. 

Once an ExpressRoute circuit has been moved to the Resource Manager deployment model, you will be able to manage the life cycle of the ExpressRoute circuit only using the Resource Manager deployment model. This means operations such as adding / updating / deleting peerings, updating circuit properties such as bandwidth, SKU and billing type and deleting circuits can only be performed in the Resource Manager deployment model. Refer to the section below on circuits created in the resource manager deployment model for further details on how you can manage access to both deployment models.

You will not have to involve your connectivity provider to perform the move. 

## ExpressRoute circuits created in the Resource Manager  deployment model

You can enable ExpressRoute circuits created in the Resource Manager deployment model to be accessible from both deployment models. Any ExpressRoute circuit in your subscription can be enabled to be accessed from both deployment models. 

- ExpressRoute circuits that were created in the Resource Manager deployment model will not have access to the classic deployment model by default.
- ExpressRoute circuits that have been moved from the classic deployment model to the Resource manager deployment model will be accessible from both deployment models by default.
- An ExpressRoute circuit will always have access to the resource manager deployment model irrespective of whether it was created in the Resource Manager deployment model or in the classic deployment model. This means you can create connections to virtual networks created in the Resource Manager deployment model by following instructions on [how to link virtual networks](expressroute-howto-linkvnet-arm.md). 
- Access to the classic deployment model is controlled by the "allowClassicOperations" parameter in the ExpressRoute circuit. 

>[AZURE.IMPORTANT] All quotas documented in the [service limits](../azure-subscription-service-limits.md) page will apply. As an example, a standard circuit can have at most 10 VNet links / connections across both the classic and Resource Manager deployment models. 


### Controlling access to classic deployment model

You can enable a single ExpressRoute circuit to link to VNets in both deployment models by setting the "allowClassicOperations" parameter of the ExpressRoute circuit.

Setting "allowClassicOperations" to TRUE will enable you to link vnets from both deployment models to the ExpressRoute circuit. You can link to VNets in classic deployment model by following guidance on [how to link virtual networks in the classic deployment model](expressroute-howto-linkvnet-classic.md). You can link to VNets in Resource Manager deployment model mode by following guidance on [how to link virtual networks in the Resource Manager deployment model](expressroute-howto-linkvnet-arm.md).

Setting "allowClassicOperations" to FALSE will block access to the circuit from the classic deployment model. All vnet links in the classic deployment model will however be preserved. In this case, the ExpressRoute circuit will not be visible in the classic deployment model.

### Supported operations in the classic deployment model

The following classic operations are supported on an ExpressRoute circuit when "allowClassicOperations" is set to TRUE.

 - Get ExpressRoute Circuit information
 - Create / Update / Get / Delete VNet links to classic VNets
 - Create / Update / Get / Delete VNet link authorizations for cross-subscription connectivity

You will not be able to perform the following classic operations when "allowClassicOperations" is set to TRUE.

 - Create / Update / Get / Delete BGP peerings for Azure private, Azure public and Microsoft peerings
 - Delete ExpressRoute circuit

## Classic to Resource Manager communication

The ExpressRoute circuit will act like a bridge between the classic and Resource Manager deployment models. Traffic between virtual machines deployed in vnets in the classic deployment model and those deployed in vnets in the Resource deployment model will flow through the ExpressRoute if both vnets are linked to the same ExpressRoute circuit. Aggregate throughput will be limited by the throughput capacity of the virtual network gateway. Traffic will not enter the connectivity provider's or your networks in such cases. Traffic flow between the VNets will be fully contained within the Microsoft network. 

## Access to Azure Public and Microsoft peering resources

You can continue to access resources typically accessible through Azure Public peering and Microsoft peering without any disruption.  

## What's supported

This section describes what's supported through this capability

 - A single ExpressRoute circuit can be used to access vnets deployed in the classic and Resource Manager deployment models.
 - You can move an ExpressRotue circuit from classic to Resource Manager deployment model. Once moved, the ExpressRoute circuit will look, feel and perform like any other ExpressRoute circuit created in the Resource Manager deployment model.
 - Only the ExpressRoute circuit can be moved. Circuit links, VNets and VPN gateways will not be moved through this operation.
 - Once an ExpressRoute circuit has been moved to the Resource Manager deployment model, you will be able to manage the life cycle of the ExpressRoute circuit only using the Resource Manager deployment model. This means operations such as adding / updating / deleting peerings, updating circuit properties such as bandwidth, SKU and billing type and deleting circuits can only be performed in the Resource Manager deployment model.
 - The ExpressRoute circuit will act like a bridge between the classic and Resource Manager deployment models. Traffic between virtual machines deployed in vnets in the classic deployment model and those deployed in vnets in the Resource deployment model will flow through ExpressRoute if both vnets are linked to the same ExpressRoute circuit. 
 - Cross-subscription connectivity in both classic and Resource Manager deployment models.

## What's NOT supported

This section describes what's not supported through this capability

 - Moving Circuit links, gateways and virtual networks from classic to Resource Manager deployment model.
 - Managing the lifecycle of the ExpressRoute circuit from the classic deployment model.
 - RBAC support for classic deployment model. You will not be able to perform RBAC controls to the circuit in the classic deployment model. Any admin / co-admin of the subscription will be able to link / unlink vnets to the circuit.

## Configuration

Follow instructions described in [Moving an ExpressRoute circuit from classic to Resource Manager](expressroute-howto-move-arm.md)

## Next steps

- For workflow information, see [ExpressRoute circuit provisioning workflows and circuit states](expressroute-workflows.md).
- Configure your ExpressRoute connection.

	- [Create an ExpressRoute circuit](expressroute-howto-circuit-arm.md)
	- [Configure routing](expressroute-howto-routing-arm.md)
	- [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)
