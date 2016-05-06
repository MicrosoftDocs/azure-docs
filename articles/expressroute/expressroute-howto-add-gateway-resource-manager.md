<properties
   pageTitle="Adding a VPN Gateway to a virtual network for ExpressRoute using Resource Manager and PowerShell | Microsoft Azure"
   description="This article walks you through adding a VPN Gateway to an already created Resource Manager VNet for ExpressRoute"
   documentationCenter="na"
   services="expressroute"
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
   ms.date="02/26/2016"
   ms.author="cherylmc"/>

# Add a VPN Gateway to a Resource Manager VNet for an ExpressRoute configuration 

This article will walk you through the steps to add a gateway subnet and create a VPN gateway for an already existing VNet. The steps for this configuration are specifically for VNets that were created using the **Resource Manager deployment model** and that will be be used in an ExpressRoute configuration. If you need information about creating gateways for VNets using the classic deployment model, see [Configure a virtual network for ExpressRoute using the classic portal](expressroute-howto-vnet-portal-classic.md).

## Before beginning

Verify that you have installed the Azure PowerShell cmdlets needed for this configuration (1.0.2 or later). If you haven't installed the cmdlets, you'll need to do so before beginning the configuration steps. For more information about installing Azure PowerShell, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).


[AZURE.INCLUDE [expressroute-gateway-rm-ps](../../includes/expressroute-gateway-rm-ps-include.md)]

## Verify the gateway was created

Use the command below to verify that the gateway has been created.

	Get-AzureRmVirtualNetworkGateway -ResourceGroupName $RG
	
## Next steps

After you have created the VPN gateway, you can link your VNet to an ExpressRoute circuit. See [Link a Virtual Network to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md).
