---
title: 'Quickstart: Create and configure Route Server - Azure PowerShell'
description: In this quickstart, you learn how to create and configure an Azure Route Server using Azure PowerShell.
services: route-server
author: halkazwini
ms.author: halkazwini
ms.date: 07/28/2022
ms.topic: quickstart
ms.service: route-server
ms.custom: devx-track-azurepowershell, mode-api, template-quickstart
---

# Quickstart: Create and configure Route Server using Azure PowerShell

This article helps you configure Azure Route Server to peer with a Network Virtual Appliance (NVA) in your virtual network using Azure PowerShell. Route Server learns routes from your NVA and program them on the virtual machines in the virtual network. Azure Route Server also advertises the virtual network routes to the NVA. For more information, see [Azure Route Server](overview.md).

:::image type="content" source="media/quickstart-configure-route-server-portal/environment-diagram.png" alt-text="Diagram of Route Server deployment environment using the Azure PowerShell." border="false":::

[!INCLUDE [route server preview note](../../includes/route-server-note-preview-date.md)]

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Make sure you have the latest PowerShell modules, or you can use Azure Cloud Shell in the portal.
* Review the [service limits for Azure Route Server](route-server-faq.md#limitations).
* If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create resource group and a virtual network

### Create a resource group 

Before you can create an Azure Route Server, you have to create a resource group to host the Route Server. Create a resource group with [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup). This example creates a resource group named **myRouteServerRG** in the **WestUS** location:

```azurepowershell-interactive
$rg = @{
    Name = 'myRouteServerRG'
    Location = 'WestUS'
}
New-AzResourceGroup @rg
```

### Create a virtual network

Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). This example creates a default virtual network named **myVirtualNetwork** in the **WestUS** location: If you already have a virtual network, you can skip to the next section.

```azurepowershell-interactive
$vnet = @{
    Name = 'myVirtualNetwork'
    ResourceGroupName = 'myRouteServerRG'
    Location = 'WestUS'
    AddressPrefix = '10.0.0.0/16'    
}
$virtualNetwork = New-AzVirtualNetwork @vnet
```

### Add a dedicated subnet

Azure Route Server requires a dedicated subnet named *RouteServerSubnet*. The subnet size has to be at least /27 or shorter prefix (such as /26 or /25) or you'll receive an error message when deploying the Route Server. Create a subnet configuration named **RouteServerSubnet** with [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig):

```azurepowershell-interactive
$subnet = @{
    Name = 'RouteServerSubnet'
    VirtualNetwork = $virtualNetwork
    AddressPrefix = '10.0.0.0/24'
}
$subnetConfig = Add-AzVirtualNetworkSubnetConfig @subnet

$virtualnetwork | Set-AzVirtualNetwork

$vnetInfo = Get-AzVirtualNetwork -Name myVirtualNetwork
$subnetId = (Get-AzVirtualNetworkSubnetConfig -Name RouteServerSubnet -VirtualNetwork $vnetInfo).Id
```

## Create the Route Server

1. To ensure connectivity to the backend service that manages Route Server configuration, assigning a public IP address is required. Create a Standard Public IP named **RouteServerIP** with [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress):

    ```azurepowershell-interactive
    $ip = @{
        Name = 'myRouteServerIP'
        ResourceGroupName = 'myRouteServerRG'
        Location = 'WestUS'
        AllocationMethod = 'Static'
        IpAddressVersion = 'Ipv4'
        Sku = 'Standard'
    }
    $publicIp = New-AzPublicIpAddress @ip
    ```
    
2. Create the Azure Route Server with [New-AzRouteServer](/powershell/module/az.network/new-azrouteserver). This example creates an Azure Route Server named **myRouteServer** in the **WestUS** location. The *HostedSubnet* is the resource ID of the RouteServerSubnet created in the previous section.

    ```azurepowershell-interactive      
    $rs = @{
        RouteServerName = 'myRouteServer'
        ResourceGroupName = 'myRouteServerRG'
        Location = 'WestUS'
        HostedSubnet = $subnetId
        PublicIP = $publicIp
    }
    New-AzRouteServer @rs 
    ```

## Create BGP peering with an NVA

To establish BGP peering from the Route Server to your NVA use [Add-AzRouteServerPeer](/powershell/module/az.network/add-azrouteserverpeer):

The “your_nva_ip” is the virtual network IP assigned to the NVA. The “your_nva_asn” is the Autonomous System Number (ASN) configured in the NVA. The ASN can be any 16-bit number other than the ones in the range of 65515-65520. This range of ASNs are reserved by Microsoft.

