<properties 
   pageTitle="Link a virtual network to an ExpressRoute circuit using the Resource Manager deployment model and the Azure portal | Microsoft Azure"
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
   ms.date="04/14/2016"
   ms.author="cherylmc" />

# Link a virtual network to an ExpressRoute circuit

> [AZURE.SELECTOR]
- [Azure Portal - Resource Manager](expressroute-howto-linkvnet-portal-resource-manager.md)
- [PowerShell - Resource Manager](expressroute-howto-linkvnet-arm.md)
- [PowerShell - Classic](expressroute-howto-linkvnet-classic.md)



This article will help you link virtual networks (VNets) to ExpressRoute circuits using the Resource Manager deployment model and the Azure portal. Virtual networks can either be in the same subscription, or part of another subscription.


**About Azure deployment models**

[AZURE.INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-classic-rm-include.md)] 

## Configuration prerequisites

- Make sure that you have reviewed the [prerequisites](expressroute-prerequisites.md) page, the [routing requirements](expressroute-routing.md) page, and the [workflows](expressroute-workflows.md) page before you begin configuration.
- You must have an active ExpressRoute circuit. 
	- Follow the instructions to [Create an ExpressRoute circuit](expressroute-howto-circuit-arm.md) and have the circuit enabled by your connectivity provider. 
	
	- Ensure that you have Azure private peering configured for your circuit. See the [configure routing](expressroute-howto-routing-portal-resource-manager.md) article for routing instructions. 
	
	- Azure private peering must be configured and the BGP peering between your network and Microsoft must be up for you to enable end-to-end connectivity.
	
	- You must have a virtual network and a virtual network gateway created and fully provisioned. Follow the instructions to create a [VPN gateway](../articles/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md) (follow only steps 1 - 5).

You can link up to 10 virtual networks to an ExpressRoute circuit. All ExpressRoute circuits must be in the same geopolitical region. You can link a larger number of virtual networks to your ExpressRoute circuit if you enabled the ExpressRoute premium add-on. Check out the [FAQ](expressroute-faqs.md) for more details on the premium add-on. 

## Connect a VNet in the same subscription to a circuit


### To create a connection

1. Ensure that your ExpressRoute circuit and Azure private peering have been configured successfully. Follow the instructions in the articles to [Create an ExpressRoute circuit](expressroute-howto-circuit-arm.md) and [Configure routing](expressroute-howto-routing-arm.md). Your ExpressRoute circuit should look like the image below.

	![](./media/expressroute-howto-linkvnet-portal-resource-manager/routing1.png)

	>[AZURE.NOTE] BGP configuration information will not show up if your peerings were configured by the layer 3 provider. If your circuit is in provisioned state, you should be able to create connections.

2. You can now start provisioning a connection to link your VNet gateway to your ExpressRoute circuit. Click **Connection** **>** **Add** to open the **Add connection** blade, and then configure the values. See the reference example below.
	

	![](./media/expressroute-howto-linkvnet-portal-resource-manager/samesub1.png)  
 
	
3. Once your connection has been successfully configured, your connection object will show the information for the connection.

	![](./media/expressroute-howto-linkvnet-portal-resource-manager/samesub2.png)


### To delete a connection

You can delete a connection by selecting the **Delete** icon on the blade for your connection.

## Connect a VNet in a different subscription to circuit

At this time, you cannot connect virtual networks across subscriptions by using the Azure portal. However, you can use PowerShell to do this. Please see the [PowerShell](expressroute-howto-linkvnet-arm.md) article for more information. 

## Next steps

For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).
