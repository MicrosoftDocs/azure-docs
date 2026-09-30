---
title: include file
description: include file
services: virtual-network
author: asudbring
ms.service: azure-virtual-network
ms.topic: include
ms.date: 03/26/2026
ms.author: allensu
ms.custom: include file
---

## Create a virtual network

1. Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to create a virtual network named **\<virtual-network\>** with IP address prefix **10.0.0.0/16** in the **\<resource-group\>** resource group and **\<region\>** location:

    ```azurepowershell-interactive
    # Variable declarations
    $virtualNetworkName = 'vnet-1'       # <virtual-network>
    $resourceGroupName = 'test-rg'       # <resource-group>
    $location = 'eastus2'                # <region>

    $vnet = @{
        Name = $virtualNetworkName
        ResourceGroupName = $resourceGroupName
        Location = $location
        AddressPrefix = '10.0.0.0/16'
    }
    $virtualNetwork = New-AzVirtualNetwork @vnet
   ```

1. Azure deploys resources to a subnet within a virtual network. Use [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig) to create a subnet configuration named **\<subnet\>** with address prefix **10.0.0.0/24**:

    ```azurepowershell-interactive
    # Variable declarations
    $subnetName = 'subnet-1'             # <subnet>

    $subnet = @{
        Name = $subnetName
        VirtualNetwork = $virtualNetwork
        AddressPrefix = '10.0.0.0/24'
    }
    $subnetConfig = Add-AzVirtualNetworkSubnetConfig @subnet
    ```

1. Associate the subnet configuration to the virtual network by using [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork):

    ```azurepowershell-interactive
    $virtualNetwork | Set-AzVirtualNetwork
    ```
