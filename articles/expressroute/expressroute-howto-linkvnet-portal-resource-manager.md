<properties 
   pageTitle="Linking virtual networks to ExpressRoute circuits using the management portal | Microsoft Azure"
   description="This document provides an overview of how to link virtual networks (VNets) to ExpressRoute circuits."
   services="expressroute"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"/>
<tags 
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="04/08/2016"
   ms.author="cherylmc" />

# Linking Virtual Networks to ExpressRoute circuits

> [AZURE.SELECTOR]
- [Azure Portal - Resource Manager](expressroute-howto-linkvnet-portal-resource-manager.md)
- [PowerShell - Resource Manager](expressroute-howto-linkvnet-arm.md)
- [PowerShell - Classic](expressroute-howto-linkvnet-classic.md)



This article gives you an overview of how to link virtual networks (VNets) to ExpressRoute circuits. Virtual networks can either be in the same subscription, or be part of another subscription. This article applies to VNets deployed using the Resource Manager deployment model. If you want to link a virtual network that was deployed using the classic deployment model, see [Link a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-classic.md).


**About Azure deployment models**

[AZURE.INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-classic-rm-include.md)] 

## Configuration prerequisites

- Make sure that you have reviewed the [prerequisites](expressroute-prerequisites.md) page, the [routing requirements](expressroute-routing.md) page, and the [workflows](expressroute-workflows.md) page before you begin configuration.
- You must have an active ExpressRoute circuit. 
	- Follow the instructions to [Create an ExpressRoute circuit](expressroute-howto-circuit-arm.md) and have the circuit enabled by your connectivity provider. 
	- Ensure that you have Azure private peering configured for your circuit. See the [configure routing](expressroute-howto-routing-arm.md) article for routing instructions. 
	- Azure private peering must be configured and the BGP peering between your network and Microsoft must be up for you to enable end-to-end connectivity.
	- You must have a virtual network and a virtual network gateway created and fully provisioned. Follow the instructions to create a [vpn gateway](../articles/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md) (follow only steps 1 - 5).

You can link up to 10 virtual networks to an ExpressRoute circuit. All ExpressRoute circuits must be in the same geopolitical region. You can link a larger number of virtual networks to your ExpressRoute circuit if you enabled the ExpressRoute premium add-on. Check out the [FAQ](expressroute-faqs.md) for more details on the premium add-on. 

## Link a VNet in the same subscription to a circuit

Ensure that your ExpressRoute circuit and Azure private peering have been configured successfully. You can follow instructions to [create an ExpressRoute circuit](expressroute-howto-circuit-arm.md) and [configure routing](expressroute-howto-routing-arm.md). Your ExpressRoute circuit should look like the image below.

![](./media/expressroute-howto-linkvnet-portal-resource-manager/routing1.png)

>[AZURE.NOTE] BGP configuration information will not show up if your peerings were configured by the layer 3 provider. If your circuit is in provisioned state, you should be able to create connections.

You can now start provisioning a connection to link your VNet gateway to your ExpressRoute circuit. The image below shows you how to accomplish this.

![](./media/expressroute-howto-linkvnet-portal-resource-manager/samesub1.png)  


Once your connection has been successfully configured your connection object will show you information on the connection.

![](./media/expressroute-howto-linkvnet-portal-resource-manager/samesub2.png)

You can delete a connection by selecting the delete connection icon.

## Link a VNet in a different subscription to a circuit

Ability to connect virtual networks across subscriptions is not supported through the portal today. Please follow instructions to accomplish this using [PowerShell](expressroute-howto-linkvnet-arm.md)

## Next steps

For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).
