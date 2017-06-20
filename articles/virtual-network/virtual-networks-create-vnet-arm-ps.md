---
title: Create a virtual network - Azure PowerShell | Microsoft Docs
description: Learn how to create a virtual network using PowerShell.
services: virtual-network
documentationcenter: ''
author: jimdial
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: a31f4f12-54ee-4339-b968-1a8097ca77d3
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/03/2017
ms.author: jdial
ms.custom: H1Hack27Feb2017 

---
# Create a virtual network using PowerShell

[!INCLUDE [virtual-networks-create-vnet-intro](../../includes/virtual-networks-create-vnet-intro-include.md)]

Azure has two deployment models: Azure Resource Manager and classic. Microsoft recommends creating resources through the Resource Manager deployment model. To learn more about the differences between the two models, read the [Understand Azure deployment models](../azure-resource-manager/resource-manager-deployment-model.md) article.
 
This article explains how to create a VNet through the Resource Manager deployment model using PowerShell. You can also create a VNet through Resource Manager using other tools or create a VNet through the classic deployment model by selecting a different option from the following list:

> [!div class="op_single_selector"]
> * [Portal](virtual-networks-create-vnet-arm-pportal.md)
> * [PowerShell](virtual-networks-create-vnet-arm-ps.md)
> * [CLI](virtual-networks-create-vnet-arm-cli.md)
> * [Template](virtual-networks-create-vnet-arm-template-click.md)
> * [Portal (Classic)](virtual-networks-create-vnet-classic-pportal.md)
> * [PowerShell (Classic)](virtual-networks-create-vnet-classic-netcfg-ps.md)
> * [CLI (Classic)](virtual-networks-create-vnet-classic-cli.md)

[!INCLUDE [virtual-networks-create-vnet-scenario-include](../../includes/virtual-networks-create-vnet-scenario-include.md)]

## Create a virtual network

To create a virtual network using PowerShell, complete the following steps:

1. Install and configure Azure PowerShell, by following the steps in the [How to Install and Configure Azure PowerShell](/powershell/azure/overview) article.

2. If necessary, create a new resource group, as shown below. For this scenario, create a resource group named *TestRG*. For more information about resource groups, visit [Azure Resource Manager Overview](../azure-resource-manager/resource-group-overview.md).

	```powershell   
	New-AzureRmResourceGroup -Name TestRG -Location centralus
	```

    Expected output:

        ResourceGroupName : TestRG
        Location          : centralus
        ProvisioningState : Succeeded
        Tags              :
        ResourceId        : /subscriptions/[Subscription Id]/resourceGroups/TestRG    
3. Create a new VNet named *TestVNet*:

	```powershell
	New-AzureRmVirtualNetwork -ResourceGroupName TestRG -Name TestVNet `
	-AddressPrefix 192.168.0.0/16 -Location centralus
	```

    Expected output:

        Name                  : TestVNet
        ResourceGroupName     : TestRG
        Location              : centralus
        Id                    : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet
        Etag                   : W/"[Id]"
        ProvisioningState          : Succeeded
        Tags                       : 
        AddressSpace               : {
                                   "AddressPrefixes": [
                                     "192.168.0.0/16"
                                   ]
                                  }
        DhcpOptions                : {}
        Subnets                    : []
        VirtualNetworkPeerings     : []
4. Store the virtual network object in a variable:

	```powershell
	$vnet = Get-AzureRmVirtualNetwork -ResourceGroupName TestRG -Name TestVNet
	```

   > [!TIP]
   > You can combine steps 3 and 4 by running `$vnet = New-AzureRmVirtualNetwork -ResourceGroupName TestRG -Name TestVNet -AddressPrefix 192.168.0.0/16 -Location centralus`.
   > 

5. Add a subnet to the new VNet variable:

	```powershell
	Add-AzureRmVirtualNetworkSubnetConfig -Name FrontEnd `
	-VirtualNetwork $vnet -AddressPrefix 192.168.1.0/24
	```

    Expected output:
   
        Name                  : TestVNet
        ResourceGroupName     : TestRG
        Location              : centralus
        Id                    : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet
        Etag                  : W/"[Id]"
        ProvisioningState     : Succeeded
        Tags                  :
        AddressSpace          : {
                                  "AddressPrefixes": [
                                    "192.168.0.0/16"
                                  ]
                                }
        DhcpOptions           : {}
        Subnets             : [
                                  {
                                    "Name": "FrontEnd",
                                    "AddressPrefix": "192.168.1.0/24"
                                  }
                                ]
        VirtualNetworkPeerings     : []

6. Repeat step 5 above for each subnet you want to create. The following command creates the *BackEnd* subnet for the scenario:

	```powershell
	Add-AzureRmVirtualNetworkSubnetConfig -Name BackEnd `
	-VirtualNetwork $vnet -AddressPrefix 192.168.2.0/24
	```

7. Although you create subnets, they currently only exist in the local variable used to retrieve the VNet you create in step 4 above. To save the changes to Azure, run the following command:

	```powershell
	Set-AzureRmVirtualNetwork -VirtualNetwork $vnet
	```
   
    Expected output:
   
        Name                  : TestVNet
        ResourceGroupName     : TestRG
        Location              : centralus
        Id                    : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet
        Etag                  : W/"[Id]"
        ProvisioningState     : Succeeded
        Tags                  :
        AddressSpace          : {
                                  "AddressPrefixes": [
                                    "192.168.0.0/16"
                                  ]
                                }
        DhcpOptions           : {
                                  "DnsServers": []
                                }
        Subnets               : [
                                  {
                                    "Name": "FrontEnd",
                                    "Etag": "W/\"[Id]\"",
                                    "Id": "/subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd",
                                    "AddressPrefix": "192.168.1.0/24",
                                    "IpConfigurations": [],
                                    "ProvisioningState": "Succeeded"
                                  },
                                  {
                                    "Name": "BackEnd",
                                    "Etag": "W/\"[Id]\"",
                                    "Id": "/subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/BackEnd",
                                    "AddressPrefix": "192.168.2.0/24",
                                    "IpConfigurations": [],
                                    "ProvisioningState": "Succeeded"
                                  }
                                ]
        VirtualNetworkPeerings : []

## Next steps

Learn how to connect:

- A virtual machine (VM) to a virtual network by reading the [Create a Windows VM](../virtual-machines/virtual-machines-windows-ps-create.md) article. Instead of creating a VNet and subnet in the steps of the articles, you can select an existing VNet and subnet to connect a VM to.
- The virtual network to other virtual networks by reading the [Connect VNets](../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md) article.
- The virtual network to an on-premises network using a site-to-site virtual private network (VPN) or ExpressRoute circuit. Learn how by reading the [Connect a VNet to an on-premises network using a site-to-site VPN](../vpn-gateway/vpn-gateway-howto-multi-site-to-site-resource-manager-portal.md) and [Link a VNet to an ExpressRoute circuit](../expressroute/expressroute-howto-linkvnet-arm.md) articles.