```azurepowershell-interactive
$peer = @{
    PeerName = 'myNVA"
    PeerIp = '192.168.0.1'
    PeerAsn = '65501'
    RouteServerName = 'myRouteServer'
    ResourceGroupName = myRouteServerRG'
}
Add-AzRouteServerPeer @peer
```

To set up peering with a different NVA or another instance of the same NVA for redundancy, use the same command as above with different *PeerName*, *PeerIp*, and *PeerAsn*.

## Complete the configuration on the NVA

To complete the configuration on the NVA and enable the BGP sessions, you need the IP and the ASN of Azure Route Server. You can get this information by using [Get-AzRouteServer](/powershell/module/az.network/get-azrouteserver):

```azurepowershell-interactive
$routeserver = @{
    RouteServerName = 'myRouteServer'
    ResourceGroupName = 'myRouteServerRG'
} 
Get-AzRouteServer @routeserver
```

The output will look like the following:

``` 
RouteServerAsn : 65515
RouteServerIps : {10.5.10.4, 10.5.10.5}
```

[!INCLUDE [NVA peering note](../../includes/route-server-note-nva-peering.md)]

## <a name = "route-exchange"></a>Configure route exchange

If you have an ExpressRoute and an Azure VPN gateway in the same virtual network and you want them to exchange routes, you can enable route exchange on the Azure Route Server.

1. To enable route exchange between Azure Route Server and the gateway(s), use [Update-AzRouteServer](/powershell/module/az.network/update-azrouteserver) with the *-AllowBranchToBranchTraffic* flag:

```azurepowershell-interactive
$routeserver = @{
    RouteServerName = 'myRouteServer'
    ResourceGroupName = 'myRouteServerRG'
    AllowBranchToBranchTraffic
}  
Update-AzRouteServer @routeserver 
```

2. To disable route exchange between Azure Route Server and the gateway(s), use [Update-AzRouteServer](/powershell/module/az.network/update-azrouteserver) without the *-AllowBranchToBranchTraffic* flag:

```azurepowershell-interactive
$routeserver = @{
    RouteServerName = 'myRouteServer'
    ResourceGroupName = 'myRouteServerRG'
}  
Update-AzRouteServer @routeserver 
```

## Troubleshooting

Use the [Get-AzRouteServerPeerAdvertisedRoute](/powershell/module/az.network/get-azrouteserverpeeradvertisedroute) to view routes advertised by the Azure Route Server.

```azurepowershell-interactive
$remotepeer = @{
    RouteServerName = 'myRouteServer'
    ResourceGroupName = 'myRouteServerRG'
    PeerName = 'myNVA'
}
Get-AzRouteServerPeerAdvertisedRoute @remotepeer
```

Use the [Get-AzRouteServerPeerLearnedRoute](/powershell/module/az.network/get-azrouteserverpeerlearnedroute) to view routes learned by the Azure Route Server.

```azurepowershell-interactive
$remotepeer = @{
    RouteServerName = 'myRouteServer'
    ResourceGroupName = 'myRouteServerRG'
    PeerName = 'myNVA'
}  
Get-AzRouteServerPeerLearnedRoute @remotepeer
```
## Clean up resources

If you no longer need the Azure Route Server, use the first command to remove the BGP peering, and then the second command to remove the Route Server. 

1. Remove the BGP peering between Azure Route Server and an NVA with [Remove-AzRouteServerPeer](/powershell/module/az.network/remove-azrouteserverpeer):

```azurepowershell-interactive
$remotepeer = @{
    PeerName = 'myNVA'
    RouteServerName = 'myRouteServer'
    ResourceGroupName = 'myRouteServerRG'
} 
Remove-AzRouteServerPeer @remotepeer
```

2. Remove the Azure Route Server with [Remove-AzRouteServer](/powershell/module/az.network/remove-azrouteserver):

```azurepowershell-interactive 
$routeserver = @{
    RouteServerName = 'myRouteServer'
    ResourceGroupName = 'myRouteServerRG'
} 
Remove-AzRouteServer @routeserver
```

## Next steps

After you've created the Azure Route Server, continue on to learn more about how Azure Route Server interacts with ExpressRoute and VPN Gateways: 

> [!div class="nextstepaction"]
> [Azure ExpressRoute and Azure VPN support](expressroute-vpn-support.md)
