---
title: 'Quickstart: Create and configure Route Server using Azure PowerShell'
description: In this quickstart, you learn how to create and configure a Route Server using Azure PowerShell.
services: route-server
author: duongau
ms.author: duau
ms.date: 04/23/2021
ms.topic: quickstart
ms.service: route-server
ms.custom:
  - mode-api
---

# Quickstart: Create and configure Route Server using Azure PowerShell

This article helps you configure Azure Route Server to peer with a Network Virtual Appliance (NVA) in your virtual network using PowerShell. Azure Route Server will learn routes from the NVA and program them on the virtual machines in the virtual network. Azure Route Server will also advertise the virtual network routes to the NVA. For more information, read [Azure Route Server](overview.md).

:::image type="content" source="media/quickstart-configure-route-server-portal/environment-diagram.png" alt-text="Diagram of Route Server deployment environment using the Azure PowerShell." border="false":::

> [!IMPORTANT]
> Azure Route Server (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Make sure you have the latest PowerShell modules, or you can use Azure Cloud Shell in the portal.
* Review the [service limits for Azure Route Server](route-server-faq.md#limitations).

## Create a Route Server

### Sign in to your Azure account and select your subscription.

[!INCLUDE [sign in](../../includes/expressroute-cloud-shell-connect.md)]

### Create a resource group and virtual network

Before you can create an Azure Route Server, you'll need a virtual network to host the deployment. Use the follow command to create a resource group and virtual network. If you already have a virtual network, you can skip to the next section.

```azurepowershell-interactive
New-AzResourceGroup –Name "RouteServerRG” -Location “West US"
New-AzVirtualNetwork –ResourceGroupName "RouteServerRG" -Location "West US" -Name myVirtualNetwork –AddressPrefix 10.0.0.0/16
```

### Add a subnet

1. Add a subnet named *RouteServerSubnet* to deploy the Azure Route Server into. This subnet is a dedicated subnet only for Azure Route Server. The RouteServerSubnet must be /27 or a shorter prefix (such as /26, /25), or you'll receive an error message when you add the Azure Route Server.

    ```azurepowershell-interactive
    $vnet = Get-AzVirtualNetwork –Name "myVirtualNetwork" - ResourceGroupName "RouteServerRG"
    Add-AzVirtualNetworkSubnetConfig –Name "RouteServerSubnet" -AddressPrefix 10.0.0.0/24 -VirtualNetwork $vnet
    $vnet | Set-AzVirtualNetwork
    ```

1. Obtain the RouteServerSubnet ID. To see the resource ID of all subnets in the virtual network, use this command:

    ```azurepowershell-interactive
    $vnet = Get-AzVirtualNetwork –Name "vnet_name" -ResourceGroupName "RouteServerRG"
    $vnet.Subnets
    ```

The RouteServerSubnet ID looks like the following one:

`/subscriptions/<subscriptionID>/resourceGroups/RouteServerRG/providers/Microsoft.Network/virtualNetworks/myVirtualNetwork/subnets/RouteServerSubnet`

## Create the Route Server

Create the Route Server with this command:

```azurepowershell-interactive 
New-AzRouteServer -RouteServerName myRouteServer -ResourceGroupName RouteServerRG -Location "West US" -HostedSubnet "RouteServerSubnet_ID"
```

The location needs to match the location of your virtual network. The HostedSubnet is the RouteServerSubnet ID you obtained in the previous section.

## Create peering with an NVA

Use the following command to establish BGP peering from the Route Server to the NVA:

```azurepowershell-interactive 
Add-AzRouteServerPeer -PeerName "myNVA" -PeerIp "nva_ip" -PeerAsn "nva_asn" -RouteServerName myRouteServer -ResourceGroupName RouteServerRG
```

“nva_ip” is the virtual network IP assigned to the NVA. “nva_asn” is the Autonomous System Number (ASN) configured in the NVA. The ASN can be any 16-bit number other than the ones in the range of 65515-65520. This range of ASNs are reserved by Microsoft.

To set up peering with different NVA or another instance of the same NVA for redundancy, use this command:

```azurepowershell-interactive 
Add-AzRouteServerPeer -PeerName "NVA2_name" -PeerIp "nva2_ip" -PeerAsn "nva2_asn" -RouteServerName myRouteServer -ResourceGroupName RouteServerRG 
```

## Complete the configuration on the NVA

To complete the configuration on the NVA and enable the BGP sessions, you need the IP and the ASN of Azure Route Server. You can get this information using this command:

```azurepowershell-interactive 
Get-AzRouteServer -RouterServerName myRouteServer -ResourceGroupName RouteServerRG
```

The output has the following information:

``` 
RouteServerAsn : 65515
RouteServerIps : {10.5.10.4, 10.5.10.5}
```

## <a name = "route-exchange"></a>Configure route exchange

If you have an ExpressRoute gateway and an Azure VPN gateway in the same VNet and you want them to exchange routes, you can enable route exchange on the Azure Route Server.

1. To enable route exchange between Azure Route Server and the gateway(s) use this command:

```azurepowershell-interactive 
Update-AzRouteServer -RouteServerName myRouteServer -ResourceGroupName RouteServerRG -AllowBranchToBranchTraffic 
```

2. To disable route exchange between Azure Route Server and the gateway(s) use this command:

```azurepowershell-interactive 
Update-AzRouteServer -RouteServerName myRouteServer -ResourceGroupName RouteServerRG
```

## Troubleshooting

You can view the routes advertised and received by Azure Route Server with this command:

```azurepowershell-interactive
Get-AzRouteServerPeerAdvertisedRoute
Get-AzRouteServerPeerLearnedRoute
```
## Clean up resources

If you no longer need the Azure Route Server, use these commands to remove the BGP peering and then remove the Route Server. 

1. Remove the BGP peering between Azure Route Server and an NVA with this command:

```azurepowershell-interactive 
Remove-AzRouteServerPeer -PeerName "nva_name" -RouteServerName myRouteServer -ResourceGroupName RouteServerRG 
```

2. Remove Azure Route Server with this command:

```azurepowershell-interactive 
Remove-AzRouteServer -RouteServerName myRouteServer -ResourceGroupName RouteServerRG
```

## Next steps

After you create the Azure Route Server, continue to learn about how Azure Route Server interacts with ExpressRoute and VPN Gateways: 

> [!div class="nextstepaction"]
> [Azure ExpressRoute and Azure VPN support](expressroute-vpn-support.md)
