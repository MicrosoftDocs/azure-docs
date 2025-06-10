---
title: 'Quickstart: Create an Azure Route Server - PowerShell'
description: In this quickstart, you learn how to create an Azure Route Server using Azure PowerShell.
author: halkazwini
ms.author: halkazwini
ms.service: azure-route-server
ms.topic: quickstart
ms.date: 02/26/2025
ms.custom: devx-track-azurepowershell, mode-api
---

# Quickstart: Create an Azure Route Server using PowerShell

In this quickstart, you learn how to create an Azure Route Server to peer with a network virtual appliance (NVA) in your virtual network using Azure PowerShell.

:::image type="content" source="./media/route-server-diagram.png" alt-text="Diagram of Route Server deployment environment using the Azure PowerShell.":::

[!INCLUDE [route server preview note](../../includes/route-server-note-preview-date.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Review the [service limits for Azure Route Server](route-server-faq.md#limitations).

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the cmdlets in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

## Create a route server

In this section, you create a route server. Prior to creating the route server, create a resource group to host all resources including the route server. You'll also need to create a virtual network with a dedicated subnet for the route server.

1. Create a resource group using [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup) cmdlet. The following example creates a resource group named **myResourceGroup** in the **EastUS** region:

    ```azurepowershell-interactive
    # Create a resource group.
    New-AzResourceGroup = -Name 'myResourceGroup' -Location 'EastUS'
    ```

1. The route server requires a dedicated subnet named *RouteServerSubnet*, with a minimum subnet size of /26 or larger. Create a subnet configuration for **RouteServerSubnet** using [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) cmdlet.

    ```azurepowershell-interactive
    # Create subnet configuration.
    $subnet = New-AzVirtualNetworkSubnetConfig -Name 'RouteServerSubnet' -AddressPrefix '10.0.1.0/26'
    ```

1. Create a virtual network using [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) cmdlet. The following example creates a default virtual network named **myVirtualNetwork** in the **EastUS** region.

    ```azurepowershell-interactive
    # Create a virtual network and place into a variable.
    $vnet = New-AzVirtualNetwork -Name 'myVirtualNetwork' -ResourceGroupName 'myResourceGroup' -Location 'EastUS' -AddressPrefix '10.0.0.0/16' -Subnet $subnet
    # Place the subnet ID into a variable.
    $subnetId = (Get-AzVirtualNetworkSubnetConfig -Name 'RouteServerSubnet' -VirtualNetwork $vnet).Id
    ```

1. To ensure connectivity to the backend service that manages Route Server configuration, assigning a public IP address is required. Create a Standard Public IP named **RouteServerIP** using [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) cmdlet.

    ```azurepowershell-interactive
    # Create a Standard public IP and place it into a variable.
    $publicIp = New-AzPublicIpAddress -ResourceGroupName 'myResourceGroup' -Name 'myRouteServerIP' -Location 'EastUS' -AllocationMethod 'Static' -Sku 'Standard' -IpAddressVersion 'Ipv4'
    ```

1. Create the route server using [New-AzRouteServer](/powershell/module/az.network/new-azrouteserver) cmdlet. The following example creates a route server named **myRouteServer** in the **EastUS** region. The *HostedSubnet* is the resource ID of the RouteServerSubnet created in the previous steps.

    ```azurepowershell-interactive
    # Create the route server.
    New-AzRouteServer -RouteServerName 'myRouteServer' -ResourceGroupName 'myResourceGroup' -Location 'EastUS' -HostedSubnet $subnetId -PublicIP $publicIp
    ```

    [!INCLUDE [Deployment note](../../includes/route-server-note-creation-time.md)]

## Set up peering with NVA

In this section, you learn how to configure BGP peering with a network virtual appliance (NVA). Use [Add-AzRouteServerPeer](/powershell/module/az.network/add-azrouteserverpeer) cmdlet to establish BGP peering from the route server to your NVA. The following example adds a peer named **myNVA** that has an IP address of **10.0.0.4** and an ASN of **65001**. For more information, see [What Autonomous System Numbers (ASNs) can I use?](route-server-faq.md#what-autonomous-system-numbers-asns-can-i-use)

```azurepowershell-interactive
# Add a peer.
Add-AzRouteServerPeer -ResourceGroupName 'myResourceGroup' -RouteServerName 'myRouteServer' -PeerName 'myNVA' -PeerAsn '65001' -PeerIp '10.0.0.4'
```
> [!NOTE]
> The peer name doesn't have to be the same name of the NVA.

## Complete the configuration on the NVA

To complete the peering setup, you must configure the NVA to establish a BGP session with the route server's peer IPs and ASN. Use [Get-AzRouteServer](/powershell/module/az.network/get-azrouteserver) cmdlet to get the IP and ASN of the route server.

```azurepowershell-interactive
# Get the route server details.
Get-AzRouteServer -ResourceGroupName 'myResourceGroup' -RouteServerName 'myRouteServer'
```

The output should look similar to the following example:

```output
ResourceGroupName Name          Location RouteServerAsn RouteServerIps       ProvisioningState HubRoutingPreference AllowBranchToBranchTraffic
----------------- ----          -------- -------------- --------------       ----------------- -------------------- --------------------------
myResourceGroup     myRouteServer eastus   65515          {10.0.1.4, 10.0.1.5} Succeeded         ExpressRoute         False
```

[!INCLUDE [NVA peering note](../../includes/route-server-note-nva-peering.md)]

## Clean up resources

When no longer needed, delete the resource group and all of the resources it contains using [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) cmdlet.

```azurepowershell-interactive
# Delete the resource group and all the resources it contains. 
Remove-AzResourceGroup -Name 'myResourceGroup' -Force
```

## Next step

> [!div class="nextstepaction"]
> [Configure peering between a route server and NVA](peer-route-server-with-virtual-appliance.md)
