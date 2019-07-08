---
title: 'Configure a VNet gateway for ExpressRoute - classic: Azure PowerShell | Microsoft Docs'
description: Configure a VNet gateway for a classic deployment model VNet using PowerShell for an ExpressRoute configuration.
services: expressroute
author: charwen

ms.service: expressroute
ms.topic: article
ms.date: 11/05/2018
ms.author: charwen
ms.custom: seodec18

---
# Configure a virtual network gateway for ExpressRoute using PowerShell (classic)
> [!div class="op_single_selector"]
> * [Resource Manager - PowerShell](expressroute-howto-add-gateway-resource-manager.md)
> * [Classic - PowerShell](expressroute-howto-add-gateway-classic.md)
> * [Video - Azure Portal](https://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-create-a-vpn-gateway-for-your-virtual-network)
> 
> 

This article will walk you through the steps to add, resize, and remove a virtual network (VNet) gateway for a pre-existing VNet. The steps for this configuration are specifically for VNets that were created using the **classic deployment model** and that will be used in an ExpressRoute configuration. 

[!INCLUDE [expressroute-classic-end-include](../../includes/expressroute-classic-end-include.md)]

**About Azure deployment models**

[!INCLUDE [vpn-gateway-classic-rm](../../includes/vpn-gateway-classic-rm-include.md)]

## Before beginning
Verify that you have installed the Azure PowerShell cmdlets needed for this configuration (1.0.2 or later). If you haven't installed the cmdlets, you'll need to do so before beginning the configuration steps. For more information about installing Azure PowerShell, see [How to install and configure Azure PowerShell](/powershell/azure/overview).

[!INCLUDE [expressroute-gateway-classic-ps](../../includes/expressroute-gateway-classic-ps-include.md)]

## Next steps
After you have created the VNet gateway, you can link your VNet to an ExpressRoute circuit. See [Link a Virtual Network to an ExpressRoute circuit](expressroute-howto-linkvnet-classic.md).

