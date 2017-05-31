---
title: Azure Virtual Network peering - PowerShell | Microsoft Docs
description: Learn how to create a virtual network peering using Azure PowerShell.
services: virtual-network
documentationcenter: ''
author: NarayanAnnamalai
manager: jefco
editor: ''
tags: azure-resource-manager

ms.assetid: dac579bd-7545-461a-bdac-301c87434c84
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/14/2016
ms.author: narayan; annahar

---
# Create a virtual network peering using Azure PowerShell
[!INCLUDE [virtual-networks-create-vnet-selectors-arm-include](../../includes/virtual-networks-create-vnetpeering-selectors-arm-include.md)]

[!INCLUDE [virtual-networks-create-vnet-intro](../../includes/virtual-networks-create-vnetpeering-intro-include.md)]

[!INCLUDE [virtual-networks-create-vnet-scenario-basic-include](../../includes/virtual-networks-create-vnetpeering-scenario-basic-include.md)]

To create a VNet peering by using PowerShell, please follow the steps below:

1. If you have never used Azure PowerShell, see [How to Install and Configure Azure PowerShell](/powershell/azure/overview) and follow the instructions all the way to the end to sign into Azure and select your subscription.

	> [!NOTE]
	> The PowerShell cmdlet for managing VNet peering is shipped with [Azure PowerShell 1.6.](http://www.powershellgallery.com/packages/Azure/1.6.0)
	>

2. Read virtual network objects:

	```powershell
	$vnet1 = Get-AzureRmVirtualNetwork -ResourceGroupName vnet101 -Name vnet1
	$vnet2 = Get-AzureRmVirtualNetwork -ResourceGroupName vnet101 -Name vnet2
	```

3. To establish VNet peering, you need to create two links, one for each direction. The following step will create a VNet peering link for VNet1 to VNet2 first:

	```powershell
	Add-AzureRmVirtualNetworkPeering -Name LinkToVNet2 -VirtualNetwork $vnet1 -RemoteVirtualNetworkId $vnet2.Id
	```

	Returned output:
		
		Name            : LinkToVNet2
		Id: /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/vnet101/providers/Microsoft.Network/virtualNetworks/vnet1/virtualNetworkPeerings/LinkToVNet2
		Etag            : W/"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
		ResourceGroupName    : vnet101
		VirtualNetworkName    : vnet1
		PeeringState        : Initiated
		ProvisioningState    : Succeeded
		RemoteVirtualNetwork    : {
		"Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/vnet101/providers/Microsoft.Network/virtualNetworks/vnet2"
	                                    }
	    AllowVirtualNetworkAccess    : True
	    AllowForwardedTraffic    : False
	    AllowGatewayTransit    : False
	        UseRemoteGateways    : False
	        RemoteGateways        : null
	        RemoteVirtualNetworkAddressSpace : null

4. This step will create a VNet peering link for VNet2 to VNet1:

	```powershell
	Add-AzureRmVirtualNetworkPeering -Name LinkToVNet1 -VirtualNetwork $vnet2 -RemoteVirtualNetworkId $vnet1.Id
	```

	Returned output:

        Name            : LinkToVNet1
        Id                : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/vnet101/providers/Microsoft.Network/virtualNetworks/vnet2/virtualNetworkPeerings/LinkToVNet1
        Etag            : W/"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        ResourceGroupName    : vnet101
        VirtualNetworkName    : vnet2
        PeeringState        : Connected
        ProvisioningState    : Succeeded
        RemoteVirtualNetwork    : {
                                            "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/vnet101/providers/Microsoft.Network/virtualNetworks/vnet1"
                                        }
        AllowVirtualNetworkAccess    : True
        AllowForwardedTraffic    : False
        AllowGatewayTransit    : False
        UseRemoteGateways    : False
        RemoteGateways        : null
        RemoteVirtualNetworkAddressSpace : null
5. Once the VNet peering link is created, enter the following command to view the link state:

	```powershell
	Get-AzureRmVirtualNetworkPeering -VirtualNetworkName vnet1 -ResourceGroupName vnet101 -Name linktovnet2
	```

	Returned output:
   
        Name            : LinkToVNet2
        Id                : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/vnet101/providers/Microsoft.Network/virtualNetworks/vnet1/virtualNetworkPeerings/LinkToVNet2
        Etag            : W/"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        ResourceGroupName    : vnet101
        VirtualNetworkName    : vnet1
        PeeringState        : Connected
        ProvisioningState    : Succeeded
        RemoteVirtualNetwork    : {
                                             "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/vnet101/providers/Microsoft.Network/virtualNetworks/vnet2"
                                        }
        AllowVirtualNetworkAccess    : True
        AllowForwardedTraffic            : False
        AllowGatewayTransit              : False
        UseRemoteGateways                : False
        RemoteGateways                   : null
        RemoteVirtualNetworkAddressSpace : null
   
    There are a few configurable properties for VNet peering:
   
   | Option | Description | Default |
   |:--- |:--- |:--- |
   | AllowVirtualNetworkAccess |Whether address space of Peer VNet to be included as part of the Virtual_network Tag |Yes |
   | AllowForwardedTraffic |Whether traffic not originating from a peered VNet is accepted or dropped |No |
   | AllowGatewayTransit |Allows the peer VNet to use your VNet gateway |No |
   | UseRemoteGateways |Use your peer’s VNet gateway. The peer VNet must have a gateway configured and AllowGatewayTransit selected. You cannot use this option if you have a gateway configured |No |

	Each link in a VNet peering has the previous set of properties. For example, you can set `AllowVirtualNetworkAccess` to *True* for VNet peering link VNet1 to VNet2 and set it to *False* for the VNet peering link in the other direction.

	```powershell
	$LinktoVNet2 = Get-AzureRmVirtualNetworkPeering -VirtualNetworkName vnet1 `
	-ResourceGroupName vnet101 -Name LinkToVNet2

	$LinktoVNet2.AllowForwardedTraffic = $true
	Set-AzureRmVirtualNetworkPeering -VirtualNetworkPeering $LinktoVNet2
	```

	You can run `Get-AzureRmVirtualNetworkPeering` to double check the property value after the change. From the output, you can see `AllowForwardedTraffic` changes set to *True* after running the previous cmdlets.

        Name            : LinkToVNet2
        Id            : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/vnet101/providers/Microsoft.Network/virtualNetworks/vnet1/virtualNetworkPeerings/LinkToVNet2
        Etag            : W/"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        ResourceGroupName    : vnet101
        VirtualNetworkName    : vnet1
        PeeringState        : Connected
        ProvisioningState    : Succeeded
        RemoteVirtualNetwork    : {
                                            "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/vnet101/providers/Microsoft.Network/virtualNetworks/vnet2"
                                        }
        AllowVirtualNetworkAccess    : True
        AllowForwardedTraffic        : True
        AllowGatewayTransit        : False
        UseRemoteGateways        : False
        RemoteGateways        : null
        RemoteVirtualNetworkAddressSpace : null

	After peering is established, VMs should be able to communicate with each other across both VNets. By default, `AllowVirtualNetworkAccess` is *True* and VNet peering will provision the proper ACLs to allow the communication between VNets. You can still apply network security group (NSG) rules to block connectivity between specific subnets or virtual machines to gain fine grain control of access between two VNets. Read the [network security group](virtual-networks-create-nsg-arm-ps.md) article to learn more about NSGs.

[!INCLUDE [virtual-networks-create-vnet-scenario-crosssub-include](../../includes/virtual-networks-create-vnetpeering-scenario-crosssub-include.md)]

To create VNet peering across subscriptions using PowerShell, complete the following steps:

1. Sign in to Azure with privileged User-A's account for Subscription-A and run the following cmdlet:

	```powershell
	New-AzureRmRoleAssignment -SignInName <UserB ID> -RoleDefinitionName "Network Contributor" -Scope /subscriptions/<Subscription-A-ID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Network/VirtualNetworks/VNet5
	```

	This is not a requirement. Peering can be established even if users individually raise peering requests for their respective VNets, as long as the requests match. Adding a privileged user of the other VNet as a user in the local VNet makes it easier to do the setup.
2. Sign in to Azure with privileged User-B's account for Subscription-B and run the following cmdlet:

	```powershell
	New-AzureRmRoleAssignment -SignInName <UserA ID> -RoleDefinitionName "Network Contributor" -Scope /subscriptions/<Subscription-B-ID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Network/VirtualNetworks/VNet3
	```

	> [!IMPORTANT]
	> If the peering you're creating is between two VNets created through the Azure Resource Manager deployment model, continue with the remaining steps in this section. If the two VNets were created through different deployment models, skip the remaining steps of this section and complete the steps in the [Peering virtual networks created through different deployment models](#x-model) section of this article.

3. In User-A’s login session, run the following command:

	```powershell
	$vnet3 = Get-AzureRmVirtualNetwork -ResourceGroupName hr-vnets -Name vnet3

	Add-AzureRmVirtualNetworkPeering -Name LinkToVNet5 -VirtualNetwork $vnet3 -RemoteVirtualNetworkId "/subscriptions/<Subscription-B-Id>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Network/virtualNetworks/VNet5" -BlockVirtualNetworkAccess
	```

4. In User-B’s login session, run the cmdlet below:

	```powershell
	$vnet5 = Get-AzureRmVirtualNetwork -ResourceGroupName vendor-vnets -Name vnet5

	Add-AzureRmVirtualNetworkPeering -Name LinkToVNet3 -VirtualNetwork $vnet5 -RemoteVirtualNetworkId "/subscriptions/<Subscriptoin-A-Id>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Network/virtualNetworks/VNet3" -BlockVirtualNetworkAccess
	```

5. After peering is established, any VM in VNet3 should be able to communicate with any VM in VNet5.

[!INCLUDE [virtual-networks-create-vnet-scenario-transit-include](../../includes/virtual-networks-create-vnetpeering-scenario-transit-include.md)]

1. In this scenario, run the following PowerShell cmdlets to establish the VNet peering. You need to set the `AllowForwardedTraffic` property to *True* and link VNET1 to HubVNet, which allows the inbound traffic from outside of the peering VNet address space.

	```powershell
	$hubVNet = Get-AzureRmVirtualNetwork -ResourceGroupName vnet101 -Name HubVNet
	$vnet1 = Get-AzureRmVirtualNetwork -ResourceGroupName vnet101 -Name vnet1

	Add-AzureRmVirtualNetworkPeering -Name LinkToHub -VirtualNetwork $vnet1 -RemoteVirtualNetworkId $HubVNet.Id -AllowForwardedTraffic

	Add-AzureRmVirtualNetworkPeering -Name LinkToVNet1 -VirtualNetwork $HubVNet -RemoteVirtualNetworkId $vnet1.Id
	```

2. After peering is established, you can refer to this [article](virtual-network-create-udr-arm-ps.md) and define a user-defined route (UDR) to redirect VNet1 traffic through a virtual appliance to use its capabilities. When you specify the next hop address in the route, you can set it to the IP address of the virtual appliance in the peer VNet HubVNet. The following is a sample:

	```powershell
	$route = New-AzureRmRouteConfig -Name TestNVA -AddressPrefix 10.3.0.0/16 -NextHopType VirtualAppliance -NextHopIpAddress 192.0.1.5

	$routeTable = New-AzureRmRouteTable -ResourceGroupName VNet101 -Location brazilsouth -Name TestRT -Route $route

	$vnet1 = Get-AzureRmVirtualNetwork -ResourceGroupName VNet101 -Name VNet1

	Set-AzureRmVirtualNetworkSubnetConfig -VirtualNetwork $vnet1 -Name subnet-1 -AddressPrefix 10.1.1.0/24 -RouteTable $routeTable

	Set-AzureRmVirtualNetwork -VirtualNetwork $vnet1
	```

[!INCLUDE [virtual-networks-create-vnet-scenario-asmtoarm-include](../../includes/virtual-networks-create-vnetpeering-scenario-asmtoarm-include.md)]

1. If you are creating a peering between VNets deployed through different deployment models in the *same* subscription, skip to step 2. The ability to create a VNet peering between VNets deployed through different deployment models in *different* subscriptions is in **preview** release. Capabilities in preview release do not have the same level of reliability and service level agreement as general release capabilities. If you are creating a peering between VNets deployed through different deployment models in different subscriptions you must first complete the following tasks:
	- Register the preview capability in your Azure subscription by entering the following commands from PowerShell: `Register-AzureRmProviderFeature -FeatureName AllowClassicCrossSubscriptionPeering -ProviderNamespace Microsoft.Network` and `Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Network`
	- Complete steps 1-2 in the [Peering across subscriptions](#x-sub) section of this article.
2. Read the virtual network object for **VNET1**, the Azure Resource Manager virtual network, by entering the following command:

	```powershell
	$vnet1 = Get-AzureRmVirtualNetwork -ResourceGroupName vnet101 -Name vnet1
	```

3. To establish VNet peering in this scenario, only one link is needed, specifically a link from **VNET1** to **VNET2**. This step requires knowing your classic VNet's resource ID. The resource group ID format looks like the following example:

       	subscriptions/{SubscriptionID}/resourceGroups/{ResourceGroupName}/providers/Microsoft.ClassicNetwork/virtualNetworks/{VirtualNetworkName}

	Be sure to replace SubscriptionID, ResourceGroupName, and VirtualNetworkName with the appropriate names.

	This can be accomplished by entering the following command:

	```powershell
	Add-AzureRmVirtualNetworkPeering -Name LinkToVNet2 -VirtualNetwork $vnet1 -RemoteVirtualNetworkId /subscriptions/xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.ClassicNetwork/virtualNetworks/VNET2
	```

4. Once the VNet peering link is created, you can see the link state, as shown in the following output:
   
        Name                             : LinkToVNet2
        Id                               : /subscriptions/xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Network/virtualNetworks/VNET1/virtualNetworkPeerings/LinkToVNet2
        Etag                             : W/"acecbd0f-766c-46be-aa7e-d03e41c46b16"
        ResourceGroupName                : MyResourceGroup
        VirtualNetworkName               : VNET1
        PeeringState                     : Connected
        ProvisioningState                : Succeeded
        RemoteVirtualNetwork             : {
                                         "Id": "/subscriptions/xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.ClassicNetwork/virtualNetworks/VNET2"
                                       }
        AllowVirtualNetworkAccess        : True
        AllowForwardedTraffic            : False
        AllowGatewayTransit              : False
        UseRemoteGateways                : False
        RemoteGateways                   : null
        RemoteVirtualNetworkAddressSpace : null

## Remove a VNet peering
1. In order to remove a VNet peering, you need to run the following cmdlet:

	```powershell
	Remove-AzureRmVirtualNetworkPeering
	```

	To remove both links, enter the following commands:

	```powershell
	Remove-AzureRmVirtualNetworkPeering -ResourceGroupName vnet101 -VirtualNetworkName vnet1 -Name linktovnet2
	Remove-AzureRmVirtualNetworkPeering -ResourceGroupName vnet101 -VirtualNetworkName vnet1 -Name linktovnet2
	```

2. Once you remove one link in a VNET peering, the  peer link state will go to *Disconnected*. In this state, you cannot re-create the link until the peer link state changes to *Initiated*. We recommend you remove both links before you re-create the VNet peering.

