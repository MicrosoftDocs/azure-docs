---
title: 'Azure ExpressRoute: Add a gateway to a VNet: PowerShell'
description: This article helps you add VNet gateway to an already created Resource Manager VNet for ExpressRoute.
services: expressroute
author: charwen

ms.service: expressroute
ms.topic: how-to
ms.date: 02/21/2019
ms.author: charwen
ms.custom: seodec18

---
# Configure a virtual network gateway for ExpressRoute using PowerShell
> [!div class="op_single_selector"]
> * [Resource Manager - Azure portal](expressroute-howto-add-gateway-portal-resource-manager.md)
> * [Resource Manager - PowerShell](expressroute-howto-add-gateway-resource-manager.md)
> * [Classic - PowerShell](expressroute-howto-add-gateway-classic.md)
> * [Video - Azure portal](https://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-create-a-vpn-gateway-for-your-virtual-network)
> 
> 

This article helps you add, resize, and remove a virtual network (VNet) gateway for a pre-existing VNet. The steps for this configuration apply to VNets that were created using the Resource Manager deployment model for an ExpressRoute configuration. For more information, see [About virtual network gateways for ExpressRoute](expressroute-about-virtual-network-gateways.md).

## Before beginning

### Working with PowerShell

[!INCLUDE [updated-for-az](../../includes/hybrid-az-ps.md)]

[!INCLUDE [working with cloud shell](../../includes/expressroute-cloudshell-powershell-about.md)]

### Configuration reference list

[!INCLUDE [expressroute-gateway-rm-ps](../../includes/expressroute-gateway-rm-ps-include.md)]

## Next steps
After you have created the VNet gateway, you can link your VNet to an ExpressRoute circuit. See [Link a Virtual Network to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md).
